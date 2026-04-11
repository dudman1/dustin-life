"use client";

import { useState } from "react";
import Image from "next/image";

const STATES = [
  "Michigan",
  "Indiana",
  "Ohio",
  "Illinois",
  "North Carolina",
  "Alabama",
  "West Virginia",
  "Pennsylvania",
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    smsConsent: false,
    termsConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formState.smsConsent || !formState.termsConsent) {
      setError("Please accept both consent checkboxes to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          state: formState.state,
          smsConsent: formState.smsConsent,
          termsConsent: formState.termsConsent,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col flex-1 gradient-mesh min-h-screen text-white">
      {/* ── NAV ────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <a href="/" className="block">
          <Image
            src="/wordmark-dark.jpg"
            alt="Dustin McCormick Life Insurance Specialist"
            width={220}
            height={55}
            priority
            className="object-contain"
          />
        </a>
        <div className="flex items-center gap-5">
          <a
            href="https://www.facebook.com/profile.php?id=61577772774808"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-500"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/w-dustin-mccormick/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-500"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-5 h-5" />
          </a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl text-center">
          {/* Eyebrow */}
          <p
            className="text-xs tracking-[0.25em] uppercase mb-8"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: "#c8a96e",
            }}
          >
            Licensed in MI &middot; IN &middot; OH &middot; IL &middot; NC &middot; AL &middot; WV &middot; PA
          </p>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Let&apos;s Figure Out What You{" "}
            <span style={{ color: "#c8a96e" }}>Actually</span> Need
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-zinc-400 max-w-2xl mx-auto">
            I&apos;m not a call center. I&apos;m not captive to one carrier. I shop
            the market for you, explain what actually matters, and disappear when
            you don&apos;t need me.
          </p>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            className="mt-10 inline-block px-8 py-3.5 text-sm font-medium tracking-widest uppercase border border-[#c8a96e] text-[#c8a96e] bg-transparent rounded-sm transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#080808] hover:shadow-[0_0_30px_rgba(200,169,110,0.2)]"
          >
            Get My Free Assessment
          </button>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────── */}
      <section className="border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {[
            "Independent — Not Captive to One Carrier",
            "Licensed Across 8 States",
            "No Obligation, Ever",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#c8a96e" }}
              />
              <span className="text-sm text-zinc-400 tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO SECTION ──────────────────────────────── */}
      <section style={{ padding: "64px 0", textAlign: "center" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.68rem",
              color: "#c8a96e",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "14px",
            }}
          >
            See How It Works
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 400,
              color: "#fff",
              marginBottom: "8px",
            }}
          >
            28 seconds. No fluff.
          </h2>
          <video
            src="/iul-explainer.mp4"
            controls
            playsInline
            muted
            style={{
              width: "100%",
              maxWidth: "720px",
              margin: "32px auto 0",
              display: "block",
              borderRadius: "12px",
              border: "1px solid rgba(200,169,110,0.2)",
            }}
          />
        </div>
      </section>

      {/* ── LEAD FORM SECTION ──────────────────────────── */}
      <section
        id="lead-form"
        className="px-6 py-20 md:py-28 flex flex-col items-center"
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Get Your Free Assessment
          </h2>
          <p className="mt-3 text-zinc-500 text-sm tracking-wide">
            Takes 60 seconds. No spam. Ever.
          </p>
        </div>

        <div className="w-full max-w-lg">
          {!submitted ? (
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="gold-input w-full rounded-lg border border-zinc-700/50 bg-white/5 px-4 py-3 text-white placeholder-zinc-600"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="gold-input w-full rounded-lg border border-zinc-700/50 bg-white/5 px-4 py-3 text-white placeholder-zinc-600"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                    className="gold-input w-full rounded-lg border border-zinc-700/50 bg-white/5 px-4 py-3 text-white placeholder-zinc-600"
                    placeholder="(248) 555-0100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <select
                    required
                    value={formState.state}
                    onChange={(e) =>
                      setFormState({ ...formState, state: e.target.value })
                    }
                    className="gold-input w-full rounded-lg border border-zinc-700/50 bg-white/5 px-4 py-3 text-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23c8a96e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="" disabled className="bg-zinc-900">
                      Select your state
                    </option>
                    {STATES.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SMS Consent */}
                <label className="flex items-start gap-3 text-xs text-zinc-500 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.smsConsent}
                    onChange={(e) =>
                      setFormState({ ...formState, smsConsent: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-white/5 accent-[#c8a96e] cursor-pointer flex-shrink-0"
                  />
                  <span>
                    I agree to receive text messages from William Dustin McCormick
                    at the phone number provided, including insurance quotes,
                    appointment reminders, and follow-up communications related to
                    my inquiry. Message frequency varies. Message and data rates may
                    apply. Reply STOP to opt out or HELP for assistance at any time.
                    Consent is not a condition of purchase.
                  </span>
                </label>

                {/* Terms Consent */}
                <label className="flex items-start gap-3 text-xs text-zinc-500 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.termsConsent}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        termsConsent: e.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-white/5 accent-[#c8a96e] cursor-pointer flex-shrink-0"
                  />
                  <span>
                    I have reviewed and accept William Dustin McCormick&apos;s{" "}
                    <a
                      href="/privacy"
                      className="underline text-[#c8a96e] hover:text-[#dfc08a]"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms"
                      className="underline text-[#c8a96e] hover:text-[#dfc08a]"
                    >
                      Terms and Conditions
                    </a>
                    .
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shimmer pulse-attention w-full rounded-lg py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#c8a96e",
                    color: "#080808",
                  }}
                >
                  {submitting ? "Submitting..." : "Get My Free Assessment"}
                </button>

                <p className="text-[10px] text-zinc-600 leading-relaxed pt-1">
                  By submitting this form, you are requesting a quote from William
                  Dustin McCormick, a licensed independent insurance agent. Your
                  information will be used solely to provide you with insurance
                  options and will not be sold or shared for marketing purposes.
                </p>
              </form>
            </div>
          ) : (
            /* ── SUCCESS STATE ──────────────────────── */
            <div className="glass-card rounded-2xl p-10 md:p-14 text-center">
              <div
                className="check-pop inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{
                  backgroundColor: "rgba(200, 169, 110, 0.15)",
                  color: "#c8a96e",
                }}
              >
                <CheckIcon className="w-8 h-8" />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Thank you, {formState.name.split(" ")[0]}.
              </h3>
              <p className="mt-3 text-zinc-400">
                Dustin will be in touch within 24 hours.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 px-6 py-10 text-center">
        <div
          className="text-sm font-semibold tracking-wider uppercase text-zinc-400"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          WILLIAM DUSTIN MCCORMICK
        </div>
        <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
          101 W Big Beaver Rd Ste 345, Troy, MI 48084
          <br />
          248-970-9094
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-600">
          <a href="/privacy" className="hover:text-[#c8a96e] transition-colors">
            Privacy Policy
          </a>
          <span className="text-zinc-800">|</span>
          <a href="/terms" className="hover:text-[#c8a96e] transition-colors">
            Terms
          </a>
        </div>
        <div className="mt-5 flex items-center justify-center gap-5">
          <a
            href="https://www.facebook.com/profile.php?id=61577772774808"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-600"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/w-dustin-mccormick/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-600"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>
        <p className="mt-6 text-[10px] text-zinc-800">
          &copy; 2026 William Dustin McCormick
        </p>
      </footer>
    </div>
  );
}
