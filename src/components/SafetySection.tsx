import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const certifications = [
  { name: "WYVERN", sub: "Wingman Certified" },
  { name: "ARGUS", sub: "Platinum / Gold Rated" },
  { name: "ICAO", sub: "Compliant Operators" },
];

const SafetySection = () => (
  <section id="safety" className="section-padding relative overflow-hidden">
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
          Safety & Compliance
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          Safety First.{" "}
          <span className="text-gradient-gold italic">Always.</span>
        </h2>
      </motion.div>

      {/* Certification badges */}
      <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 mb-14">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            className="group"
          >
            <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-border/8 bg-card/8 transition-all duration-500 group-hover:border-border/15 group-hover:bg-card/15">
              <div className="w-10 h-10 rounded-full border border-foreground/8 flex items-center justify-center mb-4 group-hover:border-foreground/12 transition-colors duration-500">
                <ShieldCheck className="w-4 h-4 text-foreground/25 group-hover:text-foreground/40 transition-colors duration-500" strokeWidth={1.2} />
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 font-medium mb-1 group-hover:text-foreground/65 transition-colors duration-500">
                {cert.name}
              </p>
              <p className="text-[9px] text-foreground/20 font-extralight text-center">
                {cert.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-[11px] text-foreground/25 font-extralight italic"
      >
        Every flight is verified before confirmation.
      </motion.p>
    </div>
  </section>
);

export default SafetySection;
