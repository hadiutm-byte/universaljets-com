import { motion } from "framer-motion";
import { ArrowRight, Plane, Users, Share2 } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { useShareCard } from "@/hooks/useShareCard";

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

  const image = leg.aircraft_image || getAircraftImage(leg.aircraft_type || "midsize");
  const category = leg.aircraft_class || getAircraftCategory(leg.aircraft_type || "midsize");

  const galleryImages = leg.aircraft_images?.filter((img, i, arr) => arr.findIndex(x => x.url === img.url) === i) || [];
  const hasMultipleImages = galleryImages.length > 1;

  const { share } = useShareCard();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await share({ fromCode, fromCity, toCode, toCity, date, price: priceLabel, aircraftType: leg.aircraft_type || "Private Jet", category });
    } catch {
      // Fallback already handled inside useShareCard (download + clipboard)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="rounded-2xl border border-border bg-card overflow-hidden card-elevated group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={`${leg.aircraft_type || "Private Jet"} aircraft`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-white transition-all duration-300"
            aria-label="Share this empty leg"
          >
            <Share2 size={12} />
          </button>
          <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-primary/90 text-white">
            Empty Leg
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-[13px] font-display font-medium drop-shadow-lg">{leg.aircraft_type}</p>
        </div>
        {hasMultipleImages && (
          <div className="absolute bottom-2 right-3 flex gap-0.5">
            {galleryImages.slice(0, 5).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/50" />
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase font-light">{date}</span>
          <span className="text-[10px] tracking-[0.15em] text-primary font-medium uppercase">{priceLabel}</span>
        </div>

        {(leg.aircraft_max_pax || leg.aircraft_range_km) && (
          <div className="flex gap-3 mb-3 text-[9px] text-muted-foreground font-light">
            {leg.aircraft_max_pax && (
              <span className="flex items-center gap-1">
                <Users size={9} className="text-primary/50" /> {leg.aircraft_max_pax} pax
              </span>
            )}
            {leg.aircraft_range_km && (
              <span className="flex items-center gap-1">
                <Plane size={9} className="text-primary/50" /> {leg.aircraft_range_km.toLocaleString()} km
              </span>
            )}
          </div>
        )}

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
