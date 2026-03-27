import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Check, Plane, CreditCard, Tag, Headphones,
  MessageCircle, Globe, ShieldCheck, Clock, Users,
  ChevronRight, Send, ArrowRight, MapPin, Calendar, ChevronDown,
} from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";
import { useCrmApi } from "@/hooks/useCrmApi";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import { useAirportSearch, type Airport } from "@/hooks/useAviapages";
import AirportField from "@/components/flight-search/AirportField";
import DateTimePicker from "@/components/flight-search/DateTimePicker";
import QuoteRouteMap from "@/components/QuoteRouteMap";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  FormSection, LegalConsent, FormDisclaimer, PremiumSubmitButton,
  ConfidentialityNotice, ValidationMessage,
} from "@/components/forms/PremiumFormComponents";
import { format } from "date-fns";

const WHATSAPP_NUMBER = "447888999944";
const WHATSAPP_MSG = encodeURIComponent("Hi, I'd like to speak with an aviation advisor at Universal Jets.");

/* ─── Ricky Quick‑Option Chip ─── */
const QuickOption = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex items-center gap-2.5 px-5 py-3 rounded-lg glass-panel border border-border/10 hover:border-primary/20 transition-all duration-300 cursor-pointer group"
  >
    <Icon className="w-4 h-4 text-primary/50 group-hover:text-primary/80 transition-colors" strokeWidth={1.3} />
    <span className="text-[11px] tracking-[0.15em] uppercase text-foreground/65 group-hover:text-foreground/90 font-light transition-colors">
      {label}
    </span>
  </motion.button>
);

/* ─── Authority items ─── */
const authorityItems = [
  { icon: Clock, text: "18+ Years Experience" },
  { icon: Globe, text: "Global Aircraft Network" },
  { icon: Headphones, text: "24/7 Availability" },
  { icon: Users, text: "Trusted by UHNW Clients" },
];

/* ─── What Happens Next steps ─── */
const nextSteps = [
  { num: "01", text: "We analyze availability across global operators" },
  { num: "02", text: "We optimize aircraft, routing, and pricing" },
  { num: "03", text: "You receive tailored options within minutes" },
];

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

