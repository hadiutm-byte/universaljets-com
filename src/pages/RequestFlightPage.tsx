import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, PlaneTakeoff, ArrowRight, Phone, Mail, Building2, AlertCircle, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useCrmApi } from "@/hooks/useCrmApi";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import AirportField from "@/components/flight-search/AirportField";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import { toast } from "sonner";

type TripType = "one_way" | "round_trip" | "multi_city";

const inputClass =
  "w-full bg-card rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border transition-all";
const labelClass = "text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block font-medium";
const sectionTitle = "text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-4";

const aircraftCategories = [
  { value: "", label: "No preference" },
  { value: "light", label: "Light Jet" },
  { value: "midsize", label: "Midsize Jet" },
  { value: "super_midsize", label: "Super Midsize" },
  { value: "heavy", label: "Heavy Jet" },
  { value: "ultra_long_range", label: "Ultra Long Range" },
  { value: "vip_airliner", label: "VIP Airliner" },
  { value: "helicopter", label: "Helicopter" },
];

const RequestFlightPage = () => {
  const { capture } = useCrmApi();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tripType, setTripType] = useState<TripType>("one_way");

  // Route
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState("1");

  // Aircraft & Services
  const [aircraftCategory, setAircraftCategory] = useState("");
  const [specificAircraft, setSpecificAircraft] = useState("");
  const [helicopterTransfer, setHelicopterTransfer] = useState(false);
  const [conciergeNeeded, setConciergeNeeded] = useState(false);
  const [vipTerminal, setVipTerminal] = useState(false);
  const [groundTransport, setGroundTransport] = useState(false);

  // Traveler notes
  const [pets, setPets] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [cateringRequest, setCateringRequest] = useState("");
  const [baggageNotes, setBaggageNotes] = useState("");
  const [specialAssistance, setSpecialAssistance] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [contactMethod, setContactMethod] = useState("email");

  // Expand sections
  const [showServices, setShowServices] = useState(false);
  const [showTraveler, setShowTraveler] = useState(false);

  const canSubmit = fromAirport && toAirport && date && name && email && parseInt(passengers) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await capture({
        name,
        email,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        departure: `${fromAirport!.city} (${fromAirport!.icao || fromAirport!.iata})`,
        destination: `${toAirport!.city} (${toAirport!.icao || toAirport!.iata})`,
        date: date ? format(date, "yyyy-MM-dd'T'HH:mm") : undefined,
        passengers,
        source: "request_flight_page",
        trip_type: tripType,
        return_date: returnDate ? format(returnDate, "yyyy-MM-dd'T'HH:mm") : undefined,
        preferred_aircraft_category: aircraftCategory || undefined,
        specific_aircraft: specificAircraft || undefined,
        helicopter_transfer: helicopterTransfer,
        concierge_needed: conciergeNeeded,
        vip_terminal: vipTerminal,
        ground_transport: groundTransport,
        pets,
        smoking,
        catering_request: cateringRequest || undefined,
        baggage_notes: baggageNotes || undefined,
        special_assistance: specialAssistance || undefined,
        special_requests: specialRequests || undefined,
        company: company || undefined,
        budget_range: budgetRange || undefined,
        is_urgent: isUrgent,
        preferred_contact_method: contactMethod,
      });
      setSubmitted(true);
      toast.success("Flight request submitted. An advisor will contact you shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const checkbox = (label: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border accent-primary" />
      <span className="text-[12px] text-foreground/60 font-light group-hover:text-foreground/80 transition-colors">{label}</span>
    </label>
  );

  const expandToggle = (label: string, open: boolean, toggle: () => void) => (
    <button type="button" onClick={toggle}
      className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium hover:text-primary transition-colors cursor-pointer">
      <ChevronDown size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      {label}
    </button>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <PlaneTakeoff className="w-7 h-7 text-primary" strokeWidth={1.2} />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">Request Received</h2>
              <p className="text-[14px] text-muted-foreground font-light leading-[1.9] mb-8">
                Your dedicated aviation advisor will review your request and contact you within the hour with tailored aircraft options.
              </p>
              <a href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-8px_hsla(45,79%,46%,0.5)] transition-all duration-500">
                Return Home
              </a>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto mb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/70 mb-6 font-light">Charter Request</p>
            <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Request a <span className="text-gradient-gold italic">Private Flight</span>
            </h1>
            <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">
              Complete the form below and your dedicated advisor will respond with tailored options.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            {/* Trip Type */}
            <div>
              <p className={sectionTitle}>Trip Type</p>
              <div className="flex gap-2">
                {([["one_way", "One Way"], ["round_trip", "Round Trip"], ["multi_city", "Multi-City"]] as const).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setTripType(val as TripType)}
                    className={`px-5 py-2.5 rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 ${
                      tripType === val ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground/40 hover:border-primary/20"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route */}
            <div>
              <p className={sectionTitle}>Route Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <AirportField label="Departure" icon={MapPin} value={from} onChangeValue={setFrom} query={fromQuery} onChangeQuery={setFromQuery}
                    selectedAirport={fromAirport} onSelect={(a) => { setFrom(`${a.city} (${a.icao || a.iata})`); setFromAirport(a); }}
                    onClearSelection={() => setFromAirport(null)} />
                </div>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <AirportField label="Arrival" icon={MapPin} value={to} onChangeValue={setTo} query={toQuery} onChangeQuery={setToQuery}
                    selectedAirport={toAirport} onSelect={(a) => { setTo(`${a.city} (${a.icao || a.iata})`); setToAirport(a); }}
                    onClearSelection={() => setToAirport(null)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <DateTimePicker label="Departure Date *" icon={Calendar} value={date} onChange={setDate} placeholder="Select date" />
                </div>
                <AnimatePresence>
                  {tripType === "round_trip" && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                      className="rounded-xl border border-border bg-card overflow-hidden">
                      <DateTimePicker label="Return Date" icon={Calendar} value={returnDate} onChange={setReturnDate} placeholder="Select return" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div>
                  <label className={labelClass}><Users size={10} className="inline mr-1" />Passengers *</label>
                  <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className={inputClass}>
                    {[...Array(19)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "passenger" : "passengers"}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Aircraft & Services — Expandable */}
            <div>
              {expandToggle("Aircraft & Service Preferences", showServices, () => setShowServices(!showServices))}
              <AnimatePresence>
                {showServices && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Aircraft Category</label>
                        <select value={aircraftCategory} onChange={(e) => setAircraftCategory(e.target.value)} className={inputClass}>
                          {aircraftCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Specific Aircraft</label>
                        <input value={specificAircraft} onChange={(e) => setSpecificAircraft(e.target.value)} className={inputClass} placeholder="e.g. Gulfstream G650" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {checkbox("Helicopter transfer", helicopterTransfer, setHelicopterTransfer)}
                      {checkbox("Concierge service", conciergeNeeded, setConciergeNeeded)}
                      {checkbox("VIP terminal", vipTerminal, setVipTerminal)}
                      {checkbox("Ground transport", groundTransport, setGroundTransport)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Traveler Notes — Expandable */}
            <div>
              {expandToggle("Traveler Notes & Special Requests", showTraveler, () => setShowTraveler(!showTraveler))}
              <AnimatePresence>
                {showTraveler && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 space-y-4">
                    <div className="flex gap-6">
                      {checkbox("Pets onboard", pets, setPets)}
                      {checkbox("Smoking", smoking, setSmoking)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Catering Request</label>
                        <input value={cateringRequest} onChange={(e) => setCateringRequest(e.target.value)} className={inputClass} placeholder="e.g. Halal, vegetarian, champagne" />
                      </div>
                      <div>
                        <label className={labelClass}>Baggage Notes</label>
                        <input value={baggageNotes} onChange={(e) => setBaggageNotes(e.target.value)} className={inputClass} placeholder="e.g. Golf clubs, oversized luggage" />
                      </div>
                    </div>
                    {specialAssistance || true ? (
                      <div>
                        <label className={labelClass}>Special Assistance / Medical</label>
                        <input value={specialAssistance} onChange={(e) => setSpecialAssistance(e.target.value)} className={inputClass} placeholder="Wheelchair, mobility assistance, etc." />
                      </div>
                    ) : null}
                    <div>
                      <label className={labelClass}>Other Requests</label>
                      <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} className={inputClass} placeholder="Any additional requirements..." />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Details */}
            <div>
              <p className={sectionTitle}>Your Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Alexander Hartwell" />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="alex@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+971 50 000 0000" />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp</label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} placeholder="+971 50 000 0000" />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} placeholder="Company name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={inputClass}>
                    <option value="">Prefer not to say</option>
                    <option value="under_25k">Under $25,000</option>
                    <option value="25k_50k">$25,000 – $50,000</option>
                    <option value="50k_100k">$50,000 – $100,000</option>
                    <option value="100k_250k">$100,000 – $250,000</option>
                    <option value="250k_plus">$250,000+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Contact Preference</label>
                  <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className={inputClass}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  {checkbox("This is urgent", isUrgent, setIsUrgent)}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              {!canSubmit && (
                <p className="flex items-center gap-2 text-[11px] text-destructive/70 font-light mb-3">
                  <AlertCircle size={12} /> Please fill in departure, arrival, date, passengers, name, and email.
                </p>
              )}
              <button type="submit" disabled={!canSubmit || loading}
                className="w-full py-4 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] hover:scale-[1.005] disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Submitting..." : "Submit Flight Request"}
              </button>
              <p className="text-[11px] text-muted-foreground/40 text-center mt-3 font-light">
                Your advisor will respond with options within the hour. No commitment required.
              </p>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default RequestFlightPage;
