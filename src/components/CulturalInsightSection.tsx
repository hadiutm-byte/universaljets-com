import { motion } from "framer-motion";

const CulturalInsightSection = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Opening */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[18px] md:text-[22px] lg:text-[26px] font-display font-light text-foreground/50 leading-[1.6] mb-16"
        >
          Would you allow smoking on a private jet?
        </motion.p>

        {/* Comparison */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-border/8 bg-card/10 p-6"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-4 font-light">
              In the Middle East
            </p>
            <p className="text-[13px] text-foreground/50 font-extralight leading-[2]">
              Most clients prefer it over Wi-Fi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border border-border/8 bg-card/10 p-6"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-4 font-light">
              In Europe
            </p>
            <p className="text-[13px] text-foreground/50 font-extralight leading-[2]">
              It's the opposite.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-10 h-[1px] bg-primary/25 mb-16 origin-left"
        />

        {/* Punchline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[14px] md:text-[16px] text-foreground/40 font-extralight leading-[2] mb-3">
            Private aviation is not global.
          </p>
          <p className="text-[18px] md:text-[22px] font-display font-semibold text-gradient-gold italic mb-12">
            It's cultural.
          </p>

          <p className="text-[16px] md:text-[20px] font-display font-medium text-foreground/60">
            What would <span className="text-foreground/80 italic">you</span> choose?
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CulturalInsightSection;
