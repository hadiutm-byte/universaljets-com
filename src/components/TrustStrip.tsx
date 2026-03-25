import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Globe } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

const certifications = [
  { icon: ShieldCheck, name: "ARGUS", detail: "Registered Broker" },
  { icon: Award, name: "WYVERN", detail: "Certified" },
  { icon: FileCheck, name: "DCAA", detail: "License No. 3342665" },
  { icon: Globe, name: "DIEZ", detail: "License No. 50370" },
];

const TrustStrip = () => (
  <section className="relative z-10 py-10 md:py-12">
    <div className="container mx-auto px-8">
      <FadeReveal>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 lg:gap-20">
          {certifications.map((cert, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 group cursor-default"
              >
                <cert.icon
                  className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-400"
                  strokeWidth={1.3}
                />
                <div className="flex flex-col">
                  <span className="text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-foreground/70 font-medium leading-tight">
                    {cert.name}
                  </span>
                  <span className="text-[9px] tracking-[0.1em] text-foreground/35 font-extralight">
                    {cert.detail}
                  </span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default TrustStrip;