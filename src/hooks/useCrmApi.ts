import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const CRM_FUNCTION = "crm-api";

/**
 * Universal CRM API hook.
 * All frontend ↔ CRM communication goes through this hook.
 */
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

      // Build query string for GET params
      const qs = params
        ? "?" + new URLSearchParams(params).toString()
        : "";

      const { data, error } = await supabase.functions.invoke(CRM_FUNCTION, {
        method: "POST", // Edge functions are always POST via SDK
        body: {
          _endpoint: endpoint,
          _method: method,
          _params: params,
          ...body,
        },
      });

      if (error) return { data: null, error: error.message };
      if (data?.error) return { data: null, error: data.error };
      return { data: data as T, error: null };
    },
    []
  );

  // ── PUBLIC ──

  /** Capture a lead from any frontend form */
  const capture = useCallback(
    (payload: {
      name: string;
      email: string;
      phone?: string;
      departure?: string;
      destination?: string;
      date?: string;
      passengers?: string | number;
      source: string;
      aircraft?: string;
      notes?: string;
    }) => call("capture", { method: "POST", body: payload as any }),
    [call]
  );

  // ── MEMBER ──

  /** Get full profile + requests + trips for logged-in member */
  const getMyProfile = useCallback(
    () => call("my-profile", { method: "GET" }),
    [call]
  );

  /** Update profile/travel/concierge preferences */
  const updateProfile = useCallback(
    (section: "profile" | "travel" | "concierge", data: Record<string, unknown>) =>
      call("update-profile", { method: "POST", body: { section, data } }),
    [call]
  );

  // ── STAFF ──

  /** Get CRM dashboard stats */
  const getDashboardStats = useCallback(
    () => call("dashboard-stats", { method: "GET" }),
    [call]
  );

  /** List leads with optional status filter */
  const getLeads = useCallback(
    (status?: string) =>
      call("leads", { method: "GET", params: status ? { status } : undefined }),
    [call]
  );

  /** List clients with optional search */
  const getClients = useCallback(
    (search?: string) =>
      call("clients", { method: "GET", params: search ? { search } : undefined }),
    [call]
  );

  /** List flight requests */
  const getRequests = useCallback(
    (status?: string) =>
      call("requests", { method: "GET", params: status ? { status } : undefined }),
    [call]
  );

  /** Get quotes */
  const getQuotes = useCallback(() => call("quotes", { method: "GET" }), [call]);

  /** Get invoices */
  const getInvoices = useCallback(() => call("invoices", { method: "GET" }), [call]);

  /** Get trips */
  const getTrips = useCallback(() => call("trips", { method: "GET" }), [call]);

  /** Get full client profile */
  const getClient = useCallback(
    (id: string) => call("client", { method: "GET", params: { id } }),
    [call]
  );

  /** Update status of any CRM record (with automations) */
  const updateStatus = useCallback(
    (table: string, id: string, status: string, extra?: Record<string, unknown>) =>
      call("update-status", { method: "POST", body: { table, id, status, extra } }),
    [call]
  );

  /** Create a quote from a flight request */
  const createQuote = useCallback(
    (payload: {
      request_id: string;
      price: number;
      aircraft?: string;
      operator?: string;
      valid_days?: number;
    }) => call("create-quote", { method: "POST", body: payload as any }),
    [call]
  );

  return {
    capture,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    getLeads,
    getClients,
    getRequests,
    getQuotes,
    getInvoices,
    getTrips,
    getClient,
    updateStatus,
    createQuote,
  };
}
