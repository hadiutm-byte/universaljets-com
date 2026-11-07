import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const read = (p: string) => readFileSync(p, "utf8");

// The Dusk homepage preview is for review on preview builds only.
describe("dusk homepage preview", () => {
  it("is routed at /preview/dusk, marked noindex and kept out of robots", () => {
    expect(read("src/App.tsx")).toContain('path="/preview/dusk"');
    const page = read("src/pages/preview/DuskHomePage.tsx");
    expect(page).toMatch(/<SEOHead[^>]*noindex/s);
    expect(read("public/robots.txt")).toContain("Disallow: /preview/");
    expect(read("public/sitemap.xml")).not.toContain("/preview/");
  });

  it("makes no claim the claims file has not proven", () => {
    const page = read("src/pages/preview/DuskHomePage.tsx");
    expect(page).toContain('verified(["dcaaLicence", "diezLicence"])');
    expect(page).toMatch(/independent broker/i);
    expect(page).toContain("does not own or operate aircraft");
    expect(page).toContain("On request");
  });

  it("respects reduced motion and keeps programmes separate", () => {
    const page = read("src/pages/preview/DuskHomePage.tsx");
    expect(page).toContain("useReducedMotion()");
    expect(page).toContain("Jet Card and Membership are separate programmes");
  });
});
