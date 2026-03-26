import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, X, Users, ArrowRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";

interface EmptyLegsMapViewProps {
  legs: EmptyLeg[];
  selectedLeg: EmptyLeg | null;
  onLegClick: (leg: EmptyLeg) => void;
  onClose: () => void;
  toMapCoords: (lat: number | null | undefined, lng: number | null | undefined) => [number, number];
  isLiveData: boolean;
}

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const WORLD: ViewBox = { x: 0, y: 0, w: 100, h: 50 };
const MIN_W = 15;
const MIN_H = 8;

function clamp(vb: ViewBox): ViewBox {
  const w = Math.max(MIN_W, Math.min(100, vb.w));
  const h = Math.max(MIN_H, Math.min(50, vb.h));
  return {
    x: Math.max(0, Math.min(100 - w, vb.x)),
    y: Math.max(0, Math.min(50 - h, vb.y)),
    w,
    h,
  };
}

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 100;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 50 / 2 - (mercN / Math.PI) * (50 / 2);
  return [x, Math.max(0, Math.min(50, y))];
}

/** Simplified world map paths (Mercator projected, 100×50 viewBox) */
const CONTINENT_PATHS = [
  "M5,10 L8,8 L15,7 L22,8 L27,10 L28,13 L26,16 L22,18 L18,20 L14,22 L10,20 L7,18 L5,14 Z",
  "M14,22 L18,20 L20,22 L22,24 L20,26 L16,25 L14,23 Z",
  "M20,26 L24,24 L28,26 L30,30 L28,36 L26,40 L22,42 L20,38 L18,32 L19,28 Z",
  "M44,8 L48,7 L52,8 L54,10 L56,12 L54,14 L50,16 L46,15 L44,12 Z",
  "M42,9 L44,8 L44,11 L42,11 Z",
  "M48,5 L52,4 L54,6 L52,8 L48,7 Z",
  "M44,18 L50,16 L56,18 L58,22 L56,30 L52,36 L48,38 L44,34 L42,28 L42,22 Z",
  "M56,14 L62,12 L64,16 L62,20 L58,18 L56,16 Z",
  "M54,6 L60,4 L72,4 L82,6 L88,8 L86,12 L78,14 L68,12 L60,10 L56,8 Z",
  "M64,16 L70,14 L72,18 L70,24 L66,22 L64,20 Z",
  "M72,18 L78,16 L80,20 L78,24 L74,22 L72,20 Z",
  "M78,8 L84,6 L88,10 L86,14 L82,16 L78,14 L76,10 Z",
  "M88,10 L90,8 L91,12 L89,14 L87,12 Z",
  "M76,24 L82,22 L86,24 L84,28 L78,28 L76,26 Z",
  "M80,32 L90,30 L94,34 L92,40 L86,42 L80,38 L78,34 Z",
  "M94,40 L96,38 L96,42 L94,44 Z",
];

