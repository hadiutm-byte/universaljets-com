import { motion } from "framer-motion";
import { Plane, ArrowRight, Radio, AlertTriangle, Loader2 } from "lucide-react";
import { useEmptyLegs, type EmptyLeg } from "@/hooks/useAviapages";
import { useMemo } from "react";

const fallbackRoutes = [
  { from: "Dubai", to: "London", status: "Available now", statusColor: "text-emerald-400/70", urgency: null },
  { from: "Nice", to: "Ibiza", status: "Available now", statusColor: "text-emerald-400/70", urgency: "Limited availability" },
  { from: "Riyadh", to: "Geneva", status: "Available now", statusColor: "text-emerald-400/70", urgency: null },
  { from: "Paris", to: "Mykonos", status: "Available now", statusColor: "text-emerald-400/70", urgency: null },
];

function formatLegStatus(leg: EmptyLeg) {
  const now = new Date();
  const fromDate = new Date(leg.from_date);
  const hoursUntil = (fromDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil < 0) return { status: "Available now", statusColor: "text-emerald-400/70", urgency: null };
  if (hoursUntil < 24) return { status: "Departing today", statusColor: "text-primary/60", urgency: "Limited availability" };
  if (hoursUntil < 72) return { status: "Available now", statusColor: "text-emerald-400/70", urgency: null };
  return { status: "Available now", statusColor: "text-emerald-400/70", urgency: null };
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
        return { from, to, status, statusColor, urgency, aircraft, price, currency };
      });
  }, [data]);

  const liveCount = data?.count || 0;
  const availableNow = data?.results?.length || 0;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsla(38,52%,50%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(38,52%,50%,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(228,22%,4%)] to-background pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-emerald-500/70"
            />
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 font-light">
              Live Market Intelligence
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
            Market{" "}
            <span className="text-gradient-gold italic">Opportunities</span>
          </h2>
          <p className="text-[12px] md:text-[13px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto mb-2">
            Real-time positioning flights and demand alerts — updated continuously.
          </p>
          <p className="text-[9px] text-foreground/20 font-extralight tracking-wide">
            {liveCount > 0
              ? `Live global availability: ${liveCount} empty legs · ${availableNow} shown`
              : "Live global availability: updated continuously"}
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
          </div>
        )}

        {/* Route cards */}
        {!isLoading && (
          <div className="max-w-2xl mx-auto space-y-4">
            {routes.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-xl border border-border/10 bg-card/15 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 group hover:border-border/15 hover:bg-card/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between">
                  {/* Route */}
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <Plane className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" strokeWidth={1.3} />
                    <p className="text-[16px] md:text-[18px] font-display font-medium text-foreground/80 tracking-wide whitespace-nowrap">
                      {route.from}
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-foreground/20 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[16px] md:text-[18px] font-display font-medium text-foreground/80 tracking-wide whitespace-nowrap">
                      {route.to}
                    </p>
                  </div>

                  {/* Status + Price */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {"price" in route && route.price && (
                      <p className="text-[11px] text-primary/60 font-light">
                        {route.currency === "EUR" ? "€" : "$"}
                        {route.price.toLocaleString()}
                      </p>
                    )}
                    <p className={`text-[10px] md:text-[11px] font-light ${route.statusColor}`}>
                      {route.status}
                    </p>
                  </div>
                </div>

                {/* Aircraft + Urgency */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/6">
                  {"aircraft" in route && route.aircraft && (
                    <p className="text-[9px] tracking-[0.15em] uppercase text-foreground/25 font-extralight">
                      {route.aircraft}
                    </p>
                  )}
                  {route.urgency && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-primary/35" strokeWidth={1.3} />
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-[9px] tracking-[0.2em] uppercase text-primary/45 font-light"
                      >
                        {route.urgency}
                      </motion.p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Market alert */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-5 rounded-xl border border-primary/8 bg-gradient-to-r from-card/15 to-card/5 backdrop-blur-sm p-5 md:p-6 flex items-start gap-4"
        >
          <div className="w-8 h-8 rounded-full border border-primary/15 bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Radio className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.3} />
          </div>
          <div className="flex-1">
            <p className="text-[9px] tracking-[0.3em] uppercase text-primary/50 font-light mb-2">
              Market Alert
            </p>
            <p className="text-[11px] text-foreground/55 font-light mb-1">
              Monaco Grand Prix — high demand, limited availability.
            </p>
            <p className="text-[10px] text-foreground/30 font-extralight leading-[1.8]">
              Early booking recommended to secure preferred aircraft.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center pt-10"
        >
          <a
            href="#cta"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(38,52%,50%,0.4)] hover:scale-[1.02]"
          >
            Request Your Flight
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMarketSection;
