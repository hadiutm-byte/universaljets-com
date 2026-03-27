import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface AircraftGalleryProps {
  images: { url: string; type: string }[];
  floorPlanUrl?: string | null;
  aircraftType: string;
  /** Compact mode for cards (shows dots), full mode for detail views */
  variant?: "compact" | "full";
  className?: string;
}

const AircraftGallery = ({ images, floorPlanUrl, aircraftType, variant = "full", className = "" }: AircraftGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  // Filter duplicates by URL
  const uniqueImages = images.filter((img, i, arr) => arr.findIndex((x) => x.url === img.url) === i);
  const totalCount = uniqueImages.length + (floorPlanUrl ? 1 : 0);

  if (uniqueImages.length === 0) return null;

  // Human-readable image type labels
  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      exterior: "Exterior",
      cabin: "Cabin",
      interior: "Interior",
      cockpit: "Cockpit",
      galley: "Galley",
      lavatory: "Lavatory",
      floor_plan: "Floor Plan",
      floorplan: "Floor Plan",
      layout: "Layout",
      detail: "Detail",
    };
    return map[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const displayUrl = showFloorPlan && floorPlanUrl ? floorPlanUrl : uniqueImages[current]?.url;
  const displayAlt = showFloorPlan ? `${aircraftType} floor plan` : `${aircraftType} — ${typeLabel(uniqueImages[current]?.type || "photo")}`;

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (showFloorPlan) {
      setShowFloorPlan(false);
      setCurrent(0);
    } else if (current < uniqueImages.length - 1) {
      setCurrent(current + 1);
    } else if (floorPlanUrl) {
      setShowFloorPlan(true);
    }
  };

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (showFloorPlan) {
      setShowFloorPlan(false);
      setCurrent(uniqueImages.length - 1);
    } else if (current > 0) {
      setCurrent(current - 1);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={displayUrl}
          alt={displayAlt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {totalCount > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {uniqueImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setShowFloorPlan(false); setCurrent(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current && !showFloorPlan ? "bg-white w-3" : "bg-white/40"}`}
              />
            ))}
            {floorPlanUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowFloorPlan(true); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${showFloorPlan ? "bg-primary w-3" : "bg-white/40"}`}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant with nav arrows
  return (
    <>
      <div className={`relative overflow-hidden group rounded-xl ${className}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={showFloorPlan ? "floor" : current}
            src={displayUrl}
            alt={displayAlt}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightbox(true)}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {totalCount > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
            {uniqueImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setShowFloorPlan(false); setCurrent(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current && !showFloorPlan ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"}`}
              />
            ))}
            {floorPlanUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowFloorPlan(!showFloorPlan); }}
                className={`text-[7px] font-medium px-1.5 rounded-full transition-all ${showFloorPlan ? "bg-primary text-primary-foreground" : "bg-white/20 text-white/70 hover:bg-white/30"}`}
              >
                FP
              </button>
            )}
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
        >
          <Maximize2 size={12} />
        </button>

        {/* Image type label */}
        {!showFloorPlan && uniqueImages[current]?.type && uniqueImages[current].type !== "exterior" && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[8px] text-white/70 tracking-wider uppercase">
            {typeLabel(uniqueImages[current].type)}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X size={18} />
            </button>

            <img
              src={displayUrl}
              alt={displayAlt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {totalCount > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-sm">
              {uniqueImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setShowFloorPlan(false); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === current && !showFloorPlan ? "bg-white w-4" : "bg-white/30"}`}
                />
              ))}
              {floorPlanUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowFloorPlan(!showFloorPlan); }}
                  className={`text-[8px] font-medium px-2 rounded-full ${showFloorPlan ? "bg-primary text-primary-foreground" : "bg-white/20 text-white/60"}`}
                >
                  Floor Plan
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AircraftGallery;
