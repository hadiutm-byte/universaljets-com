import { useState, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Airport Dropdown ─── */
const AirportDropdown = ({
  airports,
  loading,
  onSelect,
}: {
  airports?: Airport[];
  loading: boolean;
  onSelect: (a: Airport) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2 }}
    className="absolute top-full left-0 right-0 mt-1.5 bg-background border-2 border-border rounded-xl overflow-hidden z-50 max-h-56 overflow-y-auto shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.15)]"
  >
    {loading && (
      <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-muted-foreground">
        <Loader2 size={13} className="animate-spin text-primary" /> Searching airports...
      </div>
    )}
    {!loading && airports?.length === 0 && (
      <div className="px-4 py-3 text-[12px] text-muted-foreground font-light">No airports found</div>
    )}
    {airports?.map((airport) => (
      <button
        key={airport.id}
        onClick={() => onSelect(airport)}
        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-wider">
            {airport.icao || airport.iata}
          </span>
          <span className="text-[13px] text-foreground font-medium">{airport.city}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 pl-[3rem] font-light truncate">
          {airport.name}
        </p>
      </button>
    ))}
  </motion.div>
);

/* ─── Airport Input Field ─── */
const AirportField = ({
  label,
  icon: Icon,
  value,
  onChangeValue,
  query,
  onChangeQuery,
  selectedAirport,
  onSelect,
  onClearSelection,
  compact = false,
  error = false,
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
  compact?: boolean;
  error?: boolean;
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
    <div className="relative" ref={ref}>
      <div className={`search-field ${error ? "ring-2 ring-destructive/50 border-destructive/40" : ""}`}>
        <label className={`search-label ${error ? "text-destructive" : ""}`}>
          <Icon size={10} strokeWidth={1.5} /> {label}
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
          className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/40 font-normal focus:outline-none"
        />
      </div>
      {error && (
        <p className="text-[10px] text-destructive mt-1 ml-1 font-medium">
          Please select {label === "From" ? "a departure" : "a destination"} airport
        </p>
      )}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default AirportField;
export { AirportDropdown };
