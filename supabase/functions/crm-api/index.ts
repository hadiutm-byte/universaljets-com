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
  const endpoint = rawBody._endpoint || "";
  const httpMethod = rawBody._method || req.method;
  const queryParams = rawBody._params || {};
  const body = { ...rawBody };
  delete body._endpoint;
  delete body._method;
  delete body._params;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Auth
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
      const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
      userRoles = roles?.map((r: any) => r.role) ?? [];
    }
  }

  const isStaff = userRoles.some((r) =>
    ["admin", "sales", "operations", "finance", "account_management"].includes(r)
  );
  const isAdmin = userRoles.includes("admin");

  // Profile completeness calculator
  function calcCompleteness(client: Record<string, any>): number {
    const fields = ["full_name", "email", "phone", "company", "country", "city", "nationality", "billing_address", "preferred_contact_method", "client_type", "lead_source"];
    const filled = fields.filter((f) => client[f] && client[f] !== "").length;
    return Math.round((filled / fields.length) * 100);
  }

  // Lead scoring: rate lead quality 0-100 based on data richness and intent signals
  function calcLeadScore(data: Record<string, any>): number {
    let score = 0;
    // Contact completeness (max 25)
    if (data.email) score += 10;
    if (data.phone || data.whatsapp) score += 10;
    if (data.company) score += 5;
    // Intent signals (max 35)
    if (data.departure && data.departure !== "TBD") score += 10;
    if (data.destination && data.destination !== "TBD") score += 10;
    if (data.date) score += 5;
    if (data.passengers && data.passengers > 1) score += 5;
    if (data.budget_range) score += 5;
    // Premium signals (max 25)
    if (data.is_urgent) score += 10;
    if (data.specific_aircraft || data.preferred_aircraft_category) score += 5;
    if (data.concierge_needed || data.vip_terminal || data.helicopter_transfer) score += 5;
    if (data.trip_type === "round_trip") score += 5;
    // Source quality (max 15)
    const highValueSources = ["referral", "membership_enrollment", "jet_card", "founders_circle", "partner"];
    if (highValueSources.some(s => (data.source || "").toLowerCase().includes(s))) score += 15;
    else if (data.source && data.source !== "website") score += 5;
    return Math.min(score, 100);
  }

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  try {
    // ══════════════════════════════════════════════════════════
    // PUBLIC: POST /capture — Universal lead capture
    // ══════════════════════════════════════════════════════════
    if (endpoint === "capture" && httpMethod === "POST") {
      const { name, email, phone, whatsapp, departure, destination, date, passengers, source, aircraft, notes,
        trip_type, return_date, preferred_aircraft_category, specific_aircraft,
        helicopter_transfer, concierge_needed, vip_terminal, ground_transport,
        pets, smoking, catering_request, baggage_notes, special_assistance, special_requests,
        company, budget_range, is_urgent, preferred_contact_method, campaign,
        // Membership application fields
        city, country, nationality, title: jobTitle, travel_frequency, typical_routes,
        passenger_count, reason, invitation_code, referral_source, preferred_tier, terms_accepted,
      } = body;

      if (!name || !email) return err("Name and email are required");
      if (!isValidEmail(email)) return err("Invalid email format");

      // Calculate lead score
      const leadScore = calcLeadScore(body);

      // Find or create client
      const { data: existing } = await admin.from("clients").select("id").eq("email", email).limit(1);

      let clientId: string;
      if (existing && existing.length > 0) {
        clientId = existing[0].id;
        const updatePayload: Record<string, any> = { full_name: name, updated_at: new Date().toISOString() };
        if (phone) updatePayload.phone = phone;
        if (whatsapp) updatePayload.whatsapp = whatsapp;
        if (company) updatePayload.company = company;
        if (city) updatePayload.city = city;
        if (country) updatePayload.country = country;
        if (nationality) updatePayload.nationality = nationality;
        await admin.from("clients").update(updatePayload).eq("id", clientId);
      } else {
        const clientPayload: Record<string, any> = {
          full_name: name,
          email,
          phone: phone || null,
          whatsapp: whatsapp || null,
          company: company || null,
          city: city || null,
          country: country || null,
          nationality: nationality || null,
          client_type: "lead",
          lead_source: source || "website",
          preferred_contact_method: preferred_contact_method || "email",
        };
        clientPayload.profile_completeness = calcCompleteness(clientPayload);
        const { data: newClient, error: clientErr } = await admin.from("clients").insert(clientPayload).select("id").single();
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

      // Determine if this is a membership application
      const isMembership = source === "membership_enrollment" || source === "membership_page";

      let membershipAppId: string | null = null;
      if (isMembership) {
        const { data: app, error: appErr } = await admin.from("membership_applications").insert({
          client_id: clientId,
          full_name: name,
          email,
          phone: phone || null,
          whatsapp: whatsapp || null,
          city: city || null,
          country: country || null,
          nationality: nationality || null,
          company: company || null,
          title: jobTitle || null,
          travel_frequency: travel_frequency || null,
          typical_routes: typical_routes || null,
          passenger_count: passenger_count || null,
          aircraft_category_preference: preferred_aircraft_category || null,
          reason: reason || null,
          invitation_code: invitation_code || null,
          referral_source: referral_source || null,
          preferred_tier: preferred_tier || null,
          terms_accepted: terms_accepted ?? false,
          status: "applied",
          source: source || "membership_page",
        }).select("id").single();
        if (!appErr && app) membershipAppId = app.id;
      }

      // Create flight request (skip for pure membership applications)
      let flightReqId: string | null = null;
      if (departure && departure !== "N/A") {
        const reqPayload: Record<string, any> = {
          client_id: clientId,
          lead_id: lead.id,
          departure: departure || "TBD",
          destination: destination || "TBD",
          date: date || null,
          passengers: passengers ? parseInt(String(passengers)) : 1,
          status: "pending",
          trip_type: trip_type || "one_way",
          return_date: return_date || null,
          preferred_aircraft_category: preferred_aircraft_category || null,
          specific_aircraft: specific_aircraft || aircraft || null,
          helicopter_transfer: helicopter_transfer ?? false,
          concierge_needed: concierge_needed ?? false,
          vip_terminal: vip_terminal ?? false,
          ground_transport: ground_transport ?? false,
          pets: pets ?? false,
          smoking: smoking ?? false,
          catering_request: catering_request || null,
          baggage_notes: baggage_notes || null,
          special_assistance: special_assistance || null,
          special_requests: special_requests || null,
          contact_name: name,
          contact_email: email,
          contact_phone: phone || whatsapp || null,
          company_name: company || null,
          budget_range: budget_range || null,
          is_urgent: is_urgent ?? false,
          preferred_contact_method: preferred_contact_method || "email",
          source: source || "website",
          campaign: campaign || null,
          priority: is_urgent ? "high" : "normal",
          notes: notes || null,
        };
        const { data: flightReq, error: reqErr } = await admin.from("flight_requests").insert(reqPayload).select("id").single();
        if (reqErr) throw reqErr;
        flightReqId = flightReq.id;
      }

      // Send lead notification email
      const notifKey = `lead-notif-${lead.id}`;
      try {
        await admin.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'lead-notification',
            recipientEmail: 'hadi@universaljets.com',
            idempotencyKey: notifKey,
            templateData: {
              name, email, phone: phone || whatsapp || '',
              departure: departure || '', destination: destination || '',
              date: date || '', passengers: passengers || '',
              source: source || 'website',
              aircraft: specific_aircraft || aircraft || preferred_aircraft_category || '',
              notes: notes || '', special_requests: special_requests || '',
              submittedAt: new Date().toISOString(),
            },
          },
        });
      } catch (notifErr) {
        console.error('Lead notification email failed (non-blocking):', notifErr);
      }

      // Send confirmation email to the submitter
      try {
        await admin.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'request-confirmation',
            recipientEmail: email,
            idempotencyKey: `request-confirm-${lead.id}`,
            templateData: {
              name,
              departure: departure || '',
              destination: destination || '',
              date: date || '',
              passengers: passengers || '',
              source: source || 'website',
              aircraft: specific_aircraft || aircraft || preferred_aircraft_category || '',
            },
          },
        });
      } catch (confirmErr) {
        console.error('Confirmation email failed (non-blocking):', confirmErr);
      }

      return json({
        success: true,
        client_id: clientId,
        lead_id: lead.id,
        request_id: flightReqId,
        membership_application_id: membershipAppId,
        lead_score: leadScore,
      });
    }

    // ══════════════════════════════════════════════════════════
    // AUTHENTICATED MEMBER ENDPOINTS
    // ══════════════════════════════════════════════════════════

    if (endpoint === "my-profile" && httpMethod === "GET") {
      if (!userId) return err("Unauthorized", 401);

      const [profile, travel, concierge, routes, docs] = await Promise.all([
        admin.from("profiles").select("*").eq("id", userId).maybeSingle(),
        admin.from("travel_preferences").select("*").eq("user_id", userId).maybeSingle(),
        admin.from("concierge_preferences").select("*").eq("user_id", userId).maybeSingle(),
        admin.from("saved_routes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        admin.from("member_documents").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      const { data: clientData } = await admin.from("clients").select("id").eq("user_id", userId).maybeSingle();
      let requests: any[] = [];
      let trips: any[] = [];
      let invoices: any[] = [];
      let membershipApps: any[] = [];

      if (clientData) {
        const [reqRes, tripRes, memRes] = await Promise.all([
          admin.from("flight_requests").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
          admin.from("trips").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
          admin.from("membership_applications").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
        ]);
        requests = reqRes.data ?? [];
        trips = tripRes.data ?? [];
        membershipApps = memRes.data ?? [];
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
        membership_applications: membershipApps,
        client_id: clientData?.id ?? null,
        roles: userRoles,
      });
    }

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
        return err("Invalid section");
      }
      return json({ success: true });
    }

    // ══════════════════════════════════════════════════════════
    // STAFF / CRM ENDPOINTS
    // ══════════════════════════════════════════════════════════

    if (endpoint === "leads" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const status = queryParams["status"] || null;
      const limit = parseInt(queryParams["limit"] || "50");
      let query = admin.from("leads").select("*, clients(full_name, email, phone, client_type, city, country)").order("created_at", { ascending: false }).limit(limit);
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) throw error;
      return json({ leads: data });
    }

    if (endpoint === "clients" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const limit = parseInt(queryParams["limit"] || "50");
      const search = queryParams["search"] || null;
      let query = admin.from("clients").select("*").order("created_at", { ascending: false }).limit(limit);
      if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return json({ clients: data });
    }

    if (endpoint === "requests" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const status = queryParams["status"] || null;
      const limit = parseInt(queryParams["limit"] || "50");
      let query = admin.from("flight_requests").select("*, clients(full_name, email, phone)").order("created_at", { ascending: false }).limit(limit);
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) throw error;
      return json({ requests: data });
    }

    if (endpoint === "quotes" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const { data, error } = await admin.from("quotes").select("*, flight_requests(departure, destination, clients(full_name))").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ quotes: data });
    }

    if (endpoint === "invoices" && httpMethod === "GET") {
      if (!userRoles.some((r) => ["admin", "finance"].includes(r))) return err("Forbidden", 403);
      const { data, error } = await admin.from("invoices").select("*, contracts(quote_id, status)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ invoices: data });
    }

    if (endpoint === "trips" && httpMethod === "GET") {
      if (!userRoles.some((r) => ["admin", "operations", "sales"].includes(r))) return err("Forbidden", 403);
      const { data, error } = await admin.from("trips").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ trips: data });
    }

    // GET /membership-applications
    if (endpoint === "membership-applications" && httpMethod === "GET") {
      if (!userRoles.some((r) => ["admin", "account_management", "sales"].includes(r))) return err("Forbidden", 403);
      const status = queryParams["status"] || null;
      let query = admin.from("membership_applications").select("*").order("created_at", { ascending: false }).limit(50);
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) throw error;
      return json({ applications: data });
    }

    // POST /update-status — Universal status updater with automations
    if (endpoint === "update-status" && httpMethod === "POST") {
      if (!isStaff) return err("Forbidden", 403);
      const { table, id, status: newStatus, extra } = body;
      const allowed = ["leads", "flight_requests", "quotes", "contracts", "invoices", "trips", "membership_applications"];
      if (!allowed.includes(table)) return err("Invalid table");
      if (!id || !newStatus) return err("id and status required");

      const { error } = await admin.from(table).update({ status: newStatus, updated_at: new Date().toISOString(), ...extra }).eq("id", id);
      if (error) throw error;

      const automations: string[] = [];

      if (table === "leads" && newStatus === "confirmed") {
        const { data: lead } = await admin.from("leads").select("client_id").eq("id", id).single();
        if (lead?.client_id) {
          const { data: req } = await admin.from("flight_requests").select("*").eq("lead_id", id).limit(1).maybeSingle();
          if (req) {
            await admin.from("trips").insert({
              client_id: lead.client_id, departure: req.departure, destination: req.destination,
              date: req.date, aircraft: req.specific_aircraft || req.preferred_aircraft_category, status: "scheduled",
            });
            automations.push("trip_created");
          }
        }
      }

      if (table === "quotes" && newStatus === "accepted") {
        await admin.from("contracts").insert({ quote_id: id, status: "draft" });
        automations.push("contract_draft_created");

        // Auto-create trip from accepted quote
        const { data: acceptedQuote } = await admin.from("quotes").select("request_id, aircraft, price").eq("id", id).single();
        if (acceptedQuote?.request_id) {
          const { data: fr } = await admin.from("flight_requests").select("client_id, departure, destination, date").eq("id", acceptedQuote.request_id).single();
          if (fr) {
            await admin.from("trips").insert({
              client_id: fr.client_id, departure: fr.departure, destination: fr.destination,
              date: fr.date, aircraft: acceptedQuote.aircraft, status: "scheduled",
            });
            automations.push("trip_scheduled");
          }
        }
      }

      if (table === "contracts" && newStatus === "signed") {
        const { data: contract } = await admin.from("contracts").select("quote_id").eq("id", id).single();
        if (contract?.quote_id) {
          const { data: quote } = await admin.from("quotes").select("price").eq("id", contract.quote_id).single();
          if (quote?.price) {
            const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 7);
            await admin.from("invoices").insert({ contract_id: id, amount: quote.price, status: "pending", due_date: dueDate.toISOString() });
            automations.push("invoice_created");
          }
        }
      }

      if (table === "invoices" && newStatus === "paid") {
        const { data: invoice } = await admin.from("invoices").select("contract_id, amount").eq("id", id).single();
        if (invoice?.contract_id) {
          const { data: contract } = await admin.from("contracts").select("quote_id").eq("id", invoice.contract_id).single();
          if (contract?.quote_id) {
            const { data: quote } = await admin.from("quotes").select("request_id").eq("id", contract.quote_id).single();
            if (quote?.request_id) {
              await admin.from("flight_requests").update({ status: "confirmed" }).eq("id", quote.request_id);
              automations.push("request_confirmed");
            }

            // Find client from quote chain
            const { data: qWithClient } = await admin.from("quotes").select("flight_requests(client_id)").eq("id", contract.quote_id).single();
            const clientId = (qWithClient as any)?.flight_requests?.client_id;

            // Auto-create payment record
            await admin.from("payments").insert({
              client_id: clientId || null,
              amount: invoice.amount || 0,
              currency: "USD",
              payment_type: "incoming",
              status: "completed",
              payment_date: new Date().toISOString(),
              related_entity_type: "invoice",
              related_entity_id: id,
              created_by: userId,
              notes: `Auto-generated from invoice ${id.slice(0, 8)}`,
            });
            automations.push("payment_recorded");
          }
        }
      }

      // Membership approved → update client
      if (table === "membership_applications" && newStatus === "approved") {
        const { data: app } = await admin.from("membership_applications").select("client_id").eq("id", id).single();
        if (app?.client_id) {
          await admin.from("clients").update({ client_type: "member", member_status: "active", membership_tier: "founder_circle" }).eq("id", app.client_id);
          automations.push("client_upgraded_to_member");
        }
      }

      return json({ success: true, automations });
    }

    if (endpoint === "create-quote" && httpMethod === "POST") {
      if (!userRoles.some((r) => ["admin", "sales", "finance"].includes(r))) return err("Forbidden", 403);
      const { request_id, price, aircraft, operator, valid_days } = body;
      if (!request_id || !price) return err("request_id and price required");
      const validUntil = new Date(); validUntil.setDate(validUntil.getDate() + (valid_days || 7));
      const { data, error } = await admin.from("quotes").insert({
        request_id, price, aircraft: aircraft || null, operator: operator || null,
        valid_until: validUntil.toISOString(), status: "draft", created_by: userId,
      }).select("id").single();
      if (error) throw error;
      await admin.from("flight_requests").update({ status: "quoted" }).eq("id", request_id);
      return json({ success: true, quote_id: data.id });
    }

    // POST /create-client — Staff manual client creation with validation
    if (endpoint === "create-client" && httpMethod === "POST") {
      if (!isStaff) return err("Forbidden", 403);
      const { full_name, email, phone, client_type, country, city, preferred_contact_method, lead_source, assigned_to: owner } = body;
      if (!full_name) return err("Full name is required");
      if (!email && !phone) return err("Email or phone is required");
      if (!lead_source) return err("Lead source is required");

      // Duplicate check
      if (email) {
        const { data: dup } = await admin.from("clients").select("id").eq("email", email).limit(1);
        if (dup && dup.length > 0) return err("A client with this email already exists");
      }

      const clientPayload = { ...body, assigned_to: owner || userId };
      clientPayload.profile_completeness = calcCompleteness(clientPayload);
      const { data, error } = await admin.from("clients").insert(clientPayload).select("id").single();
      if (error) throw error;
      return json({ success: true, client_id: data.id });
    }

    if (endpoint === "dashboard-stats" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const [clients, leads, requests, quotes, invoices, trips, memApps] = await Promise.all([
        admin.from("clients").select("*", { count: "exact", head: true }),
        admin.from("leads").select("*", { count: "exact", head: true }),
        admin.from("flight_requests").select("*", { count: "exact", head: true }),
        admin.from("quotes").select("*", { count: "exact", head: true }),
        admin.from("invoices").select("*", { count: "exact", head: true }),
        admin.from("trips").select("*", { count: "exact", head: true }),
        admin.from("membership_applications").select("*", { count: "exact", head: true }),
      ]);
      return json({
        clients: clients.count ?? 0, leads: leads.count ?? 0, requests: requests.count ?? 0,
        quotes: quotes.count ?? 0, invoices: invoices.count ?? 0, trips: trips.count ?? 0,
        membership_applications: memApps.count ?? 0,
      });
    }

    if (endpoint === "client" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);
      const clientId = queryParams["id"];
      if (!clientId) return err("Client ID required");

      // Role-based field filtering
      const [client, leads, requests, quotes, trips, memApps] = await Promise.all([
        admin.from("clients").select("*").eq("id", clientId).single(),
        admin.from("leads").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        admin.from("flight_requests").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        admin.from("quotes").select("*, flight_requests!inner(client_id)").eq("flight_requests.client_id", clientId).order("created_at", { ascending: false }),
        admin.from("trips").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        admin.from("membership_applications").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
      ]);

      if (client.error) throw client.error;

      // Get travel prefs if client has user_id
      let travelPrefs = null;
      if (client.data?.user_id) {
        const { data } = await admin.from("travel_preferences").select("*").eq("user_id", client.data.user_id).maybeSingle();
        travelPrefs = data;
      }

      return json({
        client: client.data,
        leads: leads.data ?? [],
        requests: requests.data ?? [],
        quotes: quotes.data ?? [],
        trips: trips.data ?? [],
        membership_applications: memApps.data ?? [],
        travel_preferences: travelPrefs,
      });
    }

    // ══════════════════════════════════════════════════════════
    // ANALYTICS: GET /dashboard-analytics — Charts/conversion data
    // ══════════════════════════════════════════════════════════
    if (endpoint === "dashboard-analytics" && httpMethod === "GET") {
      if (!isStaff) return err("Forbidden", 403);

      // Fetch all core data for analytics
      const [leadsRes, requestsRes, quotesRes, invoicesRes, tripsRes, paymentsRes] = await Promise.all([
        admin.from("leads").select("status, created_at, source"),
        admin.from("flight_requests").select("status, created_at"),
        admin.from("quotes").select("status, price, created_at"),
        admin.from("invoices").select("status, amount, created_at, due_date"),
        admin.from("trips").select("status, created_at"),
        admin.from("payments").select("amount, status, payment_type, payment_date, created_at"),
      ]);

      const leads = leadsRes.data ?? [];
      const requests = requestsRes.data ?? [];
      const quotes = quotesRes.data ?? [];
      const invoices = invoicesRes.data ?? [];
      const trips = tripsRes.data ?? [];
      const payments = paymentsRes.data ?? [];

      // Conversion funnel
      const totalLeads = leads.length;
      const contactedLeads = leads.filter(l => l.status !== "new").length;
      const quotedLeads = leads.filter(l => ["quote_sent", "negotiation", "confirmed"].includes(l.status)).length;
      const confirmedLeads = leads.filter(l => l.status === "confirmed").length;
      const lostLeads = leads.filter(l => l.status === "lost").length;

      // Revenue
      const totalQuoteValue = quotes.reduce((s, q) => s + Number(q.price || 0), 0);
      const acceptedQuoteValue = quotes.filter(q => q.status === "accepted").reduce((s, q) => s + Number(q.price || 0), 0);
      const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
      const totalCollected = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount || 0), 0);
      const totalPending = invoices.filter(i => i.status === "pending").reduce((s, i) => s + Number(i.amount || 0), 0);
      const overdueInvoices = invoices.filter(i => i.status === "pending" && i.due_date && new Date(i.due_date) < new Date()).length;

      // Monthly revenue (last 6 months)
      const now = new Date();
      const monthlyRevenue: { month: string; invoiced: number; collected: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const monthLabel = d.toLocaleString("en", { month: "short", year: "2-digit" });
        const monthInvoices = invoices.filter(inv => inv.created_at?.startsWith(monthKey));
        monthlyRevenue.push({
          month: monthLabel,
          invoiced: monthInvoices.reduce((s, inv) => s + Number(inv.amount || 0), 0),
          collected: monthInvoices.filter(inv => inv.status === "paid").reduce((s, inv) => s + Number(inv.amount || 0), 0),
        });
      }

      // Lead sources
      const sourceCounts: Record<string, number> = {};
      leads.forEach(l => { const s = l.source || "unknown"; sourceCounts[s] = (sourceCounts[s] || 0) + 1; });

      // Avg deal size
      const acceptedQuotes = quotes.filter(q => q.status === "accepted" && q.price);
      const avgDealSize = acceptedQuotes.length > 0 ? acceptedQuotes.reduce((s, q) => s + Number(q.price), 0) / acceptedQuotes.length : 0;

      return json({
        funnel: { totalLeads, contactedLeads, quotedLeads, confirmedLeads, lostLeads },
        revenue: { totalQuoteValue, acceptedQuoteValue, totalInvoiced, totalCollected, totalPending, overdueInvoices },
        monthlyRevenue,
        leadSources: Object.entries(sourceCounts).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
        avgDealSize: Math.round(avgDealSize),
        conversionRate: totalLeads > 0 ? Math.round((confirmedLeads / totalLeads) * 100) : 0,
        totals: { leads: totalLeads, requests: requests.length, quotes: quotes.length, invoices: invoices.length, trips: trips.length },
      });
    }

    // ══════════════════════════════════════════════════════════
    // POST /add-note — Add note to client activity log
    // ══════════════════════════════════════════════════════════
    if (endpoint === "add-note" && httpMethod === "POST") {
      if (!isStaff) return err("Forbidden", 403);
      const { client_id, note, note_type } = body;
      if (!client_id || !note) return err("client_id and note required");

      const { error } = await admin.from("activity_log").insert({
        entity_type: "client",
        entity_id: client_id,
        action: note_type || "note",
        notes: note,
        action_by: userId,
        department: userRoles[0] || "sales",
      });
      if (error) throw error;
      return json({ success: true });
    }

    return err("Unknown endpoint: " + endpoint, 404);
  } catch (e: any) {
    return err(e.message || "Internal error", 500);
  }
});
