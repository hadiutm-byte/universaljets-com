import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Sparkles, ArrowRight, Plane, Clock, Crown, Zap } from "lucide-react";
import AirportField from "@/components/flight-search/AirportField";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import type { Airport } from "@/hooks/useAviapages";
import { format } from "date-fns";

type TripType = "one-way" | "round-trip" | "multi-city";
type Preference = "best-price" | "specific-aircraft" | "luxury" | "urgent";

interface BookingData {
  tripType: TripType | null;
  from: string;
  fromAirport: Airport | null;
  fromQuery: string;
  to: string;
  toAirport: Airport | null;
  toQuery: string;
  date: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  preference: Preference | null;
}

const initialBooking: BookingData = {
  tripType: null,
  from: "", fromAirport: null, fromQuery: "",
  to: "", toAirport: null, toQuery: "",
  date: undefined, returnDate: undefined,
  passengers: 0,
  preference: null,
};

const stepConfig = [
  { id: "trip-type", label: "How are you flying?", rickyLine: "Let's start simple. What type of trip?" },
  { id: "route", label: "Where to?", rickyLine: "Where are we going? I'll find the best options." },
  { id: "date", label: "When?", rickyLine: "Pick your date and time. I'll check availability." },
  { id: "passengers", label: "Who's coming?", rickyLine: "How many guests are we flying?" },
  { id: "preference", label: "Your priority?", rickyLine: "Last thing — what matters most to you?" },
  { id: "summary", label: "Confirmed", rickyLine: "Here's what I have. Let me work on this." },
];

const tripOptions: { value: TripType; label: string; icon: typeof Plane }[] = [
  { value: "one-way", label: "One Way", icon: ArrowRight },
  { value: "round-trip", label: "Round Trip", icon: Plane },
  { value: "multi-city", label: "Multi-City", icon: Sparkles },
];

const prefOptions: { value: Preference; label: string; desc: string; icon: typeof Crown }[] = [
  { value: "best-price", label: "Best Price", desc: "Optimize cost without compromising quality", icon: Sparkles },
  { value: "specific-aircraft", label: "Specific Aircraft", desc: "I know what jet I want", icon: Plane },
  { value: "luxury", label: "Luxury Experience", desc: "Top-tier service, best cabin available", icon: Crown },
  { value: "urgent", label: "Urgent Departure", desc: "I need to fly ASAP", icon: Zap },
];

interface Props {
  onComplete: (data: BookingData) => void;
  onSpeaking: (speaking: boolean) => void;
}

