/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { GalleryImage, Variant } from "@/type/type";
import { useProductPage } from "@/hooks/useProductPage";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import AdminCategoryDropdown, { ConfirmDelete, ImgGallery, Spinner, VRow } from "./ComponetsProductsPage";
import { Btn, Select } from "./Adminui";

/* ══════════════════════════════════════════════════════════
   Shared input style
   ══════════════════════════════════════════════════════════ */
const INPUT_CLS =
  "w-full bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2 text-[16px] text-white " +
  "placeholder:text-gray-600 focus:ring-2 focus:ring-[#fff]/20 focus:border-[#fff]/50 " +
  "transition-all outline-none";

/* ══════════════════════════════════════════════════════════
   DualInput
   ══════════════════════════════════════════════════════════ */
function DualInput({
  label,
  labelAr = "بالعربي",
  placeholderEn = "",
  placeholderAr = "",
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  type = "text",
}: {
  label: string;
  labelAr?: string;
  placeholderEn?: string;
  placeholderAr?: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAr: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1 mb-1">
      <label className="text-[16px] text-gray-400 font-medium">{label}</label>
      <input
        type={type}
        value={valueEn}
        onChange={onChangeEn}
        placeholder={placeholderEn}
        className={INPUT_CLS}
        dir="ltr"
      />
      <label className="text-[16px] text-gray-500 font-medium mt-0.5">
        {labelAr}
      </label>
      <input
        type={type}
        value={valueAr}
        onChange={onChangeAr}
        placeholder={placeholderAr}
        className={`${INPUT_CLS} text-right`}
        dir="rtl"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DualTextarea
   ══════════════════════════════════════════════════════════ */
function DualTextarea({
  label,
  labelAr = "بالعربي",
  placeholderEn = "",
  placeholderAr = "",
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
}: {
  label: string;
  labelAr?: string;
  placeholderEn?: string;
  placeholderAr?: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeAr: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const TA = INPUT_CLS + " resize-none min-h-[80px]";

  return (
    <div className="flex flex-col gap-1 mb-1">
      <label className="text-[16px] text-gray-400 font-medium">{label}</label>
      <textarea
        value={valueEn}
        onChange={onChangeEn}
        placeholder={placeholderEn}
        className={TA}
        dir="ltr"
      />
      <label className="text-[16px] text-gray-500 font-medium mt-0.5">
        {labelAr}
      </label>
      <textarea
        value={valueAr}
        onChange={onChangeAr}
        placeholder={placeholderAr}
        className={`${TA} text-right`}
        dir="rtl"
      />
    </div>
  );
}

/* ─── Modal ─── */
function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  isArabic,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
  isArabic?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className={`bg-[#1a1d29] border border-white/10 rounded-2xl flex flex-col relative animate-modal-in ${wide ? "w-full max-w-2xl" : "w-full max-w-lg"}`}
        style={{ maxHeight: "90vh", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-[16px] font-semibold text-white">
            {title ?? ""}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-gray-400 hover:text-white text-lg leading-none cursor-pointer border-none flex-shrink-0"
          >
            <X />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ─── StepBar ─── */
function StepBar({
  step,
  labels,
  isArabic,
}: {
  step: 1 | 2;
  labels: { productInfo: string; variants: string };
  isArabic?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1 mb-6 p-1 bg-[#0f1117] rounded-xl border border-white/10"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {[
        { n: 1, label: labels.productInfo },
        { n: 2, label: labels.variants },
      ].map(({ n, label }) => (
        <div
          key={n}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${step === n ? "bg-[#1a1d29] shadow-sm" : ""}`}
        >
          <span
            className={`w-5 h-5 rounded-full text-[16px] font-semibold flex items-center justify-center flex-shrink-0 ${step > n ? "bg-emerald-500 text-white" : step === n ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white" : "bg-white/10 text-gray-500"}`}
          >
            {step > n ? "✓" : n}
          </span>
          <span
            className={`text-[16px] font-medium ${step === n ? "text-white" : "text-gray-500"}`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── StatusBadge ─── */
function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
  isArabic,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  isArabic?: boolean;
}) {
  return (
    <div
      className={`inline-flex mb-2 items-center gap-1.5 text-[16px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${isArabic ? "flex-row-reverse" : ""} ${active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-400 border border-white/10"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-emerald-500" : "bg-gray-500"}`}
      />
      {active ? activeLabel : inactiveLabel}
    </div>
  );
}

/* ─── ProductCard ─── */
function ProductCard({
  product,
  onEdit,
  onDelete,
  onAddVariant,
  onEditVariant,
  labels,
  isArabic,
}: {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
  onAddVariant: () => void;
  onEditVariant: () => void;
  labels: {
    edit: string;
    addVariant: string;
    editVariant: string;
    delete: string;
    active: string;
    inactive: string;
  };
  isArabic: boolean;
}) {
  const variants: Variant[] = product.variants ?? [];
  const allImages = variants.flatMap((v) => normalizeImages(v.images));
  const thumb = allImages.find((i) => i.is_thumbnail) ?? allImages[0];

  const displayName =
    isArabic && product.name_ar ? product.name_ar : product.name;
  const displayCategory =
    isArabic && product.category_name_ar
      ? product.category_name_ar
      : product.category_name || (product.category as any)?.name || "—";
  const displayFragrance =
    isArabic && product.fragrance_family_ar
      ? product.fragrance_family_ar
      : product.fragrance_family;

  return (
    <div
      className="bg-[#1a1d29] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[#0f1117] border border-white/10">
            {thumb || product.thumbnail ? (
              <img
                src={product.thumbnail || thumb.url}
                alt={product.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700 text-2xl">
                ◻
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <StatusBadge
              active={product.is_active !== false}
              activeLabel={labels.active}
              inactiveLabel={labels.inactive}
              isArabic={isArabic}
            />
            <p className="text-[16px] font-semibold text-white leading-snug truncate mb-0.5">
              {displayName}
            </p>
            <p className="text-[16px] text-gray-500">{displayCategory}</p>
            {displayFragrance && (
              <p className="text-[16px] text-gray-500 mt-0.5">
                {displayFragrance}
              </p>
            )}
          </div>
        </div>
        {variants.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {variants.map((v) => {
              const imgs = normalizeImages(v.images);
              const vThumb = imgs.find((i) => i.is_thumbnail) ?? imgs[0];
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-1.5"
                >
                  {vThumb && (
                    <img
                      src={vThumb.url || String(vThumb)}
                      alt={"variant image"}
                      width={20}
                      height={20}
                      loading="lazy"
                      className="w-5 h-5 rounded object-cover"
                    />
                  )}
                  <span className="text-[16px] font-medium text-gray-300">
                    {v.volume}
                  </span>
                  <span className="text-[16px] text-gray-500">
                    LE {parseFloat(v.price).toLocaleString()}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${v.is_active !== false ? "bg-emerald-500" : "bg-gray-500"}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-white/10 bg-[#0f1117] px-4 py-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={onEdit}
          className="text-[13px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          {labels.edit}
        </button>
        <button
          onClick={onAddVariant}
          className="text-[13px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          {labels.addVariant}
        </button>
        <button
          onClick={onEditVariant}
          className="text-[13px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          {labels.editVariant}
        </button>
        <button
          onClick={onDelete}
          className={`${isArabic ? "mr-auto" : "ml-auto"} text-[13px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 hover:bg-red-500/20 transition-colors cursor-pointer`}
        >
          {labels.delete}
        </button>
      </div>
    </div>
  );
}

export function normalizeImages(raw: unknown): GalleryImage[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item: any, idx: number) => {
      if (typeof item === "string")
        return { id: idx, url: item, is_thumbnail: idx === 0 };
      return {
        id: item.id ?? idx,
        url: item.url ?? item,
        is_thumbnail: item.is_thumbnail ?? false,
      };
    });
  }
  return [];
}

/* ══════════════════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    catOptions,
    productsData,
    loadingProducts,
    cf,
    sc,
    setCfCategories,
    cvars,
    setCVars,
    cStep,
    addCImgs,
    removeCImg,
    setCThumb,
    handleCreate,
    confirmDeletePid,
    setConfirmDeletePid,
    deletingProd,
    handleDeleteProduct,
    pid,
    setPid,
    ef,
    se,
    setEfCategories,
    eStep,
    singleProduct,
    loadingSingle,
    handleEdit,
    varPid,
    setVarPid,
    varProduct,
    loadingVarProduct,
    avars,
    setAvars,
    avStep,
    addAImgs,
    removeAImg,
    setAThumb,
    handleAddVariant,
    newlyCreatedVids,
    setNewlyCreatedVids,
    refreshVariantProduct,
    selectedVid,
    setSelectedVid,
    evf,
    setEvf,
    evStep,
    confirmDeleteVid,
    setConfirmDeleteVid,
    deletingVariant,
    handleEditVariant,
    handleDeleteVariant,
    showNotification,
    setCf,
    setEf,
  } = useProductPage({
    page,
    search: debouncedSearch,
    category: selectedCategories.join(",") || undefined,
  });

  // خطوات الإنشاء
  const C_STEP_LBL: Record<string, string> = {
    idle: "إنشاء المنتج",
    creating: "جارٍ الإنشاء...",
    variants: "جارٍ إضافة المتغيرات...",
    images: "جارٍ رفع الصور...",
    done: "تم!",
  };

  // خطوات التعديل
  const E_STEP_LBL: Record<string, string> = {
    idle: "حفظ التعديلات",
    updating: "جارٍ التحديث...",
    images: "جارٍ رفع الصور...",
    done: "تم!",
  };

  // خطوات إضافة متغير
  const AV_STEP_LBL: Record<string, string> = {
    idle: "إضافة المتغيرات",
    adding: "جارٍ الإضافة...",
    images: "جارٍ رفع الصور...",
    done: "تم!",
  };

  // خطوات تعديل متغير
  const EV_STEP_LBL: Record<string, string> = {
    idle: "حفظ المتغير",
    updating: "جارٍ التحديث...",
    done: "تم!",
  };

  const isCBusy = cStep !== "idle" && cStep !== "done";
  const isEBusy = eStep !== "idle" && eStep !== "done";
  const isAvBusy = avStep !== "idle" && avStep !== "done";
  const isEvBusy = evStep !== "idle" && evStep !== "done";
  const selectedVariant = varProduct?.variants?.find(
    (v: Variant) => v.id === selectedVid,
  );

  const products = productsData?.products ?? [];
  const nextPage = productsData?.next ?? null;
  const prevPage = productsData?.previous ?? null;

  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [showEditVariant, setShowEditVariant] = useState(false);

  useEffect(() => {
    if (cStep === "done") {
      setShowCreate(false);
      setCreateStep(1);
    }
  }, [cStep]);
  useEffect(() => {
    if (eStep === "done") setShowEdit(false);
  }, [eStep]);
  useEffect(() => {
    if (avStep === "done") setShowAddVariant(false);
  }, [avStep]);
  useEffect(() => {
    if (evStep === "done") {
      setShowEditVariant(false);
      setSelectedVid(null);
    }
  }, [evStep]);

  const openEdit = (id: number) => {
    setPid(id);
    setShowEdit(true);
  };
  const openAddVariant = (id: number) => {
    setVarPid(id);
    setNewlyCreatedVids([]);
    setShowAddVariant(true);
  };
  const openEditVariant = (id: number) => {
    setVarPid(id);
    setSelectedVid(null);
    setShowEditVariant(true);
  };
  const openDeleteConfirm = (id: number) => setConfirmDeletePid(id);

  const handleCreateStep1 = () => {
    if (!cf.name_en || !cf.name_ar || !cf.categories.length) {
      toast({ title: "الاسم والفئة مطلوبان", variant: "destructive" });
      return;
    }
    setCreateStep(2);
  };

  const cardLabels = {
    edit: "تعديل",
    addVariant: "إضافة متغير",
    editVariant: "تعديل متغير",
    delete: "حذف",
    active: "مفعل",
    inactive: "غير مفعل",
  };

  const isArabic = true;

  const ActRow = ({ children }: { children: React.ReactNode }) => (
    <div
      className={`flex gap-2 mt-6 ${isArabic ? "justify-start flex-row-reverse" : "justify-end"}`}
    >
      {children}
    </div>
  );

  const CancelBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-[16px] font-medium text-gray-400 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none"
    >
      إلغاء
    </button>
  );

  return (
    <div dir="rtl">
      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <AdminCategoryDropdown
            categories={catOptions}
            selectedCategories={selectedCategories}
            onSelect={(cats) => {
              setSelectedCategories(cats);
              setPage(1);
            }}
            isArabic={isArabic}
          />
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-10 pl-4 text-right py-2.5 bg-[#1a1d29] border border-white/10 rounded-xl text-[16px] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#fff]/20 focus:border-[#fff]/50 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 left-3 flex items-center text-gray-500 hover:text-gray-300"
              >
                <X />
              </button>
            )}
          </div>
          <p className="text-[16px] text-gray-500 font-medium whitespace-nowrap hidden sm:block">
            {productsData?.count ?? products.length} منتج
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreate(true);
            setCreateStep(1);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[16px] font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#fff]/20 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none"
        >
          <span className="text-[18px] leading-none">+</span>
          إنشاء منتج
        </button>
      </div>

      {/* ── Grid ── */}
      {loadingProducts ? (
        <div className="flex items-center justify-center gap-2 text-[16px] text-gray-500 py-16">
          <span className="w-4 h-4 rounded-full border-2 border-[#fff] border-t-transparent animate-spin" />
          جارٍ التحميل...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1d29] border border-white/10 flex items-center justify-center text-gray-700 text-2xl mb-3">
            ◻
          </div>
          <p className="text-[15px] text-gray-400 font-medium">
            لا توجد منتجات
          </p>
          <p className="text-[16px] text-gray-600 mt-1">ابدأ بإنشاء أول منتج</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px]">
            {products.map((prod: any) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onEdit={() => openEdit(prod.id)}
                onDelete={() => openDeleteConfirm(prod.id)}
                onAddVariant={() => openAddVariant(prod.id)}
                onEditVariant={() => openEditVariant(prod.id)}
                labels={cardLabels}
                isArabic={isArabic}
              />
            ))}
          </div>
          {(nextPage || prevPage || page > 1) && !debouncedSearch && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10 max-w-[1100px]">
              <button
                onClick={() => {
                  setPage((pg) => pg + 1);
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    100,
                  );
                }}
                disabled={!nextPage}
                className="text-[16px] flex items-center px-4 py-1.5 border border-white/10 rounded-xl bg-[#1a1d29] text-gray-400 hover:bg-white/5 disabled:opacity-40 transition-opacity cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                التالي
              </button>
              <span className="text-[16px] text-gray-500 font-medium">
                صفحة {page}
              </span>
              <button
                onClick={() => {
                  setPage((pg) => Math.max(1, pg - 1));
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    100,
                  );
                }}
                disabled={!prevPage}
                className="text-[16px] flex items-center px-4 py-1.5 border border-white/10 rounded-xl bg-[#1a1d29] text-gray-400 hover:bg-white/5 disabled:opacity-40 transition-opacity cursor-pointer"
              >
                السابق
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {confirmDeletePid !== null && (
        <Modal
          open
          onClose={() => setConfirmDeletePid(null)}
          title="تأكيد الحذف"
          isArabic={isArabic}
        >
          <ConfirmDelete
            label={`"${
              products.find((x: any) => x.id === confirmDeletePid)?.[
                isArabic ? "name_ar" : "name_en"
              ] ?? confirmDeletePid
            }"`}
            busy={deletingProd}
            onConfirm={() => handleDeleteProduct(confirmDeletePid)}
            onCancel={() => setConfirmDeletePid(null)}
          />
        </Modal>
      )}

      {/* ════ CREATE MODAL ════ */}
      <Modal
        open={showCreate}
        title={createStep === 1 ? "إنشاء منتج جديد" : "إضافة المتغيرات"}
        onClose={() => {
          setShowCreate(false);
          setCreateStep(1);
        }}
        wide
        isArabic={isArabic}
      >
        <StepBar
          step={createStep}
          labels={{
            productInfo: "بيانات المنتج",
            variants: "المتغيرات",
          }}
          isArabic={isArabic}
        />

        {createStep === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <DualInput
                label="الاسم بالإنجليزي"
                labelAr="الاسم بالعربي"
                placeholderEn="Perfume name"
                placeholderAr="اسم العطر"
                valueEn={cf.name_en}
                valueAr={cf.name_ar ?? ""}
                onChangeEn={sc("name_en")}
                onChangeAr={sc("name_ar")}
              />
              <DualInput
                label="العائلة العطرية بالإنجليزي"
                labelAr="العائلة العطرية بالعربي"
                placeholderEn="e.g. Woody"
                placeholderAr="مثال: خشبي"
                valueEn={cf.fragrance_family_en}
                valueAr={cf.fragrance_family_ar ?? ""}
                onChangeEn={sc("fragrance_family_en")}
                onChangeAr={sc("fragrance_family_ar")}
              />

              <div className="flex flex-col gap-1 mb-1">
                <label className="text-[16px] text-gray-400 font-medium">
                  الفئة
                </label>
                <Select
                  options={catOptions}
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !cf.categories.includes(val))
                      setCfCategories([...cf.categories, val]);
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {cf.categories.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[13px] text-white"
                    >
                      {catOptions.find((o) => o.value === cat)?.label ?? cat}
                      <button
                        onClick={() =>
                          setCfCategories(
                            cf.categories.filter((c) => c !== cat),
                          )
                        }
                        className="text-gray-400 text-[10px] hover:text-white leading-none"
                      >
                        <X />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DualTextarea
              label="الوصف بالإنجليزي"
              labelAr="الوصف بالعربي"
              placeholderEn="Brief description..."
              placeholderAr="وصف مختصر..."
              valueEn={cf.description_en}
              valueAr={cf.description_ar ?? ""}
              onChangeEn={sc("description_en")}
              onChangeAr={sc("description_ar")}
            />

            <div className="flex items-center gap-3 mt-2 mb-1">
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  setCf((f) => ({ ...f, is_bestseller: !f.is_bestseller }))
                }
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    cf.is_bestseller
                      ? "bg-gradient-to-br from-[#fda481] to-[#b4182d] border-transparent"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  {cf.is_bestseller && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  setCf((f) => ({ ...f, is_bestseller: !f.is_bestseller }))
                }
              >
                <p className="text-[16px] font-medium text-white">
                  الأكثر مبيعاً
                </p>
                <p className="text-[13px] text-gray-500">
                  سيظهر المنتج في قسم الأكثر مبيعاً
                </p>
              </div>
            </div>

            <ActRow>
              <CancelBtn onClick={() => setShowCreate(false)} />
              <button
                onClick={handleCreateStep1}
                className="text-[16px] font-bold bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center gap-1.5"
              >
                التالي
              </button>
            </ActRow>
          </>
        )}

        {createStep === 2 && (
          <>
            {cvars.map((v, i) => (
              <VRow
                key={i}
                v={v}
                onChangeVolume={(e) =>
                  setCVars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, volume: e.target.value } : x,
                    ),
                  )
                }
                onChangeColor={(e) =>
                  setCVars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, color: e.target.value } : x,
                    ),
                  )
                }
                onChangePrice={(e) =>
                  setCVars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, price: e.target.value } : x,
                    ),
                  )
                }
                onChangeCompare={(e) =>
                  setCVars((vs) =>
                    vs.map((x, idx) =>
                      idx === i
                        ? { ...x, compare_at_price: e.target.value }
                        : x,
                    ),
                  )
                }
                onChangeStock={(e) =>
                  setCVars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, stock: e.target.value } : x,
                    ),
                  )
                }
                onAddImgs={(files) => addCImgs(i, files)}
                onRemoveImg={(fi) => removeCImg(i, fi)}
                onSetThumb={(fi) => setCThumb(i, fi)}
                onRemove={
                  cvars.length > 1
                    ? () => setCVars((vs) => vs.filter((_, idx) => idx !== i))
                    : undefined
                }
              />
            ))}
            <button
              onClick={() =>
                setCVars((vs) => [
                  ...vs,
                  {
                    volume: "",
                    color: "",
                    price: "",
                    compare_at_price: "",
                    stock: "",
                    imageFiles: [],
                    imagePreviews: [],
                    thumbnailIndex: 0,
                  },
                ])
              }
              className="text-[16px] text-gray-500 border border-dashed border-white/10 rounded-xl px-4 py-2 bg-transparent cursor-pointer mb-4 hover:bg-white/5 hover:border-white/20 transition-colors w-full"
            >
              + إضافة متغير آخر
            </button>
            {isCBusy && <Spinner label={C_STEP_LBL[cStep]} />}
            <ActRow>
              <button
                onClick={() => setCreateStep(1)}
                className="text-[16px] font-medium text-gray-400 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none flex items-center gap-1.5"
              >
                رجوع
              </button>
              <Btn onClick={handleCreate} loading={isCBusy}>
                {C_STEP_LBL[cStep]}
              </Btn>
            </ActRow>
          </>
        )}
      </Modal>

      {/* ════ EDIT PRODUCT MODAL ════ */}
      <Modal
        open={showEdit}
        title={
          singleProduct?.name_en
            ? `تعديل المنتج · ${singleProduct.name_en}`
            : "تعديل المنتج"
        }
        onClose={() => setShowEdit(false)}
        wide
        isArabic={isArabic}
      >
        {loadingSingle && pid && (
          <p className="text-[16px] text-gray-500 mb-3">جارٍ التحميل...</p>
        )}
        {pid && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <DualInput
                label="الاسم بالإنجليزي"
                labelAr="الاسم بالعربي"
                placeholderEn="Product name"
                placeholderAr="اسم المنتج"
                valueEn={ef.name_en}
                valueAr={ef.name_ar ?? ""}
                onChangeEn={se("name_en")}
                onChangeAr={se("name_ar")}
              />
              <DualInput
                label="العائلة العطرية بالإنجليزي"
                labelAr="العائلة العطرية بالعربي"
                placeholderEn="Woody"
                placeholderAr="خشبي"
                valueEn={ef.fragrance_family_en}
                valueAr={ef.fragrance_family_ar ?? ""}
                onChangeEn={se("fragrance_family_en")}
                onChangeAr={se("fragrance_family_ar")}
              />

              <div className="flex flex-col gap-1 mb-1">
                <label className="text-[16px] text-gray-400 font-medium">
                  اسم الفئة
                </label>
                <Select
                  options={catOptions}
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !ef.categories.includes(val))
                      setEfCategories([...ef.categories, val]);
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {ef.categories.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[15px] text-white"
                    >
                      {catOptions.find((o) => o.value === cat)?.label ?? cat}
                      <button
                        onClick={() =>
                          setEfCategories(
                            ef.categories.filter((c) => c !== cat),
                          )
                        }
                        className="text-gray-400 hover:text-white leading-none"
                      >
                        <X />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DualTextarea
              label="الوصف بالإنجليزي"
              labelAr="الوصف بالعربي"
              placeholderEn="Description..."
              placeholderAr="الوصف..."
              valueEn={ef.description_en}
              valueAr={ef.description_ar ?? ""}
              onChangeEn={se("description_en")}
              onChangeAr={se("description_ar")}
            />

            <div className="flex flex-col gap-1 mb-1">
              <label className="text-[16px] text-gray-400 font-medium">
                الحالة
              </label>
              <Select
                key={`is_active_${pid}`}
                value={ef.is_active}
                onChange={se("is_active")}
                options={[
                  { value: "true", label: "مفعل" },
                  { value: "false", label: "غير مفعل" },
                ]}
              />
            </div>

            <div className="flex items-center gap-3 mt-2 mb-1">
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  setEf((f) => ({ ...f, is_bestseller: !f.is_bestseller }))
                }
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    ef.is_bestseller
                      ? "bg-gradient-to-br from-[#fda481] to-[#b4182d] border-transparent"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  {ef.is_bestseller && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  setEf((f) => ({ ...f, is_bestseller: !f.is_bestseller }))
                }
              >
                <p className="text-[16px] font-medium text-white">
                  الأكثر مبيعاً
                </p>
                <p className="text-[13px] text-gray-500">
                  سيظهر المنتج في قسم الأكثر مبيعاً
                </p>
              </div>
            </div>

            {isEBusy && <Spinner label={E_STEP_LBL[eStep]} />}
            <ActRow>
              <CancelBtn onClick={() => setShowEdit(false)} />
              <Btn onClick={handleEdit} loading={isEBusy}>
                {E_STEP_LBL[eStep]}
              </Btn>
            </ActRow>
          </>
        )}
      </Modal>

      {/* ════ ADD VARIANT MODAL ════ */}
      <Modal
        open={showAddVariant}
        title="إضافة متغيرات للمنتج"
        onClose={() => setShowAddVariant(false)}
        wide
        isArabic={isArabic}
      >
        {varPid && (
          <>
            {avars.map((v, i) => (
              <VRow
                key={i}
                v={v}
                onChangeVolume={(e) =>
                  setAvars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, volume: e.target.value } : x,
                    ),
                  )
                }
                onChangeColor={(e) =>
                  setAvars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, color: e.target.value } : x,
                    ),
                  )
                }
                onChangePrice={(e) =>
                  setAvars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, price: e.target.value } : x,
                    ),
                  )
                }
                onChangeCompare={(e) =>
                  setAvars((vs) =>
                    vs.map((x, idx) =>
                      idx === i
                        ? { ...x, compare_at_price: e.target.value }
                        : x,
                    ),
                  )
                }
                onChangeStock={(e) =>
                  setAvars((vs) =>
                    vs.map((x, idx) =>
                      idx === i ? { ...x, stock: e.target.value } : x,
                    ),
                  )
                }
                onAddImgs={(files) => addAImgs(i, files)}
                onRemoveImg={(fi) => removeAImg(i, fi)}
                onSetThumb={(fi) => setAThumb(i, fi)}
                onRemove={
                  avars.length > 1
                    ? () => setAvars((vs) => vs.filter((_, idx) => idx !== i))
                    : undefined
                }
              />
            ))}
            <button
              onClick={() =>
                setAvars((vs) => [
                  ...vs,
                  {
                    volume: "",
                    color: "",
                    price: "",
                    compare_at_price: "",
                    stock: "",
                    imageFiles: [],
                    imagePreviews: [],
                    thumbnailIndex: 0,
                  },
                ])
              }
              className="text-[16px] text-white font-semibold border border-dashed border-white rounded-xl px-4 py-2 bg-transparent cursor-pointer mb-4 hover:bg-white/5 hover:border-white/20 transition-colors w-full"
            >
              + إضافة صف متغير
            </button>
            {isAvBusy && <Spinner label={AV_STEP_LBL[avStep]} />}
            {newlyCreatedVids.length > 0 && (
              <div className="mt-1 pt-5 border-t border-white">
                <p className="text-[16px] font-semibold text-gray-500 uppercase -wider mb-3">
                  إدارة الصور
                </p>
                {(varProduct?.variants ?? [])
                  .filter((v: Variant) => newlyCreatedVids.includes(v.id))
                  .map((v: Variant) => (
                    <div
                      key={v.id}
                      className="bg-[#0f1117] border border-white/10 rounded-xl p-4 mb-3"
                    >
                      <p className="text-[16px] font-semibold text-white mb-3">
                        {v.volume}
                        <span className="font-normal text-gray-500 ml-2">
                          LE {parseFloat(v.price).toLocaleString()}
                        </span>
                      </p>
                      <ImgGallery
                        variantId={v.id}
                        images={normalizeImages(v.images)}
                        onRefresh={refreshVariantProduct}
                        onNotify={showNotification}
                      />
                    </div>
                  ))}
              </div>
            )}
            <ActRow>
              <CancelBtn onClick={() => setShowAddVariant(false)} />
              <Btn onClick={handleAddVariant} loading={isAvBusy}>
                {AV_STEP_LBL[avStep]}
              </Btn>
            </ActRow>
          </>
        )}
      </Modal>

      {/* ════ EDIT VARIANT MODAL ════ */}
      <Modal
        open={showEditVariant}
        title="تعديل المتغيرات"
        onClose={() => {
          setShowEditVariant(false);
          setSelectedVid(null);
        }}
        wide
        isArabic={isArabic}
      >
        {varPid &&
          !loadingVarProduct &&
          (varProduct?.variants ?? []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 text-2xl mb-1">
                ◻
              </div>
              <p className="text-gray-400 text-[16px]">
                لا يوجد متغيرات لهذا المنتج حتى الآن.
              </p>
              <button
                onClick={() => {
                  setShowEditVariant(false);
                  openAddVariant(varPid);
                }}
                className="bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[15px] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all cursor-pointer border-none"
              >
                إضافة متغير
              </button>
            </div>
          )}

        {varPid &&
          !loadingVarProduct &&
          (varProduct?.variants ?? []).length > 0 && (
            <>
              <p className="text-[16px] font-semibold text-gray-500 uppercase -wider mb-3">
                اختر المتغير
              </p>
              <div className="flex flex-col gap-2 mb-2">
                {(varProduct?.variants ?? []).map((v: Variant) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${selectedVid === v.id ? "bg-[#0f1117] border-[#fff]/50" : "bg-[#0f1117]/50 border-white/10 hover:border-white/20 hover:bg-[#0f1117]"}`}
                    onClick={() => setSelectedVid(v.id)}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const imgs = normalizeImages(v.images);
                        const vT = imgs.find((i) => i.is_thumbnail) ?? imgs[0];
                        return vT ? (
                          <img
                            width={120}
                            height={120}
                            src={vT.url}
                            className="w-[120px] h-[120px] rounded-lg object-cover"
                            alt="thumb"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-[120px] h-[120px] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 text-sm">
                            ◻
                          </div>
                        );
                      })()}
                      <div>
                        <p className="text-[16px] font-semibold text-white">
                          {v.volume}
                        </p>
                        <p className="text-[16px] text-white mt-0.5">
                          LE {parseFloat(v.price).toLocaleString()} · {v.stock}{" "}
                          في المخزن ·{" "}
                          <span
                            className={
                              v.is_active ? "text-emerald-400" : "text-white"
                            }
                          >
                            {v.is_active ? "مفعل" : "غير مفعل"}
                          </span>{" "}
                          · {normalizeImages(v.images).length} صورة
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteVid(v.id);
                      }}
                      className="text-[16px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-red-500/20 transition-colors flex-shrink-0"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
              {confirmDeleteVid !== null && (
                <ConfirmDelete
                  label={`المتغير رقم ${confirmDeleteVid}`}
                  busy={deletingVariant}
                  onConfirm={() => handleDeleteVariant(confirmDeleteVid!)}
                  onCancel={() => setConfirmDeleteVid(null)}
                />
              )}
            </>
          )}

        {selectedVid && (
          <>
            <div className="h-px bg-white/10 my-5" />
            <p className="text-[16px] font-semibold text-gray-500 uppercase -wider mb-4">
              تعديل المتغير المحدد
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {[
                { lbl: "الحجم", val: evf.volume, key: "volume", tp: "text" },
                { lbl: "اللون", val: (evf as any).color ?? "", key: "color", tp: "text" },
                { lbl: "السعر", val: evf.price, key: "price", tp: "text" },
                {
                  lbl: "سعر المقارنة",
                  val: evf.compare_at_price,
                  key: "compare_at_price",
                  tp: "text",
                },
                { lbl: "المخزون", val: evf.stock, key: "stock", tp: "number" },
              ].map(({ lbl, val, key, tp }) => (
                <div key={key} className="flex flex-col gap-1 mb-1">
                  <label className="text-[16px] text-gray-400 font-medium">
                    {lbl}
                  </label>
                  <input
                    type={tp}
                    value={val}
                    onChange={(e) =>
                      setEvf((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 mb-1">
              <label className="text-[16px] text-gray-400 font-medium">
                الحالة
              </label>
              <Select
                value={evf.is_active}
                onChange={(e) =>
                  setEvf((f) => ({ ...f, is_active: e.target.value }))
                }
                options={[
                  { value: "true", label: "مفعل" },
                  { value: "false", label: "غير مفعل" },
                ]}
              />
            </div>
            <ImgGallery
              variantId={selectedVid}
              images={normalizeImages(selectedVariant?.images)}
              onRefresh={refreshVariantProduct}
              onNotify={showNotification}
            />
            {isEvBusy && <Spinner label={EV_STEP_LBL[evStep]} />}
            <ActRow>
              <button
                onClick={() => setSelectedVid(null)}
                className="text-[16px] font-medium text-gray-400 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none"
              >
                إلغاء
              </button>
              <Btn onClick={handleEditVariant} loading={isEvBusy}>
                {EV_STEP_LBL[evStep]}
              </Btn>
            </ActRow>
          </>
        )}
      </Modal>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.16s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
