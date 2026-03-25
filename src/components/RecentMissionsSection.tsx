import { motion } from "framer-motion";
import { ArrowRight, Clock, Plane } from "lucide-react";

const missions = [
  {
    from: "Paris",
    to: "Riyadh",
    type: "VIP Delegation",
    detail: "Heavy jet secured within 6 hours",
  },
  {
    from: "Dubai",
    to: "Maldives",
    type: "Family Leisure",
    detail: "Optimized pricing with premium aircraft",
  },
  {
    from: "Geneva",
    to: "New York",
    type: "Corporate Travel",
    detail: "Long-range jet arranged within 12 hours",
  },
];

const RecentMissionsSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Case Studies
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          Recent{" "}
          <span className="text-gradient-gold italic">Missions</span>
        </h2>
      </motion.div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
        {missions.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-xl border border-border/8 bg-card/10 p-6 md:p-7 flex flex-col justify-between group hover:border-border/15 hover:bg-card/15 transition-all duration-500"
          >
            {/* Route */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <Plane className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.3} />
                <p className="text-[9px] tracking-[0.3em] uppercase text-primary/45 font-light">
                  {m.type}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[16px] font-display font-medium text-foreground/75">
                  {m.from}
                </p>
                <ArrowRight className="w-3.5 h-3.5 text-foreground/20" strokeWidth={1.5} />
                <p className="text-[16px] font-display font-medium text-foreground/75">
                  {m.to}
                </p>
              </div>
            </div>

            {/* Detail */}
            <div className="pt-5 border-t border-border/8">
              <div className="flex items-start gap-2.5">
                <Clock className="w-3 h-3 text-foreground/20 mt-0.5 flex-shrink-0" strokeWidth={1.3} />
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.8]">
                  {m.detail}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default RecentMissionsSection;
