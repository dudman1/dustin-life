"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
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
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="gradient-mesh flex min-h-screen flex-1 flex-col text-white"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <nav
        className="sticky top-0 z-50 flex items-center justify-between border-b border-[rgba(200,169,110,0.1)] px-6 py-3 md:px-12 lg:px-20"
        style={{
          backgroundColor: "rgba(15,17,21,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Link href="/" className="block">
          <img
            src="/dm-monogram.jpg"
            alt="DM"
            style={{
              height: "56px",
              width: "56px",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-gray-400 transition-colors hover:text-white">
            How It Works
          </a>
          <a href="#lead-form" className="text-sm text-gray-400 transition-colors hover:text-white">
            Free Assessment
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="tel:+12489709094"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              color: "var(--accent)",
              letterSpacing: "0.05em",
              textDecoration: "none",
              opacity: 0.85,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.21 2.36 2 2 0 012.22.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.56-1.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            248-970-9094
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61577772774808"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-500"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/w-dustin-mccormick/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-500"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </nav>

      <section className="hero-texture relative flex flex-1 items-center px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 md:text-sm">
              Licensed Nationwide
            </p>
            <h1 className="font-playfair mb-6 max-w-4xl text-5xl leading-tight md:text-7xl md:leading-snug">
              Let&apos;s Figure Out What You{" "}
              <em className="italic text-[#c8a96e]">Actually</em> Need
            </h1>
            <p className="mb-12 max-w-2xl text-lg font-light leading-relaxed text-gray-300 md:text-xl">
              I&apos;m not a call center. I&apos;m not captive to one carrier. I shop
              the market for you, explain what actually matters, and disappear when
              you don&apos;t need me.
            </p>
            <button
              onClick={scrollToForm}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(200,169,110,0.4), 0 4px 20px rgba(200,169,110,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(200,169,110,0.25), 0 4px 14px rgba(200,169,110,0.15)";
              }}
              className="bg-[#c8a96e] hover:bg-[#b8995e] rounded-full px-10 py-4 text-lg font-semibold text-black transition-all duration-300 hover:-translate-y-0.5"
              style={{
                boxShadow:
                  "0 0 20px rgba(200,169,110,0.25), 0 4px 14px rgba(200,169,110,0.15)",
              }}
            >
              Get My Free Assessment
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800/50">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6 py-12 md:flex-row md:gap-16 md:py-14">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm tracking-wide text-zinc-400">Independent Agent</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm tracking-wide text-zinc-400">Licensed Nationwide</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm tracking-wide text-zinc-400">No Obligation, Ever</span>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800/50 px-6 py-12 md:py-14">
        <div
          className="mx-auto max-w-5xl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            padding: "48px 0",
            flexWrap: "wrap",
          }}
        >
          <img
            src="/headshot.jpg"
            alt="Dustin McCormick — Licensed Life Insurance Agent"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center top",
              border: "2px solid rgba(200,169,110,0.3)",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "1.05rem",
                marginBottom: "6px",
                color: "var(--text)",
              }}
            >
              Dustin McCormick
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--accent)",
                marginBottom: "10px",
                fontFamily: "var(--mono)",
                letterSpacing: "0.04em",
              }}
            >
              Licensed Life Insurance Agent
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-2)",
                maxWidth: "420px",
                lineHeight: 1.65,
                fontWeight: 300,
              }}
            >
              I help families nationwide find life insurance that actually fits.
              No pressure, no captive carrier agenda. I work for you.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative w-full overflow-hidden bg-[#0f1115] px-6 py-24">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#c8a96e] opacity-[0.02] blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 space-y-6 lg:order-1"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e]">
                QUICK INTRO
              </p>
              <h2 className="font-playfair text-4xl leading-tight text-white md:text-5xl">
                28 seconds. <span className="italic text-gray-500">Then decide.</span>
              </h2>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-gray-800 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-inset ring-white/5 transition-colors duration-300 hover:border-gray-600">
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 group-[.video-playing]:opacity-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 shadow-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 text-[#c8a96e] opacity-90" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <video
                src="/iul-explainer.mp4"
                poster="/iul-performance.jpg"
                controls
                playsInline
                muted
                onPlay={(e) => e.currentTarget.closest(".group")?.classList.add("video-playing")}
                onPause={(e) => e.currentTarget.closest(".group")?.classList.remove("video-playing")}
                onEnded={(e) => e.currentTarget.closest(".group")?.classList.remove("video-playing")}
                className="aspect-video w-full bg-black object-cover"
              />
            </div>

            <p className="border-l-2 border-gray-800 pl-4 text-sm leading-relaxed text-gray-500">
              Watch the quick intro if you want context, or skip it and go straight
              to the assessment. Either way, the goal is clarity fast.
            </p>
          </motion.div>

          <motion.div
            id="lead-form"
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="rounded-2xl border border-gray-800 bg-[#16181d] p-6 md:p-8">
              {!submitted ? (
                <div className="rounded-2xl border border-[#c8a96e]/20 bg-[#16181D] p-8 shadow-2xl md:p-10">
                <div className="mb-8 text-center">
                  <h2 className="font-playfair mb-3 text-3xl md:text-4xl">
                    Get Your Free Assessment
                  </h2>
                  <p className="text-sm text-gray-400">
                    Takes 60 seconds. No spam. Ever.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7 md:space-y-8">
                  <div>
                    <label className="mb-3 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-800 bg-[#0a0b0e] px-4 py-3 text-white placeholder-gray-700 transition-colors duration-300 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] focus:outline-none"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="mb-3 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-800 bg-[#0a0b0e] px-4 py-3 text-white placeholder-gray-700 transition-colors duration-300 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                    <div>
                      <label className="mb-3 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-800 bg-[#0a0b0e] px-4 py-3 text-white placeholder-gray-700 transition-colors duration-300 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] focus:outline-none"
                        placeholder="(248) 555-0100"
                      />
                    </div>

                    <div>
                      <label className="mb-3 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                        State
                      </label>
                      <select
                        required
                        value={formState.state}
                        onChange={(e) =>
                          setFormState({ ...formState, state: e.target.value })
                        }
                        className="w-full appearance-none rounded-lg border border-gray-800 bg-[#0a0b0e] px-4 py-3 text-white transition-colors duration-300 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] focus:outline-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23c8a96e\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 16px center",
                        }}
                      >
                        <option value="" disabled className="bg-[#0a0b0e] text-gray-500">
                          Select your state
                        </option>
                        {STATES.map((state) => (
                          <option key={state} value={state} className="bg-[#0a0b0e]">
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="group flex cursor-pointer items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formState.smsConsent}
                      onChange={(e) =>
                        setFormState({ ...formState, smsConsent: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-[#0a0b0e] text-[#c8a96e] focus:ring-[#c8a96e]"
                    />
                    <span className="text-xs leading-relaxed text-gray-500 transition-colors group-hover:text-gray-400">
                      I agree to receive text messages from William Dustin McCormick
                      (Dustin McCormick) at the phone number provided, including insurance quotes,
                      appointment reminders, and follow-up communications related to
                      my inquiry. Message frequency varies. Message and data rates
                      may apply. Reply STOP to opt out or HELP for assistance at any
                      time. Consent is not a condition of purchase.
                    </span>
                  </label>

                  <label className="group flex cursor-pointer items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formState.termsConsent}
                      onChange={(e) =>
                        setFormState({ ...formState, termsConsent: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-[#0a0b0e] text-[#c8a96e] focus:ring-[#c8a96e]"
                    />
                    <span className="text-xs leading-relaxed text-gray-500 transition-colors group-hover:text-gray-400">
                      I have reviewed and accept Dustin McCormick&apos;s{" "}
                      <Link href="/privacy" className="text-[#c8a96e] hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="text-[#c8a96e] hover:underline">
                        Terms and Conditions
                      </Link>
                      .
                    </span>
                  </label>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full rounded-lg bg-[#c8a96e] py-4 text-lg font-semibold text-black shadow-[0_4px_14px_0_rgba(200,169,110,0.2)] transition-all duration-300 hover:bg-[#b8995e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Get My Free Assessment"}
                  </button>

                  <p className="pt-1 text-[10px] leading-relaxed text-zinc-600">
                    By submitting this form, you are requesting a quote from Dustin
                    McCormick, a licensed independent insurance agent. Your
                    information will be used solely to provide you with insurance
                    options and will not be sold or shared for marketing purposes.
                  </p>
                </form>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#c8a96e]/20 bg-[#16181D] p-8 text-center shadow-2xl md:p-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(200,169,110,0.15)] text-[#c8a96e]">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <h3 className="font-playfair text-2xl">
                  Thank you, {formState.name.split(" ")[0]}.
                </h3>
                <p className="mt-3 text-zinc-400">
                  Dustin will be in touch within 24 hours.
                </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 px-6 py-10 text-center">
        <div className="font-playfair text-sm font-semibold uppercase tracking-wider text-zinc-400">
          DUSTIN MCCORMICK
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-600">
          101 W Big Beaver Rd Ste 345, Troy, MI 48084
          <br />
          248-970-9094
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-600">
          <Link href="/privacy" className="transition-colors hover:text-[#c8a96e]">
            Privacy Policy
          </Link>
          <span className="text-zinc-800">|</span>
          <Link href="/terms" className="transition-colors hover:text-[#c8a96e]">
            Terms
          </Link>
        </div>
        <div className="mt-5 flex items-center justify-center gap-5">
          <a
            href="https://www.facebook.com/profile.php?id=61577772774808"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-600"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/w-dustin-mccormick/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon text-zinc-600"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-6 text-[10px] text-zinc-800">
          &copy; 2026 Dustin McCormick
        </p>
      </footer>
    </div>
  );
}

/*
---
*Last updated: 2026-04-12 23:02 ET | Updated by: Forge*
*/
