"use client";
import { useState, useRef, useEffect } from "react";
import {
  useGetBanners,
  useCreateBanner,
  usePatchBanner,
  useDeleteBanner,
  useGetDashboardSettings,
  usePatchDashboardSettings,
  useGetDashboardGovernorates,
  usePatchGovernorate,
  usePostGovernorate,
} from "@/hooks/useDashboard";
import { Banner, ErrorResponse } from "@/type/type";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { RefreshCw, AlertCircle } from "lucide-react";

// ─── Image Size Limit ─────────────────────────────────────────────────────────
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// ─── Notify helper ────────────────────────────────────────────────────────────
const notify = (msg: string, type: "success" | "error" = "success") =>
  toast({
    title: msg,
    variant: type === "error" ? "destructive" : "default",
  });

// ─── Shared Sub-components ────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        checked ? "bg-gradient-to-r from-[#fda481] to-[#b4182d]" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`text-sm font-semibold rounded-full px-3 py-1 whitespace-nowrap ${
        active
          ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white"
          : "bg-white/5 text-gray-500"
      }`}
    >
      {active ? "مفعل" : "غير مفعل"}
    </span>
  );
}

const inputClass =
  "w-full h-10 rounded-xl border border-white/10 bg-[#0f1117] px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition";

const fileInputClass =
  "text-sm text-gray-400 file:ml-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-[#fda481] file:to-[#b4182d] file:text-white hover:file:opacity-90 cursor-pointer";

type Tab = "banners" | "governorates" | "settings";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BannersSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("banners");

  return (
    <div dir="rtl" className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          البانرات والإعدادات
        </h1>
        <p className="text-gray-400 text-sm">
          إدارة البانرات والمحافظات وإعدادات الموقع
        </p>
      </div>

      <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden max-w-[860px]">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 pt-4 px-2">
          {(
            [
              { key: "banners", label: "البانرات" },
              { key: "governorates", label: "المحافظات" },
              { key: "settings", label: "الإعدادات" },
            ] as { key: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-[16px] font-semibold rounded-t-md transition-colors -mb-px border-b-2 ${
                activeTab === tab.key
                  ? "border-white text-white bg-transparent"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "banners" ? (
            <BannersTab />
          ) : activeTab === "governorates" ? (
            <GovernoratesTab />
          ) : (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Banners Tab ──────────────────────────────────────────────────────────────
function BannersTab() {
  const { data: banners, isLoading, isError } = useGetBanners();
  const { mutate: createBanner, isPending: creating } = useCreateBanner();
  const { mutate: patchBanner, isPending: patching } = usePatchBanner();
  const { mutate: deleteBanner, isPending: deleting } = useDeleteBanner();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editFields, setEditFields] = useState({
    title_en: "",
    title_ar: "",
    link: "",
    order: 1,
    is_active: true,
  });

  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newOrder, setNewOrder] = useState(1);
  const [newIsActive, setNewIsActive] = useState(true);

  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(
    null,
  );
  const desktopFileInputRef = useRef<HTMLInputElement>(null);

  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const [editDesktopImage, setEditDesktopImage] = useState<File | null>(null);
  const [editDesktopPreview, setEditDesktopPreview] = useState<string | null>(
    null,
  );
  const editDesktopFileInputRef = useRef<HTMLInputElement>(null);

  const [editMobileImage, setEditMobileImage] = useState<File | null>(null);
  const [editMobilePreview, setEditMobilePreview] = useState<string | null>(
    null,
  );
  const editMobileFileInputRef = useRef<HTMLInputElement>(null);

  const validateImageSize = (file: File): boolean => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      notify(
        `حجم الصورة يجب أن يكون أقل من ${MAX_IMAGE_SIZE_MB} ميجا`,
        "error",
      );
      return false;
    }
    return true;
  };

  const handleDesktopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !validateImageSize(file)) {
      if (desktopFileInputRef.current) desktopFileInputRef.current.value = "";
      return;
    }
    setDesktopImage(file);
    setDesktopPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !validateImageSize(file)) {
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
      return;
    }
    setMobileImage(file);
    setMobilePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const resetCreateForm = () => {
    setNewTitleEn("");
    setNewTitleAr("");
    setNewLink("");
    setNewOrder(1);
    setNewIsActive(true);
    setDesktopImage(null);
    setDesktopPreviewUrl(null);
    setMobileImage(null);
    setMobilePreviewUrl(null);
    if (desktopFileInputRef.current) desktopFileInputRef.current.value = "";
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
    setShowCreateForm(false);
  };

  const handleCreate = () => {
    if (!desktopImage || !mobileImage) return;
    const fd = new FormData();
    fd.append("title_en", newTitleEn);
    fd.append("title_ar", newTitleAr);
    fd.append("link", newLink);
    fd.append("order", String(newOrder));
    fd.append("is_active", String(newIsActive));
    fd.append("desktop_image", desktopImage);
    fd.append("mobile_image", mobileImage);
    createBanner(fd, {
      onSuccess: () => {
        notify("تم إنشاء البانر بنجاح");
        resetCreateForm();
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        notify(error?.response?.data?.message || "فشل الإنشاء", "error"),
    });
  };

  const handleEditOpen = (banner: Banner) => {
    setEditingId(banner.id);
    setEditFields({
      title_en: banner.title_en,
      title_ar: banner.title_ar,
      link: banner.link,
      order: banner.order,
      is_active: banner.is_active,
    });
    setEditDesktopImage(null);
    setEditDesktopPreview(null);
    setEditMobileImage(null);
    setEditMobilePreview(null);
    if (editDesktopFileInputRef.current)
      editDesktopFileInputRef.current.value = "";
    if (editMobileFileInputRef.current)
      editMobileFileInputRef.current.value = "";
  };

  const handleEditSave = (id: number) => {
    const fd = new FormData();
    fd.append("title_en", editFields.title_en);
    fd.append("title_ar", editFields.title_ar);
    fd.append("link", editFields.link);
    fd.append("order", String(editFields.order));
    fd.append("is_active", String(editFields.is_active));
    if (editDesktopImage) fd.append("desktop_image", editDesktopImage);
    if (editMobileImage) fd.append("mobile_image", editMobileImage);

    patchBanner(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id, body: fd as any },
      {
        onSuccess: () => {
          notify("تم التحديث بنجاح");
          setEditingId(null);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          notify(error?.response?.data?.message || "فشل التحديث", "error"),
      },
    );
  };

  const handleToggleActive = (banner: Banner) => {
    patchBanner(
      { id: banner.id, body: { is_active: !banner.is_active } },
      {
        onSuccess: () => notify("تم التحديث"),
        onError: (error: AxiosError<ErrorResponse>) =>
          notify(error?.response?.data?.message || "فشل التحديث", "error"),
      },
    );
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteBanner(id, {
      onSuccess: () => {
        notify("تم الحذف");
        setDeletingId(null);
        setExpandedId(null);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        notify(error?.response?.data?.message || "فشل الحذف", "error");
        setDeletingId(null);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-start mb-5">
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="text-sm font-bold px-6 py-2.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span> إضافة بانر
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-5 p-5 border border-white/10 rounded-2xl bg-[#0f1117]">
          <p className="text-sm font-bold text-gray-400 mb-4 uppercase">
            بانر جديد
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                العنوان (EN)
              </label>
              <input
                className={inputClass}
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder="Summer Sale"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                العنوان (AR)
              </label>
              <input
                className={inputClass}
                value={newTitleAr}
                onChange={(e) => setNewTitleAr(e.target.value)}
                placeholder="تخفيضات الصيف"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                الرابط
              </label>
              <input
                className={inputClass}
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com/sale"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                الترتيب
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={newOrder}
                onChange={(e) => setNewOrder(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <label className="text-sm text-gray-400 font-bold">مفعل</label>
              <Toggle
                checked={newIsActive}
                onChange={() => setNewIsActive((v) => !v)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                صورة الديسكتوب
                <span className="text-gray-600 font-normal text-xs mr-2">
                  (الحد الأقصى {MAX_IMAGE_SIZE_MB} ميجا)
                </span>
              </label>
              <input
                ref={desktopFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleDesktopImageChange}
                className={fileInputClass}
              />
              {desktopPreviewUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 w-full h-28">
                  <img
                    src={desktopPreviewUrl}
                    alt="desktop preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                صورة الموبايل
                <span className="text-gray-600 font-normal text-xs mr-2">
                  (الحد الأقصى {MAX_IMAGE_SIZE_MB} ميجا)
                </span>
              </label>
              <input
                ref={mobileFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMobileImageChange}
                className={fileInputClass}
              />
              {mobilePreviewUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 w-full h-28">
                  <img
                    src={mobilePreviewUrl}
                    alt="mobile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating || !desktopImage || !mobileImage}
              className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {creating ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              onClick={resetCreateForm}
              className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <p className="text-sm">جاري التحميل...</p>
        </div>
      )}
      {isError && (
        <p className="text-sm text-red-400 font-medium">حدث خطأ في التحميل</p>
      )}
      {!isLoading && banners?.length === 0 && (
        <p className="text-sm text-gray-500 italic">لا توجد بانرات</p>
      )}

      <div className="flex flex-col gap-2.5">
        {banners?.map((banner: Banner) => {
          const isExpanded = expandedId === banner.id;
          const isEditing = editingId === banner.id;
          return (
            <div
              key={banner.id}
              className="border border-white/10 rounded-2xl overflow-hidden"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : banner.id)}
                className="flex items-center gap-3 p-4 bg-[#0f1117] cursor-pointer hover:bg-white/5 transition-colors flex-wrap"
              >
                <div className="w-14 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                  {banner.desktop_img_url ? (
                    <img
                      src={banner.desktop_img_url}
                      alt={banner.title_en}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      IMG
                    </div>
                  )}
                </div>

                <span className="text-sm text-gray-600 shrink-0 min-w-[24px] font-mono">
                  #{banner.order}
                </span>

                <div className="flex-1 min-w-[100px]">
                  <p className="text-sm font-bold text-white leading-tight">
                    {banner.title_en || "—"}
                  </p>
                  {banner.title_ar && (
                    <p
                      className="text-xs text-white/70 leading-tight mt-0.5"
                      dir="rtl"
                    >
                      {banner.title_ar}
                    </p>
                  )}
                  {banner.link && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
                      {banner.link}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <StatusBadge active={banner.is_active} />
                </div>

                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <Toggle
                    checked={banner.is_active}
                    onChange={() => handleToggleActive(banner)}
                    disabled={patching}
                  />
                </div>

                <span
                  className={`text-xs text-gray-600 shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div className="bg-[#1a1d29] border-t border-white/10 p-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            العنوان (EN)
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.title_en}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                title_en: e.target.value,
                              }))
                            }
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            العنوان (AR)
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.title_ar}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                title_ar: e.target.value,
                              }))
                            }
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            الرابط
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.link}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                link: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            الترتيب
                          </label>
                          <input
                            type="number"
                            min={1}
                            className={inputClass}
                            value={editFields.order}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                order: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-end gap-3 pb-1">
                          <label className="text-sm text-gray-400 font-bold">
                            مفعل
                          </label>
                          <Toggle
                            checked={editFields.is_active}
                            onChange={() =>
                              setEditFields((f) => ({
                                ...f,
                                is_active: !f.is_active,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            صورة الديسكتوب{" "}
                            <span className="text-gray-600 font-normal text-xs">
                              (اختياري — حد أقصى {MAX_IMAGE_SIZE_MB} ميجا)
                            </span>
                          </label>
                          <div className="mb-3 rounded-xl overflow-hidden border border-white/10 w-full h-28 bg-white/5">
                            {editDesktopPreview ? (
                              <img
                                src={editDesktopPreview}
                                alt="desktop preview"
                                className="w-full h-full object-cover"
                              />
                            ) : banner.desktop_img_url ? (
                              <img
                                src={banner.desktop_img_url}
                                alt="current desktop"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                لا توجد صورة
                              </div>
                            )}
                          </div>
                          <input
                            ref={editDesktopFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              if (file && !validateImageSize(file)) {
                                if (editDesktopFileInputRef.current)
                                  editDesktopFileInputRef.current.value = "";
                                return;
                              }
                              setEditDesktopImage(file);
                              setEditDesktopPreview(
                                file ? URL.createObjectURL(file) : null,
                              );
                            }}
                            className={fileInputClass}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            صورة الموبايل{" "}
                            <span className="text-gray-600 font-normal text-xs">
                              (اختياري — حد أقصى {MAX_IMAGE_SIZE_MB} ميجا)
                            </span>
                          </label>
                          <div className="mb-3 rounded-xl overflow-hidden border border-white/10 w-full h-28 bg-white/5">
                            {editMobilePreview ? (
                              <img
                                src={editMobilePreview}
                                alt="mobile preview"
                                className="w-full h-full object-cover"
                              />
                            ) : banner.mobile_img_url ? (
                              <img
                                src={banner.mobile_img_url}
                                alt="current mobile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                لا توجد صورة
                              </div>
                            )}
                          </div>
                          <input
                            ref={editMobileFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              if (file && !validateImageSize(file)) {
                                if (editMobileFileInputRef.current)
                                  editMobileFileInputRef.current.value = "";
                                return;
                              }
                              setEditMobileImage(file);
                              setEditMobilePreview(
                                file ? URL.createObjectURL(file) : null,
                              );
                            }}
                            className={fileInputClass}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                        <button
                          onClick={() => handleEditSave(banner.id)}
                          disabled={patching}
                          className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                        >
                          {patching ? "جاري الحفظ..." : "حفظ"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(banner);
                        }}
                        className="text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <span>✏</span> تعديل
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("هل أنت متأكد من الحذف؟"))
                            handleDelete(banner.id);
                        }}
                        disabled={deleting && deletingId === banner.id}
                        className="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <span>🗑</span>{" "}
                        {deleting && deletingId === banner.id
                          ? "جاري الحذف..."
                          : "حذف"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Governorates Tab ─────────────────────────────────────────────────────────
function GovernoratesTab() {
  const { data, isLoading, isError } = useGetDashboardGovernorates();
  const { mutate: patchGov, isPending: patching } = usePatchGovernorate();
  const { mutate: postGov, isPending: posting } = usePostGovernorate();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState({
    name_en: "",
    name_ar: "",
    shipping_fee: 0,
    is_active: true,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newFields, setNewFields] = useState({
    name_en: "",
    name_ar: "",
    shipping_fee: 0,
  });

  const govList = Array.isArray(data) ? data : [];

  const handleEditOpen = (gov: {
    id: number;
    name_en: string;
    name_ar: string;
    shipping_fee: number;
    is_active: boolean;
  }) => {
    setEditingId(gov.id);
    setEditFields({
      name_en: gov.name_en,
      name_ar: gov.name_ar,
      shipping_fee: gov.shipping_fee,
      is_active: gov.is_active,
    });
  };

  const handleEditSave = (id: number) => {
    patchGov(
      { id, body: editFields },
      {
        onSuccess: () => {
          notify("تم التحديث بنجاح");
          setEditingId(null);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          notify(error?.response?.data?.message || "حدث خطأ", "error"),
      },
    );
  };

  const handleCreate = () => {
    postGov(newFields, {
      onSuccess: () => {
        notify("تمت الإضافة بنجاح");
        setShowCreate(false);
        setNewFields({ name_en: "", name_ar: "", shipping_fee: 0 });
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        notify(error?.response?.data?.message || "حدث خطأ", "error"),
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-sm">جاري التحميل...</p>
      </div>
    );
  if (isError)
    return (
      <p className="text-sm text-red-400 font-medium">حدث خطأ في التحميل</p>
    );

  return (
    <div>
      <div className="flex justify-start mb-5">
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="text-sm font-bold px-6 py-2.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span> إضافة محافظة
        </button>
      </div>

      {showCreate && (
        <div className="mb-5 p-5 border border-white/10 rounded-2xl bg-[#0f1117]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                الاسم (EN)
              </label>
              <input
                className={inputClass}
                value={newFields.name_en}
                onChange={(e) =>
                  setNewFields((f) => ({ ...f, name_en: e.target.value }))
                }
                placeholder="Cairo"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                الاسم (AR)
              </label>
              <input
                className={inputClass}
                value={newFields.name_ar}
                onChange={(e) =>
                  setNewFields((f) => ({ ...f, name_ar: e.target.value }))
                }
                placeholder="القاهرة"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                رسوم الشحن (EGP)
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={newFields.shipping_fee}
                onChange={(e) =>
                  setNewFields((f) => ({
                    ...f,
                    shipping_fee: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={posting}
              className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50"
            >
              {posting ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {govList.map(
          (gov: {
            id: number;
            name_en: string;
            name_ar: string;
            shipping_fee: number;
            is_active: boolean;
          }) => (
            <div
              key={gov.id}
              className="border border-white/10 rounded-2xl overflow-hidden"
            >
              {editingId === gov.id ? (
                <div className="p-5 bg-[#0f1117]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                        الاسم (EN)
                      </label>
                      <input
                        className={inputClass}
                        value={editFields.name_en}
                        onChange={(e) =>
                          setEditFields((f) => ({
                            ...f,
                            name_en: e.target.value,
                          }))
                        }
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                        الاسم (AR)
                      </label>
                      <input
                        className={inputClass}
                        value={editFields.name_ar}
                        onChange={(e) =>
                          setEditFields((f) => ({
                            ...f,
                            name_ar: e.target.value,
                          }))
                        }
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                        رسوم الشحن (EGP)
                      </label>
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={editFields.shipping_fee}
                        onChange={(e) =>
                          setEditFields((f) => ({
                            ...f,
                            shipping_fee: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm text-gray-400 font-bold">
                      مفعل
                    </label>
                    <Toggle
                      checked={editFields.is_active}
                      onChange={() =>
                        setEditFields((f) => ({
                          ...f,
                          is_active: !f.is_active,
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(gov.id)}
                      disabled={patching}
                      className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      {patching ? "جاري الحفظ..." : "حفظ"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-[#0f1117] flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">
                      {gov.name_ar}
                    </p>
                    <p className="text-xs text-gray-500">{gov.name_en}</p>
                  </div>
                  <span className="text-sm font-bold text-[#c9a84c]">
                    EGP {gov.shipping_fee}
                  </span>
                  <StatusBadge active={gov.is_active} />
                  <button
                    onClick={() => handleEditOpen(gov)}
                    className="text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
                  >
                    ✏ تعديل
                  </button>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { data, isLoading, isError } = useGetDashboardSettings();
  const { mutate: patchSettings, isPending: patching } =
    usePatchDashboardSettings();

  const [announcementTextEn, setAnnouncementTextEn] = useState("");
  const [announcementTextAr, setAnnouncementTextAr] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setAnnouncementTextEn(data.announcement_text_en ?? "");
      setAnnouncementTextAr(data.announcement_text_ar ?? "");
      setAnnouncementLink(data.announcement_link ?? "");
      setIsAnnouncementActive(data.is_announcement_active ?? false);
      setIsDirty(false);
    }
  }, [data]);

  const handleSave = () => {
    patchSettings(
      {
        announcement_text_en: announcementTextEn,
        announcement_text_ar: announcementTextAr,
        announcement_link: announcementLink,
        is_announcement_active: isAnnouncementActive,
      },
      {
        onSuccess: () => {
          notify("تم الحفظ بنجاح");
          setIsDirty(false);
        },
        onError: (e: AxiosError<ErrorResponse>) =>
          notify(e?.response?.data?.detail || "فشل التحديث", "error"),
      },
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-sm">جاري التحميل...</p>
      </div>
    );
  if (isError)
    return (
      <p className="text-sm text-red-400 font-medium">حدث خطأ في التحميل</p>
    );

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f1117] border-b border-white/10">
          <p className="text-sm font-bold text-gray-400 uppercase">
            شريط الإعلان
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {isAnnouncementActive ? "مفعل" : "غير مفعل"}
            </span>
            <Toggle
              checked={isAnnouncementActive}
              onChange={() => {
                setIsAnnouncementActive((v) => !v);
                setIsDirty(true);
              }}
              disabled={patching}
            />
          </div>
        </div>

        <div
          className={`px-5 py-3 text-sm font-medium text-center transition-colors ${
            isAnnouncementActive
              ? "bg-gradient-to-r from-white/10 to-black/10 text-white border-b border-white/10"
              : "bg-white/5 text-gray-600 line-through border-b border-white/5"
          }`}
        >
          {announcementTextEn || "نص الإعلان للمعاينة"}
          {announcementTextAr && <span className="mx-2 opacity-50">|</span>}
          {announcementTextAr && <span dir="rtl">{announcementTextAr}</span>}
          {announcementLink && isAnnouncementActive && (
            <span className="mr-2 underline opacity-60 text-sm">رابط</span>
          )}
        </div>

        <div className="bg-[#1a1d29] p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                نص الإعلان (EN)
              </label>
              <input
                className={inputClass}
                value={announcementTextEn}
                onChange={(e) => {
                  setAnnouncementTextEn(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Free shipping over 500 EGP"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                نص الإعلان (AR)
              </label>
              <input
                className={inputClass}
                value={announcementTextAr}
                onChange={(e) => {
                  setAnnouncementTextAr(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="نص الإعلان بالعربي"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block font-bold">
              رابط الإعلان{" "}
              <span className="text-gray-600 font-normal text-sm">
                (اختياري)
              </span>
            </label>
            <input
              className={inputClass}
              value={announcementLink}
              onChange={(e) => {
                setAnnouncementLink(e.target.value);
                setIsDirty(true);
              }}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={patching || !isDirty}
          className="h-10 px-8 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {patching ? (
            <>
              <RefreshCw className="animate-spin w-4 h-4" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ التغييرات"
          )}
        </button>
        {isDirty && !patching && (
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">تغييرات غير محفوظة</span>
          </div>
        )}
      </div>
    </div>
  );
}
