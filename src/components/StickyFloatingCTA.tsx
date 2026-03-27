import { Plane, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** Routes where the user is actively taking action — no CTA needed */
const ACTION_ROUTES = ["/request-flight", "/search", "/jet-card-inquiry"];

const StickyFloatingCTA = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const handlePickerOpen = () => setPickerOpen(true);
    const handlePickerClose = () => setPickerOpen(false);
    document.addEventListener("picker-open", handlePickerOpen);
    document.addEventListener("picker-close", handlePickerClose);
    return () => {
      document.removeEventListener("picker-open", handlePickerOpen);
      document.removeEventListener("picker-close", handlePickerClose);
    };
  }, []);

  const onActionRoute = ACTION_ROUTES.includes(location.pathname);

  if (pickerOpen || onActionRoute) return null;

  return (
    <motion.div
      style={{ opacity, bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      className="floating-search-aware fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full px-2.5 py-2.5 bg-[hsl(220,10%,8%)] border border-white/[0.06] shadow-[0_8px_40px_hsla(0,0%,0%,0.5)] transition-opacity duration-200"
    >
      <Link
        to="/request-flight"
        className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-all duration-500 hover:shadow-[0_0_20px_-4px_hsla(43,74%,49%,0.3)] active:scale-95 min-h-[48px]"
      >
        <Plane size={13} strokeWidth={1.5} />
        Request a Flight
      </Link>
      <a
        href="https://wa.me/447888999944"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/[0.08] text-white/50 text-[9px] tracking-[0.2em] uppercase font-medium hover:text-white hover:border-primary/30 transition-all duration-500 active:scale-95 min-h-[48px]"
      >
        <Phone size={12} strokeWidth={1.5} />
        WhatsApp
      </a>
    </motion.div>
  );
};

export default StickyFloatingCTA;
