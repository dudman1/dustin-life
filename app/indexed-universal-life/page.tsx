import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import SiteChrome from "@/app/components/SiteChrome";
import ScrollToVideo from "@/app/indexed-universal-life/ScrollToVideo";
import styles from "../dustinlife-v2.module.css";

export const metadata = pageMetadata({
  title: "Indexed Universal Life (IUL) Explained | Dustin McCormick",
  description:
    "Understand how Indexed Universal Life works — permanent coverage, cash value potential, and honest guidance from an independent agent.",
  path: "/indexed-universal-life",
});

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function IndexedUniversalLifePage() {
  return (
    <SiteChrome current="iul">
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
                <ScrollToVideo className={styles.primaryLink}>Watch the Quick Intro</ScrollToVideo>
                <Link className={styles.outlineLink} href="/#assessment">Get My Free Assessment</Link>
              </div>
            </div>
          </section>

          <section className={`${styles.section} ${styles.videoSection}`} id="video">
            <div className={styles.videoCard}>
              <h2 className={styles.sectionTitle}>Quick Intro</h2>
              <p className={styles.sectionIntro}>Start here if you want a fast overview before looking at the details.</p>
              <div className={styles.videoFrame}>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/video/iul-intro-poster.png"
                  className={styles.iulIntroVideo}
                >
                  <source src="/video/iul-intro.mp4" type="video/mp4" />
                  <track
                    kind="captions"
                    src="/video/iul-intro.vtt"
                    srcLang="en"
                    label="English"
                    default
                  />
                </video>
              </div>
              <p className={styles.videoDisclaimer}>
                Hypothetical illustration for education only. Not an offer. Guarantees are subject to the claims-paying ability of the issuing insurer.
              </p>
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
          <section className={styles.section}>
            <div className={styles.centerCard}>
              <div className={styles.centerCardInner}>
                <div className={styles.eyebrow}>Free calculator</div>
                <h3 className={styles.intentionalTitle}>See your own numbers with the <span className={styles.intentionalAccent}>IUL Compass</span></h3>
                <p className={styles.cardText}>
                  Model how IUL cash value and death benefit could evolve under simplified, level assumptions — then
                  request a personalized illustration. Everything runs locally in your browser.
                </p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryLink} href="/iul-compass/">Open IUL Compass</a>
                  <Link className={styles.outlineLink} href="/#assessment">Get My Free Assessment</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteChrome>
  );
}
