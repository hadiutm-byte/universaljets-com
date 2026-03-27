import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Shield } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  FormSection, LegalConsent, ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

const TIERS = [
  { key: "nomad", name: "Nomad", price: "$500/mo", desc: "Regional coverage, 6 requests/year" },
  { key: "explorer", name: "Explorer", price: "$1,200/mo", desc: "Continental coverage, 12 requests/year" },
  { key: "globetrotter", name: "Globetrotter", price: "$2,500/mo", desc: "Worldwide, 24 requests/year" },
  { key: "maverick", name: "Maverick", price: "$5,000/mo", desc: "Unlimited requests, private concierge" },
];

const flightOptions = ["1–5", "6–12", "12–24", "24+"];
const aircraftCategories = ["Light Jet", "Midsize", "Super Midsize", "Heavy Jet", "Ultra Long Range", "No Preference"];

const TOTAL_STEPS = 5;

const MembershipEnrollPage = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { capture } = useCrmApi();

  // Step 1 — Identity
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Step 2 — Tier
  const [selectedTier, setSelectedTier] = useState("");

  // Step 3 — Travel
  const [travelFrequency, setTravelFrequency] = useState("");
  const [yearlyFlights, setYearlyFlights] = useState("");
  const [mainRoutes, setMainRoutes] = useState("");
  const [aircraftPref, setAircraftPref] = useState("");

  // Step 4 — Concierge
  const [hotels, setHotels] = useState("");
  const [events, setEvents] = useState("");
  const [groundTransport, setGroundTransport] = useState("");
  const [security, setSecurity] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [conciergeNotes, setConciergeNotes] = useState("");

  // Step 5 — Confirm
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Preselect tier from URL
  useEffect(() => {
    const tier = searchParams.get("tier");
    if (tier && TIERS.some(t => t.key === tier)) {
      setSelectedTier(tier);
    }
  }, [searchParams]);

  const canStep1 = name && email;
  const canStep2 = !!selectedTier;
  const canSubmit = canStep1 && canStep2 && termsAccepted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await capture({
        name, email,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        city: city || undefined,
        country: country || undefined,
        departure: city || "N/A",
        destination: "Membership Enrollment",
        source: "membership_enrollment",
        preferred_tier: selectedTier,
        travel_frequency: travelFrequency || yearlyFlights || undefined,
        typical_routes: mainRoutes ? mainRoutes.split(",").map(r => r.trim()) : undefined,
        preferred_aircraft_category: aircraftPref || undefined,
        notes: [
          hotels ? `Hotels: ${hotels}` : "",
          events ? `Events: ${events}` : "",
          groundTransport ? `Ground: ${groundTransport}` : "",
          security ? `Security: ${security}` : "",
          lifestyle ? `Lifestyle: ${lifestyle}` : "",
          conciergeNotes || "",
        ].filter(Boolean).join(" | ") || undefined,
        terms_accepted: termsAccepted,
      });
      setSubmitted(true);
      toast.success("Welcome to Universal Jets.");
    } catch {
      toast.error("Unable to process your application. Please try again.");
    }
    setLoading(false);
  };

  const tierLabel = TIERS.find(t => t.key === selectedTier)?.name || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Membership Enrollment | Universal Jets" description="Enroll in Universal Jets membership. Choose your tier and complete your application online." path="/membership/enroll" />
      <Navbar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container mx-auto px-6 md:px-8 max-w-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                {/* Progress */}
                <div className="flex gap-1 mb-8">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i + 1 <= step ? "bg-primary/60" : "bg-border"}`} />
                  ))}
                </div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 font-light mb-8 text-right">
                  Step {step} of {TOTAL_STEPS}
                </p>

                <AnimatePresence mode="wait">
                  {/* ─── STEP 1: Identity ─── */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <FormSection title="Begin Your Membership">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Full Name" required value={name} onChange={e => setName(e.target.value)} placeholder="Alexander Hartwell" maxLength={100} />
                          <PremiumInput label="Email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" maxLength={255} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                          <PremiumInput label="WhatsApp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Country" value={country} onChange={e => setCountry(e.target.value)} placeholder="UAE" maxLength={100} />
                          <PremiumInput label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="Dubai" maxLength={100} />
                        </div>
                      </FormSection>
                      <button type="button" disabled={!canStep1} onClick={() => setStep(2)}
                        className="w-full py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">
                        Continue
                      </button>
                    </motion.div>
                  )}

                  {/* ─── STEP 2: Tier Selection ─── */}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <FormSection title="Select Your Tier">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {TIERS.map(t => (
                            <button key={t.key} type="button" onClick={() => setSelectedTier(t.key)}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                                selectedTier === t.key
                                  ? "border-primary bg-primary/5 shadow-[0_0_20px_-5px_hsla(43,74%,49%,0.15)]"
                                  : "border-foreground/[0.06] bg-muted/30 hover:border-primary/20"
                              }`}>
                              <p className={`font-display text-lg font-semibold mb-1 ${selectedTier === t.key ? "text-primary" : "text-foreground"}`}>{t.name}</p>
                              <p className="text-[11px] text-foreground/60 font-medium mb-1">{t.price}</p>
                              <p className="text-[11px] text-muted-foreground font-light">{t.desc}</p>
                            </button>
                          ))}
                        </div>
                      </FormSection>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                        <button type="button" disabled={!canStep2} onClick={() => setStep(3)}
                          className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">Continue</button>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── STEP 3: Travel Profile ─── */}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <FormSection title="Your Travel Profile">
                        <div>
                          <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">Estimated Flights Per Year</p>
                          <div className="grid grid-cols-4 gap-2">
                            {flightOptions.map(opt => (
                              <button key={opt} type="button" onClick={() => setTravelFrequency(opt)}
                                className={`py-2.5 rounded-lg text-[12px] font-medium border transition-all duration-300 ${
                                  travelFrequency === opt ? "border-primary bg-primary/10 text-primary" : "border-foreground/[0.06] bg-muted/40 text-foreground/50 hover:border-primary/30"
                                }`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                        <PremiumInput label="Main Routes / Destinations" value={mainRoutes} onChange={e => setMainRoutes(e.target.value)} placeholder="Dubai → London, NYC → Miami" maxLength={300} />
                        <PremiumSelect label="Preferred Aircraft Category" value={aircraftPref} onChange={e => setAircraftPref(e.target.value)}>
                          <option value="">Select...</option>
                          {aircraftCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </PremiumSelect>
                      </FormSection>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                        <button type="button" onClick={() => setStep(4)}
                          className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] btn-luxury">Continue</button>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── STEP 4: Concierge ─── */}
                  {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <FormSection title="Personal Preferences">
                        <PremiumInput label="Hotel Preferences" value={hotels} onChange={e => setHotels(e.target.value)} placeholder="e.g. Five-star, boutique, specific chains" maxLength={200} />
                        <PremiumInput label="Events & Entertainment" value={events} onChange={e => setEvents(e.target.value)} placeholder="e.g. VIP access, private events" maxLength={200} />
                        <PremiumInput label="Ground Transport" value={groundTransport} onChange={e => setGroundTransport(e.target.value)} placeholder="e.g. Chauffeur, helicopter transfer" maxLength={200} />
                        <PremiumInput label="Security Requirements" value={security} onChange={e => setSecurity(e.target.value)} placeholder="e.g. Close protection, secure transport" maxLength={200} />
                        <PremiumInput label="Lifestyle / Dining" value={lifestyle} onChange={e => setLifestyle(e.target.value)} placeholder="e.g. Dietary requirements, personal chef" maxLength={200} />
                        <PremiumTextarea label="Additional Notes" value={conciergeNotes} onChange={e => setConciergeNotes(e.target.value)} rows={3} placeholder="Anything else we should know..." maxLength={1000} />
                      </FormSection>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(3)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                        <button type="button" onClick={() => setStep(5)}
                          className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] btn-luxury">Continue</button>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── STEP 5: Confirmation ─── */}
                  {step === 5 && (
                    <motion.div key="s5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <FormSection title="You're Almost There">
                        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-muted-foreground">Name</span>
                            <span className="text-foreground font-medium">{name}</span>
                          </div>
                          <div className="flex justify-between text-[12px]">
                            <span className="text-muted-foreground">Email</span>
                            <span className="text-foreground font-medium">{email}</span>
                          </div>
                          {selectedTier && (
                            <div className="flex justify-between text-[12px]">
                              <span className="text-muted-foreground">Selected Tier</span>
                              <span className="text-primary font-semibold capitalize">{tierLabel}</span>
                            </div>
                          )}
                          {travelFrequency && (
                            <div className="flex justify-between text-[12px]">
                              <span className="text-muted-foreground">Flights/Year</span>
                              <span className="text-foreground font-medium">{travelFrequency}</span>
                            </div>
                          )}
                          {mainRoutes && (
                            <div className="flex justify-between text-[12px]">
                              <span className="text-muted-foreground">Routes</span>
                              <span className="text-foreground font-medium text-right max-w-[60%]">{mainRoutes}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="flex items-start gap-3">
                            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.3} />
                            <p className="text-[12px] text-foreground/60 font-light leading-[1.8]">
                              Your dedicated advisor will contact you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </FormSection>

                      <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} includeMarketing marketingChecked={marketingConsent} onMarketingChange={setMarketingConsent} />

                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(4)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                        <button type="button" disabled={!canSubmit || loading} onClick={handleSubmit}
                          className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">
                          {loading ? "Processing…" : "Submit Application"}
                        </button>
                      </div>
                      <ConfidentialityNotice className="!mt-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* ═══ SUCCESS ═══ */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-16">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-8">
                  <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Welcome to Universal Jets
                </h2>
                <p className="text-[14px] text-muted-foreground font-light leading-[1.9] mb-10">
                  Your membership application has been received. A dedicated advisor will contact you shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/" className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500">
                    Return Home
                  </Link>
                  <Link to="/fleet" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500">
                    Explore Fleet <ArrowRight size={10} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MembershipEnrollPage;
