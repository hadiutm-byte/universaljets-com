export interface DestinationRoute {
  from: string;
  to: string;
  time: string;
  aircraft: string;
}

export interface DestinationAirport {
  name: string;
  code: string; // ICAO or IATA
  icao?: string; // Pure ICAO for API lookups
  type: string; // "FBO" | "Commercial" | "Private Terminal"
  note?: string;
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  heroDesc: string;
  region: string;
  airports: DestinationAirport[];
  popularRoutes: DestinationRoute[];
  aircraftCategories: string[];
  seasonalInsights: { peak: string; shoulder: string; note: string };
  concierge: string[];
  lifestyle: string[];
  bookingTip: string;
}

export const destinations: Destination[] = [
  {
    slug: "dubai",
    name: "Dubai",
    tagline: "Global business hub & year-round sun",
    heroDesc: "Where ambition meets opulence. Dubai is the crossroads of East and West — a global hub for finance, luxury, and private aviation with world-class FBO facilities and year-round demand.",
    region: "Middle East",
    airports: [
      { name: "Al Maktoum International", code: "OMDW / DWC", icao: "OMDW", type: "FBO & Private Terminal", note: "Preferred for private aviation — VIP terminal with customs fast-track" },
      { name: "Dubai International", code: "OMDB / DXB", icao: "OMDB", type: "Commercial with GA facilities" },
    ],
    popularRoutes: [
      { from: "Dubai", to: "London", time: "7h", aircraft: "Heavy / Ultra Long Range" },
      { from: "Dubai", to: "Riyadh", time: "2h", aircraft: "Light / Midsize" },
      { from: "Dubai", to: "Maldives", time: "4h 15m", aircraft: "Super Midsize / Heavy" },
      { from: "Dubai", to: "Geneva", time: "6h 30m", aircraft: "Heavy" },
      { from: "Dubai", to: "Mykonos", time: "5h 30m", aircraft: "Super Midsize / Heavy" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "October – April (winter season, events, Expo)",
      shoulder: "May – September (summer — outbound demand to Europe & Maldives)",
      note: "Aircraft positioning from Europe peaks in October. Early booking recommended for December/January holidays.",
    },
    concierge: [
      "VIP terminal access at Al Maktoum (DWC)",
      "Rolls-Royce & Maybach chauffeured transfers",
      "Helicopter transfers to Abu Dhabi & RAK",
      "Yacht charter coordination",
      "Private dining & event access",
    ],
    lifestyle: [
      "Burj Khalifa private viewings",
      "Desert safari & luxury camping",
      "Jumeirah Beach & Palm Jumeirah estates",
      "Dubai Mall VIP shopping experiences",
    ],
    bookingTip: "Dubai is one of the world's busiest private aviation hubs. During peak season, aircraft availability tightens significantly — we recommend confirming 2–4 weeks in advance.",
  },
  {
    slug: "london",
    name: "London",
    tagline: "The world's financial capital",
    heroDesc: "Culture, power, and privilege in every corner. London remains the epicentre of global finance, luxury real estate, and private aviation, with more FBOs and private terminals than any other European city.",
    region: "Europe",
    airports: [
      { name: "Farnborough Airport", code: "EGLF / FAB", icao: "EGLF", type: "Dedicated Business Aviation", note: "UK's premier private jet airport — 100% business aviation" },
      { name: "London Luton", code: "EGGW / LTN", icao: "EGGW", type: "FBO & Commercial", note: "Major FBO hub with Signature & Harrods Aviation" },
      { name: "RAF Northolt", code: "EGWU", icao: "EGWU", type: "Military / VIP only", note: "Closest to Central London — restricted access" },
      { name: "London Biggin Hill", code: "EGKB / BQH", icao: "EGKB", type: "Business Aviation" },
    ],
    popularRoutes: [
      { from: "London", to: "Nice", time: "1h 50m", aircraft: "Light / Midsize" },
      { from: "London", to: "Geneva", time: "1h 40m", aircraft: "Light / Midsize" },
      { from: "London", to: "Dubai", time: "7h", aircraft: "Heavy / Ultra Long Range" },
      { from: "London", to: "New York", time: "7h 30m", aircraft: "Ultra Long Range" },
      { from: "London", to: "Ibiza", time: "2h 20m", aircraft: "Light / Midsize" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "June – September (summer), December (holidays)",
      shoulder: "October – November, March – May",
      note: "Wimbledon (July), Royal Ascot (June), and London Fashion Week drive peak demand. Farnborough slots fill fast during major events.",
    },
    concierge: [
      "Farnborough & Luton VIP terminal handling",
      "Chauffeur to Mayfair, The City, or Cotswolds",
      "Helicopter transfers to Central London heliport",
      "Private members' club access",
      "West End theatre & dining reservations",
    ],
    lifestyle: [
      "Mayfair & Knightsbridge luxury shopping",
      "Michelin-starred private dining",
      "Cotswolds & country estate weekends",
      "Wimbledon & Royal Ascot hospitality",
    ],
    bookingTip: "London has exceptional FBO infrastructure but peak summer and December demand requires early positioning. We recommend 2–3 weeks lead time for guaranteed slot access.",
  },
  {
    slug: "monaco",
    name: "Nice / Monaco",
    tagline: "Mediterranean elite access",
    heroDesc: "The jewel of the Côte d'Azur — superyachts, casinos, and unmatched exclusivity. Monaco and the French Riviera represent the pinnacle of European luxury, with year-round demand from global UHNW clients.",
    region: "Europe",
    airports: [
      { name: "Nice Côte d'Azur", code: "LFMN / NCE", icao: "LFMN", type: "FBO & Commercial", note: "Primary airport for Monaco — 20-minute helicopter transfer to Monte-Carlo" },
      { name: "Cannes Mandelieu", code: "LFMD", icao: "LFMD", type: "Business Aviation", note: "Smaller, exclusive — popular during Cannes Film Festival & MIPIM" },
    ],
    popularRoutes: [
      { from: "London", to: "Nice", time: "1h 50m", aircraft: "Light / Midsize" },
      { from: "Paris", to: "Nice", time: "1h 15m", aircraft: "Light Jet" },
      { from: "Geneva", to: "Nice", time: "50m", aircraft: "Light / Turboprop" },
      { from: "Dubai", to: "Nice", time: "6h 45m", aircraft: "Heavy" },
      { from: "Moscow", to: "Nice", time: "4h", aircraft: "Super Midsize / Heavy" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet"],
    seasonalInsights: {
      peak: "May – September (Monaco GP, Cannes, summer season)",
      shoulder: "March – April, October",
      note: "Monaco Grand Prix (May) and Cannes Film Festival create extreme slot pressure. Book 4–6 weeks ahead for GP weekend.",
    },
    concierge: [
      "Helicopter transfer Nice → Monaco heliport (7 minutes)",
      "Superyacht berth coordination",
      "Casino & Hôtel de Paris reservations",
      "Beach club & private event access",
      "Security escort for high-profile arrivals",
    ],
    lifestyle: [
      "Monte-Carlo Casino & nightlife",
      "Superyacht charter from Port Hercules",
      "Michelin-starred restaurants along the coast",
      "Cap Ferrat & Èze private villa rentals",
    ],
    bookingTip: "During Monaco GP and Cannes, Nice airport operates at near-maximum GA capacity. Early slot reservation is critical — we handle all coordination.",
  },
  {
    slug: "mykonos",
    name: "Mykonos",
    tagline: "Aegean glamour meets barefoot luxury",
    heroDesc: "The Mediterranean's most coveted summer escape. Mykonos draws the world's elite with its blend of bohemian charm, azure waters, and world-class nightlife — all accessible by private jet.",
    region: "Europe",
    airports: [
      { name: "Mykonos Airport", code: "LGMK / JMK", icao: "LGMK", type: "Regional with GA handling", note: "Short runway (1,750m) — midsize jet maximum. Heavy jets use Athens." },
    ],
    popularRoutes: [
      { from: "Dubai", to: "Mykonos", time: "5h 30m", aircraft: "Super Midsize (via Athens for heavy)" },
      { from: "London", to: "Mykonos", time: "3h 45m", aircraft: "Midsize / Super Midsize" },
      { from: "Athens", to: "Mykonos", time: "30m", aircraft: "Light Jet / Helicopter" },
      { from: "Ibiza", to: "Mykonos", time: "3h", aircraft: "Midsize" },
      { from: "Paris", to: "Mykonos", time: "3h 15m", aircraft: "Midsize" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize"],
    seasonalInsights: {
      peak: "June – September (summer season)",
      shoulder: "May, October",
      note: "July and August are extremely high demand. Runway length limits aircraft size — plan accordingly. Athens can serve as a staging point for larger aircraft with onward helicopter transfer.",
    },
    concierge: [
      "Tarmac-to-villa transfers",
      "Private yacht charter coordination",
      "Beach club reservations (Nammos, Scorpios)",
      "Helicopter transfers from Athens for heavy jet clients",
      "Event & private party planning",
    ],
    lifestyle: [
      "Nammos & SantAnna beach clubs",
      "Traditional Chora old town",
      "Island-hopping to Santorini & Paros",
      "Sunset dining at Matsuhisa",
    ],
    bookingTip: "Mykonos has a short runway limiting operations to midsize jets. For larger aircraft, we recommend Athens (ATH) with a 30-minute helicopter connection.",
  },
  {
    slug: "maldives",
    name: "Maldives",
    tagline: "The ultimate private retreat",
    heroDesc: "Overwater villas, crystal lagoons, and total seclusion. The Maldives is the world's most exclusive escape — a destination where private aviation meets pure serenity.",
    region: "Asia",
    airports: [
      { name: "Velana International", code: "VRMM / MLE", icao: "VRMM", type: "International with GA handling", note: "Main gateway — seaplane or domestic flight to resort atolls" },
    ],
    popularRoutes: [
      { from: "Dubai", to: "Malé", time: "4h 15m", aircraft: "Super Midsize / Heavy" },
      { from: "London", to: "Malé", time: "10h", aircraft: "Ultra Long Range" },
      { from: "Singapore", to: "Malé", time: "4h 30m", aircraft: "Heavy" },
      { from: "Mumbai", to: "Malé", time: "2h 30m", aircraft: "Midsize / Super Midsize" },
    ],
    aircraftCategories: ["Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "December – April (dry season, peak luxury travel)",
      shoulder: "November, May",
      note: "Christmas and New Year represent peak demand. Resort seaplane transfers must be coordinated with arrival times — we handle all logistics.",
    },
    concierge: [
      "Seaplane transfer coordination to resort atolls",
      "Private island & villa bookings",
      "Sunset dolphin cruises & diving excursions",
      "Special occasion arrangements (proposals, anniversaries)",
      "In-resort spa & wellness coordination",
    ],
    lifestyle: [
      "Overwater villa resorts (Soneva, One&Only)",
      "Private sandbank dining",
      "World-class diving & snorkelling",
      "Complete digital disconnection",
    ],
    bookingTip: "The Maldives requires careful timing coordination between international arrival and seaplane/domestic transfer to your resort. We manage the entire journey.",
  },
  {
    slug: "ibiza",
    name: "Ibiza",
    tagline: "Entertainment and lifestyle capital",
    heroDesc: "More than nightlife — Ibiza has evolved into a year-round destination for wellness, family retreats, and creative professionals, all while maintaining its legendary energy.",
    region: "Europe",
    airports: [
      { name: "Ibiza Airport", code: "LEIB / IBZ", icao: "LEIB", type: "Commercial with GA handling", note: "Well-equipped for private aviation. Peak summer slots require advance booking." },
    ],
    popularRoutes: [
      { from: "London", to: "Ibiza", time: "2h 20m", aircraft: "Light / Midsize" },
      { from: "Paris", to: "Ibiza", time: "1h 45m", aircraft: "Light Jet" },
      { from: "Dubai", to: "Ibiza", time: "7h", aircraft: "Heavy" },
      { from: "Mykonos", to: "Ibiza", time: "3h", aircraft: "Midsize" },
      { from: "Geneva", to: "Ibiza", time: "1h 30m", aircraft: "Light Jet" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet"],
    seasonalInsights: {
      peak: "June – September (summer season & club openings)",
      shoulder: "May, October (wellness & retreats)",
      note: "Opening and closing parties drive extreme demand in June and October. Weekend slots (Fri/Sun) are the most competitive.",
    },
    concierge: [
      "Villa coordination in Es Cubells & San José",
      "Restaurant & beach club reservations",
      "Yacht charter & sunset cruises",
      "Club table & VIP event access",
      "Wellness retreat coordination",
    ],
    lifestyle: [
      "Es Vedra sunsets & north coast coves",
      "Farm-to-table dining & wellness retreats",
      "World-famous clubs & private events",
      "Family-friendly coastal villas",
    ],
    bookingTip: "Friday and Sunday are the busiest days for Ibiza private jet traffic. Slots can sell out weeks in advance during peak summer — early confirmation is essential.",
  },
  {
    slug: "st-moritz",
    name: "St. Moritz",
    tagline: "Alpine elegance at its finest",
    heroDesc: "Where royalty and billionaires retreat in winter. St. Moritz offers the world's most exclusive ski experience, champagne-fuelled polo, and the glamour of the Engadin valley.",
    region: "Europe",
    airports: [
      { name: "Engadin Airport (Samedan)", code: "LSZS / SMV", icao: "LSZS", type: "Regional GA airport", note: "One of Europe's highest airports (1,707m). Challenging approach — experienced crew required." },
      { name: "Zurich Airport", code: "LSZH / ZRH", icao: "LSZH", type: "International with FBO", note: "Alternative for large cabin aircraft — 3h drive or helicopter to St. Moritz" },
    ],
    popularRoutes: [
      { from: "London", to: "Samedan", time: "1h 40m", aircraft: "Light / Midsize" },
      { from: "Nice", to: "Samedan", time: "1h", aircraft: "Light Jet" },
      { from: "Geneva", to: "Samedan", time: "40m", aircraft: "Light Jet" },
      { from: "Dubai", to: "Zurich", time: "6h 30m", aircraft: "Heavy (+ heli to St. Moritz)" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet"],
    seasonalInsights: {
      peak: "December – March (ski season, White Turf, Snow Polo)",
      shoulder: "July – August (summer hiking & wellness)",
      note: "Samedan has operational restrictions due to altitude and weather. We always brief clients on backup airport options (Zurich, Milan).",
    },
    concierge: [
      "Helicopter transfer from Zurich to St. Moritz",
      "Ski concierge & private instructor booking",
      "Badrutt's Palace & Suvretta House reservations",
      "Snow Polo & White Turf event hospitality",
      "Chauffeur to Engadin valley & Lake Silvaplana",
    ],
    lifestyle: [
      "Corviglia ski slopes & Diavolezza glacier",
      "Badrutt's Palace Hotel",
      "Snow Polo World Cup",
      "Engadin cross-country skiing trails",
    ],
    bookingTip: "Samedan is a challenging airport at high altitude with limited operating hours. We ensure crew qualification and weather contingency planning on every mission.",
  },
  {
    slug: "new-york",
    name: "New York",
    tagline: "Corporate and private travel powerhouse",
    heroDesc: "The city that never sleeps — and neither does its private aviation demand. New York offers more private jet access points than any US market, from Teterboro to Westchester.",
    region: "Americas",
    airports: [
      { name: "Teterboro Airport", code: "KTEB", icao: "KTEB", type: "Dedicated Business Aviation", note: "The premier NYC private jet airport — 12 miles from Manhattan" },
      { name: "Westchester County", code: "KHPN / HPN", icao: "KHPN", type: "GA & Commercial", note: "Popular for Connecticut & Westchester clients" },
      { name: "Republic Airport (Long Island)", code: "KFRG / FRG", icao: "KFRG", type: "Business Aviation", note: "Preferred for Hamptons access" },
    ],
    popularRoutes: [
      { from: "New York", to: "Miami", time: "2h 45m", aircraft: "Light / Midsize" },
      { from: "New York", to: "London", time: "7h 30m", aircraft: "Ultra Long Range" },
      { from: "New York", to: "Los Angeles", time: "5h 15m", aircraft: "Super Midsize / Heavy" },
      { from: "New York", to: "Aspen", time: "4h 30m", aircraft: "Midsize / Super Midsize" },
      { from: "New York", to: "Palm Beach", time: "2h 30m", aircraft: "Light / Midsize" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "September – December (business season, holidays), June – August (Hamptons)",
      shoulder: "January – March",
      note: "Teterboro has strict noise curfews and slot restrictions. Holiday weekends (Thanksgiving, Christmas) see extreme demand on Florida and Caribbean routes.",
    },
    concierge: [
      "Teterboro VIP terminal handling",
      "Helicopter transfer to Manhattan heliport (8 minutes)",
      "Black car service to Midtown, Wall Street, or Hamptons",
      "Restaurant & Broadway reservations",
      "Event & gala access coordination",
    ],
    lifestyle: [
      "Hamptons summer weekends",
      "Fifth Avenue luxury shopping",
      "Michelin-starred dining scene",
      "Met Gala & US Open hospitality",
    ],
    bookingTip: "Teterboro is the most popular private jet airport in the US and operates under strict slot management. We secure slots early and always confirm FBO availability.",
  },
  {
    slug: "paris",
    name: "Paris",
    tagline: "Fashion, luxury, and timeless elegance",
    heroDesc: "The City of Light remains the global capital of fashion, gastronomy, and art — with Le Bourget serving as Europe's busiest dedicated business aviation airport.",
    region: "Europe",
    airports: [
      { name: "Paris Le Bourget", code: "LFPB / LBG", icao: "LFPB", type: "Dedicated Business Aviation", note: "Europe's #1 business aviation airport — 100% GA, multiple FBOs" },
      { name: "Paris Charles de Gaulle", code: "LFPG / CDG", icao: "LFPG", type: "International with GA terminal" },
    ],
    popularRoutes: [
      { from: "Paris", to: "London", time: "55m", aircraft: "Light Jet" },
      { from: "Paris", to: "Nice", time: "1h 15m", aircraft: "Light Jet" },
      { from: "Paris", to: "Geneva", time: "1h", aircraft: "Light Jet" },
      { from: "Paris", to: "New York", time: "8h", aircraft: "Ultra Long Range" },
      { from: "Paris", to: "Dubai", time: "6h 30m", aircraft: "Heavy" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "September – October (Fashion Week), June (Roland Garros), year-round business",
      shoulder: "July – August (Parisian summer exodus to Riviera)",
      note: "Paris Fashion Week and Roland Garros create significant demand spikes at Le Bourget. During these events, FBO capacity fills rapidly.",
    },
    concierge: [
      "Le Bourget VIP lounge & fast-track customs",
      "Chauffeur service to Place Vendôme, Champs-Élysées, or Versailles",
      "Michelin-star restaurant reservations",
      "Fashion Week show access & front-row coordination",
      "Private museum & gallery tours",
    ],
    lifestyle: [
      "Haute couture shopping on Rue du Faubourg",
      "Private tours of the Louvre & Musée d'Orsay",
      "Champagne region day trips",
      "Roland Garros hospitality suites",
    ],
    bookingTip: "Le Bourget is Europe's busiest business aviation hub and operates seamlessly year-round. During Fashion Week, advance FBO booking is strongly recommended.",
  },
  {
    slug: "riyadh",
    name: "Riyadh",
    tagline: "Power, government, and Vision 2030",
    heroDesc: "The capital of Saudi Arabia and the nerve centre of the Middle East's most ambitious economic transformation. Riyadh is rapidly becoming one of the world's most important private aviation markets.",
    region: "Middle East",
    airports: [
      { name: "King Khalid International", code: "OERK / RUH", icao: "OERK", type: "International with GA terminal", note: "Dedicated Royal & VIP terminal for private aviation" },
    ],
    popularRoutes: [
      { from: "Riyadh", to: "Dubai", time: "2h", aircraft: "Light / Midsize" },
      { from: "Riyadh", to: "London", time: "6h 45m", aircraft: "Heavy / Ultra Long Range" },
      { from: "Riyadh", to: "Jeddah", time: "1h 30m", aircraft: "Light Jet" },
      { from: "Riyadh", to: "Geneva", time: "6h", aircraft: "Heavy" },
      { from: "Riyadh", to: "Cairo", time: "2h 30m", aircraft: "Midsize" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "October – April (cooler season, government events, FII conference)",
      shoulder: "May – September (summer heat — outbound traffic to Europe)",
      note: "Future Investment Initiative (FII) in October creates massive demand. Saudi Arabia's aviation growth under Vision 2030 is expanding private terminal capacity.",
    },
    concierge: [
      "Royal terminal access coordination",
      "Armoured vehicle & security escort",
      "Government protocol & delegation support",
      "Hotel coordination (Ritz-Carlton, Four Seasons)",
      "Business meeting & conference logistics",
    ],
    lifestyle: [
      "Diriyah Season cultural events",
      "Edge of the World geological site",
      "Kingdom Centre & luxury retail",
      "Vision 2030 mega-projects & NEOM tours",
    ],
    bookingTip: "Saudi Arabia's private aviation market is growing rapidly. Landing permits and overflight clearances require advance planning — we handle all regulatory coordination.",
  },
  {
    slug: "geneva",
    name: "Geneva",
    tagline: "Private banking, diplomacy, and alpine beauty",
    heroDesc: "Switzerland's most prestigious city — where global wealth management, international diplomacy, and alpine lifestyle converge. Geneva is the discreet capital of European private aviation.",
    region: "Europe",
    airports: [
      { name: "Geneva International", code: "LSGG / GVA", icao: "LSGG", type: "International with dedicated GA terminal", note: "Excellent FBO facilities — TAG Aviation & ExecuJet" },
    ],
    popularRoutes: [
      { from: "London", to: "Geneva", time: "1h 40m", aircraft: "Light / Midsize" },
      { from: "Paris", to: "Geneva", time: "1h", aircraft: "Light Jet" },
      { from: "Dubai", to: "Geneva", time: "6h 30m", aircraft: "Heavy" },
      { from: "Nice", to: "Geneva", time: "50m", aircraft: "Light Jet" },
      { from: "New York", to: "Geneva", time: "8h 30m", aircraft: "Ultra Long Range" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "January (Davos WEF), December – March (ski season), September (UN General Assembly)",
      shoulder: "April – May, October – November",
      note: "World Economic Forum in January creates extraordinary demand across all Swiss airports. Ski season weekends are highly competitive for Samedan and Sion slots.",
    },
    concierge: [
      "TAG Aviation VIP terminal handling",
      "Chauffeur to Gstaad, Verbier, or Montreux",
      "Private banking appointment coordination",
      "Ski resort transfers & equipment logistics",
      "Lake Geneva yacht & dining experiences",
    ],
    lifestyle: [
      "Lake Geneva waterfront & Jet d'Eau",
      "Swiss watch boutiques on Rue du Rhône",
      "Chamonix & Mont Blanc excursions",
      "Lavaux vineyard UNESCO wine tours",
    ],
    bookingTip: "Geneva is Switzerland's private aviation gateway. During Davos week, demand extends across all Swiss airports — we recommend confirming 4+ weeks ahead.",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    tagline: "Entertainment industry capital",
    heroDesc: "The global capital of entertainment, technology, and West Coast luxury. LA's sprawling geography makes private aviation not just convenient but essential for high-net-worth clients.",
    region: "Americas",
    airports: [
      { name: "Van Nuys Airport", code: "KVNY / VNY", icao: "KVNY", type: "Dedicated Business Aviation", note: "World's busiest GA airport — the 'Teterboro of the West Coast'" },
      { name: "Santa Monica Airport", code: "KSMO / SMO", icao: "KSMO", type: "GA (limited operations)" },
      { name: "Burbank (Hollywood)", code: "KBUR / BUR", icao: "KBUR", type: "Commercial with GA terminal" },
    ],
    popularRoutes: [
      { from: "Los Angeles", to: "Las Vegas", time: "55m", aircraft: "Light Jet" },
      { from: "Los Angeles", to: "New York", time: "5h 15m", aircraft: "Super Midsize / Heavy" },
      { from: "Los Angeles", to: "Aspen", time: "2h 30m", aircraft: "Midsize" },
      { from: "Los Angeles", to: "San Francisco", time: "1h", aircraft: "Light Jet" },
      { from: "Los Angeles", to: "Cabo San Lucas", time: "2h 30m", aircraft: "Midsize" },
    ],
    aircraftCategories: ["Light Jet", "Midsize Jet", "Super Midsize", "Heavy Jet", "Ultra Long Range"],
    seasonalInsights: {
      peak: "Year-round (entertainment industry), February (Awards Season), April (Coachella)",
      shoulder: "None — consistent demand",
      note: "Awards Season (February–March) and Coachella (April) create demand spikes. Van Nuys is consistently busy — early FBO booking recommended.",
    },
    concierge: [
      "Van Nuys VIP terminal handling",
      "Luxury SUV transfers to Beverly Hills, Malibu, or Downtown",
      "Studio lot & private screening access",
      "Awards ceremony & red carpet logistics",
      "Malibu & Pacific Coast Highway experiences",
    ],
    lifestyle: [
      "Beverly Hills & Rodeo Drive",
      "Malibu beachfront estates",
      "Hollywood studio tours & screenings",
      "Napa Valley & wine country day trips",
    ],
    bookingTip: "Van Nuys is the world's busiest general aviation airport. FBO selection matters — we recommend the right facility based on your specific aircraft type and itinerary.",
  },
];

export const getDestinationBySlug = (slug: string): Destination | undefined =>
  destinations.find((d) => d.slug === slug);
