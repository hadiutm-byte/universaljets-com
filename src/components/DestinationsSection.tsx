import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Monaco", desc: "Riviera glamour" },
  { name: "Dubai", desc: "Desert luxury" },
  { name: "Mykonos", desc: "Aegean escape" },
  { name: "Maldives", desc: "Island paradise" },
  { name: "Aspen", desc: "Mountain retreat" },
  { name: "St Moritz", desc: "Alpine elegance" },
];

const DestinationsSection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Destinations</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">
          Popular <span className="text-gradient-gold italic">Routes</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto mb-14">
        {destinations.map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="text-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-4 group-hover:glow-subtle transition-all duration-700">
              <MapPin className="w-5 h-5 text-primary/50" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-sm text-foreground mb-1">{d.name}</h3>
            <p className="text-[10px] text-foreground/30 font-extralight">{d.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          to="/destinations"
          className="text-[10px] tracking-[0.3em] uppercase text-primary/50 hover:text-primary/80 transition-colors font-light"
        >
          View All Destinations →
        </Link>
      </motion.div>
    </div>
  </section>
);

export default DestinationsSection;
