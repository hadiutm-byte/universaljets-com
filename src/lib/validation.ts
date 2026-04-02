import { z } from "zod";

// ── Shared primitives ───────────────────────────────────────────────────────

const trimmedString = z.string().trim();
const optionalTrimmed = trimmedString.optional().or(z.literal("")).transform(v => v || undefined);
const emailField = trimmedString.email("Invalid email address").max(255, "Email too long");
const phoneField = trimmedString.max(30, "Phone number too long").regex(/^[+\d\s()-]*$/, "Invalid phone format").optional().or(z.literal("")).transform(v => v || undefined);

// ── Capture (lead intake) ───────────────────────────────────────────────────

export const CaptureSchema = z.object({
  name: trimmedString.min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: emailField,
  phone: phoneField,
  whatsapp: phoneField,
  departure: optionalTrimmed,
  destination: optionalTrimmed,
  date: optionalTrimmed,
  passengers: z.union([z.string(), z.number()]).optional().transform(v => {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 && n <= 50 ? n : undefined;
  }),
  source: trimmedString.max(100).default("website"),
  aircraft: optionalTrimmed,
  notes: trimmedString.max(2000, "Notes too long").optional().or(z.literal("")),
  trip_type: z.enum(["one_way", "round_trip", "multi_leg"]).optional(),
  return_date: optionalTrimmed,
  preferred_aircraft_category: optionalTrimmed,
  specific_aircraft: optionalTrimmed,
  helicopter_transfer: z.boolean().optional(),
  concierge_needed: z.boolean().optional(),
  vip_terminal: z.boolean().optional(),
  ground_transport: z.boolean().optional(),
  pets: z.boolean().optional(),
  smoking: z.boolean().optional(),
  catering_request: trimmedString.max(500).optional().or(z.literal("")),
  baggage_notes: trimmedString.max(500).optional().or(z.literal("")),
  special_assistance: trimmedString.max(500).optional().or(z.literal("")),
  special_requests: trimmedString.max(1000).optional().or(z.literal("")),
  company: trimmedString.max(200).optional().or(z.literal("")),
  budget_range: optionalTrimmed,
  is_urgent: z.boolean().optional(),
  preferred_contact_method: z.enum(["email", "phone", "whatsapp"]).optional(),
  campaign: optionalTrimmed,
  // Membership fields
  city: optionalTrimmed,
  country: optionalTrimmed,
  nationality: optionalTrimmed,
  title: optionalTrimmed,
  travel_frequency: optionalTrimmed,
  typical_routes: z.array(z.string()).optional(),
  passenger_count: optionalTrimmed,
  reason: trimmedString.max(1000).optional().or(z.literal("")),
  invitation_code: optionalTrimmed,
  referral_source: optionalTrimmed,
  preferred_tier: optionalTrimmed,
  terms_accepted: z.boolean().optional(),
});

export type CaptureInput = z.infer<typeof CaptureSchema>;

// ── Create Client ───────────────────────────────────────────────────────────

