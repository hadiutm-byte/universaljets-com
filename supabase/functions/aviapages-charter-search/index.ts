import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

/** Strip registration codes like "(HA-JEX)" or standalone "N123AB" from aircraft names */
function stripReg(name: string): string {
  return name
    .replace(/\s*\(([A-Z0-9]{1,5}-[A-Z0-9]{2,6}|N\d{1,5}[A-Z]{0,2})\)\s*/gi, ' ')
    .replace(/\b([A-Z0-9]{1,5}-[A-Z0-9]{2,6}|N\d{1,5}[A-Z]{0,2})\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Private Jet';
}

/** Coerce to finite number or null */
function toFiniteNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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

    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(
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
      if (response.status === 429) {
        const wait = Math.pow(2, attempt) * 2;
        console.log(`[charter-search] Rate limited, retrying in ${wait}s (attempt ${attempt + 1}/3)`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'No response';
      console.error(`[charter-search] API error [${response?.status}]: ${errorText}`);
      return new Response(JSON.stringify({ results: [], error: `API error ${response?.status}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`[charter-search] Got ${data.companies?.length || 0} companies`);

    const companies = data.companies || [];
    
    // Flatten into individual aircraft offers, extracting ALL useful B2C data
    const results = [];
    for (const company of companies) {
      // Log first aircraft's raw price fields for debugging
      if (results.length === 0 && (company.aircraft || []).length > 0) {
        const sample = (company.aircraft || [])[0];
        console.log(`[charter-search] Sample price fields:`, JSON.stringify({
          price: sample.price, charter_price: sample.charter_price,
          price_total: sample.price_total, total_price: sample.total_price,
          amount: sample.amount, price_unit: sample.price_unit,
          pricing_type: sample.pricing_type,
          currency_code: sample.currency_code, currency: sample.currency,
          price_currency: sample.price_currency,
          company_currency: company.currency,
        }));
      }
      for (const aircraft of (company.aircraft || [])) {
        // ── Images: collect all, filter out any with tail numbers ──
        const allImages: { url: string; type: string; position: number }[] = [];
        let floorPlanUrl: string | null = null;

        for (const img of (aircraft.images || [])) {
          const imgType = (img.image_type || img.type || '').toLowerCase();
          // Skip images that might expose tail numbers
          if (imgType === 'tail' || imgType === 'registration') continue;
          
          const imgUrl = img.url || (img.media && typeof img.media === 'object' ? img.media.path : null);
          if (imgUrl) {
            allImages.push({
              url: imgUrl,
              type: imgType || 'exterior',
              position: img.position ?? 0,
            });
          }
          if (imgType === 'floor_plan' || imgType === 'floorplan' || imgType === 'layout') {
            floorPlanUrl = imgUrl || null;
          }
        }

        // If notail images exist, drop all exterior images (they show painted registrations)
        const hasNotail = allImages.some(i => i.type === 'notail');
        const filteredImages = hasNotail
          ? allImages.filter(i => i.type !== 'exterior')
          : allImages;

        const notailImage = filteredImages.find(i => i.type === 'notail')?.url || null;
        const exteriorImage = filteredImages.find(i => i.type === 'exterior')?.url || null;
        const cabinImage = filteredImages.find(i => i.type === 'cabin')?.url || null;

        // ── Cabin dimensions ──
        const cabinHeight = aircraft.cabin_height ?? aircraft.cabin_height_m ?? null;
        const cabinWidth = aircraft.cabin_width ?? aircraft.cabin_width_m ?? null;
        const cabinLength = aircraft.cabin_length ?? aircraft.cabin_length_m ?? null;
        const luggageVolume = aircraft.luggage_volume ?? aircraft.luggage_volume_m3 ?? null;

        // ── Amenities / features ──
        const amenities: string[] = [];
        if (aircraft.wifi || aircraft.has_wifi) amenities.push('Wi-Fi');
        if (aircraft.lavatory || aircraft.has_lavatory) amenities.push('Lavatory');
        if (aircraft.galley || aircraft.has_galley) amenities.push('Galley');
        if (aircraft.shower || aircraft.has_shower) amenities.push('Shower');
        if (aircraft.entertainment || aircraft.has_entertainment) amenities.push('Entertainment');
        if (aircraft.satellite_phone || aircraft.has_satphone) amenities.push('Satellite Phone');
        if (aircraft.bed || aircraft.has_bed || aircraft.sleeping_places) amenities.push('Sleeping');
        if (aircraft.baggage_compartment) amenities.push('Baggage Hold');

        // ── Pricing — defensive multi-field extraction ──
        const price =
          toFiniteNum(aircraft.price) ??
          toFiniteNum(aircraft.charter_price) ??
          toFiniteNum(aircraft.price_total) ??
          toFiniteNum(aircraft.total_price) ??
          toFiniteNum(aircraft.amount) ??
          null;

        const priceCurrency =
          aircraft.currency_code ||
          aircraft.currency ||
          aircraft.price_currency ||
          company.currency ||
          'USD';

        const priceUnit =
          aircraft.price_unit ||
          aircraft.pricing_type ||
          null;  // Don't assume 'total' — API may return per-hour prices

        results.push({
          id: aircraft.id,
          aircraft_type: stripReg(aircraft.ac_type || aircraft.aircraft_type || 'Private Jet'),
          year_of_production: aircraft.year_of_production || aircraft.yom || null,
          max_passengers: aircraft.max_passengers || aircraft.pax_maximum || null,
          range_km: aircraft.range || aircraft.range_maximum || null,
          speed_kmh: aircraft.speed || aircraft.cruise_speed || null,
          // Cabin details
          cabin_height_m: cabinHeight,
          cabin_width_m: cabinWidth,
          cabin_length_m: cabinLength,
          luggage_volume_m3: luggageVolume,
          sleeping_places: aircraft.sleeping_places || null,
          // Amenities
          amenities,
          // Pricing (B2C safe — no internal cost data)
          price: price,
          price_currency: priceCurrency,
          price_unit: priceUnit,
          estimated_flight_time_min: toFiniteNum(aircraft.flight_time) ?? toFiniteNum(aircraft.estimated_flight_time),
          // Images — NO tail number images; notail replaces exterior
          images: {
            exterior: notailImage || exteriorImage,
            cabin: cabinImage,
            floor_plan: floorPlanUrl,
            all: filteredImages,
          },
          // Operator — strip identity for B2C privacy; only expose certification status
          operator: {
            id: 0,
            name: '',
            city: '',
            country: '',
            logo_url: null,
            certified: company.aviapages_certified || false,
            avg_response_time: null,
            avg_response_rate: null,
          },
          // Category / class
          aircraft_class: aircraft.aircraft_class?.name || aircraft.class_name || null,
          manufacturer: aircraft.manufacturer?.name || aircraft.manufacturer || null,
          engine_type: aircraft.engine_type || null,
          engine_count: aircraft.engine_count || null,
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
