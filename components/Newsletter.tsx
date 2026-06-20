"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero + Categories + Featured + Testimonials)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: full-bleed lime block (the one section that flips the palette
 * instead of paper-on-black) so it reads as a hard stop in the scroll.
 * Input + button share the same tactile press as every other CTA.
 */

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a real email, not a fake one.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="relative bg-[#D4FF3D] border-b-4 border-[#0A0A0A] overflow-hidden">
      {/* Diagonal stripe texture, kept subtle */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #0A0A0A 0px, #0A0A0A 2px, transparent 2px, transparent 28px)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: headline */}
          <div className="lg:col-span-7">
            <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-2 mb-5">
              No spam, just drops
            </span>
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.85] tracking-tighter"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
              }}
            >
              First in line,
              <br />
              every drop
            </h2>
            <p className="mt-5 max-w-md text-[14px] font-bold text-[#0A0A0A]/70 uppercase tracking-wide">
              Join 40,000+ on the list. Early access, restock alerts, 10% off
              your first order.
            </p>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-5">
            {submitted ? (
              <div
                className="bg-[#0A0A0A] border-3 border-[#0A0A0A] px-6 py-6 flex items-center gap-3"
                style={{ borderWidth: 3 }}
              >
                <span className="w-9 h-9 rounded-full bg-[#D4FF3D] flex items-center justify-center flex-shrink-0">
                  <Check size={18} strokeWidth={3} className="text-[#0A0A0A]" />
                </span>
                <div>
                  <p className="text-[#FAFAF7] font-black uppercase text-[13px] tracking-wide">
                    You&apos;re on the list
                  </p>
                  <p className="text-[#FAFAF7]/60 text-[12px] font-bold mt-0.5">
                    Check your inbox for your 10% code.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="flex-1 bg-[#FAFAF7] border-3 border-[#0A0A0A] px-4 py-3.5 text-[14px] font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 outline-none focus:bg-[#FAFAF7] focus:shadow-[3px_3px_0_0_#0A0A0A]"
                    style={{ borderWidth: 3 }}
                  />
                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-2 bg-[#0A0A0A] border-3 border-[#0A0A0A] px-7 py-3.5 text-[13px] font-black uppercase tracking-wide text-[#FAFAF7] hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all flex-shrink-0"
                    style={{ borderWidth: 3 }}
                  >
                    Join
                    <ArrowRight
                      size={15}
                      strokeWidth={3}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
                {error && (
                  <p className="mt-2.5 text-[12px] font-black uppercase text-[#0A0A0A] bg-[#FF4D00] inline-block px-2 py-1 -rotate-1">
                    {error}
                  </p>
                )}
                <p className="mt-3 text-[11px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide">
                  Unsubscribe anytime. We don&apos;t sell your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
