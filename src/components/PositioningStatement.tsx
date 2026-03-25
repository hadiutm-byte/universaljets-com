import { motion } from "framer-motion";

const PositioningStatement = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    {/* Subtle ambient */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 50% 50%, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
      }}
    />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-12 h-[1px] bg-primary/30 mx-auto mb-10 origin-center"
        />

        <p className="text-[10px] tracking-[0.5em] uppercase text-primary/50 mb-8 font-light">
          Our Philosophy
        </p>

        <h2 className="text-2xl md:text-4xl lg:text-[2.8rem] font-display font-semibold text-foreground leading-[1.3] mb-6">
          We don't sell aircraft.
        </h2>
        <h2 className="text-2xl md:text-4xl lg:text-[2.8rem] font-display font-semibold leading-[1.3]">
          <span className="text-gradient-gold italic">
            We unlock global aviation access.
          </span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-12 h-[1px] bg-primary/30 mx-auto mt-10 origin-center"
        />
      </motion.div>
    </div>
  </section>
);

export default PositioningStatement;
