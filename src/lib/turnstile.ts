/**
 * Cloudflare Turnstile, loaded on demand and run invisibly.
 *
 * getTurnstileToken() returns a fresh single-use token for one form
 * submission. It returns undefined when no site key is configured, when the
 * Turnstile script cannot load, or when the challenge does not finish within
 * TIMEOUT_MS. The server decides what an absent token means (see
 * supabase/functions/_shared/guard.ts): until TURNSTILE_SECRET_KEY is set
 * there, submissions go through without one.
 *
 * The widget uses "interaction-only" appearance, so most visitors never see
 * anything. When Cloudflare does need a click, the checkbox appears in a
 * fixed container at the bottom of the viewport.
 */

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: (code?: string) => void;
  "expired-callback"?: () => void;
  appearance?: "always" | "execute" | "interaction-only";
  execution?: "render" | "execute";
  theme?: "auto" | "light" | "dark";
  size?: "normal" | "flexible" | "compact";
};

export interface TurnstileApi {
  render(container: HTMLElement | string, options: TurnstileRenderOptions): string;
  remove(widgetId: string): void;
  reset(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onUjTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onUjTurnstileLoad";
export const TURNSTILE_CONTAINER_ID = "uj-turnstile";
const TIMEOUT_MS = 20_000;

/** The site key from the build environment, or undefined when unset. */
export const turnstileSiteKey = (): string | undefined => {
  const key = import.meta.env.VITE_TURNSTILE_SITE_KEY as unknown;
  return typeof key === "string" && key.trim() ? key.trim() : undefined;
};

let scriptPromise: Promise<TurnstileApi | undefined> | undefined;

const loadScript = (): Promise<TurnstileApi | undefined> => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      window.onUjTurnstileLoad = () => resolve(window.turnstile);
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        scriptPromise = undefined;
        resolve(undefined);
      };
      document.head.appendChild(script);
      setTimeout(() => resolve(window.turnstile), TIMEOUT_MS);
    });
  }
  return scriptPromise;
};

const container = (): HTMLElement => {
  let el = document.getElementById(TURNSTILE_CONTAINER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = TURNSTILE_CONTAINER_ID;
    el.setAttribute("aria-live", "polite");
    el.style.cssText = "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:2147483000;";
    document.body.appendChild(el);
  }
  return el;
};

let widgetId: string | undefined;

/** A fresh single-use token for the submission about to happen, or undefined. */
export async function getTurnstileToken(): Promise<string | undefined> {
  const sitekey = turnstileSiteKey();
  if (!sitekey || typeof document === "undefined") return undefined;

  const api = await loadScript();
  if (!api) return undefined;

  return new Promise<string | undefined>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => finish(undefined), TIMEOUT_MS);
    function finish(token?: string) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(token);
    }

    try {
      // Tokens are single-use, so each submission gets a new widget.
      if (widgetId) {
        try {
          api.remove(widgetId);
        } catch {
          // already gone
        }
        widgetId = undefined;
      }
      widgetId = api.render(container(), {
        sitekey,
        appearance: "interaction-only",
        theme: "auto",
        size: "flexible",
        callback: (token) => finish(token),
        "error-callback": () => finish(undefined),
        "expired-callback": () => finish(undefined),
      });
    } catch (error) {
      console.error("Turnstile could not render:", error);
      finish(undefined);
    }
  });
}
