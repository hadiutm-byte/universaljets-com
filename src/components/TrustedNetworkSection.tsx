import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const hubs = ["Dubai", "London", "Geneva", "Paris", "New York", "Riyadh"];

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
        <p className="text-[12px] md:text-[13px] text-foreground/50 font-light leading-[2] max-w-md mx-auto mb-12">
          This is access to the global private aviation ecosystem.
        </p>

        {/* Hub cities */}
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/45 font-light mb-6">
          Our partnerships span key aviation hubs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
          {hubs.map((hub, i) => (
            <motion.div
              key={hub}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <MapPin className="w-3 h-3 text-primary/35" strokeWidth={1.2} />
              <span className="text-[12px] text-foreground/50 font-light tracking-wide">{hub}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] text-foreground/30 font-extralight">
          Allowing fast aircraft positioning and global coverage.
        </p>

        {/* Specialized partnerships */}
        <div className="w-full h-[1px] bg-border/8 my-12" />

        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/45 font-light mb-5">
          Specialized partnerships for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
          {["Cargo operations", "Humanitarian missions", "Diplomatic and government flights"].map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              className="text-[12px] text-foreground/50 font-light tracking-wide"
            >
              {item}
            </motion.span>
          ))}
        </div>
        <p className="text-[11px] text-foreground/30 font-extralight">
          Handled with precision, discretion, and operational expertise.
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
