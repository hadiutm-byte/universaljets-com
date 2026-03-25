import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('AVIAPAGES_API_KEY');
    if (!apiKey) {
      throw new Error('AVIAPAGES_API_KEY not configured');
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const classId = url.searchParams.get('class_id') || '';
    const pageSize = url.searchParams.get('page_size') || '20';

    const params = new URLSearchParams({ page_size: pageSize });
    if (search) params.set('search', search);
    if (classId) params.set('aircraft_class', classId);

    const apiUrl = `${AVIAPAGES_BASE}/api/aircraft_types/?${params.toString()}`;
    console.log(`[aircraft-types] Requesting: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aircraft types API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    const results = (data.results || []).map((at: any) => ({
      id: at.id,
      name: at.name,
      icao: at.icao,
      class_name: at.class_name || at.aircraft_class?.name || '',
      class_id: at.aircraft_class?.id || null,
      manufacturer: at.manufacturer_name || at.aircraft_type_global_family?.name || '',
      range_km: at.range_maximum || null,
      max_pax: at.pax_maximum || null,
      speed_kmh: at.speed_typical || null,
      altitude_m: at.altitude || null,
      cabin_height_m: at.cabin_height || null,
      cabin_length_m: at.cabin_length || null,
      cabin_width_m: at.cabin_width || null,
      luggage_volume_m3: at.luggage_volume || null,
      engine_type: at.engine_type?.value || null,
      engine_count: at.engine_count || null,
      image_url: at.images?.[0]?.media?.path || null,
      description: at.aircraft_type_extension?.description || null,
    }));

    return new Response(JSON.stringify({ count: data.count || 0, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Aircraft types error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
