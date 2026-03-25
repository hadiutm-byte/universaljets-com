import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function err(message: string, status = 400) {
  return json({ error: message }, status);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const rawBody = await req.json().catch(() => ({}));
  const endpoint = rawBody._endpoint || new URL(req.url).pathname.split("/").filter(Boolean).pop() || "";
  const httpMethod = rawBody._method || req.method;
  const queryParams = rawBody._params || {};
  // Remove internal routing keys from the body
  const body = { ...rawBody };
  delete body._endpoint;
  delete body._method;
  delete body._params;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Optional auth — extract user from JWT if present
  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;
  let userRoles: string[] = [];

  if (authHeader?.startsWith("Bearer ")) {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: roles } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      userRoles = roles?.map((r: any) => r.role) ?? [];
    }
  }

  const isStaff = userRoles.some((r) =>
    ["admin", "sales", "operations", "finance", "account_management"].includes(r)
  );
  const isAdmin = userRoles.includes("admin");

  try {
    const body = httpMethod !== "GET" ? await req.json().catch(() => ({})) : {};

    // ══════════════════════════════════════════════════════════
    // PUBLIC ENDPOINTS (no auth required)
    // ══════════════════════════════════════════════════════════

    // POST /capture — Universal lead capture from any frontend form
    if (endpoint === "capture" && httpMethod === "POST") {
      const { name, email, phone, departure, destination, date, passengers, source, aircraft, notes } = body;
      if (!name || !email) return err("Name and email are required");

      // Find or create client
      const { data: existing } = await admin
        .from("clients")
        .select("id")
        .eq("email", email)
        .limit(1);

      let clientId: string;
      if (existing && existing.length > 0) {
        clientId = existing[0].id;
        // Update client with latest info
        await admin.from("clients").update({
          full_name: name,
          ...(phone ? { phone } : {}),
        }).eq("id", clientId);
      } else {
        const { data: newClient, error: clientErr } = await admin
          .from("clients")
          .insert({ full_name: name, email, phone: phone || null })
          .select("id")
          .single();
        if (clientErr) throw clientErr;
        clientId = newClient.id;
      }

      // Create lead
      const { data: lead, error: leadErr } = await admin
        .from("leads")
        .insert({ client_id: clientId, status: "new", source: source || "website" })
        .select("id")
        .single();
      if (leadErr) throw leadErr;

      // Create flight request
      const { data: flightReq, error: reqErr } = await admin
        .from("flight_requests")
        .insert({
          client_id: clientId,
          lead_id: lead.id,
          departure: departure || "TBD",
          destination: destination || "TBD",
          date: date || null,
          passengers: passengers ? parseInt(passengers) : 1,
          status: "pending",
          notes: [
            aircraft ? `Aircraft: ${aircraft}` : null,
            source ? `Source: ${source}` : null,
            notes || null,
          ].filter(Boolean).join(" | "),
        })
        .select("id")
        .single();
      if (reqErr) throw reqErr;

      return json({
        success: true,
        client_id: clientId,
        lead_id: lead.id,
        request_id: flightReq.id,
      });
    }

    // ══════════════════════════════════════════════════════════
    // AUTHENTICATED MEMBER ENDPOINTS
    // ══════════════════════════════════════════════════════════

    // GET /my-profile — Get logged-in user's full profile + related data
    if (endpoint === "my-profile" && httpMethod === "GET") {
      if (!userId) return err("Unauthorized", 401);

      const [profile, travel, concierge, routes, docs] = await Promise.all([
        admin.from("profiles").select("*").eq("id", userId).maybeSingle(),
        admin.from("travel_preferences").select("*").eq("user_id", userId).maybeSingle(),
        admin.from("concierge_preferences").select("*").eq("user_id", userId).maybeSingle(),
        admin.from("saved_routes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        admin.from("member_documents").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      // Get client-linked data
      const { data: clientData } = await admin.from("clients").select("id").eq("user_id", userId).maybeSingle();
      let requests: any[] = [];
      let trips: any[] = [];
      let invoices: any[] = [];

      if (clientData) {
        const [reqRes, tripRes, invRes] = await Promise.all([
          admin.from("flight_requests").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
          admin.from("trips").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
          admin.from("invoices").select("*, contracts(quote_id, quotes(request_id, flight_requests(client_id)))").order("created_at", { ascending: false }),
        ]);
        requests = reqRes.data ?? [];
        trips = tripRes.data ?? [];
        // Filter invoices to only user's
        invoices = (invRes.data ?? []).filter((inv: any) => {
          try {
            return inv.contracts?.quotes?.flight_requests?.client_id === clientData.id;
          } catch { return false; }
        });
      }

      return json({
        profile: profile.data,
        travel_preferences: travel.data,
        concierge_preferences: concierge.data,
        saved_routes: routes.data ?? [],
        documents: docs.data ?? [],
        flight_requests: requests,
        trips,
        invoices,
        client_id: clientData?.id ?? null,
        roles: userRoles,
      });
    }

    // POST /update-profile — Update profile, travel, or concierge preferences
    if (endpoint === "update-profile" && httpMethod === "POST") {
      if (!userId) return err("Unauthorized", 401);
      const { section, data } = body;

      if (section === "profile") {
        const { error } = await admin.from("profiles").update(data).eq("id", userId);
        if (error) throw error;
      } else if (section === "travel") {
        const payload = { ...data, user_id: userId };
        delete payload.id; delete payload.created_at; delete payload.updated_at;
        const { error } = await admin.from("travel_preferences").upsert(payload, { onConflict: "user_id" });
        if (error) throw error;
      } else if (section === "concierge") {
        const payload = { ...data, user_id: userId };
        delete payload.id; delete payload.created_at; delete payload.updated_at;
        const { error } = await admin.from("concierge_preferences").upsert(payload, { onConflict: "user_id" });
        if (error) throw error;
      } else {
        return err("Invalid section. Use: profile, travel, concierge");
      }

      return json({ success: true });
    }

    // ══════════════════════════════════════════════════════════
    // STAFF / CRM ENDPOINTS (role-gated)
    // ══════════════════════════════════════════════════════════

    // GET /leads — List leads with optional filters
    if (endpoint === "leads" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const status = queryParams["status"] || null;
      const limit = parseInt(queryParams["limit"] || null || "50");

      let query = admin.from("leads").select("*, clients(full_name, email, phone)").order("created_at", { ascending: false }).limit(limit);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;
      return json({ leads: data });
    }

    // GET /clients — List clients
    if (endpoint === "clients" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const limit = parseInt(queryParams["limit"] || null || "50");
      const search = queryParams["search"] || null;

      let query = admin.from("clients").select("*").order("created_at", { ascending: false }).limit(limit);
      if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return json({ clients: data });
    }

    // GET /requests — List flight requests
    if (endpoint === "requests" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const status = queryParams["status"] || null;
      const limit = parseInt(queryParams["limit"] || null || "50");

      let query = admin.from("flight_requests").select("*, clients(full_name, email)").order("created_at", { ascending: false }).limit(limit);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;
      return json({ requests: data });
    }

    // GET /quotes
    if (endpoint === "quotes" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const { data, error } = await admin.from("quotes").select("*, flight_requests(departure, destination, clients(full_name))").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ quotes: data });
    }

    // GET /invoices
    if (endpoint === "invoices" && httpMethod === "GET") {
      if (!userRoles.some((r) => ["admin", "finance"].includes(r))) return err("Forbidden", 403);
      const { data, error } = await admin.from("invoices").select("*, contracts(quote_id, status)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ invoices: data });
    }

    // GET /trips
    if (endpoint === "trips" && httpMethod === "GET") {
      if (!userRoles.some((r) => ["admin", "operations", "sales"].includes(r))) return err("Forbidden", 403);
      const { data, error } = await admin.from("trips").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ trips: data });
    }

    // POST /update-status — Universal status updater with automation triggers
    if (endpoint === "update-status" && httpMethod === "POST") {
      if (!isStaff) return err("Forbidden", 403);
      const { table, id, status: newStatus, extra } = body;

      const allowed = ["leads", "flight_requests", "quotes", "contracts", "invoices", "trips"];
      if (!allowed.includes(table)) return err("Invalid table");
      if (!id || !newStatus) return err("id and status are required");

      const { error } = await admin.from(table).update({ status: newStatus, ...extra }).eq("id", id);
      if (error) throw error;

      // ── AUTOMATION TRIGGERS ──
      const automations: string[] = [];

      // Lead → confirmed → create trip placeholder
      if (table === "leads" && newStatus === "confirmed") {
        const { data: lead } = await admin.from("leads").select("client_id").eq("id", id).single();
        if (lead?.client_id) {
          const { data: req } = await admin.from("flight_requests").select("*").eq("lead_id", id).limit(1).maybeSingle();
          if (req) {
            await admin.from("trips").insert({
              client_id: lead.client_id,
              departure: req.departure,
              destination: req.destination,
              date: req.date,
              status: "scheduled",
            });
            automations.push("trip_created");
          }
        }
      }

      // Quote → accepted → create contract draft
      if (table === "quotes" && newStatus === "accepted") {
        await admin.from("contracts").insert({
          quote_id: id,
          status: "draft",
        });
        automations.push("contract_draft_created");
      }

      // Contract → signed → create invoice
      if (table === "contracts" && newStatus === "signed") {
        const { data: contract } = await admin.from("contracts").select("quote_id").eq("id", id).single();
        if (contract?.quote_id) {
          const { data: quote } = await admin.from("quotes").select("price").eq("id", contract.quote_id).single();
          if (quote?.price) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            await admin.from("invoices").insert({
              contract_id: id,
              amount: quote.price,
              status: "pending",
              due_date: dueDate.toISOString(),
            });
            automations.push("invoice_created");
          }
        }
      }

      // Invoice → paid → update trip status, update flight request
      if (table === "invoices" && newStatus === "paid") {
        const { data: invoice } = await admin.from("invoices").select("contract_id").eq("id", id).single();
        if (invoice?.contract_id) {
          const { data: contract } = await admin.from("contracts").select("quote_id").eq("id", invoice.contract_id).single();
          if (contract?.quote_id) {
            const { data: quote } = await admin.from("quotes").select("request_id").eq("id", contract.quote_id).single();
            if (quote?.request_id) {
              await admin.from("flight_requests").update({ status: "confirmed" }).eq("id", quote.request_id);
              automations.push("request_confirmed");
            }
          }
        }
      }

      return json({ success: true, automations });
    }

    // POST /create-quote — Create a quote from a flight request
    if (endpoint === "create-quote" && httpMethod === "POST") {
      if (!userRoles.some((r) => ["admin", "sales", "finance"].includes(r))) return err("Forbidden", 403);
      const { request_id, price, aircraft, operator, valid_days } = body;
      if (!request_id || !price) return err("request_id and price are required");

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + (valid_days || 7));

      const { data, error } = await admin.from("quotes").insert({
        request_id,
        price,
        aircraft: aircraft || null,
        operator: operator || null,
        valid_until: validUntil.toISOString(),
        status: "draft",
        created_by: userId,
      }).select("id").single();

      if (error) throw error;

      // Update flight request status
      await admin.from("flight_requests").update({ status: "quoted" }).eq("id", request_id);

      return json({ success: true, quote_id: data.id });
    }

    // GET /dashboard-stats — Admin/staff dashboard statistics
    if (endpoint === "dashboard-stats" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);

      const [clients, leads, requests, quotes, invoices, trips] = await Promise.all([
        admin.from("clients").select("*", { count: "exact", head: true }),
        admin.from("leads").select("*", { count: "exact", head: true }),
        admin.from("flight_requests").select("*", { count: "exact", head: true }),
        admin.from("quotes").select("*", { count: "exact", head: true }),
        admin.from("invoices").select("*", { count: "exact", head: true }),
        admin.from("trips").select("*", { count: "exact", head: true }),
      ]);

      return json({
        clients: clients.count ?? 0,
        leads: leads.count ?? 0,
        requests: requests.count ?? 0,
        quotes: quotes.count ?? 0,
        invoices: invoices.count ?? 0,
        trips: trips.count ?? 0,
      });
    }

    // GET /client/:id — Full client profile for CRM
    if (endpoint === "client" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const clientId = queryParams["id"] || null;
      if (!clientId) return err("Client ID required");

      const [client, leads, requests, quotes, trips] = await Promise.all([
        admin.from("clients").select("*").eq("id", clientId).single(),
        admin.from("leads").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        admin.from("flight_requests").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        admin.from("quotes").select("*, flight_requests!inner(client_id)").eq("flight_requests.client_id", clientId),
        admin.from("trips").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
      ]);

      // Get profile if linked
      let profile = null;
      if (client.data?.user_id) {
        const { data: p } = await admin.from("profiles").select("*").eq("id", client.data.user_id).maybeSingle();
        profile = p;
      }

      return json({
        client: client.data,
        profile,
        leads: leads.data ?? [],
        flight_requests: requests.data ?? [],
        quotes: quotes.data ?? [],
        trips: trips.data ?? [],
      });
    }

    return err("Not found", 404);
  } catch (e: any) {
    console.error("CRM API error:", e);
    return json({ error: e.message || "Internal server error" }, 500);
  }
});
