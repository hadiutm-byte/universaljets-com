import { useState, useRef, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import DrumColumn, { ITEM_H, MID } from "./DrumColumn";
import { setBodyUiState } from "@/lib/bodyUiState";

interface DateTimePickerProps {
  label: string;
  icon: typeof CalendarIcon;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});
const buildDateOptions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 90 }, (_, i) => {
    const d = addDays(today, i);
    return {
      value: format(d, "yyyy-MM-dd"),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE, dd MMM"),
      date: d,
    };
  });
};

const buildTimeOptions = () =>
  timeOptions.map((t) => ({ value: t, label: t }));

/* ─── Mobile drum picker for date + time ─── */
const MobileDateTimePicker = ({
  label,
  icon: Icon,
  value,
  onChange,
  disabled = false,
  placeholder = "Select",
}: DateTimePickerProps) => {
  const [open, setOpenState] = useState(false);
  const setOpen = (v: boolean) => {
    setOpenState(v);
    document.dispatchEvent(new CustomEvent(v ? "picker-open" : "picker-close"));
  };
  const dateOpts = buildDateOptions();
  const timeOpts = buildTimeOptions();

  const currentDateStr = value ? format(value, "yyyy-MM-dd") : dateOpts[0].value;
  const currentTimeStr = value ? format(value, "HH:mm") : "12:00";

  const [dateIdx, setDateIdx] = useState(() => {
    const idx = dateOpts.findIndex((o) => o.value === currentDateStr);
    return idx >= 0 ? idx : 0;
  });
  const [timeIdx, setTimeIdx] = useState(() => {
    const idx = timeOpts.findIndex((o) => o.value === currentTimeStr);
    return idx >= 0 ? idx : 24; // default 12:00
  });

  // Sync when value changes
  useEffect(() => {
    if (value) {
      const dStr = format(value, "yyyy-MM-dd");
      const tStr = format(value, "HH:mm");
      const di = dateOpts.findIndex((o) => o.value === dStr);
      const ti = timeOpts.findIndex((o) => o.value === tStr);
      if (di >= 0) setDateIdx(di);
      if (ti >= 0) setTimeIdx(ti);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;

    setBodyUiState("picker-open", true);
    return () => setBodyUiState("picker-open", false);
  }, [open]);

  const confirm = () => {
    const dateEntry = dateOpts[dateIdx];
    const timeEntry = timeOpts[timeIdx];
    if (dateEntry && timeEntry) {
      const d = new Date(dateEntry.date);
      const [h, m] = timeEntry.value.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      onChange(d);
    }
    setOpen(false);
  };

  const displayValue = value
    ? `${format(value, "dd MMM")} • ${format(value, "HH:mm")}`
    : null;

  return (
    <>
      <div className="search-field relative">
        <label className="search-label">
          <Icon size={10} strokeWidth={1.5} /> {label}
        </label>
        {disabled ? (
          <p className="text-[14px] text-muted-foreground/40 font-normal">{placeholder}</p>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "w-full text-left bg-transparent text-[14px] font-normal focus:outline-none cursor-pointer transition-colors duration-200 active:scale-[0.97] active:opacity-80",
              value ? "text-white" : "text-white/35"
            )}
          >
            {displayValue || placeholder}
          </button>
        )}
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-[0_-20px_60px_-10px_hsla(0,0%,0%,0.25)]"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-foreground/10" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3">
                <button type="button" onClick={() => setOpen(false)}
                  className="text-[14px] text-muted-foreground font-medium">Cancel</button>
                <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-semibold">{label}</span>
                <button type="button" onClick={confirm}
                  className="text-[14px] text-primary font-semibold">Done</button>
              </div>

              {/* Drums */}
              <div className="relative mx-4 mb-6">
                {/* Center band */}
                <div
                  className="absolute left-0 right-0 z-10 pointer-events-none border-y border-primary/15 bg-primary/[0.04] rounded-xl"
                  style={{ top: MID * ITEM_H, height: ITEM_H }}
                />

                <div className="flex gap-0">
                  {/* Date column (wider) */}
                  <div className="flex-[2]">
                    <DrumColumn options={dateOpts} selectedIndex={dateIdx} onSelect={setDateIdx} />
                  </div>

                  {/* Separator */}
                  <div className="w-px bg-border/30 my-8" />

                  {/* Time column */}
                  <div className="flex-1">
                    <DrumColumn options={timeOpts} selectedIndex={timeIdx} onSelect={setTimeIdx} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
const DesktopDateTimePicker = ({
  label,
  icon: Icon,
  value,
  onChange,
  disabled = false,
  placeholder = "Select",
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    value ? format(value, "HH:mm") : ""
  );
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && timeRef.current && selectedTime) {
      const el = timeRef.current.querySelector(`[data-time="${selectedTime}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [open, selectedTime]);

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;
    const [h, m] = (selectedTime || "12:00").split(":").map(Number);
    day.setHours(h, m, 0, 0);
    onChange(day);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (value) {
      const updated = new Date(value);
      const [h, m] = time.split(":").map(Number);
      updated.setHours(h, m, 0, 0);
      onChange(updated);
    }
  };

  const displayValue = value
    ? `${format(value, "dd MMM")} • ${selectedTime || "12:00"}`
    : null;

  return (
    <div className="relative">
      <div className="search-field">
        <label className="search-label">
          <Icon size={10} strokeWidth={1.5} /> {label}
        </label>

        {disabled ? (
          <p className="text-[14px] text-muted-foreground/40 font-normal">{placeholder}</p>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full text-left bg-transparent text-[14px] font-normal focus:outline-none cursor-pointer transition-colors duration-200",
                  value
                    ? "text-foreground"
                    : "text-muted-foreground/40"
                )}
              >
                {displayValue || placeholder}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-background border-2 border-border rounded-xl shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.15)] overflow-hidden"
              align="start"
              sideOffset={12}
            >
              <div className="flex">
                <div className="p-1">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>

                <div
                  ref={timeRef}
                  className="border-l-2 border-border w-[80px] max-h-[300px] overflow-y-auto py-1.5 scrollbar-thin"
                >
                  <p className="px-3 pb-2 pt-1 text-[8px] tracking-[0.3em] uppercase text-primary font-medium flex items-center gap-1 sticky top-0 bg-background z-10">
                    <Clock size={8} /> Time
                  </p>
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      data-time={time}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "w-full px-3 py-1.5 text-[12px] text-left font-normal tracking-wider transition-all duration-200 cursor-pointer rounded-md",
                        selectedTime === time
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-foreground/60 hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {value && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t-2 border-border px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-[12px] text-foreground/70 font-medium tracking-wide">
                    {displayValue}
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[10px] tracking-[0.2em] uppercase text-white font-semibold bg-gradient-gold px-4 py-1.5 rounded-lg hover:shadow-[0_4px_16px_-4px_hsla(43,85%,58%,0.4)] transition-all cursor-pointer"
                  >
                    Confirm
                  </button>
                </motion.div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

/* ─── Adaptive wrapper: use native pickers on touch/mobile devices ─── */
const DateTimePicker = (props: DateTimePickerProps) => {
  const isMobile = useIsMobile();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const useMobile = isMobile || isTouch;
  return useMobile ? <MobileDateTimePicker {...props} /> : <DesktopDateTimePicker {...props} />;
};

export default DateTimePicker;
