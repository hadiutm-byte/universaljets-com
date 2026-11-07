import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (p: string) => readFileSync(p, "utf8");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe("sitemap", () => {
  const xml = read("public/sitemap.xml");
  it("is XML, not HTML", () => {
    expect(xml.trimStart().startsWith("<?xml")).toBe(true);
    expect(xml).toContain("<urlset");
    expect(xml).not.toMatch(/<html/i);
  });
  it("has unique absolute canonical-host URLs", () => {
    const urls = locs(xml);
    expect(urls.length).toBeGreaterThan(10);
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u).toMatch(/^https:\/\/universaljets\.com(\/|$)/);
  });
  it("excludes private pages", () => {
    for (const u of locs(xml)) expect(u).not.toMatch(/\/(auth|crm|dashboard|profile|reset-password|unsubscribe|quote)(\/|$)/);
  });
  it("matches the legacy sitemap-uj.xml", () => {
    expect(read("public/sitemap-uj.xml")).toBe(xml);
  });
  it("is referenced by robots.txt", () => {
    expect(read("public/robots.txt")).toContain("Sitemap: https://universaljets.com/sitemap.xml");
  });
});

describe("index.html", () => {
  const html = read("index.html");
  it("has no meta keywords, keeps the Search Console tag, and one canonical", () => {
    expect(html).not.toMatch(/<meta name="keywords"/);
    expect(html).not.toMatch(/http-equiv="X-Frame-Options"/i);
    expect(html).not.toMatch(/frame-ancestors/i);
    expect(html).toContain('rel="sitemap" type="application/xml" href="/sitemap.xml"');
    expect(html).toContain('name="google-site-verification"');
    expect(html.match(/rel="canonical"/g)?.length ?? 0).toBeLessThanOrEqual(1);
  });
  it("sets Consent Mode defaults before any GTM container loads", () => {
    const consent = html.indexOf("'consent', 'default'");
    expect(consent).toBeGreaterThan(-1);
    expect(consent).toBeLessThan(html.indexOf("gtm.js"));
  });
});

describe("backend hardening", () => {
  it("send-transactional-email only accepts service-role callers", () => {
    const src = read("supabase/functions/send-transactional-email/index.ts");
    expect(src).toContain("isServiceRole(req)");
    expect(src).toContain("service_role");
  });
  it("crm-capture has a honeypot, rate limit and input clipping", () => {
    const src = read("supabase/functions/crm-capture/index.ts");
    expect(src).toContain("body.website");
    expect(src).toContain("rateLimited(ip)");
    expect(src).toContain("clip(body.message");
  });
  it("browser code never references the service-role key", () => {
    const files = ["src/integrations/supabase/client.ts", ".env", ".env.example"].filter(existsSync);
    for (const f of files) expect(read(f)).not.toMatch(/SERVICE_ROLE/i);
  });
});

describe("dead buttons", () => {
  it("no CTA dispatches the unhandled open-ricky-booking event", () => {
    expect(read("src/components/FinalCTASection.tsx")).not.toContain("open-ricky-booking");
  });

  // While Ricky is not mounted in App.tsx nothing listens for its events, so a
  // button that fires one does nothing when tapped.
  it("nothing fires a Ricky event while Ricky is not mounted", () => {
    const rickyMounted = /<Ricky(Chatbot|3D)\b/.test(read("src/App.tsx"));
    if (rickyMounted) return;
    const offenders = walk("src")
      .filter((f) => /\.tsx?$/.test(f))
      .filter((f) => !/[\\/]test[\\/]/.test(f) && !/ricky/i.test(f))
      .filter((f) => /CustomEvent\(\s*["'](open-ricky|open-ricky-booking|openRickyChat)["']/.test(read(f)));
    expect(offenders).toEqual([]);
  });
});

describe("availability wording", () => {
  it("search results never call an aircraft available on the strength of a price", () => {
    const src = read("src/pages/SearchResults.tsx");
    expect(src).not.toMatch(/●\s*Available/);
    expect(src).not.toContain("Available Aircraft");
    expect(src).toContain("Availability confirmed on request");
  });
  it("the market strip ships no invented routes or 'Available now' labels", () => {
    const src = read("src/components/LiveMarketSection.tsx");
    expect(src).not.toContain("Available now");
    expect(src).not.toContain("fallbackRoutes");
  });
});

describe("analytics", () => {
  it("loads exactly one GTM container (GTM-KG956KGV)", () => {
    const ids = new Set(read("index.html").match(/GTM-[A-Z0-9]+/g));
    expect([...ids]).toEqual(["GTM-KG956KGV"]);
  });
});
