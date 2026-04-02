import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, X, Users, ArrowRight, Share2, Ruler, Loader2 } from "lucide-react";
import AircraftGallery from "@/components/AircraftGallery";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { useShareCard } from "@/hooks/useShareCard";

/** Lazily load mapbox-gl + its CSS only when the map is rendered. */
let _mapboxgl: any = null;
async function getMapboxGL() {
  if (_mapboxgl) return _mapboxgl;
  const [mod] = await Promise.all([
    import("mapbox-gl"),
    import("mapbox-gl/dist/mapbox-gl.css"),
  ]);
  _mapboxgl = mod.default ?? mod;
  return _mapboxgl;
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFkaWFiZHVsaGFkaSIsImEiOiJjbW43MDV3NDQwYWZvMnhzYmF6cG05a3ZsIn0.fKSSW2NTnStIWXZyXDk_KA";

interface EmptyLegsMapViewProps {
  legs: EmptyLeg[];
  selectedLeg: EmptyLeg | null;
  onLegClick: (leg: EmptyLeg) => void;
  onClose: () => void;
  toMapCoords: (lat: number | null | undefined, lng: number | null | undefined) => [number, number];
  isLiveData: boolean;
}

/** Generate a smooth arc between two points */
function generateArc(from: [number, number], to: [number, number], steps = 64): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = from[0] + (to[0] - from[0]) * t;
    const lat = from[1] + (to[1] - from[1]) * t;
    // Add altitude curve for arc effect
    const alt = Math.sin(t * Math.PI) * Math.min(
      Math.abs(to[0] - from[0]) * 0.15,
      15
    );
    coords.push([lng, lat + alt]);
  }
  return coords;
}

