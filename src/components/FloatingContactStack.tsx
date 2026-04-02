import { useState, useEffect, useRef } from "react";
import { Phone, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useLocation } from "react-router-dom";
import { trackWhatsAppClick } from "@/lib/gtmEvents";

const WHATSAPP_URL = "https://wa.me/447888999944?text=" + encodeURIComponent("Hello, I would like to request a private jet charter.");
const PHONE_URL = "tel:+447888999944";

const ACTION_ROUTES = ["/request-flight", "/search", "/jet-card-inquiry"];

const FloatingContactStack = () => {
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

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

  if (pickerOpen || ACTION_ROUTES.includes(location.pathname)) return null;

  const buttons = [
    {
      key: "phone",
      href: PHONE_URL,
      icon: Phone,
      label: "Call Us",
      onClick: () => {},
      external: false,
    },
    {
      key: "whatsapp",
      href: WHATSAPP_URL,
      icon: MessageCircle,
      label: "WhatsApp",
      onClick: () => trackWhatsAppClick("floating_stack"),
      external: true,
    },
    {
      key: "ricky",
      href: "#",
      icon: Sparkles,
      label: "Ask Ricky",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("openRickyChat"));
      },
      external: false,
    },
  ];

  return (
    <>
      {/* Invisible full-screen drag constraint boundary */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[38]" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-[39] hidden md:flex flex-col gap-2.5 cursor-grab active:cursor-grabbing touch-none"
        onMouseEnter={() => setShowLabels(true)}
        onMouseLeave={() => setShowLabels(false)}
      >
        {buttons.map((btn, i) => (
          <motion.a
            key={btn.key}
            href={btn.href}
            target={btn.external ? "_blank" : undefined}
            rel={btn.external ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (isDragging) { e.preventDefault(); return; }
              (btn.onClick as any)(e);
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.2 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="group flex items-center gap-2.5"
            aria-label={btn.label}
          >
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[hsl(220,10%,12%)] border border-white/10 shadow-[0_4px_20px_hsla(0,0%,0%,0.4)] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_-4px_hsla(43,85%,58%,0.25)] group-hover:border-primary/20">
              <btn.icon className="w-[18px] h-[18px] text-primary/80 group-hover:text-primary transition-colors" strokeWidth={1.5} />
            </div>
            <AnimatePresence>
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0, x: -6, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -6, width: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-light whitespace-nowrap overflow-hidden"
                >
                  {btn.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        ))}
      </motion.div>
    </>
  );
};

export default FloatingContactStack;
