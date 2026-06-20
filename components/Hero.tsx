import { ArrowRight } from "lucide-react";

/**
 * Design tokens — streetwear / bold (matches Nav)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Type: display = heavy condensed sans, all-caps, tight tracking, big scale
 * Signature: headline cuts across a diagonal-clipped lime block; "SS26" stamp
 * rotated like the Nav logo tag; CTA has the same tactile press as Nav buttons.
 */

const Hero = () => {
  return (
    <section className="relative bg-[#FAFAF7] border-b-4 border-[#0A0A0A] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          {/* Left: headline block */}
          <div className="lg:col-span-7 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
                Drop 004 — live now
              </span>
            </div>

            <h1
              className="text-[#0A0A0A] font-black uppercase leading-[0.85] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(3rem, 9vw, 7.5rem)",
              }}
            >
              WEAR
              <br />
              THE
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#FAFAF7] px-2">NOISE</span>
                <span className="absolute inset-0 bg-[#0A0A0A] -rotate-1 -z-0" />
              </span>
            </h1>

            <p className="mt-8 max-w-md text-[15px] lg:text-base font-bold text-[#0A0A0A]/70 uppercase tracking-wide">
              No quiet basics. Heavyweight fits, raw seams, built for the street
              — not the showroom.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="group flex items-center gap-2 bg-[#D4FF3D] border-3 border-[#0A0A0A] px-7 py-3.5 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#D4FF3D] active:translate-x-[3px] active:translate-y-[3px] transition-all"
                style={{ borderWidth: 3 }}
              >
                Shop the drop
                <ArrowRight
                  size={16}
                  strokeWidth={3}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                type="button"
                className="px-7 py-3.5 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] border-3 border-[#0A0A0A]/0 hover:border-[#0A0A0A] transition-colors"
                style={{ borderWidth: 3 }}
              >
                Watch lookbook
              </button>
            </div>
          </div>

          {/* Right: diagonal-clipped visual block + rotated stamp */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative w-full aspect-[4/5] bg-[#0A0A0A] border-3 border-[#0A0A0A]"
              style={{
                borderWidth: 3,
                clipPath: "polygon(8% 0, 100% 0, 100% 92%, 0 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(135deg, #D4FF3D 0px, #D4FF3D 2px, #0A0A0A 2px, #0A0A0A 40px)",
                }}
              />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-[#FAFAF7] text-[12px] font-black uppercase tracking-widest">
                  Issue No. 04 — Riot Co.
                </span>
              </div>
            </div>

            {/* Rotated stamp badge, echoes Nav logo tag */}
            <div
              className="absolute -top-5 -left-5 lg:-left-8 bg-[#FF4D00] border-3 border-[#0A0A0A] w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center rotate-12 shadow-[4px_4px_0_0_#0A0A0A]"
              style={{ borderWidth: 3 }}
            >
              <span className="text-[#0A0A0A] text-[11px] lg:text-[12px] font-black uppercase text-center leading-tight -rotate-12">
                SS
                <br />
                26
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker, same language as Nav marquee */}
      <div className="hidden md:flex items-center h-9 bg-[#0A0A0A] overflow-hidden whitespace-nowrap border-t-4 border-[#0A0A0A]">
        <div className="animate-[marquee_22s_linear_infinite] flex gap-10 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[11px] font-black uppercase tracking-wider text-[#D4FF3D] flex items-center gap-2"
            >
              Drop 004 out now <span className="text-[#FAFAF7]">★</span> Limited
              run, no restock <span className="text-[#FAFAF7]">★</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
