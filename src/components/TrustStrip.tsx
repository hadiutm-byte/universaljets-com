import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, BookCheck } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

const certifications = [
  {
    icon: ShieldCheck,
    title: "ARGUS Registered Broker",
    subtitle: "International Aviation Safety",
  },
  {
    icon: Award,
    title: "WYVERN Certified",
    subtitle: "Wingman Standard Approved",
  },
  {
    icon: FileCheck,
    title: "DCAA Licensed",
    subtitle: "License No. 3342665",
  },
  {
    icon: BookCheck,
    title: "DIEZ Registered",
    subtitle: "License No. 50370",
  },
];

const TrustStrip = () => (
  <section className="relative z-10 py-16 md:py-20">
    <div className="container mx-auto px-8">
      <FadeReveal>
        {/* Glass strip */}
        <div
          className="rounded-2xl border border-white/[0.06] px-6 py-8 md:px-10 md:py-10"
          style={{
            background: "hsla(0,0%,100%,0.025)",
            backdropFilter: "blur(20px)",
          }}
        >
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {certifications.map((cert, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center text-center gap-4 group cursor-default"
                >
                  {/* Icon circle with hover glow */}
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_24px_-6px_hsla(38,52%,53%,0.25)]">
                    <cert.icon
                      className="w-5 h-5 text-primary/70 transition-colors duration-500 group-hover:text-primary"
                      strokeWidth={1.2}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-foreground/70 font-medium leading-snug mb-1">
                      {cert.title}
                    </p>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-foreground/35 font-extralight">
                      {cert.subtitle}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Bottom line */}
          <div className="mt-8 pt-6 border-t border-white/[0.04]">
            <p className="text-[8px] tracking-[0.35em] text-foreground/20 font-extralight uppercase text-center">
              Trusted by executives, family offices & institutional clients worldwide
            </p>
          </div>
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default TrustStrip;