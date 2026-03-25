import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, Loader2, RotateCcw, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import DateTimePicker from "@/components/flight-search/DateTimePicker";

type TripType = "one-way" | "round-trip" | "multi-city";

interface Leg {
  from: string;
  to: string;
  fromQuery: string;
  toQuery: string;
  selectedFrom: Airport | null;
  selectedTo: Airport | null;
  date: Date | undefined;
}

const emptyLeg = (): Leg => ({
  from: "", to: "", fromQuery: "", toQuery: "",
  selectedFrom: null, selectedTo: null, date: undefined,
});

const tripTabs: { value: TripType; label: string }[] = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-city", label: "Multi-City" },
];

/* ─── Airport Dropdown ─── */
const AirportDropdown = ({
  airports, loading, onSelect,
}: {
  airports?: Airport[];
  loading: boolean;
  onSelect: (a: Airport) => void;
}) => (
  <div className="absolute top-full left-0 right-0 mt-1 glass-strong rounded-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
    {loading && (
      <div className="px-4 py-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Loader2 size={12} className="animate-spin" /> Searching...
      </div>
    )}
    {!loading && airports?.length === 0 && (
      <div className="px-4 py-3 text-[11px] text-muted-foreground font-light">No airports found</div>
    )}
    {airports?.map((airport) => (
      <button
        key={airport.id}
        onClick={() => onSelect(airport)}
        className="w-full px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.03] last:border-0"
      >
        <span className="text-[12px] text-foreground/90 font-light">{airport.city}</span>
        <span className="text-[10px] text-muted-foreground ml-2">
          {airport.icao || airport.iata} · {airport.name}
        </span>
      </button>
    ))}
  </div>
);

