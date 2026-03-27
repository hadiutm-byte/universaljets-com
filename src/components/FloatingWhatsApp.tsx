import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/gtmEvents";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/971585918498?text=" + encodeURIComponent("Hello, I would like to request a private jet charter.");

const FloatingWhatsApp = () => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handlePickerOpen = () => setHidden(true);
    const handlePickerClose = () => setHidden(false);
    document.addEventListener("picker-open", handlePickerOpen);
    document.addEventListener("picker-close", handlePickerClose);
    return () => {
      document.removeEventListener("picker-open", handlePickerOpen);
      document.removeEventListener("picker-close", handlePickerClose);
    };
  }, []);

  const shouldHideOnRoute = location.pathname === "/request-flight" || location.pathname === "/search";

  if (hidden || shouldHideOnRoute) return null;

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("floating_button")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 4, duration: 0.5 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      className="floating-search-aware fixed bottom-[5.5rem] right-6 z-[39] w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-[hsl(220,10%,12%)] border border-white/10 shadow-[0_4px_20px_hsla(0,0%,0%,0.4)] flex items-center justify-center group transition-[opacity,box-shadow] duration-200 hover:shadow-[0_0_20px_-4px_hsla(43,74%,49%,0.25)] safe-bottom"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" strokeWidth={1.5} />
    </motion.a>
  );
};

export default FloatingWhatsApp;
