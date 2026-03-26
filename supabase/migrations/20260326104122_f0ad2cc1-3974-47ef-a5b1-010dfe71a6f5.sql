-- CRITICAL: Remove ALL policy that allows admin client-side writes to user_roles
-- Replace with read-only policies. All mutations go through edge function.
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Admins can READ all roles (needed for admin panel display)
CREATE POLICY "Admins can read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can still read their own roles (needed for auth)
-- This policy already exists: "Users can view own roles"

-- Tighten flight_requests: ensure no PII leaks to non-staff
-- The existing policies are correct but let's add explicit WITH CHECK to the staff ALL policy
DROP POLICY IF EXISTS "Internal staff can manage flight requests" ON public.flight_requests;
CREATE POLICY "Internal staff can manage flight requests"
ON public.flight_requests
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role) OR has_role(auth.uid(), 'operations'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role) OR has_role(auth.uid(), 'operations'::app_role));