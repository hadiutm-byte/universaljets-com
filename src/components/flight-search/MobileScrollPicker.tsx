import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

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

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = currentIndex * ITEM_HEIGHT;
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    setCurrentIndex(Math.max(0, Math.min(idx, options.length - 1)));
  }, [options.length]);

  const confirm = () => {
    onChange(options[currentIndex]?.value || "");
    setOpen(false);
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

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl border-t border-border shadow-[0_-10px_40px_-10px_hsla(0,0%,0%,0.2)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[13px] text-muted-foreground font-medium"
                >
                  Cancel
                </button>
                <span className="text-[12px] tracking-[0.2em] uppercase text-foreground/60 font-semibold">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={confirm}
                  className="text-[13px] text-primary font-semibold"
                >
                  Done
                </button>
              </div>

              {/* Scroll wheel */}
              <div className="relative" style={{ height: PICKER_HEIGHT }}>
                {/* Selection highlight */}
                <div
                  className="absolute left-4 right-4 border-y border-primary/20 bg-primary/[0.04] rounded-lg pointer-events-none z-10"
                  style={{
                    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                    height: ITEM_HEIGHT,
                  }}
                />

                {/* Scrollable list */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
                  style={{
                    scrollSnapType: "y mandatory",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {/* Top padding */}
                  <div style={{ height: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />

                  {options.map((opt, i) => {
                    const isSelected = i === currentIndex;
                    return (
                      <div
                        key={opt.value}
                        className="snap-center flex items-center justify-center transition-all duration-150"
                        style={{ height: ITEM_HEIGHT }}
                      >
                        <span
                          className={`text-[16px] transition-all duration-150 ${
                            isSelected
                              ? "text-foreground font-semibold scale-105"
                              : "text-muted-foreground/50 font-normal"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Bottom padding */}
                  <div style={{ height: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
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
