import { motion } from "framer-motion";
import { Plane, ArrowRight, Radio } from "lucide-react";

const routes = [
  { from: "Dubai", to: "London", status: "Booked 2 hours ago", statusColor: "text-foreground/30" },
  { from: "Nice", to: "Ibiza", status: "Available now", statusColor: "text-emerald-400/70", badge: "Open" },
  { from: "Riyadh", to: "Geneva", status: "High demand", statusColor: "text-primary/60", badge: "Limited" },
  { from: "Paris", to: "Mykonos", status: "Filling fast", statusColor: "text-primary/50" },
  { from: "Maldives", to: "Dubai", status: "Limited availability", statusColor: "text-primary/60", badge: "Limited" },
];

const LiveMarketSection = () => {
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
            Live global availability: 27 aircraft ready now · 6 empty legs today
          </p>
        </motion.div>

        {/* Route cards */}
        <div className="max-w-2xl mx-auto space-y-4">
          {routes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-xl border border-border/10 bg-card/15 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 flex items-center justify-between group hover:border-border/15 hover:bg-card/20 transition-all duration-500"
            >
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

              {/* Status */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className={`text-[10px] md:text-[11px] font-light ${route.statusColor}`}>
                  {route.status}
                </p>
                {route.badge && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-[8px] tracking-[0.2em] uppercase text-primary/40 font-light hidden md:inline"
                  >
                    {route.badge}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

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
            View Opportunities
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMarketSection;
