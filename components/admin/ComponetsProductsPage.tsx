/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAddImageVariantsProduct,
  useDeleteThumbnail,
  useSetThumbnail,
} from "@/hooks/useProducts";
import { ErrorResponse } from "@/type/type";
import { AxiosError } from "axios";
import { GalleryImage, Volume } from "@/type/type";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Btn, Card, Input, Sec } from "./Adminui";
export const MAX_IMG_BYTES = 3 * 1024 * 1024;

/* ── Spinner ── */
export function Spinner({ label }: { label: string }) {
  return (
    <div
      className={`mb-2 flex items-center gap-1.5 text-[16px] flex-row-reverse justify-end text-gray-400`}
    >
      <span className="inline-block w-4 h-4 rounded-full border-2 border-[#fff] border-t-transparent animate-spin flex-shrink-0" />
      {label}
    </div>
  );
}

/* ── ConfirmDelete ── */
export function ConfirmDelete({
  label,
  busy,
  onConfirm,
  onCancel,
}: {
  label: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="bg-red-500/10 border border-red-500/20 rounded-xl p-[12px_14px] mt-2"
      dir={"rtl"}
    >
      <p
        className={`text-[16px] text-red-400 mb-2.5`}
      >
        {"تأكيد الحذف"} {label}?
      </p>
      <div className="flex gap-2">
        <Btn variant="danger" onClick={onConfirm} loading={busy}>
          {"نعم"}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          {"إلغاء"}
        </Btn>
      </div>
    </div>
  );
}