const CTASection = () => {
  const { capture } = useCrmApi();
  const geo = useUserGeolocation();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);

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
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");

  // Aircraft prefs
  const [aircraftCategory, setAircraftCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phone, setPhone] = useState("");

  // Legal
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Expandable prefs
  const [showPrefs, setShowPrefs] = useState(false);

  const resolvedCode = resolveCountryCode(geo.countryCode);

  useEffect(() => {
    if (phoneCode === "+971" && resolvedCode !== "+971") setPhoneCode(resolvedCode);
  }, [resolvedCode]);

  useEffect(() => {
    if (!fromAirport && !from && geo.airportIcao && geo.airportLabel) {
      setFrom(geo.airportLabel);
      setFromQuery(geo.airportLabel);
      setFromAirport({
        id: 0, icao: geo.airportIcao, iata: geo.airportIata,
        name: "", city: geo.city, country: geo.countryName,
        lat: geo.latitude ?? 0, lng: geo.longitude ?? 0,
      });
    }
  }, [geo.airportIcao]);

  const canSubmit = fromAirport && toAirport && date && name && email && parseInt(passengers) > 0 && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) { toast.error("Please complete all required fields and accept the terms."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await capture({
        name, email,
        phone: buildFullPhone(phoneCode, phone),
        departure: `${fromAirport!.city} (${fromAirport!.icao || fromAirport!.iata})`,
        destination: `${toAirport!.city} (${toAirport!.icao || toAirport!.iata})`,
        date: date ? format(date, "yyyy-MM-dd'T'HH:mm") : undefined,
        passengers,
        source: "cta_section",
        trip_type: tripType,
        return_date: returnDate ? format(returnDate, "yyyy-MM-dd'T'HH:mm") : undefined,
        preferred_aircraft_category: aircraftCategory || undefined,
        budget_range: budgetRange || undefined,
        special_requests: specialRequests || undefined,
      });
      setSubmitted(true);
      toast.success("Your flight request has been received.");
    } catch {
      toast.error("We were unable to submit your request. Please try again or contact our team directly.");
    }
    setLoading(false);
  };

  const openWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, "_blank");

  return (
    <section id="cta" className="relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 50% 30%, hsla(43,74%,49%,0.2) 0%, transparent 60%)" }} />

      {/* ═══════ SECTION 1 — HERO ═══════ */}
      <div className="py-28 md:py-40 relative">
        <div className="container mx-auto px-8 relative z-10">
          <FadeReveal className="text-center max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-8 font-light">Your Journey Starts Here</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-foreground mb-6 leading-[1.1]">
              Request Your <span className="text-gradient-gold italic font-medium">Flight</span>
            </h2>
            <p className="text-[12px] md:text-[13px] tracking-[0.12em] text-muted-foreground font-extralight leading-[2] mb-10 max-w-lg mx-auto">
              Speak directly with an aviation advisor.<br />We respond within minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={openWhatsApp}
              className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm cursor-pointer"
            >
              Start with Ricky
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </motion.button>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 2 — RICKY FIRST CONTACT ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-2xl mx-auto">
            <GlassCard hover={false} className="p-8 md:p-12">
              {/* Ricky message */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-display font-semibold text-primary/70">R</span>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50 font-light mb-2">Ricky — Senior Aviation Advisor</p>
                  <p className="text-[13px] text-foreground/70 font-light leading-[1.9]">
                    "You don't need to fill forms.<br />Tell me what you need — I'll handle the rest."
                  </p>
                </div>
              </div>

              {/* Quick options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <QuickOption icon={Plane} label="Request a Flight" onClick={openWhatsApp} />
                <QuickOption icon={CreditCard} label="Explore Jet Card" onClick={openWhatsApp} />
                <QuickOption icon={Tag} label="Find Empty Legs" onClick={openWhatsApp} />
                <QuickOption icon={Headphones} label="Speak to Advisor" onClick={openWhatsApp} />
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border/10" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 font-light">or fill in details</span>
                <div className="flex-1 h-px bg-border/10" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="w-full py-3.5 text-[10px] tracking-[0.25em] uppercase text-primary/50 hover:text-primary/80 font-light border border-border/10 hover:border-primary/15 rounded-lg transition-all duration-300 cursor-pointer"
              >
                Continue to Form <ChevronRight className="inline w-3 h-3 ml-1" strokeWidth={1.5} />
              </motion.button>
            </GlassCard>
          </FadeReveal>
        </div>
      </div>

      {/* ═══════ SECTION 3 — PREMIUM FORM ═══════ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-20 md:pb-28">
              <div className="container mx-auto px-4 sm:px-8">
                <div className="max-w-3xl mx-auto">
                  {submitted ? (
                    <GlassCard hover={false} className="p-8 md:p-12">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
                        <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-6">
                          <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl mb-3 text-foreground">Request Received</h3>
                        <p className="text-[12px] text-muted-foreground font-extralight">Your dedicated aviation advisor will contact you within the hour with tailored aircraft options and pricing.</p>
                      </motion.div>
                    </GlassCard>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-5 sm:p-8 md:p-10 space-y-8">

                        {/* Trip Type */}
                        <FormSection title="Trip Type">
                          <div className="flex gap-2">
                            {([["one_way", "One Way"], ["round_trip", "Round Trip"]] as const).map(([val, label]) => (
                              <button key={val} type="button" onClick={() => setTripType(val as any)}
                                className={`px-5 py-2.5 rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 ${
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

                        {/* Preferences — Expandable */}
                        <div>
                          <button type="button" onClick={() => setShowPrefs(!showPrefs)}
                            className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium hover:text-primary transition-colors cursor-pointer">
                            <ChevronDown size={12} className={`transition-transform duration-300 ${showPrefs ? "rotate-180" : ""}`} />
                            Aircraft & Budget Preferences
                          </button>
                          <AnimatePresence>
                            {showPrefs && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <PremiumSelect label="Aircraft Category" value={aircraftCategory} onChange={(e) => setAircraftCategory(e.target.value)}>
                                    {aircraftCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                  </PremiumSelect>
                                  <PremiumSelect label="Budget Range" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                                    <option value="">Prefer not to say</option>
                                    <option value="under_25k">Under $25,000</option>
                                    <option value="25k_50k">$25,000 – $50,000</option>
                                    <option value="50k_100k">$50,000 – $100,000</option>
                                    <option value="100k_250k">$100,000 – $250,000</option>
                                    <option value="250k_plus">$250,000+</option>
                                  </PremiumSelect>
                                </div>
                                <PremiumTextarea label="Special Requests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} placeholder="Catering, ground transport, specific requirements..." maxLength={1000} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Contact Details */}
                        <FormSection title="Your Details">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PremiumInput label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" maxLength={100}
                              error={attempted && !name ? "Required" : undefined} />
                            <PremiumInput label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" maxLength={255}
                              error={attempted && !email ? "Required" : undefined} />
                          </div>
                          <PhoneWithCountryCode phone={phone} onPhoneChange={setPhone} countryCode={phoneCode} onCountryCodeChange={setPhoneCode} />
                        </FormSection>

                        <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} />
                        <ValidationMessage show={attempted && !canSubmit} />
                        <FormDisclaimer />
                        <PremiumSubmitButton loading={loading} disabled={!canSubmit}>Get My Options</PremiumSubmitButton>
                        <ConfidentialityNotice />
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 4 — WHAT HAPPENS NEXT ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/55 mb-6 font-light text-center">Transparent Process</p>
            <h3 className="text-2xl md:text-4xl font-display font-semibold text-foreground text-center mb-14">
              What Happens <span className="text-gradient-gold italic font-medium">Next</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {nextSteps.map((step, i) => (
                <FadeReveal key={i} delay={i * 0.15}>
                  <GlassCard hover={false} className="p-8 text-center h-full">
                    <span className="text-3xl font-display font-bold text-primary/20 block mb-4">{step.num}</span>
                    <p className="text-[12px] text-muted-foreground font-extralight leading-[2]">{step.text}</p>
                  </GlassCard>
                </FadeReveal>
              ))}
            </div>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 5 — AUTHORITY ═══════ */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-8">
          <FadeReveal className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {authorityItems.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                  <item.icon className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.2} />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-extralight">{item.text}</span>
              </motion.div>
            ))}
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 6 — WHATSAPP FAST TRACK ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-xl mx-auto text-center">
            <GlassCard hover={false} className="py-12 px-8">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-6 h-6 text-primary/50" strokeWidth={1.2} />
              </motion.div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                Need Immediate Assistance?
              </h3>
              <p className="text-[12px] text-muted-foreground font-extralight leading-[2] mb-8">
                Skip the forms. Message us directly for immediate, personal assistance.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Chat on WhatsApp
              </a>
              <p className="text-[9px] text-muted-foreground/70 font-extralight mt-5 tracking-wide">Available 24/7 · Typical response under 5 minutes</p>
            </GlassCard>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 7 — FINAL CTA ═══════ */}
      <div className="py-24 md:py-36">
        <div className="container mx-auto px-8">
          <FadeReveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6 leading-tight">
              Your Aircraft Is One <span className="text-gradient-gold italic font-medium">Message</span> Away
            </h2>
            <p className="text-[11px] text-foreground/25 font-extralight tracking-[0.15em] mb-10">
              6,000+ aircraft • 40,000 airports • 24/7 global coverage
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowForm(true); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-luxury inline-flex items-center gap-3 px-14 py-4.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              Request Now
            </motion.button>
          </FadeReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
