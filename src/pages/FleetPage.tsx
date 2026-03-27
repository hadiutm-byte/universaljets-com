import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useFleetAircraft, type FleetAircraft } from "@/hooks/useFleetData";
import { getAircraftImage } from "@/lib/aircraftImages";
import { Loader2, Users, Ruler, Gauge, Share2, ArrowRight, Images } from "lucide-react";
import { toast } from "sonner";
import AircraftGallery from "@/components/AircraftGallery";

const JET_CATEGORIES = [
  { label: "All Jets", filter: "" },
  { label: "Very Light", filter: "very light" },
  { label: "Light", filter: "light" },
  { label: "Midsize", filter: "midsize" },
  { label: "Super Midsize", filter: "super midsize" },
  { label: "Heavy", filter: "heavy" },
  { label: "Ultra Long Range", filter: "ultra long range" },
];

const FleetPage = () => {
  const [activeFilter, setActiveFilter] = useState("");
  const { data, isLoading } = useFleetAircraft();

  const aircraft = useMemo(() => {
    const all = data?.results || [];
    if (!activeFilter) return all;
    return all.filter(ac => {
      const cls = (ac.class_name || "").toLowerCase();
      // Exact category match: "light" should not match "very light" or "ultra long range"
      if (activeFilter === "light") return cls === "light" || cls === "light jet";
      if (activeFilter === "midsize") return cls === "midsize" || cls === "midsize jet" || cls === "mid size";
      if (activeFilter === "heavy") return cls === "heavy" || cls === "heavy jet";
      return cls.includes(activeFilter);
    });
  }, [data, activeFilter]);

  return (
    <>
      <SEOHead
        title="Fleet — Private Jet Aircraft | Universal Jets"
        description="Explore our global fleet of private jet aircraft. Light jets to ultra long-range — full specs, cabin details, and instant quote requests."
        path="/fleet"
      />
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-6 md:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-5 font-medium">Our Fleet</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">
              Aircraft <span className="text-gradient-gold italic">Collection</span>
            </h1>
            <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
              Access 7,000+ vetted aircraft worldwide. Every jet in our network is selected for safety, comfort, and performance.
            </p>
          </motion.div>
        </section>

        {/* Category filters */}
        <section className="container mx-auto px-6 md:px-8 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {JET_CATEGORIES.map((cat) => (
              <button
                key={cat.filter}
                onClick={() => setActiveFilter(cat.filter)}
                className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  activeFilter === cat.filter
                    ? "bg-[hsl(var(--selection))] text-[hsl(var(--selection-foreground))] shadow-sm"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-6 md:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : aircraft.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-sm">No aircraft found for this category.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-[11px] text-muted-foreground/50 tracking-wider mb-8">
                {aircraft.length} aircraft available
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {aircraft.map((ac, i) => (
                  <FleetCard key={ac.id} aircraft={ac} index={i} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 md:px-8 mt-20">
          <div className="text-center">
            <p className="text-[12px] text-muted-foreground font-light mb-4">
              Need a specific aircraft or have special requirements?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/request-flight"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500"
              >
                Request Custom Quote <ArrowRight size={10} />
              </Link>
              <a
                href="https://wa.me/971585918498"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground/60 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:border-primary/30 hover:text-foreground transition-all duration-500"
              >
                WhatsApp Concierge
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

/* ──── Fleet Card ──── */
function FleetCard({ aircraft, index }: { aircraft: FleetAircraft; index: number }) {
  // Always use curated local images for hero — API image_url may show painted registrations
  const imgSrc = getAircraftImage(aircraft.name);
  const rangeNm = aircraft.range_km ? Math.round(aircraft.range_km / 1.852) : null;
  const speedKts = aircraft.speed_kmh ? Math.round(aircraft.speed_kmh / 1.852) : null;

  // Build gallery images from all available photos (privacy-filtered at API level)
  const galleryImages = aircraft.images?.length
    ? aircraft.images.filter(i => i.type !== 'floor_plan' && i.type !== 'floorplan' && i.type !== 'layout')
    : [{ url: imgSrc, type: "exterior", position: 0 }];

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `${aircraft.name}${aircraft.class_name ? ` — ${aircraft.class_name}` : ""}${aircraft.max_pax ? ` | ${aircraft.max_pax} pax` : ""}${rangeNm ? ` | ${rangeNm.toLocaleString()} nm range` : ""}\n\nUniversal Jets — universaljets.com/fleet/${aircraft.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: aircraft.name, text, url: `${window.location.origin}/fleet/${aircraft.slug}` });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      }
    } catch {
      try { await navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); } catch { /* noop */ }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.6 }}
    >
      <Link
        to={`/fleet/${aircraft.slug}`}
        className="group block cursor-pointer rounded-2xl border border-border bg-card overflow-hidden card-elevated"
      >
        {/* Image Gallery */}
        <div className="relative h-52 overflow-hidden">
          <AircraftGallery
            images={galleryImages}
            floorPlanUrl={aircraft.floor_plan_url}
            aircraftType={aircraft.name}
            variant="compact"
            className="h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {aircraft.class_name && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm z-10">
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/90 font-medium">
                {aircraft.class_name}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {galleryImages.length > 1 && (
              <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-[8px] text-white/80 font-medium">
                <Images size={9} /> {galleryImages.length}
              </span>
            )}
            {aircraft.max_pax && (
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <Users size={10} className="text-foreground/60" />
                <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-foreground/70">
                  {aircraft.max_pax} pax
                </span>
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
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
          <div className="flex flex-wrap gap-3 mb-3">
            {rangeNm && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Ruler size={11} className="text-primary" />
                <span className="text-[11px] font-light">{rangeNm.toLocaleString()} nm</span>
              </div>
            )}
            {speedKts && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gauge size={11} className="text-primary" />
                <span className="text-[11px] font-light">{speedKts} kts</span>
              </div>
            )}
          </div>

          {(aircraft.cabin_height_m || aircraft.cabin_length_m || aircraft.cabin_width_m) && (
            <div className="flex gap-3 mb-3">
              {aircraft.cabin_length_m && <span className="text-[10px] text-muted-foreground/70">L {aircraft.cabin_length_m.toFixed(1)}m</span>}
              {aircraft.cabin_width_m && <span className="text-[10px] text-muted-foreground/70">W {aircraft.cabin_width_m.toFixed(1)}m</span>}
              {aircraft.cabin_height_m && <span className="text-[10px] text-muted-foreground/70">H {aircraft.cabin_height_m.toFixed(1)}m</span>}
            </div>
          )}

          {aircraft.description && (
            <p className="text-[11px] text-muted-foreground/60 font-light leading-relaxed line-clamp-2 mb-3">
              {aircraft.description}
            </p>
          )}

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium group-hover:tracking-[0.3em] transition-all duration-500">
              View Details
            </span>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:bg-muted/30 transition-all"
              aria-label="Share aircraft"
            >
              <Share2 size={12} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default FleetPage;
