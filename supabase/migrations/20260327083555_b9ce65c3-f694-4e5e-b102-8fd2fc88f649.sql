-- 1. Rewrite has_role to remove admin bypass — always enforce _user_id = auth.uid()
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND _user_id = auth.uid()
      AND role = _role
  )
$$;

-- 2. Add explicit SELECT policy for outreach_templates restricted to admin, sales, and business_development
CREATE POLICY "BD can view outreach templates"
ON public.outreach_templates
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'business_development'::app_role));