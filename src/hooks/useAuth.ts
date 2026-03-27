import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "sales" | "operations" | "finance" | "account_management" | "hr" | "client" | "business_development";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    roles: [],
    loading: true,
  });

  const fetchRoles = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    return (data?.map((r: any) => r.role as AppRole)) ?? [];
  }, []);

  useEffect(() => {
    let resolved = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        resolved = true;
        const user = session?.user ?? null;
        const roles = user ? await fetchRoles(user.id) : [];
        setState({ user, session, roles, loading: false });
      }
    );

    // Fallback: load the current session in case onAuthStateChange doesn't fire
    // immediately (e.g. when there is no active session at all).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (resolved) return; // onAuthStateChange already handled this
      const user = session?.user ?? null;
      const roles = user ? await fetchRoles(user.id) : [];
      setState({ user, session, roles, loading: false });
    });

    return () => subscription.unsubscribe();
  }, [fetchRoles]);

  const hasRole = useCallback(
    (role: AppRole) => state.roles.includes(role),
    [state.roles]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { ...state, hasRole, signOut };
}
