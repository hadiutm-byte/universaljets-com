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
    className="absolute top-full left-0 right-0 mt-1 bg-[hsl(var(--background))]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden z-50 max-h-52 overflow-y-auto shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]"
  >
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
        className="w-full px-4 py-2.5 text-left hover:bg-white/[0.05] transition-colors border-b border-white/[0.03] last:border-0 group/item cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-primary/60 bg-primary/[0.08] px-1.5 py-0.5 rounded tracking-wider">
            {airport.icao || airport.iata}
          </span>
          <span className="text-[12px] text-foreground/90 font-light">{airport.city}</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 pl-[2.75rem] font-light truncate">
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
    <div className={compact ? "relative" : "md:border-r md:border-r-[hsla(0,0%,100%,0.04)] relative"} ref={ref}>
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
