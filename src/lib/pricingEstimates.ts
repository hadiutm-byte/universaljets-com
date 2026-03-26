/**
 * Smart pricing estimation engine for private jet charter.
 *
 * When the API doesn't return a price, we estimate based on:
 * - Aircraft class (cost per flight hour varies by class)
 * - Flight distance (converted to estimated flight hours)
 *
 * These are market-range estimates, NOT quotes.
 * Displayed as "From $XX,XXX est." to set expectations.
 */

/** Hourly rate ranges by aircraft class (USD) — industry market data */
const CLASS_HOURLY_RATES: Record<string, { low: number; high: number; label: string }> = {
  "very light":      { low: 2800,  high: 4500,  label: "Very Light Jet" },
  "light":           { low: 4000,  high: 6500,  label: "Light Jet" },
  "midsize":         { low: 5500,  high: 8500,  label: "Midsize Jet" },
  "super midsize":   { low: 7000,  high: 11000, label: "Super Midsize Jet" },
  "heavy":           { low: 9000,  high: 15000, label: "Heavy Jet" },
  "ultra long range":{ low: 11000, high: 18000, label: "Ultra Long Range" },
  "vip airliner":    { low: 16000, high: 28000, label: "VIP Airliner" },
};

/** Average cruise speeds by class (km/h) */
const CLASS_SPEEDS: Record<string, number> = {
  "very light": 600,
  "light": 720,
  "midsize": 790,
  "super midsize": 830,
  "heavy": 870,
  "ultra long range": 900,
  "vip airliner": 850,
};

/** Great circle distance between two points in nautical miles */
export function greatCircleDistanceNm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3440.065; // Earth radius in nm
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Estimate flight time in minutes given distance (nm) and class */
export function estimateFlightTimeMin(distanceNm: number, aircraftClass?: string | null, speedKmh?: number | null): number {
  const classKey = (aircraftClass || "midsize").toLowerCase();
  const speed = speedKmh || CLASS_SPEEDS[classKey] || 790;
  const distanceKm = distanceNm * 1.852;
  const flightHours = distanceKm / speed;
  // Add 15 min for taxi/climb/descent
  return Math.round(flightHours * 60 + 15);
}

export interface PriceEstimate {
  /** Formatted display string, e.g. "From $45,000 est." or "$82,500" */
  display: string;
  /** Low end of range (USD) */
  low: number;
  /** High end (USD) — same as low for exact prices */
  high: number;
  /** Whether this is an estimate vs exact API price */
  isEstimate: boolean;
  /** CSS class hint */
  variant: "exact" | "estimate" | "request";
}

/**
 * Get pricing for an aircraft result.
 *
 * Priority:
 * 1. Exact API price → show as-is
 * 2. Estimate from class + flight time → "From $XX,XXX est."
 * 3. Fallback → "Price on request"
 */
export function getCharterPrice(opts: {
  price?: number | null;
  priceCurrency?: string;
  priceUnit?: string | null;
  aircraftClass?: string | null;
  distanceNm?: number | null;
  flightTimeMin?: number | null;
  speedKmh?: number | null;
}): PriceEstimate {
  const { price, priceCurrency = "USD", priceUnit, aircraftClass, distanceNm, flightTimeMin, speedKmh } = opts;

  // 1. Exact price from API
  if (price != null && price > 0) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: priceCurrency,
      maximumFractionDigits: 0,
    }).format(price);
    const suffix = priceUnit === "per_hour" ? "/hr" : "";
    return {
      display: `${formatted}${suffix}`,
      low: price,
      high: price,
      isEstimate: false,
      variant: "exact",
    };
  }

  // 2. Estimate from class + distance
  const classKey = (aircraftClass || "").toLowerCase();
  const rates = CLASS_HOURLY_RATES[classKey];

  if (rates && (distanceNm || flightTimeMin)) {
    const minutes = flightTimeMin || (distanceNm ? estimateFlightTimeMin(distanceNm, aircraftClass, speedKmh) : null);
    if (minutes && minutes > 0) {
      const flightHours = Math.max(minutes / 60, 1); // minimum 1 hour
      const lowEst = Math.round(rates.low * flightHours / 500) * 500; // round to nearest $500
      const highEst = Math.round(rates.high * flightHours / 500) * 500;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(lowEst);

      return {
        display: `From ${formatted} est.`,
        low: lowEst,
        high: highEst,
        isEstimate: true,
        variant: "estimate",
      };
    }
  }

  // 3. Fallback
  return {
    display: "Price on request",
    low: 0,
    high: 0,
    isEstimate: true,
    variant: "request",
  };
}

/** Format flight time nicely */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Format distance */
export function formatDistance(nm: number): string {
  return `${Math.round(nm).toLocaleString()} nm`;
}
