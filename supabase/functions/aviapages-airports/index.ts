import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

// In-memory cache (persists across warm invocations)
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchWithRetry(url: string, headers: Record<string, string>, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { headers });
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '', 10);
      const waitMs = (retryAfter && !isNaN(retryAfter) ? retryAfter : (i + 1) * 3) * 1000;
      console.warn(`Rate limited, waiting ${waitMs}ms before retry ${i + 1}/${retries}`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }
    return response;
  }
  // Final attempt
  return fetch(url, { headers });
}

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
    const query = (url.searchParams.get('q') || '').trim().toLowerCase();

    if (query.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check cache
    const cached = cache.get(query);
    if (cached && cached.expiry > Date.now()) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    const params = new URLSearchParams({
      search: query,
      page_size: '10',
    });

    const response = await fetchWithRetry(
      `${AVIAPAGES_BASE}/api/airports/?${params.toString()}`,
      {
        'Authorization': `Token ${apiKey}`,
        'Accept': 'application/json',
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

    const responseData = { results };

    // Store in cache
    cache.set(query, { data: responseData, expiry: Date.now() + CACHE_TTL_MS });

    // Evict old entries if cache gets large
    if (cache.size > 200) {
      const now = Date.now();
      for (const [k, v] of cache) {
        if (v.expiry < now) cache.delete(k);
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
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
