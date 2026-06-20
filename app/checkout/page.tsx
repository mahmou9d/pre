"use client";

import { useState, useMemo } from "react";
import {
  Lock,
  CreditCard,
  Wallet,
  Banknote,
  ChevronDown,
  ArrowRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

/**
 * Design tokens — streetwear / bold (matches Nav, Hero, Shop, Product, Cart)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: form sections use the same thick-border input language as the
 * Shop search bar; payment methods are selectable cards (not radio dots);
 * order summary reuses the Cart's black receipt block with torn-edge detail.
 * Motion is deliberately calmer here than other pages — checkout earns trust
 * through clarity, not flourish.
 */

const ITEMS = [
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

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Sharqia",
  "Dakahlia",
];
const SHIPPING_FLAT = 100;
const FREE_SHIPPING_THRESHOLD = 1500;
const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Card",
    desc: "Visa, Mastercard, Meeza",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Mobile wallet",
    desc: "Vodafone Cash, InstaPay",
    icon: Wallet,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    desc: "Pay when it arrives",
    icon: Banknote,
  },
];

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
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
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    governorate: "",
    postal: "",
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [payment, setPayment] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [govOpen, setGovOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const subtotal = useMemo(
    () => ITEMS.reduce((s, i) => s + i.price * i.qty, 0),
    [],
  );
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shippingCost;

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

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
    }, 1200);
  };

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
                        {form.governorate || "Select"}
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
                        {GOVERNORATES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => {
                              setField("governorate", g);
                              setGovOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide border-b-2 border-[#0A0A0A]/10 last:border-b-0 hover:bg-[#D4FF3D]/40 transition-colors"
                          >
                            {g}
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
                  className="text-[12px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide p-4 border-3 border-[#0A0A0A]/15"
                  style={{ borderWidth: 3 }}
                >
                  Pay in cash when your order arrives. Have the exact amount
                  ready: {fmt(total)}.
                </p>
              )}

              {payment === "wallet" && (
                <p
                  className="text-[12px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide p-4 border-3 border-[#0A0A0A]/15"
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

              <div className="flex flex-col gap-3 mb-5 pb-5 border-b-2 border-[#FAFAF7]/15">
                {ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-14 border-2 border-[#FAFAF7]/20 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-[#D4FF3D] text-[#0A0A0A] text-[9px] font-black flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black uppercase truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-[#FAFAF7]/40">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <span className="text-[12px] font-bold text-[#FAFAF7]/70 flex-shrink-0">
                      {fmt(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-[13px] font-bold">
                <div className="flex items-center justify-between text-[#FAFAF7]/70">
                  <span>Subtotal</span>
                  <span className="text-[#FAFAF7]">{fmt(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[#FAFAF7]/70">
                  <span>Shipping</span>
                  <span className="text-[#FAFAF7]">
                    {shippingCost === 0 ? "Free" : fmt(shippingCost)}
                  </span>
                </div>
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

export default CheckoutPage;
