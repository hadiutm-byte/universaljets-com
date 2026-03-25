import { motion } from "framer-motion";
import { Wine, Briefcase, Hotel, Car } from "lucide-react";

const items = [
  { icon: Wine, title: "Lifestyle Services", desc: "Private dining, exclusive events, and curated luxury experiences." },
  { icon: Briefcase, title: "VIP Airport Services", desc: "Fast-track security, private terminals, and tarmac transfers." },
  { icon: Hotel, title: "Hotels & Accommodation", desc: "Reserved suites at the world's finest properties." },
  { icon: Car, title: "Ground Transport", desc: "Chauffeurs, supercars, and helicopter transfers." },
];

const ConciergeSection = () => (
  <section id="concierge" className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-28"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Beyond the Flight</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">
          Beyond <span className="text-gradient-gold italic">Aviation</span>
        </h2>
        <p className="text-[13px] md:text-[14px] text-muted-foreground font-light leading-[2] max-w-xl mx-auto">
          We collaborate with premium concierge providers, luxury hotels, and ground transportation partners to deliver a seamless end-to-end experience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="text-center group"
          >
            <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-8 group-hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.15)] transition-all duration-700">
              <item.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-lg mb-4 text-foreground">{item.title}</h3>
            <p className="text-[13px] text-muted-foreground font-light leading-[2]">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ConciergeSection;
