"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import styles from "./dustinlife-v2.module.css";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.21 2.36 2 2 0 012.22.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.56-1.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SiteHeader({ current }: { current: "home" | "iul" | "faq" }) {
  return (
    <>
      <div className={styles.topbar}>
        <div className={`${styles.wrap} ${styles.topbarInner}`}>
          Speak with a licensed agent: <a href="tel:+12489709094">248-970-9094</a> · No obligation, ever.
        </div>
      </div>

      <header className={styles.header}>
        <div className={`${styles.wrap} ${styles.navRow}`}>
          <Link href="/" className={styles.brand}>
            <img src="/dm-monogram.jpg" alt="DM" />
            <div className={styles.brandCopy}>
              <strong>Dustin McCormick</strong>
              <span>Licensed Independent Agent</span>
            </div>
          </Link>

          <nav className={styles.navMain} aria-label="Primary">
            <Link href="/" data-active={current === "home"}>Home</Link>
            <Link href="/final-expense">Final Expense</Link>
            <Link href="/indexed-universal-life" data-active={current === "iul"}>Indexed Universal Life</Link>
            <Link href="/faq" data-active={current === "faq"}>FAQ</Link>
          </nav>

          <div className={styles.navRight}>
            <a className={styles.phoneLink} href="tel:+12489709094">
              <PhoneIcon />
              248-970-9094
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerInner}`}>
        <div className={styles.footerName}>Dustin McCormick</div>
        <p className={styles.footerAddress}>
          101 W Big Beaver Rd Ste 345, Troy, MI 48084
          <br />
          248-970-9094
        </p>
        <div className={styles.footerLinks}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <a href="#">Disclosures</a>
        </div>
        <div className={styles.socialRow}>
          <a className={styles.socialLink} href="https://www.facebook.com/profile.php?id=61577772774808" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a className={styles.socialLink} href="https://www.linkedin.com/in/w-dustin-mccormick/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
        <p className={styles.footerCopy}>© 2026 Dustin McCormick</p>
      </div>
    </footer>
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <div className={styles.page}>
      <SiteHeader current="home" />

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <ShieldIcon />
                Licensed Nationwide
              </div>
              <h1 className={styles.display}>Let&apos;s Figure Out What You Actually Need</h1>
              <p className={styles.lead}>
                I&apos;m not a call center. I&apos;m not captive to one carrier. I shop the market for you,
                explain what actually matters, and disappear when you don&apos;t need me.
              </p>
              <p className={styles.support}>
                Same no-pressure tone, cleaner structure. Pick the path that matches what you want,
                then keep moving.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryLink} href="#start-here">Choose My Path</a>
                <a className={styles.outlineLink} href="#assessment">Get My Free Assessment</a>
                <a className={styles.iconLink} href="mailto:transamerica.dustin@gmail.com" aria-label="Talk to Dustin by email">
                  <EmailIcon />
                </a>
              </div>
              <div className={styles.heroNote}>
                <strong>Clean fix, not a giant redesign.</strong>
                The homepage keeps the current Dustin voice, removes the clutter, and leaves the big duplicate headshots dead.
              </div>
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
                <h2 className={styles.sectionTitle}>Pick the direction that fits what you want.</h2>
                <p className={styles.sectionIntro}>Just two options. No fake complexity, no extra wandering.</p>
              </div>

              <div className={styles.pathGrid}>
                <article className={styles.pathCard}>
                  <div className={styles.tag}>Path 1</div>
                  <h3 className={styles.cardTitle}>Cover Burial Expenses</h3>
                  <p className={styles.cardText}>For people who want final expense coverage that can help protect family from funeral costs, final bills, and an unexpected cash problem.</p>
                  <ul className={styles.list}>
                    <li>Simple coverage conversation</li>
                    <li>Focus on burial and end-of-life costs</li>
                    <li>Keep it practical and easy to understand</li>
                  </ul>
                  <div className={styles.pathActions}>
                    <Link className={styles.primaryLink} href="/final-expense">Go to Final Expense</Link>
                  </div>
                </article>

                <article className={styles.pathCard}>
                  <div className={styles.tag}>Path 2</div>
                  <h3 className={styles.cardTitle}>Build Cash Value</h3>
                  <p className={styles.cardText}>For people exploring Indexed Universal Life and wanting to understand cash value, flexibility, and where it may or may not fit.</p>
                  <ul className={styles.list}>
                    <li>Clearer IUL explanation</li>
                    <li>Quick intro video moved there</li>
                    <li>No overhyped retirement pitch</li>
                  </ul>
                  <div className={styles.pathActions}>
                    <Link className={styles.primaryLink} href="/indexed-universal-life">Go to Indexed Universal Life</Link>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.profileCard}>
              <img className={styles.smallHeadshot} src="/headshot.jpg" alt="Dustin McCormick" />
              <div>
                <div className={styles.tag}>Keep this block on the homepage</div>
                <h3 className={styles.profileName}>Dustin McCormick</h3>
                <div className={styles.profileRole}>Licensed Life Insurance Agent</div>
                <p className={styles.cardText}>
                  I help families nationwide find life insurance that actually fits. No pressure, no captive carrier agenda. I work for you.
                </p>
                <p className={styles.smallNote}>This stays directly under Start Here, per your spec.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHead}>
                <div className={styles.eyebrow}>What changes, what stays</div>
                <h2 className={styles.sectionTitle}>Homepage changes are surgical, not a demolition.</h2>
              </div>

              <div className={styles.infoGridCompact}>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Keep</div>
                  <h3 className={styles.cardTitle}>Current brand spine</h3>
                  <p className={styles.cardText}>The DM logo, the trust-first tone, and the Dustin context stay.</p>
                </article>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Change</div>
                  <h3 className={styles.cardTitle}>CTA clarity</h3>
                  <p className={styles.cardText}>The CTA order is now exactly: Choose My Path, Get My Free Assessment, Talk to Dustin.</p>
                </article>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Move</div>
                  <h3 className={styles.cardTitle}>Video off the homepage</h3>
                  <p className={styles.cardText}>The Quick Intro 28 Seconds video now lives on Indexed Universal Life where it actually belongs.</p>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section} id="assessment">
            <div className={styles.twoCol}>
              <div className={styles.formCard}>
                <div className={styles.tag}>Get Your Free Assessment</div>
                <h2 className={styles.sectionTitle}>Keep the form lower on the page.</h2>
                <p className={styles.sectionIntro}>That part of your spec is right. People should know what they are doing before the form shows up.</p>

                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                      <div>
                        <label className={styles.label}>Full Name</label>
                        <input className={styles.input} type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} placeholder="John Smith" />
                      </div>
                      <div>
                        <label className={styles.label}>Email Address</label>
                        <input className={styles.input} type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className={styles.label}>Phone Number</label>
                        <input className={styles.input} type="tel" required value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} placeholder="(248) 555-0100" />
                      </div>
                      <div>
                        <label className={styles.label}>State</label>
                        <select className={styles.select} required value={formState.state} onChange={(e) => setFormState({ ...formState, state: e.target.value })}>
                          <option value="" disabled>Select your state</option>
                          {STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <label className={styles.checkboxRow}>
                      <input className={styles.checkbox} type="checkbox" checked={formState.smsConsent} onChange={(e) => setFormState({ ...formState, smsConsent: e.target.checked })} />
                      <span className={styles.smallNote}>I agree to receive text messages from Dustin McCormick at the number provided regarding insurance quotes and related follow-up. Message and data rates may apply. Reply STOP to opt out.</span>
                    </label>

                    <label className={styles.checkboxRow}>
                      <input className={styles.checkbox} type="checkbox" checked={formState.termsConsent} onChange={(e) => setFormState({ ...formState, termsConsent: e.target.checked })} />
                      <span className={styles.smallNote}>I have reviewed and accept the <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Conditions</Link>.</span>
                    </label>

                    {error ? <p className={styles.error}>{error}</p> : null}

                    <div className={styles.heroActions}>
                      <button className={styles.primaryLink} type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Get My Free Assessment"}
                      </button>
                    </div>
                    <p className={styles.formNote}>This keeps the existing live homepage lead flow wired to <code>/api/lead</code>.</p>
                  </form>
                ) : (
                  <p className={styles.success}>Thanks. Dustin will be in touch within 24 hours.</p>
                )}
              </div>

              <aside className={styles.callout}>
                <div className={styles.tag}>Blunt take</div>
                <h3 className={styles.cardTitle}>This is the right level of change.</h3>
                <p className={styles.cardText}>Not a giant restructure. Not a generic insurance template. Just enough guidance to make the homepage stop feeling like one big intake wall.</p>
                <ul className={styles.list}>
                  <li>Start Here comes right after the trust strip</li>
                  <li>Only two path choices</li>
                  <li>The existing small Dustin headshot block stays</li>
                  <li>The assessment form stays lower on the page</li>
                </ul>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/*
---
*Last updated: 2026-04-14 16:03 ET | Updated by: Forge*
*/
