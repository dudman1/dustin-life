import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "../dustinlife-v2.module.css";

export const metadata = pageMetadata({
  title: "Indexed Universal Life (IUL) Explained | Dustin McCormick",
  description:
    "Understand how Indexed Universal Life works — permanent coverage, cash value potential, and honest guidance from an independent agent.",
  path: "/indexed-universal-life",
});

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
            <Link href="/indexed-universal-life" data-active="true">Indexed Universal Life</Link>
            <Link href="/faq">FAQ</Link>
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

export default function IndexedUniversalLifePage() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <ShieldIcon />
                Indexed Universal Life
              </div>
              <h1 className={styles.display}>Indexed Universal Life, without the sales pitch.</h1>
              <p className={styles.lead}>
                IUL is permanent life insurance first. The cash value potential is real, but it depends entirely on how the policy is designed and funded. I&apos;ll help you understand whether it actually fits before you commit to anything.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryLink} href="#video">Watch the Quick Intro</a>
                <Link className={styles.outlineLink} href="/#assessment">Get My Free Assessment</Link>
              </div>
            </div>
          </section>

          <section className={styles.section} id="video">
            <div className={styles.videoCard}>
              <h2 className={styles.sectionTitle}>Quick Intro</h2>
              <p className={styles.sectionIntro}>Start here if you want a fast overview before looking at the details.</p>
              <div className={styles.videoFrame}>
                <video controls playsInline poster="/iul-performance.jpg">
                  <source src="/iul-explainer.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHead}>
                <div className={styles.eyebrow}>How it works</div>
                <h2 className={styles.sectionTitle}>What Indexed Universal Life actually does</h2>
                <p className={styles.sectionIntro}>Protection first, cash value second, design always matters.</p>
              </div>
              <div className={styles.infoGrid}>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Permanent protection</h3>
                  <p className={styles.cardText}>An IUL is permanent life insurance, which means the death benefit is the foundation of the policy.</p>
                </article>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Cash value opportunity</h3>
                  <p className={styles.cardText}>Part of your premium may build cash value over time, based on policy design and the carrier&apos;s crediting method.</p>
                </article>
                <article className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Ongoing review</h3>
                  <p className={styles.cardText}>The best results come from funding and structuring the policy carefully, then reviewing it as life changes.</p>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.centerCard}>
              <div className={styles.centerCardInner}>
                <div className={styles.eyebrow}>Worth exploring</div>
                <h3 className={styles.intentionalTitle}>When it may be <span className={styles.intentionalAccent}>worth</span> exploring</h3>
                <ul className={styles.intentionalList}>
                  <li>You want permanent life insurance, not temporary coverage only</li>
                  <li>You care about flexibility in premiums and long-term planning</li>
                  <li>You want to understand cash value without the hype</li>
                  <li>You want guidance from an independent agent who can compare options</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.twoCol}>
              <div className={styles.callout}>
                <h3 className={styles.cardTitle}>Need help deciding?</h3>
                <p className={styles.cardText}>
                  If you&apos;re comparing final expense, term, or Indexed Universal Life, start with the assessment and I&apos;ll help you sort out what belongs in the conversation.
                </p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryLink} href="/#assessment">Get My Free Assessment</Link>
                  <a className={styles.outlineLink} href="mailto:transamerica.dustin@gmail.com">Talk to Dustin</a>
                </div>
              </div>
              <aside className={styles.callout}>
                <h3 className={styles.cardTitle}>What you can expect from me</h3>
                <ul className={styles.list}>
                  <li>Straight answers about how the policy works</li>
                  <li>Help comparing whether IUL actually fits your goals</li>
                  <li>No hard-sell pressure</li>
                  <li>A practical path forward if another option fits better</li>
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
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
