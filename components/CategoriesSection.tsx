"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useGetCategory, useGetPublicCategory } from "@/hooks/useDashboard";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: asymmetric collage grid, each card diagonally clipped at a
 * different angle (tear-sheet feel), lime overlay sweeps in on hover instead
 * of a soft fade, item-count tag echoes the Hero's rotated stamp.
 */

interface Category {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
}

const PRESETS = [
  {
    span: "lg:col-span-7 lg:row-span-2",
    clip: "polygon(0 0, 100% 0, 100% 94%, 6% 100%)",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    span: "lg:col-span-5",
    clip: "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  },
  {
    span: "lg:col-span-5",
    clip: "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  },
  {
    span: "lg:col-span-4",
    clip: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
  },
  {
    span: "lg:col-span-4",
    clip: "polygon(0 0, 100% 4%, 100% 100%, 0 100%)",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  },
];

const getCategoryImage = (name: string, index: number) => {
  const lowerName = (name || "").toLowerCase();
  if (
    lowerName.includes("outerwear") ||
    lowerName.includes("jacket") ||
    lowerName.includes("جاكيت") ||
    lowerName.includes("خارجية")
  ) {
    return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80";
  }
  if (
    lowerName.includes("tee") ||
    lowerName.includes("top") ||
    lowerName.includes("تيشرت") ||
    lowerName.includes("تي شيرت") ||
    lowerName.includes("قميص")
  ) {
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80";
  }
  if (
    lowerName.includes("bottom") ||
    lowerName.includes("pants") ||
    lowerName.includes("بنطلون") ||
    lowerName.includes("سروال")
  ) {
    return "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80";
  }
  if (
    lowerName.includes("footwear") ||
    lowerName.includes("shoes") ||
    lowerName.includes("حذاء") ||
    lowerName.includes("أحذية")
  ) {
    return "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80";
  }
  if (
    lowerName.includes("accessories") ||
    lowerName.includes("اكسسوار") ||
    lowerName.includes("إكسسوارات")
  ) {
    return "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80";
  }
  return PRESETS[index % PRESETS.length].image;
};

const CategoriesSection = () => {
  const { data: categories = [], isLoading } = useGetPublicCategory();
  const { data: categoriesData } = useGetCategory({ all: true });
  console.log(categoriesData);

  return (
    <section className="bg-[#FAFAF7] border-b-4 border-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
              Shop by category
            </span>
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
              }}
            >
              Pick your
              <br />
              Battlefield
            </h2>
          </div>
          <p className="max-w-xs text-[13px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide pb-2">
            {isLoading
              ? "Loading dynamic collections..."
              : `Explore our premium items across ${categories.length} categories — restocked weekly.`}
          </p>
        </div>

        {isLoading ? (
          /* Collage grid loader */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 lg:auto-rows-[140px]">
            {Array.from({ length: 5 }).map((_, idx) => {
              const preset = PRESETS[idx % PRESETS.length];
              return (
                <div
                  key={idx}
                  className={`relative min-h-[260px] lg:min-h-0 border-3 border-[#0A0A0A] bg-[#0A0A0A]/5 animate-pulse ${preset.span}`}
                  style={{ borderWidth: 3, clipPath: preset.clip }}
                />
              );
            })}
          </div>
        ) : categories.length === 0 ? (
          <div
            className="text-center py-10 border-3 border-dashed border-[#0A0A0A]/20"
            style={{ borderWidth: 3 }}
          >
            <p className="text-[14px] font-black uppercase text-[#0A0A0A]/60">
              No categories available at the moment.
            </p>
          </div>
        ) : (
          /* Asymmetric collage grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 lg:auto-rows-[140px]">
            {categories.map((cat: Category, index: number) => {
              const preset = PRESETS[index % PRESETS.length];
              const image = getCategoryImage(cat.name_en, index);
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.name_en)}`}
                  className={`group relative block min-h-[260px] lg:min-h-0 border-3 border-[#0A0A0A] overflow-hidden ${preset.span}`}
                  style={{ borderWidth: 3, clipPath: preset.clip }}
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={cat.name_en}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out"
                  />

                  {/* Lime sweep overlay on hover */}
                  <div className="absolute inset-0 bg-[#D4FF3D] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                  {/* Dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/10 to-transparent" />

                  {/* Count / Status stamp */}
                  <span className="absolute top-4 right-4 lg:top-5 lg:right-5 bg-[#FF4D00] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-black uppercase px-2.5 py-1 rotate-3">
                    RIOT
                  </span>

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 flex items-end justify-between">
                    <span
                      className="text-[#FAFAF7] font-black uppercase tracking-tight leading-none"
                      style={{
                        fontFamily:
                          "'Arial Black', 'Helvetica Neue', sans-serif",
                        fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                      }}
                    >
                      {cat.name_en}
                    </span>
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAFAF7] border-2 border-[#0A0A0A] flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight size={16} strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