export const CreateClientSchema = z.object({
  full_name: trimmedString.min(1, "Full name is required").max(200),
  email: emailField.optional().or(z.literal("")),
  phone: phoneField,
  whatsapp: phoneField,
  company: trimmedString.max(200).optional().or(z.literal("")),
  country: optionalTrimmed,
  city: optionalTrimmed,
  nationality: optionalTrimmed,
  client_type: z.enum([
    "lead", "prospect", "active_client", "member", "vip", "corporate",
    "family_office", "government", "broker", "concierge_only",
  ]).default("lead"),
  preferred_contact_method: z.enum(["email", "phone", "whatsapp"]).default("email"),
  lead_source: trimmedString.min(1, "Lead source is required").max(100),
  notes: trimmedString.max(2000).optional().or(z.literal("")),
  industry: optionalTrimmed,
  address: optionalTrimmed,
  billing_address: optionalTrimmed,
}).refine(data => data.email || data.phone, {
  message: "Email or phone is required",
  path: ["email"],
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

// ── Create Quote ────────────────────────────────────────────────────────────

export const CreateQuoteSchema = z.object({
  request_id: z.string().uuid("Invalid request ID"),
  price: z.number().positive("Price must be positive").max(50_000_000, "Price exceeds maximum"),
  aircraft: optionalTrimmed,
  operator: optionalTrimmed,
  valid_days: z.number().int().min(1).max(90).optional().default(7),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;

// ── Update Status ───────────────────────────────────────────────────────────

const ALLOWED_TABLES = [
  "leads", "flight_requests", "quotes", "contracts",
  "invoices", "trips", "membership_applications",
] as const;

export const UpdateStatusSchema = z.object({
  table: z.enum(ALLOWED_TABLES, { errorMap: () => ({ message: "Invalid table" }) }),
  id: z.string().uuid("Invalid ID"),
  status: trimmedString.min(1, "Status is required").max(50),
  extra: z.record(z.unknown()).optional(),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

// ── Add Note ────────────────────────────────────────────────────────────────

export const AddNoteSchema = z.object({
  client_id: z.string().uuid("Invalid client ID"),
  note: trimmedString.min(1, "Note cannot be empty").max(5000, "Note too long"),
  note_type: trimmedString.max(50).optional(),
});

export type AddNoteInput = z.infer<typeof AddNoteSchema>;

// ── Business Logic: Lead Scoring ────────────────────────────────────────────

/**
 * Calculate a lead quality score (0–100) based on data richness and intent signals.
 *
 * Scoring breakdown:
 * - **Contact completeness** (max 25): email (+10), phone/whatsapp (+10), company (+5)
 * - **Intent signals** (max 35): departure (+10), destination (+10), date (+5), passengers>1 (+5), budget (+5)
 * - **Premium signals** (max 25): urgent (+10), aircraft pref (+5), concierge/VIP/helicopter (+5), round trip (+5)
 * - **Source quality** (max 15): high-value sources like referral/membership (+15), other named (+5)
 *
 * @param data - Object with lead capture fields
 * @returns Score between 0 and 100
 */
export function calcLeadScore(data: Record<string, any>): number {
  let score = 0;
  // Contact completeness (max 25)
  if (data.email) score += 10;
  if (data.phone || data.whatsapp) score += 10;
  if (data.company) score += 5;
  // Intent signals (max 35)
  if (data.departure && data.departure !== "TBD") score += 10;
  if (data.destination && data.destination !== "TBD") score += 10;
  if (data.date) score += 5;
  if (data.passengers && Number(data.passengers) > 1) score += 5;
  if (data.budget_range) score += 5;
  // Premium signals (max 25)
  if (data.is_urgent) score += 10;
  if (data.specific_aircraft || data.preferred_aircraft_category) score += 5;
  if (data.concierge_needed || data.vip_terminal || data.helicopter_transfer) score += 5;
  if (data.trip_type === "round_trip") score += 5;
  // Source quality (max 15)
  const highValueSources = ["referral", "membership_enrollment", "jet_card", "founders_circle", "partner"];
  if (highValueSources.some(s => (data.source || "").toLowerCase().includes(s))) score += 15;
  else if (data.source && data.source !== "website") score += 5;
  return Math.min(score, 100);
}

/**
 * Calculate profile completeness percentage based on filled fields.
 *
 * @param client - Client record with standard fields
 * @returns Percentage 0–100
 */
export function calcProfileCompleteness(client: Record<string, any>): number {
  const fields = [
    "full_name", "email", "phone", "company", "country", "city",
    "nationality", "billing_address", "preferred_contact_method",
    "client_type", "lead_source",
  ];
  const filled = fields.filter(f => client[f] && client[f] !== "").length;
  return Math.round((filled / fields.length) * 100);
}
