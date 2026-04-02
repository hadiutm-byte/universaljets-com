import { describe, it, expect } from "vitest";
import {
  NewsletterSchema,
  MembershipEnrollSchema,
  QuoteRequestSchema,
  FlightSearchSchema,
} from "@/lib/websiteValidation";

// ── Newsletter ──────────────────────────────────────────────────────────────

describe("NewsletterSchema", () => {
  it("accepts valid email with consent", () => {
    const result = NewsletterSchema.safeParse({ email: "test@example.com", consent: true });
    expect(result.success).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = NewsletterSchema.safeParse({ email: "test@example.com", consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = NewsletterSchema.safeParse({ email: "not-an-email", consent: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("trims whitespace from email", () => {
    const result = NewsletterSchema.safeParse({ email: "  test@example.com  ", consent: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("rejects email exceeding 255 characters", () => {
    const longEmail = "a".repeat(250) + "@b.com";
    const result = NewsletterSchema.safeParse({ email: longEmail, consent: true });
    expect(result.success).toBe(false);
  });
});

// ── Membership Enrollment ───────────────────────────────────────────────────

describe("MembershipEnrollSchema", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    termsAccepted: true as const,
  };

  it("accepts valid minimal enrollment", () => {
    const result = MembershipEnrollSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts full enrollment with all optional fields", () => {
    const result = MembershipEnrollSchema.safeParse({
      ...validData,
      phone: "+1 555-1234",
      whatsapp: "+971 50 123 4567",
      city: "Dubai",
      country: "UAE",
      nationality: "Lebanese",
      company: "Acme Corp",
      title: "CEO",
      flights: "3–10",
      typicalRoutes: "DXB-LHR, JFK-MIA",
      passengerCount: "4",
      aircraftPref: "Heavy Jet",
      reason: "Business travel",
      invitationCode: "UJ2026",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects when terms not accepted", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, termsAccepted: false });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone format", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, phone: "abc-not-phone" });
    expect(result.success).toBe(false);
  });

  it("rejects reason exceeding 1000 characters", () => {
    const result = MembershipEnrollSchema.safeParse({ ...validData, reason: "X".repeat(1001) });
    expect(result.success).toBe(false);
  });
});

// ── Quote Request ───────────────────────────────────────────────────────────

describe("QuoteRequestSchema", () => {
  const validQuote = {
    name: "Jane Smith",
    email: "jane@example.com",
    departure: "Dubai (OMDB)",
    destination: "London (EGLL)",
  };

  it("accepts valid quote request", () => {
    const result = QuoteRequestSchema.safeParse(validQuote);
    expect(result.success).toBe(true);
  });

  it("accepts quote with all optional fields", () => {
    const result = QuoteRequestSchema.safeParse({
      ...validQuote,
      phone: "+44 20 1234 5678",
      date: "2026-06-15",
      passengers: "4",
      aircraft: "Gulfstream G650",
      notes: "VIP handling required",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing departure", () => {
    const result = QuoteRequestSchema.safeParse({ ...validQuote, departure: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing destination", () => {
    const result = QuoteRequestSchema.safeParse({ ...validQuote, destination: "L" });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = QuoteRequestSchema.safeParse({ ...validQuote, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = QuoteRequestSchema.safeParse({ ...validQuote, email: "not-valid" });
    expect(result.success).toBe(false);
  });

  it("defaults passengers to '1' when empty", () => {
    const result = QuoteRequestSchema.safeParse(validQuote);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passengers).toBe("1");
    }
  });

  it("rejects notes exceeding 2000 characters", () => {
    const result = QuoteRequestSchema.safeParse({ ...validQuote, notes: "N".repeat(2001) });
    expect(result.success).toBe(false);
  });
});

// ── Flight Search ───────────────────────────────────────────────────────────

describe("FlightSearchSchema", () => {
  const validSearch = {
    departure: "Dubai (OMDB)",
    destination: "London (EGLL)",
  };

  it("accepts valid search", () => {
    const result = FlightSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
  });

  it("accepts search with all fields", () => {
    const result = FlightSearchSchema.safeParse({
      ...validSearch,
      date: "2026-06-15T10:00",
      passengers: "6",
      jetSize: "heavy",
      phone: "+1 555 0000",
      tripType: "round_trip",
      source: "homepage_widget",
    });
    expect(result.success).toBe(true);
  });

  it("rejects departure shorter than 2 chars", () => {
    const result = FlightSearchSchema.safeParse({ ...validSearch, departure: "D" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid trip type", () => {
    const result = FlightSearchSchema.safeParse({ ...validSearch, tripType: "invalid" });
    expect(result.success).toBe(false);
  });

  it("defaults passengers to '1'", () => {
    const result = FlightSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passengers).toBe("1");
    }
  });

  it("defaults source to 'homepage_widget'", () => {
    const result = FlightSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("homepage_widget");
    }
  });
});
