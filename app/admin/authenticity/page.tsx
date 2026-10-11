"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  PlusCircle,
  Layers,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  RefreshCw,
  QrCode,
  FileSpreadsheet,
  Package,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  ChevronRight,
  ShoppingCart,
  BarChart3,
  Search,
  ExternalLink,
  Check,
  Upload,
  Store,
  Sparkles,
  Trash2,
  X,
  Tag,
  ImageIcon,
} from "lucide-react";
import { api, BatchSummary, AdminProduct } from "../../lib/api";
import appIcon from "../../icon.png";

const AUTHORIZED_EMAIL = "frontrunner2009@gmail.com";
const AUTHORIZED_OTP = "310702";

// Preset product image options from the catalog
const PRESET_PRODUCT_IMAGES = [
  { label: "Max Gainer (Black & Orange)", url: "/image/maximum/mn1.png" },
  { label: "Mass Gainer (Gold Edition)", url: "/image/maximum/mn2.png" },
  { label: "Whey Isolate (Fitness Tech)", url: "/image/Fitnesstech/fn1.png" },
  { label: "100% Whey (Fitness Tech)", url: "/image/Fitnesstech/fn3.png" },
  { label: "Athletic 100% Whey", url: "/image/athletic/2.png" },
  { label: "Pre-Workout Fuel", url: "/image/athletic/3.png" },
  { label: "XXL Mass Gainer", url: "/image/athletic/4.png" },
  { label: "Nitric Oxide Booster", url: "/image/biomax/bm1.png" },
  { label: "Weight Gainer Extreme", url: "/image/biomax/bm2.png" },
  { label: "Black Spider Thermo", url: "/image/biomax/bm3.png" },
  { label: "Muscle Freak Mass Gainer", url: "/image/muscle/mf1.png" },
  { label: "Ultra Pre-Workout Focus", url: "/image/muscle/mf3.png" },
  { label: "Premium Body Mass Gainer", url: "/image/muscle/mf4.png" },
];

