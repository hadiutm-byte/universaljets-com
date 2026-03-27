import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import heroJet from "@/assets/hero-jet.jpg";
import GoldParticles from "@/components/GoldParticles";

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
      className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-start pt-[22vh]"
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

      {/* Gold dust particles */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <GoldParticles />
      </div>

      {/* Floating orb effect */}
      <div className="absolute pointer-events-none z-[1] animate-hero-orb"
        style={{
          top: "20%",
          left: "25%",
          width: "300px",
          height: "300px",
          background: "linear-gradient(45deg, hsla(43, 85%, 58%, 0.25), hsla(210, 70%, 50%, 0.12))",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      {/* Diagonal grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, hsla(0,0%,100%,0.5) 1px, transparent 1px, transparent 60px)",
        }}
      />

      {/* Deep radial background + dark overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 40%, hsla(0,0%,8%,0.6), hsla(0,0%,0%,0.95) 80%)" }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(0,0%,3%,0.72)] via-[hsla(0,0%,4%,0.35)] to-[hsla(0,0%,3%,0.82)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsla(0,0%,2%,0.55)_100%)]" />
      </div>

      {/* Upper Content — Private Aviation Redefined */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Gold accent line */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-[2px] h-20 bg-gradient-to-b from-transparent via-primary to-transparent mb-8 origin-top"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-display tracking-[0.65em] uppercase text-white/95 font-semibold -mt-4"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", textShadow: "0 0 15px hsl(43, 85%, 42%)" }}
        >
          Private Aviation Redefined
        </motion.p>
      </motion.div>

      {/* Lower Content — Global access (below aircraft, near bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.95 }}
        className="absolute bottom-[38vh] left-0 right-0 z-10 text-center"
      >
        <p
          className="font-display text-[13px] md:text-[15px] text-white/80 font-semibold leading-[1.8] tracking-[0.18em] uppercase"
          style={{ textShadow: "0 2px 20px hsla(0,0%,0%,0.8)" }}
        >
          Global access · Instant quotes · Tailored journeys
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex gap-4 mt-6"
        >
          <Link
            to="/#cta"
            className="hero-cta-primary px-8 py-3 rounded-full text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-500 hover:scale-[1.08]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.background = `radial-gradient(circle at ${x}px ${y}px, hsl(43, 90%, 68%), hsl(43, 80%, 42%))`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '';
            }}
          >
            Request a Flight
          </Link>
          <Link
            to="/fleet"
            className="hero-cta-secondary px-8 py-3 rounded-full text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-500 hover:scale-[1.08]"
          >
            Explore Fleet
          </Link>
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
