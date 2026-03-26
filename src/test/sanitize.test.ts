import { describe, it, expect } from "vitest";
import {
  sanitizeAircraftName,
  sanitizeAircraftImages,
  sanitizeAircraftForPublic,
  stripRegistration,
  looksLikeRegistration,
} from "@/lib/sanitize";

describe("sanitizeAircraftName", () => {
  it("strips bracketed registration", () => {
    expect(sanitizeAircraftName("Cessna Citation VI (HA-JEX)")).toBe("Cessna Citation VI");
    expect(sanitizeAircraftName("Piaggio Avanti II (D-IRBS)")).toBe("Piaggio Avanti II");
    expect(sanitizeAircraftName("Global 6000 (9H-VCA)")).toBe("Global 6000");
  });

  it("returns 'Private Jet' for empty/null", () => {
    expect(sanitizeAircraftName(null)).toBe("Private Jet");
    expect(sanitizeAircraftName(undefined)).toBe("Private Jet");
    expect(sanitizeAircraftName("")).toBe("Private Jet");
  });

  it("preserves clean names", () => {
    expect(sanitizeAircraftName("Gulfstream G650")).toBe("Gulfstream G650");
  });
});

describe("sanitizeAircraftImages", () => {
  it("filters tail and registration images", () => {
    const images = [
      { url: "https://example.com/ext.jpg", type: "exterior" },
      { url: "https://example.com/tail.jpg", type: "tail" },
      { url: "https://example.com/reg.jpg", type: "registration" },
      { url: "https://example.com/cabin.jpg", type: "cabin" },
    ];
    const result = sanitizeAircraftImages(images);
    expect(result).toHaveLength(2);
    expect(result.map(i => i.type)).toEqual(["exterior", "cabin"]);
  });

  it("deduplicates by URL", () => {
    const images = [
      { url: "https://example.com/a.jpg", type: "exterior" },
      { url: "https://example.com/a.jpg", type: "cabin" },
    ];
    expect(sanitizeAircraftImages(images)).toHaveLength(1);
  });

  it("returns empty array for null/undefined", () => {
    expect(sanitizeAircraftImages(null)).toEqual([]);
    expect(sanitizeAircraftImages(undefined)).toEqual([]);
  });
});

describe("sanitizeAircraftForPublic", () => {
  it("strips private keys", () => {
    const raw = {
      name: "Citation XLS+",
      tail_number: "N123AB",
      registration: "HA-JEX",
      operator: { name: "Secret Operator", certified: true },
      operator_name: "Secret Operator",
      aircraft_identifier: "ABC123",
      max_pax: 8,
    };
    const result = sanitizeAircraftForPublic(raw);
    expect(result).not.toHaveProperty("tail_number");
    expect(result).not.toHaveProperty("registration");
    expect(result).not.toHaveProperty("operator_name");
    expect(result).not.toHaveProperty("aircraft_identifier");
    expect(result).not.toHaveProperty("operator");
    expect(result.certified).toBe(true);
    expect(result.name).toBe("Citation XLS+");
  });

  it("sanitizes name fields with bracketed registration", () => {
    const raw = { name: "Falcon 900 (VP-BNR)", aircraft_type: "Falcon 900 (VP-BNR)" };
    const result = sanitizeAircraftForPublic(raw);
    expect(result.name).toBe("Falcon 900");
  });

  it("sanitizes nested image arrays", () => {
    const raw = {
      name: "Test Jet",
      images: {
        all: [
          { url: "a.jpg", type: "exterior" },
          { url: "b.jpg", type: "tail" },
        ],
        exterior: "a.jpg",
      },
    };
    const result = sanitizeAircraftForPublic(raw);
    const images = result.images as any;
    expect(images.all).toHaveLength(1);
    expect(images.all[0].type).toBe("exterior");
  });
});

describe("stripRegistration", () => {
  it("removes standalone registrations", () => {
    expect(stripRegistration("Operated by HA-JEX fleet")).not.toContain("HA-JEX");
  });
});

describe("looksLikeRegistration", () => {
  it("detects registrations", () => {
    expect(looksLikeRegistration("HA-JEX")).toBe(true);
    expect(looksLikeRegistration("D-IRBS")).toBe(true);
    expect(looksLikeRegistration("N123AB")).toBe(true);
    expect(looksLikeRegistration("Gulfstream")).toBe(false);
    expect(looksLikeRegistration(null)).toBe(false);
  });
});
