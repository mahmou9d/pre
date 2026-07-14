"use client";
import { useEffect, useRef, useState } from "react";
import { useGetRecentOrders, usePatchOrders } from "@/hooks/useDashboard";
import { ErrorResponse, Order, OrderItems, OrderStatus } from "@/type/type";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Check,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Phone,
  Calendar,
  Eye,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// ── status config ────────────────────────────────────────────────────────────
const statusOptions = [
  {
    value: "all",
    labelEn: "All Status",
    labelAr: "كل الحالات",
    icon: Filter,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
  },
  {
    value: "pending",
    labelEn: "Pending",
    labelAr: "قيد الانتظار",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    value: "paid",
    labelEn: "Paid",
    labelAr: "مدفوع",
    icon: CreditCard,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "shipped",
    labelEn: "Shipped",
    labelAr: "تم الشحن",
    icon: Truck,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "delivered",
    labelEn: "Delivered",
    labelAr: "تم التسليم",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    value: "refunded",
    labelEn: "Refunded",
    labelAr: "مرتجع",
    icon: Check,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    value: "cancelled",
    labelEn: "Cancelled",
    labelAr: "ملغي",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
];

const orderStatusOptions = statusOptions.filter((o) => o.value !== "all");

// ── Payment Method Label Helper ──────────────────────────────────────────────
function getPaymentLabel(method: string, isArabic?: boolean): string {
  if (isArabic) {
    switch (method) {
      case "cod":
        return "الدفع عند الاستلام";
      case "visa":
        return "فيزا";
      default:
        return method;
    }
  } else {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "visa":
        return "Visa";
      default:
        return method;
    }
  }
}

