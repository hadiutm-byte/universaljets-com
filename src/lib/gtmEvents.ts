/**
 * Google Tag Manager dataLayer event helpers.
 *
 * All tracking — GA4, Google Ads conversions — is managed through
 * GTM (GTM-KG956KGV). No hardcoded gtag.js on the site.
 *
 * DataLayer events pushed here are picked up by GTM triggers and
 * mapped to GA4 events and Google Ads conversion tags inside GTM.
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
export const trackMembershipRequest = () =>
  push("membership_request");

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

/** User views the aircraft guide */
export const trackAircraftGuideView = () =>
  push("aircraft_guide_view");

/** Page view (for SPA navigation — GTM picks this up for GA4) */
export const trackPageView = (path: string, title: string) =>
  push("virtual_page_view", { page_path: path, page_title: title });
