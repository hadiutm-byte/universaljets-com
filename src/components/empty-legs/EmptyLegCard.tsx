import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";

interface EmptyLegCardProps {
  leg: EmptyLeg;
  index: number;
  onClick: () => void;
}

const EmptyLegCard = ({ leg, index, onClick }: EmptyLegCardProps) => {
  const fromCode = leg.departure?.icao || leg.departure?.iata || "---";
  const toCode = leg.arrival?.icao || leg.arrival?.iata || "---";
  const date = leg.from_date
    ? new Date(leg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "TBD";
  const priceLabel = leg.price
    ? `${leg.currency} ${leg.price.toLocaleString()}`
    : "Request Price";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="glass rounded-xl p-7 hover:glow-subtle transition-all duration-700 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase font-extralight">{date}</span>
        <span className="text-[9px] tracking-[0.2em] text-gold font-medium uppercase">
          {leg.price ? priceLabel : "Save up to 75%"}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <span className="font-display text-base">{fromCode}</span>
        <div className="flex-1 flex items-center gap-1.5 px-1">
          <div className="flex-1 h-[0.5px] bg-border" />
          <Plane size={10} className="text-gold/50 flex-shrink-0" />
          <div className="flex-1 h-[0.5px] bg-border" />
        </div>
        <span className="font-display text-base">{toCode}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-extralight">{leg.aircraft_type}</span>
        <ArrowRight size={10} className="text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.div>
  );
};

export default EmptyLegCard;
