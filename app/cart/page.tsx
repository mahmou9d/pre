"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Minus,
  X,
  Tag,
  ArrowRight,
  ShoppingBag,
  Lock,
  Check,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

/**
 * Design tokens — streetwear / bold (matches Nav, Hero, Shop, Product page)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: cart items sit in a thick-bordered list (not soft cards) so it
 * reads like a packing slip; coupon field shares the press-button language;
 * order summary is a sticky receipt block with a torn-edge bottom.
 */

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Riot Hooded Bomber",
    color: "Black",
    size: "L",
    price: 2450,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80",
  },
  {
    id: 2,
    name: "Static Graphic Tee",
    color: "White",
    size: "M",
    price: 850,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
  },
  {
    id: 3,
    name: "Voltage Beanie",
    color: "Lime",
    size: "One size",
    price: 450,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80",
  },
];

const VALID_COUPONS: Record<string, { type: string; value: number; label: string }> = {
  RIOT10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping" },
};

const SHIPPING_FLAT = 100;
const FREE_SHIPPING_THRESHOLD = 1500;

const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState("");

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(9, item.qty + delta)) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.type === "shipping"
      ? 0
      : SHIPPING_FLAT;

  const discount =
    appliedCoupon?.type === "percent"
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : 0;

  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const match = VALID_COUPONS[code];
    if (match) {
      setAppliedCoupon({ code, ...match });
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("That code doesn't exist. Check it and try again.");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAF7] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 mx-auto border-3 border-[#0A0A0A] rounded-full flex items-center justify-center mb-6"
            style={{ borderWidth: 3 }}
          >
            <ShoppingBag size={28} strokeWidth={2} className="text-[#0A0A0A]" />
          </div>
          <h1
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-3"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            }}
          >
            Bag&apos;s empty
          </h1>
          <p className="text-[13px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide mb-7">
            Nothing in here yet. Go find something worth wearing.
          </p>
          <a
            href="#shop"
            className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] px-7 py-3.5 text-[13px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Shop the drop
            <ArrowRight size={15} strokeWidth={3} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
        <Nav />
    <div className="bg-[#FAFAF7] min-h-screen mt-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
          {items.reduce((s, i) => s + i.qty, 0)} items
        </span>
        <h1
          className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-10 lg:mb-14"
          style={{
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
          }}
        >
          Your bag
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start">
          {/* Cart items */}
          <div>
            <div className="hidden md:grid grid-cols-[80px_1fr_auto_auto_auto] gap-4 pb-3 mb-3 border-b-2 border-[#0A0A0A]/15">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50">
                Item
              </span>
              <span />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50">
                Price
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50">
                Qty
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 text-right">
                Total
              </span>
            </div>

            <div className="flex flex-col">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_1fr_auto_auto_auto] gap-4 items-center py-5 border-b-2 border-[#0A0A0A]/10"
                >
                  <div
                    className="w-20 h-24 border-3 border-[#0A0A0A] overflow-hidden flex-shrink-0"
                    style={{ borderWidth: 3 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[14px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[12px] font-bold text-[#0A0A0A]/50 mt-1">
                      {item.color} · {item.size}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="md:hidden flex items-center gap-1 text-[11px] font-black uppercase text-[#FF4D00] mt-2"
                    >
                      <X size={12} strokeWidth={3} /> Remove
                    </button>
                    <p className="md:hidden mt-2 text-[14px] font-black text-[#0A0A0A]">
                      {fmt(item.price * item.qty)}
                    </p>
                  </div>

                  <span className="hidden md:block text-[13px] font-bold text-[#0A0A0A]/70">
                    {fmt(item.price)}
                  </span>

                  <div
                    className="hidden md:flex items-center border-3 border-[#0A0A0A]"
                    style={{ borderWidth: 3 }}
                  >
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-[13px] font-black">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={3} />
                    </button>
                  </div>

                  <div className="hidden md:flex items-center gap-4 justify-end">
                    <span className="text-[14px] font-black text-[#0A0A0A]">
                      {fmt(item.price * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center border-2 border-[#0A0A0A]/15 hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Mobile qty control */}
                  <div
                    className="md:hidden col-span-2 flex items-center border-3 border-[#0A0A0A] w-fit"
                    style={{ borderWidth: 3 }}
                  >
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="w-9 h-9 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-[13px] font-black">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="w-9 h-9 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon section */}
            <div className="mt-8">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
                Got a code?
              </h3>
              {appliedCoupon ? (
                <div
                  className="flex items-center justify-between bg-[#D4FF3D] border-3 border-[#0A0A0A] px-4 py-3"
                  style={{ borderWidth: 3 }}
                >
                  <div className="flex items-center gap-2.5">
                    <Check
                      size={16}
                      strokeWidth={3}
                      className="text-[#0A0A0A]"
                    />
                    <span className="text-[13px] font-black uppercase text-[#0A0A0A]">
                      {appliedCoupon.code} applied — {appliedCoupon.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                  >
                    <X size={16} strokeWidth={2.5} className="text-[#0A0A0A]" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Tag
                      size={15}
                      strokeWidth={2.5}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40"
                    />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      placeholder="Enter promo code"
                      className="w-full bg-[#FAFAF7] border-3 border-[#0A0A0A] pl-10 pr-3 py-3 text-[13px] font-bold uppercase text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 placeholder:normal-case outline-none focus:shadow-[3px_3px_0_0_#0A0A0A] transition-shadow"
                      style={{ borderWidth: 3 }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-[#0A0A0A] text-[#FAFAF7] px-6 py-3 text-[12px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-2.5 text-[12px] font-black uppercase text-[#0A0A0A] bg-[#FF4D00] inline-block px-2 py-1 -rotate-1">
                  {couponError}
                </p>
              )}
              <p className="mt-3 text-[11px] font-bold text-[#0A0A0A]/40 uppercase tracking-wide">
                Try RIOT10 or FREESHIP
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-34">
            <div className="bg-[#0A0A0A] text-[#FAFAF7] p-6 lg:p-7">
              <h2 className="text-[14px] font-black uppercase tracking-wider mb-6">
                Order summary
              </h2>

              <div className="flex flex-col gap-3 text-[13px] font-bold">
                <div className="flex items-center justify-between text-[#FAFAF7]/70">
                  <span>Subtotal</span>
                  <span className="text-[#FAFAF7]">{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#D4FF3D]">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#FAFAF7]/70">
                  <span>Shipping</span>
                  <span className="text-[#FAFAF7]">
                    {shippingCost === 0 ? "Free" : fmt(shippingCost)}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && shippingCost > 0 && (
                  <p className="text-[11px] font-bold text-[#FAFAF7]/40 uppercase tracking-wide">
                    Add {fmt(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
                    shipping
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t-2 border-[#FAFAF7]/15">
                <span className="text-[14px] font-black uppercase">Total</span>
                <span className="text-[24px] font-black text-[#D4FF3D]">
                  {fmt(total)}
                </span>
              </div>
<Link href="/checkout">
              <button
                type="button"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#D4FF3D] text-[#0A0A0A] py-4 text-[13px] font-black uppercase tracking-wide hover:bg-[#FAFAF7] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Checkout
                <ArrowRight size={15} strokeWidth={3} />
              </button>
</Link>
              <div className="flex items-center justify-center gap-2 mt-4 text-[#FAFAF7]/40">
                <Lock size={12} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  Secure checkout
                </span>
              </div>
            </div>

            {/* Torn-edge bottom detail */}
            <div
              className="h-3 bg-[#0A0A0A]"
              style={{
                clipPath:
                  "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default CartPage;