/* ─── Airport Input Field ─── */
const AirportField = ({
  label, icon: Icon, value, onChangeValue, query, onChangeQuery, selectedAirport, onSelect, onClearSelection,
}: {
  label: string;
  icon: typeof MapPin;
  value: string;
  onChangeValue: (v: string) => void;
  query: string;
  onChangeQuery: (v: string) => void;
  selectedAirport: Airport | null;
  onSelect: (a: Airport) => void;
  onClearSelection: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: airports, isLoading } = useAirportSearch(query);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)] relative" ref={ref}>
      <div className="px-4 py-4">
        <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
          <Icon size={8} strokeWidth={1.5} /> {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChangeValue(e.target.value);
            onChangeQuery(e.target.value);
            onClearSelection();
            setShowDropdown(true);
          }}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder="City or airport"
          className="w-full bg-transparent text-[13px] text-foreground/90 placeholder:text-foreground/20 font-light focus:outline-none tracking-wide"
        />
      </div>
      {showDropdown && query.length >= 2 && (
        <AirportDropdown
          airports={airports}
          loading={isLoading}
          onSelect={(a) => {
            onSelect(a);
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

const FlightSearchBox = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [legs, setLegs] = useState<Leg[]>([emptyLeg()]);
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("");

  const updateLeg = (index: number, updates: Partial<Leg>) => {
    setLegs((prev) => prev.map((l, i) => (i === index ? { ...l, ...updates } : l)));
  };

  const addLeg = () => {
    if (legs.length < 5) setLegs((prev) => [...prev, emptyLeg()]);
  };

  const removeLeg = (index: number) => {
    if (legs.length > 2) setLegs((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset legs when switching trip type
  useEffect(() => {
    if (tripType === "multi-city") {
      if (legs.length < 2) setLegs([emptyLeg(), emptyLeg()]);
    } else {
      setLegs([legs[0] || emptyLeg()]);
    }
    if (tripType === "one-way") setReturnDate("");
  }, [tripType]);

  const primaryLeg = legs[0];
  const canSearch = primaryLeg.selectedFrom && primaryLeg.selectedTo;

  const handleSearch = () => {
    if (!canSearch) return;
    const params = new URLSearchParams({
      trip_type: tripType,
      from_icao: primaryLeg.selectedFrom!.icao || primaryLeg.selectedFrom!.iata,
      to_icao: primaryLeg.selectedTo!.icao || primaryLeg.selectedTo!.iata,
      from_label: `${primaryLeg.selectedFrom!.city} (${primaryLeg.selectedFrom!.icao || primaryLeg.selectedFrom!.iata})`,
      to_label: `${primaryLeg.selectedTo!.city} (${primaryLeg.selectedTo!.icao || primaryLeg.selectedTo!.iata})`,
    });
    if (primaryLeg.date) params.set("date", primaryLeg.date);
    if (tripType === "round-trip" && returnDate) params.set("return_date", returnDate);
    if (passengers) params.set("passengers", passengers);
    if (tripType === "multi-city") {
      legs.forEach((leg, i) => {
        if (i === 0) return;
        if (leg.selectedFrom && leg.selectedTo) {
          params.set(`leg${i + 1}_from`, leg.selectedFrom.icao || leg.selectedFrom.iata);
          params.set(`leg${i + 1}_to`, leg.selectedTo.icao || leg.selectedTo.iata);
          if (leg.date) params.set(`leg${i + 1}_date`, leg.date);
        }
      });
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto mt-4"
    >
      {/* Trip Type Tabs */}
      <div className="flex items-center justify-center gap-1 mb-3">
        {tripTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTripType(tab.value)}
            className={`relative px-5 py-2 text-[9px] tracking-[0.25em] uppercase font-light rounded-full transition-all duration-400 cursor-pointer ${
              tripType === tab.value
                ? "text-primary-foreground"
                : "text-foreground/35 hover:text-foreground/60"
            }`}
          >
            {tripType === tab.value && (
              <motion.div
                layoutId="tripTab"
                className="absolute inset-0 bg-gradient-gold rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="glass-search rounded-2xl p-3 group/box">
        <AnimatePresence mode="wait">
          {tripType !== "multi-city" ? (
            <motion.div
              key="standard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-[1fr_1fr_0.9fr_0.9fr_0.6fr_auto] gap-0"
            >
              {/* From */}
              <AirportField
                label="From"
                icon={MapPin}
                value={primaryLeg.from}
                onChangeValue={(v) => updateLeg(0, { from: v })}
                query={primaryLeg.fromQuery}
                onChangeQuery={(v) => updateLeg(0, { fromQuery: v })}
                selectedAirport={primaryLeg.selectedFrom}
                onSelect={(a) => updateLeg(0, { from: `${a.city} (${a.icao || a.iata})`, selectedFrom: a })}
                onClearSelection={() => updateLeg(0, { selectedFrom: null })}
              />

              {/* To */}
              <AirportField
                label="To"
                icon={MapPin}
                value={primaryLeg.to}
                onChangeValue={(v) => updateLeg(0, { to: v })}
                query={primaryLeg.toQuery}
                onChangeQuery={(v) => updateLeg(0, { toQuery: v })}
                selectedAirport={primaryLeg.selectedTo}
                onSelect={(a) => updateLeg(0, { to: `${a.city} (${a.icao || a.iata})`, selectedTo: a })}
                onClearSelection={() => updateLeg(0, { selectedTo: null })}
              />

              {/* Departure Date */}
              <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
                <div className="px-4 py-4">
                  <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
                    <Calendar size={8} strokeWidth={1.5} /> Departure
                  </label>
                  <input
                    type="date"
                    value={primaryLeg.date}
                    onChange={(e) => updateLeg(0, { date: e.target.value })}
                    className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none [color-scheme:dark] tracking-wide"
                  />
                </div>
              </div>

              {/* Return Date */}
              <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
                <div className="px-4 py-4">
                  <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
                    <RotateCcw size={8} strokeWidth={1.5} /> Return
                  </label>
                  {tripType === "round-trip" ? (
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none [color-scheme:dark] tracking-wide"
                    />
                  ) : (
                    <p className="text-[13px] text-foreground/15 font-light tracking-wide">—</p>
                  )}
                </div>
              </div>

              {/* Passengers */}
              <div>
                <div className="px-4 py-4">
                  <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
                    <Users size={8} strokeWidth={1.5} /> Guests
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none appearance-none cursor-pointer tracking-wide"
                  >
                    <option value="" className="bg-[hsl(225,28%,10%)] text-foreground">Select</option>
                    {[...Array(16)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-[hsl(225,28%,10%)] text-foreground">{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="col-span-2 md:col-span-1 flex items-center px-2.5 py-2.5">
                <button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  className="w-full md:w-[52px] h-[52px] bg-gradient-gold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500 hover:scale-105 active:scale-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
                >
                  <ArrowRight size={17} className="text-primary-foreground" strokeWidth={2} />
                  <span className="md:hidden text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium">Search</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ─── Multi-City Layout ─── */
            <motion.div
              key="multi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {legs.map((leg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-2 md:grid-cols-[auto_1fr_1fr_0.8fr_auto] gap-0 items-center"
                >
                  {/* Leg number */}
                  <div className="hidden md:flex items-center justify-center px-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-primary/30 font-light">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <AirportField
                    label="From"
                    icon={MapPin}
                    value={leg.from}
                    onChangeValue={(v) => updateLeg(idx, { from: v })}
                    query={leg.fromQuery}
                    onChangeQuery={(v) => updateLeg(idx, { fromQuery: v })}
                    selectedAirport={leg.selectedFrom}
                    onSelect={(a) => updateLeg(idx, { from: `${a.city} (${a.icao || a.iata})`, selectedFrom: a })}
                    onClearSelection={() => updateLeg(idx, { selectedFrom: null })}
                  />

                  <AirportField
                    label="To"
                    icon={MapPin}
                    value={leg.to}
                    onChangeValue={(v) => updateLeg(idx, { to: v })}
                    query={leg.toQuery}
                    onChangeQuery={(v) => updateLeg(idx, { toQuery: v })}
                    selectedAirport={leg.selectedTo}
                    onSelect={(a) => updateLeg(idx, { to: `${a.city} (${a.icao || a.iata})`, selectedTo: a })}
                    onClearSelection={() => updateLeg(idx, { selectedTo: null })}
                  />

                  <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
                    <div className="px-4 py-4">
                      <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-primary/55 mb-2 font-light">
                        <Calendar size={8} strokeWidth={1.5} /> Date
                      </label>
                      <input
                        type="date"
                        value={leg.date}
                        onChange={(e) => updateLeg(idx, { date: e.target.value })}
                        className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none [color-scheme:dark] tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Remove leg */}
                  <div className="flex items-center px-2">
                    {legs.length > 2 && (
                      <button
                        onClick={() => removeLeg(idx)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/20 hover:text-foreground/50 hover:bg-white/[0.04] transition-all cursor-pointer"
                      >
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add leg + Passengers + Search */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  {legs.length < 5 && (
                    <button
                      onClick={addLeg}
                      className="flex items-center gap-2 px-4 py-2 text-[9px] tracking-[0.2em] uppercase text-primary/50 hover:text-primary/80 font-light border border-border/10 hover:border-primary/15 rounded-lg transition-all cursor-pointer"
                    >
                      <Plus size={10} strokeWidth={1.5} /> Add Flight
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="text-[7.5px] tracking-[0.35em] uppercase text-primary/55 font-light">
                      <Users size={8} strokeWidth={1.5} className="inline mr-1" />Guests
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none appearance-none cursor-pointer tracking-wide"
                    >
                      <option value="" className="bg-[hsl(225,28%,10%)] text-foreground">—</option>
                      {[...Array(16)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-[hsl(225,28%,10%)] text-foreground">{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-gold rounded-xl text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowRight size={14} strokeWidth={2} />
                  Search Flights
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FlightSearchBox;
