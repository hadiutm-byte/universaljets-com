import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Airport } from "@/hooks/useAviapages";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFkaWFiZHVsaGFkaSIsImEiOiJjbW43MDV3NDQwYWZvMnhzYmF6cG05a3ZsIn0.fKSSW2NTnStIWXZyXDk_KA";

interface QuoteRouteMapProps {
  from: Airport | null;
  to: Airport | null;
  /** Optional additional legs for multi-city */
  additionalLegs?: { from: Airport | null; to: Airport | null }[];
  className?: string;
}

/** Generate smooth arc coords between two [lng, lat] points */
function generateArc(from: [number, number], to: [number, number], steps = 80): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = from[0] + (to[0] - from[0]) * t;
    const lat = from[1] + (to[1] - from[1]) * t;
    const alt = Math.sin(t * Math.PI) * Math.min(Math.abs(to[0] - from[0]) * 0.12, 12);
    coords.push([lng, lat + alt]);
  }
  return coords;
}

/** Calculate bearing between two points */
function bearing(from: [number, number], to: [number, number]): number {
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;
  const lat1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Haversine distance in km */
function haversineKm(from: [number, number], to: [number, number]): number {
  const R = 6371;
  const dLat = ((to[1] - from[1]) * Math.PI) / 180;
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((from[1] * Math.PI) / 180) * Math.cos((to[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format distance */
function formatDist(km: number): string {
  return km > 1000 ? `${(km / 1.852).toLocaleString(undefined, { maximumFractionDigits: 0 })} nm` : `${Math.round(km)} km`;
}

/** Estimated flight time */
function flightTime(km: number): string {
  const hours = km / 800; // ~800 km/h cruise
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h > 0 ? `~${h}h ${m}m` : `~${m}m`;
}

const QuoteRouteMap = ({ from, to, additionalLegs, className = "" }: QuoteRouteMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  const hasRoute = from?.lat != null && from?.lng != null && to?.lat != null && to?.lng != null;

  // All route segments
  const segments = useMemo(() => {
    const segs: { from: [number, number]; to: [number, number]; fromAirport: Airport; toAirport: Airport }[] = [];
    if (from?.lat != null && from?.lng != null && to?.lat != null && to?.lng != null) {
      segs.push({ from: [from.lng, from.lat], to: [to.lng, to.lat], fromAirport: from, toAirport: to });
    }
    additionalLegs?.forEach((leg) => {
      if (leg.from?.lat != null && leg.from?.lng != null && leg.to?.lat != null && leg.to?.lng != null) {
        segs.push({ from: [leg.from.lng, leg.from.lat], to: [leg.to.lng, leg.to.lat], fromAirport: leg.from, toAirport: leg.to });
      }
    });
    return segs;
  }, [from, to, additionalLegs]);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        name: "UJ Quote Dark",
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
          },
        },
        layers: [{
          id: "carto-dark-layer",
          type: "raster",
          source: "carto-dark",
          paint: {
            "raster-opacity": 0.85,
            "raster-brightness-max": 0.45,
            "raster-contrast": 0.2,
            "raster-saturation": -0.6,
          },
        }],
      },
      center: [20, 30],
      zoom: 2,
      minZoom: 1,
      maxZoom: 10,
      attributionControl: false,
      fadeDuration: 0,
      interactive: true,
    });

    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    m.on("load", () => setLoaded(true));
    mapRef.current = m;

    return () => { m.remove(); mapRef.current = null; setLoaded(false); };
  }, []);

  // Draw routes
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !loaded) return;

    // Clean old layers/sources/markers
    markersRef.current.forEach((mk) => mk.remove());
    markersRef.current = [];
    for (let i = 0; i < 20; i++) {
      [`route-${i}`, `route-glow-${i}`, `route-arrow-${i}`].forEach((id) => {
        if (m.getLayer(id)) m.removeLayer(id);
      });
      if (m.getSource(`route-${i}`)) m.removeSource(`route-${i}`);
      if (m.getSource(`arrow-point-${i}`)) m.removeSource(`arrow-point-${i}`);
    }

    if (segments.length === 0) {
      // Reset view when no route
      m.flyTo({ center: [20, 30], zoom: 2, duration: 800 });
      return;
    }

    // Fit bounds
    const b = new mapboxgl.LngLatBounds();
    segments.forEach((seg) => { b.extend(seg.from); b.extend(seg.to); });
    m.fitBounds(b, { padding: 60, maxZoom: 7, duration: 1000 });

    // Create arrow image if needed
    if (!m.hasImage("arrow-icon")) {
      const size = 32;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      // Gold arrow
      ctx.fillStyle = "hsl(45, 79%, 55%)";
      ctx.beginPath();
      ctx.moveTo(size / 2, 2);
      ctx.lineTo(size - 4, size - 4);
      ctx.lineTo(size / 2, size - 10);
      ctx.lineTo(4, size - 4);
      ctx.closePath();
      ctx.fill();
      m.addImage("arrow-icon", { width: size, height: size, data: ctx.getImageData(0, 0, size, size).data } as any);
    }

    segments.forEach((seg, i) => {
      const arcCoords = generateArc(seg.from, seg.to);

      // Route source
      m.addSource(`route-${i}`, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: arcCoords } },
      });

      // Glow
      m.addLayer({
        id: `route-glow-${i}`,
        type: "line",
        source: `route-${i}`,
        paint: { "line-color": "hsla(45, 79%, 50%, 0.12)", "line-width": 10, "line-blur": 8 },
      });

      // Route line
      m.addLayer({
        id: `route-${i}`,
        type: "line",
        source: `route-${i}`,
        paint: { "line-color": "hsl(45, 79%, 55%)", "line-width": 2.5 },
      });

      // Directional arrow at midpoint
      const midIdx = Math.floor(arcCoords.length * 0.6);
      const midPt = arcCoords[midIdx];
      const prevPt = arcCoords[Math.max(0, midIdx - 2)];
      const arrowBearing = bearing(prevPt, midPt);

      m.addSource(`arrow-point-${i}`, {
        type: "geojson",
        data: { type: "Feature", properties: { bearing: arrowBearing }, geometry: { type: "Point", coordinates: midPt } },
      });

      m.addLayer({
        id: `route-arrow-${i}`,
        type: "symbol",
        source: `arrow-point-${i}`,
        layout: {
          "icon-image": "arrow-icon",
          "icon-size": 0.55,
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
        },
      });

      // Markers with labels
      const depEl = createCityMarker(seg.fromAirport.icao || seg.fromAirport.iata || "");
      markersRef.current.push(new mapboxgl.Marker({ element: depEl, anchor: "bottom" }).setLngLat(seg.from).addTo(m));

      const arrEl = createCityMarker(seg.toAirport.icao || seg.toAirport.iata || "");
      markersRef.current.push(new mapboxgl.Marker({ element: arrEl, anchor: "bottom" }).setLngLat(seg.to).addTo(m));
    });
  }, [segments, loaded]);

  // Info strip
  const routeInfo = useMemo(() => {
    if (segments.length === 0) return null;
    const totalKm = segments.reduce((sum, s) => sum + haversineKm(s.from, s.to), 0);
    return { distance: formatDist(totalKm), time: flightTime(totalKm), legs: segments.length };
  }, [segments]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: hasRoute ? 1 : 0, height: hasRoute ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`overflow-hidden ${className}`}
      >
        <div className="relative rounded-xl overflow-hidden border border-border/30">
          {/* Map */}
          <div ref={containerRef} className="w-full" style={{ height: "280px" }} />

          {/* Custom control styles */}
          <style>{`
            .mapboxgl-ctrl-group {
              background: hsla(var(--card), 0.8) !important;
              backdrop-filter: blur(12px) !important;
              border: 1px solid hsla(var(--border), 0.5) !important;
              border-radius: 0.5rem !important;
              overflow: hidden !important;
              box-shadow: 0 4px 20px -4px rgba(0,0,0,0.5) !important;
            }
            .mapboxgl-ctrl-group button {
              width: 30px !important;
              height: 30px !important;
              border-color: hsla(var(--border), 0.3) !important;
            }
            .mapboxgl-ctrl-group button:hover { background: hsla(var(--accent), 0.5) !important; }
            .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
              filter: invert(1) brightness(0.6) !important;
            }
            .mapboxgl-ctrl-group button:hover .mapboxgl-ctrl-icon {
              filter: invert(1) brightness(1) !important;
            }
          `}</style>

          {/* Route info strip */}
          <AnimatePresence>
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 left-3 right-3 z-20"
              >
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-background/70 backdrop-blur-md border border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
                        {from?.icao || from?.iata}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-px bg-primary/40" />
                      <Plane size={10} className="text-primary" />
                      <div className="w-6 h-px bg-primary/40" />
                    </div>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
                      {to?.icao || to?.iata}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-foreground/70 font-medium">{routeInfo.distance}</span>
                    <span className="text-[10px] text-primary font-medium">{routeInfo.time}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/** Create a labeled city marker */
function createCityMarker(code: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.display = "flex";
  el.style.flexDirection = "column";
  el.style.alignItems = "center";
  el.style.gap = "4px";

  const dot = document.createElement("div");
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.borderRadius = "50%";
  dot.style.background = "hsl(45, 79%, 55%)";
  dot.style.boxShadow = "0 0 12px 3px hsla(45, 79%, 50%, 0.5)";
  dot.style.border = "2px solid hsla(45, 79%, 80%, 0.6)";

  const label = document.createElement("div");
  label.textContent = code;
  label.style.fontSize = "9px";
  label.style.fontWeight = "600";
  label.style.letterSpacing = "0.1em";
  label.style.color = "hsla(0, 0%, 100%, 0.8)";
  label.style.textShadow = "0 1px 4px rgba(0,0,0,0.8)";
  label.style.whiteSpace = "nowrap";

  el.appendChild(label);
  el.appendChild(dot);
  return el;
}

export default QuoteRouteMap;
