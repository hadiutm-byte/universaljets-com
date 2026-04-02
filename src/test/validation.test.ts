import { describe, it, expect } from "vitest";
import {
  CaptureSchema,
  CreateClientSchema,
  CreateQuoteSchema,
  UpdateStatusSchema,
  AddNoteSchema,
  calcLeadScore,
  calcProfileCompleteness,
} from "@/lib/validation";

// ── Capture Schema ──────────────────────────────────────────────────────────

describe("CaptureSchema", () => {
  it("accepts valid minimal capture", () => {
    const result = CaptureSchema.safeParse({ name: "John Doe", email: "john@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = CaptureSchema.safeParse({ email: "john@example.com" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = CaptureSchema.safeParse({ name: "John", email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from name", () => {
    const result = CaptureSchema.safeParse({ name: "  John Doe  ", email: "j@e.com" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("John Doe");
  });

  it("rejects name exceeding 100 chars", () => {
    const result = CaptureSchema.safeParse({ name: "A".repeat(101), email: "j@e.com" });
    expect(result.success).toBe(false);
  });

  it("accepts full capture with all fields", () => {
    const result = CaptureSchema.safeParse({
      name: "Jane Smith",
      email: "jane@corp.com",
      phone: "+971501234567",
      departure: "OMDB",
      destination: "LFPG",
      date: "2026-05-01",
      passengers: 4,
      source: "website",
      trip_type: "round_trip",
      is_urgent: true,
      concierge_needed: true,
      notes: "VIP client",
    });
    expect(result.success).toBe(true);
  });

  it("transforms string passengers to number", () => {
    const result = CaptureSchema.safeParse({ name: "A", email: "a@b.com", passengers: "3" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.passengers).toBe(3);
  });

  it("rejects invalid phone format", () => {
    const result = CaptureSchema.safeParse({ name: "A", email: "a@b.com", phone: "abc$$$" });
    expect(result.success).toBe(false);
  });
});

// ── CreateClient Schema ─────────────────────────────────────────────────────

describe("CreateClientSchema", () => {
  it("accepts valid client with email", () => {
    const result = CreateClientSchema.safeParse({
      full_name: "Test Client",
      email: "test@example.com",
      lead_source: "website",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid client with phone only", () => {
    const result = CreateClientSchema.safeParse({
      full_name: "Test Client",
      phone: "+971501234567",
      lead_source: "referral",
    });
    expect(result.success).toBe(true);
  });

  it("rejects client with neither email nor phone", () => {
    const result = CreateClientSchema.safeParse({
      full_name: "Test Client",
      lead_source: "website",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing lead_source", () => {
    const result = CreateClientSchema.safeParse({
      full_name: "Test Client",
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });
});

// ── CreateQuote Schema ──────────────────────────────────────────────────────

describe("CreateQuoteSchema", () => {
  const validUuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  it("accepts valid quote", () => {
    const result = CreateQuoteSchema.safeParse({ request_id: validUuid, price: 50000 });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID request_id", () => {
    const result = CreateQuoteSchema.safeParse({ request_id: "bad-id", price: 50000 });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = CreateQuoteSchema.safeParse({ request_id: validUuid, price: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects price exceeding maximum", () => {
    const result = CreateQuoteSchema.safeParse({ request_id: validUuid, price: 100_000_000 });
    expect(result.success).toBe(false);
  });

  it("defaults valid_days to 7", () => {
    const result = CreateQuoteSchema.safeParse({ request_id: validUuid, price: 50000 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.valid_days).toBe(7);
  });
});

// ── UpdateStatus Schema ─────────────────────────────────────────────────────

describe("UpdateStatusSchema", () => {
  const validUuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  it("accepts valid status update", () => {
    const result = UpdateStatusSchema.safeParse({ table: "leads", id: validUuid, status: "contacted" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid table name", () => {
    const result = UpdateStatusSchema.safeParse({ table: "users", id: validUuid, status: "active" });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID id", () => {
    const result = UpdateStatusSchema.safeParse({ table: "leads", id: "123", status: "contacted" });
    expect(result.success).toBe(false);
  });
});

// ── AddNote Schema ──────────────────────────────────────────────────────────

describe("AddNoteSchema", () => {
  const validUuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  it("accepts valid note", () => {
    const result = AddNoteSchema.safeParse({ client_id: validUuid, note: "Called client" });
    expect(result.success).toBe(true);
  });

  it("rejects empty note", () => {
    const result = AddNoteSchema.safeParse({ client_id: validUuid, note: "" });
    expect(result.success).toBe(false);
  });

  it("rejects note exceeding 5000 chars", () => {
    const result = AddNoteSchema.safeParse({ client_id: validUuid, note: "A".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

// ── Lead Scoring ────────────────────────────────────────────────────────────

describe("calcLeadScore", () => {
  it("returns 0 for empty data", () => {
    expect(calcLeadScore({})).toBe(0);
  });

  it("scores email at 10", () => {
    expect(calcLeadScore({ email: "a@b.com" })).toBe(10);
  });

  it("scores full contact info at 25", () => {
    expect(calcLeadScore({ email: "a@b.com", phone: "+1234", company: "Acme" })).toBe(25);
  });

  it("scores intent signals correctly", () => {
    const score = calcLeadScore({
      email: "a@b.com",
      departure: "OMDB",
      destination: "LFPG",
      date: "2026-05-01",
      passengers: 4,
      budget_range: "$50k-100k",
    });
    // email(10) + departure(10) + destination(10) + date(5) + passengers>1(5) + budget(5) = 45
    expect(score).toBe(45);
  });

  it("scores premium signals correctly", () => {
    const score = calcLeadScore({
      email: "a@b.com",
      is_urgent: true,
      specific_aircraft: "G650",
      concierge_needed: true,
      trip_type: "round_trip",
    });
    // email(10) + urgent(10) + aircraft(5) + concierge(5) + round_trip(5) = 35
    expect(score).toBe(35);
  });

  it("scores high-value source at 15", () => {
    const score = calcLeadScore({ email: "a@b.com", source: "referral_partner" });
    // email(10) + source(15) = 25
    expect(score).toBe(25);
  });

  it("scores non-website source at 5", () => {
    const score = calcLeadScore({ email: "a@b.com", source: "linkedin" });
    // email(10) + source(5) = 15
    expect(score).toBe(15);
  });

  it("caps at 100", () => {
    const score = calcLeadScore({
      email: "a@b.com", phone: "+1", company: "Corp",
      departure: "JFK", destination: "LHR", date: "2026-01-01",
      passengers: 5, budget_range: "100k+",
      is_urgent: true, specific_aircraft: "G700",
      concierge_needed: true, trip_type: "round_trip",
      source: "membership_enrollment",
    });
    expect(score).toBe(100);
  });

  it("ignores departure=TBD for intent scoring", () => {
    const score = calcLeadScore({ email: "a@b.com", departure: "TBD" });
    expect(score).toBe(10); // only email
  });
});

// ── Profile Completeness ────────────────────────────────────────────────────

describe("calcProfileCompleteness", () => {
  it("returns 0 for empty profile", () => {
    expect(calcProfileCompleteness({})).toBe(0);
  });

  it("returns 100 for fully filled profile", () => {
    expect(calcProfileCompleteness({
      full_name: "John", email: "j@e.com", phone: "+1", company: "Corp",
      country: "UAE", city: "Dubai", nationality: "US",
      billing_address: "123 St", preferred_contact_method: "email",
      client_type: "vip", lead_source: "referral",
    })).toBe(100);
  });

  it("returns correct percentage for partial fill", () => {
    const pct = calcProfileCompleteness({ full_name: "John", email: "j@e.com" });
    // 2 out of 11 fields = 18%
    expect(pct).toBe(18);
  });

  it("ignores empty string values", () => {
    expect(calcProfileCompleteness({ full_name: "", email: "" })).toBe(0);
  });
});
