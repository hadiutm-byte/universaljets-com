import { motion } from "framer-motion";
import { Crown, Briefcase, Building2, Gem } from "lucide-react";

const clients = [
  { icon: Crown, label: "Royal families" },
  { icon: Briefcase, label: "CEOs and executives" },
  { icon: Building2, label: "Family offices" },
  { icon: Gem, label: "Ultra-high-net-worth individuals" },
];

const WhoWeServeSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Clientele
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          Who We <span className="text-gradient-gold italic">Serve</span>
        </h2>
      </motion.div>

      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-5 mb-14">
        {clients.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex items-center gap-4 p-5 rounded-xl border border-border/8 bg-card/10 group hover:border-border/15 hover:bg-card/15 transition-all duration-500"
          >
            <c.icon className="w-4 h-4 text-primary/50 flex-shrink-0" strokeWidth={1.2} />
            <span className="text-[12px] md:text-[13px] text-foreground/55 font-light">
              {c.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-[12px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto"
      >
        Each client receives a fully tailored aviation solution.
      </motion.p>
    </div>
  </section>
);

export default WhoWeServeSection;