const GuidedBookingFlow = ({ onComplete, onSpeaking }: Props) => {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<BookingData>(initialBooking);
  const [rickyText, setRickyText] = useState("");
  const [typing, setTyping] = useState(false);

  // Typewriter for Ricky lines
  useEffect(() => {
    const text = stepConfig[step].rickyLine;
    setRickyText("");
    setTyping(true);
    onSpeaking(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setRickyText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
        onSpeaking(false);
      }
    }, 25);
    return () => { clearInterval(interval); onSpeaking(false); };
  }, [step, onSpeaking]);

  const next = () => setStep((s) => Math.min(s + 1, stepConfig.length - 1));
  const canAdvanceRoute = booking.fromAirport && booking.toAirport;
  const canAdvanceDate = booking.date;

  // Auto-advance on summary
  useEffect(() => {
    if (step === stepConfig.length - 1 && !typing) {
      const t = setTimeout(() => onComplete(booking), 2500);
      return () => clearTimeout(t);
    }
  }, [step, typing, booking, onComplete]);

  const stepTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
  const exitTransition = { duration: 0.25 };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex gap-1">
          {stepConfig.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[2px] rounded-full transition-all duration-500"
              style={{
                background: i <= step
                  ? "linear-gradient(90deg, hsla(38,52%,50%,0.8), hsla(38,52%,65%,0.6))"
                  : "hsla(0,0%,100%,0.06)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Ricky speech */}
      <div className="px-5 py-3">
        <p className="text-[12px] text-foreground/50 font-light leading-[1.8] min-h-[2.2em]">
          {rickyText}
          {typing && <span className="text-primary/40 animate-pulse">|</span>}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          {/* STEP 0 — Trip Type */}
          {step === 0 && (
            <motion.div key="trip" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-2">
              {tripOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setBooking((b) => ({ ...b, tripType: opt.value }));
                    next();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
                    booking.tripType === opt.value
                      ? "border-primary/30 bg-primary/[0.06]"
                      : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.03]"
                  }`}
                >
                  <opt.icon size={14} className="text-primary/50 shrink-0" strokeWidth={1.5} />
                  <span className="text-[12px] text-foreground/70 font-light tracking-wide">{opt.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* STEP 1 — Route */}
          {step === 1 && (
            <motion.div key="route" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-1">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
                <AirportField
                  label="From"
                  icon={MapPin}
                  value={booking.from}
                  onChangeValue={(v) => setBooking((b) => ({ ...b, from: v }))}
                  query={booking.fromQuery}
                  onChangeQuery={(v) => setBooking((b) => ({ ...b, fromQuery: v }))}
                  selectedAirport={booking.fromAirport}
                  onSelect={(a) => setBooking((b) => ({ ...b, from: `${a.city} (${a.icao || a.iata})`, fromAirport: a }))}
                  onClearSelection={() => setBooking((b) => ({ ...b, fromAirport: null }))}
                  compact
                />
              </div>
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
                <AirportField
                  label="To"
                  icon={MapPin}
                  value={booking.to}
                  onChangeValue={(v) => setBooking((b) => ({ ...b, to: v }))}
                  query={booking.toQuery}
                  onChangeQuery={(v) => setBooking((b) => ({ ...b, toQuery: v }))}
                  selectedAirport={booking.toAirport}
                  onSelect={(a) => setBooking((b) => ({ ...b, to: `${a.city} (${a.icao || a.iata})`, toAirport: a }))}
                  onClearSelection={() => setBooking((b) => ({ ...b, toAirport: null }))}
                  compact
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canAdvanceRoute}
                onClick={next}
                className="w-full mt-3 py-3 bg-gradient-gold rounded-xl text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)]"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2 — Date & Time */}
          {step === 2 && (
            <motion.div key="date" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-2">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
                <DateTimePicker
                  label="Departure"
                  icon={Calendar}
                  value={booking.date}
                  onChange={(d) => setBooking((b) => ({ ...b, date: d }))}
                  placeholder="Select date & time"
                />
              </div>
              {booking.tripType === "round-trip" && (
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
                  <DateTimePicker
                    label="Return"
                    icon={Clock}
                    value={booking.returnDate}
                    onChange={(d) => setBooking((b) => ({ ...b, returnDate: d }))}
                    placeholder="Select return"
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canAdvanceDate}
                onClick={next}
                className="w-full mt-3 py-3 bg-gradient-gold rounded-xl text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)]"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3 — Passengers */}
          {step === 3 && (
            <motion.div key="pax" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 19].map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBooking((b) => ({ ...b, passengers: n }));
                      next();
                    }}
                    className={`py-3 rounded-xl text-[13px] font-light transition-all duration-300 cursor-pointer ${
                      booking.passengers === n
                        ? "bg-primary/10 border border-primary/30 text-primary"
                        : "bg-white/[0.02] border border-white/[0.04] text-foreground/60 hover:bg-white/[0.04] hover:border-white/[0.08]"
                    }`}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Preference */}
          {step === 4 && (
            <motion.div key="pref" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-2">
              {prefOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setBooking((b) => ({ ...b, preference: opt.value }));
                    next();
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300 cursor-pointer text-left"
                >
                  <opt.icon size={14} className="text-primary/50 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] text-foreground/70 font-light tracking-wide">{opt.label}</p>
                    <p className="text-[10px] text-foreground/30 font-light mt-0.5">{opt.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* STEP 5 — Summary */}
          {step === 5 && (
            <motion.div key="summary" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
              <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-primary/40 font-light">Your Request</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/20 font-light capitalize">
                    {booking.tripType?.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-foreground/70 font-light">
                  <MapPin size={11} className="text-primary/40" />
                  <span>{booking.from || "—"}</span>
                  <ArrowRight size={10} className="text-primary/30" />
                  <span>{booking.to || "—"}</span>
                </div>
                {booking.date && (
                  <div className="flex items-center gap-2 text-[12px] text-foreground/50 font-light">
                    <Calendar size={10} className="text-primary/40" />
                    <span>{format(booking.date, "dd MMM yyyy • HH:mm")}</span>
                  </div>
                )}
                {booking.returnDate && (
                  <div className="flex items-center gap-2 text-[12px] text-foreground/50 font-light">
                    <Clock size={10} className="text-primary/40" />
                    <span>Return: {format(booking.returnDate, "dd MMM yyyy • HH:mm")}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[12px] text-foreground/50 font-light">
                  <Users size={10} className="text-primary/40" />
                  <span>{booking.passengers} guest{booking.passengers !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
                <span className="text-[10px] text-foreground/30 tracking-wide font-light">Finding options...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GuidedBookingFlow;
