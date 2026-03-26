import { motion } from "framer-motion";
import { Users, Gauge, Ruler, Share2 } from "lucide-react";
import type { AircraftType } from "@/hooks/useAviapages";
import { getAircraftImage } from "@/lib/aircraftImages";

interface FleetAircraftCardProps {
  aircraft: AircraftType;
  index: number;
  onClick: () => void;
}

const FleetAircraftCard = ({ aircraft, index, onClick }: FleetAircraftCardProps) => {
  const imgSrc = aircraft.image_url || getAircraftImage(aircraft.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.6 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden card-elevated"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgSrc}
          alt={aircraft.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        {aircraft.class_name && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/90 font-medium">
              {aircraft.class_name}
            </span>
          </div>
        )}

        {/* Pax badge */}
        {aircraft.max_pax && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <Users size={10} className="text-foreground/60" />
            <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-foreground/70">
              {aircraft.max_pax} pax
            </span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg leading-tight">
            {aircraft.name}
          </h3>
          {aircraft.manufacturer && (
            <p className="text-[10px] text-white/70 tracking-[0.15em] uppercase mt-1">{aircraft.manufacturer}</p>
          )}
        </div>
      </div>

      {/* Specs */}
      <div className="p-5">
        <div className="flex flex-wrap gap-3 mb-4">
          {aircraft.range_km && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Ruler size={11} className="text-primary" />
              <span className="text-[11px] font-light">{Math.round(aircraft.range_km / 1.852).toLocaleString()} nm</span>
            </div>
          )}
          {aircraft.speed_kmh && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge size={11} className="text-primary" />
              <span className="text-[11px] font-light">{Math.round(aircraft.speed_kmh / 1.852)} kts</span>
            </div>
          )}
          {aircraft.engine_type && (
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{aircraft.engine_type}</span>
          )}
        </div>

        {/* Cabin dims */}
        {(aircraft.cabin_height_m || aircraft.cabin_length_m || aircraft.cabin_width_m) && (
          <div className="flex gap-3 mb-4">
            {aircraft.cabin_length_m && (
              <span className="text-[10px] text-muted-foreground/70">L {aircraft.cabin_length_m.toFixed(1)}m</span>
            )}
            {aircraft.cabin_width_m && (
              <span className="text-[10px] text-muted-foreground/70">W {aircraft.cabin_width_m.toFixed(1)}m</span>
            )}
            {aircraft.cabin_height_m && (
              <span className="text-[10px] text-muted-foreground/70">H {aircraft.cabin_height_m.toFixed(1)}m</span>
            )}
          </div>
        )}

        {aircraft.description && (
          <p className="text-[12px] text-muted-foreground font-light leading-relaxed line-clamp-2 mb-4">
            {aircraft.description}
          </p>
        )}

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium group-hover:tracking-[0.3em] transition-all duration-500">
            View Details
          </span>
          <Share2 size={12} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

export default FleetAircraftCard;
