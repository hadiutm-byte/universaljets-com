import { motion } from "framer-motion";
import { Plane, ArrowRight, Radio, AlertTriangle, Loader2 } from "lucide-react";
import { useEmptyLegs, type EmptyLeg } from "@/hooks/useAviapages";
import { useMemo } from "react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

const fallbackRoutes = [
  { from: "Dubai", to: "London", status: "Available now", statusColor: "text-emerald-600", urgency: null },
  { from: "Nice", to: "Ibiza", status: "Available now", statusColor: "text-emerald-600", urgency: "Limited availability" },
  { from: "Riyadh", to: "Geneva", status: "Available now", statusColor: "text-emerald-600", urgency: null },
  { from: "Paris", to: "Mykonos", status: "Available now", statusColor: "text-emerald-600", urgency: null },
];

function formatLegStatus(leg: EmptyLeg) {
  const now = new Date();
  const fromDate = new Date(leg.from_date);
  const hoursUntil = (fromDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil < 0) return { status: "Available now", statusColor: "text-emerald-600", urgency: null };
  if (hoursUntil < 24) return { status: "Departing today", statusColor: "text-primary", urgency: "Limited availability" };
  if (hoursUntil < 72) return { status: "Available now", statusColor: "text-emerald-600", urgency: null };
  return { status: "Available now", statusColor: "text-emerald-600", urgency: null };
}

const LiveMarketSection = () => {
  const { data, isLoading } = useEmptyLegs("All");

  const routes = useMemo(() => {
    if (!data?.results?.length) return fallbackRoutes;
    return data.results
      .filter((leg) => leg.departure && leg.arrival)
      .slice(0, 6)
      .map((leg) => {
        const { status, statusColor, urgency } = formatLegStatus(leg);
        const from = leg.departure!.city || leg.departure!.name;
        const to = leg.arrival!.city || leg.arrival!.name;
        const aircraft = leg.aircraft_type;
        const price = leg.price;
        const currency = leg.currency || "USD";
        const pax = leg.aircraft_max_pax;
        return { from, to, status, statusColor, urgency, aircraft, price, currency, pax };
      });
  }, [data]);

  const liveCount = data?.count || 0;
  const availableNow = data?.results?.length || 0;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        {/* Header */}
        <FadeReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 font-light">
              Live Market Intelligence
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
            Market{" "}
            <span className="text-gradient-gold italic">Opportunities</span>
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted-foreground font-light leading-[2] max-w-md mx-auto mb-2">
            Real-time positioning flights and demand alerts — updated continuously.
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-extralight tracking-wide">
            {liveCount > 0
              ? `Live global availability: ${liveCount} empty legs · ${availableNow} shown`
              : "Live global availability: updated continuously"}
          </p>
        </FadeReveal>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
          </div>
        )}

        {/* Route cards */}
        {!isLoading && (
          <StaggerContainer className="max-w-2xl mx-auto space-y-4">
            {routes.map((route, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="rounded-xl glass-panel px-6 py-5 md:px-8 md:py-6 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                      <Plane className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" strokeWidth={1.3} />
                      <p className="text-[14px] md:text-[18px] font-display font-medium text-foreground/80 tracking-wide truncate">
                        {route.from}
                      </p>
                      <ArrowRight className="w-3.5 h-3.5 text-foreground/20 flex-shrink-0" strokeWidth={1.5} />
                      <p className="text-[14px] md:text-[18px] font-display font-medium text-foreground/80 tracking-wide truncate">
                        {route.to}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 pl-7 md:pl-0">
                      {"price" in route && (route as any).price && (
                        <p className="text-[11px] text-primary/70 font-light">
                          {(route as any).currency === "EUR" ? "€" : "$"}
                          {Number((route as any).price).toLocaleString()}
                        </p>
                      )}
                      <p className={`text-[10px] md:text-[11px] font-light ${route.statusColor}`}>
                        {route.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    {"aircraft" in route && (route as any).aircraft && (
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground font-extralight">
                        {String((route as any).aircraft)}{(route as any).pax ? ` · ${(route as any).pax} pax` : ""}
                      </p>
                    )}
                    {route.urgency && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-primary/50" strokeWidth={1.3} />
                        <motion.p
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-[9px] tracking-[0.2em] uppercase text-primary/60 font-light"
                        >
                          {route.urgency}
                        </motion.p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Market alert */}
        <FadeReveal delay={0.3}>
          <div className="max-w-2xl mx-auto mt-5 rounded-xl glass-panel p-5 md:p-6 flex items-start gap-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full border border-primary/15 bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Radio className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.3} />
            </motion.div>
            <div className="flex-1">
              <p className="text-[9px] tracking-[0.3em] uppercase text-primary/50 font-light mb-2">
                Market Alert
              </p>
              <p className="text-[12px] text-foreground/60 font-light mb-1">
                Monaco Grand Prix — high demand, limited availability.
              </p>
              <p className="text-[11px] text-muted-foreground font-extralight leading-[1.8]">
                Early booking recommended to secure preferred aircraft.
              </p>
            </div>
          </div>
        </FadeReveal>

        {/* CTA */}
        <FadeReveal delay={0.4} className="text-center pt-10">
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)]"
          >
            Request Your Flight
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.a>
        </FadeReveal>
      </div>
    </section>
  );
};

export default LiveMarketSection;
