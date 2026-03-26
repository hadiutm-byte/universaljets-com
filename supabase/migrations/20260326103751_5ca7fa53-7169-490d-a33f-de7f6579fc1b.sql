-- Remove anonymous INSERT on candidates — require authentication
DROP POLICY IF EXISTS "Anon can insert candidates" ON public.candidates;
CREATE POLICY "Authenticated users can insert candidates"
ON public.candidates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Remove anonymous INSERT on membership_applications — require authentication
DROP POLICY IF EXISTS "Anon can insert membership applications" ON public.membership_applications;
CREATE POLICY "Authenticated users can insert membership applications"
ON public.membership_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);