// ── Mobile Order Card ────────────────────────────────────────────────────────
function OrderCard({
  order,
  isExpanded,
  isEditing,
  newStatus,
  patching,
  patchSuccess,
  patchError,
  isArabic,
  o,
  currentOpt,
  getLabel,
  onToggleExpand,
  onEdit,
  onCancelEdit,
  onSave,
  onStatusSelect,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-[#1a1d29] border border-white/10 rounded-2xl mb-3">
      {/* Card Header - always visible */}
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div
          className={`flex items-start justify-between gap-3 ${isArabic ? "flex-row-reverse" : ""}`}
        >
          {/* Left: ID + Customer */}
          <div className={`flex-1 min-w-0 ${isArabic ? "text-right" : ""}`}>
            <div
              className={`flex items-center gap-2 mb-1 ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <span className="font-bold text-white text-sm">
                #{String(order.id).slice(0, 8)}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${currentOpt.bgColor} ${currentOpt.color} border-current/20`}
              >
                <currentOpt.icon className="w-2.5 h-2.5" />
                {isArabic
                  ? getLabel(currentOpt)
                  : order.status.charAt(0).toUpperCase() +
                  order.status.slice(1)}
              </span>
            </div>
            <p className="font-semibold text-white text-sm truncate">
              {order.full_name || "عميل"}
            </p>
            <p
              className={`text-xs text-gray-400 flex items-center gap-1 mt-0.5 ${isArabic ? "flex-row-reverse justify-end" : ""}`}
            >
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{order.country || "—"}</span>
            </p>
          </div>

          {/* Right: Total + Date */}
          <div
            className={`flex flex-col items-end gap-1 shrink-0 ${isArabic ? "items-start" : ""}`}
          >
            <span className="font-bold text-white text-base">
              LE {parseFloat(order.total_price || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString(
                  isArabic ? "ar-EG" : "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )
                : "—"}
            </span>
          </div>
        </div>

        {/* Products preview */}
        <div
          className={`flex items-center gap-2 mt-3 ${isArabic ? "flex-row-reverse" : ""}`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center shrink-0">
            <Package className="w-3.5 h-3.5 text-[#fff]" />
          </div>
          <p className="text-sm text-white font-medium truncate">
            {order.items?.[0]?.variant_name || "—"}
            {order.items?.length > 1 && (
              <span className="text-gray-400 ml-1">
                +{order.items.length - 1} {isArabic ? "أكثر" : "more"}
              </span>
            )}
          </p>
          <div
            className={`${isArabic ? "mr-auto" : "ml-auto"} flex items-center gap-1`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="p-2 rounded-xl hover:bg-white/5 text-[#fff]"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl hover:bg-white/5 text-gray-400"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="border-t border-white/10">
          {/* Items */}
          {order.items?.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <p className="text-xs font-bold text-[#fff] uppercase tracking-wider mb-3">
                المنتجات
              </p>
              <div className="space-y-2">
                {order.items.map((item: OrderItems, i: number) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 ${isArabic ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-2 min-w-0 ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      <div className="w-5 h-5 rounded-md bg-[#fff]/10 border border-[#fff]/20 flex items-center justify-center shrink-0">
                        <span className="text-[#fff] text-xs font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm text-white font-medium truncate">
                        {item.variant_name}
                        {item.variant_volume ? ` · ${item.variant_volume}` : ""}
                        <span className="text-gray-400 mx-1">×</span>
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0 ml-2">
                      LE{" "}
                      {Number(
                        item.subtotal || item.price || 0,
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address + Phone + Governorate + Shipping + Payment + Date */}
          <div className="p-4 border-b border-white/10 space-y-2">
            {(order.full_address || order.country) && (
              <p
                className={`text-sm text-gray-400 flex items-start gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <MapPin className="w-4 h-4 text-[#fff] shrink-0 mt-0.5" />
                <span>
                  {[order.full_address, order.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
            )}
            {(order.governorate_name_en || order.governorate_name_ar) && (
              <p
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <MapPin className="w-4 h-4 text-[#fff] shrink-0" />
                {isArabic
                  ? order.governorate_name_ar
                  : order.governorate_name_en}
              </p>
            )}
            {order.phone_number && (
              <p
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <Phone className="w-4 h-4 text-[#fff] shrink-0" />
                {order.phone_number}
              </p>
            )}

            <div
              className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <Package className="w-4 h-4 text-[#fff] shrink-0" />
                سعر المنتجات
              </span>
              <span className="text-sm font-semibold text-white">
                LE{" "}
                {Number(
                  order.total_price - (parseFloat(order.shipping_fee) || 0) ||
                  0,
                ).toLocaleString()}
              </span>
            </div>

            {order.shipping_fee && (
              <p
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <Truck className="w-4 h-4 text-[#fff] shrink-0" />
                رسوم الشحن:{" "}
                <span className="text-white font-semibold">
                  LE {parseFloat(order.shipping_fee).toLocaleString()}
                </span>
              </p>
            )}

            <div
              className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`text-sm font-bold text-white flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <CreditCard className="w-4 h-4 text-[#fff] shrink-0" />
                الإجمالي
              </span>
              <span className="text-base font-bold text-white">
                LE{" "}
                {(Number(order.total_price) || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {order.payment_method && (
              <p
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <CreditCard className="w-4 h-4 text-[#fff] shrink-0" />
                {getPaymentLabel(order.payment_method, isArabic)}
              </p>
            )}
            {order.created_at && (
              <p
                className={`text-sm text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <Calendar className="w-4 h-4 text-[#fff] shrink-0" />
                {new Date(order.created_at).toLocaleDateString(
                  isArabic ? "ar-EG" : "en-US",
                  { day: "2-digit", month: "short", year: "numeric" },
                )}
              </p>
            )}
          </div>

          {/* Status Change */}
          <div className="p-4">
            {isEditing ? (
              <div className="space-y-3" ref={statusRef}>
                {/* Status Dropdown */}
                <div className="relative z-[100]">
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl flex items-center gap-3 hover:border-[#fff]/30"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${currentOpt.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <currentOpt.icon
                        className={`w-4 h-4 ${currentOpt.color}`}
                      />
                    </div>
                    <div
                      className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}
                    >
                      <p className="text-xs text-gray-400">الحالة الجديدة</p>
                      <p className="font-bold text-white text-sm">
                        {getLabel(currentOpt)}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>
                  {isStatusOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl z-50">
                      <div className="p-2">
                        {orderStatusOptions.map((opt) => {
                          const Icon = opt.icon;
                          const isSel = opt.value === newStatus;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                onStatusSelect(opt.value);
                                setIsStatusOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${isSel
                                  ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 border border-[#fff]/30"
                                  : "hover:bg-white/5 border border-transparent"
                                } ${isArabic ? "flex-row-reverse" : ""}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center shrink-0`}
                              >
                                <Icon className={`w-4 h-4 ${opt.color}`} />
                              </div>
                              <span
                                className={`text-sm font-semibold flex-1 ${isArabic ? "text-right" : ""} ${isSel ? "text-white" : "text-gray-300"}`}
                              >
                                {getLabel(opt)}
                              </span>
                              {isSel && (
                                <Check className="w-4 h-4 text-[#fff]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSave(String(order.id))}
                    disabled={patching}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {patching ? (
                      <>
                        <span className="animate-spin">↻</span> جارٍ الحفظ...
                      </>
                    ) : (
                      "حفظ"
                    )}
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/10"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:border-[#fff]/30 hover:bg-white/10 flex items-center justify-center gap-2"
              >
                ✏ تغيير الحالة
              </button>
            )}

            {patchSuccess && (
              <div
                className={`mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 text-sm font-medium">
                  تم التحديث بنجاح
                </span>
              </div>
            )}
            {patchError && (
              <div
                className={`mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-400 text-sm font-medium">
                  فشل التحديث
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<{ id: string } | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(h);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setIsFilterOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setIsStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const apiStatus = status === "all" ? "" : status;
  const isFiltered = debouncedSearch.trim() !== "" || apiStatus !== "";

  const { data, isLoading, isError } = useGetRecentOrders(
    page,
    debouncedSearch,
    apiStatus,
  );
  const { mutate: patch, isPending: patching } = usePatchOrders();
  const [patchSuccessId, setPatchSuccessId] = useState<string | null>(null);
  const [patchErrorId, setPatchErrorId] = useState<string | null>(null);

  const ordersData = data?.orders || [];

  const getLabel = (opt: (typeof statusOptions)[0]) => opt.labelAr;

  const statusWithCounts = statusOptions.map((opt) => ({
    ...opt,
    count:
      opt.value === "all"
        ? ordersData.length
        : ordersData.filter((ord: any) => ord.status === opt.value).length,
  }));

  const selectedFilter =
    statusWithCounts.find((s) => s.value === status) || statusWithCounts[0];

  const tableHeaders = [
    "رقم الطلب",
    "العميل",
    "المنتجات",
    "الإجمالي",
    "الحالة",
    "التاريخ",
    "الإجراءات",
  ];

  const handleSave = (id: string) => {
    setPatchSuccessId(null);
    setPatchErrorId(null);
    patch(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast({ title: "تم التحديث بنجاح" });
          setEditingOrder(null);
          setIsStatusOpen(false);
          setPatchSuccessId(id);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          toast({
            title: error?.response?.data?.message || "فشل التحديث",
            variant: "destructive",
          });
          setPatchErrorId(id);
        },
      },
    );
  };

  return (
    <div dir="rtl">
      {/* ── Header ── */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          الطلبات
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          إدارة وتتبع الطلبات
        </p>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-2">
          {/* Status Filter Dropdown */}
          <div className="relative shrink-0" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-11 px-3 md:px-5 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold hover:border-[#fff]/30 flex items-center gap-2 md:gap-3 md:min-w-[200px]"
            >
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-lg ${selectedFilter.bgColor} flex items-center justify-center shrink-0`}
              >
                <selectedFilter.icon
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selectedFilter.color}`}
                />
              </div>
              <span className="hidden md:block text-sm text-white font-bold">
                {getLabel(selectedFilter)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2">
                    {statusWithCounts.map((opt) => {
                      const isSelected = opt.value === status;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setStatus(opt.value);
                            setPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${isSelected
                              ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 border border-[#fff]/30"
                              : "hover:bg-white/5 border border-transparent"
                            }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center shrink-0`}
                          >
                            <Icon className={`w-4 h-4 ${opt.color}`} />
                          </div>
                          <div className="flex-1 text-right">
                            <p
                              className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-300"}`}
                            >
                              {getLabel(opt)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#fff] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث..."
              className="w-full h-11 pr-10 pl-10 bg-[#1a1d29] border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#fff]/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Loading / Error States ── */}
      {isLoading && (
        <p className="text-sm text-gray-400 animate-pulse py-4">
          جارٍ التحميل...
        </p>
      )}
      {isError && (
        <p className="text-sm text-red-400 font-medium py-4">
          حدث خطأ أثناء تحميل الطلبات
        </p>
      )}

      {/* ── Mobile Cards (< md) ── */}
      <div className="block lg:hidden">
        {ordersData.length > 0
          ? ordersData.map((order: Order) => {
            const isExpanded = expandedId === String(order.id);
            const isEditing = editingOrder?.id === String(order.id);
            const currentOpt =
              orderStatusOptions.find(
                (s) => s.value === (isEditing ? newStatus : order.status),
              ) || orderStatusOptions[0];

            return (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={isExpanded}
                isEditing={isEditing}
                newStatus={newStatus}
                isStatusOpen={isStatusOpen}
                patching={patching}
                patchSuccess={patchSuccessId === String(order.id)}
                patchError={patchErrorId === String(order.id)}
                currentOpt={currentOpt}
                statusRef={statusRef}
                getLabel={getLabel}
                onToggleExpand={() =>
                  setExpandedId(isExpanded ? null : String(order.id))
                }
                onEdit={() => {
                  setEditingOrder({ id: String(order.id) });
                  setNewStatus(order.status);
                  setExpandedId(String(order.id));
                }}
                onCancelEdit={() => setEditingOrder(null)}
                onSave={handleSave}
                onStatusOpen={() => setIsStatusOpen(!isStatusOpen)}
                onStatusSelect={(val: string) => {
                  setNewStatus(val as OrderStatus);
                  setIsStatusOpen(false);
                }}
              />
            );
          })
          : !isLoading && (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-20" />
              <p className="text-gray-400 font-semibold">لا توجد طلبات</p>
            </div>
          )}
      </div>

      {/* ── Desktop Table (>= md) ── */}
      <div className="hidden lg:block bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1117] border-b border-white/10">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-5 text-right text-sm font-bold text-[#fff] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ordersData.length > 0
                ? ordersData.map((order: Order) => {
                  const isExpanded = expandedId === String(order.id);
                  const isEditing = editingOrder?.id === String(order.id);
                  const currentOpt =
                    orderStatusOptions.find(
                      (s) =>
                        s.value === (isEditing ? newStatus : order.status),
                    ) || orderStatusOptions[0];

                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-white/5 cursor-pointer"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : String(order.id))
                        }
                      >
                        {/* Order ID */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="font-bold text-white">
                            #{String(order.id).slice(0, 8)}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-5">
                          <p className="font-bold text-white mb-0.5">
                            {order.full_name || "عميل"}
                          </p>
                          <p className="text-sm text-gray-400 flex items-center gap-1 flex-row-reverse justify-end">
                            <MapPin className="w-3 h-3" />
                            {order.country || "—"}
                          </p>
                        </td>

                        {/* Products */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center">
                              <Package className="w-4 h-4 text-[#fff]" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {order.items?.[0]?.variant_name || "—"}
                              </p>
                              {order.items?.length > 1 && (
                                <p className="text-xs text-gray-400">
                                  +{order.items.length - 1} أكثر
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-5">
                          <span className="font-bold text-white text-lg">
                            LE{" "}
                            {(Number(order?.total_price) || 0).toLocaleString(
                              "en-US",
                              { minimumFractionDigits: 2 },
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${currentOpt.bgColor} ${currentOpt.color} border-current/20`}
                          >
                            <currentOpt.icon className="w-3 h-3" />
                            {getLabel(currentOpt)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 text-gray-400 font-medium text-sm">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                              "ar-EG",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(String(order.id));
                              }}
                              className="p-2.5 rounded-xl hover:bg-white/5 text-[#fff]"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Desktop Expanded Panel ── */}
                      {isExpanded && (
                        <tr key={`${order.id}-expanded`}>
                          <td colSpan={7} className="px-6 py-0">
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl mb-4">
                              {/* Items */}
                              {order.items?.length > 0 && (
                                <div className="p-5 border-b border-white/10">
                                  <p className="text-xs font-bold text-[#fff] uppercase tracking-wider mb-3">
                                    المنتجات
                                  </p>
                                  <div className="space-y-2">
                                    {order.items.map(
                                      (item: OrderItems, i: number) => (
                                        <div
                                          key={i}
                                          className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 flex-row-reverse"
                                        >
                                          <div className="flex items-center gap-3 flex-row-reverse">
                                            <div className="w-6 h-6 rounded-md bg-[#fff]/10 border border-[#fff]/20 flex items-center justify-center">
                                              <span className="text-[#fff] text-xs font-bold">
                                                {i + 1}
                                              </span>
                                            </div>
                                            <span className="text-sm text-white font-medium">
                                              {item.variant_name}
                                              {item.variant_volume
                                                ? ` · ${item.variant_volume}`
                                                : ""}
                                              <span className="text-gray-400 mx-1">
                                                ×
                                              </span>
                                              {item.quantity}
                                            </span>
                                          </div>
                                          <span className="text-sm font-bold text-white">
                                            LE{" "}
                                            {Number(
                                              item.subtotal ||
                                              item.price ||
                                              0,
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Address + Phone + Governorate + Shipping + Payment */}
                              <div className="p-5 border-b border-white/10 space-y-2">
                                {(order.full_address || order.country) && (
                                  <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <MapPin className="w-4 h-4 text-[#fff] shrink-0" />
                                    {[order.full_address, order.country]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                )}
                                {(order.governorate_name_en ||
                                  order.governorate_name_ar) && (
                                    <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                      <MapPin className="w-4 h-4 text-[#fff] shrink-0" />
                                      {order.governorate_name_ar}
                                    </p>
                                  )}
                                {order.phone_number && (
                                  <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <Phone className="w-4 h-4 text-[#fff] shrink-0" />
                                    {order.phone_number}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 pb-2 mb-2 flex-row-reverse">
                                  <span className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <Package className="w-4 h-4 text-[#fff] shrink-0" />
                                    سعر المنتجات
                                  </span>
                                  <span className="text-sm font-semibold text-white">
                                    LE{" "}
                                    {Number(
                                      (Number(order.total_price) || 0) -
                                      (parseFloat(
                                        order.shipping_fee || "0",
                                      ) || 0),
                                    ).toLocaleString()}
                                  </span>
                                </div>

                                {order.shipping_fee && (
                                  <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <Truck className="w-4 h-4 text-[#fff] shrink-0" />
                                    رسوم الشحن:{" "}
                                    <span className="text-white font-semibold">
                                      LE{" "}
                                      {parseFloat(
                                        order.shipping_fee,
                                      ).toLocaleString()}
                                    </span>
                                  </p>
                                )}

                                <div className="flex items-center gap-2 pt-2 mt-2 flex-row-reverse">
                                  <span className="text-sm font-bold text-white flex items-center gap-2 flex-row-reverse">
                                    <CreditCard className="w-4 h-4 text-[#fff] shrink-0" />
                                    الإجمالي
                                  </span>
                                  <span className="text-base font-bold text-white">
                                    LE{" "}
                                    {(
                                      Number(order.total_price) || 0
                                    ).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </span>
                                </div>

                                {order.payment_method && (
                                  <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <CreditCard className="w-4 h-4 text-[#fff] shrink-0" />
                                    {getPaymentLabel(
                                      order.payment_method,
                                      true,
                                    )}
                                  </p>
                                )}
                                {order.created_at && (
                                  <p className="text-sm text-gray-400 flex items-center gap-2 flex-row-reverse">
                                    <Calendar className="w-4 h-4 text-[#fff] shrink-0" />
                                    {new Date(
                                      order.created_at,
                                    ).toLocaleDateString("ar-EG", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                )}
                              </div>

                              {/* Status Change */}
                              <div className="p-5">
                                {isEditing ? (
                                  <div
                                    className="flex flex-wrap gap-3 items-center"
                                    ref={statusRef}
                                  >
                                    <div className="relative min-w-[200px] z-[100]">
                                      <button
                                        onClick={() =>
                                          setIsStatusOpen(!isStatusOpen)
                                        }
                                        className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl flex items-center gap-3 hover:border-[#fff]/30"
                                      >
                                        <div
                                          className={`w-8 h-8 rounded-lg ${currentOpt.bgColor} flex items-center justify-center`}
                                        >
                                          <currentOpt.icon
                                            className={`w-4 h-4 ${currentOpt.color}`}
                                          />
                                        </div>
                                        <div className="flex-1 text-right">
                                          <p className="text-xs text-gray-400">
                                            الحالة الجديدة
                                          </p>
                                          <p className="font-bold text-white text-sm">
                                            {getLabel(currentOpt)}
                                          </p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                      </button>
                                      {isStatusOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl z-50">
                                          <div className="p-2">
                                            {orderStatusOptions.map((opt) => {
                                              const Icon = opt.icon;
                                              const isSel =
                                                opt.value === newStatus;
                                              return (
                                                <button
                                                  key={opt.value}
                                                  onClick={() => {
                                                    setNewStatus(
                                                      opt.value as OrderStatus,
                                                    );
                                                    setIsStatusOpen(false);
                                                  }}
                                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg flex-row-reverse ${isSel
                                                      ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 border border-[#fff]/30"
                                                      : "hover:bg-white/5 border border-transparent"
                                                    }`}
                                                >
                                                  <div
                                                    className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center`}
                                                  >
                                                    <Icon
                                                      className={`w-4 h-4 ${opt.color}`}
                                                    />
                                                  </div>
                                                  <span
                                                    className={`text-sm font-semibold flex-1 text-right ${isSel ? "text-white" : "text-gray-300"}`}
                                                  >
                                                    {getLabel(opt)}
                                                  </span>
                                                  {isSel && (
                                                    <Check className="w-4 h-4 text-[#fff]" />
                                                  )}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      onClick={() =>
                                        handleSave(String(order.id))
                                      }
                                      disabled={patching}
                                      className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                      {patching ? (
                                        <>
                                          <span className="animate-spin">
                                            ↻
                                          </span>{" "}
                                          جارٍ الحفظ...
                                        </>
                                      ) : (
                                        "حفظ"
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingOrder(null)}
                                      className="px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/10"
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingOrder({
                                        id: String(order.id),
                                      });
                                      setNewStatus(order.status);
                                    }}
                                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:border-[#fff]/30 hover:bg-white/10 flex items-center gap-2"
                                  >
                                    ✏ تغيير الحالة
                                  </button>
                                )}

                                {patchSuccessId === String(order.id) && (
                                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 flex-row-reverse">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 text-sm font-medium">
                                      تم التحديث بنجاح
                                    </span>
                                  </div>
                                )}
                                {patchErrorId === String(order.id) && (
                                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 flex-row-reverse">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400 text-sm font-medium">
                                      فشل التحديث
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
                : !isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-20" />
                      <p className="text-gray-400 font-semibold text-lg">
                        لا توجد طلبات
                      </p>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* ── Desktop Pagination ── */}
        {!isFiltered && (data?.next || data?.previous || page > 1) && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 flex-row-reverse">
            <p className="text-sm text-gray-400">
              صفحة <span className="font-bold text-white">{page}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    100,
                  );
                }}
                disabled={!data?.previous}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400 px-2">صفحة {page}</span>
              <button
                onClick={() => {
                  setPage((p) => p + 1);
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    100,
                  );
                }}
                disabled={!data?.next}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Pagination ── */}
      <div className="block lg:hidden">
        {!isFiltered && (data?.next || data?.previous || page > 1) && (
          <div className="flex items-center justify-between py-4 flex-row-reverse">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setTimeout(
                  () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  100,
                );
              }}
              disabled={!data?.previous}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a1d29] border border-white/10 rounded-xl text-sm text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              السابق
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              صفحة <span className="font-bold text-white">{page}</span>
            </span>
            <button
              onClick={() => {
                setPage((p) => p + 1);
                setTimeout(
                  () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  100,
                );
              }}
              disabled={!data?.next}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a1d29] border border-white/10 rounded-xl text-sm text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
