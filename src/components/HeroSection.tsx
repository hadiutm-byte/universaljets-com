import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroJet from "@/assets/hero-jet.jpg";

const SERVICE_LABELS = [
  { label: "On-Demand Charter", angle: -45, delay: 1.2 },
  { label: "Empty Legs", angle: 45, delay: 1.4 },
  { label: "Concierge & Beyond", angle: 225, delay: 1.6 },
  { label: "Aircraft Management", angle: 135, delay: 1.8 },
];

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

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsla(0,0%,0%,0.5) 100%)",
        }}
      />

      {/* Central content with orbital ring */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Orbital ring */}
        <div className="absolute hero-orbit-ring">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] rounded-full border border-white/[0.07]"
            style={{ boxShadow: "0 0 60px 10px hsla(43, 85%, 58%, 0.03)" }}
          />
        </div>

        {/* Floating service labels */}
        {SERVICE_LABELS.map(({ label, angle, delay }) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
            className="absolute text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white/40 font-light pointer-events-none whitespace-nowrap hidden md:block"
            style={{
              transform: `rotate(${angle}deg) translateY(-${window.innerWidth >= 1024 ? 290 : 240}px) rotate(-${angle}deg)`,
            }}
          >
            {label}
          </motion.span>
        ))}

        {/* Gold accent dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-1.5 h-1.5 rounded-full mb-8 md:mb-10"
          style={{ background: "hsl(43, 85%, 58%)", boxShadow: "0 0 20px 4px hsla(43, 85%, 58%, 0.4)" }}
        />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-semibold text-white/95 leading-[1.05] tracking-[0.08em] uppercase"
          style={{
            fontSize: "clamp(1.6rem, 5.5vw, 4.2rem)",
            textShadow: "0 2px 30px hsla(0, 0%, 0%, 0.5)",
          }}
        >
          Private Aviation
          <br />
          <span
            className="font-light italic tracking-[0.12em]"
            style={{ color: "hsl(43, 85%, 68%)" }}
          >
            Redefined
          </span>
        </motion.h1>

        {/* Thin gold divider */}
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
              className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-light"
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
