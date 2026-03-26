import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated and is an admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with caller's JWT to verify identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to check if caller is admin (bypasses RLS)
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = callerRoles?.some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, user_id, role, role_id } = body;

    if (action === "assign") {
      if (!user_id || !role) {
        return new Response(JSON.stringify({ error: "user_id and role are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate role is a valid app_role
      const validRoles = ["admin", "sales", "operations", "finance", "account_management", "client", "hr", "business_development"];
      if (!validRoles.includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await admin
        .from("user_roles")
        .insert({ user_id, role })
        .select("id")
        .single();

      if (error) {
        if (error.code === "23505") {
          return new Response(JSON.stringify({ error: "User already has this role" }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw error;
      }

      return new Response(JSON.stringify({ success: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "remove") {
      if (!role_id) {
        return new Response(JSON.stringify({ error: "role_id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent removing the last admin role
      const { data: targetRole } = await admin
        .from("user_roles")
        .select("user_id, role")
        .eq("id", role_id)
        .single();

      if (targetRole?.role === "admin") {
        const { count } = await admin
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");

        if ((count ?? 0) <= 1) {
          return new Response(JSON.stringify({ error: "Cannot remove the last admin role" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("id", role_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use 'assign' or 'remove'." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin roles error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
