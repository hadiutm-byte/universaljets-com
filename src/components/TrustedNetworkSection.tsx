import { motion } from "framer-motion";

const TrustedNetworkSection = () => (
  <section className="relative py-16 md:py-20 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
      backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
    }} />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-10 h-[1px] bg-primary/25 mx-auto mb-10 origin-center"
        />

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground leading-[1.4] mb-4">
          Global Partnerships.
        </h2>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold leading-[1.4] mb-8">
          <span className="text-gradient-gold italic">Strategic Access.</span>
        </h2>

        <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2.2] max-w-xl mx-auto mb-6">
          Universal Jets connects clients to a curated network of certified operators, aviation partners, and luxury service providers worldwide.
        </p>

        <p className="text-[12px] md:text-[13px] text-foreground/45 font-light leading-[2] max-w-md mx-auto mb-3">
          This is not a supplier list.
        </p>
        <p className="text-[12px] md:text-[13px] text-foreground/50 font-light leading-[2] max-w-md mx-auto">
          This is access to the global private aviation ecosystem.
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-10 h-[1px] bg-primary/25 mx-auto mt-12 origin-center"
        />
      </motion.div>
    </div>
  </section>
);

export default TrustedNetworkSection;