const EmptyLegsMapView = ({ legs, selectedLeg, onLegClick, onClose, isLiveData }: EmptyLegsMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mbRef = useRef<any>(null); // stores loaded mapboxgl module
  const markersRef = useRef<any[]>([]);
  const popupRef = useRef<any>(null);
  const [hoveredLeg, setHoveredLeg] = useState<EmptyLeg | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const projectedLegs = useMemo(() => {
    return legs.filter((leg) => {
      if (!leg.departure || !leg.arrival) return false;
      return leg.departure.lat != null && leg.departure.lng != null
        && leg.arrival.lat != null && leg.arrival.lng != null;
    });
  }, [legs]);

  // Initialize map with dynamic import
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    let cancelled = false;

    getMapboxGL().then((mb) => {
      if (cancelled || !mapContainer.current) return;
      mbRef.current = mb;
      mb.accessToken = MAPBOX_TOKEN;

      const m = new mb.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          name: "UJ Dark",
          sources: {
            "carto-dark": {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
                "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
                "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "carto-dark-layer",
              type: "raster",
              source: "carto-dark",
              paint: {
                "raster-opacity": 0.85,
                "raster-brightness-max": 0.45,
                "raster-contrast": 0.2,
                "raster-saturation": -0.6,
              },
            },
          ],
        },
        center: [20, 30],
        zoom: 2,
        minZoom: 1.5,
        maxZoom: 12,
        attributionControl: false,
        fadeDuration: 0,
      });

      m.addControl(new mb.NavigationControl({ showCompass: false }), "top-right");

      m.on("load", () => {
        setMapLoaded(true);
      });

      map.current = m;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setMapLoaded(false);
      setMapReady(false);
    };
  }, []);

  // Fit bounds when legs change
  useEffect(() => {
    const mb = mbRef.current;
    if (!map.current || !mb || !mapLoaded || projectedLegs.length === 0) return;
    const b = new mb.LngLatBounds();
    projectedLegs.forEach((leg: EmptyLeg) => {
      b.extend([leg.departure!.lng!, leg.departure!.lat!]);
      b.extend([leg.arrival!.lng!, leg.arrival!.lat!]);
    });
    map.current.fitBounds(b, { padding: 80, maxZoom: 6, duration: 1200 });
  }, [projectedLegs, mapLoaded]);

   // Draw routes + markers
  useEffect(() => {
    const m = map.current;
    if (!m || !mapLoaded || !m.isStyleLoaded()) return;

    // Clean up old markers
    markersRef.current.forEach((mk) => mk.remove());
    markersRef.current = [];

    // Clean up old sources/layers
    projectedLegs.forEach((_, i) => {
      const routeId = `route-${i}`;
      const glowId = `route-glow-${i}`;
      if (m.getLayer(glowId)) m.removeLayer(glowId);
      if (m.getLayer(routeId)) m.removeLayer(routeId);
      if (m.getSource(routeId)) m.removeSource(routeId);
    });
    // Also clean extras from previous render counts
    for (let i = 0; i < 200; i++) {
      const routeId = `route-${i}`;
      const glowId = `route-glow-${i}`;
      if (m.getLayer(glowId)) m.removeLayer(glowId);
      if (m.getLayer(routeId)) m.removeLayer(routeId);
      if (m.getSource(routeId)) m.removeSource(routeId);
    }

    projectedLegs.forEach((leg, i) => {
      const dep = leg.departure!;
      const arr = leg.arrival!;
      const from: [number, number] = [dep.lng!, dep.lat!];
      const to: [number, number] = [arr.lng!, arr.lat!];
      const arcCoords = generateArc(from, to);
      const routeId = `route-${i}`;
      const isActive = selectedLeg?.id === leg.id;

      // Route source
      m.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { legIndex: i },
          geometry: { type: "LineString", coordinates: arcCoords },
        },
      });

      // Glow layer
      m.addLayer({
        id: `route-glow-${i}`,
        type: "line",
        source: routeId,
        paint: {
          "line-color": "hsla(43, 74%, 52%, 0.15)",
          "line-width": isActive ? 8 : 4,
          "line-blur": isActive ? 8 : 4,
        },
      });

      // Main route line
      m.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        paint: {
          "line-color": isActive ? "hsl(43, 85%, 58%)" : "hsla(43, 74%, 52%, 0.55)",
          "line-width": isActive ? 2.5 : 1.2,
          "line-dasharray": isActive ? [1] : [2, 2],
        },
      });

      // Click handler on route
      m.on("click", routeId, () => onLegClick(leg));
      m.on("click", `route-glow-${i}`, () => onLegClick(leg));

      // Hover cursor
      m.on("mouseenter", routeId, () => {
        m.getCanvas().style.cursor = "pointer";
        setHoveredLeg(leg);
      });
      m.on("mouseleave", routeId, () => {
        m.getCanvas().style.cursor = "";
        setHoveredLeg(null);
      });
      m.on("mouseenter", `route-glow-${i}`, () => {
        m.getCanvas().style.cursor = "pointer";
        setHoveredLeg(leg);
      });
      m.on("mouseleave", `route-glow-${i}`, () => {
        m.getCanvas().style.cursor = "";
        setHoveredLeg(null);
      });

      // Departure marker
      const depEl = createMarkerEl(isActive);
      const depMarker = new mapboxgl.Marker({ element: depEl })
        .setLngLat(from)
        .addTo(m);
      depEl.addEventListener("click", (e) => { e.stopPropagation(); onLegClick(leg); });
      markersRef.current.push(depMarker);

      // Arrival marker
      const arrEl = createMarkerEl(isActive);
      const arrMarker = new mapboxgl.Marker({ element: arrEl })
        .setLngLat(to)
        .addTo(m);
      arrEl.addEventListener("click", (e) => { e.stopPropagation(); onLegClick(leg); });
      markersRef.current.push(arrMarker);
    });
  }, [projectedLegs, selectedLeg, mapLoaded, onLegClick]);

  // Pan to selected leg
  useEffect(() => {
    if (!map.current || !selectedLeg || !mapLoaded) return;
    const dep = selectedLeg.departure;
    const arr = selectedLeg.arrival;
    if (!dep?.lng || !dep?.lat || !arr?.lng || !arr?.lat) return;
    const b = new mapboxgl.LngLatBounds();
    b.extend([dep.lng, dep.lat]);
    b.extend([arr.lng, arr.lat]);
    map.current.fitBounds(b, { padding: { top: 80, bottom: 80, left: 80, right: 420 }, maxZoom: 7, duration: 800 });
  }, [selectedLeg, mapLoaded]);

  const activeLeg = selectedLeg || hoveredLeg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden mb-16 border border-border/30"
      style={{ background: "hsl(var(--card))" }}
    >
      {/* Route count badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-md border border-border/50 text-[10px] tracking-[0.15em] uppercase font-medium text-muted-foreground">
          {projectedLegs.length} Active Route{projectedLegs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Map container */}
      <div
        ref={mapContainer}
        className="w-full"
        style={{ height: "560px" }}
      />

      {/* Custom CSS for Mapbox controls */}
      <style>{`
        .mapboxgl-ctrl-group {
          background: hsla(var(--card), 0.8) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid hsla(var(--border), 0.5) !important;
          border-radius: 0.75rem !important;
          overflow: hidden !important;
          box-shadow: 0 4px 20px -4px rgba(0,0,0,0.5) !important;
        }
        .mapboxgl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
          border-color: hsla(var(--border), 0.3) !important;
        }
        .mapboxgl-ctrl-group button:hover {
          background: hsla(var(--accent), 0.5) !important;
        }
        .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
          filter: invert(1) brightness(0.6) !important;
        }
        .mapboxgl-ctrl-group button:hover .mapboxgl-ctrl-icon {
          filter: invert(1) brightness(1) !important;
        }
      `}</style>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredLeg && !selectedLeg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-xl border border-border/50 shadow-2xl"
            style={{ background: "hsla(var(--card), 0.95)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex items-center gap-3 text-[11px]">
              <div className="text-center">
                <span className="font-display font-semibold text-foreground block">{hoveredLeg.departure?.icao || hoveredLeg.departure?.iata}</span>
                <span className="text-[8px] text-muted-foreground">{hoveredLeg.departure?.city}</span>
              </div>
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-4 h-[0.5px] bg-border" />
                <Plane size={10} className="text-primary" />
                <div className="w-4 h-[0.5px] bg-border" />
              </div>
              <div className="text-center">
                <span className="font-display font-semibold text-foreground block">{hoveredLeg.arrival?.icao || hoveredLeg.arrival?.iata}</span>
                <span className="text-[8px] text-muted-foreground">{hoveredLeg.arrival?.city}</span>
              </div>
              <div className="ml-2 pl-3 border-l border-border/50">
                <span className="text-muted-foreground block text-[9px]">{hoveredLeg.aircraft_type}</span>
                {hoveredLeg.price ? (
                  <span className="text-primary font-medium text-[10px]">{hoveredLeg.currency} {hoveredLeg.price.toLocaleString()}</span>
                ) : (
                  <span className="text-primary/70 text-[9px]">Save up to 75%</span>
                )}
              </div>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[8px] text-muted-foreground/50 tracking-wider">Click to view details</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected leg detail panel */}
      <AnimatePresence>
        {selectedLeg && (
          <SelectedLegPanel leg={selectedLeg} onClose={onClose} />
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[9px] text-muted-foreground/40 font-light tracking-wider">
          Scroll to zoom · Drag to pan · Click a route for details
        </p>
      </div>
    </motion.div>
  );
};

/** Create a gold pulsing marker element */
function createMarkerEl(isActive: boolean): HTMLDivElement {
  const el = document.createElement("div");
  const size = isActive ? 14 : 8;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.background = "hsl(43, 85%, 58%)";
  el.style.boxShadow = isActive
    ? "0 0 16px 4px hsla(43, 74%, 52%, 0.5), 0 0 4px 1px hsla(43, 74%, 52%, 0.8)"
    : "0 0 8px 2px hsla(43, 74%, 52%, 0.3)";
  el.style.cursor = "pointer";
  el.style.transition = "all 0.3s ease";
  el.style.border = isActive ? "2px solid hsla(43, 85%, 78%, 0.6)" : "none";
  if (isActive) {
    el.style.animation = "pulse-gold 2s ease-in-out infinite";
  }
  return el;
}

/** Detail panel for selected leg */
function SelectedLegPanel({ leg, onClose }: { leg: EmptyLeg; onClose: () => void }) {
  const fromCode = leg.departure?.icao || leg.departure?.iata || "---";
  const toCode = leg.arrival?.icao || leg.arrival?.iata || "---";
  const fromCity = leg.departure?.city || "";
  const toCity = leg.arrival?.city || "";
  const date = leg.from_date
    ? new Date(leg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "TBD";
  const priceLabel = leg.price ? `${leg.currency} ${leg.price.toLocaleString()}` : "Save up to 75%";
  const image = leg.aircraft_image || getAircraftImage(leg.aircraft_type || "midsize");
  const category = leg.aircraft_class || getAircraftCategory(leg.aircraft_type || "midsize");
  const galleryImages = leg.aircraft_images?.length
    ? leg.aircraft_images
    : [{ url: image, type: "exterior" }];
  const waMsg = encodeURIComponent(
    `Hello, I'm interested in an empty leg from ${fromCity || "?"} to ${toCity || "?"} on ${date} (${leg.aircraft_type}).`
  );

  const { share: doShare } = useShareCard();

  const handleShare = async () => {
    await doShare({ fromCode, fromCity, toCode, toCity, date, price: priceLabel, aircraftType: leg.aircraft_type || "Private Jet", category });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-y-0 right-0 w-full sm:w-96 z-30 overflow-y-auto border-l border-border/30"
      style={{ background: "hsla(var(--card), 0.97)", backdropFilter: "blur(16px)" }}
    >
      {/* Aircraft gallery */}
      <div className="relative h-44 overflow-hidden">
        <AircraftGallery
          images={galleryImages}
          floorPlanUrl={leg.aircraft_floor_plan}
          aircraftType={leg.aircraft_type || "Aircraft"}
          variant="compact"
          className="h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/30 backdrop-blur-sm border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors z-10"
        >
          <X size={14} />
        </button>
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-primary/90 text-primary-foreground">
            {category}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 z-10">
          <p className="text-foreground text-[15px] font-display font-semibold">{leg.aircraft_type}</p>
        </div>
      </div>

      <div className="p-5">
        {/* Route */}
        <div className="flex items-center gap-3 mb-5">
          <div className="text-center">
            <span className="font-display text-lg text-foreground font-semibold block">{fromCode}</span>
            <span className="text-[10px] text-muted-foreground font-light">{fromCity}</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2">
            <div className="flex-1 h-px bg-border/50" />
            <Plane size={12} className="text-primary" />
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div className="text-center">
            <span className="font-display text-lg text-foreground font-semibold block">{toCode}</span>
            <span className="text-[10px] text-muted-foreground font-light">{toCity}</span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="px-3 py-2.5 rounded-lg bg-muted/20 border border-border/30">
            <span className="text-muted-foreground/60 text-[9px] uppercase tracking-wider block mb-0.5">Date</span>
            <span className="text-foreground text-[12px] font-medium">{date}</span>
          </div>
          <div className="px-3 py-2.5 rounded-lg bg-muted/20 border border-border/30">
            <span className="text-muted-foreground/60 text-[9px] uppercase tracking-wider block mb-0.5">Price</span>
            <span className="text-primary text-[12px] font-medium">{priceLabel}</span>
          </div>
          {leg.aircraft_max_pax && (
            <div className="px-3 py-2.5 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-muted-foreground/60 text-[9px] uppercase tracking-wider block mb-0.5">Capacity</span>
              <span className="text-foreground text-[12px] font-medium flex items-center gap-1"><Users size={11} /> {leg.aircraft_max_pax} pax</span>
            </div>
          )}
          {leg.aircraft_range_km && (
            <div className="px-3 py-2.5 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-muted-foreground/60 text-[9px] uppercase tracking-wider block mb-0.5">Range</span>
              <span className="text-foreground text-[12px] font-medium">{leg.aircraft_range_km.toLocaleString()} km</span>
            </div>
          )}
        </div>

        {/* Operator name hidden from B2C — privacy policy */}

        <div className="flex gap-2">
          <a
            href={`https://wa.me/447888999944?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-300"
          >
            Request This Flight <ArrowRight size={11} />
          </a>
          <button
            onClick={handleShare}
            className="w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            aria-label="Share"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default EmptyLegsMapView;
