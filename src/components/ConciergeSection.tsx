import { motion } from "framer-motion";
import { Wine, Car, Hotel, Briefcase } from "lucide-react";

const conciergeItems = [
  { icon: Wine, title: "Lifestyle Services", desc: "Private dining, event access, and curated experiences." },
  { icon: Briefcase, title: "VIP Airport Services", desc: "Fast-track security, private lounges, and tarmac transfers." },
  { icon: Hotel, title: "Hotel & Accommodation", desc: "Reserved suites at the world's finest properties." },
  { icon: Car, title: "Ground Transport", desc: "Chauffeur services, supercars, and helicopter transfers." },
];

const ConciergeSection = () => (
  <section id="concierge" className="section-padding">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-light">Beyond the Flight</p>
        <h2 className="text-4xl md:text-5xl font-display font-semibold">Concierge</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {conciergeItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:glow-subtle transition-all duration-500">
              <item.icon className="w-7 h-7 text-gold" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ConciergeSection;
