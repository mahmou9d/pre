"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Plus,
  Minus,
  ArrowRight,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Design tokens — streetwear / bold (matches Nav, Hero, Categories, Featured,
 * Testimonials, Newsletter, Footer, Shop page)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: gallery thumbnails sit in a thick-bordered rail; size/color
 * selectors reuse the press-button language from Shop filters; bundle
 * section behaves like a real add-to-cart calculator, not a static mock.
 */

const PRODUCT = {
  name: "Riot Hooded Bomber",
  category: "Outerwear",
  price: 2450,
  compareAt: 2900,
  rating: 4.8,
  reviewCount: 312,
  description:
    "Heavyweight shell, raw-cut hood, oversized fit built for layering. Cut from a 14oz cotton-poly blend so it holds shape wash after wash — this isn't a fast-fashion bomber.",
  details: [
    "14oz cotton-poly heavyweight shell",
    "Oversized, drop-shoulder fit",
    "YKK metal zip, raw-cut hood",
    "Made in limited batches — restocks not guaranteed",
  ],
  images: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80",
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900&q=80",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  outOfStockSizes: ["XS", "XXL"],
  colors: [
    { name: "Black", hex: "#0A0A0A" },
    { name: "Lime", hex: "#D4FF3D" },
    { name: "Grey", hex: "#8A8A85" },
  ],
};

const REVIEWS = [
  {
    name: "Youssef K.",
    handle: "@yk.fits",
    quote:
      "Stitching's heavy, fits true to size, zero regrets. Best bomber I own.",
    rating: 5,
    rotate: "-rotate-2",
    accent: "#D4FF3D",
  },
  {
    name: "Nour A.",
    handle: "@nouradel",
    quote: "Runs slightly big — sized down and it's perfect oversized.",
    rating: 4,
    rotate: "rotate-1",
    accent: "#FF4D00",
  },
  {
    name: "Omar S.",
    handle: "@omarstreet",
    quote: "Fabric weight justifies the price. Held up after a dozen washes.",
    rating: 5,
    rotate: "-rotate-1",
    accent: "#D4FF3D",
  },
];

const BUNDLE_ITEMS = [
  {
    id: "main",
    name: PRODUCT.name,
    price: PRODUCT.price,
    image: PRODUCT.images[0],
    locked: true,
  },
  {
    id: "tee",
    name: "Static Graphic Tee",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
  },
  {
    id: "cap",
    name: "Voltage Beanie",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80",
  },
];

const RELATED = [
  {
    id: 1,
    name: "Pixel Track Jacket",
    price: 2150,
    compareAt: 2600,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 2,
    name: "Carbon Puffer Vest",
    price: 1850,
    compareAt: null,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  },
  {
    id: 3,
    name: "Riot Oversized Hoodie",
    price: 1450,
    compareAt: 1800,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 4,
    name: "Voltage High-Tops",
    price: 3200,
    compareAt: null,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  },
];

const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;
const tagStyle: Record<string, string> = {
  New: "bg-[#D4FF3D] text-[#0A0A0A]",
  Sale: "bg-[#FF4D00] text-[#0A0A0A]",
  "Sold out": "bg-[#0A0A0A] text-[#FAFAF7]",
};

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  const full = Math.floor(count);
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2.5}
          className={
            i < full ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]/20"
          }
        />
      ))}
    </div>
  );
}

