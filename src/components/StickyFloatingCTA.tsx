import { Plane, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const StickyFloatingCTA = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full px-2 py-2"
      // Solid dark pill — no backdrop-blur stacking
      // Uses inline style for the solid background to avoid class conflicts
    >
      <div className="absolute inset-0 rounded-full bg-[hsl(220,10%,10%)] border border-white/10 shadow-[0_12px_40px_hsla(0,0%,0%,0.4)]" />
      <Link
        to="/contact"
        className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors"
      >
        <Plane size={14} strokeWidth={1.5} />
        Request a Flight
      </Link>
      <a
        href="https://wa.me/447888999944"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 text-white/70 text-[10px] tracking-[0.15em] uppercase font-medium hover:text-white hover:border-primary/40 transition-colors"
      >
        <Phone size={13} strokeWidth={1.5} />
        WhatsApp
      </a>
    </motion.div>
  );
};

export default StickyFloatingCTA;
