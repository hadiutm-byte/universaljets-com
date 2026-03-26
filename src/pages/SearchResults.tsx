import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Calendar, Users, Clock, Loader2, MessageCircle, Phone, Shield, Wifi, BedDouble, Briefcase, MapPin, Navigation } from "lucide-react";
import { Gauge, Ruler } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteRequestModal from "@/components/QuoteRequestModal";
import AircraftGallery from "@/components/AircraftGallery";
import MembershipUpsell from "@/components/MembershipUpsell";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { trackQuoteRequest, trackWhatsAppClick } from "@/lib/gtmEvents";
import AIRPORT_COORDS from "@/lib/airportCoords";
import {
  greatCircleDistanceNm,
  estimateFlightTimeMin,
  getCharterPrice,
  formatDuration,
  formatDistance,
} from "@/lib/pricingEstimates";

interface AircraftResult {
  id: number;
  aircraft_type: string;
  aircraft_class?: string | null;
  manufacturer?: string | null;
  year_of_production?: number | null;
  max_passengers?: number | null;
  range_km?: number | null;
  speed_kmh?: number | null;
  cabin_height_m?: number | null;
  cabin_width_m?: number | null;
  cabin_length_m?: number | null;
  luggage_volume_m3?: number | null;
  sleeping_places?: number | null;
  amenities?: string[];
  price?: number | null;
  price_currency?: string;
  price_unit?: string | null;
  estimated_flight_time_min?: number | null;
  engine_type?: string | null;
  engine_count?: number | null;
  images: {
    exterior?: string | null;
    cabin?: string | null;
    floor_plan?: string | null;
    all?: { url: string; type: string; position: number }[];
  };
  operator: {
    id: number;
    name: string;
    city: string;
    country: string;
    logo_url?: string | null;
    certified: boolean;
    avg_response_time?: number | null;
    avg_response_rate?: number | null;
  };
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; aircraft?: string }>({ open: false });

  const from_icao = searchParams.get("from_icao") || "";
  const to_icao = searchParams.get("to_icao") || "";
  const fromLabel = searchParams.get("from_label") || from_icao;
  const toLabel = searchParams.get("to_label") || to_icao;
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "";

  // Calculate route distance
  const routeInfo = useMemo(() => {
    const fromCoords = AIRPORT_COORDS[from_icao];
    const toCoords = AIRPORT_COORDS[to_icao];
    if (!fromCoords || !toCoords) return null;
    const distanceNm = greatCircleDistanceNm(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
    return { distanceNm };
  }, [from_icao, to_icao]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["charter-search", from_icao, to_icao, date, passengers],
    queryFn: async () => {
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-charter-search`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from_icao, to_icao, date, passengers }),
        }
      );
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: !!from_icao && !!to_icao,
  });

  const results: AircraftResult[] = data?.results || [];
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back + Route header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[11px] tracking-[0.15em] uppercase font-light mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Search
            </button>

            <div className="mb-12">
              <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-4 font-medium">Available Aircraft</p>
              <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight">
                {fromLabel} <span className="text-primary mx-3">→</span> {toLabel}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-[12px] text-muted-foreground font-light">
                {date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
                {passengers && (
                  <span className="flex items-center gap-1.5">
                    <Users size={12} /> {passengers} passenger{Number(passengers) > 1 ? "s" : ""}
                  </span>
                )}
                {routeInfo && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Navigation size={12} className="text-primary/60" /> {formatDistance(routeInfo.distanceNm)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-[12px] tracking-[0.2em] uppercase text-muted-foreground font-light">Searching available aircraft...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
              <p className="text-muted-foreground text-sm font-light mb-4">Unable to fetch results. Please try again or contact our concierge.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => navigate("/")} className="btn-luxury px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl">New Search</button>
                <a href="https://wa.me/447888999944" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors">
                  <Phone size={12} /> Contact Concierge
                </a>
              </div>
            </motion.div>
          )}

          {/* No results */}
          {!isLoading && !error && !hasResults && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <Plane size={40} className="text-primary/20 mx-auto mb-6" />
              <h3 className="font-display text-2xl text-foreground mb-3">No Instant Availability</h3>
              <p className="text-[13px] text-muted-foreground font-light mb-2 max-w-md mx-auto">
                No operators have instant availability for this route right now.
              </p>
              <p className="text-[12px] text-muted-foreground/60 font-light mb-8 max-w-md mx-auto">
                Our concierge team can source aircraft from our global network within minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setQuoteModal({ open: true })}
                  className="btn-luxury px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl inline-flex items-center gap-2"
                >
                  Request Quote
                </button>
                <a
                  href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'd like to charter a flight from ${fromLabel} to ${toLabel}${date ? ` on ${date}` : ''}${passengers ? ` for ${passengers} passengers` : ''}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors"
                >
                  <MessageCircle size={12} /> WhatsApp Advisor
                </a>
              </div>
            </motion.div>
          )}

          {/* Results count */}
          {!isLoading && hasResults && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-muted-foreground font-light mb-8">
              {results.length} aircraft available for this route
            </motion.p>
          )}

          {/* Results grid */}
          {!isLoading && hasResults && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, i) => {
                const category = result.aircraft_class || getAircraftCategory(result.aircraft_type);
                const fallbackImage = getAircraftImage(result.aircraft_type);
                const displayImage = result.images.exterior || fallbackImage;

                // Build gallery images array
                const galleryImages = (result.images.all || [])
                  .filter(img => img.type !== 'tail' && img.type !== 'registration')
                  .map(img => ({ url: img.url, type: img.type }));
                if (galleryImages.length === 0 && displayImage) {
                  galleryImages.push({ url: displayImage, type: "exterior" });
                }

                // Smart pricing
                const flightTimeMin = result.estimated_flight_time_min ||
                  (routeInfo ? estimateFlightTimeMin(routeInfo.distanceNm, category, result.speed_kmh) : null);

                const pricing = getCharterPrice({
                  price: result.price,
                  priceCurrency: result.price_currency,
                  priceUnit: result.price_unit,
                  aircraftClass: category,
                  distanceNm: routeInfo?.distanceNm,
                  flightTimeMin,
                  speedKmh: result.speed_kmh,
                });

                return (
                  <motion.div
                    key={`${result.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group rounded-2xl border border-border bg-card overflow-hidden card-elevated"
                  >
                    {/* Aircraft gallery */}
                    <div className="relative h-52 overflow-hidden">
                      <AircraftGallery
                        images={galleryImages}
                        floorPlanUrl={result.images.floor_plan}
                        aircraftType={result.aircraft_type}
                        variant="compact"
                        className="h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">
                          {category}
                        </span>
                      </div>

                      {/* Certified badge */}
                      {result.operator.certified && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[8px] tracking-[0.1em] uppercase font-medium bg-primary/90 text-primary-foreground flex items-center gap-1">
                            <Shield size={8} /> Verified
                          </span>
                        </div>
                      )}

                      {/* Aircraft name overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg">{result.aircraft_type}</h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      {/* Price row — always visible */}
                      <div className="mb-4 pb-3 border-b border-border/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`font-display text-[16px] font-semibold ${
                              pricing.variant === "exact" ? "text-primary" :
                              pricing.variant === "estimate" ? "text-foreground" :
                              "text-muted-foreground"
                            }`}>
                              {pricing.display}
                            </span>
                            {pricing.variant === "estimate" && (
                              <p className="text-[9px] text-primary/40 font-medium mt-0.5 tracking-[0.05em]">Indicative range · Quote to confirm</p>
                            )}
                            {pricing.variant === "request" && (
                              <p className="text-[9px] text-muted-foreground/50 mt-0.5">Contact our team for pricing</p>
                            )}
                          </div>
                          {flightTimeMin && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-light">
                              <Clock size={11} className="text-primary/60" />
                              {formatDuration(flightTimeMin)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Specs row */}
                      <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-muted-foreground font-light">
                        {result.max_passengers && (
                          <span className="flex items-center gap-1.5">
                            <Users size={11} className="text-primary/60" /> {result.max_passengers} pax
                          </span>
                        )}
                        {result.year_of_production && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-primary/60" /> {result.year_of_production}
                          </span>
                        )}
                        {result.range_km && (
                          <span className="flex items-center gap-1.5">
                            <Ruler size={11} className="text-primary/60" /> {result.range_km.toLocaleString()} km
                          </span>
                        )}
                        {result.speed_kmh && (
                          <span className="flex items-center gap-1.5">
                            <Gauge size={11} className="text-primary/60" /> {result.speed_kmh.toLocaleString()} km/h
                          </span>
                        )}
                      </div>

                      {/* Amenities */}
                      {result.amenities && result.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {result.amenities.slice(0, 4).map(a => (
                            <span key={a} className="px-2 py-0.5 rounded-full text-[8px] tracking-[0.1em] uppercase bg-muted/30 text-muted-foreground/70 border border-border/20">
                              {a}
                            </span>
                          ))}
                          {result.amenities.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] text-muted-foreground/50">
                              +{result.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Cabin details */}
                      {(result.cabin_length_m || result.cabin_width_m || result.sleeping_places) && (
                        <div className="flex flex-wrap gap-3 mb-4 text-[10px] text-muted-foreground/60 font-light">
                          {result.cabin_length_m && result.cabin_width_m && (
                            <span>Cabin {result.cabin_length_m}m × {result.cabin_width_m}m</span>
                          )}
                          {result.cabin_height_m && (
                            <span>Height {result.cabin_height_m}m</span>
                          )}
                          {result.sleeping_places && (
                            <span className="flex items-center gap-1">
                              <BedDouble size={9} /> {result.sleeping_places} beds
                            </span>
                          )}
                        </div>
                      )}

                      {/* Operator hidden from B2C — privacy policy. Show verified badge instead */}
                      {result.operator.certified && (
                        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-muted/30">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield size={14} className="text-primary/60" />
                          </div>
                          <div>
                            <p className="text-[11px] text-foreground font-medium">Verified Operator</p>
                            <p className="text-[9px] text-muted-foreground font-light">ARGUS / WYVERN certified</p>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={() => {
                          trackQuoteRequest({ aircraft: result.aircraft_type, from: fromLabel, to: toLabel });
                          setQuoteModal({ open: true, aircraft: result.aircraft_type });
                        }}
                        className="block w-full text-center btn-luxury px-5 py-3 text-[9px] tracking-[0.2em] uppercase font-medium rounded-xl"
                      >
                        Request Quote
                      </button>
                      <a
                        href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'm interested in chartering a ${result.aircraft_type} from ${fromLabel} to ${toLabel}${date ? ` on ${date}` : ''}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick("quote_request")}
                        className="w-full mt-2 px-5 py-2.5 border border-border/40 text-muted-foreground hover:text-foreground text-[9px] tracking-[0.15em] uppercase font-light rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={10} /> Talk to Advisor
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Membership upsell after results */}
          {!isLoading && hasResults && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 max-w-md mx-auto">
              <MembershipUpsell variant="inline" showReferral={false} />
            </motion.div>
          )}

          {/* Bottom CTA */}
          {!isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-14 text-center space-y-4">
              <p className="text-[13px] text-foreground/40 font-light">Need a specific aircraft or have special requirements?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setQuoteModal({ open: true })}
                  className="btn-luxury px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl"
                >
                  Request Custom Quote
                </button>
                <a
                  href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'd like to charter a private jet from ${fromLabel} to ${toLabel}${date ? ` on ${date}` : ''}${passengers ? ` for ${passengers} passengers` : ''}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors"
                >
                  <Phone size={12} /> WhatsApp Concierge
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Quote Request Modal */}
      <QuoteRequestModal
        open={quoteModal.open}
        onClose={() => setQuoteModal({ open: false })}
        flightData={{
          fromLabel,
          toLabel,
          fromIcao: from_icao,
          toIcao: to_icao,
          date,
          passengers,
          aircraft: quoteModal.aircraft,
          // operatorName omitted — B2C privacy policy
        }}
      />
    </div>
  );
};

export default SearchResults;
