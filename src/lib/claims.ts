/**
 * Proof switch for every public trust claim.
 *
 * A claim appears on the site only when `verified` is true. Set it to true
 * only after the owner has supplied proof (certificate, membership letter,
 * press link, signed client consent, company records). Until then the claim
 * is hidden, or the sentence falls back to wording that asserts nothing that
 * cannot be shown.
 *
 * Numbers live here once, so every page states the same figure.
 *
 * Kept on purpose, not gated here:
 * - "24/7": the owner restored this wording deliberately (PR #21).
 * - DCAA and DIEZ licence numbers: company registrations, checkable by anyone.
 */

export type ClaimKey =
  | "argus"
  | "wyvern"
  | "isbao"
  | "press"
  | "testimonials"
  | "aircraftCount"
  | "countryCount"
  | "yearsInBusiness"
  | "groupPassengers"
  | "worldCup2022"
  | "guaranteedAvailability"
  | "partnerBrands"
  | "cobrandCards"
  | "membershipTerms";

interface Claim {
  verified: boolean;
  /** What proof unlocks it. Shown to nobody; for whoever flips the switch. */
  proof: string;
}

export const CLAIMS: Record<ClaimKey, Claim> = {
  argus: { verified: false, proof: "ARGUS broker registration or rating certificate" },
  wyvern: { verified: false, proof: "WYVERN Wingman / broker certificate" },
  isbao: { verified: false, proof: "IS-BAO registration (applies to operators, not brokers)" },
  press: { verified: false, proof: "A link to each article for every outlet named" },
  testimonials: { verified: false, proof: "Written consent from each named client, wording approved" },
  aircraftCount: { verified: false, proof: "Source of the aircraft figure (e.g. Aviapages directory count)" },
  countryCount: { verified: false, proof: "Source of the country figure" },
  yearsInBusiness: { verified: false, proof: "Founding year from company records" },
  groupPassengers: { verified: false, proof: "Passenger totals from trip records" },
  worldCup2022: { verified: false, proof: "Contract or reference for FIFA World Cup 2022 movements" },
  guaranteedAvailability: { verified: false, proof: "Approved Jet Card terms that guarantee availability" },
  partnerBrands: { verified: false, proof: "A signed partner agreement or written permission for every brand, hotel, dealer or benefit named on any page (footer, homepage, /partners, member benefit lists)" },
  membershipTerms: { verified: false, proof: "Owner-approved membership terms: notice periods, request limits, coverage, support levels, overage fees, cancellation and rate locks" },
  cobrandCards: { verified: false, proof: "A signed card-issuer agreement for each network named (Visa, Mastercard, Amex)" },
};

/** The single figure for each number, used only once the claim is verified. */
export const FIGURES = {
  aircraftCount: "7,000+",
  countryCount: "190+",
  yearsInBusiness: "18+",
  groupPassengers: "50,000+",
} as const;

export const isVerified = (key: ClaimKey): boolean => CLAIMS[key].verified;

/** Keep list items whose claim is verified; items without a claim always stay. */
export function onlyVerified<T extends { claim?: ClaimKey }>(items: T[]): T[] {
  return items.filter((item) => !item.claim || isVerified(item.claim));
}

/** "7,000+ vetted aircraft" when verified, otherwise a figure-free phrase with no vetting claim. */
export const aircraftReach = (): string =>
  isVerified("aircraftCount")
    ? `${FIGURES.aircraftCount} vetted aircraft`
    : "a broad range of aircraft";

/** "190+ countries" when verified, otherwise "worldwide". */
export const countryReach = (): string =>
  isVerified("countryCount") ? `${FIGURES.countryCount} countries` : "worldwide";

/** "18+ years" when verified, otherwise null so callers drop the phrase. */
export const yearsPhrase = (): string | null =>
  isVerified("yearsInBusiness") ? `${FIGURES.yearsInBusiness} years` : null;

/** Operator vetting line: names the audits only when both are verified. */
/** One full sentence. The fallback restates Terms §1 (operators hold valid AOCs), not a vetting process we cannot yet evidence. */
export const vettingSentence = (): string =>
  isVerified("argus") && isVerified("wyvern")
    ? "Every operator is verified through ARGUS and WYVERN before it reaches your itinerary."
    : "We arrange every flight with a third-party operator.";

/** Jet Card availability wording. */
export const availabilityPromise = (): string =>
  isVerified("guaranteedAvailability") ? "Guaranteed availability" : "Aircraft sourced for each trip";
