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
    if (!apiKey) throw new Error('AVIAPAGES_API_KEY not configured');

    const url = new URL(req.url);
    const airportIcao = url.searchParams.get('airport') || '';
    const query = url.searchParams.get('q') || '';

    const params = new URLSearchParams({ page_size: '20' });
    if (airportIcao) params.set('airport__icao', airportIcao);
    if (query) params.set('search', query);

    const response = await fetch(`${AVIAPAGES_BASE}/api/fbos/?${params.toString()}`, {
      headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error(`FBOs API error [${response.status}]`);
    const data = await response.json();

    const results = (data.results || []).map((fbo: any) => ({
      id: fbo.id,
      name: fbo.name || '',
      airport_name: fbo.airport?.name || '',
      airport_icao: fbo.airport?.icao || '',
      airport_iata: fbo.airport?.iata || '',
      city: fbo.airport?.city?.name || '',
      country: fbo.airport?.city?.country?.name || fbo.airport?.country?.name || '',
      services: fbo.services || [],
      phone: fbo.phone || null,
      email: fbo.email || null,
      website: fbo.website || null,
      handling: fbo.handling || null,
      hangar: fbo.hangar || false,
      fuel: fbo.fuel || null,
      vip_lounge: fbo.vip_lounge || false,
      customs: fbo.customs || false,
    }));

    return new Response(JSON.stringify({ results, count: data.count || results.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('FBOs search error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
