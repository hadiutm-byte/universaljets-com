import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations } from "@/lib/destinationsData";

const featured = destinations.slice(0, 8);

const DestinationsSection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Destinations</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
          Where the World <span className="text-gradient-gold italic">Flies</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
        {featured.map((d, i) => (
          <motion.div
            key={d.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <Link
              to={`/destinations/${d.slug}`}
              className="block text-center py-6 px-4 rounded-xl border border-border bg-card group hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center mx-auto mb-3 group-hover:border-primary/30 transition-all duration-500">
                <MapPin className="w-4 h-4 text-primary/50" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{d.name}</h3>
              <p className="text-[10px] text-muted-foreground/40 font-light">{d.tagline}</p>
            </Link>
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
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-primary/60 font-medium hover:text-primary transition-colors duration-500"
        >
          View All Destinations <ArrowRight size={10} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default DestinationsSection;
