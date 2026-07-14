"use client";

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Plus,
  Minus,
  ArrowRight,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useGetProducts, useGetSingleProduct } from "@/hooks/useProducts";
import { useGetReviews, useAddReview } from "@/hooks/useReviews";
import { useAddToCart } from "@/hooks/useCart";
import { useCats } from "@/context/CatsContext";

/* ── Helpers ── */
const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

const tagStyle: Record<string, string> = {
  New: "bg-[#D4FF3D] text-[#0A0A0A]",
  Sale: "bg-[#FF4D00] text-[#0A0A0A]",
  "Sold out": "bg-[#0A0A0A] text-[#FAFAF7]",
};

/* ── Color map (Arabic / English → CSS) ── */
const COLOR_MAP: Record<string, string> = {
  أسود: "#000000",
  اسود: "#000000",
  black: "#000000",
  أبيض: "#ffffff",
  ابيض: "#ffffff",
  white: "#ffffff",
  كريمي: "#f5e9d4",
  cream: "#f5e9d4",
  زيتي: "#6b7340",
  olive: "#6b7340",
  برتقالي: "#d2691e",
  orange: "#d2691e",
  أحمر: "#dc2626",
  احمر: "#dc2626",
  red: "#dc2626",
  أزرق: "#2563eb",
  ازرق: "#2563eb",
  blue: "#2563eb",
  أخضر: "#16a34a",
  اخضر: "#16a34a",
  green: "#16a34a",
  أصفر: "#facc15",
  اصفر: "#facc15",
  yellow: "#facc15",
  رمادي: "#6b7280",
  gray: "#6b7280",
  grey: "#6b7280",
  بني: "#7c4a1e",
  brown: "#7c4a1e",
  وردي: "#ec4899",
  pink: "#ec4899",
  بنفسجي: "#8b5cf6",
  purple: "#8b5cf6",
  ذهبي: "#d4af37",
  gold: "#d4af37",
  فضي: "#c0c0c0",
  silver: "#c0c0c0",
  بيج: "#d4b896",
  beige: "#d4b896",
  كحلي: "#1e3a5f",
  navy: "#1e3a5f",
};
function colorToCss(name: string): string {
  if (!name) return "#cccccc";
  const k = name.trim().toLowerCase();
  if (COLOR_MAP[name.trim()]) return COLOR_MAP[name.trim()];
  if (COLOR_MAP[k]) return COLOR_MAP[k];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(name.trim())) return name.trim();
  return name.trim();
}

/* ── Stars ── */
function Stars({
  count,
  size = 14,
  interactive,
  onRate,
}: {
  count: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = interactive ? hover || count : count;
  const full = Math.floor(display);

  return (
    <div
      className="flex gap-0.5"
      aria-label={`${count} out of 5 stars`}
      onMouseLeave={() => interactive && setHover(0)}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2.5}
          className={[
            i < full ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]/20",
            interactive ? "cursor-pointer" : "",
          ].join(" ")}
          onClick={interactive ? () => onRate?.(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHover(i + 1) : undefined}
        />
      ))}
    </div>
  );
}

