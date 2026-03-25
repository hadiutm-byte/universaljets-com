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

    const body = await req.json();
    const { from_icao, to_icao, date, passengers } = body;

    if (!from_icao || !to_icao) {
      return new Response(JSON.stringify({ error: 'from_icao and to_icao are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchBody: any = {
      dep_airport: { icao: from_icao },
      arr_airport: { icao: to_icao },
    };

    if (date) searchBody.date = date;
    if (passengers) searchBody.pax = parseInt(passengers, 10);

    const response = await fetch(
      `${AVIAPAGES_BASE}/api/charter_searches/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Charter search API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    // Normalize results for frontend
    const results = (data.results || data.offers || (Array.isArray(data) ? data : [])).map((r: any) => ({
      id: r.id || Math.random(),
      aircraft_type: r.aircraft?.type || r.aircraft_type || 'Private Jet',
      aircraft: {
        type: r.aircraft?.type || r.aircraft_type || '',
        name: r.aircraft?.name || r.aircraft_type || 'Private Jet',
        pax: r.aircraft?.pax || r.pax || null,
        range_nm: r.aircraft?.range_nm || null,
      },
      company: r.company || r.operator?.name || '',
      operator: { name: r.operator?.name || r.company || '' },
      price: r.price ?? null,
      currency: r.currency_code || r.currency || 'EUR',
      flight_time: r.flight_time || r.estimated_flight_time || '',
      dep_airport: r.dep_airport ? {
        name: r.dep_airport.name || '',
        city: r.dep_airport.city?.name || r.dep_airport.city || '',
        icao: r.dep_airport.icao || '',
        iata: r.dep_airport.iata || '',
      } : null,
      arr_airport: r.arr_airport ? {
        name: r.arr_airport.name || '',
        city: r.arr_airport.city?.name || r.arr_airport.city || '',
        icao: r.arr_airport.icao || '',
        iata: r.arr_airport.iata || '',
      } : null,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Charter search error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
