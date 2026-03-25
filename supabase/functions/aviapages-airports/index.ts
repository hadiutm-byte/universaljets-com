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
    const query = url.searchParams.get('q') || '';

    if (query.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      search: query,
      page_size: '10',
    });

    const response = await fetch(
      `${AVIAPAGES_BASE}/api/airports/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aviapages airports API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    const results = (data.results || []).map((airport: any) => ({
      id: airport.id || Math.random(),
      name: airport.name || '',
      iata: airport.iata || '',
      icao: airport.icao || '',
      city: airport.city?.name || airport.city || '',
      country: airport.country?.name || airport.city?.country?.name || '',
      lat: airport.latitude ?? airport.lat ?? null,
      lng: airport.longitude ?? airport.lng ?? airport.lon ?? null,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Airport search error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
