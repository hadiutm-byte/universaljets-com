import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, RotateCcw, Plus, X, PlaneTakeoff } from "lucide-react";
import { format } from "date-fns";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import AirportField from "@/components/flight-search/AirportField";

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

const jetSizes = [
  { value: "", label: "Any Size" },
  { value: "very_light", label: "Very Light Jet" },
  { value: "light", label: "Light Jet" },
  { value: "midsize", label: "Midsize Jet" },
  { value: "super_midsize", label: "Super Midsize" },
  { value: "heavy", label: "Heavy Jet" },
  { value: "ultra_long_range", label: "Ultra Long Range" },
  { value: "vip_airliner", label: "VIP Airliner" },
  { value: "helicopter", label: "Helicopter" },
];

const SwapButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.15, rotate: 180 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300 cursor-pointer hidden md:flex"
  >
    <ArrowLeftRight size={12} strokeWidth={1.5} />
  </motion.button>
);

const FlightSearchBox = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [legs, setLegs] = useState<Leg[]>([emptyLeg()]);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("");
  const [jetSize, setJetSize] = useState("");

  const updateLeg = (index: number, updates: Partial<Leg>) => {
    setLegs((prev) => prev.map((l, i) => (i === index ? { ...l, ...updates } : l)));
  };

  const swapRoute = (index: number) => {
    setLegs((prev) =>
      prev.map((l, i) =>
        i === index
          ? { ...l, from: l.to, to: l.from, fromQuery: l.toQuery, toQuery: l.fromQuery, selectedFrom: l.selectedTo, selectedTo: l.selectedFrom }
          : l
      )
    );
  };

  const addLeg = () => { if (legs.length < 5) setLegs((prev) => [...prev, emptyLeg()]); };
  const removeLeg = (index: number) => { if (legs.length > 2) setLegs((prev) => prev.filter((_, i) => i !== index)); };

  useEffect(() => {
    if (tripType === "multi-city") {
      if (legs.length < 2) setLegs([emptyLeg(), emptyLeg()]);
    } else {
      setLegs([legs[0] || emptyLeg()]);
    }
    if (tripType === "one-way") setReturnDate(undefined);
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
    if (primaryLeg.date) params.set("date", format(primaryLeg.date, "yyyy-MM-dd'T'HH:mm"));
    if (tripType === "round-trip" && returnDate) params.set("return_date", format(returnDate, "yyyy-MM-dd'T'HH:mm"));
    if (passengers) params.set("passengers", passengers);
    if (jetSize) params.set("jet_size", jetSize);
    if (tripType === "multi-city") {
      legs.forEach((leg, i) => {
        if (i === 0) return;
        if (leg.selectedFrom && leg.selectedTo) {
          params.set(`leg${i + 1}_from`, leg.selectedFrom.icao || leg.selectedFrom.iata);
          params.set(`leg${i + 1}_to`, leg.selectedTo.icao || leg.selectedTo.iata);
          if (leg.date) params.set(`leg${i + 1}_date`, format(leg.date, "yyyy-MM-dd'T'HH:mm"));
        }
      });
    }
    navigate(`/search?${params.toString()}`);
  };

  const fieldWrapperClass = "px-4 py-4 rounded-xl bg-muted/30 border border-transparent hover:bg-muted/50 hover:shadow-sm transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_20px_-8px_hsla(45,79%,46%,0.12)]";

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Trip Type Tabs */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {tripTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTripType(tab.value)}
            className={`relative px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-400 cursor-pointer ${
              tripType === tab.value
                ? "text-white"
                : "text-foreground/50 hover:text-foreground"
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

      {/* Search Card */}
      <div className="rounded-2xl bg-card border border-border shadow-[0_8px_40px_-12px_hsla(0,0%,0%,0.08)] p-5">
        <AnimatePresence mode="wait">
          {tripType !== "multi-city" ? (
            <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_0.75fr_0.75fr_0.45fr_0.55fr_auto] gap-2">
                <div className="col-span-2 md:col-span-2 relative grid grid-cols-2">
                  <AirportField label="From" icon={MapPin} value={primaryLeg.from} onChangeValue={(v) => updateLeg(0, { from: v })} query={primaryLeg.fromQuery} onChangeQuery={(v) => updateLeg(0, { fromQuery: v })} selectedAirport={primaryLeg.selectedFrom} onSelect={(a) => updateLeg(0, { from: `${a.city} (${a.icao || a.iata})`, selectedFrom: a })} onClearSelection={() => updateLeg(0, { selectedFrom: null })} />
                  <SwapButton onClick={() => swapRoute(0)} />
                  <AirportField label="To" icon={MapPin} value={primaryLeg.to} onChangeValue={(v) => updateLeg(0, { to: v })} query={primaryLeg.toQuery} onChangeQuery={(v) => updateLeg(0, { toQuery: v })} selectedAirport={primaryLeg.selectedTo} onSelect={(a) => updateLeg(0, { to: `${a.city} (${a.icao || a.iata})`, selectedTo: a })} onClearSelection={() => updateLeg(0, { selectedTo: null })} />
                </div>

                <DateTimePicker label="Departure" icon={Calendar} value={primaryLeg.date} onChange={(d) => updateLeg(0, { date: d })} placeholder="Select date" />
                <DateTimePicker label="Return" icon={RotateCcw} value={returnDate} onChange={setReturnDate} disabled={tripType !== "round-trip"} placeholder="Select date" />

                {/* Passengers */}
                <div className="relative">
                  <div className={fieldWrapperClass}>
                    <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-primary/60 mb-2 font-light">
                      <Users size={8} strokeWidth={1.5} /> Guests
                    </label>
                    <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full bg-transparent text-[13px] text-foreground font-light focus:outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-background">Select</option>
                      {[...Array(16)].map((_, i) => (<option key={i + 1} value={i + 1} className="bg-background">{i + 1}</option>))}
                    </select>
                  </div>
                </div>

                {/* Jet Size */}
                <div className="relative">
                  <div className={fieldWrapperClass}>
                    <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-primary/60 mb-2 font-light">
                      <PlaneTakeoff size={8} strokeWidth={1.5} /> Jet Size
                    </label>
                    <select value={jetSize} onChange={(e) => setJetSize(e.target.value)} className="w-full bg-transparent text-[13px] text-foreground font-light focus:outline-none appearance-none cursor-pointer">
                      {jetSizes.map((s) => (
                        <option key={s.value} value={s.value} className="bg-background">{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-span-2 md:col-span-1 flex items-center px-1 py-1">
                  <motion.button
                    onClick={handleSearch}
                    disabled={!canSearch}
                    whileHover={canSearch ? { scale: 1.05 } : {}}
                    whileTap={canSearch ? { scale: 0.97 } : {}}
                    className="w-full md:w-[52px] h-[52px] bg-gradient-gold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_hsla(45,79%,46%,0.4)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowRight size={17} className="text-white" strokeWidth={2} />
                    <span className="md:hidden text-white text-[10px] tracking-[0.2em] uppercase font-medium">Search</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="multi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2">
              <AnimatePresence initial={false}>
                {legs.map((leg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex items-center gap-0 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex-shrink-0 w-10 hidden md:flex items-center justify-center">
                        <span className="text-[9px] tracking-[0.2em] text-primary/30 font-light">{String(idx + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="flex-1 min-w-0 relative grid grid-cols-2">
                        <AirportField label="From" icon={MapPin} value={leg.from} onChangeValue={(v) => updateLeg(idx, { from: v })} query={leg.fromQuery} onChangeQuery={(v) => updateLeg(idx, { fromQuery: v })} selectedAirport={leg.selectedFrom} onSelect={(a) => updateLeg(idx, { from: `${a.city} (${a.icao || a.iata})`, selectedFrom: a })} onClearSelection={() => updateLeg(idx, { selectedFrom: null })} compact />
                        <SwapButton onClick={() => swapRoute(idx)} />
                        <AirportField label="To" icon={MapPin} value={leg.to} onChangeValue={(v) => updateLeg(idx, { to: v })} query={leg.toQuery} onChangeQuery={(v) => updateLeg(idx, { toQuery: v })} selectedAirport={leg.selectedTo} onSelect={(a) => updateLeg(idx, { to: `${a.city} (${a.icao || a.iata})`, selectedTo: a })} onClearSelection={() => updateLeg(idx, { selectedTo: null })} compact />
                      </div>
                      <div className="flex-shrink-0 w-px h-8 bg-border/30 hidden md:block" />
                      <div className="flex-shrink-0"><DateTimePicker label="Date & Time" icon={Calendar} value={leg.date} onChange={(d) => updateLeg(idx, { date: d })} placeholder="Select" /></div>
                      <div className="flex-shrink-0 w-9 flex items-center justify-center">
                        {legs.length > 2 ? (
                          <motion.button onClick={() => removeLeg(idx)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/20 hover:text-foreground/50 hover:bg-muted transition-colors cursor-pointer"><X size={11} strokeWidth={1.5} /></motion.button>
                        ) : <div className="w-7" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex items-center justify-between gap-3 pt-2 px-1">
                <div className="flex items-center gap-4">
                  {legs.length < 5 && (
                    <motion.button onClick={addLeg} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase text-primary/50 hover:text-primary/80 font-light border border-border hover:border-primary/20 rounded-lg transition-all duration-300 cursor-pointer">
                      <Plus size={9} strokeWidth={1.5} /> Add Flight
                    </motion.button>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="text-[7px] tracking-[0.3em] uppercase text-primary/50 font-light"><Users size={7} strokeWidth={1.5} className="inline mr-1" />Guests</label>
                    <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="bg-transparent text-[12px] text-foreground font-light focus:outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-background">—</option>
                      {[...Array(16)].map((_, i) => (<option key={i + 1} value={i + 1} className="bg-background">{i + 1}</option>))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[7px] tracking-[0.3em] uppercase text-primary/50 font-light"><PlaneTakeoff size={7} strokeWidth={1.5} className="inline mr-1" />Jet Size</label>
                    <select value={jetSize} onChange={(e) => setJetSize(e.target.value)} className="bg-transparent text-[12px] text-foreground font-light focus:outline-none appearance-none cursor-pointer">
                      {jetSizes.map((s) => (
                        <option key={s.value} value={s.value} className="bg-background">{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <motion.button onClick={handleSearch} disabled={!canSearch} whileHover={canSearch ? { scale: 1.05 } : {}} whileTap={canSearch ? { scale: 0.97 } : {}} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-gold rounded-xl text-white text-[9px] tracking-[0.2em] uppercase font-medium hover:shadow-[0_0_30px_-5px_hsla(45,79%,46%,0.4)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <ArrowRight size={13} strokeWidth={2} /> Search
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlightSearchBox;
