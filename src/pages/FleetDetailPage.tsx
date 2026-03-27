import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AircraftGallery from "@/components/AircraftGallery";
import QuoteRequestModal from "@/components/QuoteRequestModal";
import { useFleetAircraftBySlug } from "@/hooks/useFleetData";
import { getAircraftImage } from "@/lib/aircraftImages";
import { Loader2, Users, Ruler, Gauge, Plane, MessageCircle, Share2, Check, ArrowLeft, Mountain, Box, Cog } from "lucide-react";
import { useState } from "react";

const FleetDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: aircraft, isLoading, error } = useFleetAircraftBySlug(slug);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [shared, setShared] = useState(false);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !aircraft) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
          <p className="text-muted-foreground">Aircraft not found.</p>
          <Link to="/fleet" className="text-primary text-sm hover:underline">← Back to Fleet</Link>
        </div>
        <Footer />
      </>
    );
  }

  const rangeNm = aircraft.range_km ? Math.round(aircraft.range_km / 1.852) : null;
  const speedKts = aircraft.speed_kmh ? Math.round(aircraft.speed_kmh / 1.852) : null;
  // Always use curated local images — API image_url may show painted registrations
  const fallbackImage = getAircraftImage(aircraft.name);

  const sanitizedGalleryImages = aircraft.images?.filter(
    (i) => i.type !== "floor_plan" && i.type !== "floorplan" && i.type !== "layout"
  ) ?? [];

  const galleryImages = sanitizedGalleryImages.length > 0
    ? sanitizedGalleryImages
    : [{ url: fallbackImage, type: "exterior", position: 0 }];

  // Build specs
  const specs: { label: string; value: string; icon?: React.ReactNode }[] = [];
  if (aircraft.max_pax) specs.push({ label: "Passengers", value: `Up to ${aircraft.max_pax}`, icon: <Users size={14} /> });
  if (rangeNm) specs.push({ label: "Range", value: `${rangeNm.toLocaleString()} nm`, icon: <Ruler size={14} /> });
  if (speedKts) specs.push({ label: "Cruise Speed", value: `${speedKts} kts`, icon: <Gauge size={14} /> });
  if (aircraft.altitude_m) specs.push({ label: "Max Ceiling", value: `${Math.round(aircraft.altitude_m * 3.281).toLocaleString()} ft`, icon: <Mountain size={14} /> });
  if (aircraft.cabin_length_m) specs.push({ label: "Cabin Length", value: `${aircraft.cabin_length_m.toFixed(1)} m` });
  if (aircraft.cabin_width_m) specs.push({ label: "Cabin Width", value: `${aircraft.cabin_width_m.toFixed(1)} m` });
  if (aircraft.cabin_height_m) specs.push({ label: "Cabin Height", value: `${aircraft.cabin_height_m.toFixed(1)} m` });
  if (aircraft.luggage_volume_m3) specs.push({ label: "Luggage", value: `${aircraft.luggage_volume_m3.toFixed(1)} m³`, icon: <Box size={14} /> });
   if (aircraft.engine_type) specs.push({ label: "Engine Type", value: aircraft.engine_type, icon: <Cog size={14} /> });
   if (aircraft.engine_count) specs.push({ label: "Engines", value: String(aircraft.engine_count) });
   if (aircraft.range_typical_km) {
     const typicalNm = Math.round(aircraft.range_typical_km / 1.852);
     specs.push({ label: "Typical Range", value: `${typicalNm.toLocaleString()} nm` });
   }
   if (aircraft.range_ferry_km) {
     const ferryNm = Math.round(aircraft.range_ferry_km / 1.852);
     specs.push({ label: "Ferry Range", value: `${ferryNm.toLocaleString()} nm` });
   }

  // Route suitability
  const suitability: string[] = [];
  if (rangeNm) {
    if (rangeNm < 2000) suitability.push("Regional flights", "Day trips", "Short hops");
    else if (rangeNm < 4000) suitability.push("Cross-country", "Europe-wide", "Business travel");
    else if (rangeNm < 6000) suitability.push("Transcontinental", "Coast-to-coast", "Long-haul business");
    else suitability.push("Intercontinental", "Non-stop global", "VIP & heads of state");
  }

  const handleShare = async () => {
    const text = `${aircraft.name}${aircraft.class_name ? ` — ${aircraft.class_name}` : ""}${aircraft.max_pax ? ` | ${aircraft.max_pax} pax` : ""}${rangeNm ? ` | ${rangeNm.toLocaleString()} nm range` : ""}\n\nUniversal Jets — universaljets.com/fleet/${aircraft.slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: aircraft.name, text, url: window.location.href }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <>
      <SEOHead
        title={`${aircraft.name} — Private Jet Charter | Universal Jets`}
        description={`Charter the ${aircraft.name}. ${aircraft.max_pax ? `Up to ${aircraft.max_pax} passengers.` : ""} ${rangeNm ? `Range: ${rangeNm.toLocaleString()} nm.` : ""} Request a quote today.`}
        path={`/fleet/${aircraft.slug}`}
      />
      <Navbar />

      <main className="min-h-screen bg-background pt-20 pb-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 md:px-8 py-4">
          <Link to="/fleet" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={12} /> Back to Fleet
          </Link>
        </div>

        {/* Gallery */}
        <section className="container mx-auto px-6 md:px-8 mb-10">
          <AircraftGallery
            images={galleryImages}
            floorPlanUrl={aircraft.floor_plan_url}
            aircraftType={aircraft.name}
            variant="full"
            className="h-72 md:h-96 lg:h-[28rem] rounded-2xl"
          />
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 md:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {aircraft.class_name && (
                      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">{aircraft.class_name}</p>
                    )}
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{aircraft.name}</h1>
                    {aircraft.manufacturer && (
                      <p className="text-[13px] text-muted-foreground mt-2">{aircraft.manufacturer}</p>
                    )}
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/30 transition-colors"
                  >
                    {shared ? <Check size={12} className="text-primary" /> : <Share2 size={12} className="text-muted-foreground" />}
                    <span className="text-[9px] tracking-wider uppercase text-muted-foreground">{shared ? "Copied" : "Share"}</span>
                  </button>
                </div>

                {/* Key stats */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {aircraft.max_pax && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50">
                      <Users size={14} className="text-primary" />
                      <span className="text-[13px] font-medium text-foreground">{aircraft.max_pax} pax</span>
                    </div>
                  )}
                  {rangeNm && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50">
                      <Ruler size={14} className="text-primary" />
                      <span className="text-[13px] font-medium text-foreground">{rangeNm.toLocaleString()} nm</span>
                    </div>
                  )}
                  {speedKts && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50">
                      <Gauge size={14} className="text-primary" />
                      <span className="text-[13px] font-medium text-foreground">{speedKts} kts</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              {aircraft.description && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
                  <h2 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4 font-medium">About this Aircraft</h2>
                  <div className="text-[13px] text-muted-foreground font-light leading-[2] space-y-4">
                    {aircraft.description.split('\n').filter(Boolean).slice(0, 4).map((p, i) => (
                      <p key={i}>{p.trim()}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Specs Grid */}
              {specs.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10">
                  <h2 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4 font-medium">Specifications</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specs.map((s) => (
                      <div key={s.label} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          {s.icon && <span className="text-primary">{s.icon}</span>}
                          <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60">{s.label}</p>
                        </div>
                        <p className="text-[15px] font-medium text-foreground">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Route suitability */}
              {suitability.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-10">
                  <h2 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4 font-medium">Best Suited For</h2>
                  <div className="flex flex-wrap gap-2">
                    {suitability.map((s) => (
                      <span key={s} className="px-4 py-2 rounded-full bg-primary/[0.06] text-primary text-[11px] font-medium tracking-wide">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Sticky CTA sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-6 space-y-4"
                >
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">Charter This Aircraft</p>
                  <p className="text-[13px] text-muted-foreground font-light leading-relaxed">
                    Speak to our team for availability, pricing, and tailored itinerary planning.
                  </p>

                  <button
                    onClick={() => setQuoteOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500"
                  >
                    <Plane size={14} />
                    Request Quote
                  </button>

                  <a
                    href="https://wa.me/447888999944"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                  >
                    <MessageCircle size={14} />
                    Talk to Advisor
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quote Modal */}
      <QuoteRequestModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        flightData={{
          fromLabel: "",
          toLabel: "",
          fromIcao: "",
          toIcao: "",
          aircraft: aircraft.name,
        }}
      />

      <Footer />
    </>
  );
};

export default FleetDetailPage;
