/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Design tokens — streetwear / bold (matches Nav, Hero, Categories, Featured,
 * Testimonials, Newsletter, Footer)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: filters sidebar reads like a tagged checklist (thick checkboxes,
 * no rounded pills); sort control and pagination reuse the press-button and
 * rotated-stamp language already established across the page.
 */

const CATEGORIES = [
  "Outerwear",
  "Tees & tops",
  "Bottoms",
  "Footwear",
  "Accessories",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#0A0A0A" },
  { name: "Lime", hex: "#D4FF3D" },
  { name: "Orange", hex: "#FF4D00" },
  { name: "White", hex: "#FAFAF7" },
  { name: "Grey", hex: "#8A8A85" },
];

const ALL_PRODUCTS: { id: number; name: string; category: string; price: number; compareAt: number | null; tag: string | null; color: string; sizes: string[]; image: string }[] = [
  {
    id: 1,
    name: "Riot Hooded Bomber",
    category: "Outerwear",
    price: 2450,
    compareAt: null,
    tag: "New",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 2,
    name: "Static Graphic Tee",
    category: "Tees & tops",
    price: 850,
    compareAt: 1100,
    tag: "Sale",
    color: "White",
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 3,
    name: "Carbon Cargo Pants",
    category: "Bottoms",
    price: 1950,
    compareAt: null,
    tag: null,
    color: "Black",
    sizes: ["M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  },
  {
    id: 4,
    name: "Voltage High-Tops",
    category: "Footwear",
    price: 3200,
    compareAt: null,
    tag: "Sold out",
    color: "Lime",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  },
  {
    id: 5,
    name: "Riot Crossbody Bag",
    category: "Accessories",
    price: 1100,
    compareAt: null,
    tag: null,
    color: "Orange",
    sizes: ["S"],
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
  {
    id: 6,
    name: "Pixel Track Jacket",
    category: "Outerwear",
    price: 2150,
    compareAt: 2600,
    tag: "Sale",
    color: "Grey",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 7,
    name: "Blackout Tee",
    category: "Tees & tops",
    price: 700,
    compareAt: null,
    tag: null,
    color: "Black",
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 8,
    name: "Riot Denim Shorts",
    category: "Bottoms",
    price: 1300,
    compareAt: null,
    tag: "New",
    color: "Black",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  },
  {
    id: 9,
    name: "Static Low Sneakers",
    category: "Footwear",
    price: 2800,
    compareAt: null,
    tag: null,
    color: "White",
    sizes: ["M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  },
  {
    id: 10,
    name: "Voltage Beanie",
    category: "Accessories",
    price: 450,
    compareAt: null,
    tag: null,
    color: "Lime",
    sizes: ["S"],
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
  {
    id: 11,
    name: "Carbon Puffer Vest",
    category: "Outerwear",
    price: 1850,
    compareAt: null,
    tag: null,
    color: "Orange",
    sizes: ["M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 12,
    name: "Riot Oversized Hoodie",
    category: "Tees & tops",
    price: 1450,
    compareAt: 1800,
    tag: "Sale",
    color: "Grey",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 13,
    name: "Static Wide Trousers",
    category: "Bottoms",
    price: 1650,
    compareAt: null,
    tag: null,
    color: "Black",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  },
  {
    id: 14,
    name: "Pixel Slides",
    category: "Footwear",
    price: 950,
    compareAt: null,
    tag: "New",
    color: "White",
    sizes: ["M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  },
];

const PER_PAGE = 8;
const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;
const tagStyle:{New:string, Sale:string, "Sold out":string} = {
  New: "bg-[#D4FF3D] text-[#0A0A0A]",
  Sale: "bg-[#FF4D00] text-[#0A0A0A]",
  "Sold out": "bg-[#0A0A0A] text-[#FAFAF7]",
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [sort, setSort] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], value: string) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
    setPage(1);
  };

  const resetFilters = () => {
    setActiveCategories([]);
    setActiveSizes([]);
    setActiveColors([]);
    setMaxPrice(3500);
    setSearch("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(p.category);
      const matchesSize =
        activeSizes.length === 0 ||
        p.sizes.some((s) => activeSizes.includes(s));
      const matchesColor =
        activeColors.length === 0 || activeColors.includes(p.color);
      const matchesPrice = p.price <= maxPrice;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesColor &&
        matchesPrice
      );
    });

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-asc")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, activeCategories, activeSizes, activeColors, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const activeFilterCount =
    activeCategories.length +
    activeSizes.length +
    activeColors.length +
    (maxPrice < 3500 ? 1 : 0);

  const FiltersContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[13px] font-black uppercase tracking-wider text-[#0A0A0A]">
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] font-black uppercase tracking-wide text-[#FF4D00] underline"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-7 pb-7 border-b-2 border-[#0A0A0A]/10">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <span
                className={[
                  "w-4.5 h-4.5 w-[18px] h-[18px] flex-shrink-0 border-2 border-[#0A0A0A] flex items-center justify-center transition-colors",
                  activeCategories.includes(cat)
                    ? "bg-[#D4FF3D]"
                    : "bg-transparent group-hover:bg-[#0A0A0A]/5",
                ].join(" ")}
              >
                {activeCategories.includes(cat) && (
                  <span className="w-2 h-2 bg-[#0A0A0A]" />
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={activeCategories.includes(cat)}
                onChange={() =>
                  toggle(setActiveCategories, activeCategories, cat)
                }
              />
              <span className="text-[13px] font-bold text-[#0A0A0A]/80 group-hover:text-[#0A0A0A]">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-7 pb-7 border-b-2 border-[#0A0A0A]/10">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
          Max price
        </h3>
        <input
          type="range"
          min={300}
          max={3500}
          step={50}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setPage(1);
          }}
          className="w-full accent-[#0A0A0A]"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] font-bold text-[#0A0A0A]/50">
            EGP 300
          </span>
          <span className="text-[13px] font-black text-[#0A0A0A]">
            {fmt(maxPrice)}
          </span>
        </div>
      </div>

      {/* Size */}
      <div className="mb-7 pb-7 border-b-2 border-[#0A0A0A]/10">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggle(setActiveSizes, activeSizes, size)}
              className={[
                "min-w-[40px] px-2 py-1.5 border-2 border-[#0A0A0A] text-[11px] font-black uppercase transition-colors active:translate-x-[1px] active:translate-y-[1px]",
                activeSizes.includes(size)
                  ? "bg-[#0A0A0A] text-[#FAFAF7]"
                  : "bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A]/5",
              ].join(" ")}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
          Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => toggle(setActiveColors, activeColors, c.name)}
              aria-label={c.name}
              aria-pressed={activeColors.includes(c.name)}
              className={[
                "w-8 h-8 rounded-full border-2 transition-transform flex-shrink-0",
                activeColors.includes(c.name)
                  ? "border-[#FF4D00] scale-110"
                  : "border-[#0A0A0A]/30",
              ].join(" ")}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div>
        <Nav />
    <div className="bg-[#FAFAF7] min-h-screen mt-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        {/* Page header */}
        <div className="mb-8">
          <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
            {filtered.length} pieces
          </span>
          <h1
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            }}
          >
            Full Catalog
          </h1>
        </div>

        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={2.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/50"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="w-full bg-[#FAFAF7] border-3 border-[#0A0A0A] pl-11 pr-4 py-3 text-[14px] font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 outline-none focus:shadow-[3px_3px_0_0_#0A0A0A] transition-shadow"
              style={{ borderWidth: 3 }}
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 border-3 border-[#0A0A0A] px-5 py-3 text-[12px] font-black uppercase tracking-wide bg-[#FAFAF7] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            style={{ borderWidth: 3 }}
          >
            <SlidersHorizontal size={15} strokeWidth={2.5} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D4FF3D] border-2 border-[#0A0A0A] text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="w-full sm:w-auto flex items-center justify-between gap-3 border-3 border-[#0A0A0A] px-5 py-3 text-[12px] font-black uppercase tracking-wide bg-[#FAFAF7] hover:bg-[#0A0A0A]/5 active:translate-x-[2px] active:translate-y-[2px] transition-all"
              style={{ borderWidth: 3 }}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              Sort: {SORTS.find((s) => s.value === sort)?.label}
              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className={
                  sortOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </button>
            {sortOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-[#FAFAF7] border-3 border-[#0A0A0A] z-20 shadow-[4px_4px_0_0_#0A0A0A]"
                style={{ borderWidth: 3 }}
                role="listbox"
              >
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setSort(s.value);
                      setSortOpen(false);
                    }}
                    className={[
                      "w-full text-left px-4 py-3 text-[12px] font-bold uppercase tracking-wide border-b-2 border-[#0A0A0A]/10 last:border-b-0 hover:bg-[#D4FF3D]/40 transition-colors",
                      sort === s.value
                        ? "bg-[#D4FF3D] text-[#0A0A0A]"
                        : "text-[#0A0A0A]/80",
                    ].join(" ")}
                    role="option"
                    aria-selected={sort === s.value}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-34">
              <FiltersContent />
            </div>
          </aside>

          {/* Product grid + pagination */}
          <div>
            {paginated.length === 0 ? (
              <div
                className="border-3 border-dashed border-[#0A0A0A]/20 py-20 text-center"
                style={{ borderWidth: 3 }}
              >
                <p className="text-[16px] font-black uppercase text-[#0A0A0A]/60">
                  No pieces match that
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] px-5 py-2.5 text-[12px] font-black uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
                {paginated.map((p) => {
                  const soldOut = p.tag === "Sold out";
                  return (
                    <div key={p.id} className="group">
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
                              tagStyle[p.tag as keyof typeof tagStyle],
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
                          >
                            <Plus size={14} strokeWidth={3} />
                            Quick add
                          </button>
                        )}
                      </div>
                      <h3 className="mt-3 text-[13px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                        {p.name}
                      </h3>
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  style={{ borderWidth: 3 }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const num = i + 1;
                  const isActive = num === currentPage;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPage(num)}
                      className={[
                        "w-10 h-10 flex items-center justify-center border-3 text-[13px] font-black transition-all active:translate-x-[1px] active:translate-y-[1px]",
                        isActive
                          ? "bg-[#0A0A0A] text-[#D4FF3D] border-[#0A0A0A] -rotate-2"
                          : "bg-[#FAFAF7] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                      ].join(" ")}
                      style={{ borderWidth: 3 }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {num}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  style={{ borderWidth: 3 }}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
          filtersOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-[#0A0A0A]/70"
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={[
            "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#FAFAF7] border-l-4 border-[#0A0A0A] overflow-y-auto",
            "px-6 pt-6 pb-10 transition-transform duration-300 ease-out",
            filtersOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-[16px] font-black uppercase tracking-tight text-[#0A0A0A]">
              Filters
            </span>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-9 h-9 flex items-center justify-center border-3 border-[#0A0A0A] bg-[#FAFAF7]"
              style={{ borderWidth: 3 }}
              aria-label="Close filters"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
          <FiltersContent />
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="mt-8 w-full bg-[#0A0A0A] text-[#FAFAF7] py-3.5 text-[13px] font-black uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Show {filtered.length} results
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default ShopPage;
