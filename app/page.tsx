import { pageMetadata } from "@/lib/seo";
import HomeClient from "./HomeClient";

export const metadata = pageMetadata({
  title: "Dustin McCormick | Independent Life Insurance Agent | Licensed Nationwide",
  description:
    "Independent life insurance agent helping families compare final expense and IUL options. No pressure, no obligation.",
  path: "/",
});

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Dustin McCormick — Independent Life Insurance Agent",
  url: "https://dustinlife.com",
  image: "https://dustinlife.com/headshot.jpg",
  telephone: "+1-248-970-9094",
  email: "transamerica.dustin@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "101 W Big Beaver Rd Ste 345",
    addressLocality: "Troy",
    addressRegion: "MI",
    postalCode: "48084",
    addressCountry: "US",
  },
  description:
    "Independent life insurance agent helping families compare final expense and IUL options. No pressure, no obligation.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomeClient />
    </>
  );
}

/*
---
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
