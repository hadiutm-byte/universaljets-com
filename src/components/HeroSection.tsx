import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroJet from "@/assets/hero-jet.jpg";

const SERVICE_LABELS = [
  { label: "On-Demand Charter", position: "top" as const, delay: 1.2 },
  { label: "Empty Legs", position: "right" as const, delay: 1.4 },
  { label: "Aircraft Management", position: "bottom" as const, delay: 1.6 },
  { label: "Concierge & Beyond", position: "left" as const, delay: 1.8 },
];

const LABEL_POSITIONS: Record<string, string> = {
  top: "left-1/2 -translate-x-1/2 -top-10",
  right: "top-1/2 -translate-y-1/2 -right-12 translate-x-full",
  bottom: "left-1/2 -translate-x-1/2 -bottom-10",
  left: "top-1/2 -translate-y-1/2 -left-12 -translate-x-full",
};

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{ scale: bgScale, opacity: bgOpacity, y: bgY }}
      >
        <img
          src={heroJet}
          alt="Private jet flying above clouds at golden hour"
          width={1920}
          height={1080}
          className="h-full w-full object-cover animate-hero-ken-burns"
        />
      </motion.div>

      {/* Warm golden atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, hsla(43, 60%, 30%, 0.15) 0%, transparent 60%), " +
            "linear-gradient(180deg, hsla(0,0%,0%,0.55) 0%, hsla(0,0%,0%,0.25) 40%, hsla(0,0%,0%,0.65) 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsla(0,0%,0%,0.5) 100%)",
        }}
      />

      {/* Central content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Orbital ring + floating labels (desktop) */}
        <div className="absolute hidden md:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[420px] lg:w-[520px] h-[420px] lg:h-[520px] rounded-full border border-white/[0.06]"
            style={{ boxShadow: "0 0 80px 10px hsla(43, 85%, 58%, 0.03)" }}
          >
            {/* Orbiting dot accent */}
            <div
              className="absolute w-2 h-2 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background: "hsl(43, 85%, 58%)", boxShadow: "0 0 12px 3px hsla(43, 85%, 58%, 0.4)" }}
            />

            {/* Service labels positioned around the ring */}
            {SERVICE_LABELS.map(({ label, position, delay }) => (
              <motion.span
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay, ease: "easeOut" }}
                className={`absolute text-[9px] lg:text-[10px] tracking-[0.25em] uppercase text-white/35 font-light pointer-events-none whitespace-nowrap ${LABEL_POSITIONS[position]}`}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Gold accent dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-1.5 h-1.5 rounded-full mb-8 md:mb-10"
          style={{ background: "hsl(43, 85%, 58%)", boxShadow: "0 0 20px 4px hsla(43, 85%, 58%, 0.4)" }}
        />

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-display tracking-[0.35em] md:tracking-[0.65em] uppercase text-white/95 font-semibold"
          style={{ fontSize: "clamp(1.4rem, 5vw, 4.5rem)", textShadow: "0 0 15px hsl(43, 85%, 42%)" }}
        >
          Private Aviation Redefined
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 md:w-24 h-[1px] my-6 md:my-8 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(43, 85%, 58%), transparent)",
          }}
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="font-display text-[11px] md:text-[13px] text-white/50 font-light leading-[2] tracking-[0.22em] uppercase max-w-md"
        >
          Global access · Instant quotes · Tailored journeys
        </motion.p>

        {/* Mobile service labels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-8 md:hidden"
        >
          {SERVICE_LABELS.map(({ label }) => (
            <span
              key={label}
              className="text-[8px] tracking-[0.2em] uppercase text-white/25 font-light"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 3, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[7px] tracking-[0.6em] uppercase text-white/20 font-light">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-gradient-to-b from-primary/20 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
