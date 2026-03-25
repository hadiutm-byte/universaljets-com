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
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const region = url.searchParams.get('region') || '';

    const params = new URLSearchParams({
      page,
      page_size: limit,
    });

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

    const apiUrl = `${AVIAPAGES_BASE}/api/availabilities/?${params.toString()}`;
    console.log(`[empty-legs] Requesting: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log(`[empty-legs] Status: ${response.status}`);
    console.log(`[empty-legs] Response preview: ${responseText.substring(0, 500)}`);

    if (!response.ok) {
      console.error(`[empty-legs] API error [${response.status}]: ${responseText}`);
      // Return empty list instead of crashing
      return new Response(JSON.stringify({ count: 0, results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);

    const normalized = {
      count: data.count || 0,
      results: (data.results || []).map((leg: any) => ({
        id: leg.id || leg.availability_id || Math.random(),
        aircraft_type: leg.aircraft_type || leg.aircraft?.type || 'Private Jet',
        company: leg.company || leg.operator?.name || '',
        from_date: leg.from_date || leg.from_date_utc || '',
        to_date: leg.to_date || leg.to_date_utc || '',
        price: leg.price ?? null,
        currency: leg.currency_code || leg.currency || 'USD',
        comment: leg.comment || '',
        departure: leg.dep_airport ? {
          id: leg.dep_airport.id || 0,
          name: leg.dep_airport.name || '',
          iata: leg.dep_airport.iata || '',
          icao: leg.dep_airport.icao || '',
          city: leg.dep_airport.city?.name || leg.dep_airport.city || '',
          country: leg.dep_airport.city?.country?.name || leg.dep_airport.country || '',
          lat: leg.dep_airport.latitude ?? leg.dep_airport.lat ?? null,
          lng: leg.dep_airport.longitude ?? leg.dep_airport.lng ?? null,
        } : null,
        arrival: leg.arr_airport ? {
          id: leg.arr_airport.id || 0,
          name: leg.arr_airport.name || '',
          iata: leg.arr_airport.iata || '',
          icao: leg.arr_airport.icao || '',
          city: leg.arr_airport.city?.name || leg.arr_airport.city || '',
          country: leg.arr_airport.city?.country?.name || leg.arr_airport.country || '',
          lat: leg.arr_airport.latitude ?? leg.arr_airport.lat ?? null,
          lng: leg.arr_airport.longitude ?? leg.arr_airport.lng ?? null,
        } : null,
      })),
    };

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[empty-legs] Error:', error);
    // Return empty list on any error so the UI doesn't break
    return new Response(JSON.stringify({ count: 0, results: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
