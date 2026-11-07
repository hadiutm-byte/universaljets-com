-- Shared rate-limit counters for the public edge functions.
--
-- Each bucket is "<function>:<caller ip>". consume_rate_limit() increments the
-- bucket inside its window and returns the hit count, so the caller can compare
-- it with its limit. Rows older than a day are swept opportunistically.
--
-- Only the service role may use this: the table has row-level security with no
-- policies, and execute on the function is revoked from anon and authenticated.

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  bucket text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 0
);

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hits integer;
BEGIN
  INSERT INTO public.rate_limit_buckets (bucket, window_start, hits)
  VALUES (p_bucket, now(), 1)
  ON CONFLICT (bucket) DO UPDATE
    SET hits = CASE
          WHEN public.rate_limit_buckets.window_start < now() - make_interval(secs => p_window_seconds) THEN 1
          ELSE public.rate_limit_buckets.hits + 1
        END,
        window_start = CASE
          WHEN public.rate_limit_buckets.window_start < now() - make_interval(secs => p_window_seconds) THEN now()
          ELSE public.rate_limit_buckets.window_start
        END
  RETURNING hits INTO v_hits;

  -- About one call in a hundred sweeps stale buckets.
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_buckets WHERE window_start < now() - interval '1 day';
  END IF;

  RETURN v_hits;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;
