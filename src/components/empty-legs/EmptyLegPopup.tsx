import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";

interface EmptyLegPopupProps {
  leg: EmptyLeg | null;
  onClose: () => void;
}

const EmptyLegPopup = ({ leg, onClose }: EmptyLegPopupProps) => {
  if (!leg) return null;

  const date = leg.from_date
    ? new Date(leg.from_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "TBD";

  return (
    <AnimatePresence>
      {leg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-4 md:inset-auto md:right-8 md:top-8 md:w-80 glass-strong rounded-xl p-6 z-20"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gold/70 mb-4 font-light">{date}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-display text-lg">{leg.departure?.city || "Unknown"}</span>
            <ArrowRight size={14} className="text-gold/50" />
            <span className="font-display text-lg">{leg.arrival?.city || "Unknown"}</span>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground font-extralight">Aircraft</span>
              <span className="text-foreground/80 font-light">{leg.aircraft_type}</span>
            </div>
            {leg.price && (
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-extralight">Price</span>
                <span className="text-gold font-medium">{leg.currency} {leg.price.toLocaleString()}</span>
              </div>
            )}
            {leg.company && (
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-extralight">Operator</span>
                <span className="text-foreground/80 font-light">{leg.company}</span>
              </div>
            )}
          </div>
          <a
            href="#cta"
            className="block w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-md text-center hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
          >
            Request This Flight
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmptyLegPopup;
