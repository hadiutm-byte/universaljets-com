import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (date) {
      searchBody.date = date;
    }
    if (passengers) {
      searchBody.pax = parseInt(passengers, 10);
    }

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

    return new Response(JSON.stringify(data), {
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
