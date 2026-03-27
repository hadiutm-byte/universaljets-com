import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Search, ArrowLeftRight, RotateCcw, Plus, X, PlaneTakeoff } from "lucide-react";
import { format } from "date-fns";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import { useCrmApi } from "@/hooks/useCrmApi";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import AirportField from "@/components/flight-search/AirportField";
import { trackFlightSearch } from "@/lib/gtmEvents";
import QuoteRouteMap from "@/components/QuoteRouteMap";

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
  { value: "light", label: "Light Jet" },
  { value: "midsize", label: "Midsize Jet" },
  { value: "super_midsize", label: "Super Midsize" },
  { value: "heavy", label: "Heavy / Long Range" },
  { value: "ultra_long_range", label: "Ultra Long Range" },
];

const SwapButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    aria-label="Swap departure and destination"
    whileHover={{ scale: 1.15, rotate: 180 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border-2 border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-colors duration-300 cursor-pointer shadow-sm hidden md:flex"
  >
    <ArrowLeftRight size={13} strokeWidth={1.5} />
  </motion.button>
);

const FlightSearchBox = () => {
  const navigate = useNavigate();
  const { capture } = useCrmApi();
  const [tripType, setTripType] = useState<TripType>("one-way");
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
      setLegs((prev) => (prev.length < 2 ? [prev[0] || emptyLeg(), emptyLeg()] : prev));
    } else {
      setLegs((prev) => [prev[0] || emptyLeg()]);
    }
    if (tripType === "one-way") setReturnDate(undefined);
  }, [tripType]);

  const primaryLeg = legs[0];
  const canSearch = primaryLeg.selectedFrom && primaryLeg.selectedTo;

  const handleSearch = () => {
    if (!canSearch) return;

    // Fire CRM capture in background (non-blocking)
    capture({
      name: "Website Visitor",
      email: "search@universaljets.com",
      departure: `${primaryLeg.selectedFrom!.city} (${primaryLeg.selectedFrom!.icao || primaryLeg.selectedFrom!.iata})`,
      destination: `${primaryLeg.selectedTo!.city} (${primaryLeg.selectedTo!.icao || primaryLeg.selectedTo!.iata})`,
      date: primaryLeg.date ? format(primaryLeg.date, "yyyy-MM-dd'T'HH:mm") : undefined,
      passengers: passengers || "1",
      source: "homepage_widget",
    }).catch(() => {}); // Silent — don't block search

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
    trackFlightSearch({
      from: primaryLeg.selectedFrom!.city,
      to: primaryLeg.selectedTo!.city,
      date: primaryLeg.date ? format(primaryLeg.date, "yyyy-MM-dd") : undefined,
      passengers: passengers ? Number(passengers) : undefined,
      tripType,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ── Trip Type Tabs ── */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex rounded-full border border-border bg-background p-1 gap-0">
          {tripTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTripType(tab.value)}
              className={`relative px-6 py-2.5 text-[10px] tracking-[0.22em] uppercase font-semibold rounded-full transition-all duration-500 cursor-pointer ${
                tripType === tab.value
                  ? "bg-[hsl(var(--selection))] text-[hsl(var(--selection-foreground))] shadow-[0_4px_16px_-4px_hsla(0,0%,0%,0.2)]"
                  : "text-foreground/45 hover:text-foreground/75 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Card ── */}
      <div className="rounded-2xl bg-background border border-border/80 shadow-[0_12px_48px_-16px_hsla(0,0%,0%,0.08)] p-7">
        <AnimatePresence mode="wait">
          {tripType !== "multi-city" ? (
            <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Row 1: From / To / Date / Return */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_0.8fr_0.8fr] gap-3 mb-3">
                <div className="md:col-span-2 relative grid grid-cols-2 gap-0">
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
                  <SwapButton onClick={() => swapRoute(0)} />
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
                </div>
                <DateTimePicker label="Departure" icon={Calendar} value={primaryLeg.date} onChange={(d) => updateLeg(0, { date: d })} placeholder="Select date" />
                <DateTimePicker label="Return" icon={RotateCcw} value={returnDate} onChange={setReturnDate} disabled={tripType !== "round-trip"} placeholder={tripType === "round-trip" ? "Select date" : "—"} />
              </div>

              {/* Row 2: Passengers / Jet Size / CTA */}
              <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-3">
                <div className="search-field">
                  <label className="search-label">
                    <Users size={10} strokeWidth={1.5} /> Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="search-select"
                  >
                    <option value="" className="bg-background">Select</option>
                    {[...Array(16)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-background">{i + 1} {i === 0 ? "passenger" : "passengers"}</option>
                    ))}
                  </select>
                </div>

                <div className="search-field">
                  <label className="search-label">
                    <PlaneTakeoff size={10} strokeWidth={1.5} /> Jet Size
                  </label>
                  <select
                    value={jetSize}
                    onChange={(e) => setJetSize(e.target.value)}
                    className="search-select"
                  >
                    {jetSizes.map((s) => (
                      <option key={s.value} value={s.value} className="bg-background">{s.label}</option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  whileHover={canSearch ? { scale: 1.02 } : {}}
                  whileTap={canSearch ? { scale: 0.97 } : {}}
                  className="h-full min-h-[56px] px-10 bg-gradient-gold rounded-xl flex items-center justify-center gap-3 shadow-[0_6px_24px_-6px_hsla(43,74%,49%,0.35)] hover:shadow-[0_10px_36px_-6px_hsla(43,74%,49%,0.5)] transition-all duration-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                >
                  <Search size={16} className="text-white" strokeWidth={2} />
                  <span className="text-white text-[11px] tracking-[0.2em] uppercase font-semibold">Search Flights</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ── Multi-City ── */
            <motion.div key="multi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              <AnimatePresence initial={false}>
                {legs.map((leg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex items-center gap-0 rounded-xl border-2 border-border bg-muted/30">
                      <div className="flex-shrink-0 w-10 hidden md:flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-primary/50">{String(idx + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="flex-1 min-w-0 relative grid grid-cols-2">
                        <AirportField label="From" icon={MapPin} value={leg.from} onChangeValue={(v) => updateLeg(idx, { from: v })} query={leg.fromQuery} onChangeQuery={(v) => updateLeg(idx, { fromQuery: v })} selectedAirport={leg.selectedFrom} onSelect={(a) => updateLeg(idx, { from: `${a.city} (${a.icao || a.iata})`, selectedFrom: a })} onClearSelection={() => updateLeg(idx, { selectedFrom: null })} compact />
                        <SwapButton onClick={() => swapRoute(idx)} />
                        <AirportField label="To" icon={MapPin} value={leg.to} onChangeValue={(v) => updateLeg(idx, { to: v })} query={leg.toQuery} onChangeQuery={(v) => updateLeg(idx, { toQuery: v })} selectedAirport={leg.selectedTo} onSelect={(a) => updateLeg(idx, { to: `${a.city} (${a.icao || a.iata})`, selectedTo: a })} onClearSelection={() => updateLeg(idx, { selectedTo: null })} compact />
                      </div>
                      <div className="flex-shrink-0 w-px h-8 bg-border hidden md:block" />
                      <div className="flex-shrink-0">
                        <DateTimePicker label="Date & Time" icon={Calendar} value={leg.date} onChange={(d) => updateLeg(idx, { date: d })} placeholder="Select" />
                      </div>
                      <div className="flex-shrink-0 w-10 flex items-center justify-center">
                        {legs.length > 2 ? (
                          <motion.button onClick={() => removeLeg(idx)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                            <X size={12} strokeWidth={1.5} />
                          </motion.button>
                        ) : <div className="w-7" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-4">
                  {legs.length < 5 && (
                    <motion.button onClick={addLeg} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-primary font-medium border-2 border-primary/20 hover:border-primary/40 rounded-lg transition-all duration-300 cursor-pointer">
                      <Plus size={10} strokeWidth={2} /> Add Flight
                    </motion.button>
                  )}
                  <div className="search-field !py-2 !px-3">
                    <label className="search-label !mb-0 !text-[8px]"><Users size={8} strokeWidth={1.5} /> Guests</label>
                    <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="search-select !text-[12px]">
                      <option value="" className="bg-background">—</option>
                      {[...Array(16)].map((_, i) => (<option key={i + 1} value={i + 1} className="bg-background">{i + 1}</option>))}
                    </select>
                  </div>
                  <div className="search-field !py-2 !px-3">
                    <label className="search-label !mb-0 !text-[8px]"><PlaneTakeoff size={8} strokeWidth={1.5} /> Jet</label>
                    <select value={jetSize} onChange={(e) => setJetSize(e.target.value)} className="search-select !text-[12px]">
                      {jetSizes.map((s) => (<option key={s.value} value={s.value} className="bg-background">{s.label}</option>))}
                    </select>
                  </div>
                </div>
                <motion.button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  whileHover={canSearch ? { scale: 1.02 } : {}}
                  whileTap={canSearch ? { scale: 0.97 } : {}}
                  className="flex items-center gap-2.5 px-8 py-3 bg-gradient-gold rounded-xl text-white text-[10px] tracking-[0.2em] uppercase font-semibold shadow-[0_6px_24px_-6px_hsla(43,74%,49%,0.35)] hover:shadow-[0_10px_36px_-6px_hsla(43,74%,49%,0.5)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Search size={14} strokeWidth={2} /> Search Flights
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Route Map */}
      <QuoteRouteMap
        from={primaryLeg.selectedFrom}
        to={primaryLeg.selectedTo}
        additionalLegs={tripType === "multi-city" ? legs.slice(1).map((l) => ({ from: l.selectedFrom, to: l.selectedTo })) : undefined}
        className="mt-4"
      />
    </div>
  );
};

export default FlightSearchBox;
