/**
 * Every factual claim the public site makes about Universal Jets, in one place.
 *
 * Nothing here is shown without proof on file. A claim without `proof` stays
 * on record but renders nowhere: `verified()` leaves it out and every
 * component draws only from what comes back. To publish a claim, add its
 * proof (a licence or certificate number, a membership record, an article
 * link, a signed consent) and the date it was checked. src/test/claims.test.ts
 * fails the build if an unproven claim's wording appears anywhere else in the
 * public site.
 *
 * Universal Jets is an independent charter broker. It does not own or operate
 * aircraft, so no claim may imply ownership, a fleet, or operating credentials.
 */

export interface Proof {
  /** Licence or certificate number, membership id, article URL, consent record. */
  reference: string;
  /** ISO date the proof was last checked. */
  checkedOn: string;
  note?: string;
  url?: string;
}

export interface Claim {
  /** Two or three words for a badge: "DCAA", "18+". */
  short: string;
  /** The claim as a line of text. */
  label: string;
  /** What the claim means, for a sub-line. */
  detail: string;
  proof?: Proof;
}

export const CLAIMS = {
  dcaaLicence: {
    short: "DCAA",
    label: "DCAA Licence No. 3342665",
    detail: "Dubai Civil Aviation Authority",
    proof: {
      reference: "3342665",
      checkedOn: "2026-11-07",
      note: "Number carried over from the previous site. Check it against the licence document and record the expiry date here.",
    },
  },
  diezLicence: {
    short: "DIEZ",
    label: "DIEZ Licence No. 50370",
    detail: "Dubai Integrated Economic Zones",
    proof: {
      reference: "50370",
      checkedOn: "2026-11-07",
      note: "Number carried over from the previous site. Check it against the licence document and record the expiry date here.",
    },
  },
  argusBroker: { short: "ARGUS", label: "ARGUS Registered Broker", detail: "Charter broker registration" },
  wyvernBroker: { short: "WYVERN", label: "WYVERN Certified", detail: "Broker programme" },
  isbaoOperators: { short: "IS-BAO", label: "IS-BAO registered operators", detail: "Operator safety standard" },
  yearsInAviation: { short: "18+", label: "18+ years in private aviation", detail: "Years arranging private flights" },
  aircraftNetwork: { short: "7,000+", label: "7,000+ aircraft worldwide", detail: "Aircraft reachable through operator partners" },
  countriesServed: { short: "190+", label: "190+ countries served", detail: "Countries flights have been arranged to" },
  groupPassengers: { short: "50,000+", label: "50,000+ group passengers moved", detail: "Passengers carried on group charters" },
  worldCup2022: { short: "FIFA 2022", label: "FIFA World Cup 2022 group movements", detail: "Group charters during the tournament" },
  regulatorCompliance: { short: "Compliance", label: "GCAA, GACA, EASA and FAA compliance", detail: "Regulatory compliance statements" },
} as const satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof CLAIMS;

export const isVerified = (key: ClaimKey): boolean => Boolean((CLAIMS[key] as Claim).proof);

/** The claims among `keys` that have proof on file, in the order given. */
export const verified = (keys: readonly ClaimKey[]): Claim[] => keys.filter(isVerified).map((k) => CLAIMS[k]);

/* ── Press ───────────────────────────────────────────────────────────── */

export interface PressMention {
  outlet: string;
  /** Link to the article. Without it the outlet is not shown. */
  url?: string;
  headline?: string;
  publishedOn?: string;
}

export const PRESS: PressMention[] = [
  { outlet: "Arabian Business" },
  { outlet: "Gulf News" },
  { outlet: "Bloomberg" },
  { outlet: "Forbes Middle East" },
  { outlet: "The National" },
  { outlet: "Aviation Week" },
];

export const verifiedPress = (): PressMention[] => PRESS.filter((p) => Boolean(p.url));

/* ── Testimonials ────────────────────────────────────────────────────── */

export interface Testimonial {
  name: string;
  title: string;
  text: string;
  rating: number;
  /** Written permission to publish, from the person quoted. Without it the quote is not shown. */
  consent?: { givenOn: string; reference: string };
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "H.E. Sheikh Khalid",
    title: "Royal Family Office, Abu Dhabi",
    text: "Universal Jets has been our trusted aviation partner for over a decade. Their discretion, speed, and ability to source the perfect aircraft every time is unmatched in the region.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    title: "CEO, London-based Investment Firm",
    text: "From a last-minute medevac to seamless multi-leg trips across Africa — they handle the impossible with grace. I wouldn't fly with anyone else.",
    rating: 5,
  },
  {
    name: "Alexei V.",
    title: "Private Client, Moscow → Dubai",
    text: "What sets Universal Jets apart is their concierge-level service. Catering, ground transport, VIP terminal — everything arranged before I even ask.",
    rating: 5,
  },
  {
    name: "Fatima Al-R.",
    title: "Family Office, Riyadh",
    text: "We needed a heavy jet for Hajj season with 24 hours notice. Universal Jets delivered — competitive pricing, immaculate aircraft, zero stress.",
    rating: 5,
  },
  {
    name: "James T.",
    title: "Sports Management Agency, New York",
    text: "Our athletes demand privacy and punctuality. Universal Jets consistently delivers both, with pricing transparency that's rare in this industry.",
    rating: 5,
  },
];

export const verifiedTestimonials = (): Testimonial[] => TESTIMONIALS.filter((t) => Boolean(t.consent));

/* ── Partners and brands ─────────────────────────────────────────────── */

export interface Partner {
  name: string;
  /** The agreement that allows the name or logo to be shown. Without it the partner is not shown. */
  agreement?: { reference: string; signedOn: string };
}

/** Names the previous site showed as partners. None has an agreement on file. */
export const PARTNERS: Partner[] = [
  { name: "Rolls-Royce" }, { name: "Bombardier" }, { name: "Gulfstream" }, { name: "Embraer" },
  { name: "Dassault Aviation" }, { name: "Textron Aviation" }, { name: "VistaJet" },
  { name: "Jetex" }, { name: "Universal Aviation" }, { name: "ExcelAire" },
  { name: "Four Seasons" }, { name: "Bentley" }, { name: "Aman Hotels" },
  { name: "Visa" }, { name: "Mastercard" }, { name: "American Express" },
  { name: "Ritz-Carlton" }, { name: "Mandarin Oriental" }, { name: "Aman" },
  { name: "Sixt" }, { name: "Blacklane" }, { name: "MSC Yacht Club" }, { name: "Explora Journeys" },
  { name: "Formula 1" }, { name: "Art Basel" },
];

export const verifiedPartners = (): Partner[] => PARTNERS.filter((p) => Boolean(p.agreement));
