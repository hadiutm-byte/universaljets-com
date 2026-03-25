import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/useScrollEffects";
import Logo3D from "@/components/Logo3D";
import heroJet from "@/assets/hero-jet.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mouse = useMouseParallax(0.01);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-7, -14]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imgZoom = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Cinematic video background with slow zoom */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <motion.div style={{ x: mouse.x * 0.3, y: mouse.y * 0.3, scale: imgZoom }} className="h-full w-full">
          <img
            src={heroJet}
            alt="Private jet flying above clouds at golden hour"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />

      {/* Subtle gold ambient glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ scale: bgScale }}>
        <motion.div style={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}>
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,_hsla(45,79%,46%,0.08)_0%,_transparent_65%)]" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-depth-logo hidden xl:block"
        style={{ x: mouse.x * 1.1, y: logoY, rotate: logoRotate, opacity: bgOpacity }}
      >
        <div className="hero-depth-shell">
          <Logo3D size={420} opacity={0.95} />
        </div>
      </motion.div>

      <motion.div
        className="hero-perspective-panel hidden lg:block"
        style={{ x: mouse.x * 0.7, y: foregroundY, opacity: bgOpacity }}
      >
        <div className="hero-perspective-panel__line" />
      </motion.div>

      <motion.div
        className="hero-perspective-glow hidden lg:block"
        style={{ x: mouse.x * 0.45, y: mouse.y * 0.35, opacity: bgOpacity }}
      />

      <div className="grid-overlay" />

      <motion.div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-32 pb-16" style={{ opacity: contentOpacity, y: contentY }}>
        {/* Yellow accent line */}
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 1.4, delay: 0.2 }} className="w-[1px] h-14 bg-gradient-to-b from-transparent via-primary to-transparent mb-10 origin-top" />

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-[12px] md:text-[13px] tracking-[0.55em] uppercase text-primary mb-12 font-medium drop-shadow-sm">
          Private Aviation Redefined
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-display leading-[0.95] tracking-tight mb-12">
          <span className="block text-[3.2rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7.5rem] font-semibold text-white drop-shadow-lg">
            Private Aviation.
          </span>
          <span className="block text-[4rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[9rem] text-gradient-gold italic font-medium mt-3 drop-shadow-lg">
            Perfected.
          </span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.85 }} className="max-w-md mx-auto mb-16">
          <p className="text-[17px] md:text-[19px] text-white/70 font-light leading-[2] tracking-[0.01em] mb-3">
            Access the entire global private jet market —
            <br className="hidden sm:block" />
            not just one fleet.
          </p>
          <p className="text-[15px] md:text-[16px] text-white/45 font-light leading-[1.8]">
            Better aircraft. Better pricing. Total flexibility.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.05 }} className="flex flex-col sm:flex-row items-center gap-5">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 8px 50px -8px hsla(45,79%,46%,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="btn-luxury px-12 py-5 bg-gradient-gold text-white text-[12px] tracking-[0.3em] uppercase font-medium rounded-xl cursor-pointer flex items-center gap-3"
          >
            Request a Flight
            <ArrowRight size={15} strokeWidth={1.5} />
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            href="#empty-legs"
            className="btn-luxury px-10 py-5 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[12px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            View Empty Legs
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-light">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-8 bg-gradient-to-b from-primary/30 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
