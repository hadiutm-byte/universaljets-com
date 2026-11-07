import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const invoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke } } }));

const getTurnstileToken = vi.fn();
vi.mock("@/lib/turnstile", () => ({ getTurnstileToken }));

import { applyForJob, captureLead } from "@/lib/leadCapture";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("public submissions carry the bot-check token", () => {
  beforeEach(() => {
    invoke.mockReset().mockResolvedValue({ data: { success: true }, error: null });
    getTurnstileToken.mockReset();
  });

  it("captureLead attaches the token to crm-capture", async () => {
    getTurnstileToken.mockResolvedValue("tok-123");
    await captureLead({ email: "a@b.co", source: "newsletter" });
    expect(invoke).toHaveBeenCalledWith("crm-capture", {
      body: { email: "a@b.co", source: "newsletter", turnstileToken: "tok-123" },
    });
  });

  it("applyForJob attaches the token to career-apply", async () => {
    getTurnstileToken.mockResolvedValue("tok-456");
    await applyForJob({ full_name: "A", email: "a@b.co" });
    expect(invoke).toHaveBeenCalledWith("career-apply", {
      body: { full_name: "A", email: "a@b.co", turnstileToken: "tok-456" },
    });
  });

  it("still submits when no token is available", async () => {
    getTurnstileToken.mockResolvedValue(undefined);
    await captureLead({ email: "a@b.co" });
    expect(invoke).toHaveBeenCalledWith("crm-capture", { body: { email: "a@b.co", turnstileToken: undefined } });
  });

  // Every public form must go through the helpers, or it ships without the token.
  it("no component calls crm-capture or career-apply directly", () => {
    const offenders = walk("src")
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("/test/") && !f.endsWith("src/lib/leadCapture.ts"))
      .filter((f) => /functions\.invoke\(\s*["'](crm-capture|career-apply)["']/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("the crm-api capture hook attaches the token", () => {
    const src = readFileSync("src/hooks/useCrmApi.ts", "utf8");
    expect(src).toContain("getTurnstileToken()");
    expect(src).toContain("turnstileToken");
  });
});
