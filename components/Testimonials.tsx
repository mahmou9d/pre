import { Star } from "lucide-react";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero + Categories + Featured)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: cards read like pinned notes/DMs rather than review widgets —
 * slight alternating rotation, hard shadow instead of blur, handle-style
 * names. Stars are hand-drawn-feeling (solid, blocky) not soft icon defaults.
 */

const REVIEWS = [
  {
    name: "Youssef K.",
    handle: "@yk.fits",
    quote:
      "Copped the bomber day one. Stitching's heavy, fits true to size, zero regrets. This is the only brand I check every drop.",
    rating: 5,
    rotate: "-rotate-2",
    accent: "#D4FF3D",
  },
  {
    name: "Nour A.",
    handle: "@nouradel",
    quote:
      "Quick add actually worked at checkout for once. Got the cargo pants before they sold out in 20 minutes. Wild demand.",
    rating: 5,
    rotate: "rotate-1",
    accent: "#FF4D00",
  },
  {
    name: "Omar S.",
    handle: "@omarstreet",
    quote:
      "Not gonna lie I was skeptical of the price but the fabric weight justifies it. Tee held up after a dozen washes.",
    rating: 4,
    rotate: "-rotate-1",
    accent: "#D4FF3D",
  },
  {
    name: "Lina F.",
    handle: "@linaf_",
    quote:
      "Shipping was fast, packaging alone felt like a drop reveal. Brand gets the full experience, not just the product.",
    rating: 5,
    rotate: "rotate-2",
    accent: "#FF4D00",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        strokeWidth={2.5}
        className={
          i < count ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]/20"
        }
      />
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="bg-[#FAFAF7] border-b-4 border-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
              Word on the street
            </span>
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
              }}
            >
              No filter
              <br />
              feedback
            </h2>
          </div>
          <p className="max-w-xs text-[13px] font-bold text-[#0A0A0A]/60 uppercase tracking-wide pb-2">
            4.8 average from 1,200+ verified buyers — pulled straight from real
            orders.
          </p>
        </div>

        {/* Pinned-note grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7 pt-2">
          {REVIEWS.map((r) => (
            <div
              key={r.handle}
              className={`relative bg-[#FAFAF7] border-3 border-[#0A0A0A] p-5 pt-7 transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 ${r.rotate}`}
              style={{
                borderWidth: 3,
                boxShadow: "5px 5px 0 0 #0A0A0A",
              }}
            >
              {/* Pin dot */}
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
      </div>
    </section>
  );
};

export default Testimonials;
