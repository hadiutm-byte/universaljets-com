import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FAQS, SERVICES, PRICING_FACTORS } from "@/lib/siteContent";
import { organizationSchema, localBusinessSchema, serviceSchema, faqSchema } from "@/components/JsonLd";

const capture = vi.fn();
vi.mock("@/hooks/useCrmApi", () => ({ useCrmApi: () => ({ capture }) }));
vi.mock("@/hooks/useUserGeolocation", () => ({ default: () => ({ countryCode: "AE" }) }));
vi.mock("@/lib/gtmEvents", () => ({ trackGenerateLead: vi.fn() }));

import TwoStepQuoteForm from "@/components/TwoStepQuoteForm";

describe("site content", () => {
  it("has unique service slugs and FAQ questions", () => {
    expect(new Set(SERVICES.map((s) => s.slug)).size).toBe(SERVICES.length);
    expect(new Set(FAQS.map((f) => f.q)).size).toBe(FAQS.length);
    expect(PRICING_FACTORS.length).toBeGreaterThan(0);
  });

  it("contains no invented dollar prices in FAQ/pricing copy", () => {
    const text = JSON.stringify([FAQS, PRICING_FACTORS]);
    expect(text).not.toMatch(/\$\s?\d/);
  });

  it("JSON-LD does not include unverified ratings, prices or placeholder address data", () => {
    const all = JSON.stringify([organizationSchema, localBusinessSchema, serviceSchema]);
    expect(all).not.toMatch(/aggregateRating|AggregateOffer|"postalCode"|lowPrice|numberOfEmployees/);
    expect(faqSchema.mainEntity).toHaveLength(FAQS.length);
  });
});

describe("TwoStepQuoteForm", () => {
  beforeEach(() => capture.mockReset());

  const fillStep1 = () => {
    fireEvent.change(screen.getByLabelText(/^From/), { target: { value: "Dubai" } });
    fireEvent.change(screen.getByLabelText(/^To/), { target: { value: "London" } });
  };

  it("blocks step 1 when route is missing", () => {
    render(<TwoStepQuoteForm />);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByText(/departure city/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 2/)).toBeInTheDocument();
  });

  it("validates email on step 2 and does not submit", async () => {
    render(<TwoStepQuoteForm />);
    fillStep1();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /request quote/i }));
    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument());
    expect(capture).not.toHaveBeenCalled();
  });

  it("submits to CRM capture with the source and shows success", async () => {
    capture.mockResolvedValue({ data: {}, error: null });
    render(<TwoStepQuoteForm source="test_src" />);
    fillStep1();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "t@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /request quote/i }));
    await waitFor(() => expect(screen.getByText(/request received/i)).toBeInTheDocument());
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({ source: "test_src", departure: "Dubai", destination: "London", email: "t@example.com" }),
    );
  });

  it("shows an error and keeps the form when capture fails", async () => {
    capture.mockResolvedValue({ data: null, error: "boom" });
    render(<TwoStepQuoteForm />);
    fillStep1();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "t@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /request quote/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/couldn't send/i));
  });
});
