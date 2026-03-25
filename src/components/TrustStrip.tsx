import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Globe } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const certifications = [
  { icon: ShieldCheck, name: "ARGUS", detail: "Registered Broker" },
  { icon: Award, name: "WYVERN", detail: "Certified" },
  { icon: FileCheck, name: "DCAA", detail: "License No. 3342665" },
  { icon: Globe, name: "DIEZ", detail: "License No. 50370" },
];

const TrustStrip = () => (
  <section className="relative z-10">
    <FadeReveal>
      <div
        className="py-10 px-8 md:px-16 flex flex-wrap items-center justify-around gap-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid hsla(38,52%,53%,0.2)",
          borderBottom: "1px solid hsla(38,52%,53%,0.2)",
        }}
      >
        {certifications.map((cert, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-3 cursor-default group"
          >
            <cert.icon
              className="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-400 group-hover:drop-shadow-[0_0_8px_hsla(38,52%,53%,0.4)]"
              strokeWidth={1.4}
              style={{ color: "hsl(38,52%,53%)" }}
            />
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold tracking-[1px] uppercase text-foreground/90 leading-tight">
                {cert.name}
              </span>
              <small className="text-[10px] text-foreground/45 font-light leading-snug">
                {cert.detail}
              </small>
            </div>
          </motion.div>
        ))}
      </div>
    </FadeReveal>
  </section>
);

export default TrustStrip;