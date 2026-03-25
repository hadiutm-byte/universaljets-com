import { motion } from "framer-motion";

const TrustStrip = () => (
  <section className="relative z-10 py-20 md:py-24">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-16" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center text-[11px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground font-extralight"
      >
        Trusted by global executives, family offices, and UHNW clients
      </motion.p>

      <div className="divider-gold mt-16" />
    </div>
  </section>
);

export default TrustStrip;
