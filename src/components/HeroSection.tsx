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

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/60" />
      <div className="absolute inset-0 bg-background/15" />

      {/* Content */}
      <motion.div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center" style={{ opacity: contentOpacity, y: contentY }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mb-10 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-gold/80 mb-8 font-light"
        >
          Private Aviation Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5rem] font-display font-semibold leading-[1.05] tracking-tight mb-8"
        >
          Private Aviation.
          <br />
          <span className="text-gradient-gold italic font-medium">Perfected.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="text-[13px] md:text-sm text-foreground/50 max-w-lg mx-auto mb-2 font-extralight leading-[2] tracking-wide"
        >
          Global access to private jets with unmatched pricing, precision, and 24/7 advisory.
        </motion.p>

        {/* Search Box */}
        <FlightSearchBox />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-[1px] h-14 bg-gradient-to-b from-gold/30 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
