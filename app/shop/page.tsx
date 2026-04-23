"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Flame,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useCart, formatINR } from "../lib/store/cart";
import { useWishlist } from "../lib/store/wishlist";
import { BRANDS, findBrandBySlug } from "../lib/brands";

type Flavour = { label: string; image?: string };

type Product = {
  id: string;
  title: string;
  variant: string;
  tag: string;
  image: string;
  price: number;
  mrp: number;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  goal: string;
  Brands: string;
  flavours?: Flavour[];
};

const PRODUCTS: Product[] = [
  {
    id: "ps-product-1",
    title: "Body Mass Gainer",
    variant: "2.75 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/muscle/mf2.png",
    price: 3700,
    mrp: 4180,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 987,
    inStock: true,
    Brands: "Muscle Frame Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Malai Kulfi" },
    ],
  },
  {
    id: "ps-product-2",
    title: "Whey Protein 100%",
    variant: "1 kg",
    tag: "Recovery",
    goal: "Muscle Building",
    image: "/image/athletic/2.png",
    price: 4100,
    mrp: 4200,
    badge: "Limited",
    rating: 4.7,
    reviews: 654,
    inStock: true,
    Brands: "Athletic Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Malai Kulfi" },
    ],
  },
  {
    id: "ps-product-3",
    title: "Weight Gainer",
    variant: "2.7 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/biomax/bm2.png",
    price: 3200,
    mrp: 3795,
    badge: "New",
    rating: 4.5,
    reviews: 312,
    inStock: true,
    Brands: "Bio Max",
    flavours: [
      { label: "Chocolate" },
      { label: "Malai Kulfi" },
    ],
  },
  {
    id: "ps-product-5",
    title: "Pre Workout",
    variant: "250 gm",
    tag: "Performance",
    goal: "Performance",
    image: "/image/athletic/3.png",
    price: 1650,
    mrp: 1880,
    badge: "New",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    Brands: "Athletic Nutrition",
    flavours: [
      { label: "Blue Razz" },
      { label: "Watermelon" },
    ],
  },
  {
    id: "ps-product-4",
    title: "Body Mass Gainer",
    variant: "2.75 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/muscle/mf1.png",
    price: 3700,
    mrp: 4180,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 987,
    inStock: true,
    Brands: "Muscle Frame Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Malai Kulfi" },
    ],
  },
  {
    id: "ps-product-6",
    title: "Ultra Pre Workout",
    variant: "250 gm",
    tag: "Performance",
    goal: "Performance",
    image: "/image/muscle/mf3.png",
    price: 2000,
    mrp: 2150,
    rating: 4.6,
    reviews: 318,
    inStock: true,
    Brands: "Muscle Frame Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Cookies & Cream" },
    ],
  },
  {
    id: "ps-product-7",
    title: "Premium Body Mass Gainer",
    variant: "2.75 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/muscle/mf4.png",
    price: 3500,
    mrp: 3960,
    badge: "Premium",
    rating: 4.5,
    reviews: 189,
    inStock: true,
    Brands: "Muscle Frame Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Vanilla" },
    ],
  },
  {
    id: "ps-product-8",
    title: "Nitric Oxide Capsules ",
    variant: "60 Unit",
    tag: "Daily Health",
    goal: "Daily Health",
    image: "/image/biomax/bm1.png",
    price: 2200,
    mrp: 2230,
    rating: 4.4,
    reviews: 276,
    inStock: true,
    Brands: "Bio Max",
    flavours: [
      { label: "Chocolate" },
      { label: "Malai Kulfi" },
    ],
  },
  {
    id: "ps-product-9",
    title: "Black Spider Capsule",
    variant: "60 Unit",
    tag: "Perfomance",
    goal: "Performance",
    image: "/image/biomax/bm3.png",
    price: 1700,
    mrp: 1880,
    badge: "New",
    rating: 4.3,
    reviews: 142,
    inStock: true,
    Brands: "Bio Max",
    flavours: [
      { label: "Chocolate" },
      { label: "Banana" },
    ],
  },
  {
    id: "ps-product-10",
    title: "Body Mass Gainer",
    variant: "2.75 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/athletic/1.png",
    price: 3650,
    mrp: 3795,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 893,
    inStock: true,
    Brands: "Athletic Nutrition",
    flavours: [
      { label: "Rich Chocolate" },
      { label: "Vanilla Ice Cream" },
    ],
  },
  {
    id: "ps-product-11",
    title: "XXL Mass Gainer",
    variant: "2.75 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/athletic/4.png",
    price: 3800,
    mrp: 3995,
    rating: 4.5,
    reviews: 407,
    inStock: true,
    Brands: "Athletic Nutrition",
    flavours: [
      { label: "Watermelon" },
      { label: "Green Apple" },
    ],
  },
  {
    id: "ps-product-12",
    title: "Whey Protein Isolate 100%",
    variant: "1 kg",
    tag: "Recovery",
    goal: "Muscle Building",
    image: "/image/Fitnesstech/fn1.png",
    price: 5450,
    mrp: 5500,
    badge: "Trending",
    rating: 4.6,
    reviews: 334,
    inStock: true,
    Brands: "FitnessTech Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Vanilla" },
    ],
  },
  {
    id: "ps-product-13",
    title: "Whey Protein 100%",
    variant: "1 kg",
    tag: "Recovery",
    goal: "Muscle Building",
    image: "/image/Fitnesstech/fn3.png",
    price: 4200,
    mrp: 4200,
    badge: "New",
    rating: 4.7,
    reviews: 512,
    inStock: true,
    Brands: "FitnessTech Nutrition",
    flavours: [
      { label: "Chocolate", image: "/image/Fitnesstech/fn2.png" },
      { label: "Malai Kulfi", image: "/image/Fitnesstech/fn3.png" },
    ],
  },
  {
    id: "ps-product-14",
    title: "Premium Max Gainer",
    variant: "2.7 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/maximum/mn1.png",
    price: 3800,
    mrp: 3996,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 1102,
    inStock: true,
    Brands: "Maximum Nutrition",
    flavours: [
      { label: "Double Rich Chocolate" },
      { label: "French Vanilla" },
    ],
  },
  {
    id: "ps-product-15",
    title: "Premium Mass Gainer",
    variant: "2.7 kg",
    tag: "Bulk Up",
    goal: "Weight Gain",
    image: "/image/maximum/mn2.png",
    price: 4158,
    mrp: 4158,
    badge: "Best Seller",
    rating: 4.7,
    reviews: 688,
    inStock: true,
    Brands: "Maximum Nutrition",
    flavours: [
      { label: "Chocolate" },
      { label: "Banana" },
      { label: "Vanilla" },
    ],
  },
];