/* ── Rating bar ── */
function RatingBar({
  count,
  total,
  label,
}: {
  count: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-[#0A0A0A]/50">
      <span className="w-3 text-right font-bold text-[#0A0A0A]">{label}</span>
      <Star className="w-3 h-3 fill-[#FF4D00] text-[#FF4D00]" />
      <div className="flex-1 h-1.5 bg-[#0A0A0A]/10 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full bg-[#FF4D00] rounded-full"
        />
      </div>
      <span className="w-5 text-right">{count}</span>
    </div>
  );
}

/* ── Add review form ── */
function AddReviewForm({
  productId,
  onSuccess,
}: {
  productId: number;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate: addReview, isPending } = useAddReview();

  const handleSubmit = () => {
    if (!rating) return;
    addReview(
      { product: productId, rating, comment },
      {
        onSuccess: () => {
          setSubmitted(true);
          setRating(0);
          setComment("");
          onSuccess?.();
        },
        onError: () =>
          toast({
            title: "Something went wrong, try again",
            variant: "destructive",
          }),
      },
    );
  };

  if (submitted)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-3 border-[#0A0A0A] bg-[#D4FF3D] p-5 text-center"
        style={{ borderWidth: 3 }}
      >
        <div className="text-[#0A0A0A] text-2xl mb-2 font-black">✓</div>
        <p className="text-sm font-black uppercase text-[#0A0A0A]">
          Thanks for your review!
        </p>
      </motion.div>
    );

  return (
    <div
      className="border-3 border-[#0A0A0A] p-5 bg-[#FAFAF7]"
      style={{ borderWidth: 3 }}
    >
      <p className="font-black uppercase text-[13px] tracking-wide text-[#0A0A0A] mb-4">
        Write a review
      </p>

      <div className="mb-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 mb-2">
          Your rating {!rating && <span className="text-[#FF4D00]">*</span>}
        </p>
        <Stars count={rating} size={24} interactive onRate={setRating} />
      </div>

      <div className="mb-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 mb-2">
          Comment <span className="text-[#0A0A0A]/30">(optional)</span>
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="w-full text-sm text-[#0A0A0A] bg-[#FAFAF7] border-2 border-[#0A0A0A]/20 px-3.5 py-3 resize-none outline-none transition-colors focus:border-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!rating || isPending}
        className="px-6 py-3 text-[12px] font-black uppercase tracking-wide transition-all active:translate-x-[2px] active:translate-y-[2px] bg-[#0A0A0A] text-[#FAFAF7] hover:bg-[#FF4D00] hover:text-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}

/* ── Reviews section ── */
function ReviewsSection({ productId }: { productId: number }) {
  const { data: reviews = [], isLoading, refetch } = useGetReviews(productId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => Math.round(r.rating) === star).length,
  }));

  return (
    <section className="mt-20 lg:mt-28 pt-12 border-t-4 border-[#0A0A0A]">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-4">
            Word on the street
          </span>
          <h2
            className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            }}
          >
            {reviews.length} reviews
          </h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <Stars count={avgRating} size={18} />
            <span className="text-[16px] font-black text-[#0A0A0A]">
              {avgRating.toFixed(1)} / 5
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar: rating breakdown + add review */}
        <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-5">
          {reviews.length > 0 && (
            <div
              className="border-3 border-[#0A0A0A] p-5 bg-[#FAFAF7]"
              style={{ borderWidth: 3 }}
            >
              <div className="flex items-end gap-3 mb-4">
                <span
                  className="font-black text-[#0A0A0A] leading-none"
                  style={{
                    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  }}
                >
                  {avgRating.toFixed(1)}
                </span>
                <div className="pb-1.5">
                  <Stars count={avgRating} size={16} />
                  <p className="text-[11px] font-bold text-[#0A0A0A]/50 mt-1">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {starCounts.map(({ star, count }) => (
                  <RatingBar
                    key={star}
                    label={String(star)}
                    count={count}
                    total={reviews.length}
                  />
                ))}
              </div>
            </div>
          )}
          <AddReviewForm productId={productId} onSuccess={() => refetch()} />
        </div>

        {/* Reviews list */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse border-3 border-[#0A0A0A]/10 h-[110px] bg-[#0A0A0A]/5"
                  style={{ borderWidth: 3 }}
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border-3 border-dashed border-[#0A0A0A]/20"
              style={{ borderWidth: 3 }}
            >
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A]/20" />
                ))}
              </div>
              <p className="text-[13px] font-black uppercase text-[#0A0A0A]/40">
                No reviews yet — be the first!
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <AnimatePresence>
                {reviews.map((review: any, i: number) => {
                  const displayName =
                    review.user_name || review.customer_name || "—";
                  const date = review.created_at
                    ? new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : null;

                  const accents = ["#D4FF3D", "#FF4D00"];
                  const accent = accents[i % accents.length];
                  const rotates = ["-rotate-2", "rotate-1", "-rotate-1"];
                  const rotate = rotates[i % rotates.length];

                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className={`relative bg-[#FAFAF7] border-3 border-[#0A0A0A] p-5 pt-7 transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 ${rotate}`}
                      style={{
                        borderWidth: 3,
                        boxShadow: "5px 5px 0 0 #0A0A0A",
                      }}
                    >
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-[#0A0A0A]"
                        style={{ backgroundColor: accent }}
                      />
                      <Stars count={review.rating} />
                      {review.comment && (
                        <p className="mt-3 text-[13px] font-bold text-[#0A0A0A]/85 leading-relaxed">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t-2 border-[#0A0A0A]/10">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-black flex-shrink-0"
                            style={{ backgroundColor: accent }}
                          >
                            {String(displayName).charAt(0).toUpperCase()}
                          </span>
                          <p className="text-[12px] font-black uppercase text-[#0A0A0A]">
                            {displayName}
                          </p>
                        </div>
                        {date && (
                          <span className="text-[11px] font-bold text-[#0A0A0A]/40">
                            {date}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div className="animate-pulse grid lg:grid-cols-2 gap-10 lg:gap-14 pt-10">
      <div
        className="aspect-[4/5] bg-[#0A0A0A]/10 border-3 border-[#0A0A0A]/10"
        style={{ borderWidth: 3 }}
      />
      <div className="flex flex-col gap-5 pt-4">
        <div className="h-3 w-1/3 bg-[#0A0A0A]/10" />
        <div className="h-12 w-2/3 bg-[#0A0A0A]/10" />
        <div className="h-6 w-1/4 bg-[#0A0A0A]/10" />
        <div className="h-24 w-full bg-[#0A0A0A]/10" />
        <div className="h-12 w-full bg-[#0A0A0A]/10" />
      </div>
    </div>
  );
}

/* ── Main Page ── */
function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const productId = Number(id);
  const router = useRouter();

  const { data: product, isLoading } = useGetSingleProduct(productId);
  const { data: allData } = useGetProducts({ all: true });
  const { mutateAsync: addToCart } = useAddToCart();

  /* ── Variants ── */
  const variants = (product?.variants ?? []) as any[];

  const colorOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of variants) {
      const c = (v.color ?? "").trim();
      if (c && !seen.has(c)) {
        seen.add(c);
        out.push(c);
      }
    }
    return out;
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addingVariantId, setAddingVariantId] = useState<number | null>(null);
  const [addedVariantId, setAddedVariantId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizeOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: { volume: string; stock: number }[] = [];
    for (const v of variants) {
      if (selectedColor && (v.color ?? "").trim() !== selectedColor) continue;
      const s = (v.volume ?? "").trim();
      if (s && !seen.has(s)) {
        seen.add(s);
        out.push({ volume: s, stock: v.stock });
      }
    }
    return out;
  }, [variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    return (
      variants.find(
        (v) =>
          (!selectedColor || (v.color ?? "").trim() === selectedColor) &&
          (!selectedSize || (v.volume ?? "").trim() === selectedSize),
      ) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  const variantImages = (selectedVariant?.images ?? []) as { url: string }[];

  /* Reset on product change */
  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
    setActiveImage(0);
  }, [productId]);

  /* Initialize selection when product loads */
  useEffect(() => {
    if (!variants.length) return;
    const first = variants[0];
    setSelectedColor((c) => c ?? ((first.color ?? "").trim() || null));
    setSelectedSize((s) => s ?? ((first.volume ?? "").trim() || null));
  }, [product, variants]);

  /* Fix size when color changes */
  useEffect(() => {
    if (!selectedColor) return;
    if (selectedSize && sizeOptions.some((s) => s.volume === selectedSize))
      return;
    const firstAvailable =
      sizeOptions.find((s) => s.stock > 0) ?? sizeOptions[0];
    setSelectedSize(firstAvailable?.volume ?? null);
  }, [selectedColor, sizeOptions]);

  /* Reset active image when variant changes */
  useEffect(() => {
    setActiveImage(0);
  }, [selectedVariant?.id]);

  const selectedPrice = selectedVariant?.price ?? null;
  const comparePrice =
    selectedVariant?.compare_at_price === selectedVariant?.price
      ? null
      : selectedVariant?.compare_at_price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const isAddingThisVariant = addingVariantId === selectedVariant?.id;
  const wasAddedThisVariant = addedVariantId === selectedVariant?.id;

  const discountPct =
    comparePrice && selectedPrice
      ? Math.round(
          ((parseFloat(comparePrice) - parseFloat(selectedPrice)) /
            parseFloat(comparePrice)) *
            100,
        )
      : null;

  /* Related products */
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const list = Array.isArray(allData?.products) ? allData!.products : [];
    return list.filter((p) => p.id !== productId).slice(0, 4);
  }, [allData, product, productId]);

  const { setCartOpen } = useCats();

  /* ── Handlers ── */
  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (!product || !selectedVariant || isAddingThisVariant) return;
    setSizeError(false);
    const vid = selectedVariant.id;
    setAddingVariantId(vid);
    setAddedVariantId(null);
    addToCart(
      { variant_id: vid, quantity: qty },
      {
        onSuccess: () => {
          toast({ title: "Added to bag!" });
          setCartOpen(true);
        },
        onError: () =>
          toast({
            title: "Something went wrong, try again",
            variant: "destructive",
          }),
      },
    );
    setTimeout(() => {
      setAddingVariantId(null);
      setAddedVariantId(vid);
      setTimeout(() => setAddedVariantId(null), 2500);
    }, 600);
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    try {
      await addToCart({ variant_id: selectedVariant.id, quantity: qty });
      router.push("/checkout");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({
        title: "Something went wrong, try again",
        variant: "destructive",
      });
    }
  };

  /* ── Render ── */
  if (isLoading)
    return (
      <div className="bg-[#FAFAF7] min-h-screen">
        <Nav />
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14 mt-20">
          <Skeleton />
        </div>
        <Footer />
      </div>
    );

  if (!product?.variants || product.variants.length === 0)
    return (
      <div className="bg-[#FAFAF7] min-h-screen">
        <Nav />
        <div className="min-h-[80vh] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div
              className="w-16 h-16 mx-auto mb-6 border-3 border-[#0A0A0A] flex items-center justify-center bg-[#D4FF3D]"
              style={{ borderWidth: 3 }}
            >
              <ShoppingBag className="w-7 h-7 text-[#0A0A0A]" />
            </div>
            <h2
              className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter mb-4"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              }}
            >
              Product unavailable
            </h2>
            <p className="text-[13px] font-bold text-[#0A0A0A]/50 mb-8">
              This product will be back soon. Thanks for your interest.
            </p>
            <Link
              href="/products"
              className="text-[12px] font-black uppercase tracking-wide text-[#0A0A0A] border-b-3 border-[#0A0A0A] pb-1"
            >
              Browse products
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div>
      <Nav />
      <div className="bg-[#FAFAF7] min-h-screen mt-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
          {/* Breadcrumb */}
          <span className="inline-block bg-[#0A0A0A] text-[#D4FF3D] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 -rotate-1 mb-8">
            {product.category ?? "Product"}
          </span>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="flex gap-4">
                {/* Thumbnail rail */}
                {variantImages.length > 1 && (
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    {variantImages.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={[
                          "w-14 h-16 lg:w-16 lg:h-20 overflow-hidden flex-shrink-0 transition-all",
                          activeImage === i
                            ? "border-[#0A0A0A]"
                            : "border-[#0A0A0A]/15 opacity-60 hover:opacity-100",
                        ].join(" ")}
                        style={{ borderWidth: 3, border: "3px solid" }}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={(src as any).url || String(src)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div
                  className="relative flex-1 aspect-[4/5] overflow-hidden bg-[#0A0A0A]/5"
                  style={{ border: "3px solid #0A0A0A" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0"
                    >
                      {variantImages[activeImage] ? (
                        <img
                          src={
                            ((variantImages[activeImage] as any).url ||
                              String(variantImages[activeImage])) as string
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/5">
                          <ShoppingBag className="w-10 h-10 text-[#0A0A0A]/20 mb-3" />
                          <span className="text-[12px] font-bold uppercase text-[#0A0A0A]/30">
                            No image
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {discountPct && (
                    <span className="absolute top-4 left-4 bg-[#FF4D00] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[11px] font-black uppercase px-3 py-1.5 -rotate-2">
                      -{discountPct}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1
                className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
                style={{
                  fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              {product.average_rating ? (
                <div className="flex items-center gap-3 mt-3">
                  <Stars count={product.average_rating} />
                  <span className="text-[12px] font-bold text-[#0A0A0A]/50">
                    {product.average_rating.toFixed(1)} ({product.review_count}{" "}
                    reviews)
                  </span>
                </div>
              ) : null}

              {/* Price */}
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                {selectedPrice && (
                  <span className="text-[26px] font-black text-[#0A0A0A]">
                    {fmt(parseFloat(selectedPrice))}
                  </span>
                )}
                {comparePrice && (
                  <span className="text-[16px] font-bold text-[#0A0A0A]/40 line-through">
                    {fmt(parseFloat(comparePrice))}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-5">
                  {product.description
                    .split("\n\n")
                    .map((para: string, i: number) => (
                      <p
                        key={i}
                        className="text-[14px] font-bold text-[#0A0A0A]/70 leading-relaxed max-w-md mb-3 last:mb-0"
                      >
                        {para}
                      </p>
                    ))}
                </div>
              )}

              {/* Color selector */}
              {colorOptions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-3">
                    Color:{" "}
                    {selectedColor && (
                      <span className="text-[#0A0A0A]">{selectedColor}</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    {colorOptions.map((c) => {
                      const isSel = selectedColor === c;
                      const hasStock = variants.some(
                        (v) => (v.color ?? "").trim() === c && v.stock > 0,
                      );
                      return (
                        <motion.button
                          key={c}
                          whileTap={{ scale: 0.92 }}
                          type="button"
                          onClick={() => {
                            setSelectedColor(c);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title={c}
                          aria-label={c}
                          aria-pressed={isSel}
                          disabled={!hasStock}
                          className={[
                            "relative w-9 h-9 rounded-full border-2 transition-transform flex-shrink-0",
                            isSel
                              ? "border-[#FF4D00] scale-110"
                              : "border-[#0A0A0A]/30",
                            !hasStock
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer",
                          ].join(" ")}
                          style={{ backgroundColor: colorToCss(c) }}
                        >
                          {!hasStock && (
                            <span className="absolute inset-0 flex items-center justify-center text-[#0A0A0A] text-sm font-black">
                              ╳
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {sizeOptions.length > 0 && (
                <div className="mt-7">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50">
                      Size
                      {selectedSize && (
                        <span className="text-[#0A0A0A]">: {selectedSize}</span>
                      )}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart((v) => !v)}
                      className="text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 underline"
                    >
                      {showSizeChart ? "Hide guide" : "Size guide"}
                    </button>
                  </div>

                  {showSizeChart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mb-4 bg-[#0A0A0A]/5 p-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {[
                          { size: "S", kg: "60–70" },
                          { size: "M", kg: "70–80" },
                          { size: "L", kg: "80–90" },
                          { size: "XL", kg: "90–100" },
                          { size: "2XL", kg: "100–115" },
                        ].map(({ size, kg }) => (
                          <div
                            key={size}
                            className={[
                              "border-2 py-3 flex flex-col items-center gap-1.5",
                              selectedSize === size
                                ? "border-[#FF4D00] bg-[#FF4D00]/10"
                                : "border-[#0A0A0A]/20 bg-[#FAFAF7]",
                            ].join(" ")}
                          >
                            <span className="text-[12px] font-black uppercase text-[#0A0A0A]">
                              {size}
                            </span>
                            <div className="w-5 h-px bg-[#0A0A0A]/20" />
                            <span className="text-[10px] font-bold text-[#0A0A0A]/50 leading-snug">
                              {kg}
                              <br />
                              kg
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] font-bold text-[#0A0A0A]/30 text-center mt-3">
                        Sizes are approximate and may vary by item
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((s) => {
                      const isSelected = selectedSize === s.volume;
                      const outOfStock = s.stock === 0;
                      return (
                        <motion.button
                          key={s.volume}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          disabled={outOfStock}
                          onClick={() => {
                            if (!outOfStock) {
                              setSelectedSize(s.volume);
                              setSizeError(false);
                            }
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={[
                            "min-w-[48px] px-3 py-2.5 text-[12px] font-black uppercase transition-all active:translate-x-[1px] active:translate-y-[1px]",
                            outOfStock
                              ? "border-[#0A0A0A]/15 text-[#0A0A0A]/25 line-through cursor-not-allowed"
                              : isSelected
                                ? "bg-[#0A0A0A] text-[#FAFAF7] border-[#0A0A0A]"
                                : "bg-transparent text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                          ].join(" ")}
                          style={{
                            borderWidth: 3,
                            border: outOfStock
                              ? "3px solid rgba(10,10,10,0.15)"
                              : "3px solid",
                          }}
                        >
                          {s.volume}
                        </motion.button>
                      );
                    })}
                  </div>

                  {sizeError && (
                    <p className="mt-2.5 text-[12px] font-black uppercase text-[#0A0A0A] bg-[#FF4D00] inline-block px-2 py-1 -rotate-1">
                      Pick a size first
                    </p>
                  )}
                </div>
              )}

              {/* Low stock warning */}
              {selectedVariant &&
                selectedVariant.stock > 0 &&
                selectedVariant.stock < 10 && (
                  <p className="text-[12px] font-black uppercase text-[#FF4D00] mt-3">
                    ⚡ Only {selectedVariant.stock} left — get it now
                  </p>
                )}

              {/* Quantity + CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {/* Quantity */}
                <div
                  className="flex items-center"
                  style={{ border: "3px solid #0A0A0A" }}
                >
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} strokeWidth={3} />
                  </button>
                  <span className="w-10 text-center text-[14px] font-black">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-11 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} strokeWidth={3} />
                  </button>
                </div>

                {/* Add to bag */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!inStock || isAddingThisVariant}
                  className={[
                    "flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-black uppercase tracking-wide transition-all active:translate-x-[2px] active:translate-y-[2px]",
                    wasAddedThisVariant
                      ? "bg-[#D4FF3D] text-[#0A0A0A]"
                      : "bg-[#0A0A0A] text-[#FAFAF7] hover:bg-[#FF4D00] hover:text-[#0A0A0A]",
                    !inStock || isAddingThisVariant
                      ? "opacity-50 cursor-not-allowed"
                      : "",
                  ].join(" ")}
                  style={{ borderWidth: 3, border: "3px solid #0A0A0A" }}
                >
                  {!inStock ? (
                    "Out of stock"
                  ) : isAddingThisVariant ? (
                    "Adding..."
                  ) : wasAddedThisVariant ? (
                    <>
                      <Check size={16} strokeWidth={3} /> Added to bag
                    </>
                  ) : (
                    <>
                      Add to bag
                      {selectedPrice
                        ? ` — ${fmt(parseFloat(selectedPrice) * qty)}`
                        : ""}
                      <ArrowRight size={15} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>

              {/* Buy now */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className={[
                  "mt-3 w-full py-3.5 text-[13px] font-black uppercase tracking-wide transition-all active:translate-x-[2px] active:translate-y-[2px]",
                  inStock
                    ? "bg-[#FF4D00] text-[#0A0A0A] hover:bg-[#D4FF3D] cursor-pointer"
                    : "bg-[#0A0A0A]/10 text-[#0A0A0A]/30 cursor-not-allowed",
                ].join(" ")}
                style={{ border: "3px solid #0A0A0A" }}
              >
                Buy now
              </button>

              {/* Shipping/return badges */}
              <div className="mt-7 grid grid-cols-3 gap-2">
                {[
                  { icon: Truck, label: "Free shipping over 1500" },
                  { icon: RotateCcw, label: "14-day returns" },
                  { icon: ShieldCheck, label: "Secure checkout" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="border-2 border-[#0A0A0A]/10 p-3 flex flex-col items-center gap-1.5 text-center"
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="text-[#0A0A0A]/60"
                    />
                    <span className="text-[10px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection productId={productId} />

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 lg:mt-28 pt-12 border-t-4 border-[#0A0A0A] pb-4">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <h2
                  className="text-[#0A0A0A] font-black uppercase leading-[0.9] tracking-tighter"
                  style={{
                    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  }}
                >
                  You&apos;ll also like
                </h2>
                <Link
                  href="/products"
                  className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-wide text-[#0A0A0A] border-b-3 border-[#0A0A0A] pb-1"
                >
                  Shop all
                  <ArrowRight
                    size={15}
                    strokeWidth={3}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                {relatedProducts.map((p) => {
                  const firstImage = p.variants?.[0]?.images?.[0];
                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="group"
                    >
                      <div
                        className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A]/5"
                        style={{ border: "3px solid #0A0A0A" }}
                      >
                        {firstImage ? (
                          <img
                            src={
                              typeof firstImage === "string"
                                ? firstImage
                                : firstImage.url
                            }
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-[#0A0A0A]/20" />
                          </div>
                        )}
                      </div>
                      <h3 className="mt-3 text-[13px] font-black uppercase tracking-tight text-[#0A0A0A] leading-snug">
                        {p.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        {p.variants?.[0]?.price && (
                          <span className="text-[14px] font-black text-[#0A0A0A]">
                            {fmt(parseFloat(p.variants[0].price))}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
