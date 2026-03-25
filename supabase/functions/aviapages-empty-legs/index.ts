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

    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const region = url.searchParams.get('region') || '';

    // Build query params for availabilities endpoint
    const params = new URLSearchParams({
      page,
      page_size: limit,
      ordering: '-from_date_utc',
    });

    // Filter by region using country codes
    if (region && region !== 'All') {
      const regionCountries: Record<string, string> = {
        'Europe': 'GB,FR,DE,IT,ES,CH,AT,NL,BE,PT,SE,NO,DK,FI,IE,CZ,PL,GR,RO,HU',
        'Americas': 'US,CA,MX,BR,AR,CO,CL',
        'Middle East': 'AE,SA,QA,BH,OM,KW,JO,LB',
        'Asia': 'SG,HK,JP,KR,IN,TH,MY,ID,CN,PH',
        'Africa': 'ZA,NG,KE,EG,MA,TZ,GH',
      };
      if (regionCountries[region]) {
        params.set('dep_airport_country_iso_in', regionCountries[region]);
      }
    }

    const response = await fetch(
      `${AVIAPAGES_BASE}/api/availabilities/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aviapages API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    // Normalize the response for the frontend
    const normalized = {
      count: data.count || 0,
      results: (data.results || []).map((leg: any) => ({
        id: leg.id || leg.availability_id,
        aircraft_type: leg.aircraft_type || 'Unknown',
        company: leg.company || '',
        from_date: leg.from_date_utc || '',
        to_date: leg.to_date_utc || '',
        price: leg.price || null,
        currency: leg.currency_code || 'USD',
        comment: leg.comment || '',
        departure: leg.dep_airport ? {
          id: leg.dep_airport.id,
          name: leg.dep_airport.name || '',
          iata: leg.dep_airport.iata || '',
          icao: leg.dep_airport.icao || '',
          city: leg.dep_airport.city?.name || '',
          country: leg.dep_airport.city?.country?.name || '',
          lat: leg.dep_airport.latitude || null,
          lng: leg.dep_airport.longitude || null,
        } : null,
        arrival: leg.arr_airport ? {
          id: leg.arr_airport.id,
          name: leg.arr_airport.name || '',
          iata: leg.arr_airport.iata || '',
          icao: leg.arr_airport.icao || '',
          city: leg.arr_airport.city?.name || '',
          country: leg.arr_airport.city?.country?.name || '',
          lat: leg.arr_airport.latitude || null,
          lng: leg.arr_airport.longitude || null,
        } : null,
      })),
    };

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Empty legs error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
