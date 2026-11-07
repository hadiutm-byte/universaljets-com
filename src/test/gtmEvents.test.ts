import { describe, it, expect, beforeEach, vi } from "vitest";
import { webcrypto } from "node:crypto";
import { normalizeEmail, normalizePhone, sha256Hex, trackGenerateLead } from "@/lib/gtmEvents";

// jsdom ships no SubtleCrypto; use Node's Web Crypto, which matches the browser API.
vi.stubGlobal("crypto", webcrypto);

const HEX_64 = /^[0-9a-f]{64}$/;

describe("gtmEvents: enhanced-conversion user data", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it("normalises email and phone the way Google Ads expects", () => {
    expect(normalizeEmail("  Hadi@UniversalJets.com ")).toBe("hadi@universaljets.com");
    expect(normalizePhone("+971 58 591 8498")).toBe("+971585918498");
    expect(normalizePhone("00971 (58) 591-8498")).toBe("+971585918498");
    expect(normalizePhone("")).toBe("");
  });

  it("hashes with SHA-256 and returns nothing for empty input", async () => {
    await expect(sha256Hex("test@example.com")).resolves.toBe(
      "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b",
    );
    await expect(sha256Hex("")).resolves.toBeUndefined();
  });

  it("pushes only hashed values to the data layer, never clear text", async () => {
    await trackGenerateLead({
      email: "Test@Example.com",
      phone: "+971 58 591 8498",
      name: "Hadi Hammud",
      source: "contact_page",
    });

    expect(window.dataLayer).toHaveLength(1);
    const event = window.dataLayer[0] as Record<string, unknown>;
    const userData = event.user_data as Record<string, unknown>;
    const address = userData.address as Record<string, string>;

    expect(event.event).toBe("generate_lead");
    expect(event.lead_source).toBe("contact_page");
    expect(userData.sha256_email_address).toBe(
      "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b",
    );
    expect(userData.sha256_phone_number).toBe(
      "93ad53665ec7ed506b0e4a73cf3d8ba8f6980c2d11d034b701eb92ae41c3f0b7",
    );
    expect(address.sha256_first_name).toMatch(HEX_64);
    expect(address.sha256_last_name).toMatch(HEX_64);

    const serialised = JSON.stringify(window.dataLayer).toLowerCase();
    for (const clear of ["test@example.com", "8498", "hadi", "hammud"]) {
      expect(serialised).not.toContain(clear);
    }
  });

  it("omits user_data entirely when no personal data was given", async () => {
    await trackGenerateLead({ source: "quote_form" });
    const event = window.dataLayer[0] as Record<string, unknown>;
    expect(event.user_data).toBeUndefined();
  });
});
