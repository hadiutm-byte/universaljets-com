import { motion } from "framer-motion";
import { ShieldCheck, Clock, Zap, Gem } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Absolute Discretion",
    desc: "Privacy is non-negotiable. Every operation is handled with the utmost confidentiality.",
  },
  {
    icon: Zap,
    title: "Complete Flexibility",
    desc: "Change plans in minutes, not days. We adapt to your schedule, not the other way around.",
  },
  {
    icon: Clock,
    title: "Time Efficiency",
    desc: "Skip the terminals. From tarmac to takeoff in minutes, saving hours on every journey.",
  },
  {
    icon: Gem,
    title: "Luxury Experience",
    desc: "Impeccable cabin service, bespoke catering, and every detail curated to perfection.",
  },
];

const ExperienceSection = () => (
  <section id="experience" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 font-light">The Standard</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">The Experience</h2>
        <p className="text-sm text-muted-foreground font-extralight max-w-lg mx-auto leading-[1.8]">
          What separates us isn't just access — it's the standard of care at every touchpoint.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {pillars.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            className="text-center group"
          >
            <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 group-hover:glow-subtle transition-all duration-700">
              <p.icon className="w-5 h-5 text-gold" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-lg mb-4 tracking-wide">{p.title}</h3>
            <p className="text-[13px] text-muted-foreground font-extralight leading-[1.9]">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
