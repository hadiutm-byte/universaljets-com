import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteRequestSchema } from "@/lib/websiteValidation";
import { X, Plane, Calendar, Users, ArrowRight, CheckCircle, MessageCircle, MapPin, Clock, Shield, Navigation, Loader2 } from "lucide-react";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import MembershipUpsell from "@/components/MembershipUpsell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCrmApi } from "@/hooks/useCrmApi";
import QuoteRouteMap from "@/components/QuoteRouteMap";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import AIRPORT_COORDS from "@/lib/airportCoords";
import { greatCircleDistanceNm, estimateFlightTimeMin, getCharterPrice, formatDuration, formatDistance } from "@/lib/pricingEstimates";
import { useDestinationFbos, type ApiFbo } from "@/hooks/useDestinationData";
import { setBodyUiState } from "@/lib/bodyUiState";

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  flightData: {
    fromLabel: string;
    toLabel: string;
    fromIcao: string;
    toIcao: string;
    date?: string;
    passengers?: string;
    aircraft?: string;
    /** @internal — never displayed in B2C views */
    operatorName?: string;
  };
}

type Step = 1 | 2 | 3 | 4;

interface QuoteAirportFieldProps {
  label: string;
  value: string;
  query: string;
  onValueChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSelect: (airport: Airport) => void;
  onClearSelection: () => void;
  placeholder: string;
}

