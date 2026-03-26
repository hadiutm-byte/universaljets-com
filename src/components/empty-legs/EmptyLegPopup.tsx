import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Plane, Users, Share2, MessageCircle, Download, Copy } from "lucide-react";
import type { EmptyLeg } from "@/hooks/useAviapages";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { useCrmApi } from "@/hooks/useCrmApi";
import { useShareCard } from "@/hooks/useShareCard";
import AircraftGallery from "@/components/AircraftGallery";
import MembershipUpsell from "@/components/MembershipUpsell";
import QuoteRouteMap from "@/components/QuoteRouteMap";
import type { Airport } from "@/hooks/useAviapages";
import AIRPORT_COORDS from "@/lib/airportCoords";

interface EmptyLegPopupProps {
  leg: EmptyLeg | null;
  onClose: () => void;
}

const EmptyLegPopup = ({ leg, onClose }: EmptyLegPopupProps) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { capture } = useCrmApi();
  const { share, download, copyText } = useShareCard();

  if (!leg) return null;

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
  const galleryImages = leg.aircraft_images?.length ? leg.aircraft_images : [{ url: image, type: "exterior" }];

  const shareData = { fromCode, fromCity, toCode, toCity, date, price: priceLabel, aircraftType: leg.aircraft_type || "Private Jet", category };

  const handleSubmitRequest = async () => {
    if (!form.name.trim() || !form.email.includes("@")) return;
    setSubmitting(true);
    try {
      await capture({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        departure: `${fromCity || fromCode}`,
        destination: `${toCity || toCode}`,
        date: leg.from_date || undefined,
        aircraft: leg.aircraft_type || undefined,
        source: "empty_leg_popup",
        notes: `Empty leg interest: ${leg.aircraft_type} ${fromCode}→${toCode} on ${date}. ${priceLabel}`,
      });
    } catch { /* best-effort */ }
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleShare = async () => {
    try {
      await share(shareData);
    } catch {
      setShowShareMenu(true);
    }
  };

  return (
    <AnimatePresence>
      {leg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-4 md:inset-auto md:right-8 md:top-8 md:w-96 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-30 max-h-[calc(100%-2rem)] overflow-y-auto"
        >
          {/* Gallery */}
          <div className="relative h-40 overflow-hidden">
            <AircraftGallery
              images={galleryImages}
              floorPlanUrl={leg.aircraft_floor_plan}
              aircraftType={leg.aircraft_type || "Aircraft"}
              variant="compact"
              className="h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
              <X size={12} />
            </button>
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">{category}</span>
            </div>
            <div className="absolute bottom-3 left-3 z-10">
              <p className="text-white text-[15px] font-display font-semibold drop-shadow-lg">{leg.aircraft_type}</p>
            </div>
          </div>

          <div className="p-5">
            {/* Route */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <span className="font-display text-[15px] text-foreground font-medium block">{fromCode}</span>
                <span className="text-[9px] text-muted-foreground font-light">{fromCity}</span>
              </div>
              <div className="flex-1 flex items-center gap-1 px-2">
                <div className="flex-1 h-px bg-border" />
                <Plane size={10} className="text-primary/50 flex-shrink-0" />
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="text-center">
                <span className="font-display text-[15px] text-foreground font-medium block">{toCode}</span>
                <span className="text-[9px] text-muted-foreground font-light">{toCity}</span>
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
                <span className="text-primary font-medium">{priceLabel}</span>
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

            {/* Operator name hidden from B2C — privacy policy */}

            {/* Request form or CTA */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-3 space-y-3">
                  <p className="text-[12px] text-primary font-medium mb-1">Request Received ✓</p>
                  <p className="text-[10px] text-muted-foreground font-light">We'll get back to you within the hour.</p>
                  <MembershipUpsell variant="inline" showReferral={false} className="text-left mt-3" />
                </motion.div>
              ) : showRequestForm ? (
                <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2.5 mb-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name *"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30 text-[12px] text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30"
                    maxLength={100}
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email *"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30 text-[12px] text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30"
                    maxLength={255}
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone / WhatsApp"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30 text-[12px] text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30"
                    maxLength={30}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="px-4 py-2.5 border border-border/40 text-muted-foreground text-[9px] tracking-[0.15em] uppercase font-light rounded-xl transition-colors hover:text-foreground"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitRequest}
                      disabled={submitting || !form.name.trim() || !form.email.includes("@")}
                      className="flex-1 py-2.5 btn-luxury text-[9px] tracking-[0.25em] uppercase font-medium rounded-xl disabled:opacity-40"
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="flex-1 py-3 btn-luxury text-[9px] tracking-[0.25em] uppercase font-medium rounded-xl text-center"
                  >
                    Request This Flight
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    aria-label="Share"
                  >
                    <Share2 size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp secondary */}
            {!submitted && !showRequestForm && (
              <a
                href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'm interested in an empty leg from ${fromCity || fromCode} to ${toCity || toCode} on ${date} (${leg.aircraft_type}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 border border-border/30 text-muted-foreground hover:text-foreground text-[9px] tracking-[0.15em] uppercase font-light rounded-xl transition-colors"
              >
                <MessageCircle size={10} /> Talk to Advisor
              </a>
            )}

            {/* Share menu fallback */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/30 space-y-2"
                >
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-medium mb-2">Share</p>
                  <button onClick={() => { download(shareData); setShowShareMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-[11px] text-foreground font-light transition-colors">
                    <Download size={12} className="text-primary/60" /> Download Branded Card
                  </button>
                  <button onClick={() => { copyText(shareData); setShowShareMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-[11px] text-foreground font-light transition-colors">
                    <Copy size={12} className="text-primary/60" /> Copy Details
                  </button>
                  <button onClick={() => setShowShareMenu(false)} className="w-full text-center py-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmptyLegPopup;
