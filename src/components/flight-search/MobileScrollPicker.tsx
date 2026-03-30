import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrumColumn, { ITEM_H, MID } from "./DrumColumn";
import { setBodyUiState } from "@/lib/bodyUiState";

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

const MobileScrollPicker = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "Select",
}: MobileScrollPickerProps) => {
  const [open, setOpenState] = useState(false);
  const setOpen = (v: boolean) => {
    setOpenState(v);
    document.dispatchEvent(new CustomEvent(v ? "picker-open" : "picker-close"));
  };
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setCurrentIndex(idx);
  }, [value, options]);

  useEffect(() => {
    if (!open) return;

    setBodyUiState("picker-open", true);
    return () => setBodyUiState("picker-open", false);
  }, [open]);

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
          className={`w-full text-left bg-transparent text-[14px] font-normal focus:outline-none cursor-pointer transition-all duration-200 active:scale-[0.97] active:opacity-80 ${
            value ? "text-white" : "text-white/35"
          }`}
        >
          {selectedLabel}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(0,0%,12%)] rounded-t-3xl shadow-[0_-20px_60px_-10px_hsla(0,0%,0%,0.5)]"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-foreground/10" />
              </div>

              <div className="flex items-center justify-between px-6 py-3">
                <button type="button" onClick={() => setOpen(false)}
                  className="text-[14px] text-muted-foreground font-medium active:opacity-60 transition-opacity">
                  Cancel
                </button>
                <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-semibold">
                  {label}
                </span>
                <button type="button" onClick={confirm}
                  className="text-[14px] text-primary font-semibold active:opacity-60 transition-opacity">
                  Done
                </button>
              </div>

              <div className="relative mx-4 mb-6">
                <div
                  className="absolute left-0 right-0 z-10 pointer-events-none border-y border-primary/15 bg-primary/[0.04] rounded-xl"
                  style={{ top: MID * ITEM_H, height: ITEM_H }}
                />
                <DrumColumn
                  options={options}
                  selectedIndex={currentIndex}
                  onSelect={setCurrentIndex}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileScrollPicker;
