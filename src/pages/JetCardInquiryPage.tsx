import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Repeat, Globe, Plane, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput, PremiumSelect, PremiumTextarea,
  FormSection, LegalConsent, ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

const benefits = [
  { icon: Lock, text: "Rates locked at purchase" },
  { icon: Repeat, text: "Unused hours carry forward" },
  { icon: Globe, text: "Access any aircraft class" },
  { icon: Plane, text: "Priority over on-demand bookings" },
  { icon: Shield, text: "No hidden costs — ever" },
];

const plans = ["25 Hours", "50 Hours", "100 Hours", "Custom"];
const aircraftSizes = ["Very Light Jet", "Light Jet", "Midsize", "Super Midsize", "Heavy Jet", "Ultra Long Range", "Flexible"];

const JetCardInquiryPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { capture } = useCrmApi();

  const geo = useUserGeolocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState("");
  const [annualHours, setAnnualHours] = useState("");
  const [regions, setRegions] = useState("");
  const [passengers, setPassengers] = useState("");
  const [aircraftSize, setAircraftSize] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const canSubmit = name && email && termsAccepted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await capture({
        name, email,
        phone: phone || undefined,
        company: company || undefined,
        departure: regions || "N/A",
        destination: "Jet Card Inquiry",
        source: "jet_card_request",
        preferred_aircraft_category: aircraftSize || undefined,
        passenger_count: passengers || undefined,
        notes: [
          plan ? `Plan: ${plan}` : "",
          annualHours ? `Est. annual hours: ${annualHours}` : "",
          regions ? `Regions: ${regions}` : "",
          notes || "",
        ].filter(Boolean).join(" | "),
        terms_accepted: termsAccepted,
      });
      setSubmitted(true);
      toast.success("Your Jet Card request has been received.");
    } catch {
      toast.error("Unable to process your request. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Apply for Altus Jet Card Global | Universal Jets" description="Request your tailored Altus Jet Card proposal. Locked-in rates, zero fees, hours that carry forward." path="/jet-card-inquiry" />
      <Navbar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container mx-auto px-6 md:px-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

                {/* Left — Branding */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
                    <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-4 font-medium">Altus Jet Card Global</p>
                    <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                      Pure Flying <span className="text-gradient-gold italic">Freedom</span>
                    </h1>
                    <p className="text-[13px] text-muted-foreground font-light leading-[1.9] mb-8">
                      No hidden costs. No positioning fees. No membership fees. Purchase flight hours at locked-in rates with full fleet flexibility.
                    </p>

                    <div className="space-y-4 mb-8">
                      {benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <b.icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.3} />
                          <span className="text-[13px] text-foreground/70 font-light">{b.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border">
                      <p className="text-[11px] text-muted-foreground/60 font-light leading-[1.8]">
                        7,000+ vetted aircraft • ARGUS/WYVERN certified • 160+ countries
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Right — Form */}
                <div className="lg:col-span-3">
                  <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-8 md:p-10 shadow-sm">

                    <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">Request Your Altus Jet Card Proposal</h2>
                    <p className="text-[13px] text-muted-foreground font-light leading-[1.8] mb-8">
                      A tailored proposal prepared around your flying patterns, preferred aircraft category, and annual usage.
                    </p>

                    <div className="space-y-5">
                      <FormSection title="Contact Details">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Full Name" required value={name} onChange={e => setName(e.target.value)} placeholder="Alexander Hartwell" maxLength={100} />
                          <PremiumInput label="Email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" maxLength={255} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Phone / WhatsApp" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                          <PremiumInput label="Company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" maxLength={100} />
                        </div>
                      </FormSection>

                      <FormSection title="Jet Card Preferences">
                        <div>
                          <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">Preferred Plan</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {plans.map(p => (
                              <button key={p} type="button" onClick={() => setPlan(p)}
                                className={`py-2.5 rounded-lg text-[12px] font-medium border transition-all duration-300 ${
                                  plan === p ? "border-primary bg-primary/10 text-primary" : "border-foreground/[0.06] bg-muted/40 text-foreground/50 hover:border-primary/30"
                                }`}>{p}</button>
                            ))}
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <PremiumInput label="Estimated Annual Flight Hours" value={annualHours} onChange={e => setAnnualHours(e.target.value)} placeholder="e.g. 50-100" maxLength={50} />
                          <PremiumInput label="Typical Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} placeholder="e.g. 2-6" maxLength={20} />
                        </div>
                        <PremiumInput label="Preferred Regions / Routes" value={regions} onChange={e => setRegions(e.target.value)} placeholder="e.g. Europe, Middle East, London → Dubai" maxLength={200} />
                        <PremiumSelect label="Preferred Aircraft Size" value={aircraftSize} onChange={e => setAircraftSize(e.target.value)}>
                          <option value="">Select...</option>
                          {aircraftSizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </PremiumSelect>
                        <PremiumTextarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any additional requirements or questions..." maxLength={1000} />
                      </FormSection>

                      <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} includeMarketing marketingChecked={marketingConsent} onMarketingChange={setMarketingConsent} />

                      <button type="button" disabled={!canSubmit || loading} onClick={handleSubmit}
                        className="w-full py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">
                        {loading ? "Processing…" : "Submit Request"}
                      </button>

                      <ConfidentialityNotice />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* ═══ SUCCESS STATE ═══ */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md mx-auto text-center py-16">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-8">
                  <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Your Jet Card Request Has Been Received
                </h2>
                <p className="text-[14px] text-muted-foreground font-light leading-[1.9] mb-10">
                  Our team will prepare a tailored proposal and contact you shortly.
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

export default JetCardInquiryPage;
