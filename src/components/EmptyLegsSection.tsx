import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";

const legs = [
  { from: "New York (TEB)", to: "Miami (OPF)", aircraft: "Citation XLS+", savings: "65%", date: "Apr 12" },
  { from: "London (LTN)", to: "Geneva (GVA)", aircraft: "Phenom 300E", savings: "70%", date: "Apr 15" },
  { from: "Los Angeles (VNY)", to: "Las Vegas (LAS)", aircraft: "Citation CJ3+", savings: "60%", date: "Apr 18" },
  { from: "Dubai (DWC)", to: "London (LTN)", aircraft: "Global 6000", savings: "75%", date: "Apr 22" },
];

const EmptyLegsSection = () => (
  <section id="empty-legs" className="section-padding">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-light">Exclusive Deals</p>
        <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">Empty Leg Flights</h2>
        <p className="text-muted-foreground font-light max-w-lg mx-auto">
          Fly private at up to 75% off. These one-way repositioning flights offer unmatched value.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {legs.map((leg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-6 hover:glow-subtle transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-wider text-muted-foreground uppercase">{leg.date}</span>
              <span className="text-xs tracking-wider text-gold font-medium uppercase">Save {leg.savings}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-display text-lg">{leg.from}</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-[1px] bg-border" />
                <Plane size={14} className="text-gold rotate-90 md:rotate-0" />
                <div className="flex-1 h-[1px] bg-border" />
              </div>
              <span className="font-display text-lg">{leg.to}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{leg.aircraft}</span>
              <a href="#cta" className="inline-flex items-center gap-1 text-xs tracking-wider uppercase text-gold hover:text-gold-light transition-colors">
                Inquire <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EmptyLegsSection;
