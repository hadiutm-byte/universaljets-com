import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { EmptyLeg } from "@/hooks/useAviapages";
import EmptyLegPopup from "./EmptyLegPopup";
import { WORLD_VIEWBOX, clampMapViewBox, fitMapViewToLegs } from "./mapUtils";

interface EmptyLegsMapViewProps {
  legs: EmptyLeg[];
  selectedLeg: EmptyLeg | null;
  onLegClick: (leg: EmptyLeg) => void;
  onClose: () => void;
  toMapCoords: (lat: number | null | undefined, lng: number | null | undefined) => [number, number];
}

const EmptyLegsMapView = ({ legs, selectedLeg, onLegClick, onClose, toMapCoords }: EmptyLegsMapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState(WORLD_VIEWBOX);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const fittedViewBox = useMemo(() => fitMapViewToLegs(legs, toMapCoords), [legs, toMapCoords]);

  useEffect(() => {
    setViewBox(fittedViewBox);
  }, [fittedViewBox]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setViewBox((current) => {
      const mouseX = ((e.clientX - rect.left) / rect.width) * current.w + current.x;
      const mouseY = ((e.clientY - rect.top) / rect.height) * current.h + current.y;
      const factor = e.deltaY > 0 ? 1.15 : 0.87;
      const newW = current.w * factor;
      const newH = current.h * factor;

      return clampMapViewBox({
        x: mouseX - (mouseX - current.x) * (newW / current.w),
        y: mouseY - (mouseY - current.y) * (newH / current.h),
        w: newW,
        h: newH,
      });
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as Element;
    if (target.closest("button, [data-map-action='route']")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [viewBox]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning || !panStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((panStart.current.x - e.clientX) / rect.width) * viewBox.w;
    const dy = ((panStart.current.y - e.clientY) / rect.height) * viewBox.h;
    setViewBox((prev) => clampMapViewBox({ ...prev, x: panStart.current!.vx + dx, y: panStart.current!.vy + dy }));
  }, [isPanning, viewBox.w, viewBox.h]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  const resetZoom = () => setViewBox(WORLD_VIEWBOX);
  const fitRoutes = () => setViewBox(fittedViewBox);
  const isZoomed = viewBox.w < 99;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative glass rounded-2xl p-6 md:p-10 mb-16 overflow-hidden"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            setViewBox((current) => {
              const factor = 0.8;
              const newW = current.w * factor;
              const newH = current.h * factor;
              const cx = current.x + current.w / 2;
              const cy = current.y + current.h / 2;

              return clampMapViewBox({
                x: cx - newW / 2,
                y: cy - newH / 2,
                w: newW,
                h: newH,
              });
            });
          }}
          className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-foreground/50 hover:text-foreground text-sm font-light transition-colors"
        >
          +
        </button>
        <button
          onClick={() => {
            setViewBox((current) => {
              const factor = 1.25;
              const newW = current.w * factor;
              const newH = current.h * factor;
              const cx = current.x + current.w / 2;
              const cy = current.y + current.h / 2;

              return clampMapViewBox({
                x: cx - newW / 2,
                y: cy - newH / 2,
                w: newW,
                h: newH,
              });
            });
          }}
          className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-foreground/50 hover:text-foreground text-sm font-light transition-colors"
        >
          −
        </button>
        <button
          onClick={fitRoutes}
          className="px-3 h-8 rounded-lg glass-panel flex items-center justify-center text-[8px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground font-light transition-colors"
        >
          Fit
        </button>
        {isZoomed && (
          <button
            onClick={resetZoom}
            className="px-3 h-8 rounded-lg glass-panel flex items-center justify-center text-[8px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground font-light transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[9px] text-foreground/25 font-extralight tracking-wider">
          Scroll to zoom • Drag to pan • Click routes for details
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ paddingBottom: "45%", cursor: isPanning ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="absolute inset-0 w-full h-full transition-[viewBox] duration-100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ touchAction: "none" }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="45" fill="hsl(var(--card))" />
          <rect x="0" y="0" width="100" height="45" fill="url(#mapGlow)" />

          {/* Simplified world continents */}
          <path d="M10 12 L28 10 L30 18 L28 28 L22 32 L18 30 L12 22 L8 16 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />
          <path d="M22 32 L28 30 L30 38 L26 44 L20 42 L18 36 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />
          <path d="M42 10 L55 8 L56 18 L52 22 L46 20 L42 16 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />
          <path d="M42 22 L56 20 L58 36 L50 42 L44 38 L42 28 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />
          <path d="M56 8 L85 6 L88 20 L82 30 L68 32 L58 24 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />
          <path d="M78 34 L90 32 L92 40 L84 42 Z" fill="hsl(var(--muted) / 0.32)" stroke="hsl(var(--border) / 0.9)" strokeWidth="0.16" />

          {/* Grid dots */}
          {[...Array(10)].map((_, xi) =>
            [...Array(5)].map((_, yi) => (
              <circle key={`${xi}-${yi}`} cx={5 + xi * 10} cy={4.5 + yi * 9} r="0.15" fill="hsl(var(--muted-foreground) / 0.18)" />
            ))
          )}

          {/* Route lines */}
          {legs.map((leg) => {
            if (!leg.departure || !leg.arrival) return null;
            if (leg.departure.lat == null || leg.departure.lng == null || leg.arrival.lat == null || leg.arrival.lng == null) return null;
            const from = toMapCoords(leg.departure.lat, leg.departure.lng);
            const to = toMapCoords(leg.arrival.lat, leg.arrival.lng);
            if (isNaN(from[0]) || isNaN(from[1]) || isNaN(to[0]) || isNaN(to[1])) return null;
            const midX = (from[0] + to[0]) / 2;
            const midY = Math.min(from[1], to[1]) - 3;
            return (
              <g key={leg.id} className="cursor-pointer" data-map-action="route" onClick={() => onLegClick(leg)}>
                <path
                  d={`M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`}
                  stroke="hsl(var(--primary) / 0.12)"
                  strokeWidth="0.7"
                  fill="none"
                />
                <path
                  d={`M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`}
                  stroke="hsl(var(--primary) / 0.62)"
                  strokeWidth="0.28"
                  fill="none"
                  strokeDasharray="1 0.55"
                />
                <circle cx={from[0]} cy={from[1]} r="0.78" fill="hsl(var(--primary))" />
                <circle cx={from[0]} cy={from[1]} r="1.45" fill="none" stroke="hsl(var(--primary) / 0.28)" strokeWidth="0.12" className="animate-pulse-glow" />
                <circle cx={to[0]} cy={to[1]} r="0.78" fill="hsl(var(--primary))" />
                <circle cx={to[0]} cy={to[1]} r="1.45" fill="none" stroke="hsl(var(--primary) / 0.28)" strokeWidth="0.12" className="animate-pulse-glow" />
              </g>
            );
          })}
        </svg>

        {/* Labels */}
        {legs.map((leg) => {
          if (!leg.departure) return null;
          const coords = toMapCoords(leg.departure.lat, leg.departure.lng);
          const relX = ((coords[0] - viewBox.x) / viewBox.w) * 100;
          const relY = ((coords[1] - viewBox.y) / viewBox.h) * 100;
          if (relX < -5 || relX > 105 || relY < -5 || relY > 105) return null;
          return (
            <button
              key={leg.id}
              onClick={() => onLegClick(leg)}
              className="absolute transform -translate-x-1/2 -translate-y-full group z-10"
              style={{ left: `${relX}%`, top: `${relY}%` }}
            >
              <span className="hidden md:block text-[8px] tracking-[0.15em] text-primary/60 uppercase whitespace-nowrap group-hover:text-primary transition-colors mb-1">
                {leg.departure.icao || leg.departure.iata}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-muted-foreground font-light">
        <span>{legs.length} live routes mapped</span>
        <span>Click a route marker to open flight details</span>
      </div>

      <EmptyLegPopup leg={selectedLeg} onClose={onClose} />
    </motion.div>
  );
};

export default EmptyLegsMapView;