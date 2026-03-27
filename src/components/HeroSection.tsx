import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroJet from "@/assets/hero-jet.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const bgOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background image with parallax + Ken Burns */}
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

      {/* Atmospheric cloud motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-cloud hero-cloud-1" />
        <div className="hero-cloud hero-cloud-2" />
        <div className="hero-cloud hero-cloud-3" />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(0,0%,3%,0.72)] via-[hsla(0,0%,4%,0.45)] to-[hsla(0,0%,3%,0.82)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsla(0,0%,2%,0.55)_100%)]" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-36 pb-20"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Gold accent line */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary/80 to-transparent mb-10 origin-top"
        />

        {/* Eyebrow — "Private Aviation Redefined" */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-display text-[10px] md:text-[12px] tracking-[0.65em] uppercase text-white/95 mb-14 font-semibold"
          style={{ textShadow: "0 0 30px hsla(0,0%,100%,0.15), 0 2px 12px hsla(0,0%,0%,0.8)" }}
        >
          Private Aviation Redefined
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[0.95] tracking-[-0.01em] mb-4"
        >
          <span
            className="block text-fluid-hero font-semibold text-white"
            style={{ textShadow: "0 4px 40px hsla(0,0%,0%,0.8), 0 1px 0 hsla(0,0%,100%,0.03)" }}
          >
            Private Aviation.
          </span>
        </motion.h1>

        {/* "Without Limits" — extrabold italic with layered gold glow */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold italic tracking-[-0.01em] mb-10"
          style={{
            fontSize: "clamp(2rem, 1rem + 5vw, 5.2rem)",
            color: "hsl(43, 85%, 58%)",
            textShadow: "0 0 60px hsla(43,85%,50%,0.5), 0 0 20px hsla(43,85%,50%,0.35), 0 0 6px hsla(43,85%,50%,0.2), 0 2px 4px hsla(0,0%,0%,0.9), 0 4px 30px hsla(0,0%,0%,0.8)",
          }}
        >
          Without Limits.
        </motion.p>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.95 }}
          className="max-w-lg mx-auto mb-14"
        >
          <p
            className="font-display text-[13px] md:text-[15px] text-white/80 font-semibold leading-[1.8] tracking-[0.18em] uppercase"
            style={{ textShadow: "0 2px 20px hsla(0,0%,0%,0.8)" }}
          >
            Global access · Instant quotes · Tailored journeys
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="group px-12 py-4.5 bg-gradient-gold text-white text-[10px] tracking-[0.35em] uppercase font-medium rounded-xl cursor-pointer flex items-center gap-3 shadow-[0_4px_24px_-4px_hsla(43,74%,49%,0.35)] hover:shadow-[0_12px_48px_-8px_hsla(43,74%,49%,0.5)] transition-shadow duration-700"
            style={{ paddingTop: "1.125rem", paddingBottom: "1.125rem" }}
          >
            Request a Flight
            <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-0.5" />
          </motion.button>
          <motion.a
            href="#empty-legs"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="px-9 py-4 border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.2] text-white/60 hover:text-white/90 text-[10px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-700"
            style={{ paddingTop: "1.125rem", paddingBottom: "1.125rem" }}
          >
            View Empty Legs
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 3, duration: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[7px] tracking-[0.6em] uppercase text-white/25 font-light">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-7 bg-gradient-to-b from-primary/20 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
