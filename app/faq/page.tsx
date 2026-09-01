import { pageMetadata } from "@/lib/seo";
import SiteChrome from "@/app/components/SiteChrome";
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
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What kind of life insurance is right for me?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "That depends on what you want the policy to do. Final Expense is built around burial costs and final bills. Indexed Universal Life is a different conversation focused on permanent coverage and cash value potential. If you are unsure, we can start with your goal and narrow from there \u2014 without locking you into one product."
      }
    },
    {
      "@type": "Question",
      "name": "When should I choose Final Expense vs Indexed Universal Life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choose Final Expense when the main job is helping family cover funeral costs and end-of-life bills with a simpler permanent policy. Explore IUL when you also want to discuss permanent coverage with a cash value component and longer-term design tradeoffs. They solve different problems; one is not automatically better than the other."
      }
    },
    {
      "@type": "Question",
      "name": "Do I have to commit before talking to Dustin?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The goal is to help you understand your options first. There is no obligation to move forward, buy a policy, or stay on a call longer than you want."
      }
    },
    {
      "@type": "Question",
      "name": "Will someone pressure me on a sales call?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Conversations stay educational and paced to you. If something is not a fit, it is okay to stop. You will not get countdown timers, fake scarcity, or hard-close scripts."
      }
    },
    {
      "@type": "Question",
      "name": "Can I compare multiple options before choosing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. That is one of the advantages of working with an independent agent. You can compare carriers and designs that may fit instead of getting pushed into a single preset answer."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with only one insurance company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. As an independent agent, Dustin can compare products from multiple carriers rather than steering everyone to a single company."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a medical exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on the product, your age, coverage amount, and health history. Some options use simplified underwriting with no exam; others may ask for labs or more information. We will explain what applies to your situation before you apply \u2014 there is no blanket promise that every case skips an exam."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can coverage start?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Timelines vary by carrier and underwriting. Some applications move quickly; others take longer if more review is needed. You will get a clear next-step estimate after we look at your situation. We do not advertise guaranteed same-day or instant coverage."
      }
    },
    {
      "@type": "Question",
      "name": "How does the free assessment work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You share basic contact details and your state so Dustin can follow up. It is a short intake, not an automated approval. After you submit, he reviews what you shared, answers questions, and outlines options that may fit \u2014 still with no obligation."
      }
    },
    {
      "@type": "Question",
      "name": "Are quotes free, and what happens after I submit a form?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes \u2014 requesting information is free and carries no obligation. After you submit, Dustin reviews what you shared and follows up to answer questions and outline options that may fit."
      }
    },
    {
      "@type": "Question",
      "name": "Is my information sold to marketers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Form information is used to respond to your insurance inquiry. It is not sold for third-party marketing lists. See the Privacy Policy for details on how data is handled, including SMS consent rules."
      }
    },
    {
      "@type": "Question",
      "name": "Why do you ask for SMS consent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SMS consent lets Dustin text about your inquiry, quotes, and appointment follow-ups at the number you provide. Consent is optional to purchase, message frequency varies, and you can reply STOP to opt out anytime. Details are on the form and in the Privacy Policy."
      }
    },
    {
      "@type": "Question",
      "name": "What is final expense insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Final expense coverage is typically a smaller permanent life policy meant to help with funeral costs, medical bills, and other end-of-life expenses so your family is not left scrambling."
      }
    },
    {
      "@type": "Question",
      "name": "What is indexed universal life (IUL)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IUL is a form of permanent life insurance with a cash value component that can be credited based on the performance of a market index, subject to caps, floors, and policy charges. It is not a stock market investment, and illustrations are not guarantees."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the free assessment on the homepage, call 248-970-9094, or send an email and we can start from there."
      }
    }
  ]
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function FAQPage() {
  return (
    <SiteChrome current="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
                <p className={styles.cardText}>That depends on what you want the policy to do. Final Expense is built around burial costs and final bills. Indexed Universal Life is a different conversation focused on permanent coverage and cash value potential. If you are unsure, we can start with your goal and narrow from there — without locking you into one product.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>When should I choose Final Expense vs Indexed Universal Life?</h2>
                <p className={styles.cardText}>Choose Final Expense when the main job is helping family cover funeral costs and end-of-life bills with a simpler permanent policy. Explore IUL when you also want to discuss permanent coverage with a cash value component and longer-term design tradeoffs. They solve different problems; one is not automatically better than the other.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Do I have to commit before talking to Dustin?</h2>
                <p className={styles.cardText}>No. The goal is to help you understand your options first. There is no obligation to move forward, buy a policy, or stay on a call longer than you want.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Will someone pressure me on a sales call?</h2>
                <p className={styles.cardText}>No. Conversations stay educational and paced to you. If something is not a fit, it is okay to stop. You will not get countdown timers, fake scarcity, or hard-close scripts.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Can I compare multiple options before choosing?</h2>
                <p className={styles.cardText}>Yes. That is one of the advantages of working with an independent agent. You can compare carriers and designs that may fit instead of getting pushed into a single preset answer.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Do you work with only one insurance company?</h2>
                <p className={styles.cardText}>No. As an independent agent, Dustin can compare products from multiple carriers rather than steering everyone to a single company.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Do I need a medical exam?</h2>
                <p className={styles.cardText}>It depends on the product, your age, coverage amount, and health history. Some options use simplified underwriting with no exam; others may ask for labs or more information. We will explain what applies to your situation before you apply — there is no blanket promise that every case skips an exam.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>How fast can coverage start?</h2>
                <p className={styles.cardText}>Timelines vary by carrier and underwriting. Some applications move quickly; others take longer if more review is needed. You will get a clear next-step estimate after we look at your situation. We do not advertise guaranteed same-day or instant coverage.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>How does the free assessment work?</h2>
                <p className={styles.cardText}>You share basic contact details and your state so Dustin can follow up. It is a short intake, not an automated approval. After you submit, he reviews what you shared, answers questions, and outlines options that may fit — still with no obligation.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Are quotes free, and what happens after I submit a form?</h2>
                <p className={styles.cardText}>Yes — requesting information is free and carries no obligation. After you submit, Dustin reviews what you shared and follows up to answer questions and outline options that may fit.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Is my information sold to marketers?</h2>
                <p className={styles.cardText}>No. Form information is used to respond to your insurance inquiry. It is not sold for third-party marketing lists. See the Privacy Policy for details on how data is handled, including SMS consent rules.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>Why do you ask for SMS consent?</h2>
                <p className={styles.cardText}>SMS consent lets Dustin text about your inquiry, quotes, and appointment follow-ups at the number you provide. Consent is optional to purchase, message frequency varies, and you can reply STOP to opt out anytime. Details are on the form and in the Privacy Policy.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>What is final expense insurance?</h2>
                <p className={styles.cardText}>Final expense coverage is typically a smaller permanent life policy meant to help with funeral costs, medical bills, and other end-of-life expenses so your family is not left scrambling.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>What is indexed universal life (IUL)?</h2>
                <p className={styles.cardText}>IUL is a form of permanent life insurance with a cash value component that can be credited based on the performance of a market index, subject to caps, floors, and policy charges. It is not a stock market investment, and illustrations are not guarantees.</p>
              </article>
              <article className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>How do I get started?</h2>
                <p className={styles.cardText}>Use the free assessment on the homepage, call 248-970-9094, or send an email and we can start from there.</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </SiteChrome>
  );
}
