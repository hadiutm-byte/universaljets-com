import { motion } from "framer-motion";
import type { EmptyLeg } from "@/hooks/useAviapages";
import EmptyLegPopup from "./EmptyLegPopup";

interface EmptyLegsMapViewProps {
  legs: EmptyLeg[];
  selectedLeg: EmptyLeg | null;
  onLegClick: (leg: EmptyLeg) => void;
  onClose: () => void;
  toMapCoords: (lat: number | null, lng: number | null) => [number, number];
}

const EmptyLegsMapView = ({ legs, selectedLeg, onLegClick, onClose, toMapCoords }: EmptyLegsMapViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative glass rounded-2xl p-6 md:p-10 mb-16 overflow-hidden"
    >
      <div className="relative w-full" style={{ paddingBottom: "45%" }}>
        <svg
          viewBox="0 0 100 45"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsla(38,52%,50%,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100" height="45" fill="url(#mapGlow)" />

          {/* Simplified world continents */}
          <path d="M10 12 L28 10 L30 18 L28 28 L22 32 L18 30 L12 22 L8 16 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
          <path d="M22 32 L28 30 L30 38 L26 44 L20 42 L18 36 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
          <path d="M42 10 L55 8 L56 18 L52 22 L46 20 L42 16 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
          <path d="M42 22 L56 20 L58 36 L50 42 L44 38 L42 28 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
          <path d="M56 8 L85 6 L88 20 L82 30 L68 32 L58 24 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
          <path d="M78 34 L90 32 L92 40 L84 42 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />

          {/* Grid dots */}
          {[...Array(10)].map((_, xi) =>
            [...Array(5)].map((_, yi) => (
              <circle key={`${xi}-${yi}`} cx={5 + xi * 10} cy={4.5 + yi * 9} r="0.15" fill="hsla(0,0%,100%,0.05)" />
            ))
          )}

          {/* Route lines from API data */}
          {legs.map((leg) => {
            if (!leg.departure || !leg.arrival) return null;
            const from = toMapCoords(leg.departure.lat, leg.departure.lng);
            const to = toMapCoords(leg.arrival.lat, leg.arrival.lng);
            return (
              <g key={leg.id}>
                <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="hsla(38,52%,50%,0.25)" strokeWidth="0.2" strokeDasharray="0.8 0.4" />
                <circle cx={from[0]} cy={from[1]} r="0.6" fill="hsla(38,52%,50%,0.8)" className="cursor-pointer" onClick={() => onLegClick(leg)} />
                <circle cx={from[0]} cy={from[1]} r="1.2" fill="none" stroke="hsla(38,52%,50%,0.2)" strokeWidth="0.1" className="animate-pulse-glow" />
                <circle cx={to[0]} cy={to[1]} r="0.6" fill="hsla(38,52%,50%,0.8)" className="cursor-pointer" onClick={() => onLegClick(leg)} />
                <circle cx={to[0]} cy={to[1]} r="1.2" fill="none" stroke="hsla(38,52%,50%,0.2)" strokeWidth="0.1" className="animate-pulse-glow" />
              </g>
            );
          })}
        </svg>

        {/* Clickable overlay labels */}
        {legs.map((leg) => {
          if (!leg.departure) return null;
          const coords = toMapCoords(leg.departure.lat, leg.departure.lng);
          return (
            <button
              key={leg.id}
              onClick={() => onLegClick(leg)}
              className="absolute transform -translate-x-1/2 -translate-y-full group z-10"
              style={{ left: `${coords[0]}%`, top: `${coords[1]}%` }}
            >
              <span className="hidden md:block text-[8px] tracking-[0.15em] text-gold/60 uppercase whitespace-nowrap group-hover:text-gold transition-colors mb-1">
                {leg.departure.icao || leg.departure.iata}
              </span>
            </button>
          );
        })}
      </div>

      <EmptyLegPopup leg={selectedLeg} onClose={onClose} />
    </motion.div>
  );
};

export default EmptyLegsMapView;
