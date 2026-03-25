import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-jet-v3.jpg";
import FlightSearchBox from "./FlightSearchBox";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Slow parallax zoom + drift
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -100]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pb-10 pt-20">
      {/* Parallax Background with slow zoom */}
      <motion.div className="absolute inset-[-10%]" style={{ y: imageY, scale: imageScale }}>
        <img
          src={heroImage}
          alt="Private jet above clouds at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Jet glow/reflection effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_55%_45%,_hsla(38,60%,55%,0.08)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Animated cloud layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-cloud hero-cloud-1" />
        <div className="hero-cloud hero-cloud-2" />
        <div className="hero-cloud hero-cloud-3" />
      </div>

      {/* Cinematic overlays — deep contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/[0.92] via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,_transparent_30%,_hsl(var(--background))_100%)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Gold line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mb-8 origin-center"
        />

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-gold/60 mb-10 font-light"
        >
          Private Aviation Redefined
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[1] tracking-tight mb-10"
        >
          <span className="block text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] font-semibold text-foreground">
            Private Aviation.
          </span>
          <span className="block text-[3.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] text-gradient-gold italic font-medium mt-1">
            Perfected.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="text-[12px] md:text-[14px] text-foreground/35 max-w-lg mx-auto mb-12 font-extralight leading-[2.1] tracking-[0.02em]"
        >
          Charter smarter. Access the global private jet market with better pricing, full flexibility, and 24/7 expert advisory.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <a
            href="#cta"
            className="group px-10 py-4 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.28em] uppercase font-medium rounded-sm transition-all duration-600 hover:shadow-[0_0_50px_-10px_hsla(38,52%,50%,0.5)] hover:scale-[1.03]"
          >
            Request a Flight
          </a>
          <a
            href="#empty-legs"
            className="group px-10 py-4 luxury-border text-foreground/50 hover:text-foreground/90 text-[9px] tracking-[0.28em] uppercase font-light rounded-sm transition-all duration-600 hover:border-[hsla(0,0%,100%,0.15)] hover:scale-[1.03]"
          >
            View Empty Legs
          </a>
        </motion.div>

        {/* Search Box */}
        <FlightSearchBox />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[7px] tracking-[0.4em] uppercase text-foreground/20 font-extralight">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gold/25 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
