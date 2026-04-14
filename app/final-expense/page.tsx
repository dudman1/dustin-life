import Link from "next/link";
import styles from "../dustinlife-v2.module.css";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.21 2.36 2 2 0 012.22.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.56-1.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
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
            <div className={styles.brandCopy}>
              <strong>Dustin McCormick</strong>
              <span>Licensed Independent Agent</span>
            </div>
          </Link>

          <nav className={styles.navMain} aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/final-expense" data-active="true">Final Expense</Link>
            <Link href="/indexed-universal-life">Indexed Universal Life</Link>
            <Link href="/faq">FAQ</Link>
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

export default function FinalExpensePage() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <ShieldIcon />
                Final Expense Coverage
              </div>
              <h1 className={styles.display}>Help protect your family from funeral and final bill costs.</h1>
              <p className={styles.lead}>
                Final expense insurance is designed to help loved ones handle burial costs, medical bills,
                and other end-of-life expenses without added financial stress.
              </p>
              <p className={styles.support}>
                If your goal is simple, practical protection for your family, this is usually where the conversation starts.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryLink} href="/#assessment">Get My Free Assessment</Link>
                <a className={styles.outlineLink} href="tel:+12489709094">Call 248-970-9094</a>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.infoGrid}>
              <article className={styles.infoCard}>
                <h2 className={styles.cardTitle}>What it helps cover</h2>
                <p className={styles.cardText}>Final expense policies are commonly used to help with funeral costs, burial expenses, unpaid bills, and other immediate family needs.</p>
              </article>
              <article className={styles.infoCard}>
                <h2 className={styles.cardTitle}>Why families use it</h2>
                <p className={styles.cardText}>It can reduce financial pressure during a hard moment and make sure loved ones are not scrambling to cover costs out of pocket.</p>
              </article>
              <article className={styles.infoCard}>
                <h2 className={styles.cardTitle}>How I help</h2>
                <p className={styles.cardText}>I help you compare options, understand what the policy does, and choose a coverage amount that fits your situation.</p>
              </article>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.twoCol}>
              <div className={styles.sectionCard}>
                <h3 className={styles.cardTitle}>A good fit if you want</h3>
                <ul className={styles.list}>
                  <li>Coverage focused on burial and end-of-life expenses</li>
                  <li>A simpler life insurance conversation</li>
                  <li>Protection that can help ease the burden on family</li>
                  <li>Guidance from an independent agent</li>
                </ul>
              </div>
              <div className={styles.sectionCard}>
                <h3 className={styles.cardTitle}>Questions we can sort out together</h3>
                <ul className={styles.list}>
                  <li>How much coverage may make sense</li>
                  <li>Which carrier options are worth comparing</li>
                  <li>What the next step looks like</li>
                  <li>Whether another type of policy should also be part of the conversation</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.twoCol}>
              <div className={styles.callout}>
                <h3 className={styles.cardTitle}>Ready to talk it through?</h3>
                <p className={styles.cardText}>Start with the assessment and I&apos;ll help you figure out the right coverage conversation for your family.</p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryLink} href="/#assessment">Get My Free Assessment</Link>
                  <a className={styles.outlineLink} href="mailto:transamerica.dustin@gmail.com">Talk to Dustin</a>
                </div>
              </div>
              <aside className={styles.callout}>
                <h3 className={styles.cardTitle}>What you can expect</h3>
                <p className={styles.cardText}>You&apos;ll get a straightforward conversation about your goals, the coverage amount you&apos;re considering, and the options that make the most sense for your family.</p>
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
*Last updated: 2026-04-14 16:18 ET | Updated by: Forge*
*/
