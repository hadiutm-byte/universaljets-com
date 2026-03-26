/**
 * Google Tag Manager dataLayer event helpers + Google Ads gtag conversion calls.
 *
 * Conversion Label Mapping:
 * Once you have your real Google Ads conversion labels, update the LABELS map below.
 * Each key maps to a specific conversion action in your Google Ads account.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const AW_ID = "AW-18041798508";

/**
 * Google Ads Conversion Labels — replace placeholder values with real labels
 * from your Google Ads account (Conversions → Actions → Tag Setup → Conversion Label).
 *
 * Example: "AbCdEfGhIjKlMnOp"
 */
const LABELS: Record<string, string> = {
  flight_search: "",          // Set your label: e.g. "AbCdEfGhIjKl"
  quote_request: "",          // Set your label
  whatsapp_click: "",         // Set your label
  membership_request: "",     // Set your label
  auth_action: "",            // Set your label
  flight_request_submit: "",  // Set your label
  empty_leg_inquiry: "",      // Set your label
  aircraft_guide_view: "",    // Set your label
};

const push = (event: string, params?: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

/** Fire a Google Ads conversion via gtag — only if label is configured */
const gtagConversion = (eventKey: string, extra?: Record<string, unknown>) => {
  if (typeof window.gtag !== "function") return;
  const label = LABELS[eventKey];
  if (label) {
    // Real conversion label configured
    window.gtag("event", "conversion", {
      send_to: `${AW_ID}/${label}`,
      ...extra,
    });
  } else {
    // Fallback: fire as a custom event so it still shows in Google Ads reports
    window.gtag("event", eventKey, extra);
  }
};

/* ── Conversion events ─────────────────────────────────── */

/** User submits a flight search */
export const trackFlightSearch = (data: {
  from: string;
  to: string;
  date?: string;
  passengers?: number;
  tripType?: string;
}) => {
  push("flight_search", data);
  gtagConversion("flight_search", data);
};

/** User clicks "Request Quote" on a search result */
export const trackQuoteRequest = (data: {
  aircraft: string;
  from: string;
  to: string;
}) => {
  push("quote_request", data);
  gtagConversion("quote_request", data);
};

/** User clicks any WhatsApp CTA */
export const trackWhatsAppClick = (context?: string) => {
  push("whatsapp_click", { context: context || "general" });
  gtagConversion("whatsapp_click");
};

/** User opens Ricky chatbot */
export const trackRickyOpen = (mode?: string) =>
  push("ricky_open", { mode: mode || "general" });

/** User requests membership / invitation */
export const trackMembershipRequest = () => {
  push("membership_request");
  gtagConversion("membership_request");
};

/** User signs up or logs in */
export const trackAuth = (method: "signup" | "login") => {
  push("auth_action", { method });
  gtagConversion("auth_action", { method });
};

/** User submits a flight request form */
export const trackFlightRequestSubmit = (data?: {
  from?: string;
  to?: string;
}) => {
  push("flight_request_submit", data);
  gtagConversion("flight_request_submit", data);
};

/** User clicks an empty leg inquiry */
export const trackEmptyLegInquiry = (route?: string) => {
  push("empty_leg_inquiry", { route });
  gtagConversion("empty_leg_inquiry");
};

/** User views the aircraft guide */
export const trackAircraftGuideView = () => {
  push("aircraft_guide_view");
  gtagConversion("aircraft_guide_view");
};

/** Page view (for SPA navigation) */
export const trackPageView = (path: string, title: string) =>
  push("virtual_page_view", { page_path: path, page_title: title });
