import { motion } from "framer-motion";
import { Network, TrendingDown, Settings, ShieldCheck } from "lucide-react";
import interiorImage from "@/assets/jet-interior.jpg";

const reasons = [
  { icon: Network, title: "Global Operator Network", desc: "Vetted access to 5,000+ aircraft across every continent." },
  { icon: TrendingDown, title: "Market Intelligence Pricing", desc: "Real-time data ensures you never overpay for a charter." },
  { icon: Settings, title: "Tailored Solutions", desc: "Every mission is unique. We build your flight around you." },
  { icon: ShieldCheck, title: "Discretion & VIP Service", desc: "Privacy-first operations for high-profile clients." },
];

const WhySection = () => (
  <section className="section-padding overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-light">The Difference</p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-12">
            Why Universal Jets
          </h2>

          <div className="space-y-8">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <r.icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-lg overflow-hidden glow-subtle">
            <img
              src={interiorImage}
              alt="Luxury private jet interior"
              className="w-full h-auto object-cover"
              loading="lazy"
              width={1280}
              height={720}
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-lg bg-gradient-to-br from-gold/20 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhySection;
