"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  Wallet,
  Banknote,
  ChevronDown,
  ArrowRight,
  Check,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { toast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import { fbTrack } from "@/lib/fbpixel";
import { usePlaceOrder } from "@/hooks/usePayment";
import {
  useAddToCart,
  useGetCartItems,
} from "@/hooks/useCart";
import { useGetShippingGovernorates } from "@/hooks/useDashboard";
import { CartItem } from "@/type/type";

type Governorate = {
  id: number;
  name: string;
  shipping_fee: string | number;
};

type Payment = "cod" | "card" | "wallet";

const FREE_SHIPPING_THRESHOLD = 1500;
const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

const PAYMENT_METHODS = [
  {
    id: "card" as Payment,
    label: "Card",
    desc: "Visa, Mastercard, Meeza",
    icon: CreditCard,
  },
  {
    id: "wallet" as Payment,
    label: "Mobile wallet",
    desc: "Vodafone Cash, InstaPay",
    icon: Wallet,
  },
  {
    id: "cod" as Payment,
    label: "Cash on delivery",
    desc: "Pay when it arrives",
    icon: Banknote,
  },
];

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[11px] font-black uppercase text-[#FF4D00]">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: string | null) =>
  [
    "w-full bg-[#FAFAF7] border-3 px-4 py-3 text-[14px] font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/35 outline-none transition-shadow",
    hasError
      ? "border-[#FF4D00] focus:shadow-[3px_3px_0_0_#FF4D00]"
      : "border-[#0A0A0A] focus:shadow-[3px_3px_0_0_#0A0A0A]",
  ].join(" ");

function CheckoutPage() {
  const router = useRouter();
  const { mutate: addToCart } = useAddToCart();
  const { data: itemsData = [], isLoading, isFetched } = useGetCartItems();
  const items = useMemo(() => (itemsData as CartItem[]) || [], [itemsData]);

  const { mutateAsync: placeOrder } = usePlaceOrder();
  const { data: governorates } = useGetShippingGovernorates() as {
    data: Governorate[] | undefined;
  };
  const govList: Governorate[] = Array.isArray(governorates) ? governorates : [];

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    governorate: "", // holds selected governorate ID
    postal: "",
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [payment, setPayment] = useState<Payment>("cod");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [govOpen, setGovOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "flat" | "shipping";
    value: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  }, [items]);

  // Redirect to products page if cart is empty after fetch
  useEffect(() => {
    if (isFetched && items.length === 0 && !placed) {
      router.replace("/products");
    }
  }, [items, isFetched, router, placed]);

  // Track InitiateCheckout event on Facebook Pixel
  useEffect(() => {
    if (items.length > 0) {
      fbTrack("InitiateCheckout", {
        content_ids: items.map((i) => String(i.id)),
        contents: items.map((i) => ({
          id: String(i.id),
          quantity: i.quantity,
        })),
        num_items: items.reduce((s, i) => s + i.quantity, 0),
        value: subtotal,
        currency: "EGP",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  const selectedGov = govList.find((g) => String(g.id) === form.governorate);
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.type === "shipping"
      ? 0
      : selectedGov
      ? Number(selectedGov.shipping_fee)
      : 50;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    }
    if (appliedCoupon.type === "flat") {
      return appliedCoupon.value;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal - discount) + shippingCost;

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === "BLVCK10" || code === "RIOT10") {
      setAppliedCoupon({ code, type: "percent", value: 10, label: "10% off" });
      setCouponError("");
      setCouponInput("");
      toast({ title: "Coupon applied ✓", description: "10% discount on order" });
    } else if (code === "WELCOME50" || code === "RIOT50") {
      setAppliedCoupon({ code, type: "flat", value: 50, label: "EGP 50 off" });
      setCouponError("");
      setCouponInput("");
      toast({ title: "Coupon applied ✓", description: "EGP 50 discount on order" });
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code, type: "shipping", value: 0, label: "Free shipping" });
      setCouponError("");
      setCouponInput("");
      toast({ title: "Coupon applied ✓", description: "Free shipping unlocked" });
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      toast({
        title: "Invalid coupon",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const validate = () => {
    const next: Record<string, string | null> = {};
    if (!form.email.includes("@")) next.email = "Enter a valid email";
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number";
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.governorate) next.governorate = "Select a governorate";
    if (payment === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16)
        next.cardNumber = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) next.cardExpiry = "MM/YY";
      if (cardCvc.length < 3) next.cardCvc = "Invalid";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      const isLoggedIn = !!storage.getToken("access");
      if (!isLoggedIn) {
        // For guests, ensure server cart is in sync via device id
        for (const it of items) {
          if (it.variant?.id) {
            try {
              await addToCart({
                variant_id: it.variant.id,
                quantity: it.quantity,
              });
            } catch {
              // ignore
            }
          }
        }
      }

      const paymentMap: Record<Payment, string> = {
        cod: "cod",
        card: "card",
        wallet: "wallet",
      };

      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const fullAddress = `${form.address.trim()}, ${form.city.trim()}`;

      const res = await placeOrder({
        full_name: fullName,
        full_address: fullAddress,
        guest_email: form.email,
        order_notes: "",
        phone_number: form.phone,
        country: "EG",
        payment_method: paymentMap[payment],
        governorate_id: form.governorate,
      });

      localStorage.setItem("next_step", String(res.next_step));
      localStorage.setItem("order_id", String(res.order_id));
      const orderId = String(res.order_id);

      fbTrack("Purchase", {
        content_ids: items.map((i) => String(i.product_id)),
        contents: items.map((i) => ({
          id: String(i.product_id),
          quantity: i.quantity,
        })),
        num_items: items.reduce((s, i) => s + i.quantity, 0),
        value: subtotal,
        currency: "EGP",
        order_id: res?.order_id,
      });

      toast({
        title: res.message || "Order placed successfully! 🎉",
        description: "Your order has been recorded. We will contact you soon.",
      });

      setPlaced(true);
      // Wait a short duration then redirect to success page
      setTimeout(() => {
        window.location.href = "/?success=true&order=" + orderId;
      }, 1500);
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };
      const msg =
        errorResponse.response?.data?.detail ||
        errorResponse.response?.data?.message ||
        "Could not place order. Please try again.";
      toast({
        title: "Order Failed",
        description: String(msg),
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  if (isLoading || !isFetched) {
    return (
      <div>
        <Nav />
        <div className="bg-[#FAFAF7] min-h-screen mt-20 flex items-center justify-center">
          <div className="text-[13px] font-black uppercase text-[#0A0A0A] animate-pulse">
            Loading checkout...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="bg-[#FAFAF7] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 mx-auto bg-[#D4FF3D] border-3 border-[#0A0A0A] rounded-full flex items-center justify-center mb-6"
            style={{ borderWidth: 3 }}
          >
            <Check size={30} strokeWidth={3} className="text-[#0A0A0A]" />
          </div>
          <h1
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-3"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            }}
          >
            Order locked in
          </h1>
          <p className="text-[13px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide">
            Confirmation sent to {form.email || "your inbox"}. Total charged:{" "}
            {fmt(total)}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="bg-[#FAFAF7] min-h-screen mt-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <span className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
            <Lock size={12} strokeWidth={3} />
            Secure checkout
          </span>
          <h1
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-10 lg:mb-14"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            }}
          >
            Checkout
          </h1>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start">
            {/* Form column */}
            <div className="flex flex-col gap-10">
              {/* Customer info */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#0A0A0A] text-[#D4FF3D] text-[12px] font-black flex-shrink-0">
                    1
                  </span>
                  <h2 className="text-[14px] font-black uppercase tracking-wider text-[#0A0A0A]">
                    Customer information
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Email"
                    error={errors.email as string}
                    className="sm:col-span-2"
                  >
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="your@email.com"
                      className={inputClass(errors.email as string)}
                    />
                  </Field>
                  <Field label="First name" error={errors.firstName as string}>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      placeholder="Karim"
                      className={inputClass(errors.firstName as string)}
                    />
                  </Field>
                  <Field label="Last name" error={errors.lastName as string}>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      placeholder="Hassan"
                      className={inputClass(errors.lastName as string)}
                    />
                  </Field>
                  <Field
                    label="Phone"
                    error={errors.phone as string}
                    className="sm:col-span-2"
                  >
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="01XX XXX XXXX"
                      className={inputClass(errors.phone as string)}
                    />
                  </Field>
                </div>
              </section>

              {/* Shipping address */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#0A0A0A] text-[#D4FF3D] text-[12px] font-black flex-shrink-0">
                    2
                  </span>
                  <h2 className="text-[14px] font-black uppercase tracking-wider text-[#0A0A0A]">
                    Shipping address
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Street address"
                    error={errors.address as string}
                    className="sm:col-span-2"
                  >
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="12 El Tahrir St, Apt 4"
                      className={inputClass(errors.address as string)}
                    />
                  </Field>
                  <Field label="City" error={errors.city as string}>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="Nasr City"
                      className={inputClass(errors.city as string)}
                    />
                  </Field>
                  <Field label="Governorate" error={errors.governorate as string}>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setGovOpen((v) => !v)}
                        className={[
                          inputClass(errors.governorate as string),
                          "flex items-center justify-between text-left",
                        ].join(" ")}
                      >
                        <span
                          className={form.governorate ? "" : "text-[#0A0A0A]/35"}
                        >
                          {govList.find((g) => String(g.id) === form.governorate)?.name || "Select"}
                        </span>
                        <ChevronDown
                          size={15}
                          strokeWidth={2.5}
                          className={
                            govOpen
                              ? "rotate-180 transition-transform"
                              : "transition-transform"
                          }
                        />
                      </button>
                      {govOpen && (
                        <div
                          className="absolute left-0 right-0 mt-2 bg-[#FAFAF7] border-3 border-[#0A0A0A] z-20 shadow-[4px_4px_0_0_#0A0A0A] max-h-52 overflow-y-auto"
                          style={{ borderWidth: 3 }}
                        >
                          {govList.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setField("governorate", String(g.id));
                                setGovOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide border-b-2 border-[#0A0A0A]/10 last:border-b-0 hover:bg-[#D4FF3D]/40 transition-colors"
                            >
                              {g.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label="Postal code (optional)" className="sm:col-span-2">
                    <input
                      type="text"
                      value={form.postal}
                      onChange={(e) => setField("postal", e.target.value)}
                      placeholder="11511"
                      className={inputClass(errors.postal as string | null)}
                    />
                  </Field>
                </div>
              </section>

              {/* Payment method */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#0A0A0A] text-[#D4FF3D] text-[12px] font-black flex-shrink-0">
                    3
                  </span>
                  <h2 className="text-[14px] font-black uppercase tracking-wider text-[#0A0A0A]">
                    Payment method
                  </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = payment === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={[
                          "text-left p-4 border-3 transition-all",
                          active
                            ? "border-[#0A0A0A] bg-[#0A0A0A] text-[#FAFAF7]"
                            : "border-[#0A0A0A]/20 bg-[#FAFAF7] text-[#0A0A0A] hover:border-[#0A0A0A]/50",
                        ].join(" ")}
                        style={{ borderWidth: 3 }}
                        aria-pressed={active}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon
                            size={20}
                            strokeWidth={2}
                            className={
                              active ? "text-[#D4FF3D]" : "text-[#0A0A0A]/60"
                            }
                          />
                          {active && (
                            <Check
                              size={15}
                              strokeWidth={3}
                              className="text-[#D4FF3D]"
                            />
                          )}
                        </div>
                        <p className="text-[12px] font-black uppercase tracking-wide">
                          {m.label}
                        </p>
                        <p
                          className={[
                            "text-[11px] font-bold mt-0.5",
                            active ? "text-[#FAFAF7]/50" : "text-[#0A0A0A]/45",
                          ].join(" ")}
                        >
                          {m.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {payment === "card" && (
                  <div
                    className="grid sm:grid-cols-2 gap-4 p-5 border-3 border-[#0A0A0A]/15"
                    style={{ borderWidth: 3 }}
                  >
                    <Field
                      label="Card number"
                      error={errors.cardNumber as string}
                      className="sm:col-span-2"
                    >
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(e.target.value);
                          if (errors.cardNumber)
                            setErrors((p) => ({ ...p, cardNumber: null }));
                        }}
                        placeholder="4242 4242 4242 4242"
                        className={inputClass(errors.cardNumber as string)}
                      />
                    </Field>
                    <Field label="Expiry" error={errors.cardExpiry as string}>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => {
                          setCardExpiry(e.target.value);
                          if (errors.cardExpiry)
                            setErrors((p) => ({ ...p, cardExpiry: null }));
                        }}
                        placeholder="MM/YY"
                        className={inputClass(errors.cardExpiry as string)}
                      />
                    </Field>
                    <Field label="CVC" error={errors.cardCvc as string}>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => {
                          setCardCvc(e.target.value);
                          if (errors.cardCvc)
                            setErrors((p) => ({ ...p, cardCvc: null }));
                        }}
                        placeholder="123"
                        className={inputClass(errors.cardCvc as string)}
                      />
                    </Field>
                  </div>
                )}

                {payment === "cod" && (
                  <p
                    className="text-[12px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide p-4 border-3 border-[#0A0A0A]/15 bg-[#FAFAF7]"
                    style={{ borderWidth: 3 }}
                  >
                    Pay in cash when your order arrives. Have the exact amount
                    ready: {fmt(total)}.
                  </p>
                )}

                {payment === "wallet" && (
                  <p
                    className="text-[12px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide p-4 border-3 border-[#0A0A0A]/15 bg-[#FAFAF7]"
                    style={{ borderWidth: 3 }}
                  >
                    You&apos;ll get a payment prompt on your phone after placing the
                    order.
                  </p>
                )}
              </section>
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-34">
              <div className="bg-[#0A0A0A] text-[#FAFAF7] p-6 lg:p-7">
                <h2 className="text-[14px] font-black uppercase tracking-wider mb-5">
                  Order summary
                </h2>

                <div className="flex flex-col gap-3 mb-5 pb-5 border-b-2 border-[#FAFAF7]/15 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const imageUrl =
                      Array.isArray(item.variant?.images) && item.variant.images.length > 0
                        ? typeof item.variant.images[0] === "string"
                          ? item.variant.images[0]
                          : (item.variant.images[0] as { url: string }).url
                        : null;

                    const itemPrice = parseFloat(item.price);
                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-14 border-2 border-[#FAFAF7]/20 overflow-hidden flex-shrink-0 bg-[#FAFAF7]/5">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={item.variant?.product_name || item.name || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={12} className="text-[#FAFAF7]/20" />
                            </div>
                          )}
                          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#D4FF3D] text-[#0A0A0A] text-[9px] font-black flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black uppercase truncate">
                            {item.variant?.product_name || item.name || "—"}
                          </p>
                          <p className="text-[10px] font-bold text-[#FAFAF7]/40">
                            {item.variant?.volume || ""}
                            {item.variant?.color ? ` · ${item.variant.color}` : ""}
                          </p>
                        </div>
                        <span className="text-[12px] font-bold text-[#FAFAF7]/70 flex-shrink-0">
                          {fmt(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

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
                </div>

                {/* Promo Code section */}
                <div className="mt-5 pt-5 border-t-2 border-[#FAFAF7]/15">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#FAFAF7]/50 mb-2 block">
                    Promo Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#D4FF3D] border-2 border-[#0A0A0A] px-3 py-2 text-[#0A0A0A]">
                      <div className="flex items-center gap-2">
                        <Check size={14} strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase">
                          {appliedCoupon.code} applied — {appliedCoupon.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        aria-label="Remove coupon"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="ENTER CODE"
                        className="flex-1 bg-[#0A0A0A] border-2 border-[#FAFAF7]/20 px-3 py-2 text-[12px] font-bold uppercase text-[#FAFAF7] placeholder:text-[#FAFAF7]/30 outline-none focus:border-[#FAFAF7] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="bg-[#FAFAF7] text-[#0A0A0A] px-4 py-2 text-[11px] font-black uppercase hover:bg-[#D4FF3D] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="mt-1.5 text-[11px] font-black uppercase text-[#FF4D00]">
                      {couponError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-5 pt-5 border-t-2 border-[#FAFAF7]/15">
                  <span className="text-[14px] font-black uppercase">Total</span>
                  <span className="text-[24px] font-black text-[#D4FF3D]">
                    {fmt(total)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-[#D4FF3D] text-[#0A0A0A] py-4 text-[13px] font-black uppercase tracking-wide hover:bg-[#FAFAF7] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-60"
                >
                  {placing ? "Placing order..." : "Place order"}
                  {!placing && <ArrowRight size={15} strokeWidth={3} />}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[#FAFAF7]/40">
                  <ShieldCheck size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    256-bit encrypted payment
                  </span>
                </div>
              </div>

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

// Simple X icon definition for local use since we don't have it imported explicitly
const X = ({ size = 16, strokeWidth = 2, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default CheckoutPage;
