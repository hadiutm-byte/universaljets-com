import { motion } from "framer-motion";
import { Send, Globe, ListChecks, Plane } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Send,
    title: "Submit Your Request",
    desc: "Share your route, dates, and preferences — we take it from there.",
  },
  {
    num: "02",
    icon: Globe,
    title: "We Source Globally",
    desc: "Our team scans the entire market to find the best aircraft, pricing, and positioning.",
  },
  {
    num: "03",
    icon: ListChecks,
    title: "Receive Optimized Options",
    desc: "You get a curated shortlist — compared, vetted, and ready to book.",
  },
  {
    num: "04",
    icon: Plane,
    title: "Confirm & Fly",
    desc: "Lock in your choice. We handle every detail until wheels up.",
  },
];

const HowItWorksSection = () => (
  <section className="section-padding relative overflow-hidden">
    {/* Ambient glow */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 55% 35% at 50% 50%, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
      }}
    />

    <div className="container mx-auto px-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          The Process
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
          How It <span className="text-gradient-gold italic">Works</span>
        </h2>
        <p className="text-[13px] md:text-[14px] text-foreground/40 font-extralight leading-[2] max-w-lg mx-auto">
          From request to wheels-up — a seamless, advisor-led experience.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-border/20 to-transparent" />

        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-1 md:gap-0">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: isLeft ? -25 : 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className={`relative md:flex items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } md:min-h-[140px]`}
              >
                {/* Content side */}
                <div
                  className={`md:w-[calc(50%-32px)] ${
                    isLeft ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                  }`}
                >
                  <div
                    className={`flex items-start gap-5 ${
                      isLeft
                        ? "md:flex-row-reverse md:gap-5"
                        : "md:flex-row md:gap-5"
                    }`}
                  >
                    {/* Icon — mobile only */}
                    <div className="md:hidden w-11 h-11 rounded-full border border-border/15 bg-card/30 flex items-center justify-center flex-shrink-0">
                      <step.icon
                        className="w-4 h-4 text-primary/50"
                        strokeWidth={1.3}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.3em] text-primary/40 font-light">
                        {step.num}
                      </span>
                      <h3 className="text-[14px] md:text-[15px] font-display font-medium text-foreground/80 mt-1 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[11px] md:text-[12px] text-foreground/35 font-extralight leading-[1.9]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center node — desktop */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border border-border/15 bg-card/40 backdrop-blur-sm items-center justify-center z-10">
                  <step.icon
                    className="w-5 h-5 text-primary/50"
                    strokeWidth={1.2}
                  />
                </div>

                {/* Empty spacer side */}
                <div className="hidden md:block md:w-[calc(50%-32px)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
