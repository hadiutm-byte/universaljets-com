import { motion } from "framer-motion";
import { ShieldCheck, Search, Wrench, Users, ClipboardCheck, Shield } from "lucide-react";

const certifications = [
  { name: "WYVERN", sub: "Wingman Certified" },
  { name: "ARGUS", sub: "Platinum / Gold Rated" },
  { name: "ICAO", sub: "International Standards" },
  { name: "IOSA", sub: "Operational Safety Audit" },
];

const vettingSteps = [
  { icon: ClipboardCheck, title: "Operator Certification Check", desc: "Verified against WYVERN, ARGUS, and regional aviation authority databases." },
  { icon: Wrench, title: "Aircraft Maintenance History", desc: "Full review of maintenance logs, airworthiness directives, and inspection cycles." },
  { icon: Users, title: "Crew Experience Verification", desc: "Pilot hours, type ratings, recurrent training, and safety record assessment." },
  { icon: Search, title: "Safety Audit Review", desc: "Independent audit evaluation including incident history and operational compliance." },
];

const SafetySection = () => (
  <section id="safety" className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center mb-20"
      >
        <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-10 glow-subtle">
          <ShieldCheck className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
        </div>

        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Safety & Compliance
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-6 leading-tight">
          Safety is not a feature.{" "}
          <span className="text-gradient-gold italic">It's the foundation.</span>
        </h2>

        <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2.1] max-w-xl mx-auto mb-4">
          We work exclusively with operators that meet the highest international
          safety standards, including WYVERN and ARGUS certifications where
          applicable.
        </p>
        <p className="text-[12px] md:text-[13px] text-foreground/35 font-extralight leading-[2.1] max-w-xl mx-auto">
          Every aircraft is vetted based on operator history, crew experience,
          maintenance records, and operational compliance.
        </p>
      </motion.div>

      {/* Certification badges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto mb-24"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative group"
            >
              <div className="flex flex-col items-center py-7 px-4 rounded-xl border border-border/8 bg-card/10 transition-all duration-500 group-hover:border-primary/15 group-hover:bg-card/20">
                <Shield className="w-6 h-6 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors duration-500" strokeWidth={1} />
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/60 font-medium mb-1">
                  {cert.name}
                </p>
                <p className="text-[9px] text-foreground/25 font-extralight text-center">
                  {cert.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vetting Process */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-10 h-[1px] bg-primary/25 mx-auto mb-8 origin-center"
          />
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 font-light">
            Our Vetting Process
          </p>
        </motion.div>

        <div className="space-y-0">
          {vettingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-6 relative"
            >
              {/* Vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full border border-border/12 bg-card/15 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary/45" strokeWidth={1.3} />
                </div>
                {i < vettingSteps.length - 1 && (
                  <div className="w-[1px] flex-1 bg-border/10 my-1" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-10 ${i === vettingSteps.length - 1 ? "pb-0" : ""}`}>
                <h3 className="text-[13px] font-display font-medium text-foreground/70 mb-2 mt-2">
                  {step.title}
                </h3>
                <p className="text-[11px] text-foreground/30 font-extralight leading-[1.9]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-[11px] text-foreground/20 font-extralight mt-20 max-w-md mx-auto leading-[2]"
      >
        No exceptions. No compromises. Every flight meets the standard — or it doesn't fly.
      </motion.p>
    </div>
  </section>
);

export default SafetySection;
