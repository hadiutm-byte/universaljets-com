import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroJet from "@/assets/hero-jet.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
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

      {/* Subtle cloud/light motion layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-cloud hero-cloud-1" />
        <div className="hero-cloud hero-cloud-2" />
      </div>

      {/* Layered gradient overlay for cinematic depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(220,10%,5%,0.65)] via-[hsla(220,10%,6%,0.15)] to-[hsla(220,10%,5%,0.75)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsla(220,10%,5%,0.3)] via-transparent to-[hsla(220,10%,5%,0.15)]" />
      </div>

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
          className="w-[1px] h-14 bg-gradient-to-b from-transparent via-primary to-transparent mb-8 origin-top"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[10px] md:text-[11px] tracking-[0.6em] uppercase text-primary mb-12 font-medium"
          style={{ textShadow: "0 2px 16px hsla(45,79%,46%,0.35)" }}
        >
          Private Aviation Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[0.92] tracking-tight mb-12"
        >
          <span
            className="block text-[2.6rem] sm:text-[3.2rem] md:text-[4.8rem] lg:text-[6.5rem] font-semibold text-white"
            style={{ textShadow: "0 4px 40px hsla(0,0%,0%,0.6), 0 1px 0 hsla(0,0%,100%,0.05)" }}
          >
            Private Aviation.
          </span>
          <motion.span
            className="block text-[3.2rem] sm:text-[4.2rem] md:text-[5.8rem] lg:text-[8rem] text-gradient-gold italic font-medium mt-1 relative"
            style={{ textShadow: "0 4px 40px hsla(45,79%,46%,0.2)" }}
            animate={{
              filter: [
                "drop-shadow(0 0 0px hsla(45,79%,46%,0))",
                "drop-shadow(0 0 20px hsla(45,79%,46%,0.15))",
                "drop-shadow(0 0 0px hsla(45,79%,46%,0))",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Perfected.
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="max-w-md mx-auto mb-16"
        >
          <p
            className="text-[16px] md:text-[18px] text-white/70 font-light leading-[1.9] tracking-[0.02em] mb-2"
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
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="px-10 py-4 bg-gradient-gold text-white text-[10px] tracking-[0.32em] uppercase font-medium rounded-xl cursor-pointer flex items-center gap-3 shadow-[0_4px_20px_-4px_hsla(45,79%,46%,0.3)] hover:shadow-[0_8px_40px_-8px_hsla(45,79%,46%,0.5)] transition-shadow duration-500"
          >
            Request a Flight
            <ArrowRight size={14} strokeWidth={1.5} />
          </motion.button>
          <motion.a
            href="#empty-legs"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-8 py-4 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/55 hover:text-white text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl transition-all duration-500"
          >
            View Empty Legs
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] tracking-[0.5em] uppercase text-white/30 font-light">Scroll</span>
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
