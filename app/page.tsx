"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const STATES = ["MI", "IN", "OH", "IL", "NC", "AL", "WV", "PA"];

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
    <div className="gradient-mesh flex min-h-screen flex-1 flex-col text-white">
      <nav
        className="sticky top-0 z-50 flex items-center justify-between border-b border-[rgba(200,169,110,0.1)] px-6 py-5 md:px-12 lg:px-20"
        style={{
          backgroundColor: "rgba(15,17,21,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Link href="/" className="block">
          <Image
            src="/wordmark-dark.jpg"
            alt="Dustin McCormick Life Insurance Specialist"
            width={220}
            height={55}
            priority
            className="object-contain"
          />
        </Link>
        <div className="flex items-center gap-5">
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
              Licensed in MI, IN, OH, IL, NC, AL, WV, PA
            </p>
            <h1 className="font-playfair mb-6 max-w-4xl text-5xl leading-tight md:text-7xl md:leading-snug">
              Let&apos;s Figure Out What You{" "}
              <em className="italic text-[#c8a96e]">Actually</em> Need
            </h1>
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              I&apos;m not a call center. I&apos;m not captive to one carrier. I shop
              the market for you, explain what actually matters, and disappear when
              you don&apos;t need me.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-[#c8a96e] hover:bg-[#b8995e] rounded-full px-10 py-4 text-lg font-semibold text-black shadow-[0_4px_14px_0_rgba(200,169,110,0.39)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Get My Free Assessment
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800/50">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6 py-12 md:flex-row md:gap-16 md:py-14">
          {[
            "Independent, not captive to one carrier",
            "Licensed across 8 states",
            "No obligation, ever",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c8a96e]" />
              <span className="text-sm tracking-wide text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-[#0f1115] px-6 py-24">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#c8a96e] opacity-[0.02] blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e]">
                SEE HOW IT WORKS
              </p>
              <h2 className="font-playfair text-4xl leading-tight text-white md:text-5xl">
                28 seconds. <span className="italic text-gray-500">No fluff.</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-800 ring-1 ring-inset ring-white/5 transition-colors duration-300 hover:border-gray-600">
              <video
                src="/iul-explainer.mp4"
                controls
                playsInline
                muted
                className="aspect-video w-full bg-black object-cover"
              />
            </div>

            <p className="border-l-2 border-gray-800 pl-4 text-sm leading-relaxed text-gray-500">
              I designed this process to respect your time. Watch the breakdown,
              then grab your custom assessment on the right.
            </p>
          </motion.div>

          <motion.div
            id="lead-form"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
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
                    <label className="mb-2 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
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
                      <label className="mb-2 ml-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
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
                      I agree to receive text messages from William Dustin McCormick at
                      the phone number provided, including insurance quotes,
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
                      I have reviewed and accept William Dustin McCormick&apos;s{" "}
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
                    By submitting this form, you are requesting a quote from William
                    Dustin McCormick, a licensed independent insurance agent. Your
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
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 px-6 py-10 text-center">
        <div className="font-playfair text-sm font-semibold uppercase tracking-wider text-zinc-400">
          WILLIAM DUSTIN MCCORMICK
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
          &copy; 2026 William Dustin McCormick
        </p>
      </footer>
    </div>
  );
}
