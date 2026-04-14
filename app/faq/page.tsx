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
            <Link href="/final-expense">Final Expense</Link>
            <Link href="/indexed-universal-life">Indexed Universal Life</Link>
            <Link href="/faq" data-active="true">FAQ</Link>
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
        <p className={styles.footerCopy}>© 2026 Dustin McCormick</p>
      </div>
    </footer>
  );
}

export default function FAQPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <ShieldIcon />
                FAQ placeholder
              </div>
              <h1 className={styles.display}>Keep FAQ simple for now.</h1>
              <p className={styles.lead}>
                You said FAQ can wait, so this page is intentionally light instead of pretending it is finished.
              </p>
              <p className={styles.support}>
                It holds the nav slot, keeps the typography and layout system consistent, and gives us room to do a real FAQ pass later.
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
                <p className={styles.cardText}>No. The tone stays no-pressure. The point is clarity first, not a forced close.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Can this page be expanded later?</h2>
                <p className={styles.cardText}>Yes. Once the main funnel direction is approved, we can turn this into a proper FAQ page without guessing.</p>
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
*Last updated: 2026-04-14 16:03 ET | Updated by: Forge*
*/
