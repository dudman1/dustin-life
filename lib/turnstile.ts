import { useCallback, useEffect, useRef } from "react";

// Cloudflare Turnstile site key (public). Empty string = widget not rendered and
// forms submit exactly as before. The Compass page has its own copy of this
// constant at the top of its script in public/iul-compass/index.html.
export const TURNSTILE_SITE_KEY = "";

// Hidden honeypot input name, checked server-side in functions/api/lead.ts.
export const HONEYPOT_FIELD = "dl_website";

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string | undefined;
  getResponse: (widgetId?: string) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

type TurnstileWindow = Window & { turnstile?: TurnstileApi };

let scriptPromise: Promise<TurnstileApi | null> | null = null;

// Load api.js once. Resolves null on failure — callers then submit without a
// token and the server decides by TURNSTILE_MODE.
function loadTurnstile(): Promise<TurnstileApi | null> {
  const w = window as TurnstileWindow;
  if (w.turnstile) return Promise.resolve(w.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(w.turnstile ?? null);
      script.onerror = () => {
        scriptPromise = null;
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// Renders an interaction-only Turnstile widget into containerRef (render the
// container only when `enabled`, so an empty site key leaves layout untouched). Read the token
// with getToken() at submit time (tokens expire; refresh-expired is auto), and
// call reset() after a rejected submit so a fresh token is issued.
export function useTurnstile(siteKey: string = TURNSTILE_SITE_KEY) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TurnstileApi | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    loadTurnstile().then((api) => {
      const container = containerRef.current;
      if (cancelled || !api || !container) return;
      apiRef.current = api;
      try {
        widgetIdRef.current =
          api.render(container, {
            sitekey: siteKey,
            appearance: "interaction-only",
            "refresh-expired": "auto",
          }) ?? null;
      } catch {
        widgetIdRef.current = null;
      }
    });
    return () => {
      cancelled = true;
      const api = apiRef.current;
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;
      if (api && widgetId) {
        try {
          api.remove(widgetId);
        } catch {
          // Widget already gone — nothing to clean up.
        }
      }
    };
  }, [siteKey]);

  const getToken = useCallback((): string => {
    const api = apiRef.current;
    const widgetId = widgetIdRef.current;
    if (!api || !widgetId) return "";
    try {
      return api.getResponse(widgetId) ?? "";
    } catch {
      return "";
    }
  }, []);

  const reset = useCallback(() => {
    const api = apiRef.current;
    const widgetId = widgetIdRef.current;
    if (!api || !widgetId) return;
    try {
      api.reset(widgetId);
    } catch {
      // Ignore — the next submit goes without a token and the server decides.
    }
  }, []);

  return { enabled: Boolean(siteKey), containerRef, getToken, reset };
}

// Extra JSON fields for /api/lead. Each is included only when non-empty, so with
// no site key and an empty honeypot the request body is unchanged.
export function botFields(token: string, honeypot: string): Record<string, string> {
  const fields: Record<string, string> = {};
  if (token) fields.turnstileToken = token;
  if (honeypot) fields[HONEYPOT_FIELD] = honeypot;
  return fields;
}

// Off-screen (not display:none) so naive bots still see and fill it.
export const HONEYPOT_STYLE = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  overflow: "hidden",
} as const;
