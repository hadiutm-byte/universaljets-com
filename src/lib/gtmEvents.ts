/**
 * Google Tag Manager dataLayer event helpers.
 *
 * All tracking — GA4, Google Ads conversions — is managed through
 * GTM (GTM-KG956KGV). No hardcoded gtag.js on the site.
 *
 * DataLayer events pushed here are picked up by GTM triggers and
 * mapped to GA4 events and Google Ads conversion tags inside GTM.
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

/* ── Enhanced Conversions: hashed user data ───────────────
 * Google Ads matches leads on SHA-256 hashes of normalised values.
 * Hashing happens here, before anything reaches the data layer, so
 * no clear-text name, email or phone number is ever exposed to GTM,
 * third-party tags or browser extensions.
 * Normalisation follows Google's rules: email lower-case and trimmed,
 * phone in E.164 form (digits with a leading +), names lower-case.
 */
export const normalizeEmail = (email?: string) => (email || "").trim().toLowerCase();

export const normalizePhone = (phone?: string) => {
  const raw = (phone || "").replace(/[\s().-]/g, "");
  if (!raw) return "";
  return raw.startsWith("00") ? `+${raw.slice(2)}` : raw;
};

const normalizeName = (name?: string) => (name || "").trim().toLowerCase().replace(/\s+/g, " ");

export const sha256Hex = async (value: string): Promise<string | undefined> => {
  if (!value) return undefined;
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return undefined; // insecure context: send no user data at all
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Google Ads Enhanced Conversion — generate_lead
 * Pushes hashed user-provided data for server-side matching.
 * GTM maps `user_data.sha256_*` to the Google Ads conversion tag
 * AW-18041798508 (the User-Provided Data variable accepts pre-hashed
 * values under these names).
 */
export const trackGenerateLead = async (data: {
  email?: string;
  phone?: string;
  name?: string;
  value?: number;
  currency?: string;
  source?: string;
}) => {
  const [first = "", ...rest] = normalizeName(data.name).split(" ").filter(Boolean);
  const [email, phone, firstName, lastName] = await Promise.all([
    sha256Hex(normalizeEmail(data.email)),
    sha256Hex(normalizePhone(data.phone)),
    sha256Hex(first),
    sha256Hex(rest.join(" ")),
  ]);

  const user_data: Record<string, unknown> = {};
  if (email) user_data.sha256_email_address = email;
  if (phone) user_data.sha256_phone_number = phone;
  if (firstName || lastName) {
    user_data.address = {
      ...(firstName ? { sha256_first_name: firstName } : {}),
      ...(lastName ? { sha256_last_name: lastName } : {}),
    };
  }

  push("generate_lead", {
    event_category: "conversion",
    value: data.value || 0,
    currency: data.currency || "USD",
    lead_source: data.source || "website",
    ...(Object.keys(user_data).length ? { user_data } : {}),
  });
};

/** User views a specific destination page (remarketing audience) */
export const trackDestinationView = (destination: string) =>
  push("destination_view", { destination_name: destination });

/** User views fleet/aircraft page (remarketing audience) */
export const trackFleetView = (aircraft?: string) =>
  push("fleet_view", { aircraft_name: aircraft || "all" });