const QuoteAirportField = ({
  label,
  value,
  query,
  onValueChange,
  onQueryChange,
  onSelect,
  onClearSelection,
  placeholder,
}: QuoteAirportFieldProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: airports, isLoading } = useAirportSearch(query);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="space-y-1.5 relative">
      <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{label}</Label>
      <div className="relative">
        <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => {
            const nextValue = e.target.value;
            onValueChange(nextValue);
            onQueryChange(nextValue);
            onClearSelection();
            setOpen(nextValue.trim().length >= 2);
          }}
          onFocus={() => setOpen(query.trim().length >= 2)}
          placeholder={placeholder}
          className="h-10 pl-8 text-[12px] bg-muted/20 border-border/30 rounded-xl font-light"
          maxLength={100}
          autoComplete="off"
        />

        <AnimatePresence>
          {open && query.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 right-0 mt-1.5 z-30 max-h-56 overflow-y-auto rounded-xl border border-border/60 bg-card shadow-[0_20px_60px_-15px_hsl(var(--foreground)/0.18)]"
            >
              {isLoading && (
                <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-muted-foreground font-light">
                  <Loader2 size={13} className="animate-spin text-primary" /> Searching airports...
                </div>
              )}

              {!isLoading && airports?.length === 0 && (
                <div className="px-4 py-3 text-[12px] text-muted-foreground font-light">No airports found</div>
              )}

              {airports?.map((airport) => {
                const code = airport.icao || airport.iata;
                const title = airport.city || airport.name || airport.country;
                const subtitle = [airport.name, airport.country].filter(Boolean).join(" · ");

                return (
                  <button
                    key={`${airport.id}-${airport.icao}-${airport.iata}`}
                    type="button"
                    onClick={() => {
                      onSelect(airport);
                      setOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      {code && (
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-wider shrink-0">
                          {code}
                        </span>
                      )}
                      <span className="text-[13px] text-foreground font-medium truncate">{title}</span>
                    </div>
                    {subtitle && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-light truncate pl-[3rem]">{subtitle}</p>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const buildFallbackAirport = (label: string, icao: string): Airport | null => {
  if (!icao) return null;

  return {
    id: 0,
    icao,
    iata: "",
    name: label,
    city: "",
    country: "",
    lat: null as unknown as number,
    lng: null as unknown as number,
  };
};

const formatAirportDisplay = (airport: Airport) => {
  const place = airport.city || airport.name || airport.country || airport.icao || airport.iata;
  const codes = [airport.iata, airport.icao].filter(Boolean).join(" / ");
  return codes ? `${place} (${codes})` : place;
};

const QuoteRequestModal = ({ open, onClose, flightData }: QuoteRequestModalProps) => {
  const geo = useUserGeolocation();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const { capture } = useCrmApi();

  const [phoneCode, setPhoneCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    notes: "",
    departure: flightData.fromLabel,
    destination: flightData.toLabel,
    date: flightData.date || "",
    passengers: flightData.passengers || "1",
    aircraft: flightData.aircraft || "",
  });

  const resolvedCode = resolveCountryCode(geo.countryCode);
  useEffect(() => {
    if (phoneCode === "+971" && resolvedCode !== "+971") setPhoneCode(resolvedCode);
  }, [resolvedCode]);

  const [fromQuery, setFromQuery] = useState(flightData.fromLabel);
  const [toQuery, setToQuery] = useState(flightData.toLabel);
  const [selectedFromAirport, setSelectedFromAirport] = useState<Airport | null>(() => buildFallbackAirport(flightData.fromLabel, flightData.fromIcao));
  const [selectedToAirport, setSelectedToAirport] = useState<Airport | null>(() => buildFallbackAirport(flightData.toLabel, flightData.toIcao));

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setSubmitting(false);
    setForm({
      name: "",
      email: "",
      notes: "",
      departure: flightData.fromLabel,
      destination: flightData.toLabel,
      date: flightData.date || "",
      passengers: flightData.passengers || "1",
      aircraft: flightData.aircraft || "",
    });
    setPhoneNumber("");
    setPhoneCode(resolvedCode);
    setFromQuery(flightData.fromLabel);
    setToQuery(flightData.toLabel);
    setSelectedFromAirport(buildFallbackAirport(flightData.fromLabel, flightData.fromIcao));
    setSelectedToAirport(buildFallbackAirport(flightData.toLabel, flightData.toIcao));
  }, [open, flightData]);

  useEffect(() => {
    if (!open) return;

    setBodyUiState("overlay-active", true);
    return () => setBodyUiState("overlay-active", false);
  }, [open]);

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const destinationLookupIcao = selectedToAirport?.icao || flightData.toIcao;
  const destIcaos = useMemo(() => (destinationLookupIcao ? [destinationLookupIcao] : []), [destinationLookupIcao]);
  const { data: destFbos } = useDestinationFbos(destIcaos);
  const vipTerminals = useMemo(() => {
    if (!destFbos?.length) return [];
    const unique = destFbos.reduce((acc: ApiFbo[], f) => {
      if (!acc.find((x) => x.name === f.name)) acc.push(f);
      return acc;
    }, []);
    return unique.sort((a, b) => (b.vip_lounge ? 1 : 0) - (a.vip_lounge ? 1 : 0)).slice(0, 3);
  }, [destFbos]);

  const fromAirport = selectedFromAirport ?? buildFallbackAirport(flightData.fromLabel, flightData.fromIcao);
  const toAirport = selectedToAirport ?? buildFallbackAirport(flightData.toLabel, flightData.toIcao);

  if (fromAirport) {
    const coords = getAirportCoords(fromAirport.icao);
    if (coords) {
      fromAirport.lat = fromAirport.lat ?? coords[0];
      fromAirport.lng = fromAirport.lng ?? coords[1];
    }
  }

  if (toAirport) {
    const coords = getAirportCoords(toAirport.icao);
    if (coords) {
      toAirport.lat = toAirport.lat ?? coords[0];
      toAirport.lng = toAirport.lng ?? coords[1];
    }
  }

  const routeInfo = useMemo(() => {
    if (fromAirport?.lat == null || toAirport?.lat == null) return null;

    const distanceNm = greatCircleDistanceNm(fromAirport.lat, fromAirport.lng, toAirport.lat, toAirport.lng);
    const flightTimeMin = estimateFlightTimeMin(distanceNm);
    const aircraftName = (flightData.aircraft || "").toLowerCase();
    let aircraftClass = "midsize";

    if (/citation|phenom|lear\s*[234]|honda/i.test(aircraftName)) aircraftClass = "light";
    else if (/hawker|citation\s*x|praetor\s*5|challenger\s*3/i.test(aircraftName)) aircraftClass = "super midsize";
    else if (/global|gulfstream\s*[gv]|falcon\s*(7|8|9|2000)|challenger\s*(6|650)/i.test(aircraftName)) aircraftClass = "heavy";
    else if (/a319|a320|bbj|lineage|acj/i.test(aircraftName)) aircraftClass = "vip airliner";

    const pricing = getCharterPrice({
      aircraftClass,
      distanceNm,
      flightTimeMin,
    });

    return { distanceNm, flightTimeMin, pricing };
  }, [fromAirport, toAirport, flightData.aircraft]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await capture({
        name: form.name,
        email: form.email,
        phone: buildFullPhone(phoneCode, phoneNumber),
        departure: form.departure,
        destination: form.destination,
        date: form.date || undefined,
        passengers: form.passengers,
        aircraft: form.aircraft || undefined,
        notes: form.notes || undefined,
        source: "search_results_quote",
        specific_aircraft: flightData.aircraft || undefined,
      });
      if (result?.error) {
        console.error("Quote capture error:", result.error);
      }
      setStep(4);
    } catch (err) {
      console.error("Quote submission failed:", err);
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const canProceedStep1 = form.departure.trim().length > 1 && form.destination.trim().length > 1;
  const canProceedStep2 = form.name.trim().length > 1 && form.email.includes("@");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:items-center sm:px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-border/50 bg-card shadow-2xl sm:max-h-[90vh]"
      >
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card/95 backdrop-blur-md rounded-t-2xl">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary font-medium">Request Quote</p>
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">Step {Math.min(step, 3)} of 3</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="h-[2px] bg-muted/30">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: step === 4 ? "100%" : `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Review Your Flight</h3>
                <p className="text-[12px] text-muted-foreground font-light mt-1">Search by city, country, IATA or ICAO code.</p>
              </div>

              {fromAirport?.lat && toAirport?.lat && (
                <QuoteRouteMap from={fromAirport} to={toAirport} className="mt-2" />
              )}

              {routeInfo && (
                <div className="rounded-xl bg-gradient-to-r from-primary/[0.05] via-primary/[0.03] to-transparent border border-primary/10 p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4 text-[11px] text-foreground/60">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Navigation size={11} className="text-primary/60" /> {formatDistance(routeInfo.distanceNm)}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={11} className="text-primary/60" /> ~{formatDuration(routeInfo.flightTimeMin)}
                        </span>
                      </div>
                      {routeInfo.pricing.variant === "estimate" && (
                        <p className="text-[9px] text-muted-foreground/40 font-light">Indicative market estimate</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-display text-[16px] font-semibold text-foreground">
                        {routeInfo.pricing.display}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <QuoteAirportField
                  label="From"
                  value={form.departure}
                  query={fromQuery}
                  onValueChange={(value) => updateField("departure", value)}
                  onQueryChange={setFromQuery}
                  onClearSelection={() => setSelectedFromAirport(null)}
                  onSelect={(airport) => {
                    const display = formatAirportDisplay(airport);
                    setSelectedFromAirport(airport);
                    setFromQuery(display);
                    updateField("departure", display);
                  }}
                  placeholder="e.g. DXB, OMDB, Dubai"
                />

                <QuoteAirportField
                  label="To"
                  value={form.destination}
                  query={toQuery}
                  onValueChange={(value) => updateField("destination", value)}
                  onQueryChange={setToQuery}
                  onClearSelection={() => setSelectedToAirport(null)}
                  onSelect={(airport) => {
                    const display = formatAirportDisplay(airport);
                    setSelectedToAirport(airport);
                    setToQuery(display);
                    updateField("destination", display);
                  }}
                  placeholder="e.g. LHR, EGLL, London"
                />

                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Date</Label>
                  {form.date ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/30">
                      <Calendar size={12} className="text-primary/60 shrink-0" />
                      <span className="text-[12px] text-foreground font-light">
                        {new Date(form.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  ) : (
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      className="h-10 text-[12px] bg-muted/20 border-border/30 rounded-xl font-light"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Passengers</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={form.passengers}
                    onChange={(e) => updateField("passengers", e.target.value)}
                    className="h-10 text-[12px] bg-muted/20 border-border/30 rounded-xl font-light"
                  />
                </div>
              </div>

              {flightData.aircraft && !flightData.aircraft.startsWith("Destination:") && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <Plane size={14} className="text-primary/60 shrink-0" />
                  <div>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-primary/70 font-medium">Preferred Aircraft</p>
                    <p className="text-[12px] text-foreground font-light">{flightData.aircraft}</p>
                  </div>
                </div>
              )}

              {vipTerminals.length > 0 && (
                <div className="rounded-xl bg-muted/20 border border-border/30 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Shield size={11} className="text-primary/50" />
                    <p className="text-[10px] tracking-[0.15em] uppercase text-primary/60 font-medium">Private Terminal Access</p>
                  </div>
                  <div className="space-y-1.5">
                    {vipTerminals.map((fbo) => (
                      <div key={fbo.id} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/30" />
                        <span className="text-[11px] text-muted-foreground font-light">
                          {fbo.name}
                          {fbo.vip_lounge && <span className="ml-1.5 text-primary/50">· VIP Lounge</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground/40 font-light mt-2">Seamless tarmac-to-vehicle transfers arranged by your advisor.</p>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full flex items-center justify-center gap-2 btn-luxury px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue <ArrowRight size={12} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Your Details</h3>
                <p className="text-[12px] text-muted-foreground font-light mt-1">We'll use these to prepare your personalised quote.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Full Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. James Richardson"
                    className="h-11 text-[13px] bg-muted/20 border-border/30 rounded-xl font-light"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Email Address *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="james@company.com"
                    className="h-11 text-[13px] bg-muted/20 border-border/30 rounded-xl font-light"
                    maxLength={255}
                  />
                </div>
                <PhoneWithCountryCode
                  phone={phoneNumber}
                  onPhoneChange={setPhoneNumber}
                  countryCode={phoneCode}
                  onCountryCodeChange={setPhoneCode}
                />
                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Additional Notes</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Special requirements, preferred times, catering..."
                    className="min-h-[80px] text-[13px] bg-muted/20 border-border/30 rounded-xl font-light resize-none"
                    maxLength={1000}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-border/50 text-muted-foreground hover:text-foreground text-[10px] tracking-[0.2em] uppercase font-light rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 flex items-center justify-center gap-2 btn-luxury px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl disabled:opacity-40 disabled:pointer-events-none"
                >
                  Review Request <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Confirm Request</h3>
                <p className="text-[12px] text-muted-foreground font-light mt-1">Review everything before submitting.</p>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/10 overflow-hidden">
                <div className="p-4 border-b border-border/20">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-2">Route</p>
                  <div className="flex items-center gap-2 text-[13px] text-foreground font-light">
                    <span>{form.departure}</span>
                    <ArrowRight size={12} className="text-primary/50" />
                    <span>{form.destination}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-muted-foreground font-light">
                    {form.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} className="text-primary/50" />
                        {new Date(form.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users size={10} className="text-primary/50" />
                      {form.passengers} pax
                    </span>
                    {form.aircraft && (
                      <span className="flex items-center gap-1">
                        <Plane size={10} className="text-primary/50" />
                        {form.aircraft}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-2">Contact</p>
                  <p className="text-[13px] text-foreground font-light">{form.name}</p>
                  <p className="text-[11px] text-muted-foreground font-light">{form.email}</p>
                  {phoneNumber && <p className="text-[11px] text-muted-foreground font-light">{phoneCode} {phoneNumber}</p>}
                  {form.notes && <p className="text-[11px] text-muted-foreground/60 font-light mt-1 italic">"{form.notes}"</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-light">
                <Shield size={10} className="text-primary/40" />
                <span>Your details are handled with strict confidentiality.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-border/50 text-muted-foreground hover:text-foreground text-[10px] tracking-[0.2em] uppercase font-light rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 btn-luxury px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <>Submit Request</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 text-center space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={48} className="text-primary mx-auto" />
              </motion.div>

              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Request Received</h3>
                <p className="text-[13px] text-muted-foreground font-light mt-2 max-w-sm mx-auto">
                  Our aviation team is reviewing your request. You'll receive a personalised quote within the hour.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-border/30 text-[11px] text-muted-foreground font-light">
                <Plane size={11} className="text-primary/50" />
                {form.departure} → {form.destination}
              </div>

              <MembershipUpsell variant="inline" showReferral={true} className="text-left" />

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleClose}
                  className="w-full btn-luxury px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl"
                >
                  Done
                </button>

                <a
                  href={`https://wa.me/447888999944?text=${encodeURIComponent(`Hello, I just submitted a quote request for ${form.departure} → ${form.destination}. My name is ${form.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border/40 text-muted-foreground hover:text-foreground text-[10px] tracking-[0.2em] uppercase font-light rounded-xl transition-colors"
                >
                  <MessageCircle size={12} /> Talk to an Advisor
                </a>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50 font-light">
                <Clock size={9} />
                <span>Typical response: under 60 minutes</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

function getAirportCoords(icao: string): [number, number] | null {
  const coords = AIRPORT_COORDS[icao];
  return coords ?? null;
}

export default QuoteRequestModal;
