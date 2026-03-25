import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, Loader2 } from "lucide-react";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";

const FlightSearchBox = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [selectedFrom, setSelectedFrom] = useState<Airport | null>(null);
  const [selectedTo, setSelectedTo] = useState<Airport | null>(null);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const { data: fromAirports, isLoading: fromLoading } = useAirportSearch(fromQuery);
  const { data: toAirports, isLoading: toLoading } = useAirportSearch(toQuery);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setShowToDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectAirport = (airport: Airport, type: "from" | "to") => {
    const label = `${airport.city} (${airport.icao || airport.iata})`;
    if (type === "from") {
      setFrom(label);
      setSelectedFrom(airport);
      setShowFromDropdown(false);
    } else {
      setTo(label);
      setSelectedTo(airport);
      setShowToDropdown(false);
    }
  };

  const AirportDropdown = ({
    airports,
    loading,
    onSelect,
    type,
  }: {
    airports?: Airport[];
    loading: boolean;
    onSelect: (a: Airport) => void;
    type: "from" | "to";
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
          className="w-full px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-0"
        >
          <span className="text-[12px] text-foreground/90 font-light">{airport.city}</span>
          <span className="text-[10px] text-muted-foreground ml-2">
            {airport.icao || airport.iata} · {airport.name}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto mt-4"
    >
      <div className="glass-search rounded-2xl p-3 group/box hover:shadow-[0_0_70px_-20px_hsla(38,52%,50%,0.15)] transition-all duration-700">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_0.7fr_auto] gap-0">
          {/* From */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)] relative" ref={fromRef}>
            <div className="px-5 py-4">
              <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-gold/40 mb-2 font-light">
                <MapPin size={8} strokeWidth={1.5} /> From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setFromQuery(e.target.value);
                  setSelectedFrom(null);
                  setShowFromDropdown(true);
                }}
                onFocus={() => fromQuery.length >= 2 && setShowFromDropdown(true)}
                placeholder="City or airport"
                className="w-full bg-transparent text-[13px] text-foreground/90 placeholder:text-foreground/15 font-light focus:outline-none tracking-wide"
              />
            </div>
            {showFromDropdown && fromQuery.length >= 2 && (
              <AirportDropdown airports={fromAirports} loading={fromLoading} onSelect={(a) => selectAirport(a, "from")} type="from" />
            )}
          </div>

          {/* To */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)] relative" ref={toRef}>
            <div className="px-5 py-4">
              <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-gold/40 mb-2 font-light">
                <MapPin size={8} strokeWidth={1.5} /> To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setToQuery(e.target.value);
                  setSelectedTo(null);
                  setShowToDropdown(true);
                }}
                onFocus={() => toQuery.length >= 2 && setShowToDropdown(true)}
                placeholder="City or airport"
                className="w-full bg-transparent text-[13px] text-foreground/90 placeholder:text-foreground/15 font-light focus:outline-none tracking-wide"
              />
            </div>
            {showToDropdown && toQuery.length >= 2 && (
              <AirportDropdown airports={toAirports} loading={toLoading} onSelect={(a) => selectAirport(a, "to")} type="to" />
            )}
          </div>

          {/* Date */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
            <div className="px-5 py-4">
              <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-gold/40 mb-2 font-light">
                <Calendar size={8} strokeWidth={1.5} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none [color-scheme:dark] tracking-wide"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <div className="px-5 py-4">
              <label className="flex items-center gap-1.5 text-[7.5px] tracking-[0.35em] uppercase text-gold/40 mb-2 font-light">
                <Users size={8} strokeWidth={1.5} /> Guests
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full bg-transparent text-[13px] text-foreground/90 font-light focus:outline-none appearance-none cursor-pointer tracking-wide"
              >
                <option value="" className="bg-charcoal text-foreground">Select</option>
                {[...Array(16)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-charcoal text-foreground">{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="col-span-2 md:col-span-1 flex items-center px-2.5 py-2.5">
            <button className="w-full md:w-[52px] h-[52px] bg-gradient-gold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500 hover:scale-105 active:scale-100">
              <ArrowRight size={17} className="text-primary-foreground" strokeWidth={2} />
              <span className="md:hidden text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium">Search Flights</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightSearchBox;
