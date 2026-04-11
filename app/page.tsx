"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Michigan",
    smsConsent: false,
    termsConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.smsConsent || !formState.termsConsent) return;
    // TODO: POST to /api/lead
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* ── HERO ────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
        <div className="max-w-2xl text-center">
          {/* TODO: A/B test — swap headlines below.
              Version A (default): fear / peace-of-mind trigger
              Version C: personal trust trigger
              See ~/wealthforge/dustinlife-content.md section 1 for all variants. */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Family Deserves Protection That Lasts Longer Than You Do
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            I help Michigan families lock in coverage that protects the people
            you love — today, tomorrow, and for generations. No pressure. No
            corporate runaround. Just honest answers.
          </p>

          {/* ── LEAD FORM ──────────────────────────── */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-12 mx-auto max-w-md text-left space-y-4"
            >
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={formState.phone}
                onChange={(e) =>
                  setFormState({ ...formState, phone: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={formState.state}
                onChange={(e) =>
                  setFormState({ ...formState, state: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Michigan</option>
              </select>

              <Button type="submit" className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-6 text-lg">
                Get My Free Quote
              </Button>

              {/* ── SMS CONSENT CHECKBOXES ────────── */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={formState.smsConsent}
                    onChange={(e) =>
                      setFormState({ ...formState, smsConsent: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>
                    I agree to receive text messages from William Dustin
                    McCormick at the phone number provided, including insurance
                    quotes, appointment reminders, and follow-up communications
                    related to my inquiry. Message frequency varies. Message and
                    data rates may apply. Reply STOP to opt out or HELP for
                    assistance at any time. Consent is not a condition of
                    purchase.
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={formState.termsConsent}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        termsConsent: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>
                    I have reviewed and accept William Dustin McCormick&apos;s{" "}
                    <a href="/privacy" className="underline text-emerald-400 hover:text-emerald-300">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms" className="underline text-emerald-400 hover:text-emerald-300">
                      Terms and Conditions
                    </a>
                    .
                  </span>
                </label>
              </div>

              <p className="text-xs text-zinc-500 pt-1">
                By submitting this form, you are requesting a quote from William
                Dustin McCormick, a licensed independent insurance agent. Your
                information will be used solely to provide you with insurance
                options and will not be sold or shared for marketing purposes.
              </p>
            </form>
          ) : (
            <div className="mt-12 rounded-lg border border-emerald-700 bg-emerald-950/50 p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-emerald-400">
                Thank you, {formState.name.split(" ")[0]}!
              </h2>
              <p className="mt-3 text-zinc-300">
                I&apos;ll reach out within 24 hours with your personalized
                options. If you have questions now, call me directly at{" "}
                <a href="tel:+12489709094" className="text-emerald-400 underline">
                  248-970-9094
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-8 text-center text-sm text-zinc-500">
        <p>
          © {new Date().getFullYear()} William Dustin McCormick · 101 W Big
          Beaver Rd Ste 345, Troy, MI 48084
        </p>
        <p className="mt-2 space-x-4">
          <a href="/privacy" className="hover:text-zinc-300">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-zinc-300">
            Terms and Conditions
          </a>
        </p>
      </footer>
    </div>
  );
}
