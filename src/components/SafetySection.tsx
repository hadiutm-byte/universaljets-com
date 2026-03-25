import { motion } from "framer-motion";
import { ShieldCheck, Search, Wrench, Users, ClipboardCheck } from "lucide-react";

const certifications = [
  { name: "WYVERN", sub: "Wingman Certified" },
  { name: "ARGUS", sub: "Platinum / Gold Rated" },
  { name: "ICAO", sub: "Compliant Operators" },
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
      {/* Label */}
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
      </motion.div>

      {/* 2-column: Text left, Badges right */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 mb-24">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mb-8 glow-subtle">
            <ShieldCheck className="w-5 h-5 text-primary/55" strokeWidth={1.2} />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-6 leading-tight">
            Safety First.{" "}
            <span className="text-gradient-gold italic">Always.</span>
          </h2>

          <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2.1] mb-8">
            We work exclusively with vetted operators meeting the highest international standards.
          </p>

          {/* Closing statement */}
          <div className="border-l border-primary/15 pl-5 py-1">
            <p className="text-[11px] text-foreground/40 font-extralight leading-[2] italic">
              Every flight is reviewed before confirmation.
            </p>
          </div>
        </motion.div>

        {/* Right — Badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center"
        >
          <div className="grid grid-cols-2 gap-4 w-full">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="group"
              >
                <div className="flex flex-col items-center justify-center py-8 px-5 rounded-xl border border-border/8 bg-card/8 transition-all duration-500 group-hover:border-border/15 group-hover:bg-card/15 aspect-square">
                  {/* Monochrome shield mark */}
                  <div className="w-10 h-10 rounded-full border border-foreground/8 flex items-center justify-center mb-5 group-hover:border-foreground/12 transition-colors duration-500">
                    <span className="text-[10px] font-display font-semibold text-foreground/25 tracking-wider group-hover:text-foreground/40 transition-colors duration-500">
                      {cert.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 font-medium mb-1.5 group-hover:text-foreground/65 transition-colors duration-500">
                    {cert.name}
                  </p>
                  <p className="text-[9px] text-foreground/20 font-extralight text-center leading-relaxed">
                    {cert.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

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
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full border border-border/12 bg-card/15 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary/45" strokeWidth={1.3} />
                </div>
                {i < vettingSteps.length - 1 && (
                  <div className="w-[1px] flex-1 bg-border/10 my-1" />
                )}
              </div>
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

      {/* Closing */}
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
