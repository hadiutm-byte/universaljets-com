import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-jet-v3.jpg";
import FlightSearchBox from "./FlightSearchBox";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pb-12 pt-24">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <img src={heroImage} alt="Private jet above clouds at golden hour" className="w-full h-full object-cover" width={1920} height={1080} />
      </motion.div>

      {/* Stronger overlays for more cinematic contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/55 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-transparent to-background/65" />
      <div className="absolute inset-0 bg-background/20" />

      {/* Content */}
      <motion.div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center" style={{ opacity: contentOpacity, y: contentY }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/80 to-transparent mb-10 origin-center"
        />

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-display font-semibold leading-[1.05] tracking-tight mb-7"
        >
          Fly Smarter.
          <br />
          <span className="text-gradient-gold italic font-medium">Fly Private.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-[13px] md:text-[15px] text-foreground/45 max-w-xl mx-auto mb-10 font-extralight leading-[2] tracking-wide"
        >
          Access the global private jet market with unmatched pricing, flexibility, and 24/7 advisory.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-6"
        >
          <a
            href="#cta"
            className="px-9 py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02] transition-all duration-500"
          >
            Request a Flight
          </a>
          <a
            href="#empty-legs"
            className="px-9 py-3.5 luxury-border luxury-border-hover text-foreground/60 hover:text-foreground/90 text-[9px] tracking-[0.25em] uppercase font-light rounded-sm hover:scale-[1.02] transition-all duration-500"
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
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-[1px] h-14 bg-gradient-to-b from-gold/30 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