/* ── ImgGallery ── */
export function ImgGallery({
  variantId,
  images,
  onRefresh,
  onNotify,
}: {
  variantId: number;
  images: GalleryImage[];
  onRefresh: () => void;
  onNotify: (msg: string, type: "success" | "error") => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadImg, isPending: uploading } =
    useAddImageVariantsProduct();
  const { mutate: deleteImg } = useDeleteThumbnail();
  const { mutate: setThumb } = useSetThumbnail();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleAdd = async (f: File) => {
    if (f.size > MAX_IMG_BYTES) {
      onNotify("الصورة كبيرة جداً", "error");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("img", f);
      await uploadImg(
        { payload: fd, variant_id: variantId },
        {
          onSuccess: (response: { message: string }) => {
            onRefresh();
            onNotify(response.message || "تم رفع الصورة", "success");
          },
          onError: (error: AxiosError<ErrorResponse>) =>
            onNotify(
              error?.response?.data?.message ||
                error?.message ||
                "فشل في رفع الصورة",
              "error",
            ),
        },
      );
      onRefresh();
      onNotify("تم رفع الصورة", "success");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      onNotify(
        error?.response?.data?.message ||
          error?.message ||
          "فشل في رفع الصورة",
        "error",
      );
    }
  };

  const handleDelete = (image_id: number) => {
    deleteImg(image_id, {
      onSuccess: (response: { message: string }) => {
        onRefresh();
        onNotify(response.message || "تم حذف الصورة", "success");
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        onNotify(
          error?.response?.data?.message ||
            error?.message ||
            "فشل في حذف الصورة",
          "error",
        ),
    });
  };

  const handleSetThumb = (image_id: number) => {
    setThumb(image_id, {
      onSuccess: () => {
        onRefresh();
        onNotify("تم تحديث الصورة الرئيسية", "success");
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        onNotify(
          error?.response?.data?.message ||
            "فشل في تحديث الصورة الرئيسية",
          "error",
        ),
    });
  };

  return (
    <div className="mb-3" dir={"rtl"}>
      <label
        className={`text-[20px] text-gray-400 block mb-1.5`}
      >
        {"صور المنتج"}
      </label>
      <div className="flex flex-wrap gap-2 items-start">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative shrink-0"
            onMouseEnter={() => setHoveredId(img.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              width={200}
              height={200}
              loading="lazy"
              alt="Image Product"
              src={img.url || "heros.jpg"}
              className={`w-[200px] h-[200px] object-cover rounded-xl block border-2 ${
                img.is_thumbnail ? "border-[#fff]" : "border-white/10"
              }`}
            />
            {img.is_thumbnail && (
              <span
                className={`absolute top-0.5 right-0.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[15px] rounded-[3px] px-1 py-px pointer-events-none -wider font-bold`}
              >
                {"الصورة الرئيسية"}
              </span>
            )}
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity duration-150 ${
                hoveredId === img.id ? "opacity-100" : "opacity-0"
              }`}
            >
              {!img.is_thumbnail && (
                <button
                  title={"تعيين كصورة رئيسية"}
                  onClick={() => handleSetThumb(img.id)}
                  className="text-[15px] font-bold bg-amber-600 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
                >
                  {"الصورة الرئيسية"}
                </button>
              )}
              <button
                title={"حذف الصورة"}
                onClick={() => handleDelete(img.id)}
                className="text-[15px] font-bold bg-red-500 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
              >
                {"حذف"}
              </button>
            </div>
          </div>
        ))}

        {/* Add button */}
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          title={"إضافة صورة"}
          className={`w-[200px] h-[200px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center shrink-0 bg-white/5 select-none gap-0.5 ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors"
          }`}
        >
          <span className="text-[16px] font-bold -wider text-gray-500">
            {uploading ? "..." : "إضافة صورة"}
          </span>
          {!uploading && (
            <span className="text-[16px] text-gray-600 font-semibold">
              {"الحد الأقصى للحجم: 2 ميجابايت"}
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleAdd(f);
            e.target.value = "";
          }}
        />
      </div>
      {images.length === 0 && !uploading && (
        <p
          className={`text-[16px] text-gray-600 mt-1.5`}
        >
          {"لا توجد صور"}
        </p>
      )}
    </div>
  );
}

/* ── MultiImgPicker ── */
export function MultiImgPicker({
  imagePreviews,
  thumbnailIndex,
  onAdd,
  onRemove,
  onSetThumb,
}: {
  imageFiles: File[];
  imagePreviews: string[];
  thumbnailIndex: number;
  onAdd: (files: File[]) => void;
  onRemove: (fi: number) => void;
  onSetThumb: (fi: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hoveredFi, setHoveredFi] = useState<number | null>(null);
  const [sizeErr, setSizeErr] = useState("");

  const handleFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => f.size <= MAX_IMG_BYTES);
    const rejected = incoming.length - valid.length;
    setSizeErr(
      rejected > 0 ? "تم تخطي {n} صور" : "",
    );
    if (valid.length) onAdd(valid);
  };

  return (
    <div dir={"rtl"}>
      <div className="flex flex-wrap gap-1.5 items-start">
        {imagePreviews.map((src, fi) => (
          <div
            key={fi}
            className="relative shrink-0"
            onMouseEnter={() => setHoveredFi(fi)}
            onMouseLeave={() => setHoveredFi(null)}
          >
            <img
              src={src}
              width={200}
              height={200}
              loading="lazy"
              alt="Image Product"
              className={`w-[200px] h-[200px] object-cover rounded-xl block border-2 ${
                thumbnailIndex === fi ? "border-[#fff]" : "border-white/10"
              }`}
            />
            {thumbnailIndex === fi && (
              <span
                className={`absolute top-0.5 right-0.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[15px] rounded-sm px-1 py-px pointer-events-none font-bold -wider`}
              >
                {"الصورة الرئيسية"}
              </span>
            )}
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity duration-150 ${
                hoveredFi === fi ? "opacity-100" : "opacity-0"
              }`}
            >
              {thumbnailIndex !== fi && (
                <button
                  onClick={() => onSetThumb(fi)}
                  className="text-[15px] font-bold bg-[#fff] text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
                >
                  {"الصورة الرئيسية"}
                </button>
              )}
              <button
                onClick={() => onRemove(fi)}
                className="text-[15px] font-bold bg-red-500 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
              >
                {"حذف"}
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => fileRef.current?.click()}
          title={"إضافة صورة"}
          className="w-[200px] h-[200px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white/5 shrink-0 select-none gap-px hover:bg-white/10 hover:border-white/20 transition-colors"
        >
          <span className="text-[15px] font-bold text-gray-500 -widest">
            {"إضافة صورة"}
          </span>
          <span className="text-[15px] text-gray-600 font-semibold">
            {"الحد الأقصى للحجم: 2 ميجابايت"}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) handleFiles(files);
            e.target.value = "";
          }}
        />
      </div>
      {sizeErr && (
        <p
          className={`text-[15px] text-red-400 mt-1`}
        >
          {sizeErr}
        </p>
      )}
    </div>
  );
}

