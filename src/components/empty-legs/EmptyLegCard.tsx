import { motion } from "framer-motion";
import { ArrowRight, Plane, Users, Clock } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";

interface EmptyLegCardProps {
  leg: EmptyLeg;
  index: number;
  onClick: () => void;
}

const EmptyLegCard = ({ leg, index, onClick }: EmptyLegCardProps) => {
  const fromCode = leg.departure?.icao || leg.departure?.iata || "---";
  const toCode = leg.arrival?.icao || leg.arrival?.iata || "---";
  const fromCity = leg.departure?.city || "";
  const toCity = leg.arrival?.city || "";
  const date = leg.from_date
    ? new Date(leg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "TBD";
  const priceLabel = leg.price
    ? `${leg.currency} ${leg.price.toLocaleString()}`
    : "Save up to 75%";

  const image = getAircraftImage(leg.aircraft_type || "midsize");
  const category = getAircraftCategory(leg.aircraft_type || "midsize");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-[0_12px_40px_-12px_hsla(0,0%,0%,0.1)] hover:border-primary/20 transition-all duration-500 group cursor-pointer"
      onClick={onClick}
    >
      {/* Aircraft image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={leg.aircraft_type || "Private Jet"}
          loading="lazy"
          width={800}
          height={512}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-primary/90 text-white">
            Empty Leg
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-[13px] font-display font-medium drop-shadow-lg">{leg.aircraft_type}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase font-light">{date}</span>
          <span className="text-[10px] tracking-[0.15em] text-primary font-medium uppercase">{priceLabel}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="text-center">
            <span className="font-display text-[15px] text-foreground font-medium block">{fromCode}</span>
            {fromCity && <span className="text-[9px] text-muted-foreground font-light">{fromCity}</span>}
          </div>
          <div className="flex-1 flex items-center gap-1 px-2">
            <div className="flex-1 h-[0.5px] bg-border" />
            <Plane size={10} className="text-primary/50 flex-shrink-0" />
            <div className="flex-1 h-[0.5px] bg-border" />
          </div>
          <div className="text-center">
            <span className="font-display text-[15px] text-foreground font-medium block">{toCode}</span>
            {toCity && <span className="text-[9px] text-muted-foreground font-light">{toCity}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-light">Request availability</span>
          <ArrowRight size={12} className="text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyLegCard;