export default function AdminCRMPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Login Form State
  const [authStep, setAuthStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // CRM Active Tab
  const [activeTab, setActiveTab] = useState<
    "authenticity" | "products" | "orders" | "analytics"
  >("authenticity");

  // Data State
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Batch Generation Form State
  const [batchNumber, setBatchNumber] = useState("");
  const [productId, setProductId] = useState("");
  const [count, setCount] = useState(1000);
  const [mfgDate, setMfgDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [expDate, setExpDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 2);
    return d.toISOString().split("T")[0];
  });

  // Product Management State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productMrp, setProductMrp] = useState("");
  const [productStock, setProductStock] = useState("100");
  const [productTag, setProductTag] = useState("Recovery");
  const [productBadge, setProductBadge] = useState("New");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("/image/maximum/mn1.png");
  const [imageSourceMode, setImageSourceMode] = useState<
    "upload" | "presets" | "custom_url"
  >("upload");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState<string | null>(
    null
  );

  // Check saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem("fr_admin_authenticated");
    const savedEmail = localStorage.getItem("fr_admin_email");
    if (
      saved === "true" &&
      savedEmail?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
    ) {
      setIsAuthenticated(true);
      setAdminEmail(savedEmail);
    } else {
      localStorage.removeItem("fr_admin_authenticated");
      localStorage.removeItem("fr_admin_email");
      setIsAuthenticated(false);
      setAdminEmail("");
    }
    setCheckingAuth(false);
  }, []);

  // Fetch batches & products
  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchList, prodList] = await Promise.all([
        api.getBatches().catch(() => []),
        api.getProducts().catch(() => []),
      ]);
      setBatches(batchList || []);
      setProducts(prodList || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Login Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setLoginError("Please enter a valid email address");
      return;
    }

    if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
      setLoginError(
        "Access denied. Only authorized administrator accounts can access this console."
      );
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      setLoginLoading(false);
      setAuthStep("otp");
      setOtp("");
    }, 600);
  };

  // Handle Login Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail !== false && cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
      setLoginError("Access denied. Unauthorized administrator account.");
      return;
    }

    if (otp.trim() !== AUTHORIZED_OTP) {
      setLoginError("Invalid verification code. Access denied.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      setLoginLoading(false);
      setIsAuthenticated(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem("fr_admin_authenticated", "true");
      localStorage.setItem("fr_admin_email", cleanEmail);
    }, 500);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("fr_admin_authenticated");
    localStorage.removeItem("fr_admin_email");
    setIsAuthenticated(false);
    setAdminEmail("");
    setAuthStep("email");
    setEmail("");
    setOtp("");
  };

  // Handle Batch Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber.trim()) {
      setMessage({ type: "error", text: "Please provide a batch number" });
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const res = await api.generateBatch({
        batchNumber: batchNumber.trim().toUpperCase(),
        productId: productId || undefined,
        count: Number(count),
        mfgDate: mfgDate || undefined,
        expDate: expDate || undefined,
      });

      setMessage({
        type: "success",
        text: `Successfully generated ${res.insertedCount} codes for Batch ${res.batchNumber}! Downloading packaging CSV...`,
      });

      triggerDownload(res.batchNumber);
      fetchData();
      setBatchNumber("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to generate batch codes.";
      setMessage({ type: "error", text: msg });
    } finally {
      setGenerating(false);
    }
  };

  const triggerDownload = (bNum: string) => {
    const url = api.getExportCsvUrl(bNum);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${bNum}-scratch-codes.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Quick auto-generate batch number
  const handleGenerateRandomBatchNumber = () => {
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    setBatchNumber(`FR-${year}-${randomHex}`);
  };

  // Handle Image File Upload
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await api.uploadProductImage(file);
      setProductImage(uploadedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      alert(msg);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Create Product Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim()) {
      alert("Please enter a product title");
      return;
    }

    const priceNum = parseFloat(productPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price in INR");
      return;
    }

    const mrpNum = parseFloat(productMrp) || priceNum;

    setIsSubmittingProduct(true);
    try {
      const created = await api.createProduct({
        title: productTitle.trim(),
        description:
          productDescription.trim() ||
          `${productTitle.trim()} - premium quality supplement.`,
        image: productImage || "/image/maximum/mn1.png",
        price: priceNum,
        mrp: mrpNum,
        stock: parseInt(productStock, 10) || 100,
        tag: productTag || undefined,
        badge: productBadge || undefined,
      });

      setProductSuccessMsg(`Product "${created.title}" added to catalog!`);
      setTimeout(() => setProductSuccessMsg(null), 4000);

      // Reset form
      setProductTitle("");
      setProductPrice("");
      setProductMrp("");
      setProductStock("100");
      setProductDescription("");
      setIsAddProductOpen(false);

      // Reload products
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      alert(msg);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to remove or archive "${title}" from the catalog?`
      )
    ) {
      return;
    }

    try {
      await api.deleteProduct(id);
      await fetchData();
    } catch (err: unknown) {
      alert(
        "Failed to delete product: " +
          (err instanceof Error ? err.message : "Error")
      );
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory =
      productCategoryFilter === "ALL" ||
      (p.tag &&
        p.tag.toLowerCase() === productCategoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LOADING SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STRICT LOGIN PORTAL
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-4 shadow-[0_0_30px_rgba(249,115,22,0.25)]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Front-Runner CRM
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5">
              Enter authorized administrator credentials to proceed
            </p>
          </div>

          <AnimatePresence mode="wait">
            {authStep === "email" ? (
              <motion.form
                key="step-email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Admin Account Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@frontrunner.fit"
                      required
                      autoFocus
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder:text-neutral-600 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading || !email.trim()}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue With OTP</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step-otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthStep("email")}
                      className="text-[11px] text-orange-400 hover:underline"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="••••••"
                      required
                      autoFocus
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl px-4 py-3 pl-11 text-center font-mono text-xl tracking-[0.4em] font-bold text-orange-400 placeholder:text-neutral-700 outline-none transition-all"
                    />
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading || otp.length < 4}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Verify & Enter CRM</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. ENTERPRISE CRM DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* ── Left Sidebar (Docked Top-to-Bottom) ── */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col justify-between p-5 fixed inset-y-0 left-0 z-40">
        <div>
          {/* Brand Mark */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
              <Image
                src={appIcon}
                alt="Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="truncate">
              <div className="text-xs font-black tracking-wider text-orange-500 uppercase">
                FR COMMAND
              </div>
              <div className="text-[10px] text-neutral-400">Enterprise CRM</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 mb-2">
            Workspace
          </div>
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("authenticity")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "authenticity"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Authenticity & QR</span>
              <span className="ml-auto text-[10px] bg-neutral-950/80 px-1.5 py-0.5 rounded text-neutral-300">
                {batches.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Products & Catalog</span>
              <span className="ml-auto text-[10px] bg-neutral-950/80 px-1.5 py-0.5 rounded text-neutral-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Orders & Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Security Analytics</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-neutral-800 space-y-2">
          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 text-xs font-medium transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-orange-400" />
            <span>View Public Store</span>
            <ExternalLink className="w-3 h-3 ml-auto text-neutral-500" />
          </Link>

          <div className="px-3 py-1.5">
            <div className="text-xs font-bold text-white truncate">
              Admin Console
            </div>
            <div className="text-[10px] font-mono text-neutral-400 truncate">
              {adminEmail || AUTHORIZED_EMAIL}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-red-500/10 hover:text-red-400 text-neutral-400 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen bg-neutral-950">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-neutral-500 uppercase">
              FR COMMAND /
            </span>
            <span className="text-sm font-bold text-white capitalize">
              {activeTab === "authenticity"
                ? "Authenticity & QR Batches"
                : activeTab === "products"
                ? "Products & Catalog"
                : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add Product Button */}
            <button
              onClick={() => {
                setIsAddProductOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-orange-950/40 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Upload Product</span>
            </button>

            {/* Live Database Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL Live</span>
            </div>

            {/* Test Customer QR */}
            <Link
              href="/authenticate"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-400" />
              <span>Customer QR Check</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white md:hidden"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        {productSuccessMsg && (
          <div className="mx-6 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{productSuccessMsg}</span>
          </div>
        )}

        {/* Tab Canvas Content */}
        <div className="p-6 sm:p-8 max-w-7xl w-full">
          {/* ══════════════════════════════════════════════════════════════════════
              TAB 1: AUTHENTICITY CODE GENERATOR
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "authenticity" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Anti-Counterfeit Hologram Subsystem
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Authenticity Code Generator
                  </h1>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Generate unique 10-digit scratch codes and export packaging
                    CSVs for sticker printing press vendors.
                  </p>
                </div>

                <button
                  onClick={fetchData}
                  className="self-start sm:self-auto p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh Batches</span>
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-2xl text-sm flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* 2-Column Grid Aligned at Start */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Column 1: Generator Form */}
                <div className="xl:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-orange-400" />
                      Generate New Batch
                    </h2>
                    <button
                      type="button"
                      onClick={handleGenerateRandomBatchNumber}
                      className="text-[11px] text-orange-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate ID</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 mb-5">
                    Generate codes for holographic scratch stickers.
                  </p>

                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">
                        Batch Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="e.g. FR-WHEY-2026A"
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-neutral-700 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-neutral-400">
                          Linked Product
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddProductOpen(true)}
                          className="text-[11px] text-orange-400 hover:underline font-semibold"
                        >
                          + New Product
                        </button>
                      </div>
                      <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-neutral-200 outline-none transition-colors"
                      >
                        <option value="">-- Universal Batch (Any SKU) --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} (₹{(p.price / 100).toLocaleString("en-IN")})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-neutral-400">
                          Quantity (Number of Units) <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-1.5">
                          {[500, 1000, 5000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setCount(preset)}
                              className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors ${
                                count === preset
                                  ? "bg-orange-500/30 text-orange-400 font-bold"
                                  : "bg-neutral-800 text-neutral-400 hover:text-white"
                              }`}
                            >
                              +{preset}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Mfg Date
                        </label>
                        <input
                          type="date"
                          value={mfgDate}
                          onChange={(e) => setMfgDate(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-neutral-300 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={expDate}
                          onChange={(e) => setExpDate(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-neutral-300 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={generating}
                      className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Codes...</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Generate & Download CSV</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Column 2: Batches Table */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-orange-400" />
                          Manufactured Batches
                        </h2>
                        <p className="text-xs text-neutral-400">
                          Production batches and verification audit counters.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-xs font-mono text-neutral-300">
                        {batches.length} Batches
                      </span>
                    </div>

                    {loading ? (
                      <div className="py-16 flex flex-col items-center justify-center text-neutral-500 text-xs">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
                        Loading batch records...
                      </div>
                    ) : batches.length === 0 ? (
                      <div className="py-12 text-center border border-dashed border-neutral-800 rounded-2xl p-6">
                        <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-sm text-neutral-400 font-medium">
                          No batches created yet
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Use the form to generate your first batch.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
                              <th className="py-3 px-3">Batch Number</th>
                              <th className="py-3 px-3">Product</th>
                              <th className="py-3 px-3 text-right">Codes</th>
                              <th className="py-3 px-3 text-right">Verified</th>
                              <th className="py-3 px-3 text-right">Duplicates</th>
                              <th className="py-3 px-3 text-center">Export</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/60 font-medium">
                            {batches.map((b) => (
                              <tr
                                key={b.batchNumber}
                                className="hover:bg-neutral-800/40 transition-colors"
                              >
                                <td className="py-3.5 px-3 font-mono text-orange-400 font-bold">
                                  {b.batchNumber}
                                </td>
                                <td className="py-3.5 px-3 text-neutral-300 max-w-[140px] truncate">
                                  {b.product?.title || "Universal Batch"}
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono text-white">
                                  {b.totalCodes.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono text-emerald-400">
                                  {b.verifiedCodes.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono">
                                  {b.duplicateScans > 0 ? (
                                    <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                                      {b.duplicateScans}
                                      <AlertTriangle className="w-3 h-3" />
                                    </span>
                                  ) : (
                                    <span className="text-neutral-500">0</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <button
                                    onClick={() => triggerDownload(b.batchNumber)}
                                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                                    title="Download CSV"
                                  >
                                    <FileSpreadsheet className="w-3 h-3 text-orange-400" />
                                    <span>CSV</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Specification Callout */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-1">
                    <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-orange-400" />
                      <span>Packaging CSV Specification:</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Downloaded CSV includes sequential serial indices, 10-digit
                      scratch codes, and pre-formatted QR URLs (
                      <code className="text-orange-400 font-mono">
                        /authenticate?code=...
                      </code>
                      ) designed for printing onto holographic anti-tamper seals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 2: PRODUCTS CATALOG & UPLOAD MANAGEMENT
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2">
                    <Package className="w-3.5 h-3.5" />
                    Product Catalog & SKU Database
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Supplement Catalog
                  </h1>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Upload new products, configure pricing, manage inventory,
                    and link batches to live supplements.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Product</span>
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
                    title="Refresh Products"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product title, slug, or tag..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2 pl-10 text-xs text-white placeholder:text-neutral-600 outline-none transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {["ALL", "Recovery", "Bulk Up", "Performance", "Daily Health"].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setProductCategoryFilter(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          productCategoryFilter === cat
                            ? "bg-orange-500 text-white"
                            : "bg-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-neutral-500 text-xs">
                  <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
                  Loading products from PostgreSQL...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-neutral-800 rounded-3xl p-8">
                  <Package className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-base text-neutral-300 font-bold">
                    No products found
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    {productSearch
                      ? `No items match "${productSearch}". Try clearing your search.`
                      : "Click 'Upload New Product' to add your first supplement SKU."}
                  </p>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Upload Product Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 transition-all shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Preview & Badges */}
                        <div className="relative w-full h-44 rounded-2xl bg-neutral-950 flex items-center justify-center overflow-hidden mb-4 border border-neutral-800/80">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <Package className="w-10 h-10 text-neutral-700" />
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            {p.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-orange-500/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-sm shadow">
                                {p.badge}
                              </span>
                            )}
                            {p.tag && (
                              <span className="px-2 py-0.5 rounded-md bg-neutral-900/90 border border-neutral-700 text-neutral-300 font-semibold text-[10px] backdrop-blur-sm">
                                {p.tag}
                              </span>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-neutral-900/80 hover:bg-red-500 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete / Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Slug */}
                        <div className="text-[11px] font-mono text-neutral-500 mb-0.5 truncate">
                          {p.slug}
                        </div>
                        <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2">
                          {p.title}
                        </h3>

                        {/* Price & MRP */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-orange-400 font-black text-lg">
                            ₹{(p.price / 100).toLocaleString("en-IN")}
                          </span>
                          {p.mrp && p.mrp > p.price && (
                            <span className="text-xs text-neutral-500 line-through">
                              ₹{(p.mrp / 100).toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="ml-auto text-[11px] text-neutral-400 font-mono">
                            Stock: {p.stock ?? 100}
                          </span>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setProductId(p.id);
                            setActiveTab("authenticity");
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-orange-500/20 hover:text-orange-400 text-neutral-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                          <span>Generate QR Batch</span>
                        </button>

                        <Link
                          href={`/shop`}
                          target="_blank"
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                          title="View on Shop"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 3: ORDERS & FULFILLMENT
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800">
                <h1 className="text-2xl font-black text-white">
                  Orders & Fulfillment CRM
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Customer checkout orders and Razorpay transaction pipeline.
                </p>
              </div>

              <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800 max-w-xl mx-auto">
                <ShoppingCart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">
                  Order Telemetry Active
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Real-time webhook handlers automatically ingest payments from
                  Razorpay and bind batch verification tokens to customer
                  invoices.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 4: SECURITY ANALYTICS
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800">
                <h1 className="text-2xl font-black text-white">
                  Anti-Counterfeit Telemetry & Analytics
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Real-time audit counters, scan locations, and duplicate tamper
                  alerts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400 uppercase font-semibold mb-2">
                    Total Codes Generated
                  </div>
                  <div className="text-3xl font-black text-white font-mono">
                    {batches
                      .reduce((sum, b) => sum + b.totalCodes, 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400 uppercase font-semibold mb-2">
                    Genuine Customer Verifications
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    {batches
                      .reduce((sum, b) => sum + b.verifiedCodes, 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400 uppercase font-semibold mb-2">
                    Duplicate Interceptions (Tamper Alert)
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {batches
                      .reduce((sum, b) => sum + b.duplicateScans, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Add / Upload Product Modal ── */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddProductOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-orange-500" />
                    <span>Upload & Add New Product</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Create a new supplement SKU for the shop and batch tracking.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProductSubmit} className="space-y-5">
                {/* Product Title */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Product Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. 100% Pure Whey Isolate 2kg Chocolate"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-700 outline-none transition-colors"
                  />
                </div>

                {/* Price, MRP, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Selling Price (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="e.g. 3800"
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-neutral-700 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={productMrp}
                      onChange={(e) => setProductMrp(e.target.value)}
                      placeholder="e.g. 4200"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-neutral-700 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productStock}
                      onChange={(e) => setProductStock(e.target.value)}
                      placeholder="100"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-neutral-700 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Tag & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Category Tag
                    </label>
                    <select
                      value={productTag}
                      onChange={(e) => setProductTag(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-neutral-200 outline-none transition-colors"
                    >
                      <option value="Recovery">Recovery</option>
                      <option value="Bulk Up">Bulk Up</option>
                      <option value="Performance">Performance</option>
                      <option value="Daily Health">Daily Health</option>
                      <option value="Whey Isolate">Whey Isolate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Highlight Badge
                    </label>
                    <select
                      value={productBadge}
                      onChange={(e) => setProductBadge(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-neutral-200 outline-none transition-colors"
                    >
                      <option value="New">New</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Trending">Trending</option>
                      <option value="Limited">Limited</option>
                      <option value="Premium">Premium</option>
                      <option value="">None</option>
                    </select>
                  </div>
                </div>

                {/* Product Image Selector */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                      <span>Product Image</span>
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setImageSourceMode("upload")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          imageSourceMode === "upload"
                            ? "bg-orange-500 text-white"
                            : "bg-neutral-900 text-neutral-400 hover:text-white"
                        }`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode("presets")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          imageSourceMode === "presets"
                            ? "bg-orange-500 text-white"
                            : "bg-neutral-900 text-neutral-400 hover:text-white"
                        }`}
                      >
                        Brand Library
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode("custom_url")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          imageSourceMode === "custom_url"
                            ? "bg-orange-500 text-white"
                            : "bg-neutral-900 text-neutral-400 hover:text-white"
                        }`}
                      >
                        Direct URL
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Local File Upload */}
                  {imageSourceMode === "upload" && (
                    <div className="border-2 border-dashed border-neutral-800 hover:border-orange-500/50 rounded-xl p-5 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        id="product-file-input"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="product-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                      >
                        {isUploadingImage ? (
                          <div className="flex items-center gap-2 text-orange-400 text-xs">
                            <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <span>Uploading image...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-orange-400" />
                            <span className="text-xs text-white font-medium">
                              Click or drop image file here
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              PNG, JPG, WEBP (saves directly to /uploads)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  )}

                  {/* Mode 2: Brand Presets */}
                  {imageSourceMode === "presets" && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                      {PRESET_PRODUCT_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setProductImage(preset.url)}
                          className={`relative h-16 rounded-xl border p-1 transition-all flex items-center justify-center bg-neutral-900 cursor-pointer ${
                            productImage === preset.url
                              ? "border-orange-500 ring-2 ring-orange-500/30"
                              : "border-neutral-800 hover:border-neutral-700"
                          }`}
                          title={preset.label}
                        >
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            width={44}
                            height={44}
                            className="object-contain"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mode 3: Custom URL */}
                  {imageSourceMode === "custom_url" && (
                    <input
                      type="text"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      placeholder="https://example.com/image.png or /image/..."
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2 text-xs text-white outline-none font-mono"
                    />
                  )}

                  {/* Selected Image Preview Pill */}
                  {productImage && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 relative overflow-hidden flex items-center justify-center shrink-0">
                        <Image
                          src={productImage}
                          alt="Preview"
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono truncate">
                        Selected: <span className="text-white">{productImage}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe flavor notes, protein per scoop, serving size, etc."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-700 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct || !productTitle.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingProduct ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Publish Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
