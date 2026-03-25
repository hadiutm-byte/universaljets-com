import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const lines = [
  { text: "Most people think private jets are overpriced.", delay: 0 },
  { text: "They're not.", delay: 0.1, bold: true },
  { text: "They're misunderstood.", delay: 0.2, gold: true },
];

const optimizations = [
  "Optimized aircraft",
  "Reduced positioning",
  "Saved ~30%",
];

const EditorialSection = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Opening lines */}
        <div className="mb-16">
          {lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: l.delay }}
              className={`text-[18px] md:text-[22px] lg:text-[26px] font-display leading-[1.6] mb-3 ${
                l.gold
                  ? "text-gradient-gold italic font-semibold"
                  : l.bold
                    ? "text-foreground/80 font-semibold"
                    : "text-foreground/50 font-light"
              }`}
            >
              {l.text}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-10 h-[1px] bg-primary/25 mb-16 origin-left"
        />

        {/* Case study */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-8 font-light">
            Real Example
          </p>

          <p className="text-[13px] text-foreground/40 font-extralight leading-[2.2] mb-3">
            A client recently requested:
          </p>
          <p className="text-[17px] md:text-[20px] font-display font-medium text-foreground/75 mb-6">
            Dubai → London
          </p>
          <p className="text-[13px] text-foreground/35 font-extralight leading-[2.2] mb-8">
            He thought it would cost X. We structured it differently:
          </p>

          {/* Optimizations */}
          <div className="rounded-xl border border-border/8 bg-card/10 p-6 mb-8">
            <div className="space-y-3">
              {optimizations.map((opt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <ArrowRight className="w-3 h-3 text-primary/40 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-[12px] text-foreground/50 font-light">{opt}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-[13px] text-foreground/40 font-extralight leading-[2.2]">
            Same jet. Same experience.{" "}
            <span className="text-foreground/60 font-light">Different thinking.</span>
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-10 h-[1px] bg-primary/25 mb-16 origin-left"
        />

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[14px] md:text-[16px] text-foreground/40 font-extralight leading-[2] mb-3">
            That's the difference between booking a jet…
          </p>
          <p className="text-[14px] md:text-[16px] text-foreground/60 font-light leading-[2] italic mb-10">
            …and understanding the market.
          </p>

          <p className="text-[18px] md:text-[22px] font-display font-semibold text-gradient-gold">
            Would you still pay full price?
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EditorialSection;
