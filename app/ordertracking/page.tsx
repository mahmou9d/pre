"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useOrderHistory } from "@/hooks/usePayment";
import Link from "next/link";

/**
 * Design tokens — streetwear / bold (matches entire site)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: order list with filter tabs and expandable timeline blocks.
 */

const STATUS_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "bg-[#FAFAF7] border-[#0A0A0A]/20", text: "text-[#0A0A0A]/50" },
  paid: { label: "Paid", bg: "bg-[#D4FF3D] border-[#0A0A0A]", text: "text-[#0A0A0A]" },
  shipped: { label: "Shipped", bg: "bg-[#FF4D00] border-[#0A0A0A]", text: "text-[#0A0A0A]" },
  delivered: { label: "Delivered", bg: "bg-[#D4FF3D] border-[#0A0A0A]", text: "text-[#0A0A0A]" },
  cancelled: { label: "Cancelled", bg: "bg-[#FAFAF7] border-[#FF4D00]/30", text: "text-[#FF4D00]" },
};

const filterKeys = ["all", "pending", "paid", "shipped", "delivered", "cancelled"] as const;

const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_LABEL[status] ?? STATUS_LABEL.pending;
  return (
    <span
      className={[
        "text-[10px] font-black uppercase px-2.5 py-1 border-2 -rotate-1",
        cfg.bg,
        cfg.text,
      ].join(" ")}
      style={{ borderWidth: 2 }}
    >
      {cfg.label}
    </span>
  );
}

function OrderCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timelineSteps = useMemo(() => {
    const status = order.status;
    return [
      {
        id: "placed",
        label: "Order placed",
        desc: "We received your order.",
        done: true,
        active: status === "pending",
        icon: Package,
      },
      {
        id: "paid",
        label: "Payment confirmed",
        desc: "Payment verified successfully.",
        done: status !== "pending" && status !== "cancelled",
        active: status === "paid",
        icon: CheckCircle,
      },
      {
        id: "shipped",
        label: "Shipped",
        desc: "Dispatched and handed to courier.",
        done: status === "shipped" || status === "delivered",
        active: status === "shipped",
        icon: Truck,
      },
      {
        id: "delivered",
        label: "Delivered",
        desc: "Successfully received at your door.",
        done: status === "delivered",
        active: status === "delivered",
        icon: MapPin,
      },
    ];
  }, [order.status]);

  return (
    <div
      className="border-3 border-[#0A0A0A] bg-[#FAFAF7] overflow-hidden"
      style={{ borderWidth: 3 }}
    >
      {/* Header Summary strip */}
      <div className="bg-[#0A0A0A] text-[#FAFAF7] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-[#FAFAF7]/50 block">
            Order ID
          </span>
          <span className="text-[15px] font-black text-[#D4FF3D] font-mono">
            #{order.id}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-[#FAFAF7]/50 block">
            Placed
          </span>
          <span className="text-[12px] font-bold text-[#FAFAF7]">
            {formattedDate} · {formattedTime}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-[#FAFAF7]/50 block">
            Total Price
          </span>
          <span className="text-[13px] font-black text-[#D4FF3D]">
            {fmt(parseFloat(order.total_price))}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Main info */}
      <div className="p-5">
        <div className="flex flex-col gap-3">
          {order.items.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-2 border-b border-[#0A0A0A]/5 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-12 border-2 border-[#0A0A0A] bg-[#0A0A0A]/5 overflow-hidden flex-shrink-0">
                  <ShoppingBag className="w-full h-full p-2 text-[#0A0A0A]/20" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black uppercase text-[#0A0A0A] truncate">
                    {item.variant_name}
                  </p>
                  <p className="text-[11px] font-bold text-[#0A0A0A]/50">
                    {item.variant_volume}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-[12px] font-black text-[#0A0A0A]/40">
                  × {item.quantity}
                </span>
                <span className="text-[13px] font-black text-[#0A0A0A]">
                  {fmt(parseFloat(item.price) * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle details */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF4D00] hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} strokeWidth={3} /> Hide timeline & info
            </>
          ) : (
            <>
              <ChevronDown size={14} strokeWidth={3} /> View timeline & info
            </>
          )}
        </button>

        {/* Expanded detail blocks */}
        {expanded && (
          <div className="mt-5 pt-5 border-t-2 border-[#0A0A0A]/10 flex flex-col gap-6">
            {/* Timeline */}
            <div>
              <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 -rotate-1 mb-5">
                Shipment timeline
              </span>
              <div className="flex flex-col gap-0">
                {timelineSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <div key={step.id} className="flex gap-4">
                      {/* Connector */}
                      <div className="flex flex-col items-center flex-shrink-0 w-8">
                        <div
                          className={[
                            "w-8 h-8 border-2 border-[#0A0A0A] flex items-center justify-center flex-shrink-0 transition-colors",
                            step.done
                              ? "bg-[#0A0A0A]"
                              : step.active
                              ? "bg-[#FF4D00]"
                              : "bg-[#FAFAF7]",
                          ].join(" ")}
                        >
                          <StepIcon
                            size={14}
                            strokeWidth={2.5}
                            className={
                              step.done
                                ? "text-[#D4FF3D]"
                                : step.active
                                ? "text-[#0A0A0A]"
                                : "text-[#0A0A0A]/20"
                            }
                          />
                        </div>
                        {!isLast && (
                          <div
                            className={[
                              "w-0.5 flex-1 my-1",
                              step.done ? "bg-[#0A0A0A]" : "bg-[#0A0A0A]/10",
                            ].join(" ")}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className={["pb-5 flex-1 min-w-0", isLast ? "pb-0" : ""].join(" ")}>
                        <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
                          <div>
                            <p
                              className={[
                                "text-[12px] font-black uppercase tracking-tight",
                                step.done || step.active
                                  ? "text-[#0A0A0A]"
                                  : "text-[#0A0A0A]/30",
                              ].join(" ")}
                            >
                              {step.label}
                              {step.active && (
                                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse align-middle" />
                              )}
                            </p>
                            <p
                              className={[
                                "text-[11px] font-bold mt-0.5 leading-snug max-w-xs",
                                step.done || step.active
                                  ? "text-[#0A0A0A]/60"
                                  : "text-[#0A0A0A]/20",
                              ].join(" ")}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery address details */}
            <div
              className="border-2 border-[#0A0A0A]"
              style={{ borderWidth: 2 }}
            >
              <div className="px-4 py-2.5 border-b-2 border-[#0A0A0A] bg-[#0A0A0A]/5">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]">
                  Delivery Information
                </h3>
              </div>
              <div className="divide-y divide-[#0A0A0A]/10 text-[12px]">
                <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="font-black text-[#0A0A0A]/45 uppercase tracking-wide">
                    Address
                  </span>
                  <span className="font-bold text-[#0A0A0A] text-right">
                    {order.full_address}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="font-black text-[#0A0A0A]/45 uppercase tracking-wide">
                    Governorate
                  </span>
                  <span className="font-bold text-[#0A0A0A] text-right">
                    {order.governorate_name}
                  </span>
                </div>
                {order.shipping_fee && parseFloat(order.shipping_fee) > 0 && (
                  <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                    <span className="font-black text-[#0A0A0A]/45 uppercase tracking-wide">
                      Shipping Fee
                    </span>
                    <span className="font-black text-[#FF4D00]">
                      {fmt(parseFloat(order.shipping_fee))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const { data: ordersData = [], isLoading, refetch } = useOrderHistory();
  const orders = ordersData || [];
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o: any) => o.status === activeFilter);
  }, [orders, activeFilter]);

  if (isLoading) {
    return (
      <div>
        <Nav />
        <div className="bg-[#FAFAF7] min-h-screen mt-20 flex items-center justify-center">
          <div className="text-[13px] font-black uppercase text-[#0A0A0A] animate-pulse">
            Loading order history...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="bg-[#FAFAF7] min-h-screen mt-20">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
            Order history
          </span>
          <h1
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-4"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
            }}
          >
            My Orders
          </h1>
          <p className="text-[12px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide mb-10">
            {orders.length > 0
              ? `You have placed ${orders.length} order(s)`
              : "No orders placed yet"}
          </p>

          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap mb-8">
            {filterKeys.map((key) => {
              const count =
                key === "all"
                  ? orders.length
                  : orders.filter((o: any) => o.status === key).length;
              const active = activeFilter === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  className={[
                    "flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all",
                    active
                      ? "bg-[#0A0A0A] text-[#D4FF3D] border-2 border-[#0A0A0A]"
                      : "bg-[#FAFAF7] text-[#0A0A0A]/60 border-2 border-[#0A0A0A]/10 hover:border-[#0A0A0A]/40",
                  ].join(" ")}
                  style={{ borderWidth: 2 }}
                >
                  {key}
                  {count > 0 && (
                    <span
                      className={[
                        "text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1",
                        active ? "bg-[#D4FF3D] text-[#0A0A0A]" : "bg-[#0A0A0A]/5 text-[#0A0A0A]",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 border-3 border-dashed border-[#0A0A0A]/20 bg-[#FAFAF7] text-center"
              style={{ borderWidth: 3 }}
            >
              <div className="w-16 h-16 border-3 border-[#0A0A0A] flex items-center justify-center bg-[#D4FF3D] mb-5">
                <Package className="w-6 h-6 text-[#0A0A0A]" />
              </div>
              <p className="text-[13px] font-black uppercase text-[#0A0A0A] mb-1">
                No orders found
              </p>
              <p className="text-[11px] font-bold text-[#0A0A0A]/50 uppercase tracking-wider mb-6">
                {activeFilter === "all"
                  ? "Go find something worth wearing."
                  : `No orders are currently in "${activeFilter}" state`}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] px-6 py-3 text-[12px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Shop the drop <ArrowRight size={14} strokeWidth={3} />
              </Link>
            </div>
          )}

          {/* Orders List */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col gap-6 pb-12">
              {filteredOrders.map((order: any) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
