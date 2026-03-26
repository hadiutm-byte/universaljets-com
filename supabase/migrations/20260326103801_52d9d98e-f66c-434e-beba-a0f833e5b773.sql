-- Tighten candidates INSERT — no WITH CHECK (true)
DROP POLICY IF EXISTS "Authenticated users can insert candidates" ON public.candidates;
CREATE POLICY "Authenticated users can insert candidates"
ON public.candidates
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role) OR has_role(auth.uid(), 'hr'::app_role)
);