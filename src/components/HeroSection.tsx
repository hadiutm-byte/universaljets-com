import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroJet from "@/assets/hero-jet.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background image — single layer, no mouse parallax for perf */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <img
          src={heroJet}
          alt="Private jet flying above clouds at golden hour"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Single dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsla(220,10%,6%,0.55)] via-[hsla(220,10%,6%,0.3)] to-[hsla(220,10%,6%,0.7)] pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-32 pb-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Gold accent line */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent mb-8 origin-top"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[11px] md:text-[12px] tracking-[0.5em] uppercase text-primary mb-10 font-medium"
          style={{ textShadow: "0 2px 12px hsla(45,79%,46%,0.3)" }}
        >
          Private Aviation Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[0.95] tracking-tight mb-10"
        >
          <span
            className="block text-[2.8rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-semibold text-white"
            style={{ textShadow: "0 4px 30px hsla(0,0%,0%,0.5)" }}
          >
            Private Aviation.
          </span>
          <span
            className="block text-[3.4rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8.5rem] text-gradient-gold italic font-medium mt-2"
            style={{ textShadow: "0 4px 30px hsla(45,79%,46%,0.15)" }}
          >
            Perfected.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="max-w-md mx-auto mb-14"
        >
          <p
            className="text-[16px] md:text-[18px] text-white/70 font-light leading-[1.9] tracking-[0.01em] mb-2"
            style={{ textShadow: "0 2px 8px hsla(0,0%,0%,0.4)" }}
          >
            Access the entire global private jet market —
            <br className="hidden sm:block" />
            not just one fleet.
          </p>
          <p
            className="text-[14px] md:text-[15px] text-white/45 font-light leading-[1.8]"
            style={{ textShadow: "0 2px 8px hsla(0,0%,0%,0.4)" }}
          >
            Better aircraft. Better pricing. Total flexibility.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 40px -8px hsla(45,79%,46%,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="px-10 py-4 bg-gradient-gold text-white text-[11px] tracking-[0.3em] uppercase font-medium rounded-xl cursor-pointer flex items-center gap-3 transition-shadow duration-300"
          >
            Request a Flight
            <ArrowRight size={14} strokeWidth={1.5} />
          </motion.button>
          <a
            href="#empty-legs"
            className="px-8 py-4 border border-white/12 bg-white/5 hover:bg-white/8 text-white/60 hover:text-white text-[11px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-300"
          >
            View Empty Legs
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/35 font-light">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-gradient-to-b from-primary/25 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
