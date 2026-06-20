"use client";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
/**
 * Design tokens — streetwear / bold (matches Nav + Hero + Categories)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: regular 4-col catalog grid (intentional contrast to the
 * asymmetric Categories grid), quick-add button slides up on hover,
 * status tags reuse the rotated-stamp language from Hero/Categories.
 */

const PRODUCTS = [
  {
    name: "Riot Hooded Bomber",
    price: 2450,
    compareAt: null,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    name: "Static Graphic Tee",
    price: 850,
    compareAt: 1100,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    name: "Carbon Cargo Pants",
    price: 1950,
    compareAt: null,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  },
  {
    name: "Voltage High-Tops",
    price: 3200,
    compareAt: null,
    tag: "Sold out",
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

const FeaturedProducts = () => {
  const router = useRouter();
  return (
    <section className="bg-[#FAFAF7] border-b-4 border-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rotate-1 mb-4">
              Drop 004
            </span>
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
              }}
            >
              Fresh on
              <br />
              the rack
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] border-b-3 border-[#0A0A0A] pb-1"
          >
            Shop all
            <ArrowRight
              size={15}
              strokeWidth={3}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {PRODUCTS.map((p) => {
            const soldOut = p.tag === "Sold out";
            return (
              <div key={p.name} className="group">
                <div
                  className="relative aspect-[3/4] border-3 border-[#0A0A0A] overflow-hidden bg-[#0A0A0A]/5"
                  style={{ borderWidth: 3 }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className={[
                      "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out",
                      soldOut
                        ? "grayscale opacity-50"
                        : "group-hover:scale-105",
                    ].join(" ")}
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

                  {!soldOut && (
                    <button
                      type="button"
                      className="absolute left-3 right-3 bottom-3 flex items-center justify-center gap-2 bg-[#FAFAF7] border-3 border-[#0A0A0A] py-2.5 text-[11px] font-black uppercase tracking-wide text-[#0A0A0A] translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px]"
                      style={{ borderWidth: 3 }}
                      aria-label={`Quick add ${p.name}`}
                      onClick={() => {
                        router.push("/1");
                      }}
                    >
                      <Plus size={14} strokeWidth={3} />
                      Quick add
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h3 className="text-[13px] lg:text-[14px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                    {p.name}
                  </h3>
                </div>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
