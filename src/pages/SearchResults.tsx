import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Calendar, Users, Clock, Loader2, MessageCircle, Phone, Shield, Star } from "lucide-react";
import { Gauge, Ruler } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteRequestModal from "@/components/QuoteRequestModal";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { trackQuoteRequest, trackWhatsAppClick } from "@/lib/gtmEvents";

interface AircraftResult {
  id: number;
  aircraft_type: string;
  year_of_production?: number;
  max_passengers?: number;
  range_km?: number;
  speed_kmh?: number;
  images: {
    exterior?: string;
    cabin?: string;
    notail?: string;
    all?: { url: string; type: string; position: number }[];
  };
  operator: {
    id: number;
    name: string;
    city: string;
    country: string;
    logo_url?: string;
    certified: boolean;
    avg_response_time?: number;
    avg_response_rate?: number;
  };
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; aircraft?: string; operator?: string }>({ open: false });

  const from_icao = searchParams.get("from_icao") || "";
  const to_icao = searchParams.get("to_icao") || "";
  const fromLabel = searchParams.get("from_label") || from_icao;
  const toLabel = searchParams.get("to_label") || to_icao;
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "";

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
                <a
                  href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'd like to charter a flight from ${fromLabel} to ${toLabel}${date ? ` on ${date}` : ''}${passengers ? ` for ${passengers} passengers` : ''}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl inline-flex items-center gap-2"
                >
                  <MessageCircle size={12} /> Request via WhatsApp
                </a>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
                  className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors"
                >
                  Speak to Ricky
                </button>
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
                const category = getAircraftCategory(result.aircraft_type);
                const fallbackImage = getAircraftImage(result.aircraft_type);
                const displayImage = result.images.notail || result.images.exterior || fallbackImage;

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group rounded-2xl border border-border bg-card overflow-hidden card-elevated"
                  >
                    {/* Aircraft image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={displayImage}
                        alt={result.aircraft_type}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">
                          {category}
                        </span>
                      </div>

                      {/* Certified badge */}
                      {result.operator.certified && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 rounded-full text-[8px] tracking-[0.1em] uppercase font-medium bg-primary/90 text-primary-foreground flex items-center gap-1">
                            <Shield size={8} /> Verified
                          </span>
                        </div>
                      )}

                      {/* Aircraft name overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg">{result.aircraft_type}</h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
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

                      {/* Operator */}
                      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-muted/30">
                        {result.operator.logo_url ? (
                          <img src={result.operator.logo_url} alt={result.operator.name} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Plane size={14} className="text-primary/40" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-foreground font-medium truncate">{result.operator.name}</p>
                          <p className="text-[9px] text-muted-foreground font-light">
                            {result.operator.city}{result.operator.country ? `, ${result.operator.country}` : ''}
                          </p>
                        </div>
                        {result.operator.avg_response_rate && result.operator.avg_response_rate > 0.8 && (
                          <div className="flex items-center gap-0.5">
                            <Star size={9} className="text-primary fill-primary" />
                            <span className="text-[9px] text-primary font-medium">{Math.round(result.operator.avg_response_rate * 100)}%</span>
                          </div>
                        )}
                      </div>

                      {/* Cabin images preview */}
                      {result.images.cabin && (
                        <div className="mb-4 rounded-xl overflow-hidden h-20">
                          <img
                            src={result.images.cabin}
                            alt={`${result.aircraft_type} cabin`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* CTA */}
                      <a
                        href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I'm interested in chartering a ${result.aircraft_type} from ${fromLabel} to ${toLabel}${date ? ` on ${date}` : ''}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { trackQuoteRequest({ aircraft: result.aircraft_type, from: fromLabel, to: toLabel }); trackWhatsAppClick("quote_request"); }}
                        className="block w-full text-center btn-luxury px-5 py-3 text-[9px] tracking-[0.2em] uppercase font-medium rounded-xl"
                      >
                        Request Quote
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          {!isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-14 text-center space-y-4">
              <p className="text-[13px] text-foreground/40 font-light">Need a specific aircraft or have special requirements?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
    </div>
  );
};

export default SearchResults;
