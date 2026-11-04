import { useMemo, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import type { Airport } from "@/hooks/useAviapages";
import { arcPath, fitViewBox, gridLines, layoutLabels, projectMercator, useElementSize } from "@/lib/svgRouteMap";

interface QuoteRouteMapProps {
  from: Airport | null;
  to: Airport | null;
  additionalLegs?: { from: Airport | null; to: Airport | null }[];
  className?: string;
}

interface RouteSegment {
  from: [number, number];
  to: [number, number];
  fromAirport: Airport;
  toAirport: Airport;
}

function haversineKm(from: [number, number], to: [number, number]): number {
  const R = 6371;
  const dLat = ((to[1] - from[1]) * Math.PI) / 180;
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((from[1] * Math.PI) / 180) * Math.cos((to[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number): string {
  return km > 1000 ? `${(km / 1.852).toLocaleString(undefined, { maximumFractionDigits: 0 })} nm` : `${Math.round(km)} km`;
}

function flightTime(km: number): string {
  const hours = km / 800;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h > 0 ? `~${h}h ${m}m` : `~${m}m`;
}

const QuoteRouteMap = forwardRef<HTMLDivElement, QuoteRouteMapProps>(({ from, to, additionalLegs, className = "" }, _ref) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(frameRef);

  const segments = useMemo<RouteSegment[]>(() => {
    const next: RouteSegment[] = [];
    if (from?.lat != null && from?.lng != null && to?.lat != null && to?.lng != null) {
      next.push({ from: [from.lng, from.lat], to: [to.lng, to.lat], fromAirport: from, toAirport: to });
    }
    additionalLegs?.forEach((leg) => {
      if (leg.from?.lat != null && leg.from?.lng != null && leg.to?.lat != null && leg.to?.lng != null) {
        next.push({ from: [leg.from.lng, leg.from.lat], to: [leg.to.lng, leg.to.lat], fromAirport: leg.from, toAirport: leg.to });
      }
    });
    return next;
  }, [from, to, additionalLegs]);

  const projected = useMemo(
    () =>
      segments.map((segment) => ({
        ...segment,
        fromPoint: projectMercator(segment.from[1], segment.from[0]),
        toPoint: projectMercator(segment.to[1], segment.to[0]),
        fromCode: segment.fromAirport.icao || segment.fromAirport.iata || "",
        toCode: segment.toAirport.icao || segment.toAirport.iata || "",
      })),
    [segments],
  );

  const aspect = width > 0 && height > 0 ? width / height : 2.4;
  const view = useMemo(
    () => fitViewBox(projected.flatMap((s) => [s.fromPoint, s.toPoint]), { aspect, minWidth: 14, padding: 0.28 }),
    [projected, aspect],
  );
  const pxPerUnit = width > 0 ? width / view.w : 8;
  const u = (px: number) => px / pxPerUnit;
  const grid = useMemo(() => gridLines(view), [view]);
  const labels = useMemo(
    () =>
      layoutLabels(
        projected.flatMap((s) => [
          { code: s.fromCode, point: s.fromPoint },
          { code: s.toCode, point: s.toPoint },
        ]),
        view,
        pxPerUnit,
      ),
    [projected, view, pxPerUnit],
  );

  const routeInfo = useMemo(() => {
    if (segments.length === 0) return null;
    const totalKm = segments.reduce((sum, s) => sum + haversineKm(s.from, s.to), 0);
    return { distance: formatDist(totalKm), time: flightTime(totalKm), legs: segments.length };
  }, [segments]);

  const startCode = projected[0]?.fromCode;
  const endCode = projected.at(-1)?.toCode;
  const hasRoute = projected.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: hasRoute ? 1 : 0, height: hasRoute ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className={`overflow-hidden ${className}`}
      >
        <div className="relative rounded-xl overflow-hidden border border-border/30" style={{ background: "hsl(220, 18%, 10%)" }}>
          <div ref={frameRef} className="relative w-full h-[280px]">
            <svg
              viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              role="img"
              aria-label={startCode && endCode ? `Route map ${startCode} to ${endCode}` : "Route map"}
            >
              <defs>
                <linearGradient id="uj-route-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsla(43,85%,58%,0.5)" />
                  <stop offset="50%" stopColor="hsla(43,85%,58%,1)" />
                  <stop offset="100%" stopColor="hsla(43,85%,58%,0.5)" />
                </linearGradient>
                <radialGradient id="uj-route-vignette" cx="50%" cy="45%" r="75%">
                  <stop offset="0%" stopColor="hsla(220, 30%, 22%, 0.55)" />
                  <stop offset="100%" stopColor="hsla(220, 18%, 8%, 0)" />
                </radialGradient>
              </defs>

              <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="hsl(220, 18%, 10%)" />
              <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="url(#uj-route-vignette)" />

              {grid.vertical.map((x) => (
                <line key={`vx-${x}`} x1={x} y1={view.y} x2={x} y2={view.y + view.h} stroke="hsla(220,12%,55%,0.12)" strokeWidth={u(1)} />
              ))}
              {grid.horizontal.map((y) => (
                <line key={`hy-${y}`} x1={view.x} y1={y} x2={view.x + view.w} y2={y} stroke="hsla(220,12%,55%,0.12)" strokeWidth={u(1)} />
              ))}

              {projected.map((segment, i) => {
                const path = arcPath(segment.fromPoint, segment.toPoint, view.w);
                return (
                  <g key={`${segment.fromCode}-${segment.toCode}-${i}`}>
                    <path d={path} stroke="hsla(43,85%,58%,0.18)" strokeWidth={u(8)} fill="none" />
                    <path d={path} stroke="url(#uj-route-stroke)" strokeWidth={u(2)} fill="none" strokeLinecap="round" />

                    <circle cx={segment.fromPoint[0]} cy={segment.fromPoint[1]} r={u(8)} fill="hsla(43,85%,58%,0.18)" />
                    <circle cx={segment.toPoint[0]} cy={segment.toPoint[1]} r={u(8)} fill="hsla(43,85%,58%,0.18)" />
                    <circle cx={segment.fromPoint[0]} cy={segment.fromPoint[1]} r={u(3.5)} fill="hsla(43,85%,58%,1)" />
                    <circle cx={segment.toPoint[0]} cy={segment.toPoint[1]} r={u(3.5)} fill="hsla(43,85%,58%,1)" />
                  </g>
                );
              })}

              {labels.map(({ code, point, side }) => (
                <text
                  key={code}
                  x={point[0]}
                  y={point[1] + (side === 1 ? -u(11) : u(21))}
                  textAnchor="middle"
                  fontSize={u(11)}
                  fontWeight={600}
                  fill="hsla(0,0%,100%,0.85)"
                  letterSpacing={u(0.8)}
                  stroke="hsla(220,18%,10%,0.85)"
                  strokeWidth={u(3)}
                  style={{ pointerEvents: "none", fontFamily: "Inter, 'Helvetica Neue', sans-serif", paintOrder: "stroke" }}
                >
                  {code}
                </text>
              ))}
            </svg>
          </div>

          <AnimatePresence>
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 left-3 right-3 z-20"
              >
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-background/75 backdrop-blur-md border border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{startCode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-px bg-primary/40" />
                      <Plane size={10} className="text-primary" />
                      <div className="w-6 h-px bg-primary/40" />
                    </div>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{endCode}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-foreground/70 font-medium">{routeInfo.distance}</span>
                    <span className="text-[10px] text-primary font-medium">{routeInfo.time}</span>
                    {routeInfo.legs > 1 ? <span className="text-[10px] text-muted-foreground/80">{routeInfo.legs} legs</span> : null}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
QuoteRouteMap.displayName = "QuoteRouteMap";

export default QuoteRouteMap;
