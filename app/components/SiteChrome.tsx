"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import DmLogo from "@/app/components/DmLogo";
import styles from "@/app/dustinlife-v2.module.css";

export type NavCurrent =
  | "home"
  | "iul"
  | "faq"
  | "final-expense"
  | "privacy"
  | "terms"
  | "disclosures"
  | null;

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const NAV_ITEMS: { href: string; label: string; current?: NavCurrent; external?: boolean }[] = [
  { href: "/", label: "Home", current: "home" },
  { href: "/final-expense", label: "Final Expense", current: "final-expense" },
  { href: "/indexed-universal-life", label: "Indexed Universal Life", current: "iul" },
  { href: "/iul-compass/", label: "IUL Compass", external: true },
  { href: "/faq", label: "FAQ", current: "faq" },
];

export function SiteHeader({ current = null }: { current?: NavCurrent }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className={styles.topbar}>
        <div className={`${styles.wrap} ${styles.topbarInner}`}>
          Speak with a licensed agent: <a href="tel:+12489709094">248-970-9094</a> · No obligation, ever.
        </div>
      </div>

      <header className={styles.header}>
        <div className={`${styles.wrap} ${styles.navRow}`}>
          <Link href="/" className={styles.brand} aria-label="Dustin McCormick — home" onClick={() => setOpen(false)}>
            <DmLogo />
          </Link>

          <nav className={styles.navMain} aria-label="Primary">
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} data-active={current === item.current || undefined}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className={styles.navRight}>
            <div className={styles.navIcons}>
              <a className={styles.navIcon} href="mailto:transamerica.dustin@gmail.com" aria-label="Email Dustin">
                <EmailIcon />
              </a>
              <a
                className={styles.navIcon}
                href="https://www.facebook.com/profile.php?id=61577772774808"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                className={styles.navIcon}
                href="https://www.linkedin.com/in/w-dustin-mccormick/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>

            <button
              type="button"
              className={styles.navToggle}
              aria-expanded={open}
              aria-controls="mobile-primary-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          id="mobile-primary-nav"
          className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ""}`}
          hidden={!open}
        >
          <div className={styles.wrap}>
            <nav className={styles.mobileNavLinks} aria-label="Mobile primary">
              {NAV_ITEMS.map((item) =>
                item.external ? (
                  <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={current === item.current || undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <p className={styles.mobileNavHint}>No pressure. Call anytime: <a href="tel:+12489709094">248-970-9094</a></p>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
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
          <a
            className={styles.socialLink}
            href="https://www.facebook.com/profile.php?id=61577772774808"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            className={styles.socialLink}
            href="https://www.linkedin.com/in/w-dustin-mccormick/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
        <p className={styles.footerCopy}>© 2026 Dustin McCormick</p>
      </div>
    </footer>
  );
}


function StickyMobileCta() {
  return (
    <div className={styles.stickyMobileCta} role="region" aria-label="Quick actions">
      <div className={styles.stickyMobileCtaInner}>
        <a className={styles.stickyMobilePrimary} href="/#assessment">
          Free Assessment
        </a>
        <a className={styles.stickyMobileCall} href="tel:+12489709094">
          Call 248-970-9094
        </a>
      </div>
    </div>
  );
}

export default function SiteChrome({
  current = null,
  children,
}: {
  current?: NavCurrent;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <SiteHeader current={current} />
      {children}
      <SiteFooter />
      <StickyMobileCta />
    </div>
  );
}
