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

    const searchBody: Record<string, unknown> = {
      dep_airport: { icao: from_icao },
      arr_airport: { icao: to_icao },
    };

    if (date) searchBody.date = date;
    if (passengers) searchBody.pax = parseInt(passengers, 10);

    console.log(`[charter-search] Searching ${from_icao} → ${to_icao}, pax=${passengers || 'any'}`);

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
      console.error(`[charter-search] API error [${response.status}]: ${errorText}`);
      return new Response(JSON.stringify({ results: [], error: `API error ${response.status}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`[charter-search] Got ${data.companies?.length || 0} companies`);

    // The API returns { companies: [...] } where each company has aircraft array
    const companies = data.companies || [];
    
    // Flatten into individual aircraft offers
    const results = [];
    for (const company of companies) {
      for (const aircraft of (company.aircraft || [])) {
        // Get the best exterior image
        const exteriorImage = aircraft.images?.find((img: any) => img.image_type === 'exterior')?.url || null;
        const cabinImage = aircraft.images?.find((img: any) => img.image_type === 'cabin')?.url || null;
        const notailImage = aircraft.images?.find((img: any) => img.image_type === 'notail')?.url || null;
        const allImages = (aircraft.images || []).map((img: any) => ({
          url: img.url,
          type: img.image_type,
          position: img.position,
        }));

        results.push({
          id: aircraft.id,
          aircraft_type: aircraft.ac_type || 'Private Jet',
          year_of_production: aircraft.year_of_production || null,
          max_passengers: aircraft.max_passengers || null,
          range_km: aircraft.range || null,
          speed_kmh: aircraft.speed || null,
          images: {
            exterior: exteriorImage,
            cabin: cabinImage,
            notail: notailImage,
            all: allImages,
          },
          operator: {
            id: company.id,
            name: company.name || '',
            city: company.city?.name || '',
            country: company.country?.name || '',
            logo_url: company.logo_url || null,
            certified: company.aviapages_certified || false,
            avg_response_time: company.company_extenion?.avg_response_time || null,
            avg_response_rate: company.company_extenion?.avg_response_rate || null,
          },
        });
      }
    }

    console.log(`[charter-search] Returning ${results.length} aircraft options`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Charter search error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, results: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
