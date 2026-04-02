import { z } from "zod";

// ── Shared primitives ───────────────────────────────────────────────────────

const trimmedString = z.string().trim();
const optionalTrimmed = trimmedString.optional().or(z.literal("")).transform(v => v || undefined);
const emailField = trimmedString.email("Invalid email address").max(255, "Email too long");
const phoneField = trimmedString.max(30, "Phone number too long").regex(/^[+\d\s()-]*$/, "Invalid phone format").optional().or(z.literal("")).transform(v => v || undefined);

// ── Newsletter Subscription ─────────────────────────────────────────────────

/**
 * Validates newsletter signup data.
 *
 * @example
 * ```ts
 * const result = NewsletterSchema.safeParse({ email: "user@example.com", consent: true });
 * if (!result.success) console.log(result.error.flatten().fieldErrors);
 * ```
 */
export const NewsletterSchema = z.object({
  email: emailField,
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to receive emails" }) }),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;

// ── Membership Enrollment ───────────────────────────────────────────────────

/**
 * Validates membership enrollment form across all 3 steps.
 *
 * Step 1 (required): name, email
 * Step 2 (optional): city, country, nationality, company, title
 * Step 3 (optional): travel profile + terms
 */
export const MembershipEnrollSchema = z.object({
  // Step 1 – Identity (required)
  name: trimmedString.min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: emailField,
  phone: phoneField,
  whatsapp: phoneField,
  // Step 2 – Background (optional)
  city: optionalTrimmed,
  country: optionalTrimmed,
  nationality: optionalTrimmed,
  company: trimmedString.max(200, "Company name too long").optional().or(z.literal("")),
  title: trimmedString.max(100, "Title too long").optional().or(z.literal("")),
  // Step 3 – Travel Profile
  flights: optionalTrimmed,
  typicalRoutes: optionalTrimmed,
  passengerCount: optionalTrimmed,
  aircraftPref: optionalTrimmed,
  reason: trimmedString.max(1000, "Reason too long").optional().or(z.literal("")),
  invitationCode: trimmedString.max(50, "Invitation code too long").optional().or(z.literal("")),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

export type MembershipEnrollInput = z.infer<typeof MembershipEnrollSchema>;

// ── Quote Request ───────────────────────────────────────────────────────────

/**
 * Validates the multi-step quote request form.
 *
 * Step 1: departure + destination (required)
 * Step 2: name + email (required), phone (optional)
 */
export const QuoteRequestSchema = z.object({
  name: trimmedString.min(1, "Name is required").max(100),
  email: emailField,
  phone: phoneField,
  departure: trimmedString.min(2, "Departure is required").max(200),
  destination: trimmedString.min(2, "Destination is required").max(200),
  date: optionalTrimmed,
  passengers: z.union([z.string(), z.number()]).optional().transform(v => {
    if (v == null || v === "") return "1";
    return String(v);
  }),
  aircraft: optionalTrimmed,
  notes: trimmedString.max(2000, "Notes too long").optional().or(z.literal("")),
});

export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;

// ── Flight Search ───────────────────────────────────────────────────────────

/**
 * Validates the flight search form fields before CRM capture.
 * Airports are validated by selection state (not this schema) — this covers the metadata fields.
 */
export const FlightSearchSchema = z.object({
  departure: trimmedString.min(2, "Select a departure airport"),
  destination: trimmedString.min(2, "Select a destination airport"),
  date: optionalTrimmed,
  passengers: z.union([z.string(), z.number()]).optional().default("1"),
  jetSize: optionalTrimmed,
  phone: phoneField,
  tripType: z.enum(["one_way", "round_trip", "multi_leg"]).optional(),
  source: trimmedString.max(100).default("homepage_widget"),
});

export type FlightSearchInput = z.infer<typeof FlightSearchSchema>;
