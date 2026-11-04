import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";

const read = (p: string) => readFileSync(p, "utf8");
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
});

describe("analytics", () => {
  it("loads exactly one GTM container (GTM-KG956KGV)", () => {
    const ids = new Set(read("index.html").match(/GTM-[A-Z0-9]+/g));
    expect([...ids]).toEqual(["GTM-KG956KGV"]);
  });
});
