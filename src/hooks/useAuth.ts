import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/** All assignable roles in the Universal Jets platform. */
export type AppRole = "admin" | "sales" | "operations" | "finance" | "account_management" | "hr" | "client" | "business_development";

interface AuthState {
  /** Currently authenticated user, or null if signed out. */
  user: User | null;
  /** Active Supabase session, or null. */
  session: Session | null;
  /** Roles assigned to the user via the `user_roles` table. */
  roles: AppRole[];
  /** True while the initial auth state is being resolved. */
  loading: boolean;
}

/**
 * Central authentication hook for the Universal Jets platform.
 *
 * Responsibilities:
 * - Subscribes to auth state changes (login, logout, token refresh).
 * - Fetches the user's roles from the `user_roles` table.
 * - Exposes `hasRole()` for role-based UI gating and `signOut()`.
 *
 * @example
 * ```tsx
 * const { user, roles, hasRole, signOut, loading } = useAuth();
 * if (hasRole("admin")) { ... }
 * ```
 */
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        const roles = user ? await fetchRoles(user.id) : [];
        setState({ user, session, roles, loading: false });
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
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
