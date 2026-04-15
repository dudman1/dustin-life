import type { Metadata } from "next";

const SITE_URL = "https://dustinlife.com";
const OG_IMAGE = `${SITE_URL}/headshot.jpg`;

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "Dustin McCormick",
      images: [{ url: OG_IMAGE }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE],
    },
  };
}

/*
---
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