const EmptyLegsMapView = ({ legs, selectedLeg, onLegClick, onClose, isLiveData }: EmptyLegsMapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState<ViewBox>(WORLD);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredLeg, setHoveredLeg] = useState<EmptyLeg | null>(null);
  const panStart = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  const projectedLegs = useMemo(() => {
    return legs.map((leg) => {
      if (!leg.departure || !leg.arrival) return null;
      if (leg.departure.lat == null || leg.departure.lng == null) return null;
      if (leg.arrival.lat == null || leg.arrival.lng == null) return null;
      const from = project(leg.departure.lat, leg.departure.lng);
      const to = project(leg.arrival.lat, leg.arrival.lng);
      if (isNaN(from[0]) || isNaN(from[1]) || isNaN(to[0]) || isNaN(to[1])) return null;
      return { leg, from, to };
    }).filter(Boolean) as { leg: EmptyLeg; from: [number, number]; to: [number, number] }[];
  }, [legs]);

  const fittedView = useMemo(() => {
    if (projectedLegs.length === 0) return WORLD;
    const xs = projectedLegs.flatMap(p => [p.from[0], p.to[0]]);
    const ys = projectedLegs.flatMap(p => [p.from[1], p.to[1]]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const padX = Math.max(5, (maxX - minX) * 0.2);
    const padY = Math.max(3, (maxY - minY) * 0.25);
    return clamp({ x: minX - padX, y: minY - padY, w: maxX - minX + padX * 2, h: maxY - minY + padY * 2 });
  }, [projectedLegs]);

  useEffect(() => {
    setViewBox(fittedView);
  }, [fittedView]);

  const zoom = useCallback((factor: number) => {
    setViewBox(prev => {
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      const nw = prev.w * factor;
      const nh = prev.h * factor;
      return clamp({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setViewBox(prev => {
      const mouseX = ((e.clientX - rect.left) / rect.width) * prev.w + prev.x;
      const mouseY = ((e.clientY - rect.top) / rect.height) * prev.h + prev.y;
      const factor = e.deltaY > 0 ? 1.15 : 0.87;
      const nw = prev.w * factor;
      const nh = prev.h * factor;
      return clamp({
        x: mouseX - (mouseX - prev.x) * (nw / prev.w),
        y: mouseY - (mouseY - prev.y) * (nh / prev.h),
        w: nw,
        h: nh,
      });
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as Element).closest("[data-route]")) return;
    setIsPanning(true);
    setViewBox(prev => {
      panStart.current = { x: e.clientX, y: e.clientY, vx: prev.x, vy: prev.y };
      return prev;
    });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning || !panStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setViewBox(prev => {
      const dx = ((panStart.current!.x - e.clientX) / rect.width) * prev.w;
      const dy = ((panStart.current!.y - e.clientY) / rect.height) * prev.h;
      return clamp({ ...prev, x: panStart.current!.vx + dx, y: panStart.current!.vy + dy });
    });
  }, [isPanning]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  const activeLeg = selectedLeg || hoveredLeg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden mb-16"
      style={{ background: "hsl(220, 15%, 6%)" }}
    >
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        {[
          { icon: ZoomIn, action: () => zoom(0.75), label: "Zoom in" },
          { icon: ZoomOut, action: () => zoom(1.35), label: "Zoom out" },
          { icon: Maximize2, action: () => setViewBox(WORLD), label: "Reset view" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-colors"
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Route count badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[10px] tracking-[0.15em] uppercase font-medium text-white/50">
          {projectedLegs.length} Active Route{projectedLegs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* SVG Map */}
      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ paddingBottom: "50%", cursor: isPanning ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ touchAction: "none" }}
        >
          <defs>
            <radialGradient id="mapBgGlow" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="hsla(220, 15%, 10%, 1)" />
              <stop offset="100%" stopColor="hsla(220, 15%, 4%, 1)" />
            </radialGradient>
            <linearGradient id="routeGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(45, 79%, 50%)" />
              <stop offset="100%" stopColor="hsl(45, 79%, 38%)" />
            </linearGradient>
            <linearGradient id="routeGradDefault" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(45, 79%, 50%, 0.5)" />
              <stop offset="100%" stopColor="hsla(45, 79%, 38%, 0.3)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect x="0" y="0" width="100" height="50" fill="url(#mapBgGlow)" />

          {/* Grid lines — subtle */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
            <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="50" stroke="hsla(220, 10%, 20%, 0.3)" strokeWidth="0.04" />
          ))}
          {[10, 20, 25, 30, 40].map(y => (
            <line key={`gy${y}`} x1="0" y1={y} x2="100" y2={y} stroke="hsla(220, 10%, 20%, 0.3)" strokeWidth="0.04" />
          ))}

          {/* Continents — dark elevated surfaces */}
          {CONTINENT_PATHS.map((d, i) => (
            <path key={i} d={d} fill="hsla(220, 10%, 14%, 0.9)" stroke="hsla(220, 10%, 22%, 0.5)" strokeWidth="0.1" />
          ))}

          {/* Route arcs */}
          {projectedLegs.map(({ leg, from, to }) => {
            const isActive = activeLeg?.id === leg.id;
            const isSelected = selectedLeg?.id === leg.id;
            const midX = (from[0] + to[0]) / 2;
            const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
            const midY = Math.min(from[1], to[1]) - Math.min(dist * 0.3, 8);
            const strokeW = isActive ? 0.4 : 0.15;

            return (
              <g
                key={leg.id}
                data-route
                className="cursor-pointer"
                onClick={() => onLegClick(leg)}
                onPointerEnter={() => setHoveredLeg(leg)}
                onPointerLeave={() => setHoveredLeg(null)}
                style={{ transition: "opacity 0.3s" }}
                opacity={activeLeg && !isActive ? 0.25 : 1}
              >
                {/* Glow arc for active */}
                {isActive && (
                  <path
                    d={`M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`}
                    stroke="hsla(45, 79%, 50%, 0.15)"
                    strokeWidth={1.5}
                    fill="none"
                    filter="url(#glowStrong)"
                  />
                )}
                {/* Main arc */}
                <path
                  d={`M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`}
                  stroke={isActive ? "url(#routeGradActive)" : "url(#routeGradDefault)"}
                  strokeWidth={strokeW}
                  fill="none"
                  strokeDasharray={isActive ? "none" : "0.6 0.35"}
                />
                {/* Departure marker */}
                <circle cx={from[0]} cy={from[1]} r={isActive ? 0.8 : 0.4} fill="hsl(45, 79%, 50%)" filter={isActive ? "url(#glow)" : undefined} />
                {isActive && <circle cx={from[0]} cy={from[1]} r={1.4} fill="none" stroke="hsla(45, 79%, 50%, 0.25)" strokeWidth="0.15" />}
                {/* Arrival marker */}
                <circle cx={to[0]} cy={to[1]} r={isActive ? 0.8 : 0.4} fill="hsl(45, 79%, 50%)" filter={isActive ? "url(#glow)" : undefined} />
                {isActive && <circle cx={to[0]} cy={to[1]} r={1.4} fill="none" stroke="hsla(45, 79%, 50%, 0.25)" strokeWidth="0.15" />}
                {/* City labels on active */}
                {isSelected && (
                  <>
                    <text x={from[0]} y={from[1] + 2} textAnchor="middle" fill="white" fontSize="1.1" fontFamily="Inter, sans-serif" fontWeight="500">
                      {leg.departure?.icao || leg.departure?.city}
                    </text>
                    <text x={to[0]} y={to[1] + 2} textAnchor="middle" fill="white" fontSize="1.1" fontFamily="Inter, sans-serif" fontWeight="500">
                      {leg.arrival?.icao || leg.arrival?.city}
                    </text>
                  </>
                )}
                {/* Larger hit area */}
                <path
                  d={`M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`}
                  stroke="transparent"
                  strokeWidth="2.5"
                  fill="none"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredLeg && !selectedLeg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-xl border border-white/[0.08] shadow-2xl"
            style={{ background: "hsla(220, 15%, 8%, 0.95)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex items-center gap-3 text-[11px]">
              <div className="text-center">
                <span className="font-display font-semibold text-white block">{hoveredLeg.departure?.icao || hoveredLeg.departure?.iata}</span>
                <span className="text-[8px] text-white/40">{hoveredLeg.departure?.city}</span>
              </div>
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-4 h-[0.5px] bg-white/20" />
                <Plane size={10} className="text-primary" />
                <div className="w-4 h-[0.5px] bg-white/20" />
              </div>
              <div className="text-center">
                <span className="font-display font-semibold text-white block">{hoveredLeg.arrival?.icao || hoveredLeg.arrival?.iata}</span>
                <span className="text-[8px] text-white/40">{hoveredLeg.arrival?.city}</span>
              </div>
              <div className="ml-2 pl-3 border-l border-white/10">
                <span className="text-white/50 block text-[9px]">{hoveredLeg.aircraft_type}</span>
                {hoveredLeg.price ? (
                  <span className="text-primary font-medium text-[10px]">{hoveredLeg.currency} {hoveredLeg.price.toLocaleString()}</span>
                ) : (
                  <span className="text-primary/70 text-[9px]">Save up to 75%</span>
                )}
              </div>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[8px] text-white/25 tracking-wider">Click to view details</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected leg detail panel */}
      <AnimatePresence>
        {selectedLeg && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-y-0 right-0 w-full sm:w-96 z-30 overflow-y-auto border-l border-white/[0.06]"
            style={{ background: "hsla(220, 15%, 6%, 0.97)", backdropFilter: "blur(16px)" }}
          >
            {/* Aircraft image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={selectedLeg.aircraft_image || getAircraftImage(selectedLeg.aircraft_type || "midsize")}
                alt={selectedLeg.aircraft_type || "Aircraft"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsla(220,15%,6%,1)] via-[hsla(220,15%,6%,0.3)] to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-colors"
              >
                <X size={14} />
              </button>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-primary/90 text-primary-foreground">
                  {selectedLeg.aircraft_class || getAircraftCategory(selectedLeg.aircraft_type || "midsize")}
                </span>
              </div>
              <div className="absolute bottom-3 left-4">
                <p className="text-white text-[15px] font-display font-semibold">{selectedLeg.aircraft_type}</p>
              </div>
            </div>

            <div className="p-5">
              {/* Route */}
              <div className="flex items-center gap-3 mb-5">
                <div className="text-center">
                  <span className="font-display text-lg text-white font-semibold block">{selectedLeg.departure?.icao || selectedLeg.departure?.iata || "---"}</span>
                  <span className="text-[10px] text-white/40 font-light">{selectedLeg.departure?.city}</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 px-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <Plane size={12} className="text-primary" />
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="text-center">
                  <span className="font-display text-lg text-white font-semibold block">{selectedLeg.arrival?.icao || selectedLeg.arrival?.iata || "---"}</span>
                  <span className="text-[10px] text-white/40 font-light">{selectedLeg.arrival?.city}</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-white/30 text-[9px] uppercase tracking-wider block mb-0.5">Date</span>
                  <span className="text-white text-[12px] font-medium">
                    {selectedLeg.from_date ? new Date(selectedLeg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                  </span>
                </div>
                <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-white/30 text-[9px] uppercase tracking-wider block mb-0.5">Price</span>
                  <span className="text-primary text-[12px] font-medium">
                    {selectedLeg.price ? `${selectedLeg.currency} ${selectedLeg.price.toLocaleString()}` : "Save up to 75%"}
                  </span>
                </div>
                {selectedLeg.aircraft_max_pax && (
                  <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-white/30 text-[9px] uppercase tracking-wider block mb-0.5">Capacity</span>
                    <span className="text-white text-[12px] font-medium flex items-center gap-1"><Users size={11} /> {selectedLeg.aircraft_max_pax} pax</span>
                  </div>
                )}
                {selectedLeg.aircraft_range_km && (
                  <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-white/30 text-[9px] uppercase tracking-wider block mb-0.5">Range</span>
                    <span className="text-white text-[12px] font-medium">{selectedLeg.aircraft_range_km.toLocaleString()} km</span>
                  </div>
                )}
              </div>

              {selectedLeg.company && (
                <p className="text-[11px] text-white/30 font-light mb-5">Operated by {selectedLeg.company}</p>
              )}

              <a
                href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'm interested in an empty leg from ${selectedLeg.departure?.city || "?"} to ${selectedLeg.arrival?.city || "?"} on ${selectedLeg.from_date ? new Date(selectedLeg.from_date).toLocaleDateString() : "TBD"} (${selectedLeg.aircraft_type}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-300"
              >
                Request This Flight <ArrowRight size={11} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[9px] text-white/20 font-light tracking-wider">
          Scroll to zoom · Drag to pan · Click a route for details
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyLegsMapView;
