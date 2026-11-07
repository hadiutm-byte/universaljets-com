import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  CLAIMS,
  isVerified,
  verified,
  verifiedPartners,
  verifiedPress,
  verifiedTestimonials,
  type ClaimKey,
} from "@/lib/claims";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// Public-site source: everything under src except the claims file itself and the tests.
const publicFiles = [
  ...walk("src").filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("/test/") && !f.endsWith("src/lib/claims.ts")),
  "index.html",
];

// How each claim is worded when it leaks into copy. An unproven claim must not
// appear in any of these forms anywhere outside src/lib/claims.ts.
const WORDING: Record<ClaimKey, RegExp> = {
  dcaaLicence: /3342665/,
  diezLicence: /50370/,
  argusBroker: /ARGUS|Argus/,
  wyvernBroker: /WYVERN|Wyvern/,
  isbaoOperators: /IS-?BAO/,
  yearsInAviation: /18\+|since 2006|17\+ years|16 years/i,
  aircraftNetwork: /(?<![0-9,$])[67]0?,000\+|7000\+/,
  countriesServed: /190\+|160\+ countries|160 countries/,
  groupPassengers: /(?<![0-9,$])50,000\+/,
  worldCup2022: /FIFA/i,
  regulatorCompliance: /GCAA|GACA/,
};

describe("claims need proof", () => {
  it("every claim has wording to police", () => {
    for (const key of Object.keys(CLAIMS) as ClaimKey[]) expect(WORDING[key], key).toBeInstanceOf(RegExp);
  });

  it("a proven claim carries a reference and the date it was checked", () => {
    for (const key of Object.keys(CLAIMS) as ClaimKey[]) {
      const proof = (CLAIMS[key] as { proof?: { reference: string; checkedOn: string } }).proof;
      if (!proof) continue;
      expect(proof.reference, key).toMatch(/\S/);
      expect(proof.checkedOn, key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("unproven claims appear nowhere in the public site", () => {
    const leaks: string[] = [];
    for (const key of Object.keys(CLAIMS) as ClaimKey[]) {
      if (isVerified(key)) continue;
      for (const file of publicFiles) {
        const src = readFileSync(file, "utf8");
        const m = src.match(WORDING[key]);
        if (m) leaks.push(`${file}: "${m[0]}" (${key})`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("verified() keeps order and drops the unproven", () => {
    const keys = Object.keys(CLAIMS) as ClaimKey[];
    const out = verified(keys);
    expect(out.length).toBe(keys.filter(isVerified).length);
    expect(out.map((c) => c.label)).toEqual(keys.filter(isVerified).map((k) => CLAIMS[k].label));
  });

  it("press, testimonials and partner brands are hidden until a link, consent or agreement is on file", () => {
    expect(verifiedPress().every((p) => p.url)).toBe(true);
    expect(verifiedTestimonials().every((t) => t.consent)).toBe(true);
    expect(verifiedPartners().every((p) => p.agreement)).toBe(true);

    const read = (f: string) => readFileSync(f, "utf8");
    expect(read("src/components/PressStrip.tsx")).toContain("verifiedPress()");
    expect(read("src/components/TestimonialsSection.tsx")).toContain("verifiedTestimonials()");
    expect(read("src/components/PartnersSection.tsx")).toContain("verifiedPartners()");
    expect(read("src/components/Footer.tsx")).toContain("verifiedPartners()");
    // the previous hard-coded lists are gone
    for (const f of ["src/components/PressStrip.tsx", "src/components/TestimonialsSection.tsx", "src/components/PartnersSection.tsx", "src/components/Footer.tsx"]) {
      expect(read(f)).not.toMatch(/Forbes|Bloomberg|Sheikh|VistaJet|Four Seasons|Ritz-Carlton/);
    }
  });

  it("badge components draw from the claims file", () => {
    for (const f of ["src/components/CertificationBadges.tsx", "src/components/TrustStrip.tsx", "src/components/Footer.tsx", "src/pages/AboutPage.tsx", "src/components/SafetySection.tsx"]) {
      expect(readFileSync(f, "utf8"), f).toMatch(/from "@\/lib\/claims"/);
    }
  });
});
