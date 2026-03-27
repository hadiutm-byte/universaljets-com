import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations } from "@/lib/destinationsData";
import { destinationImages } from "@/lib/destinationImages";

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
              className="group relative block rounded-xl overflow-hidden aspect-[3/4] hover:shadow-[0_16px_50px_-12px_hsla(0,0%,0%,0.3)] transition-all duration-700"
            >
              <img
                src={destinationImages[d.slug]}
                alt={d.name}
                loading="lazy"
                width={400}
                height={533}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-sm md:text-base text-white font-semibold mb-0.5 group-hover:text-primary transition-colors duration-500">
                  {d.name}
                </h3>
                <p className="text-[9px] text-white/40 font-light">{d.tagline}</p>
              </div>
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
