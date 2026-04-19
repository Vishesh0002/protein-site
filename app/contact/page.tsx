"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

type Field = "firstName" | "lastName" | "email" | "phone" | "message";

const contactMethods = [
  {
    icon: Mail,
    label: "Email Us",
    value: "frontrunner2009@gmail.com",
    href: "frontrunner2009@gmail.com",
    hint: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 9997055376",
    href: "tel:+919997055376",
    hint: "Mon–Sat, 9am to 7pm IST",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Rampur, India",
    href: "#",
    hint: "Head office & warehouse",
  },
];

const socials = [
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

const faqs = [
  {
    q: "How fast is shipping?",
    a: "Most orders ship within 24 hours and arrive in 2–5 business days across India.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Yes! Reach out via the form below with your requirements and we'll craft a custom deal.",
  },
  {
    q: "Are your products third-party tested?",
    a: "Absolutely. Every batch is independently lab-tested for purity and potency.",
  },
];

// 3D tilt card wrapper
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [6, -6]);
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<Record<Field, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [focused, setFocused] = useState<Field | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const url =
      "https://api.hsforms.com/submissions/v3/integration/submit/245955825/82164711-3c79-4504-b998-fa9a9da215eb";

    const payload = {
      fields: [
        { objectTypeId: "0-1", name: "firstname", value: form.firstName },
        { objectTypeId: "0-1", name: "lastname", value: form.lastName },
        { objectTypeId: "0-1", name: "email", value: form.email },
        { objectTypeId: "0-1", name: "phone", value: form.phone },
        { objectTypeId: "0-1", name: "message", value: form.message },
      ],
      context: {
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: "Contact | Front Runner Health Care",
      },
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.errors?.[0]?.message ||
          data?.message ||
          "Submission failed. Please try again.";
        throw new Error(msg);
      }

      setSubmitted(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name: Field) => ({
    name,
    value: form[name],
    onChange: handleChange,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    required: true,
  });

  const labelClass = (name: Field) =>
    `pointer-events-none absolute left-4 transition-all duration-200 ${
      focused === name || form[name]
        ? "top-1.5 text-[11px] font-semibold uppercase tracking-widest text-orange-400"
        : "top-1/2 -translate-y-1/2 text-sm text-white/40"
    }`;

  const inputClass =
    "peer w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pt-6 pb-2 text-white transition-all duration-200 focus:border-orange-500/60 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-orange-500/10";

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 pt-[72px] text-white">
      {/* Animated background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-orange-500/20 blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-amber-600/15 blur-[160px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_60%)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400"
          >
            <MessageCircle size={12} />
            Let&apos;s Talk
          </motion.div>
          <h1 className="mb-5 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="block text-white">We&apos;d Love to</span>
            <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/60 md:text-lg">
            Questions about products, partnerships, or your fitness journey — our team is here to help you go the extra mile.
          </p>
        </motion.div>

        {/* Contact method cards */}
        <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-3">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
              >
                <TiltCard>
                  <a
                    href={method.href}
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-sm transition-colors hover:border-orange-500/40"
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-orange-500/0 blur-3xl transition-all duration-500 group-hover:bg-orange-500/30" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-400 ring-1 ring-orange-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon size={20} />
                      </div>
                      <ArrowRight
                        size={18}
                        className="translate-x-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-400"
                      />
                    </div>
                    <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                      {method.label}
                    </h3>
                    <p className="mt-1.5 text-lg font-bold text-white transition-colors group-hover:text-orange-400">
                      {method.value}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
                      <Clock size={11} />
                      {method.hint}
                    </p>
                  </a>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Form + side panel */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-sm md:p-10 lg:col-span-3"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_50%)]" />

            <div className="relative">
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Fill in the form below and we&apos;ll get back to you as soon as possible.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="relative">
                  <input
                    type="text"
                    {...fieldProps("firstName")}
                    className={inputClass}
                  />
                  <label className={labelClass("firstName")}>First Name</label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    {...fieldProps("lastName")}
                    className={inputClass}
                  />
                  <label className={labelClass("lastName")}>Last Name</label>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="relative">
                  <input
                    type="email"
                    {...fieldProps("email")}
                    className={inputClass}
                  />
                  <label className={labelClass("email")}>Email Address</label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    {...fieldProps("phone")}
                    className={inputClass}
                  />
                  <label className={labelClass("phone")}>Phone Number</label>
                </div>
              </div>

              <div className="relative mt-5">
                <textarea
                  {...fieldProps("message")}
                  rows={6}
                  className={`${inputClass} resize-none pt-7`}
                />
                <label
                  className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                    focused === "message" || form.message
                      ? "top-2 text-[11px] font-semibold uppercase tracking-widest text-orange-400"
                      : "top-5 text-sm text-white/40"
                  }`}
                >
                  Your Message
                </label>
                <div className="absolute right-3 bottom-3 text-[11px] text-white/30">
                  {form.message.length} chars
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitted || submitting}
                whileHover={{ scale: submitted || submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitted || submitting ? 1 : 0.98 }}
                className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition-shadow hover:shadow-orange-500/40 disabled:opacity-80 md:w-auto md:px-10"
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} />
                      Message Sent!
                    </motion.span>
                  ) : submitting ? (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} className="transition-transform group-hover:translate-x-1" />
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Shine effect */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </motion.button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </motion.form>

          {/* Side panel: FAQ + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-6 lg:col-span-2"
          >
            {/* FAQ */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-sm md:p-8">
              <h3 className="text-xl font-black tracking-tight">Quick Answers</h3>
              <p className="mt-1 text-sm text-white/50">Common questions, answered.</p>

              <div className="mt-6 space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={faq.q}
                      className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/10"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                      >
                        <span className="text-sm font-semibold text-white">
                          {faq.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                            isOpen
                              ? "bg-orange-500 text-white"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          +
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          >
                            <p className="px-4 pb-4 text-sm leading-relaxed text-white/60">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent p-6 backdrop-blur-sm md:p-8">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="relative">
                <h3 className="text-xl font-black tracking-tight">Follow the Journey</h3>
                <p className="mt-1 text-sm text-white/60">
                  Stay updated with training tips, new drops, and community wins.
                </p>

                <div className="mt-5 flex gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
                    >
                      <Icon width={18} height={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
