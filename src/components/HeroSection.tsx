import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-jet-v3.jpg";
import FlightSearchBox from "./FlightSearchBox";
import { useMouseParallax } from "@/hooks/useScrollEffects";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mouse = useMouseParallax(0.015);

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -120]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.5]);

  const handleStartWithRicky = () => {
    document.dispatchEvent(new CustomEvent("open-ricky-booking"));
  };

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pb-10 pt-20">
      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Parallax Background with mouse tracking */}
      <motion.div
        className="absolute inset-[-15%]"
        style={{ y: imageY, scale: imageScale, x: mouse.x * 0.5 }}
      >
        <img
          src={heroImage}
          alt="Private jet above clouds at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Cinematic light flare */}
        <motion.div className="absolute inset-0" style={{ x: mouse.x * 2, y: mouse.y * 2 }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_55%_45%,_hsla(38,60%,55%,0.18)_0%,_transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_25%_at_55%_48%,_hsla(38,50%,60%,0.1)_0%,_transparent_55%)]" />
        </motion.div>
      </motion.div>

      {/* Cloud layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-cloud hero-cloud-1" />
        <div className="hero-cloud hero-cloud-2" />
        <div className="hero-cloud hero-cloud-3" />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/[0.85] via-background/[0.25] to-background/[0.95]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,_transparent_20%,_hsl(var(--background)/0.7)_100%)]" />

      {/* Progressive overlay on scroll */}
      <motion.div className="absolute inset-0 bg-background pointer-events-none" style={{ opacity: overlayOpacity }} />

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(0,0%,100%,0.03) 2px, hsla(0,0%,100%,0.03) 4px)",
      }} />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Gold line */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold to-transparent mb-8 origin-top"
        />

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-primary/70 mb-10 font-light"
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
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="max-w-lg mx-auto mb-12"
        >
          <p className="text-[13px] md:text-[15px] text-foreground/55 font-extralight leading-[2] tracking-[0.02em] mb-2">
            Access the entire global private jet market —
            <br className="hidden sm:block" />
            not just one fleet.
          </p>
          <p className="text-[11px] md:text-[12px] text-foreground/35 font-extralight leading-[1.8] tracking-wide">
            Better aircraft. Better pricing. Total flexibility.
          </p>
        </motion.div>

        {/* CTA Buttons — primary triggers Ricky */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px -8px hsla(38,52%,50%,0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartWithRicky}
            className="btn-luxury px-10 py-4 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.28em] uppercase font-medium rounded-sm cursor-pointer"
          >
            Start with Ricky
          </motion.button>
          <a
            href="#empty-legs"
            className="btn-luxury px-10 py-4 glass-panel text-foreground/50 hover:text-foreground/90 text-[9px] tracking-[0.28em] uppercase font-light rounded-sm"
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
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-gold/25 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
