import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

/**
 * Design tokens — streetwear / bold (matches Nav + Hero + Categories + Featured + Testimonials + Newsletter)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: flips back to black (paper sections led up to it, lime
 * Newsletter was the peak) so the footer reads as the hard stop of the
 * page. Giant outlined wordmark anchors the bottom, same tag-block logo
 * treatment as Nav but stretched to fill the width.
 */

const FOOTER_LINKS = {
  Shop: ["New drop", "Outerwear", "Tees & tops", "Bottoms", "Footwear"],
  Brand: ["About", "Lookbook", "Stores", "Careers"],
  Support: ["Track order", "Returns", "Size guide", "Contact"],
};

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaYoutube, label: "Youtube", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-[#FAFAF7]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-16 lg:pt-20 pb-8">
        {/* Top: link columns + logo tag */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 pb-14 lg:pb-20 border-b-4 border-[#FAFAF7]/10">
          <div className="lg:col-span-4">
            <div className="inline-block -rotate-2 bg-[#D4FF3D] px-4 py-1.5 mb-5">
              <span
                className="block text-[20px] leading-none text-[#0A0A0A] font-black tracking-tighter"
                style={{
                  fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                }}
              >
                RIOT CO.
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#FAFAF7]/50 uppercase tracking-wide max-w-xs leading-relaxed">
              Heavyweight streetwear out of Cairo. No quiet basics, no restocks,
              no apologies.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border-3 border-[#FAFAF7]/20 hover:border-[#D4FF3D] hover:text-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  style={{ borderWidth: 3 }}
                >
                  <Icon size={17} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#D4FF3D] mb-4">
                  {heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] font-bold text-[#FAFAF7]/70 hover:text-[#FAFAF7] uppercase tracking-wide transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-[11px] font-bold text-[#FAFAF7]/40 uppercase tracking-wide order-2 sm:order-1">
            © 2026 Riot Co. — built for the street.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <a
              href="#"
              className="text-[11px] font-bold text-[#FAFAF7]/40 hover:text-[#FAFAF7] uppercase tracking-wide transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[11px] font-bold text-[#FAFAF7]/40 hover:text-[#FAFAF7] uppercase tracking-wide transition-colors"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Giant outlined wordmark, bleeds toward the edges */}
        <div className="mt-10 lg:mt-14 -mx-4 lg:-mx-8 overflow-hidden select-none pointer-events-none">
          <span
            className="block text-center font-black uppercase leading-none whitespace-nowrap"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(4.5rem, 14vw, 11rem)",
              WebkitTextStroke: "2px #FAFAF7",
              color: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            RIOT CO.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
