import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, X, Users, ArrowRight, Share2 } from "lucide-react";
import AircraftGallery from "@/components/AircraftGallery";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { useShareCard } from "@/hooks/useShareCard";
import { arcPath, fitViewBox, gridLines, layoutLabels, useElementSize } from "@/lib/svgRouteMap";

interface EmptyLegsMapViewProps {
  legs: EmptyLeg[];
  selectedLeg: EmptyLeg | null;
  onLegClick: (leg: EmptyLeg) => void;
  onClose: () => void;
  toMapCoords: (lat: number | null | undefined, lng: number | null | undefined) => [number, number];
  isLiveData: boolean;
}

const EmptyLegsMapView = ({ legs, selectedLeg, onLegClick, onClose, toMapCoords, isLiveData }: EmptyLegsMapViewProps) => {
  const [hoveredLeg, setHoveredLeg] = useState<EmptyLeg | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(frameRef);

  const projectedLegs = useMemo(() => {
    return legs.filter((leg) => {
      if (!leg.departure || !leg.arrival) return false;
      return leg.departure.lat != null && leg.departure.lng != null
        && leg.arrival.lat != null && leg.arrival.lng != null;
    });
  }, [legs]);

  const routes = useMemo(
    () =>
      projectedLegs.map((leg) => ({
        leg,
        from: toMapCoords(leg.departure?.lat, leg.departure?.lng),
        to: toMapCoords(leg.arrival?.lat, leg.arrival?.lng),
        fromCode: leg.departure?.icao || leg.departure?.iata || "",
        toCode: leg.arrival?.icao || leg.arrival?.iata || "",
      })),
    [projectedLegs, toMapCoords],
  );

  const aspect = width > 0 && height > 0 ? width / height : 2;
  const viewBox = useMemo(
    () => fitViewBox(routes.flatMap((r) => [r.from, r.to]), { aspect, minWidth: 18 }),
    [routes, aspect],
  );

  // Pixel-stable sizing: everything is expressed in world units derived from px.
  const pxPerUnit = width > 0 ? width / viewBox.w : 11;
  const u = (px: number) => px / pxPerUnit;
  const grid = useMemo(() => gridLines(viewBox), [viewBox]);
  const labels = useMemo(
    () =>
      layoutLabels(
        routes.flatMap((r) => [
          { code: r.fromCode, point: r.from },
          { code: r.toCode, point: r.to },
        ]),
        viewBox,
        pxPerUnit,
      ),
    [routes, viewBox, pxPerUnit],
  );

  const activeLeg = selectedLeg || hoveredLeg;
  const activeCodes = new Set(
    activeLeg
      ? [activeLeg.departure?.icao || activeLeg.departure?.iata || "", activeLeg.arrival?.icao || activeLeg.arrival?.iata || ""]
      : [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden mb-16 border border-border/30"
      style={{ background: "hsl(220, 18%, 10%)" }}
    >
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-md border border-border/50 text-[10px] tracking-[0.15em] uppercase font-medium text-muted-foreground">
          {routes.length} Active Route{routes.length !== 1 ? "s" : ""} {isLiveData ? "· Live" : "· Curated"}
        </span>
      </div>

      <div ref={frameRef} className="w-full h-[420px] sm:h-[560px] relative">
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          role="img"
          aria-label={`Map of ${routes.length} empty leg routes`}
        >
          <defs>
            <linearGradient id="uj-empty-legs-route" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsla(43, 74%, 52%, 0.45)" />
              <stop offset="50%" stopColor="hsla(43, 85%, 58%, 1)" />
              <stop offset="100%" stopColor="hsla(43, 74%, 52%, 0.45)" />
            </linearGradient>
            <radialGradient id="uj-empty-legs-vignette" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="hsla(220, 30%, 22%, 0.55)" />
              <stop offset="100%" stopColor="hsla(220, 18%, 8%, 0)" />
            </radialGradient>
          </defs>

          <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="hsl(220, 18%, 10%)" />
          <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="url(#uj-empty-legs-vignette)" />

          {grid.vertical.map((x) => (
            <line key={`vx-${x}`} x1={x} y1={viewBox.y} x2={x} y2={viewBox.y + viewBox.h} stroke="hsla(220,12%,55%,0.12)" strokeWidth={u(1)} />
          ))}
          {grid.horizontal.map((y) => (
            <line key={`hy-${y}`} x1={viewBox.x} y1={y} x2={viewBox.x + viewBox.w} y2={y} stroke="hsla(220,12%,55%,0.12)" strokeWidth={u(1)} />
          ))}

          {routes.map((route, i) => {
            const isActive = activeLeg?.id === route.leg.id;
            const dimmed = !!activeLeg && !isActive;
            const path = arcPath(route.from, route.to, viewBox.w);
            return (
              <g
                key={`${route.leg.id}-${i}`}
                onMouseEnter={() => setHoveredLeg(route.leg)}
                onMouseLeave={() => setHoveredLeg(null)}
                onClick={() => onLegClick(route.leg)}
                className="cursor-pointer"
                style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 200ms ease" }}
              >
                {/* Wide transparent hit area so thin arcs are easy to tap */}
                <path d={path} stroke="transparent" strokeWidth={u(22)} fill="none" />
                <path d={path} stroke="hsla(43, 74%, 52%, 0.18)" strokeWidth={u(isActive ? 9 : 6)} fill="none" />
                <path
                  d={path}
                  stroke="url(#uj-empty-legs-route)"
                  strokeWidth={u(isActive ? 2.4 : 1.6)}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={isActive ? undefined : `${u(6)} ${u(4)}`}
                />

                <circle cx={route.from[0]} cy={route.from[1]} r={u(isActive ? 9 : 7)} fill="hsla(43, 85%, 58%, 0.18)" />
                <circle cx={route.to[0]} cy={route.to[1]} r={u(isActive ? 9 : 7)} fill="hsla(43, 85%, 58%, 0.18)" />
                <circle cx={route.from[0]} cy={route.from[1]} r={u(isActive ? 4 : 3)} fill="hsla(43, 85%, 58%, 1)" />
                <circle cx={route.to[0]} cy={route.to[1]} r={u(isActive ? 4 : 3)} fill="hsla(43, 85%, 58%, 1)" />
              </g>
            );
          })}

          {labels.map(({ code, point, side }) => {
            const highlighted = activeCodes.has(code);
            const dy = side === 1 ? -u(10) : u(20);
            return (
              <text
                key={code}
                x={point[0]}
                y={point[1] + dy}
                textAnchor="middle"
                fontSize={u(11)}
                fontWeight={highlighted ? 600 : 500}
                fill={highlighted ? "hsla(43,85%,62%,1)" : "hsla(0,0%,100%,0.72)"}
                letterSpacing={u(0.8)}
                style={{ pointerEvents: "none", fontFamily: "Inter, 'Helvetica Neue', sans-serif", paintOrder: "stroke" }}
                stroke="hsla(220,18%,10%,0.85)"
                strokeWidth={u(3)}
              >
                {code}
              </text>
            );
          })}
        </svg>
      </div>

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

      <AnimatePresence>{selectedLeg && <SelectedLegPanel leg={selectedLeg} onClose={onClose} />}</AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[9px] text-muted-foreground/40 font-light tracking-wider">Tap a route for details</p>
      </div>
    </motion.div>
  );
};

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
