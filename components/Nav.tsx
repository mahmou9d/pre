"use client";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshDeviceID } from "../components/DeviceIDProvider";
import { useAuth } from "@/hooks/useAuth";
import { useCats } from "@/context/CatsContext";
import { useGetCartItems } from "@/hooks/useCart";

/**
 * Design tokens — streetwear / bold
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime — primary accent),
 *        #FF4D00 (signal orange — alert/badge only)
 * Added: User (login) + LayoutDashboard icons in the right cluster.
 * Language: same thick-border press-button as search & bag.
 * Toggle IS_LOGGED_IN to switch between login icon and dashboard icon.
 */

const LINKS = [
  { label: "New Drop", href: "#new", hot: true },
  { label: "Shop All", href: "/shop" },
  { label: "Archive", href: "#archive" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setCartOpen } = useCats();
  const { data: items = [] } = useGetCartItems();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const count = (items || []).reduce(
    (acc: number, item: { quantity: number }) => acc + item.quantity,
    0,
  );

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF7]">
      {/* Marquee strip */}
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
            {/* Left: mobile trigger + nav links */}
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] active:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-transform cursor-pointer"
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

            {/* Center: wordmark */}
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

            {/* Right: search + dashboard/login + bag */}
            <div className="flex items-center justify-end gap-2 flex-1">
              {/* Search */}
              <Link href="/search">
                <button
                  type="button"
                  className="hidden sm:flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                  style={{ borderWidth: 3 }}
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </Link>

              {/* Order History */}
              <button
                type="button"
                onClick={() => router.push("/ordertracking")}
                className="hidden sm:flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                style={{ borderWidth: 3 }}
                aria-label="Order history"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              </button>

              {/* Dashboard (Admin Role) */}
              {userRole === "true" && (
                <Link href="/admin">
                  <button
                    type="button"
                    className="hidden sm:flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                    style={{ borderWidth: 3 }}
                    aria-label="Admin Dashboard"
                  >
                    <LayoutDashboard size={18} strokeWidth={2.5} />
                  </button>
                </Link>
              )}

              {/* Dashboard (logged in) OR Login (logged out) */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    RefreshDeviceID();
                  }}
                  className="hidden sm:flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                  style={{ borderWidth: 3 }}
                  aria-label="Log out"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                </button>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    className="hidden sm:flex items-center justify-center gap-1.5 h-10 px-3 border-3 border-[#0A0A0A] bg-[#FAFAF7] hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                    style={{ borderWidth: 3 }}
                    aria-label="Log in"
                  >
                    <User size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black uppercase tracking-wide hidden lg:block">
                      Login
                    </span>
                  </button>
                </Link>
              )}

              {/* Bag */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex w-10 h-10 items-center justify-center border-3 border-[#0A0A0A] bg-[#0A0A0A] hover:bg-[#FF4D00] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                style={{ borderWidth: 3 }}
                aria-label={`Bag, ${count} items`}
              >
                <ShoppingBag size={18} strokeWidth={2.5} color="#FAFAF7" />
                {count > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#D4FF3D] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
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

            {/* Mobile: Admin Dashboard if userRole === "true" */}
            {userRole === "true" && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[22px] font-black uppercase tracking-tight text-[#0A0A0A] border-b-3 border-[#0A0A0A]/15 pb-3"
              >
                <LayoutDashboard size={20} strokeWidth={2.5} /> Dashboard
              </Link>
            )}

            {/* Mobile: Order History */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                router.push("/order-history");
              }}
              className="flex items-center gap-2 text-[22px] font-black uppercase tracking-tight text-[#0A0A0A] border-b-3 border-[#0A0A0A]/15 pb-3 text-left w-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block mr-2"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              <span>Orders</span>
            </button>

            {/* Mobile: logout or login link inside drawer */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  RefreshDeviceID();
                }}
                className="flex items-center gap-2 text-[22px] font-black uppercase tracking-tight text-[#0A0A0A] border-b-3 border-[#0A0A0A]/15 pb-3 text-left w-full cursor-pointer"
              >
                <LogOut size={20} strokeWidth={2.5} /> Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[22px] font-black uppercase tracking-tight text-[#0A0A0A] border-b-3 border-[#0A0A0A]/15 pb-3"
              >
                <User size={20} strokeWidth={2.5} /> Login
              </Link>
            )}
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
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
};

export default Nav;
