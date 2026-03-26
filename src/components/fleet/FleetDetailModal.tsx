import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Ruler, Gauge, ArrowRight, Plane, Share2, Phone, MessageCircle, Copy, Check } from "lucide-react";
import type { AircraftType } from "@/hooks/useAviapages";
import { getAircraftImage } from "@/lib/aircraftImages";
import AircraftGallery from "@/components/AircraftGallery";

interface FleetDetailModalProps {
  aircraft: AircraftType | null;
  open: boolean;
  onClose: () => void;
  onRequestQuote: (aircraft: AircraftType) => void;
}

const FleetDetailModal = ({ aircraft, open, onClose, onRequestQuote }: FleetDetailModalProps) => {
  const [shared, setShared] = useState(false);

  if (!aircraft) return null;

  const imgSrc = aircraft.image_url || getAircraftImage(aircraft.name);
  const rangeNm = aircraft.range_km ? Math.round(aircraft.range_km / 1.852) : null;
  const speedKts = aircraft.speed_kmh ? Math.round(aircraft.speed_kmh / 1.852) : null;

  const galleryImages = aircraft.image_url
    ? [{ url: aircraft.image_url, type: "exterior" }]
    : [{ url: getAircraftImage(aircraft.name), type: "exterior" }];

  const specs: { label: string; value: string }[] = [];
  if (aircraft.max_pax) specs.push({ label: "Passengers", value: `Up to ${aircraft.max_pax}` });
  if (rangeNm) specs.push({ label: "Range", value: `${rangeNm.toLocaleString()} nm` });
  if (speedKts) specs.push({ label: "Cruise Speed", value: `${speedKts} kts` });
  if (aircraft.altitude_m) specs.push({ label: "Ceiling", value: `${Math.round(aircraft.altitude_m * 3.281).toLocaleString()} ft` });
  if (aircraft.cabin_length_m) specs.push({ label: "Cabin Length", value: `${aircraft.cabin_length_m.toFixed(1)} m` });
  if (aircraft.cabin_width_m) specs.push({ label: "Cabin Width", value: `${aircraft.cabin_width_m.toFixed(1)} m` });
  if (aircraft.cabin_height_m) specs.push({ label: "Cabin Height", value: `${aircraft.cabin_height_m.toFixed(1)} m` });
  if (aircraft.luggage_volume_m3) specs.push({ label: "Luggage Volume", value: `${aircraft.luggage_volume_m3.toFixed(1)} m³` });
  if (aircraft.engine_type) specs.push({ label: "Engine Type", value: aircraft.engine_type });
  if (aircraft.engine_count) specs.push({ label: "Engines", value: String(aircraft.engine_count) });

  const handleShare = async () => {
    const shareText = `${aircraft.name}${aircraft.class_name ? ` — ${aircraft.class_name}` : ""}${aircraft.max_pax ? ` | ${aircraft.max_pax} pax` : ""}${rangeNm ? ` | ${rangeNm.toLocaleString()} nm range` : ""}\n\nUniversal Jets — universaljets.com`;

    if (navigator.share) {
      try {
        await navigator.share({ title: aircraft.name, text: shareText, url: window.location.href });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Gallery */}
            <AircraftGallery
              images={galleryImages}
              aircraftType={aircraft.name}
              variant="full"
              className="h-72 md:h-80"
            />

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  {aircraft.class_name && (
                    <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">{aircraft.class_name}</p>
                  )}
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{aircraft.name}</h2>
                  {aircraft.manufacturer && (
                    <p className="text-[12px] text-muted-foreground mt-1">{aircraft.manufacturer}</p>
                  )}
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/30 transition-colors"
                >
                  {shared ? <Check size={12} className="text-green-500" /> : <Share2 size={12} className="text-muted-foreground" />}
                  <span className="text-[9px] tracking-wider uppercase text-muted-foreground">{shared ? "Copied" : "Share"}</span>
                </button>
              </div>

              {/* Description */}
              {aircraft.description && (
                <p className="text-[13px] text-muted-foreground font-light leading-[1.9] mb-8">{aircraft.description}</p>
              )}

              {/* Specs Grid */}
              {specs.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4 font-medium">Specifications</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specs.map((s) => (
                      <div key={s.label} className="p-3 rounded-xl bg-muted/50">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">{s.label}</p>
                        <p className="text-[14px] font-medium text-foreground">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onRequestQuote(aircraft)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plane size={14} />
                  Request This Aircraft
                </button>
                <a
                  href="https://wa.me/971585918498"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-border text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                >
                  <MessageCircle size={14} />
                  Talk to Advisor
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FleetDetailModal;
