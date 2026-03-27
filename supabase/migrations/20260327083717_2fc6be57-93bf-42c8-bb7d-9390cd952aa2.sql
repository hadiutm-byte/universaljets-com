-- Rewrite has_role to ALWAYS use auth.uid(), completely ignoring the _user_id parameter
-- This eliminates any possibility of impersonation while keeping the function signature
-- compatible with existing RLS policies that call has_role(auth.uid(), 'role')
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;