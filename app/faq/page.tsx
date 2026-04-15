import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "../dustinlife-v2.module.css";

export const metadata = pageMetadata({
  title: "Life Insurance FAQ | Dustin McCormick",
  description:
    "Common questions about final expense and indexed universal life insurance answered by independent agent Dustin McCormick.",
  path: "/faq",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What kind of life insurance is right for me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "That depends on what you want the policy to do. Final Expense is built around burial and final bills. Indexed Universal Life is a different conversation focused on permanent coverage and cash value potential.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to commit before talking to Dustin?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The goal is to help you understand your options first. There is no obligation to move forward.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compare multiple options before choosing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. That is one of the advantages of working with an independent agent. You can compare the right options instead of getting pushed into one answer.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get started?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the free assessment on the homepage, call 248-970-9094, or send an email and we can start from there.",
      },
    },
  ],
};

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

function SiteHeader() {
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
          </Link>

          <nav className={styles.navMain} aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/final-expense">Final Expense</Link>
            <Link href="/indexed-universal-life">Indexed Universal Life</Link>
            <Link href="/faq" data-active="true">FAQ</Link>
          </nav>

          <div className={styles.navRight}>
            <div className={styles.navIcons}>
              <a className={styles.navIcon} href="mailto:transamerica.dustin@gmail.com" aria-label="Email Dustin">
                <EmailIcon />
              </a>
              <a className={styles.navIcon} href="https://www.facebook.com/profile.php?id=61577772774808" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a className={styles.navIcon} href="https://www.linkedin.com/in/w-dustin-mccormick/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            </div>
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
          <Link href="/disclosures">Disclosures</Link>
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

export default function FAQPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <ShieldIcon />
                Frequently Asked Questions
              </div>
              <h1 className={styles.display}>Straight answers to common questions.</h1>
              <p className={styles.lead}>
                If you&apos;re comparing life insurance options, these are a few of the questions that usually come up first.
              </p>
              <p className={styles.support}>
                If you want a recommendation based on your situation, the fastest move is still to reach out for an assessment.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.faqGrid}>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>What kind of life insurance is right for me?</h2>
                <p className={styles.cardText}>That depends on what you want the policy to do. Final Expense is built around burial and final bills. Indexed Universal Life is a different conversation focused on permanent coverage and cash value potential.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Do I have to commit before talking to Dustin?</h2>
                <p className={styles.cardText}>No. The goal is to help you understand your options first. There is no obligation to move forward.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Can I compare multiple options before choosing?</h2>
                <p className={styles.cardText}>Yes. That is one of the advantages of working with an independent agent. You can compare the right options instead of getting pushed into one answer.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>How do I get started?</h2>
                <p className={styles.cardText}>Use the free assessment on the homepage, call 248-970-9094, or send an email and we can start from there.</p>
              </article>
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
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
