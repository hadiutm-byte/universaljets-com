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
    const query = url.searchParams.get('q') || '';
    const cityId = url.searchParams.get('id') || '';

    // If fetching a specific city by ID
    if (cityId) {
      const response = await fetch(`${AVIAPAGES_BASE}/api/cities/${cityId}/`, {
        headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`Cities API error [${response.status}]`);
      const data = await response.json();
      return new Response(JSON.stringify({ city: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search cities
    if (query.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({ search: query, page_size: '10' });
    const response = await fetch(`${AVIAPAGES_BASE}/api/cities/?${params.toString()}`, {
      headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error(`Cities API error [${response.status}]`);
    const data = await response.json();

    const results = (data.results || []).map((city: any) => ({
      id: city.id,
      name: city.name || '',
      country: city.country?.name || '',
      country_code: city.country?.code || '',
      lat: city.latitude ?? null,
      lng: city.longitude ?? null,
      timezone: city.timezone || null,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Cities search error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
