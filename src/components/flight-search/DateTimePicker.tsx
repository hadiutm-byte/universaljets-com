import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

const DateTimePicker = ({
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

  // Auto-scroll to selected time
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
    <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
      <div className="px-4 py-4">
        <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
          <Icon size={8} strokeWidth={1.5} /> {label}
        </label>

        {disabled ? (
          <p className="text-[13px] text-foreground/15 font-light tracking-wide">—</p>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full text-left bg-transparent text-[13px] font-light focus:outline-none tracking-wide cursor-pointer transition-colors duration-200",
                  value
                    ? "text-foreground/90 hover:text-foreground"
                    : "text-foreground/20 hover:text-foreground/40"
                )}
              >
                {displayValue || placeholder}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-[hsl(var(--background))]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
              align="start"
              sideOffset={12}
            >
              <div className="flex">
                {/* Calendar */}
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

                {/* Time column */}
                <div
                  ref={timeRef}
                  className="border-l border-white/[0.06] w-[76px] max-h-[300px] overflow-y-auto py-1.5 scrollbar-thin"
                >
                  <p className="px-3 pb-2 pt-1 text-[7px] tracking-[0.3em] uppercase text-primary/40 font-light flex items-center gap-1 sticky top-0 bg-[hsl(var(--background))]/95 backdrop-blur-sm z-10">
                    <Clock size={7} /> Time
                  </p>
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      data-time={time}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "w-full px-3 py-1.5 text-[11px] text-left font-light tracking-wider transition-all duration-200 cursor-pointer rounded-md mx-auto",
                        selectedTime === time
                          ? "text-primary bg-primary/10 font-normal"
                          : "text-foreground/50 hover:text-foreground/80 hover:bg-white/[0.04]"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm bar */}
              {value && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between"
                >
                  <span className="text-[11px] text-foreground/60 font-light tracking-wide">
                    {displayValue}
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[9px] tracking-[0.2em] uppercase text-primary font-medium hover:text-primary/80 transition-colors cursor-pointer"
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

export default DateTimePicker;
