import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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
                    className="text-[10px] tracking-[0.2em] uppercase text-white font-semibold bg-gradient-gold px-4 py-1.5 rounded-lg hover:shadow-[0_4px_16px_-4px_hsla(43,74%,49%,0.4)] transition-all cursor-pointer"
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
