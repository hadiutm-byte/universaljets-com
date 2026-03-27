import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const CRM_FUNCTION = "crm-api";

export function useCrmApi() {
  const call = useCallback(
    async <T = any>(
      endpoint: string,
      options?: {
        method?: "GET" | "POST";
        body?: Record<string, unknown>;
        params?: Record<string, string>;
      }
    ): Promise<{ data: T | null; error: string | null }> => {
      const { method = "GET", body, params } = options ?? {};

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      try {
        const { data, error } = await supabase.functions.invoke(CRM_FUNCTION, {
          method: "POST",
          body: {
            _endpoint: endpoint,
            _method: method,
            _params: params,
            ...body,
          },
        });

        clearTimeout(timeout);

        if (error) return { data: null, error: error.message };
        if (data?.error) return { data: null, error: data.error };
        return { data: data as T, error: null };
      } catch (e: any) {
        clearTimeout(timeout);
        console.error(`CRM API [${endpoint}] failed:`, e);
        return { data: null, error: e?.message || "Request failed" };
      }
    },
    []
  );

  /** Universal lead/request capture from any frontend form */
  const capture = useCallback(
    (payload: {
      name: string;
      email: string;
      phone?: string;
      whatsapp?: string;
      departure?: string;
      destination?: string;
      date?: string;
      passengers?: string | number;
      source: string;
      aircraft?: string;
      notes?: string;
      // Expanded fields
      trip_type?: string;
      return_date?: string;
      preferred_aircraft_category?: string;
      specific_aircraft?: string;
      helicopter_transfer?: boolean;
      concierge_needed?: boolean;
      vip_terminal?: boolean;
      ground_transport?: boolean;
      pets?: boolean;
      smoking?: boolean;
      catering_request?: string;
      baggage_notes?: string;
      special_assistance?: string;
      special_requests?: string;
      company?: string;
      budget_range?: string;
      is_urgent?: boolean;
      preferred_contact_method?: string;
      campaign?: string;
      // Membership fields
      city?: string;
      country?: string;
      nationality?: string;
      title?: string;
      travel_frequency?: string;
      typical_routes?: string[];
      passenger_count?: string;
      reason?: string;
      invitation_code?: string;
      referral_source?: string;
      preferred_tier?: string;
      terms_accepted?: boolean;
    }) => call("capture", { method: "POST", body: payload as any }),
    [call]
  );

  const getMyProfile = useCallback(() => call("my-profile", { method: "GET" }), [call]);

  const updateProfile = useCallback(
    (section: "profile" | "travel" | "concierge", data: Record<string, unknown>) =>
      call("update-profile", { method: "POST", body: { section, data } }),
    [call]
  );

  const getDashboardStats = useCallback(() => call("dashboard-stats", { method: "GET" }), [call]);

  const getLeads = useCallback(
    (status?: string) => call("leads", { method: "GET", params: status ? { status } : undefined }),
    [call]
  );

  const getClients = useCallback(
    (search?: string) => call("clients", { method: "GET", params: search ? { search } : undefined }),
    [call]
  );

  const getRequests = useCallback(
    (status?: string) => call("requests", { method: "GET", params: status ? { status } : undefined }),
    [call]
  );

  const getQuotes = useCallback(() => call("quotes", { method: "GET" }), [call]);
  const getInvoices = useCallback(() => call("invoices", { method: "GET" }), [call]);
  const getTrips = useCallback(() => call("trips", { method: "GET" }), [call]);

  const getMembershipApplications = useCallback(
    (status?: string) => call("membership-applications", { method: "GET", params: status ? { status } : undefined }),
    [call]
  );

  const getClient = useCallback(
    (id: string) => call("client", { method: "GET", params: { id } }),
    [call]
  );

  const updateStatus = useCallback(
    (table: string, id: string, status: string, extra?: Record<string, unknown>) =>
      call("update-status", { method: "POST", body: { table, id, status, extra } }),
    [call]
  );

  const createQuote = useCallback(
    (payload: { request_id: string; price: number; aircraft?: string; operator?: string; valid_days?: number }) =>
      call("create-quote", { method: "POST", body: payload as any }),
    [call]
  );

  const createClient = useCallback(
    (payload: Record<string, unknown>) => call("create-client", { method: "POST", body: payload }),
    [call]
  );

  return {
    capture, getMyProfile, updateProfile, getDashboardStats,
    getLeads, getClients, getRequests, getQuotes, getInvoices, getTrips,
    getMembershipApplications, getClient, updateStatus, createQuote, createClient,
  };
}
