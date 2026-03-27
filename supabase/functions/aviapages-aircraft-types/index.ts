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
    const search = url.searchParams.get('search') || '';
    const classId = url.searchParams.get('class_id') || '';
    const pageSize = url.searchParams.get('page_size') || '50';
    const page = url.searchParams.get('page') || '1';
    const slug = url.searchParams.get('slug') || '';

    // Single aircraft lookup by slug (name-based)
    if (slug) {
      // Try multiple search strategies to find the aircraft
      const searchVariants = [
        slug.replace(/-/g, ' '),
        // Try just the main name parts (first 2-3 words) for better API matching
        slug.replace(/-/g, ' ').split(' ').slice(0, 3).join(' '),
        slug.replace(/-/g, ' ').split(' ').slice(0, 2).join(' '),
      ];

      let match: any = null;

      for (const searchName of searchVariants) {
        const params = new URLSearchParams({ page_size: '20', search: searchName });
        const apiUrl = `${AVIAPAGES_BASE}/api/aircraft_types/?${params.toString()}`;
        console.log(`[aircraft-types] Slug lookup: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
        });

        if (!response.ok) continue;

        const data = await response.json();
        match = (data.results || []).find((at: any) => {
          const nameSlug = (at.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return nameSlug === slug;
        });

        if (match) break;
      }

      if (!match) {
        return new Response(JSON.stringify({ error: 'Aircraft not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = mapAircraftType(match);
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // List endpoint
    const params = new URLSearchParams({ page_size: pageSize, page });
    if (search) params.set('search', search);
    if (classId) params.set('aircraft_class', classId);

    const apiUrl = `${AVIAPAGES_BASE}/api/aircraft_types/?${params.toString()}`;
    console.log(`[aircraft-types] Requesting: ${apiUrl}`);

    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(apiUrl, {
        headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
      });
      if (response.status === 429) {
        const wait = Math.pow(2, attempt) * 2;
        console.log(`[aircraft-types] Rate limited, retrying in ${wait}s (attempt ${attempt + 1}/3)`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'No response';
      throw new Error(`Aircraft types API error [${response?.status}]: ${errorText}`);
    }

    const data = await response.json();
    const results = (data.results || []).map(mapAircraftType);

    return new Response(JSON.stringify({
      count: data.count || 0,
      next: data.next ? true : false,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Aircraft types error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapAircraftType(at: any) {
  // Collect all images, filter tail/registration
  const allImages: { url: string; type: string; position: number }[] = [];
  let floorPlanUrl: string | null = null;

  for (const img of (at.images || [])) {
    const imgUrl = img.media?.path || img.url || null;
    if (!imgUrl) continue;

    const imgType = (img.image_type || img.type || '').toLowerCase();
    // Skip tail number images
    if (imgType === 'tail' || imgType === 'registration') continue;

    if (imgType === 'floor_plan' || imgType === 'floorplan' || imgType === 'layout') {
      floorPlanUrl = imgUrl;
    }

    allImages.push({
      url: imgUrl,
      type: imgType || 'exterior',
      position: img.position ?? 0,
    });
  }

  // Sort by position
  allImages.sort((a, b) => a.position - b.position);

  const primaryImage = allImages.find(i => i.type === 'exterior')?.url
    || allImages[0]?.url
    || null;

  const ext = at.aircraft_type_extension || {};

  // Generate URL-safe slug from name
  const slug = (at.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: at.id,
    name: at.name,
    slug,
    icao: at.icao,
    class_name: at.class_name || at.aircraft_class?.name || '',
    class_id: at.aircraft_class?.id || null,
    manufacturer: at.manufacturer_name || at.aircraft_type_global_family?.name || '',
    range_km: at.range_maximum || null,
    max_pax: at.pax_maximum || null,
    speed_kmh: at.speed_typical || null,
    altitude_m: at.altitude || null,
    cabin_height_m: at.cabin_height || null,
    cabin_length_m: at.cabin_length || null,
    cabin_width_m: at.cabin_width || null,
    luggage_volume_m3: at.luggage_volume || null,
    engine_type: at.engine_type?.value || null,
    engine_count: at.engine_count || null,
    // Images
    image_url: primaryImage,
    floor_plan_url: floorPlanUrl,
    images: allImages,
    // Description
    description: ext.description || null,
    // Extended range data
    range_ferry_km: ext.range_ferry || null,
    range_typical_km: ext.range_typical_payload || null,
  };
}
