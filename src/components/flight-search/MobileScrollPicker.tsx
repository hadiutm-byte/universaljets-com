import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface MobileScrollPickerProps {
  label: string;
  icon: React.ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 7;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const CENTER = Math.floor(VISIBLE_ITEMS / 2);

const MobileScrollPicker = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "Select",
}: MobileScrollPickerProps) => {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  // Sync index when value changes externally
  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setCurrentIndex(idx);
  }, [value, options]);

  // Scroll to current on open
  useEffect(() => {
    if (open && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = currentIndex * ITEM_HEIGHT;
        }
      });
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, options.length - 1));
    setCurrentIndex(clamped);
  }, [options.length]);

  const confirm = () => {
    onChange(options[currentIndex]?.value || "");
    setOpen(false);
  };

  const scrollToIndex = (idx: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
    }
    setCurrentIndex(idx);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <>
      <div className="search-field">
        <label className="search-label flex items-center gap-1">
          {icon} {label}
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`w-full text-left bg-transparent text-[14px] font-normal focus:outline-none cursor-pointer transition-colors duration-200 ${
            value ? "text-foreground" : "text-muted-foreground/40"
          }`}
        >
          {selectedLabel}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-[0_-20px_60px_-10px_hsla(0,0%,0%,0.25)]"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-foreground/10" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[14px] text-muted-foreground font-medium active:opacity-60 transition-opacity"
                >
                  Cancel
                </button>
                <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-semibold">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={confirm}
                  className="text-[14px] text-primary font-semibold active:opacity-60 transition-opacity"
                >
                  Done
                </button>
              </div>

              {/* 3D Drum Roller */}
              <div
                className="relative overflow-hidden mx-4 mb-6"
                style={{
                  height: PICKER_HEIGHT,
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
                }}
              >
                {/* Center selection band */}
                <div
                  className="absolute left-0 right-0 z-10 pointer-events-none border-y border-primary/15 bg-primary/[0.04] rounded-xl"
                  style={{
                    top: CENTER * ITEM_HEIGHT,
                    height: ITEM_HEIGHT,
                  }}
                />

                {/* Scrollable drum */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="h-full overflow-y-auto scrollbar-none"
                  style={{
                    scrollSnapType: "y mandatory",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {/* Top spacer */}
                  <div style={{ height: CENTER * ITEM_HEIGHT }} />

                  {options.map((opt, i) => {
                    const distance = Math.abs(i - currentIndex);
                    const maxTilt = 65;
                    const rotateX = Math.min(distance, 3) * (i < currentIndex ? maxTilt / 3 : -maxTilt / 3);
                    const scale = distance === 0 ? 1 : Math.max(0.7, 1 - distance * 0.12);
                    const opacity = distance === 0 ? 1 : Math.max(0.2, 1 - distance * 0.25);
                    const translateZ = distance === 0 ? 0 : -distance * 8;

                    return (
                      <div
                        key={opt.value + i}
                        onClick={() => scrollToIndex(i)}
                        className="snap-center flex items-center justify-center cursor-pointer"
                        style={{
                          height: ITEM_HEIGHT,
                          perspective: "300px",
                        }}
                      >
                        <span
                          className="transition-all duration-100 ease-out select-none"
                          style={{
                            transform: `rotateX(${rotateX}deg) scale(${scale}) translateZ(${translateZ}px)`,
                            opacity,
                            fontSize: distance === 0 ? "17px" : "15px",
                            fontWeight: distance === 0 ? 600 : 400,
                            color: distance === 0
                              ? "hsl(var(--foreground))"
                              : `hsl(var(--muted-foreground) / ${opacity})`,
                          }}
                        >
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Bottom spacer */}
                  <div style={{ height: CENTER * ITEM_HEIGHT }} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileScrollPicker;
