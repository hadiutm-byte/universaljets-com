import { motion } from "framer-motion";
import { ShieldCheck, Search, FileCheck, Eye, BadgeCheck } from "lucide-react";

const vettingSteps = [
  {
    icon: Search,
    title: "Operator Screening",
    desc: "Every operator undergoes rigorous background checks, fleet inspection records, and insurance verification before entering our network.",
  },
  {
    icon: FileCheck,
    title: "Third-Party Audits",
    desc: "We require ARGUS Platinum/Gold or WYVERN Wingman certification — the highest safety standards in private aviation.",
  },
  {
    icon: Eye,
    title: "Continuous Monitoring",
    desc: "Operators are re-evaluated on an ongoing basis. Incident history, maintenance records, and crew qualifications are reviewed continuously.",
  },
  {
    icon: BadgeCheck,
    title: "Flight-Level Verification",
    desc: "Every flight is individually assessed — aircraft type, crew experience, and operational history are confirmed before departure.",
  },
];

const standards = [
  "ARGUS Platinum / Gold rated operators",
  "WYVERN Wingman certified",
  "IS-BAO Stage 2+ compliance",
  "FAA / EASA / GCAA regulatory alignment",
];

const SafetySection = () => (
  <section id="safety" className="section-padding relative overflow-hidden">
    {/* Ambient */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-10 glow-subtle">
          <ShieldCheck className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
        </div>
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Safety & Compliance
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
          Your Safety Is{" "}
          <span className="text-gradient-gold italic">Non-Negotiable</span>
        </h2>
        <p className="text-[13px] md:text-[14px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto">
          Every aircraft in our network is sourced from audited, certified operators.
          We never compromise on safety — it's the foundation of everything we do.
        </p>
      </motion.div>

      {/* Vetting Process */}
      <div className="max-w-4xl mx-auto mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-10 font-light text-center"
        >
          Our Vetting Process
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6">
          {vettingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border/8 bg-card/10"
            >
              <step.icon className="w-5 h-5 text-primary/45 mb-4" strokeWidth={1.2} />
              <h3 className="text-[13px] font-display font-medium text-foreground/75 mb-2.5">
                {step.title}
              </h3>
              <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Standards strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto rounded-2xl border border-primary/10 bg-gradient-to-br from-card/20 to-card/5 backdrop-blur-md p-8 md:p-10"
      >
        <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-8 font-light text-center">
          Accepted Standards
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {standards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
              <span className="text-[11px] text-foreground/50 font-extralight">
                {s}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trust line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-[11px] text-foreground/25 font-extralight mt-14 max-w-md mx-auto leading-[2]"
      >
        We work exclusively with operators who meet or exceed the highest global aviation safety benchmarks — no exceptions.
      </motion.p>
    </div>
  </section>
);

export default SafetySection;
