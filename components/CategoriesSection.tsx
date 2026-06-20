import { ArrowUpRight } from "lucide-react";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: asymmetric collage grid, each card diagonally clipped at a
 * different angle (tear-sheet feel), lime overlay sweeps in on hover instead
 * of a soft fade, item-count tag echoes the Hero's rotated stamp.
 */

const CATEGORIES = [
  {
    name: "Outerwear",
    count: 24,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    span: "lg:col-span-7 lg:row-span-2",
    clip: "polygon(0 0, 100% 0, 100% 94%, 6% 100%)",
  },
  {
    name: "Tees & Tops",
    count: 38,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    span: "lg:col-span-5",
    clip: "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
  },
  {
    name: "Bottoms",
    count: 19,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    span: "lg:col-span-5",
    clip: "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
  },
  {
    name: "Footwear",
    count: 16,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    span: "lg:col-span-4",
    clip: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)",
  },
  {
    name: "Accessories",
    count: 27,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    span: "lg:col-span-4",
    clip: "polygon(0 0, 100% 4%, 100% 100%, 0 100%)",
  },
];

const CategoriesSection = () => {
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
            124 pieces across 5 categories — restocked weekly, never the same
            twice.
          </p>
        </div>

        {/* Asymmetric collage grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 lg:auto-rows-[140px]">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`group relative block min-h-[260px] lg:min-h-0 border-3 border-[#0A0A0A] overflow-hidden ${cat.span}`}
              style={{ borderWidth: 3, clipPath: cat.clip }}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out"
              />

              {/* Lime sweep overlay on hover */}
              <div className="absolute inset-0 bg-[#D4FF3D] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

              {/* Dark gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/10 to-transparent" />

              {/* Count stamp */}
              <span className="absolute top-4 right-4 lg:top-5 lg:right-5 bg-[#FF4D00] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-black uppercase px-2.5 py-1 rotate-3">
                {cat.count} items
              </span>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 flex items-end justify-between">
                <span
                  className="text-[#FAFAF7] font-black uppercase tracking-tight leading-none"
                  style={{
                    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                    fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                  }}
                >
                  {cat.name}
                </span>
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAFAF7] border-2 border-[#0A0A0A] flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
