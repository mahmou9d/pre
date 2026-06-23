"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSuccess() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#16a34a" />
      <path
        d="M7 12.5l3.5 3.5 6.5-7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFailed() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#dc2626" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentData {
  amount_cents: number;
  order: string;
  merchant_order_id: string;
  created_at: string;
  source_data_pan: string;
  source_data_sub_type: string;
  currency: string;
  error_message?: string;
}

interface OrderData {
  message?: string;
  order_id?: string;
  next_step?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(cents: number, currency = "EGP"): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── COD Success Modal ────────────────────────────────────────────────────────

function CodSuccessModal({ onClose }: { onClose: () => void }) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const order_id = localStorage.getItem("order_id");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("next_step");
      if (raw) setOrderData(JSON.parse(raw));
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("next_step");
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
      className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cod-success-title"
        className="w-full max-w-[420px] bg-white rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 pb-6 flex flex-col items-center gap-3 relative">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-3.5 left-3.5 bg-black/5 hover:bg-black/10 border-none rounded-full w-7 h-7 cursor-pointer text-slate-500 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div
            className="w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_8px_#bbf7d0]"
            aria-hidden="true"
          >
            <IconSuccess />
          </div>

          <div className="text-center">
            <h3
              id="cod-success-title"
              className="text-[1.2rem] font-bold text-green-900 m-0 mb-1"
            >
              تم حجز الطلب
            </h3>
            <p className="text-[0.8rem] text-green-600 m-0 font-medium">
              طلبك اتسجّل بنجاح وسيتم التواصل معك لتأكيد التفاصيل والشحن
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 px-7 pb-7">
          <p className="m-0 text-[16px] text-black mt-0.5 mb-2">
            رقم الطلب: {orderData?.order_id || order_id}
          </p>

          {orderData?.message && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 px-4 mb-4">
              <span
                className="text-green-500 mt-0.5 text-base"
                role="img"
                aria-label="احتفال"
              >
                🎉
              </span>
              <div>
                <p className="m-0 text-[0.82rem] font-semibold text-green-800">
                  {orderData.message}
                </p>
                {orderData.order_id && (
                  <p className="m-0 text-[0.76rem] text-green-600 mt-0.5">
                    رقم الطلب: {orderData.order_id}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* COD notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 px-4 mb-4 text-[0.81rem] text-amber-800 leading-relaxed flex items-start gap-2">
            <span className="mt-0.5" role="img" aria-label="توصيل">
              🚚
            </span>
            <span>سيتم الدفع عند الاستلام</span>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Link
              href="/"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              متابعة التسوق
            </Link>
            <Link
              href="/orderhistory"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              عرض الطلب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Failed Modal ─────────────────────────────────────────────────────────────

function FailedModal({
  data,
  onClose,
}: {
  data: PaymentData;
  onClose: () => void;
}) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
      className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-failed-title"
        className="w-full max-w-[420px] bg-white rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-8 pb-6 flex flex-col items-center gap-3 relative">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-3.5 left-3.5 bg-black/5 hover:bg-black/10 border-none rounded-full w-7 h-7 cursor-pointer text-slate-500 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div
            className="w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_8px_#fecaca]"
            aria-hidden="true"
          >
            <IconFailed />
          </div>

          <div className="text-center">
            <h3
              id="payment-failed-title"
              className="text-[1.2rem] font-bold text-red-900 m-0 mb-1.5"
            >
              فشلت عملية الدفع
            </h3>
            {data.error_message && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[0.76rem] font-semibold"
                role="alert"
              >
                ⚠ {data.error_message}
              </span>
            )}
          </div>

          <p className="text-[2rem] font-extrabold text-red-800 m-0">
            {formatAmount(data.amount_cents, data.currency)}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 px-7 pb-7">
          <div className="space-y-0">
            {[
              ["رقم الطلب", `#${data.order}`],
              ["المرجع", `${data.merchant_order_id}`],
              [
                "البطاقة",
                `${data.source_data_sub_type} ••••${data.source_data_pan}`,
              ],
              ["التاريخ", formatDate(data.created_at)],
              ["العملة", data.currency],
            ].map(([label, value], i, arr) => (
              <div key={i}>
                <div className="flex justify-between py-2.5 text-[0.87rem]">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="text-slate-800 font-semibold max-w-[58%] break-all text-left">
                    {value}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="h-[1px] bg-slate-100" />}
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 px-4 mt-4 text-[0.81rem] text-orange-800 leading-relaxed">
            يرجى التحقق من بيانات بطاقتك والمحاولة مرة أخرى، أو التواصل مع البنك
            للمساعدة.
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              حاول مرة أخرى
            </Link>
            <Link
              href="/"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Popup Controller ─────────────────────────────────────────────────────────

export function PaymentPopup() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const successParam = searchParams.get("success");

  const data: PaymentData = useMemo(() => {
    return {
      amount_cents: Number(searchParams.get("amount_cents")) || 0,
      order: searchParams.get("order") ?? "",
      merchant_order_id: searchParams.get("merchant_order_id") ?? "",
      created_at: searchParams.get("created_at") ?? new Date().toISOString(),
      source_data_pan:
        searchParams.get("source_data.pan") ??
        searchParams.get("source_data_pan") ??
        "****",
      source_data_sub_type:
        searchParams.get("source_data.sub_type") ??
        searchParams.get("source_data_sub_type") ??
        "Card",
      currency: searchParams.get("currency") ?? "EGP",
      error_message:
        searchParams.get("data.message") ??
        searchParams.get("error_occured") ??
        undefined,
    };
  }, [searchParams]);

  const isCod = successParam === "true" && !searchParams.get("amount_cents");

  useEffect(() => {
    if (successParam) {
      if (successParam !== "true") {
        localStorage.removeItem("next_step");
      }
      setOpen(true);
    }
  }, [successParam]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    router.replace(pathname);
  }, [router, pathname]);

  if (!successParam || !open) return null;

  const success = successParam === "true";

  if (isCod) return <CodSuccessModal onClose={handleClose} />;

  if (success) return null;

  return <FailedModal data={data} onClose={handleClose} />;
}
