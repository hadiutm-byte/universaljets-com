import { motion } from "framer-motion";
import { ShieldCheck, Globe, Award } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    desc: "We work exclusively with operators that meet internationally recognised safety standards, including ARGUS, WYVERN, and equivalent certifications.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "From major international hubs to remote destinations, our network allows seamless access wherever your journey takes you.",
  },
  {
    icon: Award,
    title: "Operational Excellence",
    desc: "Every flight is carefully selected and managed to ensure consistency, reliability, and a flawless client experience from departure to arrival.",
  },
];

const TrustedNetworkSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Trusted Global Network
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground">
          Access to the World's{" "}
          <span className="text-gradient-gold italic">Finest Aircraft</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-2xl mx-auto text-center mb-20"
      >
        <p className="text-[13px] text-foreground/45 font-extralight leading-[2.2] mb-4">
          At Universal Jets, we don't operate aircraft — we curate them.
        </p>
        <p className="text-[12px] text-foreground/35 font-extralight leading-[2.2]">
          Through our global network of carefully vetted operators, we provide access to over 7,000 aircraft worldwide, ensuring every flight meets the highest standards of safety, performance, and service.
        </p>
      </motion.div>

      <div className="divider-gold mb-20" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[9px] tracking-[0.5em] uppercase text-gold/60 mb-16 font-light"
      >
        Our Three Pillars
      </motion.p>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-20">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center group"
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 group-hover:glow-subtle transition-all duration-700">
              <p.icon className="w-6 h-6 text-gold/60" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-lg mb-4">{p.title}</h3>
            <p className="text-[12px] text-muted-foreground font-extralight leading-[2.1]">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-[12px] text-foreground/30 font-extralight leading-[2.4] italic">
          "This approach allows us to offer flexibility, availability, and pricing advantages that traditional operators cannot match."
        </p>
      </motion.div>
    </div>
  </section>
);

export default TrustedNetworkSection;
