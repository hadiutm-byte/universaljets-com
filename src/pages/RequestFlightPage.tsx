import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, PlaneTakeoff, ArrowRight, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useCrmApi } from "@/hooks/useCrmApi";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import AirportField from "@/components/flight-search/AirportField";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import { toast } from "sonner";
import QuoteRouteMap from "@/components/QuoteRouteMap";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  FormSection, LegalConsent, FormDisclaimer, PremiumSubmitButton,
  FormSuccess, ConfidentialityNotice, ValidationMessage,
} from "@/components/forms/PremiumFormComponents";

type TripType = "one_way" | "round_trip" | "multi_city";

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
  const geo = useUserGeolocation();
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
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [whatsappCode, setWhatsappCode] = useState("+971");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [contactMethod, setContactMethod] = useState("email");

  // Legal
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Auto-set country code and departure airport from geolocation
  const resolvedCode = resolveCountryCode(geo.countryCode);
  useEffect(() => {
    if (phoneCode === "+971" && resolvedCode !== "+971") {
      setPhoneCode(resolvedCode);
      setWhatsappCode(resolvedCode);
    }
  }, [resolvedCode]);

  // Auto-set departure airport based on user location
  useEffect(() => {
    if (!fromAirport && !from && geo.airportIcao && geo.airportLabel) {
      setFrom(geo.airportLabel);
      setFromQuery(geo.airportLabel);
      setFromAirport({
        id: 0,
        icao: geo.airportIcao,
        iata: geo.airportIata,
        name: "",
        city: geo.city,
        country: geo.countryName,
        lat: geo.latitude ?? 0,
        lng: geo.longitude ?? 0,
      });
    }
  }, [geo.airportIcao]);

  // Expand sections
  const [showServices, setShowServices] = useState(false);
  const [showTraveler, setShowTraveler] = useState(false);

  const canSubmit = fromAirport && toAirport && date && name && email && parseInt(passengers) > 0 && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await capture({
        name, email,
        phone: buildFullPhone(phoneCode, phone),
        whatsapp: buildFullPhone(whatsappCode, whatsapp),
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
        pets, smoking,
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
      toast.success("Your request has been received. An advisor will contact you shortly.");
    } catch {
      toast.error("We were unable to submit your request. Please try again or contact our team directly.");
    }
    setLoading(false);
  };

  const expandToggle = (label: string, open: boolean, toggle: () => void) => (
    <button type="button" onClick={toggle} aria-expanded={open}
      className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium hover:text-primary transition-colors cursor-pointer min-h-[44px] py-2">
      <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      {label}
    </button>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <FormSuccess
                icon={PlaneTakeoff}
                title="Request Received"
                message="Your dedicated aviation advisor will review your request and contact you within the hour with tailored aircraft options and pricing."
              >
                <a href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg btn-luxury">
                  Return Home
                </a>
              </FormSuccess>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead title="Request a Private Flight — Instant Charter Quote" description="Request a private jet charter with Universal Jets. Get tailored aircraft options and pricing within minutes. One-way, round-trip, or multi-city." path="/request-flight" />
      <Navbar />
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto mb-14">
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60 mb-5 font-medium">Charter Request</p>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-primary/25 to-transparent mx-auto mb-5" />
            <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Request a <span className="text-gradient-gold italic">Private Flight</span>
            </h1>
            <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">
              Complete the details below and your dedicated advisor will respond with tailored options.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-5 sm:p-8 md:p-10 space-y-8">

              {/* Trip Type */}
              <FormSection title="Trip Type">
                <div className="flex flex-wrap gap-2">
                  {([["one_way", "One Way"], ["round_trip", "Round Trip"], ["multi_city", "Multi-City"]] as const).map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setTripType(val as TripType)}
                      aria-pressed={tripType === val}
                      className={`px-5 py-3 min-h-[44px] rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 ${
                        tripType === val ? "border-primary bg-primary/10 text-primary" : "border-foreground/[0.06] bg-muted/40 text-foreground/40 hover:border-primary/20"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </FormSection>

              {/* Route */}
              <FormSection title="Route Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl border border-foreground/[0.06] bg-muted/30 overflow-hidden">
                    <AirportField label="Departure" icon={MapPin} value={from} onChangeValue={setFrom} query={fromQuery} onChangeQuery={setFromQuery}
                      selectedAirport={fromAirport} onSelect={(a) => { setFrom(`${a.city} (${a.icao || a.iata})`); setFromAirport(a); }}
                      onClearSelection={() => setFromAirport(null)} />
                  </div>
                  <div className="rounded-xl border border-foreground/[0.06] bg-muted/30 overflow-hidden">
                    <AirportField label="Arrival" icon={MapPin} value={to} onChangeValue={setTo} query={toQuery} onChangeQuery={setToQuery}
                      selectedAirport={toAirport} onSelect={(a) => { setTo(`${a.city} (${a.icao || a.iata})`); setToAirport(a); }}
                      onClearSelection={() => setToAirport(null)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-foreground/[0.06] bg-muted/30 overflow-hidden">
                    <DateTimePicker label="Departure Date *" icon={Calendar} value={date} onChange={setDate} placeholder="Select date" />
                  </div>
                  <AnimatePresence>
                    {tripType === "round_trip" && (
                      <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                        className="rounded-xl border border-foreground/[0.06] bg-muted/30 overflow-hidden">
                        <DateTimePicker label="Return Date" icon={Calendar} value={returnDate} onChange={setReturnDate} placeholder="Select return" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <PremiumSelect label="Passengers" required value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                    {[...Array(19)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "passenger" : "passengers"}</option>
                    ))}
                  </PremiumSelect>
                </div>
              </FormSection>

              {/* Route Map */}
              <QuoteRouteMap from={fromAirport} to={toAirport} className="mt-2" />

              {/* Aircraft & Services — Expandable */}
              <div>
                {expandToggle("Aircraft & Service Preferences", showServices, () => setShowServices(!showServices))}
                <AnimatePresence>
                  {showServices && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PremiumSelect label="Aircraft Category" value={aircraftCategory} onChange={(e) => setAircraftCategory(e.target.value)}>
                          {aircraftCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </PremiumSelect>
                        <PremiumInput label="Specific Aircraft" value={specificAircraft} onChange={(e) => setSpecificAircraft(e.target.value)} placeholder="e.g. Gulfstream G650" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PremiumCheckbox label="Helicopter transfer" checked={helicopterTransfer} onChange={setHelicopterTransfer} />
                        <PremiumCheckbox label="Concierge service" checked={conciergeNeeded} onChange={setConciergeNeeded} />
                        <PremiumCheckbox label="VIP terminal" checked={vipTerminal} onChange={setVipTerminal} />
                        <PremiumCheckbox label="Ground transport" checked={groundTransport} onChange={setGroundTransport} />
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
                        <PremiumCheckbox label="Pets onboard" checked={pets} onChange={setPets} />
                        <PremiumCheckbox label="Smoking" checked={smoking} onChange={setSmoking} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PremiumInput label="Catering Request" value={cateringRequest} onChange={(e) => setCateringRequest(e.target.value)} placeholder="e.g. Halal, vegetarian, champagne" />
                        <PremiumInput label="Baggage Notes" value={baggageNotes} onChange={(e) => setBaggageNotes(e.target.value)} placeholder="e.g. Golf clubs, oversized luggage" />
                      </div>
                      <PremiumInput label="Special Assistance / Medical" value={specialAssistance} onChange={(e) => setSpecialAssistance(e.target.value)} placeholder="Wheelchair, mobility assistance, etc." />
                      <PremiumTextarea label="Other Requests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} placeholder="Any additional requirements..." />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Details */}
              <FormSection title="Your Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PremiumInput label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alexander Hartwell" maxLength={100} />
                  <PremiumInput label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" maxLength={255} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PhoneWithCountryCode label="Phone" phone={phone} onPhoneChange={setPhone} countryCode={phoneCode} onCountryCodeChange={setPhoneCode} />
                  <PhoneWithCountryCode label="WhatsApp" phone={whatsapp} onPhoneChange={setWhatsapp} countryCode={whatsappCode} onCountryCodeChange={setWhatsappCode} />
                  <PremiumInput label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" maxLength={100} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PremiumSelect label="Budget Range" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="under_25k">Under $25,000</option>
                    <option value="25k_50k">$25,000 – $50,000</option>
                    <option value="50k_100k">$50,000 – $100,000</option>
                    <option value="100k_250k">$100,000 – $250,000</option>
                    <option value="250k_plus">$250,000+</option>
                  </PremiumSelect>
                  <PremiumSelect label="Contact Preference" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </PremiumSelect>
                  <div className="flex items-end pb-1">
                    <PremiumCheckbox label="This is urgent" checked={isUrgent} onChange={setIsUrgent} />
                  </div>
                </div>
              </FormSection>

              {/* Legal */}
              <LegalConsent
                checked={termsAccepted}
                onChange={setTermsAccepted}
                includeMarketing
                marketingChecked={marketingConsent}
                onMarketingChange={setMarketingConsent}
              />

              {/* Disclaimer */}
              <FormDisclaimer />

              {/* Submit */}
              <div className="pt-2">
                <ValidationMessage show={!canSubmit && (!!name || !!email)} message="Please complete departure, arrival, date, passengers, name, email, and accept the terms to continue." />
                <PremiumSubmitButton loading={loading} disabled={!canSubmit}>
                  Request Jet Availability
                </PremiumSubmitButton>
                <ConfidentialityNotice />
              </div>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default RequestFlightPage;
