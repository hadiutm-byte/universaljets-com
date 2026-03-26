import { Plane, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const StickyFloatingCTA = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full px-2 py-2 bg-[hsl(220,10%,8%)] border border-white/8 shadow-[0_8px_32px_hsla(0,0%,0%,0.5)]"
    >
      <Link
        to="/contact"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors"
      >
        <Plane size={14} strokeWidth={1.5} />
        Request a Flight
      </Link>
      <a
        href="https://wa.me/447888999944"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-white/60 text-[10px] tracking-[0.15em] uppercase font-medium hover:text-white hover:border-primary/30 transition-colors"
      >
        <Phone size={13} strokeWidth={1.5} />
        WhatsApp
      </a>
    </motion.div>
  );
};

export default StickyFloatingCTA;
