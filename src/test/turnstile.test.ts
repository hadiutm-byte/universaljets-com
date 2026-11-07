import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { TurnstileApi } from "@/lib/turnstile";

const SITE_KEY = "1x00000000000000000000AA"; // Cloudflare's documented always-passes test key

type RenderCall = Parameters<TurnstileApi["render"]>;

const fakeTurnstile = (behaviour: "pass" | "error") => {
  const render = vi.fn((_container: HTMLElement | string, opts: RenderCall[1]) => {
    setTimeout(() => (behaviour === "pass" ? opts.callback("tok-123") : opts["error-callback"]?.("110200")), 0);
    return `widget-${render.mock.calls.length}`;
  });
  const api: TurnstileApi = { render, remove: vi.fn(), reset: vi.fn() };
  window.turnstile = api;
  return api;
};

describe("turnstile", () => {
  beforeEach(() => {
    vi.resetModules();
    document.getElementById("uj-turnstile")?.remove();
    delete window.turnstile;
  });
  afterEach(() => vi.unstubAllEnvs());

  it("returns no token and touches nothing when no site key is configured", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    const { getTurnstileToken } = await import("@/lib/turnstile");
    await expect(getTurnstileToken()).resolves.toBeUndefined();
    expect(document.getElementById("uj-turnstile")).toBeNull();
    expect(document.querySelector("script[src*='challenges.cloudflare.com']")).toBeNull();
  });

  it("renders an invisible widget and resolves with its token", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", SITE_KEY);
    const api = fakeTurnstile("pass");
    const { getTurnstileToken } = await import("@/lib/turnstile");

    await expect(getTurnstileToken()).resolves.toBe("tok-123");

    const [container, opts] = (api.render as ReturnType<typeof vi.fn>).mock.calls[0] as RenderCall;
    expect((container as HTMLElement).id).toBe("uj-turnstile");
    expect(opts.sitekey).toBe(SITE_KEY);
    expect(opts.appearance).toBe("interaction-only");
  });

  it("replaces the widget for every submission, since tokens are single-use", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", SITE_KEY);
    const api = fakeTurnstile("pass");
    const { getTurnstileToken } = await import("@/lib/turnstile");

    await getTurnstileToken();
    await getTurnstileToken();

    expect(api.render).toHaveBeenCalledTimes(2);
    expect(api.remove).toHaveBeenCalledWith("widget-1");
  });

  it("fails open when the challenge reports an error", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", SITE_KEY);
    fakeTurnstile("error");
    const { getTurnstileToken } = await import("@/lib/turnstile");
    await expect(getTurnstileToken()).resolves.toBeUndefined();
  });
});
