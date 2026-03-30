
-- 1. Remove activity_log from Realtime publication
-- Use DO block to handle case where table may not be in publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.activity_log;
EXCEPTION WHEN OTHERS THEN
  NULL; -- table wasn't in publication, ignore
END;
$$;

-- 2. Add UPDATE policy on member-documents storage bucket scoped to file owner
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Fix profiles UPDATE privilege escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE OR REPLACE FUNCTION public.check_profile_update_safe()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (
    OLD.membership_tier IS DISTINCT FROM NEW.membership_tier OR
    OLD.available_credit IS DISTINCT FROM NEW.available_credit OR
    OLD.member_id IS DISTINCT FROM NEW.member_id OR
    OLD.invitation_status IS DISTINCT FROM NEW.invitation_status OR
    OLD.referrals_sent IS DISTINCT FROM NEW.referrals_sent
  ) AND NOT has_role(OLD.id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Cannot modify protected profile fields';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_safe_profile_update ON public.profiles;
CREATE TRIGGER enforce_safe_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_update_safe();

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