const COMPANIES = BRANDS.map((b) => b.name);

const GOALS = ["Weight Gain", "Muscle Building", "Performance", "Daily Health"] as const;
const DISCOUNTS = [
  { label: "10% and above", value: 10 },
  { label: "20% and above", value: 20 },
  { label: "30% and above", value: 30 },
];
const RATINGS = [4, 3, 2];
type SortBy = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const searchParams = useSearchParams();
  const brandSlug = searchParams.get("brand");
  const initialBrand = findBrandBySlug(brandSlug);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialBrand ? [initialBrand.name] : []
  );
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(10000);

  // Sync when URL brand param changes
  useEffect(() => {
    if (initialBrand) {
      setSelectedCompanies([initialBrand.name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  const toggleGoal = (g: string) =>
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  const toggleCompany = (c: string) =>
    setSelectedCompanies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const activeFilterCount =
    selectedGoals.length +
    selectedCompanies.length +
    (minRating ? 1 : 0) +
    (minDiscount ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceMax < 10000 ? 1 : 0);

  const resetFilters = () => {
    setQuery("");
    setSortBy("featured");
    setSelectedGoals([]);
    setSelectedCompanies([]);
    setMinDiscount(0);
    setMinRating(0);
    setInStockOnly(false);
    setPriceMax(10000);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedGoals.length > 0 && !selectedGoals.includes(p.goal)) return false;
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(p.Brands)) return false;
      if (p.price > priceMax) return false;
      if (inStockOnly && !p.inStock) return false;
      const disc = p.mrp > p.price ? ((p.mrp - p.price) / p.mrp) * 100 : 0;
      if (disc < minDiscount) return false;
      if (p.rating < minRating) return false;
      return true;
    });

    const discount = (p: Product) =>
      p.mrp > p.price ? ((p.mrp - p.price) / p.mrp) * 100 : 0;

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list = [...list].sort((a, b) => discount(b) - discount(a));
        break;
    }
    return list;
  }, [query, sortBy, selectedGoals, selectedCompanies, minDiscount, minRating, inStockOnly, priceMax]);

  const overallRating =
    PRODUCTS.reduce((sum, p) => sum + p.rating, 0) / PRODUCTS.length;
  const totalReviews = PRODUCTS.reduce((sum, p) => sum + p.reviews, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 pt-[72px]">
      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-orange-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb + Search */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-orange-400">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white">Shop</span>
          </nav>

          <div className="relative w-full lg:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-10 text-sm text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile backdrop */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar Filters — becomes a slide-in drawer on mobile */}
          <aside
            className={`${
              filtersOpen
                ? "fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[360px] translate-x-0 flex-col transition-transform duration-300 ease-out"
                : "fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[360px] -translate-x-full flex-col transition-transform duration-300 ease-out pointer-events-none"
            } lg:static lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:transform-none lg:pointer-events-auto lg:sticky lg:top-[88px] lg:h-fit lg:transition-none`}
          >
            <div className="flex h-full w-full flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 shadow-2xl lg:h-auto lg:rounded-2xl lg:border lg:border-white/10 lg:bg-gradient-to-br lg:from-white/[0.04] lg:to-white/[0.01] lg:shadow-none">
              {/* Header (desktop + mobile) */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3.5 lg:py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 ring-1 ring-orange-500/30 lg:hidden">
                    <SlidersHorizontal size={14} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                      <Sparkles size={14} className="hidden text-orange-400 lg:inline" />
                      Filters
                    </h3>
                    <p className="text-[10px] text-white/50 lg:hidden">
                      {activeFilterCount > 0
                        ? `${activeFilterCount} active`
                        : "Refine your results"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 transition-all hover:border-orange-500/50 hover:text-orange-300"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-90 lg:hidden"
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain lg:overflow-visible">

              <Accordion title="Sort By">
                <div className="space-y-1.5">
                  {[
                    { v: "featured", l: "Featured" },
                    { v: "price-asc", l: "Price: Low to High" },
                    { v: "price-desc", l: "Price: High to Low" },
                    { v: "rating", l: "Highest Rated" },
                    { v: "discount", l: "Biggest Discount" },
                  ].map((o) => (
                    <RadioPill
                      key={o.v}
                      selected={sortBy === o.v}
                      onClick={() => setSortBy(o.v as SortBy)}
                      label={o.l}
                    />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Discount">
                <div className="space-y-1.5">
                  {DISCOUNTS.map((d) => (
                    <RadioPill
                      key={d.value}
                      selected={minDiscount === d.value}
                      onClick={() =>
                        setMinDiscount(minDiscount === d.value ? 0 : d.value)
                      }
                      label={d.label}
                    />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Ratings">
                <div className="space-y-1.5">
                  {RATINGS.map((r) => (
                    <RadioPill
                      key={r}
                      selected={minRating === r}
                      onClick={() => setMinRating(minRating === r ? 0 : r)}
                      label={
                        <span className="flex items-center gap-1">
                          {r}
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          & above
                        </span>
                      }
                    />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Filter by Goals">
                <div className="space-y-1.5">
                  {GOALS.map((g) => (
                    <label
                      key={g}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                          selectedGoals.includes(g)
                            ? "border-orange-500 bg-orange-500"
                            : "border-white/20 bg-white/[0.03]"
                        }`}
                      >
                        {selectedGoals.includes(g) && (
                          <Check size={10} className="text-white" />
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedGoals.includes(g)}
                        onChange={() => toggleGoal(g)}
                      />
                      <span className="text-white/70">{g}</span>
                    </label>
                  ))}
                </div>
              </Accordion>

              <Accordion
                title="Brands"
                defaultOpen={selectedCompanies.length > 0}
                forceOpen={selectedCompanies.length > 0}
              >
                <div className="space-y-1.5">
                  {COMPANIES.map((c) => (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                          selectedCompanies.includes(c)
                            ? "border-orange-500 bg-orange-500"
                            : "border-white/20 bg-white/[0.03]"
                        }`}
                      >
                        {selectedCompanies.includes(c) && (
                          <Check size={10} className="text-white" />
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCompanies.includes(c)}
                        onChange={() => toggleCompany(c)}
                      />
                      <span className="text-white/70">{c}</span>
                    </label>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Stock Availability">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                      inStockOnly
                        ? "border-orange-500 bg-orange-500"
                        : "border-white/20 bg-white/[0.03]"
                    }`}
                  >
                    {inStockOnly && <Check size={10} className="text-white" />}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span className="text-white/70">In Stock Only</span>
                </label>
              </Accordion>

              <Accordion title="Price" defaultOpen>
                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">₹500</span>
                    <span className="font-bold text-orange-300">
                      Up to {formatINR(priceMax)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={100}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </Accordion>

              {/* bottom spacer so content isn't hidden behind sticky CTA on mobile */}
              <div className="h-20 lg:hidden" />
              </div>

              {/* Mobile sticky CTA */}
              <div className="shrink-0 border-t border-white/10 bg-neutral-950/95 p-3 backdrop-blur lg:hidden">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 active:scale-[0.98]"
                >
                  Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                    Sports Supplements
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">
                    High-intensity sessions make muscles hungry for protein, which your
                    regular diet may not be able to meet. Our lab-tested, pharma-grade
                    supplements are built for athletes who refuse to compromise.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <div>
                    <p className="text-lg font-black text-white">
                      {overallRating.toFixed(1)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">
                      {totalReviews.toLocaleString()} ratings
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results count + mobile filter trigger */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                <span className="text-white">{filtered.length}</span> products available
              </p>
              <button
                onClick={() => setFiltersOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition-all hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-white/10 bg-white/[0.02] py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Search size={24} className="text-white/40" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">No products found</h3>
                <p className="text-sm text-white/50">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-full border border-orange-500/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 hover:bg-orange-500/20"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Trust band */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4 md:grid-cols-4"
            >
              {[
                { icon: Flame, label: "Lab Tested", sub: "3rd party verified" },
                { icon: ShoppingBag, label: "Free Shipping", sub: "Over ₹2000" },
                { icon: Check, label: "Authentic", sub: "100% genuine" },
                { icon: Zap, label: "Fast Delivery", sub: "2-5 days" },
              ].map((t) => {
                const I = t.icon;
                return (
                  <div key={t.label} className="flex items-center gap-3 px-2 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-500/20">
                      <I size={16} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.label}</p>
                      <p className="text-xs text-white/40">{t.sub}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Accordion({
  title,
  defaultOpen = false,
  forceOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-white"
      >
        {title}
        <ChevronDown
          size={14}
          className={`text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioPill({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-all ${
        selected
          ? "bg-orange-500/15 text-orange-300"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 transition-all ${
          selected ? "border-orange-500" : "border-white/20"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
      </span>
      {label}
    </button>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, has: inWishlist } = useWishlist();
  const liked = inWishlist(product.id);
  const router = useRouter();

  const hasFlavours = product.flavours && product.flavours.length > 0;
  const [activeFlavour, setActiveFlavour] = useState(0);
  const activeImage = (hasFlavours && product.flavours![activeFlavour].image) ? product.flavours![activeFlavour].image! : product.image;
  const activeVariant = product.variant;

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: `${product.title} – ${hasFlavours ? product.flavours![activeFlavour].label : product.variant}`,
      image: activeImage,
      price: product.price,
      mrp: product.mrp,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      title: `${product.title} – ${hasFlavours ? product.flavours![activeFlavour].label : product.variant}`,
      image: activeImage,
      price: product.price,
      mrp: product.mrp,
    });
    router.push("/checkout");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, type: "spring", damping: 20 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/5"
    >
      {/* Top section: image + info */}
      <div className="flex gap-3 p-3">
        {/* Image with badge */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02]">
          {product.badge && (
            <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-md">
              {product.badge}
            </span>
          )}
          <Image
            src={activeImage}
            alt={product.title}
            fill
            className="object-contain p-3 transition-all duration-500 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute left-1.5 bottom-1.5 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            <Star size={9} className="fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              {product.tag}
            </p>
            <button
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  title: hasFlavours
                    ? `${product.title} – ${product.flavours![activeFlavour].label}`
                    : product.title,
                  image: activeImage,
                  price: product.price,
                  mrp: product.mrp,
                })
              }
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-all hover:text-red-400 active:scale-90"
            >
              <Heart
                size={14}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-white">
            {product.title}
          </h3>
          <p className="mb-2 text-xs text-white/50">{activeVariant}</p>

          {/* Flavour selector */}
          {hasFlavours && (
            <div className="mb-2 flex flex-wrap gap-1">
              {product.flavours!.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setActiveFlavour(i)}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all ${
                    activeFlavour === i
                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                      : "border-white/15 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white">
                {formatINR(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xs text-white/40 line-through">
                    {formatINR(product.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgb(16,185,129)]" />
              <span className="text-[10px] font-medium text-emerald-400">In Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 border-t border-white/10">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className={`flex items-center justify-center gap-1.5 border-r border-white/10 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
            added
              ? "bg-emerald-500/15 text-emerald-400"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check size={13} /> Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingBag size={13} /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBuyNow}
          className="group/buy relative flex items-center justify-center gap-1.5 overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:from-orange-400 hover:to-orange-500"
        >
          <span className="relative z-10">Buy Now</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/buy:translate-x-full" />
        </motion.button>
      </div>
    </motion.div>
  );
}
