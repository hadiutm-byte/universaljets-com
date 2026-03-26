/**
 * Google Tag Manager dataLayer event helpers.
 * Push structured events so GTM can fire Google Ads conversion tags,
 * remarketing pixels, and GA4 events.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const push = (event: string, params?: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

/* ── Conversion events ─────────────────────────────────── */

/** User submits a flight search */
export const trackFlightSearch = (data: {
  from: string;
  to: string;
  date?: string;
  passengers?: number;
  tripType?: string;
}) => push("flight_search", data);

/** User clicks "Request Quote" on a search result */
export const trackQuoteRequest = (data: {
  aircraft: string;
  from: string;
  to: string;
}) => push("quote_request", data);

/** User clicks any WhatsApp CTA */
export const trackWhatsAppClick = (context?: string) =>
  push("whatsapp_click", { context: context || "general" });

/** User opens Ricky chatbot */
export const trackRickyOpen = (mode?: string) =>
  push("ricky_open", { mode: mode || "general" });

/** User requests membership / invitation */
export const trackMembershipRequest = () => push("membership_request");

/** User signs up or logs in */
export const trackAuth = (method: "signup" | "login") =>
  push("auth_action", { method });

/** User submits a flight request form */
export const trackFlightRequestSubmit = (data?: {
  from?: string;
  to?: string;
}) => push("flight_request_submit", data);

/** User clicks an empty leg inquiry */
export const trackEmptyLegInquiry = (route?: string) =>
  push("empty_leg_inquiry", { route });

/** Page view (for SPA navigation) */
export const trackPageView = (path: string, title: string) =>
  push("virtual_page_view", { page_path: path, page_title: title });
