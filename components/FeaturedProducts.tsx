"use client";

import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetProducts } from "@/hooks/useProducts";
import { Product } from "@/type/type";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero + Categories)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: regular 4-col catalog grid (intentional contrast to the
 * asymmetric Categories grid), quick-add button slides up on hover,
 * status tags reuse the rotated-stamp language from Hero/Categories.
 */

const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

const tagStyle: Record<string, string> = {
  New: "bg-[#D4FF3D] text-[#0A0A0A]",
  Sale: "bg-[#FF4D00] text-[#0A0A0A]",
  "Sold out": "bg-[#0A0A0A] text-[#FAFAF7]",
};

const FeaturedProducts = () => {
  const router = useRouter();
  const { data, isLoading } = useGetProducts({ page: 1, all: false });

  const productsList = (data?.products || []).slice(0, 4);

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

        {isLoading ? (
          /* Loading skeletons */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="group animate-pulse">
                <div
                  className="relative aspect-[3/4] border-3 border-[#0A0A0A] bg-[#0A0A0A]/5"
                  style={{ borderWidth: 3 }}
                />
                <div className="h-4 bg-[#0A0A0A]/10 mt-3 w-3/4 rounded" />
                <div className="h-4 bg-[#0A0A0A]/10 mt-2 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : productsList.length === 0 ? (
          <div
            className="text-center py-10 border-3 border-dashed border-[#0A0A0A]/20"
            style={{ borderWidth: 3 }}
          >
            <p className="text-[14px] font-black uppercase text-[#0A0A0A]/60">
              No products found in this drop.
            </p>
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {productsList.map((p: Product) => {
              const isSoldOut =
                p.variants &&
                p.variants.length > 0 &&
                p.variants.every((v) => v.stock <= 0);

              const priceVal =
                p.variants && p.variants[0]
                  ? parseFloat(p.variants[0].price)
                  : parseFloat(p.lowest_price || "0");

              const compareAtVal =
                p.variants && p.variants[0]?.compare_at_price
                  ? parseFloat(p.variants[0].compare_at_price)
                  : null;

              const isOnSale = p.variants && p.variants[0]?.is_on_sale;

              let computedTag: string | null = null;
              if (isSoldOut) {
                computedTag = "Sold out";
              } else if (isOnSale && compareAtVal && compareAtVal > priceVal) {
                computedTag = "Sale";
              } else if (p.is_bestseller) {
                computedTag = "New";
              }

              const image =
                p.thumbnail ||
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80";

              return (
                <div key={p.id} className="group">
                  <Link href={`/${p.id}`}>
                    <div
                      className="relative aspect-[3/4] border-3 border-[#0A0A0A] overflow-hidden bg-[#0A0A0A]/5 cursor-pointer"
                      style={{ borderWidth: 3 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={p.name_en}
                        className={[
                          "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out",
                          isSoldOut
                            ? "grayscale opacity-50"
                            : "group-hover:scale-105",
                        ].join(" ")}
                      />

                      {computedTag && (
                        <span
                          className={[
                            "absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 -rotate-2 border-2 border-[#0A0A0A]",
                            tagStyle[computedTag],
                          ].join(" ")}
                        >
                          {computedTag}
                        </span>
                      )}

                      {!isSoldOut && (
                        <button
                          type="button"
                          className="absolute left-3 right-3 bottom-3 flex items-center justify-center gap-2 bg-[#FAFAF7] border-3 border-[#0A0A0A] py-2.5 text-[11px] font-black uppercase tracking-wide text-[#0A0A0A] translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                          style={{ borderWidth: 3 }}
                          aria-label={`Quick view ${p.name_en}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/${p.id}`);
                          }}
                        >
                          <Plus size={14} strokeWidth={3} />
                          Quick view
                        </button>
                      )}
                    </div>
                  </Link>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <Link href={`/${p.id}`} className="hover:underline">
                      <h3 className="text-[13px] lg:text-[14px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                        {p.name_en}
                      </h3>
                    </Link>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[14px] font-black text-[#0A0A0A]">
                      {fmt(priceVal)}
                    </span>
                    {compareAtVal && (
                      <span className="text-[12px] font-bold text-[#0A0A0A]/40 line-through">
                        {fmt(compareAtVal)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
