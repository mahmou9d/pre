"use client";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

/**
 * Design tokens — streetwear / bold
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime — primary accent),
 *        #FF4D00 (signal orange — alert/badge only)
 * Type: display = heavy condensed sans, all-caps, tight tracking
 * Signature: nav links skew on hover like a sticker peeling; logo sits in a
 * slightly rotated tag block instead of sitting flat in the row.
 */

const LINKS = [
  { label: "New Drop", href: "#new", hot: true },
  { label: "Shop All", href: "/shop" },
  { label: "Archive", href: "#archive" },
  { label: "Lookbook", href: "#lookbook" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF7]">
      {/* Marquee strip — loud, raw, always moving */}
      <div className="hidden md:flex items-center h-8 bg-[#0A0A0A] overflow-hidden whitespace-nowrap border-b-4 border-[#0A0A0A]">
        <div className="animate-[marquee_18s_linear_infinite] flex gap-10 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[11px] font-black uppercase tracking-wider text-[#D4FF3D] flex items-center gap-2"
            >
              Free shipping over 1500 EGP{" "}
              <span className="text-[#FAFAF7]">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div
        className={[
          "border-b-4 border-[#0A0A0A] transition-shadow duration-200",
          scrolled ? "shadow-[0_4px_0_0_#0A0A0A]" : "",
        ].join(" ")}
      >
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="h-[72px] lg:h-20 flex items-center justify-between gap-4">
            {/* Left: mobile trigger + links */}
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] active:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-transform"
                style={{ borderWidth: 3 }}
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={2.5} />
              </button>

              <nav className="hidden lg:flex items-center gap-1">
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group relative px-4 py-2 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] transition-transform duration-150 ease-out hover:-skew-x-6 hover:bg-[#D4FF3D]"
                  >
                    {link.label}
                    {link.hot && (
                      <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#FF4D00] align-middle animate-pulse" />
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Center: wordmark, tag-style */}
            <Link
              href="/"
              className="flex-shrink-0 select-none"
              aria-label="Home"
            >
              <div
                className="-rotate-2 bg-[#0A0A0A] px-4 py-1.5 border-3"
                style={{ borderWidth: 3, borderColor: "#0A0A0A" }}
              >
                <span
                  className="block text-[20px] lg:text-[24px] leading-none text-[#FAFAF7] font-black tracking-tighter"
                  style={{
                    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                  }}
                >
                  RIOT<span className="text-[#D4FF3D]">CO.</span>
                </span>
              </div>
            </Link>

            {/* Right: search + bag */}
            <div className="flex items-center justify-end gap-2 flex-1">
              <button
                type="button"
                className="hidden sm:flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                style={{ borderWidth: 3 }}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>
              <Link href="/cart">
                <button
                  type="button"
                  className="relative flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#0A0A0A] hover:bg-[#FF4D00] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  style={{ borderWidth: 3 }}
                  aria-label="Bag, 2 items"
                >
                  <ShoppingBag size={18} strokeWidth={2.5} color="#FAFAF7" />
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#D4FF3D] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">
                    2
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-[#0A0A0A]/70"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={[
            "absolute top-0 right-0 h-full w-[82%] max-w-sm bg-[#D4FF3D] border-l-4 border-[#0A0A0A]",
            "flex flex-col px-6 pt-6 transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="text-[18px] font-black uppercase tracking-tight text-[#0A0A0A]">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7]"
              style={{ borderWidth: 3 }}
              aria-label="Close menu"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[22px] font-black uppercase tracking-tight text-[#0A0A0A] border-b-3 border-[#0A0A0A]/15 pb-3"
              >
                {link.label}
                {link.hot && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                )}
              </a>
            ))}
          </nav>

          <div className="mt-auto mb-8 pt-4 border-t-3 border-[#0A0A0A]">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]">
              Free shipping over 1500 EGP
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
};

export default Nav;
