import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";

const legs = [
  { from: "New York TEB", to: "Miami OPF", aircraft: "Citation XLS+", savings: "65%", date: "Apr 12" },
  { from: "London LTN", to: "Geneva GVA", aircraft: "Phenom 300E", savings: "70%", date: "Apr 15" },
  { from: "Los Angeles VNY", to: "Las Vegas LAS", aircraft: "Citation CJ3+", savings: "60%", date: "Apr 18" },
  { from: "Dubai DWC", to: "London LTN", aircraft: "Global 6000", savings: "75%", date: "Apr 22" },
];

const EmptyLegsSection = () => (
  <section id="empty-legs" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 font-light">Exclusive Opportunity</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">Empty Legs</h2>
        <p className="text-sm text-muted-foreground font-extralight max-w-lg mx-auto leading-[1.8] mb-4">
          One-way repositioning flights at up to 75% below standard charter rates. The smartest way to fly private.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-20"
      >
        <span className="inline-block px-5 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase font-light luxury-border text-gold">
          Save up to 75%
        </span>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {legs.map((leg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="glass rounded-lg p-8 hover:glow-subtle transition-all duration-700 group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-extralight">{leg.date}</span>
              <span className="text-[10px] tracking-[0.2em] text-gold font-medium uppercase">Save {leg.savings}</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-base md:text-lg">{leg.from}</span>
              <div className="flex-1 flex items-center gap-2 px-2">
                <div className="flex-1 h-[1px] bg-border" />
                <Plane size={12} className="text-gold flex-shrink-0" />
                <div className="flex-1 h-[1px] bg-border" />
              </div>
              <span className="font-display text-base md:text-lg text-right">{leg.to}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-extralight">{leg.aircraft}</span>
              <a href="#cta" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-all duration-500">
                Inquire <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EmptyLegsSection;
