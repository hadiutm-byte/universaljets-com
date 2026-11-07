-- Quote links that work for clients who have no account.
--
-- A quote link looked like /quote/<id>. The page read public.quotes directly,
-- which row-level security allows only for staff and for signed-in clients,
-- so a client opening the link from an email saw "Quote Not Found", and no
-- policy let a client accept or decline. Each quote now carries a random
-- public_token; the link becomes /quote/<id>?token=<public_token>, and two
-- functions do the reading and the responding on the client's behalf.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS public_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  ADD COLUMN IF NOT EXISTS responded_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS quotes_public_token_idx ON public.quotes (public_token);

-- What a client may see: the quote and the trip it answers. Not the operator,
-- not internal notes, not who created it.
CREATE OR REPLACE FUNCTION public.get_quote_by_token(p_token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', q.id,
    'aircraft', q.aircraft,
    'price', q.price,
    'valid_until', q.valid_until,
    'status', q.status,
    'created_at', q.created_at,
    'responded_at', q.responded_at,
    'flight_requests', jsonb_build_object(
      'departure', fr.departure,
      'destination', fr.destination,
      'date', fr.date,
      'passengers', fr.passengers,
      'trip_type', fr.trip_type,
      'preferred_aircraft_category', fr.preferred_aircraft_category,
      'contact_name', fr.contact_name
    )
  )
  FROM public.quotes q
  LEFT JOIN public.flight_requests fr ON fr.id = q.request_id
  WHERE length(p_token) >= 32 AND q.public_token = p_token;
$$;

-- Accept or decline through the link. Only a sent quote that is still valid
-- can be answered, and only once. The answer is written to the activity log.
CREATE OR REPLACE FUNCTION public.respond_to_quote(p_token text, p_decision text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote public.quotes%ROWTYPE;
  v_status public.quote_status;
BEGIN
  IF p_decision NOT IN ('accepted', 'rejected') THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_decision');
  END IF;

  SELECT * INTO v_quote FROM public.quotes
  WHERE length(p_token) >= 32 AND public_token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;
  IF v_quote.status IN ('accepted', 'rejected') THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_answered', 'status', v_quote.status);
  END IF;
  IF v_quote.status = 'expired' OR (v_quote.valid_until IS NOT NULL AND v_quote.valid_until < now()) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'expired');
  END IF;

  v_status := p_decision::public.quote_status;
  UPDATE public.quotes SET status = v_status, responded_at = now() WHERE id = v_quote.id;

  INSERT INTO public.activity_log (entity_type, entity_id, action, action_by, department, previous_value, new_value, metadata)
  VALUES ('quote', v_quote.id, 'quote_' || p_decision, NULL, 'sales',
          jsonb_build_object('status', v_quote.status), jsonb_build_object('status', v_status),
          jsonb_build_object('source', 'client_link'));

  RETURN jsonb_build_object('ok', true, 'status', v_status);
END;
$$;

REVOKE ALL ON FUNCTION public.get_quote_by_token(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.respond_to_quote(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_quote_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.respond_to_quote(text, text) TO anon, authenticated;
