"use client";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Check,
  Trash2,
} from "lucide-react";

/**
 * Design tokens — streetwear / bold (matches entire site)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Data: powered by useGetCartItems / useRemoveFromCart / useUpdateCartQuantity
 */

import { useGetCartItems, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/useCart";
import { CartItem } from "@/type/type";

const FREE_SHIP_THRESHOLD = 1500;
const SHIPPING_FLAT = 100;
const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

const CartDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { data: items = [] } = useGetCartItems();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: updateQty } = useUpdateCartQuantity();

  const subtotal = (items as CartItem[]).reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity,
    0,
  );
  const itemCount = (items as CartItem[]).reduce((sum, i) => sum + i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <div
      className={[
        "fixed inset-0 z-[60] transition-opacity duration-200",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0A0A0A]/70" onClick={onClose} />

      {/* Drawer */}
      <div
        className={[
          "absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[#FAFAF7] border-l-4 border-[#0A0A0A]",
          "flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-5 border-b-3 border-[#0A0A0A] flex-shrink-0"
          style={{ borderWidth: 3 }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag
              size={19}
              strokeWidth={2.5}
              className="text-[#0A0A0A]"
            />
            <span className="text-[16px] font-black uppercase tracking-tight text-[#0A0A0A]">
              Your bag
            </span>
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D4FF3D] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
            style={{ borderWidth: 3 }}
            aria-label="Close bag"
          >
            <X size={17} strokeWidth={2.5} />
          </button>
        </div>

        {(items as CartItem[]).length === 0 ? (
          /* ── Empty state ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            {/* square border — matches site button language, not rounded */}
            <div
              className="w-16 h-16 border-3 border-[#0A0A0A] flex items-center justify-center mb-5"
              style={{ borderWidth: 3 }}
            >
              <ShoppingBag
                size={24}
                strokeWidth={2}
                className="text-[#0A0A0A]"
              />
            </div>
            <p className="text-[15px] font-black uppercase text-[#0A0A0A] mb-1.5">
              Bag&apos;s empty
            </p>
            <p className="text-[12px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide mb-6">
              Go find something worth wearing.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] px-6 py-3 text-[12px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Shop the drop <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <>
            {/* ── Free shipping progress bar ── */}
            <div className="px-6 py-3 border-b-2 border-[#0A0A0A]/10 flex-shrink-0">
              {remaining === 0 ? (
                <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]">
                  <Check
                    size={13}
                    strokeWidth={3}
                    className="text-[#0A0A0A] bg-[#D4FF3D] rounded-full p-[2px]"
                  />
                  Free shipping unlocked
                </p>
              ) : (
                <p className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/60">
                  Add <span className="text-[#0A0A0A]">{fmt(remaining)}</span>{" "}
                  more for free shipping
                </p>
              )}
              <div className="mt-2 h-1.5 w-full bg-[#0A0A0A]/10">
                <div
                  className="h-full bg-[#D4FF3D] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {(items as CartItem[]).map((item) => {
                const imageUrl =
                  Array.isArray(item.variant?.images) && item.variant.images.length > 0
                    ? typeof item.variant.images[0] === "string"
                      ? item.variant.images[0]
                      : (item.variant.images[0] as { url: string }).url
                    : null;

                return (
                  <div key={item.id} className="flex gap-4">
                    <div
                      className="w-20 h-24 border-3 border-[#0A0A0A] overflow-hidden flex-shrink-0 bg-[#0A0A0A]/5"
                      style={{ borderWidth: 3 }}
                    >
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={item.variant?.product_name || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={18} className="text-[#0A0A0A]/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[13px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                          {item.variant?.product_name || item.name || "—"}
                        </h3>
                        {/* Trash icon — more intentional than a bare X */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#0A0A0A]/25 hover:text-[#FF4D00] transition-colors flex-shrink-0 mt-0.5"
                          aria-label={`Remove ${item.variant?.product_name}`}
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-[#0A0A0A]/50 mt-0.5">
                        {item.variant?.volume || ""}
                        {item.variant?.color ? ` · ${item.variant.color}` : ""}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div
                          className="flex items-center border-3 border-[#0A0A0A]"
                          style={{ borderWidth: 3 }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateQty({
                                item_id: item.id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center text-[12px] font-black border-x-2 border-[#0A0A0A]/15">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty({
                                item_id: item.id,
                                quantity: Math.min(9, item.quantity + 1),
                              })
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} strokeWidth={3} />
                          </button>
                        </div>
                        <span className="text-[13px] font-black text-[#0A0A0A]">
                          {fmt(parseFloat(item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer / receipt block ── */}
            <div className="bg-[#0A0A0A] text-[#FAFAF7] px-6 py-6 flex-shrink-0">
              {/* Subtotal + shipping lines */}
              <div className="flex flex-col gap-2.5 mb-5 text-[12px] font-bold">
                <div className="flex items-center justify-between text-[#FAFAF7]/60">
                  <span>Subtotal</span>
                  <span className="text-[#FAFAF7]">{fmt(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[#FAFAF7]/60">
                  <span>Shipping</span>
                  <span className="text-[#FAFAF7]">
                    {shipping === 0 ? "Free" : fmt(shipping)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-5 pt-4 border-t-2 border-[#FAFAF7]/15">
                <span className="text-[13px] font-black uppercase">Total</span>
                <span className="text-[22px] font-black text-[#D4FF3D]">
                  {fmt(total)}
                </span>
              </div>

              {/* Checkout CTA — hard shadow matches site buttons */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 bg-[#D4FF3D] text-[#0A0A0A] py-3.5 text-[13px] font-black uppercase tracking-wide hover:bg-[#FAFAF7] active:translate-x-[2px] active:translate-y-[2px] shadow-[3px_3px_0_0_#FAFAF7] hover:shadow-none transition-all"
              >
                Checkout <ArrowRight size={15} strokeWidth={3} />
              </Link>

              {/* View full bag — underline style, not ghost */}
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 mt-4 text-[11px] font-black uppercase tracking-wide text-[#FAFAF7]/50 hover:text-[#FAFAF7] transition-colors border-b border-[#FAFAF7]/20 hover:border-[#FAFAF7] pb-px w-fit mx-auto"
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
