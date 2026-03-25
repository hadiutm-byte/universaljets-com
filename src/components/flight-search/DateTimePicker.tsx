import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  return (
    <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
      <div className="px-4 py-4">
        <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
          <Icon size={8} strokeWidth={1.5} /> {label}
        </label>

        {disabled ? (
          <p className="text-[13px] text-foreground/15 font-light tracking-wide">
            —
          </p>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full text-left bg-transparent text-[13px] font-light focus:outline-none tracking-wide cursor-pointer",
                  value ? "text-foreground/90" : "text-foreground/20"
                )}
              >
                {value
                  ? `${format(value, "dd MMM")} • ${selectedTime || "12:00"}`
                  : placeholder}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 glass-strong border-border/20"
              align="start"
              sideOffset={8}
            >
              <div className="flex">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="border-l border-border/10 w-[72px] max-h-[300px] overflow-y-auto py-2">
                  <p className="px-2 pb-1.5 text-[7px] tracking-[0.3em] uppercase text-primary/40 font-light flex items-center gap-1">
                    <Clock size={7} /> Time
                  </p>
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "w-full px-2 py-1.5 text-[11px] text-left font-light tracking-wide transition-colors cursor-pointer",
                        selectedTime === time
                          ? "text-primary bg-primary/10"
                          : "text-foreground/60 hover:text-foreground/90 hover:bg-white/[0.04]"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
