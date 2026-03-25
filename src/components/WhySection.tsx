import { motion } from "framer-motion";
import { XCircle, Globe, TrendingDown, Unlock, ShieldCheck } from "lucide-react";

const points = [
  { icon: XCircle, title: "Operators Sell Their Own Aircraft", desc: "They push what they have — not what's best for you. Their priority is filling their fleet, not optimizing your trip." },
  { icon: Globe, title: "We Source the Best Aircraft Globally", desc: "Access to 6,000+ aircraft across every category. We find the right jet for every mission, anywhere in the world." },
  { icon: TrendingDown, title: "We Optimize Positioning to Reduce Cost", desc: "By analyzing repositioning, empty legs, and operator availability, we secure pricing that direct bookings can't match." },
  { icon: Unlock, title: "We Unlock Hidden Deals & Empty Legs", desc: "Our network surfaces one-way repositioning flights and off-market availability at up to 75% below standard rates." },
  { icon: ShieldCheck, title: "We Act in Your Interest, Not the Operator's", desc: "Independent. Unbiased. Every recommendation is driven by your needs — safety, budget, schedule, comfort." },
];

const WhySection = () => (
  <section id="why" className="section-padding relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">The Difference</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-4">
          Why Clients{" "}
          <span className="text-gradient-gold italic">Never</span>{" "}
          Go Direct
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto text-center mb-20"
      >
        The smartest travellers don't book direct. Here's why.
      </motion.p>

      <div className="max-w-3xl mx-auto space-y-10">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -25 : 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-6 group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full luxury-border flex items-center justify-center group-hover:glow-subtle transition-all duration-700 mt-1">
              <p.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
            </div>
            <div>
              <h3 className="font-display text-lg mb-2 text-foreground">{p.title}</h3>
              <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;
