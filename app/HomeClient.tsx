"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import SiteChrome from "@/app/components/SiteChrome";
import styles from "./dustinlife-v2.module.css";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomeClient() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    smsConsent: false,
    termsConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkboxError, setCheckboxError] = useState({ sms: false, terms: false });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCheckboxError({ sms: false, terms: false });

    let valid = true;
    if (!formState.smsConsent) { setCheckboxError((p) => ({ ...p, sms: true })); valid = false; }
    if (!formState.termsConsent) { setCheckboxError((p) => ({ ...p, terms: true })); valid = false; }
    if (!valid) {
      setError("Please accept both consent checkboxes to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
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

  return (
    <SiteChrome current="home">
      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroSplit}>
              <div className={styles.heroCopy}>
                <div className={styles.eyebrow}>
                  <ShieldIcon />
                  Licensed Nationwide
                </div>
                <h1 className={styles.display}>Let&apos;s Figure Out What You <em className={styles.heroAccent}>Actually</em> Need</h1>
                <p className={styles.lead}>
                  I&apos;m an independent life insurance agent, so I can shop options, explain the tradeoffs,
                  and help you choose a policy that makes sense without the pressure.
                </p>
                <p className={styles.support}>
                  If you want help covering burial expenses, protecting loved ones, or understanding how
                  Indexed Universal Life works, start with the path that matches your goal.
                </p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryLink} href="#start-here">Choose My Path</a>
                  <a className={styles.outlineLink} href="#assessment">Get My Free Assessment</a>
                </div>
              </div>

              <aside className={styles.heroChecklistCard}>
                <div className={styles.heroChecklistHeader}>Fast, clean coverage signals.</div>
                <ul className={styles.heroChecklist}>
                  <li className={styles.heroChecklistItem}><CheckIcon />Instant underwriting</li>
                  <li className={styles.heroChecklistItem}><CheckIcon />No medical exams</li>
                  <li className={styles.heroChecklistItem}><CheckIcon />Same-day coverage</li>
                  <li className={styles.heroChecklistItem}><CheckIcon />Trusted carriers</li>
                </ul>
              </aside>
            </div>
          </section>

          <section className={`${styles.section} ${styles.trustStrip}`}>
            <div className={styles.trustItem}>
              <ShieldIcon />
              Independent Agent
            </div>
            <div className={styles.trustItem}>
              <PinIcon />
              Licensed Nationwide
            </div>
            <div className={styles.trustItem}>
              <CheckIcon />
              No Pressure, No Obligation
            </div>
          </section>

          <section className={styles.section} id="start-here">
            <div className={styles.sectionCard}>
              <div className={styles.sectionHead}>
                <div className={styles.eyebrow}>Start Here</div>
                <h2 className={styles.sectionTitle}>Choose the kind of help you want.</h2>
                <p className={styles.sectionIntro}>Two clear paths, one conversation, zero pressure.</p>
              </div>

              <div className={styles.pathGrid}>
                <article className={styles.pathCard}>
                  <h3 className={styles.cardTitle}>Cover Burial Expenses</h3>
                  <p className={styles.cardText}>Final expense coverage can help protect your family from funeral costs, final bills, and other end-of-life expenses.</p>
                  <ul className={styles.list}>
                    <li>Focused on burial and final expense needs</li>
                    <li>Simple, practical guidance</li>
                    <li>Built for families who want clarity fast</li>
                  </ul>
                  <div className={styles.pathActions}>
                    <Link className={styles.primaryLink} href="/final-expense">Explore Final Expense</Link>
                  </div>
                </article>

                <article className={styles.pathCard}>
                  <h3 className={styles.cardTitle}>Build Cash Value</h3>
                  <p className={styles.cardText}>Indexed Universal Life can offer permanent protection with cash value potential when it is designed the right way.</p>
                  <ul className={styles.list}>
                    <li>Understand how IUL really works</li>
                    <li>See where flexibility and cash value fit</li>
                    <li>Review whether it belongs in your plan</li>
                  </ul>
                  <div className={styles.pathActions}>
                    <Link className={styles.primaryLink} href="/indexed-universal-life">Explore Indexed Universal Life</Link>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.profileCard}>
              <img className={styles.smallHeadshot} src="/headshot.jpg" alt="Dustin McCormick" />
              <div>
                <h3 className={styles.profileName}>Dustin McCormick</h3>
                <div className={styles.profileRole}>Licensed Life Insurance Agent</div>
                <p className={styles.cardText}>
                  I help families nationwide compare life insurance options with a straightforward process,
                  honest answers, and no captive carrier agenda.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHead}>
                <div className={styles.eyebrow}>How I help</div>
                <h2 className={styles.sectionTitle}>Clear guidance, not a hard sell.</h2>
              </div>

              <div className={styles.infoGridCompact}>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Compare options</h3>
                  <p className={styles.cardText}>I work independently, which means I can help you compare carriers instead of forcing one preset answer.</p>
                </article>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Keep it simple</h3>
                  <p className={styles.cardText}>You get a straightforward explanation of what the policy does, what it costs, and what to watch for.</p>
                </article>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Move at your pace</h3>
                  <p className={styles.cardText}>Ask questions, review options, and decide when you are ready. No pressure, no obligation.</p>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section} id="assessment">
            <div className={styles.formShell}>
              <div className={styles.formCard}>
                <h2 className={styles.sectionTitle}>Get Your Free Assessment</h2>
                <p className={styles.sectionIntro}>Takes about a minute. No spam. No obligation.</p>

                {!submitted ? (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGrid}>
                      <div>
                        <label className={styles.label} htmlFor="form-name">Full Name</label>
                        <input id="form-name" name="name" className={styles.input} type="text" required autoComplete="name" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} placeholder="Full name" />
                      </div>
                      <div>
                        <label className={styles.label} htmlFor="form-email">Email Address</label>
                        <input id="form-email" name="email" className={styles.input} type="email" required autoComplete="email" inputMode="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder="you@email.com" />
                      </div>
                      <div>
                        <label className={styles.label} htmlFor="form-phone">Phone Number</label>
                        <input id="form-phone" name="phone" className={styles.input} type="tel" required autoComplete="tel" inputMode="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} placeholder="(248) 555-0100" />
                      </div>
                      <div>
                        <label className={styles.label} htmlFor="form-state">State</label>
                        <select id="form-state" name="state" className={styles.select} required autoComplete="address-level1" value={formState.state} onChange={(e) => setFormState({ ...formState, state: e.target.value })}>
                          <option value="" disabled>Select your state</option>
                          {STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <label className={styles.checkboxRow}>
                      <input id="form-sms-consent" name="smsConsent" className={styles.checkbox} type="checkbox" required checked={formState.smsConsent} onChange={(e) => { setFormState({ ...formState, smsConsent: e.target.checked }); if (e.target.checked) setCheckboxError((p) => ({ ...p, sms: false })); }} />
                      <span className={styles.smallNote}>I agree to receive text messages from Dustin McCormick at the phone number provided, including insurance quotes, appointment reminders, and follow-up communications related to my inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance at any time. Consent is not a condition of purchase.</span>
                    </label>
                    {checkboxError.sms ? <p className={styles.fieldError} role="alert">You must accept SMS consent to continue.</p> : null}

                    <label className={styles.checkboxRow}>
                      <input id="form-terms-consent" name="termsConsent" className={styles.checkbox} type="checkbox" required checked={formState.termsConsent} onChange={(e) => { setFormState({ ...formState, termsConsent: e.target.checked }); if (e.target.checked) setCheckboxError((p) => ({ ...p, terms: false })); }} />
                      <span className={styles.smallNote}>I have reviewed and accept Dustin McCormick&apos;s <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Conditions</Link>.</span>
                    </label>
                    {checkboxError.terms ? <p className={styles.fieldError} role="alert">You must accept the terms to continue.</p> : null}

                    {error ? <p className={styles.error}>{error}</p> : null}

                    <div className={styles.formButtonRow}>
                      <button className={styles.primaryLink} type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Get My Free Assessment"}
                      </button>
                    </div>

                    <p className={styles.formDisclosure}>By submitting this form, you are requesting a quote from Dustin McCormick, a licensed independent insurance agent. Your information will be used solely to provide you with insurance options and will not be sold or shared for marketing purposes.</p>
                  </form>
                ) : (
                  <p className={styles.success}>Thanks — Dustin will follow up within one business day. No obligation.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

    </SiteChrome>
  );
}

/*
---
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
