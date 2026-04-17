"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type FormDataState = {
  dob: string;
  state: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const TOTAL_STEPS = 4;
const MONTHS = [
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
] as const;
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const YEARS = [
  ...Array.from({ length: 1965 - 1940 + 1 }, (_, i) => String(1965 - i)),
  ...Array.from({ length: 2008 - 1965 }, (_, i) => String(2008 - i)),
];
const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
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

export default function FinalExpenseClient() {
  const activeStepRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollStepRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [agentAvatarFailed, setAgentAvatarFailed] = useState(false);
  const [agentPhotoFailed, setAgentPhotoFailed] = useState(false);
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    dob: "",
    state: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const progressPercent = useMemo(
    () => Math.round((currentStep / TOTAL_STEPS) * 100),
    [currentStep],
  );

  const getStickyStepOffset = () => {
    const nav = document.querySelector(".fe-page nav");
    const navHeight = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 0;
    return navHeight + 24;
  };

  useEffect(() => {
    if (!shouldScrollStepRef.current) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const activeStep = activeStepRef.current;
      if (!activeStep) {
        shouldScrollStepRef.current = false;
        return;
      }

      const stepTop = activeStep.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(stepTop - getStickyStepOffset(), 0),
        behavior: "smooth",
      });
      shouldScrollStepRef.current = false;
    });

    return () => cancelAnimationFrame(frame);
  }, [currentStep]);

  const buildDobFromParts = (year: string, month: string, day: string) => {
    if (!year || !month || !day) {
      return "";
    }

    const candidate = `${year}-${month}-${day}`;
    const date = new Date(`${candidate}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const validYear = String(date.getUTCFullYear()) === year;
    const validMonth = String(date.getUTCMonth() + 1).padStart(2, "0") === month;
    const validDay = String(date.getUTCDate()).padStart(2, "0") === day;

    return validYear && validMonth && validDay ? candidate : "";
  };

  const nextStep = (step: number) => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        window.alert("Please enter your full name.");
        return;
      }
    }

    if (step === 2 && !formData.state) {
      window.alert("Please select your state.");
      return;
    }

    if (step === 3) {
      const dob = buildDobFromParts(dobYear, dobMonth, dobDay);

      if (!dob) {
        window.alert("Please select a valid full date of birth.");
        return;
      }

      setFormData((prev) => ({ ...prev, dob }));
    }

    shouldScrollStepRef.current = true;
    setCurrentStep(step + 1);
  };

  const prevStep = (step: number) => {
    shouldScrollStepRef.current = true;
    setCurrentStep(step - 1);
  };

  const submitForm = async () => {
    if (!formData.phone.trim()) {
      window.alert("Please enter your phone number.");
      return;
    }

    if (!tcpaConsent) {
      window.alert("Please review and accept the consent statement.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          gender: "",
          coverageAmount: "",
          state: formData.state,
          phone: formData.phone,
          tcpaConsent,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.",
        );
      }

      const fbq = (window as Window & {
        fbq?: (...args: unknown[]) => void;
      }).fbq;
      fbq?.('track', 'Lead', {
        content_name: 'Final Expense Quote Request',
        content_category: 'final_expense',
      });
      setSubmitted(true);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fe-page">
        <div className="topbar">
          Speak with a licensed agent: <a href="tel:+12489709094">248-970-9094</a> &nbsp;·&nbsp; No obligation, ever.
        </div>

        <nav>
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              <img src="/dm-monogram.jpg" alt="DM" />
            </Link>
            <div className="nav-main">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/final-expense" className="nav-link active">Final Expense</Link>
              <Link href="/indexed-universal-life" className="nav-link">Indexed Universal Life</Link>
              <Link href="/faq" className="nav-link">FAQ</Link>
            </div>
            <div className="nav-icons">
              <a href="mailto:transamerica.dustin@gmail.com" className="nav-icon-link" aria-label="Email Dustin"><EmailIcon /></a>
              <a href="https://www.facebook.com/profile.php?id=61577772774808" target="_blank" rel="noopener noreferrer" className="nav-icon-link" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://www.linkedin.com/in/w-dustin-mccormick/" target="_blank" rel="noopener noreferrer" className="nav-icon-link" aria-label="LinkedIn"><LinkedInIcon /></a>
            </div>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Final Expense Coverage
              </div>
              <h1>Help protect your family from an <em>unexpected bill.</em></h1>
              <p className="hero-sub">Final expense insurance helps cover funeral costs, medical bills, and other end-of-life expenses, so your loved ones don't have to worry about money during one of the hardest moments of their lives.</p>
              <div className="hero-actions">
                <a href="#get-quote" className="btn-primary">Get My Free Quote</a>
              </div>
            </div>

            <div className="hero-image-wrap">
              {!heroImageFailed ? (
                <img
                  src="/final-expense-hero.jpg"
                  alt="Dustin McCormick — Licensed Insurance Agent"
                  className="hero-img"
                  onError={() => setHeroImageFailed(true)}
                />
              ) : null}
              <div className="hero-img-placeholder" style={{ display: heroImageFailed ? "flex" : "none" }}>
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span>Agent photo</span>
              </div>
              <div className="agent-card">
                {!agentAvatarFailed ? (
                  <img src="https://dustinlife.com/headshot.jpg" alt="Dustin McCormick" className="agent-avatar" onError={() => setAgentAvatarFailed(true)} />
                ) : null}
                <div>
                  <div className="agent-card-name">Dustin McCormick</div>
                  <div className="agent-card-title">Licensed Independent Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="carriers">
          <div className="carriers-inner">
            <div className="carrier-points">
              <span className="carrier-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>Instant underwriting</span>
              <span className="carrier-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>No medical exam</span>
              <span className="carrier-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>Same-day coverage</span>
            </div>
          </div>
        </div>

        <section className="problem">
          <div className="problem-inner">
            <span className="section-label">The Reality</span>
            <h2 className="section-title">The average funeral costs far more than most families expect</h2>
            <div className="stat-row">
              <div className="stat-box">
                <div className="amount">$255</div>
                <div className="label">Social Security<br />Death Benefit</div>
              </div>
              <div className="stat-vs">vs.</div>
              <div className="stat-box highlight">
                <div className="amount">$9,995+</div>
                <div className="label">Median Funeral<br />Cost (2025)</div>
              </div>
            </div>
            <p className="problem-text">That gap, thousands of dollars, often falls on grieving families without warning. Final expense coverage is designed to help close it, so the people you love aren't left with a bill they never planned for.</p>
          </div>
        </section>

        <section className="explainer" id="what-is">
          <div className="section-inner">
            <span className="section-label">Understanding Coverage</span>
            <h2 className="section-title">Everything you need to know</h2>
            <div className="explainer-grid">
              <div className="explainer-card">
                <div className="explainer-num">1</div>
                <h3>What is final expense insurance?</h3>
                <p>Final expense insurance is a whole life policy designed to help cover funeral costs, outstanding medical bills, and other end-of-life expenses. Coverages range from $5,000 to $100,000.</p>
              </div>
              <div className="explainer-card">
                <div className="explainer-num">2</div>
                <h3>How does it work?</h3>
                <p>You pay a monthly premium and your beneficiary receives a tax-free lump sum when you pass. They can use it for funeral costs, debts, or anything else, no restrictions.</p>
              </div>
              <div className="explainer-card">
                <div className="explainer-num">3</div>
                <h3>How much do I need?</h3>
                <p>Most families choose $10,000 to $15,000 to cover a basic funeral and final expenses. Once you lock in your rate, it never increases, even if your health changes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how" id="how-it-works">
          <div className="section-inner">
            <span className="section-label">Simple Process</span>
            <h2 className="section-title">Getting covered is easier than you think</h2>
            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-num">1</div>
                <div>
                  <h3>Request your free quote</h3>
                  <p>Fill out the short form below. Takes about 2 minutes. No obligation, ever.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="how-step-num">2</div>
                <div>
                  <h3>I shop multiple carriers for you</h3>
                  <p>As an independent agent, I work for you, not one insurance company. I'll compare options and walk you through every one. No pressure.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="how-step-num">3</div>
                <div>
                  <h3>Get covered, often within days</h3>
                  <p>Once you choose a plan, I handle the paperwork. Most people are covered within days, not weeks. No medical exam required.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="agent-section">
          <div className="agent-inner">
            {!agentPhotoFailed ? (
              <img src="/headshot.jpg" alt="Dustin McCormick" className="agent-photo" onError={() => setAgentPhotoFailed(true)} />
            ) : null}
            <div>
              <div className="agent-name">Dustin McCormick</div>
              <div className="agent-title">Licensed Independent Agent</div>
              <p className="agent-bio">I'm an independent agent, not captive to any one carrier. That means I work for you, not an insurance company. I'll shop the market, explain what actually matters, and help you find coverage that fits your life and your budget.</p>
            </div>
          </div>
        </div>

        <section className="faq" id="faq">
          <div className="section-inner">
            <span className="section-label">Common Questions</span>
            <h2 className="section-title">Questions people ask before getting covered</h2>
            <div className="faq-list">
              {[
                {
                  q: "Do I qualify if I have health problems?",
                  a: "Most people qualify with just a short health questionnaire, no medical exam required. Even if you've been declined for other types of insurance, there are options designed specifically for people with health conditions.",
                },
                {
                  q: "How much does it cost?",
                  a: "Cost depends on your age, health, state, and the coverage amount you choose. Premiums are locked in when you enroll, they never increase. Get a free quote to see what's available for your specific situation.",
                },
                {
                  q: "How fast can I get covered?",
                  a: "Most policies can be issued within a few days. There's no waiting for doctor appointments or lab results. In many cases, coverage can begin almost immediately after your application is approved.",
                },
                {
                  q: "Is this the same as life insurance?",
                  a: "Final expense insurance is a type of whole life insurance, meaning it doesn't expire and builds cash value over time. The main difference is it's designed for smaller coverage amounts ($5,000–$25,000) with a simplified application process and no medical exam.",
                },
              ].map((item, index) => {
                const isOpen = faqOpen === index;
                return (
                  <div className={`faq-item${isOpen ? " open" : ""}`} key={item.q}>
                    <button className="faq-q" onClick={() => setFaqOpen(isOpen ? null : index)}>
                      {item.q}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <div className="faq-a">{item.a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="cta-section">
          <h2>Give your family peace of mind.</h2>
          <p>Coverage that's affordable, simple, and built to last.</p>
          <a href="#get-quote" className="btn-white">Get My Free Quote</a>
        </div>

        <section className="form-section" id="get-quote">
          <div className="form-wrap">
            {!submitted ? (
              <>
                <div className="form-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="progress-label">Step {currentStep} of {TOTAL_STEPS}</span>
                </div>

                <div className="form-steps">
                  <div ref={currentStep === 1 ? activeStepRef : undefined} className={`form-step${currentStep === 1 ? " active" : ""}`} data-step="1">
                    <p className="step-question">What's your name?</p>
                    <p className="step-why">So Dustin knows who he's helping, that's it.</p>
                    <div className="input-row">
                      <input
                        type="text"
                        className="step-input"
                        placeholder="First name"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      />
                      <input
                        type="text"
                        className="step-input"
                        placeholder="Last name"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                    <button className="step-btn" onClick={() => nextStep(1)}>Next →</button>
                  </div>

                  <div ref={currentStep === 2 ? activeStepRef : undefined} className={`form-step${currentStep === 2 ? " active" : ""}`} data-step="2">
                    <p className="step-question">What state do you live in?</p>
                    <p className="step-why">Coverage availability and pricing vary by state. We're licensed in all 50 states.</p>
                    <select
                      className="step-select"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    >
                      <option value="" disabled>Select your state</option>
                      {STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <button className="step-btn" onClick={() => nextStep(2)}>Next →</button>
                    <button className="step-back" onClick={() => prevStep(2)}>← Back</button>
                  </div>

                  <div ref={currentStep === 3 ? activeStepRef : undefined} className={`form-step${currentStep === 3 ? " active" : ""}`} data-step="3">
                    <p className="step-question">When were you born?</p>
                    <p className="step-why">Your age helps us find the right final expense options and accurate pricing for you.</p>
                    <div className="dob-row">
                      <select
                        className="step-select dob-select dob-select-month"
                        autoComplete="bday-month"
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                      >
                        <option value="" disabled>Month</option>
                        {MONTHS.map(([value, label]) => (
                          <option key={value} value={value}>{value} · {label}</option>
                        ))}
                      </select>
                      <select
                        className="step-select dob-select dob-select-day"
                        autoComplete="bday-day"
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                      >
                        <option value="" disabled>Day</option>
                        {DAYS.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select
                        className="step-select dob-select dob-select-year"
                        autoComplete="bday-year"
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                      >
                        <option value="" disabled>Year</option>
                        {YEARS.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <button className="step-btn" onClick={() => nextStep(3)}>Next →</button>
                    <button className="step-back" onClick={() => prevStep(3)}>← Back</button>
                  </div>

                  <div ref={currentStep === 4 ? activeStepRef : undefined} className={`form-step${currentStep === 4 ? " active" : ""}`} data-step="4">
                    <p className="step-question">What's the best number to reach you?</p>
                    <p className="step-why">Dustin will call you personally, usually within one business day.</p>
                    <input
                      type="tel"
                      className="step-input"
                      placeholder="(248) 555-0100"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                    <div className="step-consent">
                      <input type="checkbox" checked={tcpaConsent} onChange={(e) => setTcpaConsent(e.target.checked)} required />
                      <span>I agree to receive calls and texts from Dustin McCormick at the number provided regarding insurance quotes and related information. Message and data rates may apply. Reply STOP to opt out at any time. Consent is not a condition of purchase. View our <a href="/privacy">Privacy Policy</a>.</span>
                    </div>
                    {submitError ? <p className="submit-error">{submitError}</p> : null}
                    <button className="step-btn" onClick={submitForm} disabled={submitting}>{submitting ? "Submitting..." : "Get My Free Quote →"}</button>
                    <button className="step-back" onClick={() => prevStep(4)}>← Back</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="form-confirm" style={{ display: "block" }}>
                <div className="confirm-icon">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="confirm-title">You're all set!</h2>
                <p className="confirm-sub">Dustin will personally reach out within one business day to walk you through your options, no pressure, no obligation.</p>
                <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "12px" }}>Want to talk sooner? Call directly:</p>
                <a href="tel:+12489709094" className="confirm-phone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.21 2.36 2 2 0 012.22.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.56-1.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  248-970-9094
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="disclaimers">
          <div className="disclaimers-inner">
            <p>Final expense insurance is underwritten by various carriers. Policy features, availability, and pricing vary by state and carrier. Coverage is subject to underwriting approval.</p>
            <p>This is not a quote guarantee. Actual premium may vary based on age, health, state of residence, coverage amount, and carrier. Speak with a licensed agent for personalized information.</p>
            <p>Dustin McCormick is a licensed independent insurance agent. National Producer Number available upon request. Licensed in all 50 states.</p>
          </div>
        </div>

        <footer>
          <div className="footer-name">Dustin McCormick</div>
          <p className="footer-address">101 W Big Beaver Rd Ste 345, Troy, MI 48084<br />248-970-9094</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
            <a href="/disclosures">Disclosures</a>
          </div>
          <p className="footer-copy">© 2026 Dustin McCormick. All rights reserved.</p>
        </footer>

        <div className="mobile-cta">
          <a href="#get-quote">Get My Free Quote — No Obligation</a>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .fe-page {
          --bg: #faf9f7;
          --bg-2: #f3f1ee;
          --bg-dark: #1c1c1e;
          --sticky-offset: 104px;
          --text: #1c1c1e;
          --text-2: #4a4a4a;
          --text-3: #888;
          --accent: #b8860b;
          --accent-light: #f5ecd5;
          --accent-border: rgba(184,134,11,0.25);
          --white: #ffffff;
          --border: #e8e4df;
          --green: #2d6a4f;
          --serif: 'Lora', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
          --radius: 10px;
          --shadow: 0 2px 16px rgba(0,0,0,0.07);
          --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
          font-family: var(--sans);
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .fe-page *, .fe-page *::before, .fe-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .fe-page { scroll-behavior: smooth; }
        .fe-page img { max-width: 100%; display: block; }
        .fe-page a { color: inherit; text-decoration: none; }
        .fe-page .topbar {
          background: var(--bg-dark);
          color: rgba(255,255,255,0.85);
          text-align: center;
          font-size: 13px;
          padding: 9px 16px;
          letter-spacing: 0.01em;
        }
        .fe-page .topbar a { color: #f5d98b; font-weight: 600; }
        .fe-page .topbar a:hover { text-decoration: underline; }
        .fe-page nav {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        }
        .fe-page .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 24px;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }
        .fe-page .nav-logo { display: inline-flex; }
        .fe-page .nav-logo img { height: 48px; width: auto; border-radius: 4px; }
        .fe-page .nav-main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-2);
          box-shadow: 0 10px 24px rgba(0,0,0,0.05);
          margin: 0 auto;
        }
        .fe-page .nav-link {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .fe-page .nav-link:hover { color: var(--text); }
        .fe-page .nav-link.active {
          background: var(--accent);
          color: var(--white);
        }
        .fe-page .nav-icons {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .fe-page .nav-icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--accent);
          box-shadow: 0 10px 24px rgba(0,0,0,0.05);
        }
        .fe-page .nav-icon-link svg {
          width: 16px;
          height: 16px;
        }
        @media (max-width: 900px) {
          .fe-page {
            --sticky-offset: 180px;
          }
          .fe-page .nav-inner {
            justify-content: center;
            padding: 12px 16px;
          }
          .fe-page .nav-main {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            overflow-x: auto;
          }
        }
        .fe-page .hero {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .fe-page .hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 24px 56px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 64px;
          align-items: center;
        }
        .fe-page .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-light);
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          border: 1px solid var(--accent-border);
          margin-bottom: 20px;
        }
        .fe-page .hero h1 {
          font-family: var(--serif);
          font-size: clamp(32px, 4.5vw, 48px);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 18px;
        }
        .fe-page .hero h1 em { font-style: italic; color: var(--accent); }
        .fe-page .hero-sub {
          font-size: 17px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.65;
          max-width: 480px;
          margin-bottom: 32px;
        }
        .fe-page .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .fe-page .btn-primary {
          display: inline-block;
          background: var(--accent);
          color: var(--white);
          font-size: 15px;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 8px;
          transition: opacity 0.15s, transform 0.15s;
          box-shadow: 0 2px 12px rgba(184,134,11,0.25);
        }
        .fe-page .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .fe-page .hero-image-wrap { position: relative; }
        .fe-page .hero-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: 14px;
          box-shadow: var(--shadow-lg);
        }
        .fe-page .hero-img-placeholder {
          width: 100%;
          height: 420px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f0ebe3 0%, #e8e0d4 100%);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: var(--shadow-lg);
        }
        .fe-page .hero-img-placeholder svg { width: 48px; height: 48px; stroke: var(--text-3); fill: none; stroke-width: 1; }
        .fe-page .hero-img-placeholder span { font-size: 13px; color: var(--text-3); }
        .fe-page .agent-card {
          position: absolute;
          bottom: -20px;
          left: -20px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 18px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
        }
        .fe-page .agent-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-border);
          flex-shrink: 0;
        }
        .fe-page .agent-card-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .fe-page .agent-card-title { font-size: 11px; color: var(--text-3); margin-top: 2px; }
        @media (max-width: 820px) {
          .fe-page .hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .fe-page .hero-image-wrap { order: -1; }
          .fe-page .hero-img, .fe-page .hero-img-placeholder { height: 280px; }
          .fe-page .agent-card { left: 12px; bottom: -16px; }
        }
        .fe-page .carriers {
          background: var(--bg-2);
          border-bottom: 1px solid var(--border);
          padding: 28px 24px;
        }
        .fe-page .carriers-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .fe-page .carrier-points {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .fe-page .carrier-point {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 999px;
          background: var(--white);
          border: 1px solid var(--border);
          color: var(--text-2);
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 10px 24px rgba(0,0,0,0.04);
        }
        .fe-page .carrier-point svg {
          width: 16px;
          height: 16px;
          stroke: var(--green);
          flex-shrink: 0;
        }
        .fe-page section { padding: 80px 24px; }
        .fe-page .section-inner { max-width: 1000px; margin: 0 auto; }
        .fe-page .section-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent);
          margin-bottom: 12px;
          display: block;
        }
        .fe-page .section-title {
          font-family: var(--serif);
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 14px;
        }
        .fe-page .section-desc {
          font-size: 16px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.65;
          max-width: 560px;
        }
        .fe-page .problem { background: var(--white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .fe-page .problem-inner { max-width: 900px; margin: 0 auto; text-align: center; }
        .fe-page .problem .section-title { margin: 0 auto 36px; max-width: 600px; }
        .fe-page .stat-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .fe-page .stat-box {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px 36px;
          text-align: center;
          min-width: 180px;
        }
        .fe-page .stat-box .amount {
          font-family: var(--serif);
          font-size: 44px;
          font-weight: 500;
          color: var(--text);
          line-height: 1;
          margin-bottom: 6px;
        }
        .fe-page .stat-box.highlight .amount { color: var(--accent); }
        .fe-page .stat-box .label {
          font-size: 12px;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .fe-page .stat-vs { font-family: var(--serif); font-size: 22px; font-style: italic; color: var(--text-3); }
        .fe-page .problem-text {
          font-size: 17px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.7;
          max-width: 580px;
          margin: 0 auto;
        }
        .fe-page .explainer { background: var(--bg); }
        .fe-page .explainer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }
        .fe-page .explainer-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 32px 28px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .fe-page .explainer-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
        .fe-page .explainer-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          color: var(--accent);
          margin-bottom: 18px;
        }
        .fe-page .explainer-card h3 {
          font-family: var(--serif);
          font-size: 18px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 10px;
        }
        .fe-page .explainer-card p {
          font-size: 14px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.65;
        }
        @media (max-width: 720px) { .fe-page .explainer-grid { grid-template-columns: 1fr; } }
        .fe-page .how { background: var(--white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .fe-page .how-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 48px;
          max-width: 680px;
        }
        .fe-page .how-step {
          display: flex;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 1px solid var(--border);
        }
        .fe-page .how-step:last-child { border-bottom: none; }
        .fe-page .how-step-num {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--accent-border);
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--serif);
          font-size: 15px;
          font-style: italic;
          color: var(--accent);
          margin-top: 2px;
        }
        .fe-page .how-step h3 { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 5px; }
        .fe-page .how-step p { font-size: 14px; font-weight: 300; color: var(--text-2); line-height: 1.6; }
        .fe-page .agent-section { background: var(--bg-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 56px 24px; }
        .fe-page .agent-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .fe-page .agent-photo {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-border);
          flex-shrink: 0;
        }
        .fe-page .agent-name { font-family: var(--serif); font-size: 18px; font-weight: 500; margin-bottom: 3px; }
        .fe-page .agent-title { font-size: 12px; color: var(--accent); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; }
        .fe-page .agent-bio { font-size: 14px; font-weight: 300; color: var(--text-2); line-height: 1.65; }
        @media (max-width: 500px) { .fe-page .agent-inner { flex-direction: column; text-align: center; } }
        .fe-page .faq { background: var(--white); }
        .fe-page .faq-list {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 720px;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .fe-page .faq-item { border-bottom: 1px solid var(--border); }
        .fe-page .faq-item:last-child { border-bottom: none; }
        .fe-page .faq-q {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          text-align: left;
          transition: background 0.15s;
        }
        .fe-page .faq-q:hover { background: var(--bg-2); }
        .fe-page .faq-q svg { width: 16px; height: 16px; stroke: var(--text-3); flex-shrink: 0; transition: transform 0.2s; }
        .fe-page .faq-item.open .faq-q svg { transform: rotate(180deg); }
        .fe-page .faq-a {
          display: none;
          padding: 0 24px 20px;
          font-size: 14px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.65;
        }
        .fe-page .faq-item.open .faq-a { display: block; }
        .fe-page .form-section {
          background: var(--bg-2);
          border-top: 1px solid var(--border);
          scroll-margin-top: var(--sticky-offset);
        }
        .fe-page .form-wrap {
          max-width: 560px;
          margin: 0 auto;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          scroll-margin-top: var(--sticky-offset);
        }
        .fe-page .form-progress {
          background: var(--bg-2);
          border-bottom: 1px solid var(--border);
          padding: 16px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fe-page .progress-bar {
          flex: 1;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .fe-page .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .fe-page .progress-label { font-size: 11px; color: var(--text-3); white-space: nowrap; font-weight: 500; }
        .fe-page .form-steps { padding: 36px 40px 32px; }
        @media (max-width: 480px) { .fe-page .form-steps { padding: 24px 20px 20px; } }
        .fe-page .form-step {
          display: none;
          scroll-margin-top: var(--sticky-offset);
        }
        .fe-page .form-step.active { display: block; animation: stepIn 0.25s ease; }
        @keyframes stepIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        .fe-page .step-question {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 500;
          color: var(--text);
          line-height: 1.3;
          margin-bottom: 6px;
          text-align: center;
        }
        .fe-page .step-why {
          font-size: 12px;
          color: var(--text-3);
          text-align: center;
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .fe-page .radio-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .fe-page .radio-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-size: 15px;
          font-weight: 400;
          color: var(--text);
        }
        .fe-page .radio-card:hover { border-color: var(--accent); background: var(--accent-light); }
        .fe-page .radio-card input { display: none; }
        .fe-page .radio-card.selected { border-color: var(--accent); background: var(--accent-light); }
        .fe-page .radio-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--border);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s;
        }
        .fe-page .radio-card.selected .radio-dot { border-color: var(--accent); background: var(--accent); }
        .fe-page .radio-card.selected .radio-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }
        .fe-page .radio-card-label { flex: 1; }
        .fe-page .radio-card-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; }
        .fe-page .step-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: var(--sans);
          font-size: 18px;
          font-weight: 400;
          color: var(--text);
          background: var(--white);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }
        .fe-page .step-input::placeholder { color: #ccc; font-size: 16px; }
        .fe-page .step-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(184,134,11,0.10); }
        .fe-page .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .fe-page .input-row .step-input { margin-bottom: 0; font-size: 16px; }
        @media (max-width: 480px) { .fe-page .input-row { grid-template-columns: 1fr; } }
        .fe-page .dob-row {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(84px, 0.8fr) minmax(110px, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .fe-page .dob-select {
          margin-bottom: 0;
          text-align: center;
        }
        .fe-page .dob-select-month { text-align: left; }
        .fe-page .dob-select-day,
        .fe-page .dob-select-year { text-align-last: center; }
        @media (max-width: 480px) {
          .fe-page .dob-row {
            grid-template-columns: 1.45fr 0.9fr 1fr;
            gap: 8px;
          }
          .fe-page .dob-select {
            padding-left: 12px;
            padding-right: 12px;
            font-size: 15px;
          }
        }
        .fe-page .step-select {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: var(--sans);
          font-size: 16px;
          color: var(--text);
          background: var(--white);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: border-color 0.15s;
          margin-bottom: 24px;
        }
        .fe-page .step-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(184,134,11,0.10); }
        .fe-page .step-consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 20px;
        }
        .fe-page .step-consent input[type='checkbox'] {
          width: 16px;
          height: 16px;
          margin-top: 3px;
          flex-shrink: 0;
          accent-color: var(--accent);
        }
        .fe-page .step-consent span { font-size: 11px; color: var(--text-3); line-height: 1.55; }
        .fe-page .step-consent a { color: var(--accent); }
        .fe-page .submit-error {
          font-size: 12px;
          color: #b42318;
          text-align: center;
          margin: 0 0 14px;
        }
        .fe-page .step-btn {
          width: 100%;
          padding: 15px;
          background: var(--accent);
          color: var(--white);
          font-family: var(--sans);
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(184,134,11,0.25);
          transition: opacity 0.15s, transform 0.15s;
        }
        .fe-page .step-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .fe-page .step-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .fe-page .step-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 100%;
          padding: 10px;
          background: none;
          border: none;
          font-family: var(--sans);
          font-size: 13px;
          color: var(--text-3);
          cursor: pointer;
          margin-top: 10px;
          transition: color 0.15s;
        }
        .fe-page .step-back:hover { color: var(--text); }
        .fe-page .form-confirm {
          display: none;
          padding: 48px 40px;
          text-align: center;
        }
        .fe-page .confirm-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #d1fae5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .fe-page .confirm-icon svg { width: 28px; height: 28px; stroke: var(--green); fill: none; stroke-width: 2.5; }
        .fe-page .confirm-title {
          font-family: var(--serif);
          font-size: 24px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 10px;
        }
        .fe-page .confirm-sub {
          font-size: 15px;
          font-weight: 300;
          color: var(--text-2);
          line-height: 1.65;
          margin-bottom: 24px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .fe-page .confirm-phone {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
          color: var(--accent);
        }
        @media (max-width: 480px) { .fe-page .form-confirm { padding: 32px 20px; } }
        .fe-page .disclaimers { background: var(--bg); border-top: 1px solid var(--border); padding: 36px 24px; }
        .fe-page .disclaimers-inner { max-width: 800px; margin: 0 auto; }
        .fe-page .disclaimers p { font-size: 11px; color: var(--text-3); line-height: 1.6; margin-bottom: 8px; }
        .fe-page footer {
          background: var(--bg-dark);
          color: rgba(255,255,255,0.55);
          padding: 36px 24px;
          text-align: center;
        }
        .fe-page .footer-name { font-family: var(--serif); font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 10px; }
        .fe-page .footer-address { font-size: 12px; line-height: 1.6; margin-bottom: 14px; }
        .fe-page .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 16px;
        }
        .fe-page .footer-links a { color: rgba(255,255,255,0.45); transition: color 0.15s; }
        .fe-page .footer-links a:hover { color: rgba(255,255,255,0.8); }
        .fe-page .footer-copy { font-size: 10px; color: rgba(255,255,255,0.2); }
        .fe-page .mobile-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--white);
          border-top: 1px solid var(--border);
          padding: 12px 16px;
          z-index: 200;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
        }
        .fe-page .mobile-cta a {
          display: block;
          background: var(--accent);
          color: var(--white);
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          padding: 14px;
          border-radius: 8px;
        }
        @media (max-width: 680px) {
          .fe-page .mobile-cta { display: block; }
          .fe-page { padding-bottom: 72px; }
        }
        .fe-page .cta-section {
          background: var(--accent);
          padding: 64px 24px;
          text-align: center;
        }
        .fe-page .cta-section h2 {
          font-family: var(--serif);
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 500;
          color: var(--white);
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .fe-page .cta-section p {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 28px;
          font-weight: 300;
        }
        .fe-page .btn-white {
          display: inline-block;
          background: var(--white);
          color: var(--accent);
          font-size: 15px;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 8px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .fe-page .btn-white:hover { opacity: 0.92; transform: translateY(-1px); }
      `}</style>
    </>
  );
}

/*
---
*Last updated: 2026-04-17 12:10 ET | Updated by: Forge*
*/
