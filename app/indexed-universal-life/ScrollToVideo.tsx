"use client";

import type { ReactNode, MouseEvent } from "react";

type Props = {
  href?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Scrolls the IUL intro video into view, accounting for sticky SiteChrome
 * header (and leaving room so the full player is visible — not tucked
 * under the header). Falls back to hash navigation if the target is missing.
 */
export default function ScrollToVideo({
  href = "#video",
  className,
  children,
}: Props) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const id = href.startsWith("#") ? href.slice(1) : "video";
    const el = typeof document !== "undefined" ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    if (typeof history !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
