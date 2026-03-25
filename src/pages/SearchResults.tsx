import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, MapPin, Calendar, Users, Clock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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

  const results: CharterResult[] = data?.results || data?.offers || (Array.isArray(data) ? data : []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Back + Route header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[11px] tracking-[0.15em] uppercase font-light mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>

            <div className="mb-12">
              <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-4 font-light">
                Charter Search Results
              </p>
              <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight">
                {fromLabel}
                <span className="text-primary mx-3">→</span>
                {toLabel}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-muted-foreground font-light">
                {date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} /> {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
                {passengers && (
                  <span className="flex items-center gap-1.5">
                    <Users size={11} /> {passengers} passenger{Number(passengers) > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-light">
                Searching available aircraft...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-muted-foreground text-sm font-light mb-4">
                Unable to fetch results. Please try again.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm"
              >
                New Search
              </button>
            </motion.div>
          )}

          {/* No results */}
          {!isLoading && !error && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <Plane size={36} className="mx-auto text-primary/30 mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-3">No Aircraft Available</h2>
              <p className="text-muted-foreground text-sm font-light mb-8 max-w-md mx-auto">
                We couldn't find immediate availability for this route. Our concierge team can source options for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#cta"
                  onClick={(e) => { e.preventDefault(); navigate("/#cta"); }}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm"
                >
                  Contact Concierge
                </a>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 border border-border text-foreground/50 hover:text-foreground text-[9px] tracking-[0.25em] uppercase font-light rounded-sm transition-colors"
                >
                  New Search
                </button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, i) => {
                const aircraftName = result.aircraft?.name || result.aircraft?.type || result.aircraft_type || "Private Jet";
                const pax = result.aircraft?.pax;
                const operator = result.operator?.name || result.company || "";
                const price = result.price;
                const currency = result.currency || "EUR";

                return (
                  <motion.div
                    key={result.id || i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group glass-strong rounded-xl p-6 md:p-8 hover:shadow-[0_0_40px_-15px_hsl(var(--primary)/0.15)] transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Aircraft info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Plane size={14} className="text-primary" />
                          <h3 className="font-display text-lg text-foreground font-medium">
                            {aircraftName}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground font-light">
                          {operator && <span>{operator}</span>}
                          {pax && (
                            <span className="flex items-center gap-1">
                              <Users size={10} /> Up to {pax} pax
                            </span>
                          )}
                          {result.flight_time && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {result.flight_time}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-3 text-[11px] text-foreground/60 font-light">
                        <span>{result.dep_airport?.city || fromLabel}</span>
                        <ArrowLeft size={12} className="rotate-180 text-primary/40" />
                        <span>{result.arr_airport?.city || toLabel}</span>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center gap-4">
                        {price && (
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">From</p>
                            <p className="font-display text-xl text-foreground font-semibold">
                              {currency === "EUR" ? "€" : currency === "USD" ? "$" : currency === "GBP" ? "£" : currency}
                              {price.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <a
                          href="#cta"
                          onClick={(e) => { e.preventDefault(); navigate("/#cta"); }}
                          className="px-6 py-3 bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground text-[8px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] transition-all duration-400 hover:scale-[1.03]"
                        >
                          Request
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;
