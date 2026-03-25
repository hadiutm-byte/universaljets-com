import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-jet-v2.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <img
          src={heroImage}
          alt="Gulfstream private jet flying above clouds at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50" />
      <div className="absolute inset-0 bg-background/20" />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-8 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gold mb-8 font-light"
        >
          Private Aviation Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.8rem] md:text-7xl lg:text-[5.5rem] font-display font-semibold leading-[1] tracking-tight mb-10"
        >
          Private Aviation.
          <br />
          <span className="text-gradient-gold italic font-medium">Perfected.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-14 font-extralight leading-[1.8] tracking-wide"
        >
          Global access to private jets with unmatched pricing, precision, and 24/7 advisory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="#cta"
            className="group px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,55%,52%,0.5)] hover:scale-[1.02]"
          >
            Request a Flight
          </a>
          <a
            href="#empty-legs"
            className="group px-10 py-4 luxury-border luxury-border-hover text-foreground/80 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-sm transition-all duration-500 hover:scale-[1.02]"
          >
            View Empty Legs
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade & scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-10"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
