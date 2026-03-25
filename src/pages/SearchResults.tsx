import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Calendar, Users, Clock, Loader2, MessageCircle, Phone, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";

interface CharterResult {
  id?: number;
  aircraft_type?: string;
  aircraft?: { type?: string; name?: string; pax?: number; range_nm?: number };
  company?: string;
  operator?: { name?: string };
  price?: number | null;
  currency?: string;
  flight_time?: string;
  dep_airport?: { name?: string; city?: string; icao?: string; iata?: string };
  arr_airport?: { name?: string; city?: string; icao?: string; iata?: string };
  isDemoResult?: boolean;
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const demoResults: CharterResult[] = [
  { id: 9001, aircraft: { type: "Light Jet", name: "Citation CJ4", pax: 9, range_nm: 2165 }, company: "Available via broker network", price: null, currency: "USD", flight_time: "Est. 2–4h", isDemoResult: true },
  { id: 9002, aircraft: { type: "Midsize", name: "Hawker 800XP", pax: 8, range_nm: 2540 }, company: "Available via broker network", price: null, currency: "USD", flight_time: "Est. 2–5h", isDemoResult: true },
  { id: 9003, aircraft: { type: "Super Midsize", name: "Challenger 350", pax: 10, range_nm: 3200 }, company: "Available via broker network", price: null, currency: "USD", flight_time: "Est. 3–6h", isDemoResult: true },
  { id: 9004, aircraft: { type: "Heavy Jet", name: "Global 6000", pax: 14, range_nm: 6000 }, company: "Available via broker network", price: null, currency: "USD", flight_time: "Est. 4–12h", isDemoResult: true },
  { id: 9005, aircraft: { type: "Ultra Long Range", name: "Gulfstream G650", pax: 16, range_nm: 7000 }, company: "Available via broker network", price: null, currency: "USD", flight_time: "Est. 5–14h", isDemoResult: true },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const apiResults: CharterResult[] = data?.results || data?.offers || (Array.isArray(data) ? data : []);
  const usingDemo = apiResults.length === 0 && !isLoading && !error;
  const results = usingDemo ? demoResults : apiResults;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back + Route header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[11px] tracking-[0.15em] uppercase font-light mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </button>

            <div className="mb-12">
              <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-4 font-medium">Charter Search Results</p>
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
                <button onClick={() => navigate("/")} className="px-8 py-3 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl">New Search</button>
                <a href="https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors">
                  <Phone size={12} /> Contact Concierge
                </a>
              </div>
            </motion.div>
          )}

          {/* Demo notice */}
          {usingDemo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-2xl border border-primary/15 bg-primary/[0.03] text-center">
              <p className="text-[13px] text-foreground/60 font-light mb-1">Instant availability is being sourced for this route.</p>
              <p className="text-[12px] text-foreground/40 font-light">Below are aircraft categories typically available. Our concierge will confirm exact pricing and availability within minutes.</p>
            </motion.div>
          )}

          {/* Results — Visual cards */}
          {!isLoading && results.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, i) => {
                const aircraftName = result.aircraft?.name || result.aircraft?.type || result.aircraft_type || "Private Jet";
                const category = getAircraftCategory(aircraftName);
                const image = getAircraftImage(aircraftName);
                const pax = result.aircraft?.pax;
                const rangeNm = result.aircraft?.range_nm;
                const price = result.price;
                const currency = result.currency || "EUR";
                const isDemo = result.isDemoResult;

                return (
                  <motion.div
                    key={result.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-[0_12px_40px_-12px_hsla(0,0%,0%,0.1)] hover:border-primary/20 transition-all duration-500"
                  >
                    {/* Aircraft image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={image}
                        alt={aircraftName}
                        loading="lazy"
                        width={800}
                        height={512}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium bg-white/90 text-foreground backdrop-blur-sm">
                          {category}
                        </span>
                      </div>
                      {isDemo && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 rounded-full text-[8px] tracking-[0.15em] uppercase font-medium bg-primary/90 text-white">
                            Typical
                          </span>
                        </div>
                      )}
                      {/* Aircraft name on image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg">{aircraftName}</h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      {/* Specs row */}
                      <div className="flex flex-wrap gap-4 mb-5 text-[11px] text-muted-foreground font-light">
                        {pax && (
                          <span className="flex items-center gap-1.5">
                            <Users size={11} className="text-primary/60" /> Up to {pax} pax
                          </span>
                        )}
                        {rangeNm && (
                          <span className="flex items-center gap-1.5">
                            <Plane size={11} className="text-primary/60" /> {rangeNm.toLocaleString()} nm
                          </span>
                        )}
                        {result.flight_time && (
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} className="text-primary/60" /> {result.flight_time}
                          </span>
                        )}
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-2 mb-5 text-[12px] text-foreground/70 font-light">
                        <span>{result.dep_airport?.city || fromLabel}</span>
                        <div className="flex-1 flex items-center gap-1 px-1">
                          <div className="flex-1 h-[0.5px] bg-border" />
                          <Plane size={10} className="text-primary/40" />
                          <div className="flex-1 h-[0.5px] bg-border" />
                        </div>
                        <span>{result.arr_airport?.city || toLabel}</span>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between">
                        {price ? (
                          <div>
                            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">From</p>
                            <p className="font-display text-xl text-foreground font-semibold">
                              {currency === "EUR" ? "€" : currency === "USD" ? "$" : currency === "GBP" ? "£" : currency}
                              {price.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Price</p>
                            <p className="font-display text-sm text-foreground/60 font-medium">On Request</p>
                          </div>
                        )}
                        <button
                          onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
                          className="px-5 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-400 hover:scale-[1.03]"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          {usingDemo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-14 text-center space-y-4">
              <p className="text-[13px] text-foreground/40 font-light">Want confirmed pricing? Speak to our aviation concierge.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))} className="flex items-center gap-2 px-8 py-3 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl">
                  <MessageCircle size={12} /> Speak to Ricky
                </button>
                <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-colors">
                  <Phone size={12} /> WhatsApp
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
