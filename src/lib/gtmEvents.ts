/**
 * Google Tag Manager dataLayer event helpers + Google Ads gtag conversion calls.
 * Push structured events so GTM can fire Google Ads conversion tags,
 * remarketing pixels, and GA4 events.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const push = (event: string, params?: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

/** Fire a Google Ads conversion via gtag */
const gtagConversion = (conversionLabel: string, extra?: Record<string, unknown>) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `AW-18041798508/${conversionLabel}`,
      ...extra,
    });
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
  gtagConversion("flight_search");
};

/** User clicks "Request Quote" on a search result */
export const trackQuoteRequest = (data: {
  aircraft: string;
  from: string;
  to: string;
}) => {
  push("quote_request", data);
  gtagConversion("quote_request");
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
  gtagConversion("auth_action");
};

/** User submits a flight request form */
export const trackFlightRequestSubmit = (data?: {
  from?: string;
  to?: string;
}) => {
  push("flight_request_submit", data);
  gtagConversion("flight_request_submit");
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
