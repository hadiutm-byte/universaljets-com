import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "fs";
import path from "path";
import {
  CLAIMS,
  FIGURES,
  aircraftReach,
  availabilityPromise,
  countryReach,
  isVerified,
  onlyVerified,
  vettingSentence,
  yearsPhrase,
} from "@/lib/claims";
import PressStrip from "@/components/PressStrip";
import TestimonialsSection from "@/components/TestimonialsSection";
import CertificationBadges from "@/components/CertificationBadges";

const SRC = path.resolve(__dirname, "..");

function publicSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Staff screens and tests may name accreditations freely.
      if (["test", "crm", "integrations"].includes(entry.name)) return [];
      return publicSourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

describe("proof switch", () => {
  it("ships with every unproven claim switched off", () => {
    // Flip a claim to true only with proof in hand; this test then needs updating on purpose.
    for (const [key, claim] of Object.entries(CLAIMS)) {
      expect(claim.verified, `${key} switched on without updating this test`).toBe(false);
      expect(claim.proof.length).toBeGreaterThan(0);
    }
  });

  it("falls back to figure-free wording while unverified", () => {
    expect(aircraftReach()).toBe("a broad range of aircraft");
    expect(countryReach()).toBe("worldwide");
    expect(yearsPhrase()).toBeNull();
    expect(vettingSentence()).not.toMatch(/ARGUS|WYVERN|verified through/);
    expect(availabilityPromise()).not.toMatch(/guarantee/i);
    expect(vettingSentence()).toMatch(/third-party operator/);
  });

  it("keeps items without a claim and drops unverified ones", () => {
    const items = onlyVerified([
      { label: "DCAA" },
      { label: "ARGUS", claim: "argus" as const },
      { label: "Countries", claim: "countryCount" as const },
    ]);
    expect(items.map((i) => i.label)).toEqual(["DCAA"]);
    expect(isVerified("argus")).toBe(false);
  });

  it("holds each figure in exactly one place", () => {
    const figures = Object.values(FIGURES);
    const literal = /(?<![\d,$])(?:[56]0,000\+|[67],000\+|1[69]0\+|18\+ ?[Yy]ears)(?!\d)/;
    const offenders: string[] = [];
    for (const file of publicSourceFiles(SRC)) {
      if (file.endsWith(path.join("lib", "claims.ts"))) continue;
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (literal.test(line)) offenders.push(`${path.relative(SRC, file)}:${i + 1}`);
        });
    }
    expect(figures.length).toBeGreaterThan(0);
    expect(offenders, "use FIGURES / helpers from @/lib/claims instead").toEqual([]);
  });

  it("never reintroduces the copy the pre-merge review removed", () => {
    // Phrases the re-review confirmed as unproven: regulator approvals, timed delivery,
    // priority promises, certification and track-record labels. Claim-gated lines are exempt.
    const banned = /Classified Clearance|Government-Cleared|Government-cleared|full compliance|full regulatory|most complex regulatory|Conflict Zone Experience|Global Security Network|six continents|5,000\+ airports|Immediate \(24h\)|within (the hour|minutes|\d+ ?hours?)|respond within|will reach out within|founded [^.]*in \d{4}|GCAA|GACA|EASA|\bFAA\b|ICAO Compliant|48–72|within hours, not days|Priority aircraft|priority positioning|Priority access|Verified Aircraft|Hazmat-certified|Trusted by UHNW|Rolls-Royce & Maybach|certified operators?|first-priority|Whole Market|selected for safety|guarantee[ds]?\b|exclusive rates/i;
    const offenders: string[] = [];
    for (const file of publicSourceFiles(SRC)) {
      if (file.endsWith(path.join("lib", "claims.ts"))) continue;
      if (/(Terms|Privacy|Cookies)Page\.tsx$/.test(file)) continue;
      fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        if (banned.test(line) && !/isVerified\(|claim: "/.test(line)) offenders.push(`${path.relative(SRC, file)}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("keeps the static index.html free of figures and unproven claims", () => {
    const html = fs.readFileSync(path.resolve(SRC, "..", "index.html"), "utf8");
    expect(html).not.toMatch(/(?<![\d,$])(?:[56]0,000\+|[67],000\+|1[69]0\+|18\+ ?[Yy]ears)(?!\d)/);
    expect(html).not.toMatch(/ARGUS|WYVERN|IS-BAO|[Gg]uarantee|[Vv]etted/);
  });

  it("never names an accreditation, press outlet or guarantee outside a proof check", () => {
    const named = /\b(ARGUS|WYVERN|Wyvern|IS-BAO|Since 2006|FIFA World Cup|[Gg]uarantee[ds]?|[Vv]etted|[Vv]etting|Verified Operator)\b/;
    const offenders: string[] = [];
    for (const file of publicSourceFiles(SRC)) {
      if (file.endsWith(path.join("lib", "claims.ts"))) continue;
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (named.test(line) && !/isVerified\(|claim: "/.test(line)) {
            offenders.push(`${path.relative(SRC, file)}:${i + 1}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });
});

describe("gated sections render nothing until proven", () => {
  it("hides the press strip and named testimonials", () => {
    expect(render(<PressStrip />).container.innerHTML).toBe("");
    expect(render(<TestimonialsSection />).container.innerHTML).toBe("");
  });

  it("shows licences, not unproven accreditations, in the compliance badges", () => {
    const { container } = render(
      <MemoryRouter>
        <CertificationBadges />
      </MemoryRouter>,
    );
    const text = container.textContent ?? "";
    expect(text).toContain("DCAA Licensed");
    expect(text).not.toMatch(/ARGUS|WYVERN|IS-BAO|190\+/);
  });
});
