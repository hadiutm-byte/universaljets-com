import { motion } from "framer-motion";
import { Plane, AlertTriangle, ArrowRight, Radio } from "lucide-react";

const LiveMarketSection = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const depDate = tomorrow.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid bg */}
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
              Live Market
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
            Market{" "}
            <span className="text-gradient-gold italic">Opportunities</span>
          </h2>
          <p className="text-[12px] md:text-[13px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto">
            Real-time positioning flights and demand alerts — updated continuously.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-5">
          {/* Empty leg card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-border/10 bg-card/15 backdrop-blur-sm p-6 md:p-8"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Plane className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.3} />
              <p className="text-[9px] tracking-[0.35em] uppercase text-primary/50 font-light">
                Empty Leg Available
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <p className="text-[10px] text-foreground/25 font-extralight mb-1">From</p>
                <p className="text-[18px] md:text-[22px] font-display font-medium text-foreground/80 tracking-wide">
                  Dubai
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <ArrowRight className="w-3.5 h-3.5 text-primary/30" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] text-foreground/25 font-extralight mb-1">To</p>
                <p className="text-[18px] md:text-[22px] font-display font-medium text-foreground/80 tracking-wide">
                  London
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-border/8">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[9px] text-foreground/20 font-extralight mb-0.5">Departure</p>
                  <p className="text-[11px] text-foreground/55 font-light">{depDate}</p>
                </div>
                <div>
                  <p className="text-[9px] text-foreground/20 font-extralight mb-0.5">Savings</p>
                  <p className="text-[11px] text-emerald-400/80 font-light">Up to 50%</p>
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-[8px] tracking-[0.2em] uppercase text-primary/40 font-light"
              >
                Limited
              </motion.div>
            </div>
          </motion.div>

          {/* Market alert */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border border-primary/8 bg-gradient-to-r from-card/15 to-card/5 backdrop-blur-sm p-5 md:p-6 flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-full border border-primary/15 bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.3} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-3 h-3 text-primary/40" strokeWidth={1.3} />
                <p className="text-[9px] tracking-[0.3em] uppercase text-primary/50 font-light">
                  Market Alert
                </p>
              </div>
              <p className="text-[12px] text-foreground/45 font-extralight leading-[1.9]">
                High demand expected for Monaco Grand Prix — limited availability. Early booking recommended.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center pt-6"
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
      </div>
    </section>
  );
};

export default LiveMarketSection;
