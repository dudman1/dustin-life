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
            <Link href="/final-expense">Final Expense</Link>
            <Link href="/indexed-universal-life" data-active="true">Indexed Universal Life</Link>
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
              <h1 className={styles.display}>Use Indexed Universal Life as a tool, not a magic trick.</h1>
              <p className={styles.lead}>
                Protection first. Cash value second. Policy design matters the whole time.
              </p>
              <p className={styles.support}>
                This page is meant to help people think clearly about IUL, not get sold with bullshit shortcuts.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryLink} href="#video">Watch the Quick Intro</a>
                <Link className={styles.outlineLink} href="/#assessment">Get My Free Assessment</Link>
              </div>
              <div className={styles.heroNote}>
                <strong>What changed here.</strong>
                The quick intro video moved off the homepage, the naming is cleaned up, and the copy is calmer.
              </div>
            </div>
          </section>

          <section className={styles.section} id="video">
            <div className={styles.videoCard}>
              <div className={styles.tag}>Quick Intro 28 Seconds</div>
              <h2 className={styles.sectionTitle}>Then decide.</h2>
              <p className={styles.sectionIntro}>
                Watch the quick intro if you want context, or skip it and go straight to the assessment.
              </p>
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
                <div className={styles.eyebrow}>Plain-English version</div>
                <h2 className={styles.sectionTitle}>What Indexed Universal Life actually is</h2>
                <p className={styles.sectionIntro}>Permanent life insurance first. Cash value potential second. Good design beats hype.</p>
              </div>
              <div className={styles.infoGrid}>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Step 1</div>
                  <h3 className={styles.cardTitle}>Protection comes first</h3>
                  <p className={styles.cardText}>An IUL is permanent life insurance. The death benefit and policy structure are not side notes, they are the foundation.</p>
                </article>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Step 2</div>
                  <h3 className={styles.cardTitle}>Cash value may build over time</h3>
                  <p className={styles.cardText}>Part of the premium can build cash value, with index-linked crediting and carrier rules that need honest explanation.</p>
                </article>
                <article className={styles.infoCard}>
                  <div className={styles.tag}>Step 3</div>
                  <h3 className={styles.cardTitle}>Good design beats hype</h3>
                  <p className={styles.cardText}>A strong IUL depends on funding, structure, and review. A sloppy one gets sold with slogans and becomes a problem later.</p>
                </article>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.twoCol}>
              <div className={styles.sectionCard}>
                <div className={styles.tag}>May be a fit</div>
                <h3 className={styles.cardTitle}>Good fit if you want</h3>
                <ul className={styles.list}>
                  <li>Permanent coverage with room for cash value accumulation</li>
                  <li>Another long-term bucket beyond basic retirement account talk</li>
                  <li>A slower, more intentional conversation instead of a one-call product push</li>
                  <li>Guidance from an independent agent who can compare options</li>
                </ul>
              </div>
              <div className={styles.sectionCard}>
                <div className={styles.tag}>Probably not a fit</div>
                <h3 className={styles.cardTitle}>Bad fit if you want</h3>
                <ul className={styles.list}>
                  <li>A magic retirement shortcut</li>
                  <li>Guarantees that should not be promised</li>
                  <li>A replacement for every other financial tool</li>
                  <li>A quick yes or no answer without real design work</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.twoCol}>
              <div className={styles.callout}>
                <div className={styles.tag}>Next step</div>
                <h3 className={styles.cardTitle}>Ask for the assessment, not a hype pitch.</h3>
                <p className={styles.cardText}>
                  If this is worth exploring, the safest next move is still the homepage assessment flow. That keeps lead handling on the current live endpoint.
                </p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryLink} href="/#assessment">Get My Free Assessment</Link>
                  <a className={styles.outlineLink} href="mailto:transamerica.dustin@gmail.com">Talk to Dustin</a>
                </div>
              </div>
              <aside className={styles.callout}>
                <div className={styles.tag}>Why this page is safer</div>
                <h3 className={styles.cardTitle}>Less hype, more trust.</h3>
                <ul className={styles.list}>
                  <li>Uses Indexed Universal Life as the label everywhere</li>
                  <li>Moves the quick intro video here</li>
                  <li>Keeps the font and page system consistent with Home</li>
                  <li>Leaves Final Expense untouched</li>
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
