"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ArrowRight, Plus, TrendingUp, Clock } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useGetProducts } from "@/hooks/useProducts";
import { useGetCategory } from "@/hooks/useDashboard";
import Link from "next/link";

/**
 * Design tokens — streetwear / bold (matches entire site)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: search input is full-width and hero-sized at the top (not tucked
 * in a corner) — the bar IS the page header. Recent + popular searches appear
 * as thick-bordered tag chips below it, same press-button language throughout.
 */

const POPULAR = [
  "Bomber",
  "Cargo",
  "Tee",
  "Sneakers",
  "Hoodie",
  "Sale",
  "New drop",
];

const SORTS = [
  { value: "relevant", label: "Most relevant" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
];

const fmt = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return `EGP ${num.toLocaleString("en-US")}`;
};

const MAX_RECENT = 6;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [committed, setCommitted] = useState(""); // what was actually searched
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevant");
  const [recent, setRecent] = useState([
    "Bomber jacket",
    "Cargo pants",
    "Lime tee",
  ]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the committed search to avoid rapid API calls
  const debouncedSearch = useDebounce(committed, 400);

  // Fetch categories from API
  const { data: categoriesData } = useGetCategory({ all: true });
  const apiCategories = useMemo(() => {
    if (!categoriesData) return [];
    // handle both array and object shapes
    const arr = Array.isArray(categoriesData)
      ? categoriesData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (categoriesData as any)?.results ?? (categoriesData as any)?.categories ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arr.map((c: any) => ({ id: c.id, name: c.name ?? c.name_en ?? c.name_ar ?? "" }));
  }, [categoriesData]);

  const categoryNames = useMemo(
    () => ["All", ...apiCategories.map((c: { id: number; name: string }) => c.name)],
    [apiCategories],
  );

  // Fetch products from API when search is committed
  const { data: productsData, isFetching } = useGetProducts(
    debouncedSearch
      ? {
          search: debouncedSearch,
          category: category !== "All" ? category : undefined,
          all: true,
        }
      : undefined,
  );

  const rawProducts = productsData?.products ?? [];

  // Client-side sort (search/category filtering is done server-side)
  const results = useMemo(() => {
    if (!debouncedSearch) return [];
    let list = [...rawProducts];
    if (sort === "price-asc")
      list = list.sort(
        (a, b) => parseFloat(a.lowest_price) - parseFloat(b.lowest_price),
      );
    if (sort === "price-desc")
      list = list.sort(
        (a, b) => parseFloat(b.lowest_price) - parseFloat(a.lowest_price),
      );
    return list;
  }, [rawProducts, debouncedSearch, sort]);

  const pushRecent = (term: string) => {
    if (!term.trim()) return;
    setRecent((prev) =>
      [
        term,
        ...prev.filter((r) => r.toLowerCase() !== term.toLowerCase()),
      ].slice(0, MAX_RECENT),
    );
  };

  const handleSearch = (term = query) => {
    const t = term.trim();
    if (!t) return;
    pushRecent(t);
    setCommitted(t);
    setQuery(t);
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleChip = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const clearRecent = (term: string) =>
    setRecent((p) => p.filter((r) => r !== term));

  const showDropdown = focused && !committed;

  return (
    <div>
      <Nav />
      <div className="bg-[#FAFAF7] min-h-screen mt-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
          {/* ── Hero search bar ── */}
          <div className="mb-10 lg:mb-14">
            <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-5">
              Search
            </span>
            <h1
              className="text-[#0A0A0A] font-black uppercase leading-[0.85] tracking-tighter mb-7"
              style={{
                fontFamily: "'Arial Black','Helvetica Neue',sans-serif",
                fontSize: "clamp(2.25rem,6vw,4rem)",
              }}
            >
              Find your
              <br />
              next piece
            </h1>

            {/* Input */}
            <div className="relative max-w-2xl">
              <div
                className="flex border-3 border-[#0A0A0A]"
                style={{ borderWidth: 3 }}
              >
                <div className="relative flex-1">
                  <Search
                    size={18}
                    strokeWidth={2.5}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 pointer-events-none"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (committed) setCommitted("");
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Bomber, cargo, tee…"
                    className="w-full bg-[#FAFAF7] pl-12 pr-4 py-4 text-[16px] font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/35 outline-none"
                  />
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCommitted("");
                      setCategory("All");
                      inputRef.current?.focus();
                    }}
                    className="px-3 flex items-center text-[#0A0A0A]/40 hover:text-[#FF4D00] transition-colors border-l-2 border-[#0A0A0A]/15"
                    aria-label="Clear search"
                  >
                    <X size={17} strokeWidth={2.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="bg-[#0A0A0A] text-[#FAFAF7] px-6 py-4 text-[13px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all flex-shrink-0 border-l-3 border-[#0A0A0A]"
                  style={{ borderWidth: 3 }}
                >
                  Search
                </button>
              </div>

              {/* Dropdown: recent + popular (only when focused and no committed search) */}
              {showDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-[#FAFAF7] border-3 border-[#0A0A0A] z-30 shadow-[5px_5px_0_0_#0A0A0A]"
                  style={{ borderWidth: 3 }}
                >
                  {recent.length > 0 && (
                    <div className="px-5 py-4 border-b-2 border-[#0A0A0A]/10">
                      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
                        <Clock size={12} strokeWidth={2.5} /> Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <span
                            key={r}
                            className="flex items-center gap-1.5 border-2 border-[#0A0A0A]/20 px-3 py-1.5 text-[12px] font-bold text-[#0A0A0A]"
                          >
                            <button
                              type="button"
                              onClick={() => handleChip(r)}
                              className="hover:underline"
                            >
                              {r}
                            </button>
                            <button
                              type="button"
                              onClick={() => clearRecent(r)}
                              aria-label={`Remove ${r}`}
                              className="text-[#0A0A0A]/30 hover:text-[#FF4D00] transition-colors"
                            >
                              <X size={12} strokeWidth={2.5} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="px-5 py-4">
                    <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
                      <TrendingUp size={12} strokeWidth={2.5} /> Trending now
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleChip(p)}
                          className="border-2 border-[#0A0A0A] px-3 py-1.5 text-[12px] font-black uppercase tracking-wide text-[#0A0A0A] hover:bg-[#D4FF3D] transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Before search: popular + recent as page content ── */}
          {!committed && (
            <div className="flex flex-col gap-12">
              {recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      className="text-[#0A0A0A] font-black uppercase tracking-tighter"
                      style={{
                        fontFamily: "'Arial Black',sans-serif",
                        fontSize: "clamp(1.5rem,3vw,2rem)",
                      }}
                    >
                      Recent searches
                    </h2>
                    <button
                      type="button"
                      onClick={() => setRecent([])}
                      className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/40 hover:text-[#FF4D00] transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {recent.map((r) => (
                      <span
                        key={r}
                        className="flex items-center gap-2 border-3 border-[#0A0A0A] px-4 py-2.5 text-[13px] font-black uppercase tracking-wide"
                        style={{ borderWidth: 3 }}
                      >
                        <Clock
                          size={14}
                          strokeWidth={2.5}
                          className="text-[#0A0A0A]/40"
                        />
                        <button
                          type="button"
                          onClick={() => handleChip(r)}
                          className="hover:underline"
                        >
                          {r}
                        </button>
                        <button
                          type="button"
                          onClick={() => clearRecent(r)}
                          aria-label={`Remove ${r}`}
                          className="text-[#0A0A0A]/30 hover:text-[#FF4D00] transition-colors"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rotate-1 mb-5">
                  Trending now
                </span>
                <h2
                  className="text-[#0A0A0A] font-black uppercase tracking-tighter mb-6"
                  style={{
                    fontFamily: "'Arial Black',sans-serif",
                    fontSize: "clamp(1.5rem,3vw,2rem)",
                  }}
                >
                  Popular searches
                </h2>
                <div className="flex flex-wrap gap-3">
                  {POPULAR.map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleChip(p)}
                      className={[
                        "flex items-center gap-2 border-3 border-[#0A0A0A] px-5 py-3 text-[13px] font-black uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px] transition-all",
                        i === 0
                          ? "bg-[#D4FF3D] text-[#0A0A0A]"
                          : i === 1
                            ? "bg-[#FF4D00] text-[#0A0A0A]"
                            : "bg-[#FAFAF7] text-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                      ].join(" ")}
                      style={{ borderWidth: 3 }}
                    >
                      <TrendingUp size={14} strokeWidth={2.5} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── After search: filters + grid ── */}
          {committed && (
            <div>
              {/* Result meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                <div>
                  {isFetching ? (
                    <p className="text-[13px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide">
                      Searching…
                    </p>
                  ) : (
                    <>
                      <p className="text-[13px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide">
                        {results.length === 0
                          ? `No results for "${committed}"`
                          : `${results.length} result${results.length !== 1 ? "s" : ""} for`}
                      </p>
                      {results.length > 0 && (
                        <h2
                          className="text-[#0A0A0A] font-black uppercase tracking-tighter leading-tight"
                          style={{
                            fontFamily: "'Arial Black',sans-serif",
                            fontSize: "clamp(1.5rem,3vw,2rem)",
                          }}
                        >
                          &ldquo;{committed}&rdquo;
                        </h2>
                      )}
                    </>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSort(s.value)}
                      className={[
                        "px-3 py-2 text-[11px] font-black uppercase tracking-wide border-2 border-[#0A0A0A] transition-colors",
                        sort === s.value
                          ? "bg-[#0A0A0A] text-[#D4FF3D]"
                          : "bg-[#FAFAF7] text-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                      ].join(" ")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter pills — from API */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={[
                      "px-4 py-2 text-[12px] font-black uppercase tracking-wide border-3 transition-all active:translate-x-[1px] active:translate-y-[1px]",
                      category === cat
                        ? "bg-[#0A0A0A] text-[#D4FF3D] border-[#0A0A0A]"
                        : "bg-[#FAFAF7] text-[#0A0A0A] border-[#0A0A0A]/25 hover:border-[#0A0A0A]",
                    ].join(" ")}
                    style={{ borderWidth: 3 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Loading skeleton */}
              {isFetching && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="group animate-pulse">
                      <div className="aspect-[3/4] bg-[#0A0A0A]/10 border-3 border-[#0A0A0A]/10" style={{ borderWidth: 3 }} />
                      <div className="mt-3 h-4 bg-[#0A0A0A]/10 w-3/4" />
                      <div className="mt-2 h-3 bg-[#0A0A0A]/10 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Results grid */}
              {!isFetching && results.length === 0 ? (
                <div
                  className="border-3 border-dashed border-[#0A0A0A]/20 py-20 text-center"
                  style={{ borderWidth: 3 }}
                >
                  <p className="text-[15px] font-black uppercase text-[#0A0A0A]/50 mb-2">
                    Nothing found
                  </p>
                  <p className="text-[12px] font-bold text-[#0A0A0A]/40 uppercase tracking-wide mb-6">
                    Try a different keyword or browse popular searches below.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleChip(p)}
                        className="border-2 border-[#0A0A0A] px-4 py-2 text-[12px] font-black uppercase hover:bg-[#D4FF3D] transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !isFetching ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                  {results.map((p) => {
                    const thumb = p.thumbnail ?? "";
                    const isOnSale =
                      p.variants?.some((v) => v.is_on_sale) ?? false;
                    const isBestseller = p.is_bestseller;
                    const tag = isOnSale
                      ? "Sale"
                      : isBestseller
                        ? "Hot"
                        : null;
                    const tagStyle: Record<string, string> = {
                      Sale: "bg-[#FF4D00] text-[#0A0A0A]",
                      Hot: "bg-[#D4FF3D] text-[#0A0A0A]",
                    };
                    return (
                      <Link key={p.id} href={`/${p.id}`} className="group block">
                        <div
                          className="relative aspect-[3/4] border-3 border-[#0A0A0A] overflow-hidden bg-[#0A0A0A]/5"
                          style={{ borderWidth: 3 }}
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={p.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[#0A0A0A]/10 flex items-center justify-center">
                              <span className="text-[#0A0A0A]/20 text-[11px] font-black uppercase">
                                No image
                              </span>
                            </div>
                          )}
                          {tag && (
                            <span
                              className={[
                                "absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 -rotate-2 border-2 border-[#0A0A0A]",
                                tagStyle[tag],
                              ].join(" ")}
                            >
                              {tag}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/${p.id}`;
                            }}
                            className="absolute left-3 right-3 bottom-3 flex items-center justify-center gap-2 bg-[#FAFAF7] border-3 border-[#0A0A0A] py-2.5 text-[11px] font-black uppercase tracking-wide text-[#0A0A0A] translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#D4FF3D] active:translate-x-[2px] active:translate-y-[2px]"
                            style={{ borderWidth: 3 }}
                          >
                            <Plus size={13} strokeWidth={3} /> Quick view
                          </button>
                        </div>
                        <h3 className="mt-3 text-[13px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                          {p.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[14px] font-black text-[#0A0A0A]">
                            {fmt(p.lowest_price)}
                          </span>
                          <span className="text-[11px] font-bold text-[#0A0A0A]/40 uppercase">
                            {p.category_name}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              {/* Suggestions row after results */}
              {!isFetching && results.length > 0 && (
                <div className="mt-14 pt-10 border-t-4 border-[#0A0A0A]">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-4">
                    People also searched
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.filter(
                      (p) => p.toLowerCase() !== committed.toLowerCase(),
                    ).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleChip(p)}
                        className="flex items-center gap-1.5 border-2 border-[#0A0A0A]/20 px-3 py-2 text-[12px] font-bold uppercase text-[#0A0A0A]/70 hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
                      >
                        <ArrowRight size={12} strokeWidth={2.5} /> {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
