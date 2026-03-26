-- Add explicit INSERT/UPDATE/DELETE policies on user_roles that only allow service_role
-- This makes it crystal clear: no client-side writes, only edge functions with service role

CREATE POLICY "Only service role can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Only service role can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Only service role can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);