/* ── VRow ── */
export function VRow({
  v,
  onChangeVolume,
  onChangeColor,
  onChangePrice,
  onChangeCompare,
  onChangeStock,
  onAddImgs,
  onRemoveImg,
  onSetThumb,
  onRemove,
}: {
  v: Volume;
  onChangeVolume: (e: any) => void;
  onChangeColor: (e: any) => void;
  onChangePrice: (e: any) => void;
  onChangeCompare: (e: any) => void;
  onChangeStock: (e: any) => void;
  onAddImgs: (files: File[]) => void;
  onRemoveImg: (fi: number) => void;
  onSetThumb: (fi: number) => void;
  onRemove?: () => void;
}) {
  return (
    <div
      className=" border border-white/10 rounded-xl p-2.5 mb-2"
      dir={"rtl"}
    >
      <div className="flex gap-2 items-start flex-wrap">
        <div className="shrink-0">
          <MultiImgPicker
            imageFiles={v.imageFiles}
            imagePreviews={v.imagePreviews}
            thumbnailIndex={v.thumbnailIndex}
            onAdd={onAddImgs}
            onRemove={onRemoveImg}
            onSetThumb={onSetThumb}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 flex-1 min-w-[180px]">
          <Input
            label={"الحجم"}
            placeholder="100ml / حجم"
            value={v.volume}
            onChange={onChangeVolume}
          />
          <Input
            label={"اللون"}
            placeholder="أسود / كريمي ..."
            value={v.color}
            onChange={onChangeColor}
          />
          <Input
            label={"السعر"}
            placeholder="120.00"
            value={v.price}
            onChange={onChangePrice}
          />
          <Input
            label={"المقارنة"}
            placeholder="140.00"
            value={v.compare_at_price}
            onChange={onChangeCompare}
          />
          <Input
            label={"الكمية"}
            placeholder="50"
            value={v.stock}
            onChange={onChangeStock}
            type="number"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="h-8 w-8 border border-red-500/20 rounded-xl bg-red-500/10 text-red-400 cursor-pointer text-base shrink-0 hover:bg-red-500/20 transition-colors"
          >
            <X/>
          </button>
        )}
      </div>
    </div>
  );
}
/* ─── Admin Category Dropdown ─── */
export default function AdminCategoryDropdown({
  categories,
  selectedCategories,
  onSelect,
  isArabic,
}: {
  categories: { value: string; label: string }[];
  selectedCategories: string[];
  onSelect: (cats: string[]) => void;
  isArabic: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const hasSelection = selectedCategories.length > 0;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll when bottom sheet is open on mobile
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  // Calculate dropdown position from trigger element
  const calcPos = useCallback(() => {
    if (!triggerRef.current || isMobile) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const panelWidth = 220;
    let left = isArabic ? rect.left - 100 : rect.right - panelWidth;
    if (left < 8) left = 8;
    if (left + panelWidth > window.innerWidth - 8)
      left = window.innerWidth - panelWidth - 8;
    setDropdownPos({ top: rect.bottom + 8, left });
  }, [isMobile, isArabic]);

  // Re-calculate on every scroll/resize while dropdown is open
  useEffect(() => {
    if (!open || isMobile) return;
    calcPos();
    // capture: true catches scroll on ANY scrollable ancestor
    window.addEventListener("scroll", calcPos, true);
    window.addEventListener("resize", calcPos);
    return () => {
      window.removeEventListener("scroll", calcPos, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [open, isMobile, calcPos]);

  const handleOpen = () => {
    calcPos();
    setOpen((v) => !v);
  };

  const toggle = (val: string) => {
    if (!val) {
      onSelect([]);
      return;
    }
    if (selectedCategories.includes(val)) {
      onSelect(selectedCategories.filter((c) => c !== val));
    } else {
      onSelect([...selectedCategories, val]);
    }
  };

  // Close on outside click (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile]);

  const triggerLabel = () => {
    if (!hasSelection) return isArabic ? "الفئة" : "Category";
    if (selectedCategories.length === 1) {
      return (
        categories.find((c) => c.value === selectedCategories[0])?.label ??
        selectedCategories[0]
      );
    }
    return isArabic
      ? `${selectedCategories.length} فئات`
      : `${selectedCategories.length} Categories`;
  };

  const categoryList = (
    <>
      <button
        onClick={() => {
          onSelect([]);
          if (isMobile) setOpen(false);
        }}
        className={`w-full text-start px-4 py-3 text-[16px] font-bold flex items-center justify-between transition-colors
          ${
            !hasSelection
              ? "text-[#fda481] bg-white/5"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
      >
        {isArabic ? "كل الفئات" : "All Categories"}
        {!hasSelection && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fda481"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="h-px bg-white/10 mx-3 my-1" />

      {categories.slice(1).map((cat) => {
        const active = selectedCategories.includes(cat.value);
        return (
          <button
            key={cat.value}
            onClick={() => toggle(cat.value)}
            className={`w-full text-start px-4 py-3 text-[15px] flex items-center gap-2.5 transition-colors
              ${
                active
                  ? "text-[#fda481] bg-white/5 font-bold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
              }`}
          >
            <span
              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${
                active
                  ? "bg-gradient-to-br from-[#fda481] to-[#b4182d] border-transparent"
                  : "border-white/20 bg-white/5"
              }`}
            >
              {active && (
                <svg
                  className="w-2.5 h-2.5 text-white"
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
            </span>
            {cat.label}
          </button>
        );
      })}
    </>
  );

  const footer = hasSelection && (
    <div className="border-t border-white/10 px-3 py-2 flex gap-2">
      <button
        onClick={() => onSelect([])}
        className="flex-1 text-[15px] text-gray-400 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        {isArabic ? "مسح الكل" : "Clear"}
      </button>
      <button
        onClick={() => setOpen(false)}
        className="flex-1 text-[15px] font-bold text-white py-1.5 rounded-lg bg-gradient-to-r from-[#fda481] to-[#b4182d] hover:opacity-90 transition-opacity"
      >
        {isArabic ? "تطبيق" : "Apply"}
      </button>
    </div>
  );

  // ── MOBILE: Bottom Sheet ──────────────────────────────────────────
  const bottomSheet = (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
        onClick={() => setOpen(false)}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1d29] rounded-t-3xl border-t border-white/10"
        style={{
          direction: isArabic ? "rtl" : "ltr",
          animation: "slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="px-4 py-2 pb-1">
          <p className="text-white font-bold text-[17px]">
            {isArabic ? "اختر الفئة" : "Select Category"}
          </p>
        </div>
        <div className="overflow-y-auto max-h-[60vh] py-1">{categoryList}</div>
        <div className="pb-2">{footer}</div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn  { from { opacity: 0; }                 to { opacity: 1; }              }
      `}</style>
    </>
  );

  // ── DESKTOP: Dropdown — position stays locked to the button ───────
  const desktopPanel = (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        minWidth: 220,
        zIndex: 9999,
        direction: isArabic ? "rtl" : "ltr",
      }}
      className="bg-[#1a1d29] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 pb-5"
    >
      <div className="py-1.5 max-h-[300px] overflow-y-auto">{categoryList}</div>
      {footer}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className={`flex items-center gap-2 h-[42px] px-4 rounded-xl border text-[13px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer
          ${
            hasSelection
              ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white border-transparent shadow-lg shadow-[#b4182d]/20"
              : "bg-[#1a1d29] border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
          }`}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <span>{triggerLabel()}</span>
        {hasSelection && (
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] font-black flex items-center justify-center">
            {selectedCategories.length}
          </span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          open ? (isMobile ? bottomSheet : desktopPanel) : null,
          document.body,
        )}
    </div>
  );
}
/* ── ProductList ── */
export function ProductList({
  onPick,
  activePid,
  products,
  loading,
}: {
  onPick: (id: number) => void;
  activePid: number | null;
  products: any[];
  loading: boolean;
}) {
  const txt ={
        base: "text-[14px]",
        sm: "text-[13px]",
        xs: "text-[12px]",
        xxs: "text-[11px]",
      }

  return (
    <Card dir={"rtl"}>
      <Sec>{"جميع المنتجات"}</Sec>
      {loading && <p className={`${txt.sm} text-gray-500`}>{"جارٍ التحميل..."}</p>}
      <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {products?.map((p: any) => (
          <div
            key={p.id}
            className={`p-[8px_12px] rounded-xl cursor-pointer transition-all border ${
              activePid === p.id
                ? "bg-[#fff]/10 border-[#fff]/30"
                : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
            }`}
            onClick={() => onPick(p.id)}
          >
            <div className="flex justify-between">
              <span
                className={`${txt.sm} ${
                  activePid === p.id
                    ? "text-[#fff] font-semibold"
                    : "text-gray-300 font-normal"
                }`}
              >
                {p.name}
              </span>
              <span className={`${txt.xxs} text-gray-600`}>#{p.id}</span>
            </div>
            <span className={`${txt.xxs} text-gray-500 block`}>
              {p.category_name || (p.category as any)?.name || ""}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
