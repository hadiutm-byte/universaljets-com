import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Plane, Users, Share2 } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { toast } from "sonner";

interface EmptyLegPopupProps {
  leg: EmptyLeg | null;
  onClose: () => void;
}

const EmptyLegPopup = ({ leg, onClose }: EmptyLegPopupProps) => {
  if (!leg) return null;

  const date = leg.from_date
    ? new Date(leg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "TBD";
  const image = leg.aircraft_image || getAircraftImage(leg.aircraft_type || "midsize");
  const category = leg.aircraft_class || getAircraftCategory(leg.aircraft_type || "midsize");
  const waMsg = encodeURIComponent(
    `Hello, I'm interested in an empty leg from ${leg.departure?.city || "?"} to ${leg.arrival?.city || "?"} on ${date} (${leg.aircraft_type}).`
  );

  return (
    <AnimatePresence>
      {leg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-4 md:inset-auto md:right-8 md:top-8 md:w-96 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-30"
        >
          {/* Aircraft image header */}
          <div className="relative h-36 overflow-hidden">
            <img src={image} alt={leg.aircraft_type || "Aircraft"} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <X size={12} />
            </button>
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">{category}</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <p className="text-white text-[15px] font-display font-semibold drop-shadow-lg">{leg.aircraft_type}</p>
            </div>
          </div>

          <div className="p-5">
            {/* Route */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <span className="font-display text-[15px] text-foreground font-medium block">{leg.departure?.icao || leg.departure?.iata || "---"}</span>
                <span className="text-[9px] text-muted-foreground font-light">{leg.departure?.city}</span>
              </div>
              <div className="flex-1 flex items-center gap-1 px-2">
                <div className="flex-1 h-px bg-border" />
                <Plane size={10} className="text-primary/50 flex-shrink-0" />
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="text-center">
                <span className="font-display text-[15px] text-foreground font-medium block">{leg.arrival?.icao || leg.arrival?.iata || "---"}</span>
                <span className="text-[9px] text-muted-foreground font-light">{leg.arrival?.city}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
              <div className="px-3 py-2 rounded-lg bg-muted/40">
                <span className="text-muted-foreground font-light block text-[9px] mb-0.5">Date</span>
                <span className="text-foreground font-medium">{date}</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted/40">
                <span className="text-muted-foreground font-light block text-[9px] mb-0.5">Price</span>
                <span className="text-primary font-medium">{leg.price ? `${leg.currency} ${leg.price.toLocaleString()}` : "Save up to 75%"}</span>
              </div>
              {leg.aircraft_max_pax && (
                <div className="px-3 py-2 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground font-light block text-[9px] mb-0.5">Capacity</span>
                  <span className="text-foreground font-medium flex items-center gap-1"><Users size={10} /> {leg.aircraft_max_pax} pax</span>
                </div>
              )}
              {leg.aircraft_range_km && (
                <div className="px-3 py-2 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground font-light block text-[9px] mb-0.5">Range</span>
                  <span className="text-foreground font-medium">{leg.aircraft_range_km.toLocaleString()} km</span>
                </div>
              )}
            </div>

            {leg.company && (
              <p className="text-[10px] text-muted-foreground font-light mb-4">Operated by {leg.company}</p>
            )}

            <div className="flex gap-2">
              <a
                href={`https://wa.me/447888999944?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 btn-luxury text-[9px] tracking-[0.25em] uppercase font-medium rounded-xl text-center"
              >
                Request This Flight
              </a>
              <button
                onClick={async () => {
                  const shareText = `✈️ Empty Leg Deal — ${leg.aircraft_type || "Private Jet"}\n${leg.departure?.city || "?"} → ${leg.arrival?.city || "?"}\n📅 ${date}\n💰 ${leg.price ? `${leg.currency} ${leg.price.toLocaleString()}` : "Save up to 75%"}\n\nBook now at Universal Jets\nhttps://www.universaljets.com`;
                  if (navigator.share) {
                    try { await navigator.share({ title: `Empty Leg: ${leg.departure?.city} → ${leg.arrival?.city}`, text: shareText }); } catch {}
                  } else {
                    await navigator.clipboard.writeText(shareText);
                    toast.success("Copied to clipboard");
                  }
                }}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Share"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmptyLegPopup;
