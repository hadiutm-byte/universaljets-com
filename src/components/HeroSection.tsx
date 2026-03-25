import { motion } from "framer-motion";
import heroImage from "@/assets/hero-jet.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Private jet flying above clouds at sunset"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold mb-6 font-light"
        >
          Private Aviation Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold leading-[0.95] tracking-tight mb-8"
        >
          Fly Smarter.
          <br />
          <span className="text-gradient-gold">Fly Private.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Access the global private jet market with unmatched pricing, flexibility, and 24/7 advisory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#cta"
            className="px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-all duration-300 rounded-sm glow-gold"
          >
            Request a Flight
          </a>
          <a
            href="#empty-legs"
            className="px-10 py-4 luxury-border text-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/5 transition-all duration-300 rounded-sm"
          >
            View Empty Legs
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