function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0].name);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [bundleSelected, setBundleSelected] = useState(["main", "tee"]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const toggleBundleItem = (id: string) => {
    if (id === "main") return;
    setBundleSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const bundleTotal = useMemo(
    () =>
      BUNDLE_ITEMS.filter((i) => bundleSelected.includes(i.id)).reduce(
        (sum, i) => sum + i.price,
        0,
      ),
    [bundleSelected],
  );

  return (
    <div>
      <Nav />
    <div className="bg-[#FAFAF7] min-h-screen mt-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        {/* Breadcrumb-ish tag */}
        <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-8">
          {PRODUCT.category}
        </span>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex gap-4">
              {/* Thumbnail rail */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                {PRODUCT.images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={[
                      "w-14 h-16 lg:w-16 lg:h-20 border-3 overflow-hidden flex-shrink-0 transition-all",
                      activeImage === i
                        ? "border-[#0A0A0A]"
                        : "border-[#0A0A0A]/15 opacity-60 hover:opacity-100",
                    ].join(" ")}
                    style={{ borderWidth: 3 }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div
                className="relative flex-1 aspect-[4/5] border-3 border-[#0A0A0A] overflow-hidden bg-[#0A0A0A]/5"
                style={{ borderWidth: 3 }}
              >
                <img
                  src={PRODUCT.images[activeImage]}
                  alt={PRODUCT.name}
                  className="w-full h-full object-cover"
                />
                {PRODUCT.compareAt && (
                  <span className="absolute top-4 left-4 bg-[#FF4D00] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[11px] font-black uppercase px-3 py-1.5 -rotate-2">
                    Save {fmt(PRODUCT.compareAt - PRODUCT.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div>
            <h1
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              {PRODUCT.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <Stars count={PRODUCT.rating} />
              <span className="text-[12px] font-bold text-[#0A0A0A]/50">
                {PRODUCT.rating} ({PRODUCT.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <span className="text-[26px] font-black text-[#0A0A0A]">
                {fmt(PRODUCT.price)}
              </span>
              {PRODUCT.compareAt && (
                <span className="text-[16px] font-bold text-[#0A0A0A]/40 line-through">
                  {fmt(PRODUCT.compareAt)}
                </span>
              )}
            </div>

            <p className="mt-5 text-[14px] font-bold text-[#0A0A0A]/70 leading-relaxed max-w-md">
              {PRODUCT.description}
            </p>

            {/* Color selector */}
            <div className="mt-8">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
                Color: <span className="text-[#0A0A0A]">{selectedColor}</span>
              </h3>
              <div className="flex items-center gap-3">
                {PRODUCT.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={selectedColor === c.name}
                    className={[
                      "w-9 h-9 rounded-full border-2 transition-transform flex-shrink-0",
                      selectedColor === c.name
                        ? "border-[#FF4D00] scale-110"
                        : "border-[#0A0A0A]/30",
                    ].join(" ")}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50">
                  Size
                  {selectedSize ? (
                    <span className="text-[#0A0A0A]">: {selectedSize}</span>
                  ) : null}
                </h3>
                <button
                  type="button"
                  className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 underline"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRODUCT.sizes.map((size) => {
                  const outOfStock = PRODUCT.outOfStockSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={[
                        "min-w-[48px] px-3 py-2.5 border-3 text-[12px] font-black uppercase transition-all active:translate-x-[1px] active:translate-y-[1px]",
                        outOfStock
                          ? "border-[#0A0A0A]/15 text-[#0A0A0A]/25 line-through cursor-not-allowed"
                          : selectedSize === size
                            ? "bg-[#0A0A0A] text-[#FAFAF7] border-[#0A0A0A]"
                            : "bg-transparent text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                      ].join(" ")}
                      style={{ borderWidth: 3 }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p className="mt-2.5 text-[12px] font-black uppercase text-[#0A0A0A] bg-[#FF4D00] inline-block px-2 py-1 -rotate-1">
                  Pick a size first
                </p>
              )}
            </div>

            {/* Quantity + add to cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div
                className="flex items-center border-3 border-[#0A0A0A]"
                style={{ borderWidth: 3 }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} strokeWidth={3} />
                </button>
                <span className="w-10 text-center text-[14px] font-black">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} strokeWidth={3} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={[
                  "flex-1 flex items-center justify-center gap-2 border-3 border-[#0A0A0A] py-3.5 text-[13px] font-black uppercase tracking-wide transition-all active:translate-x-[2px] active:translate-y-[2px]",
                  added
                    ? "bg-[#D4FF3D] text-[#0A0A0A]"
                    : "bg-[#0A0A0A] text-[#FAFAF7] hover:bg-[#FF4D00] hover:text-[#0A0A0A]",
                ].join(" ")}
                style={{ borderWidth: 3 }}
              >
                {added ? (
                  <>
                    <Check size={16} strokeWidth={3} /> Added to bag
                  </>
                ) : (
                  <>
                    Add to bag — {fmt(PRODUCT.price * qty)}
                    <ArrowRight size={15} strokeWidth={3} />
                  </>
                )}
              </button>
            </div>

            {/* Details list */}
            <ul className="mt-8 flex flex-col gap-2 pt-6 border-t-2 border-[#0A0A0A]/10">
              {PRODUCT.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-[12px] font-bold text-[#0A0A0A]/65"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] mt-1.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>

            {/* Shipping/return badges */}
            <div className="mt-7 grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Free shipping over 1500" },
                { icon: RotateCcw, label: "14-day returns" },
                { icon: ShieldCheck, label: "Secure checkout" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="border-2 border-[#0A0A0A]/10 p-3 flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className="text-[#0A0A0A]/60"
                  />
                  <span className="text-[10px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        <section className="mt-20 lg:mt-28 pt-12 border-t-4 border-[#0A0A0A]">
          <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rotate-1 mb-4">
            Bundle up
          </span>
          <h2
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-8"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            }}
          >
            Frequently bought together
          </h2>

          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {BUNDLE_ITEMS.map((item, i) => (
                <div key={item.id} className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleBundleItem(item.id)}
                    className={[
                      "relative w-24 h-28 lg:w-28 lg:h-32 border-3 overflow-hidden transition-all",
                      bundleSelected.includes(item.id)
                        ? "border-[#0A0A0A]"
                        : "border-[#0A0A0A]/20 opacity-50",
                      item.locked ? "cursor-default" : "cursor-pointer",
                    ].join(" ")}
                    style={{ borderWidth: 3 }}
                    disabled={item.locked}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={[
                        "absolute top-1.5 right-1.5 w-5 h-5 border-2 border-[#0A0A0A] flex items-center justify-center",
                        bundleSelected.includes(item.id)
                          ? "bg-[#D4FF3D]"
                          : "bg-[#FAFAF7]",
                      ].join(" ")}
                    >
                      {bundleSelected.includes(item.id) && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </span>
                  </button>
                  {i < BUNDLE_ITEMS.length - 1 && (
                    <Plus
                      size={18}
                      strokeWidth={2.5}
                      className="text-[#0A0A0A]/30 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3 lg:pl-6 lg:border-l-3 lg:border-[#0A0A0A]/10">
              {BUNDLE_ITEMS.filter((i) => bundleSelected.includes(i.id)).map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-[12px] font-bold text-[#0A0A0A]/70"
                  >
                    <span>{item.name}</span>
                    <span>{fmt(item.price)}</span>
                  </div>
                ),
              )}
              <div className="flex items-center justify-between pt-3 border-t-2 border-[#0A0A0A]/10">
                <span className="text-[13px] font-black uppercase text-[#0A0A0A]">
                  Bundle total
                </span>
                <span className="text-[20px] font-black text-[#0A0A0A]">
                  {fmt(bundleTotal)}
                </span>
              </div>
              <button
                type="button"
                className="mt-2 w-full sm:w-auto self-start bg-[#0A0A0A] text-[#FAFAF7] px-6 py-3 text-[12px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Add bundle to bag
              </button>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-20 lg:mt-28 pt-12 border-t-4 border-[#0A0A0A]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
                Word on the street
              </span>
              <h2
                className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
                style={{
                  fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                }}
              >
                {PRODUCT.reviewCount} reviews
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Stars count={PRODUCT.rating} size={18} />
              <span className="text-[16px] font-black text-[#0A0A0A]">
                {PRODUCT.rating} / 5
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
            {REVIEWS.map((r) => (
              <div
                key={r.handle}
                className={`relative bg-[#FAFAF7] border-3 border-[#0A0A0A] p-5 pt-7 transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 ${r.rotate}`}
                style={{ borderWidth: 3, boxShadow: "5px 5px 0 0 #0A0A0A" }}
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-[#0A0A0A]"
                  style={{ backgroundColor: r.accent }}
                />
                <Stars count={r.rating} />
                <p className="mt-3 text-[13px] font-bold text-[#0A0A0A]/85 leading-relaxed">
                  &quot;{r.quote}&quot;
                </p>
                <div className="mt-5 flex items-center gap-2 pt-3 border-t-2 border-[#0A0A0A]/10">
                  <span
                    className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{ backgroundColor: r.accent }}
                  >
                    {r.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] font-black uppercase text-[#0A0A0A]">
                      {r.name}
                    </p>
                    <p className="text-[11px] font-bold text-[#0A0A0A]/50">
                      {r.handle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related products */}
        <section className="mt-20 lg:mt-28 pt-12 border-t-4 border-[#0A0A0A] pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              }}
            >
              You&apos;ll also like
            </h2>
            <a
              href="#shop"
              className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] border-b-3 border-[#0A0A0A] pb-1"
            >
              Shop all
              <ArrowRight
                size={15}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {RELATED.map((p) => (
              <div key={p.id} className="group">
                <div
                  className="relative aspect-[3/4] border-3 border-[#0A0A0A] overflow-hidden bg-[#0A0A0A]/5"
                  style={{ borderWidth: 3 }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  {p.tag && (
                    <span
                      className={[
                        "absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 -rotate-2 border-2 border-[#0A0A0A]",
                        tagStyle[p.tag],
                      ].join(" ")}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-[13px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[14px] font-black text-[#0A0A0A]">
                    {fmt(p.price)}
                  </span>
                  {p.compareAt && (
                    <span className="text-[12px] font-bold text-[#0A0A0A]/40 line-through">
                      {fmt(p.compareAt)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
