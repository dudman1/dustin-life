import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Disclosures | Dustin McCormick",
  description:
    "Important disclosures about Dustin McCormick's independent life insurance practice.",
  path: "/disclosures",
});

export default function Disclosures() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 prose prose-zinc dark:prose-invert">
      <h1>Disclosures</h1>
      <p><strong>Effective Date:</strong> April 14, 2026</p>

      <h2>Independent Agent</h2>
      <p>
        Dustin McCormick is an independent life insurance agent. He is not
        employed by any single insurance carrier and is free to recommend
        products from multiple carriers based on your individual needs.
      </p>

      <h2>Not Financial or Legal Advice</h2>
      <p>
        The information provided on this website is for general educational
        purposes only. It does not constitute financial, legal, or tax advice.
        Consult a qualified professional for guidance specific to your situation.
      </p>

      <h2>Product Availability</h2>
      <p>
        Insurance product availability, features, and pricing vary by state and
        carrier. Not all products are available in all states. Any quotes or
        illustrations provided are estimates and are not guarantees of coverage
        or cost.
      </p>

      <h2>Licensing</h2>
      <p>
        Dustin McCormick is licensed to sell life insurance in all 50 states.
        License information is available upon request.
      </p>

      <h2>Compensation</h2>
      <p>
        As an independent agent, Dustin McCormick may receive commissions from
        insurance carriers when a policy is placed. This compensation does not
        affect the premium you pay.
      </p>

      <h2>Contact</h2>
      <address className="not-italic">
        William Dustin McCormick (Dustin McCormick)<br />
        101 W Big Beaver Rd Ste 345<br />
        Troy, MI 48084<br />
        Phone: <a href="tel:+12489709094">248-970-9094</a><br />
        Email: <a href="mailto:dustin@dustinlife.com">dustin@dustinlife.com</a>
      </address>
    </main>
  );
}

/*
---
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
