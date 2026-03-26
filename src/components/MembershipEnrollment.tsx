import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, UserCheck, Tag, Sparkles, CreditCard, Download, MessageCircle } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  FormSection, LegalConsent, PremiumSubmitButton, ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

const benefits = [
  { icon: Plane, text: "Priority aircraft access worldwide" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: Tag, text: "Exclusive empty leg opportunities" },
  { icon: Sparkles, text: "Preferential market pricing" },
];

const flightOptions = ["1–2", "3–10", "10+"];
const aircraftCategories = ["Light Jet", "Midsize", "Super Midsize", "Heavy Jet", "Ultra Long Range", "No Preference"];

const MembershipEnrollment = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<{ name: string; id: string; memberSince: string } | null>(null);
  const { capture } = useCrmApi();

  // Step 1: Identity
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Step 2: Background
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  // Step 3: Travel Profile
  const [flights, setFlights] = useState("");
  const [typicalRoutes, setTypicalRoutes] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [aircraftPref, setAircraftPref] = useState("");
  const [reason, setReason] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const canStep1 = name && email;
  const canSubmit = canStep1 && termsAccepted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await capture({
        name, email,
        phone: phone || undefined, whatsapp: whatsapp || undefined,
        city: city || undefined, country: country || undefined,
        nationality: nationality || undefined, company: company || undefined,
        title: title || undefined, departure: city || "N/A",
        destination: "Membership Application", source: "membership_enrollment",
        travel_frequency: flights || undefined,
        typical_routes: typicalRoutes ? typicalRoutes.split(",").map((r) => r.trim()) : undefined,
        passenger_count: passengerCount || undefined,
        preferred_aircraft_category: aircraftPref || undefined,
        reason: reason || undefined, invitation_code: invitationCode || undefined,
        terms_accepted: termsAccepted,
      });
      const seq = Math.floor(1000 + Math.random() * 9000);
      setMember({ name: name.toUpperCase(), id: `5000 ${seq.toString().padStart(4, "0")}`, memberSince: String(new Date().getFullYear()) });
      toast.success("Welcome to the Universal Jets network.");
    } catch {
      toast.error("We were unable to process your application. Please try again or contact our team directly.");
    }
    setLoading(false);
  };

  return (
    <section id="membership" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Private Access Network</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
              Membership{" "}
              <span className="text-gradient-gold italic">By Invitation Only</span>
            </h2>
            <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
              Apply online and receive your digital membership card instantly.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!member ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-5 gap-12">
                {/* Benefits */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-8 bg-card">
                      <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.2} />
                    </div>
                    <p className="text-[11px] tracking-[0.35em] uppercase text-primary mb-6 font-medium">Member Benefits</p>
                    <div className="space-y-5">
                      {benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <b.icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.3} />
                          <span className="text-[13px] text-foreground/70 font-light leading-[1.8]">{b.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-border">
                      <p className="text-[12px] text-muted-foreground font-light leading-[1.9]">
                        Membership is complimentary for qualified applicants. Acceptance is subject to review.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Multi-step Form */}
                <div className="lg:col-span-3">
                  <motion.div initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-8 md:p-10 shadow-sm">
                    {/* Progress */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-primary/60" : "bg-border"}`} />
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <FormSection title="Step 1 — Your Identity">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <PremiumInput label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alexander Hartwell" maxLength={100} />
                              <PremiumInput label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" maxLength={255} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <PremiumInput label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                              <PremiumInput label="WhatsApp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                            </div>
                          </FormSection>
                          <button type="button" disabled={!canStep1} onClick={() => canStep1 && setStep(2)}
                            className="w-full mt-2 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">
                            Continue
                          </button>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <FormSection title="Step 2 — Background">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <PremiumInput label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dubai" maxLength={100} />
                              <PremiumInput label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="UAE" maxLength={100} />
                            </div>
                            <PremiumInput label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="British" maxLength={100} />
                            <div className="grid sm:grid-cols-2 gap-4">
                              <PremiumInput label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" maxLength={100} />
                              <PremiumInput label="Title / Role" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CEO, Founder, etc." maxLength={100} />
                            </div>
                          </FormSection>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                            <button type="button" onClick={() => setStep(3)} className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] btn-luxury">Continue</button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <FormSection title="Step 3 — Travel Profile">
                            <div>
                              <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">Estimated Flights Per Year</p>
                              <div className="grid grid-cols-3 gap-2">
                                {flightOptions.map((opt) => (
                                  <button key={opt} type="button" onClick={() => setFlights(opt)}
                                    className={`py-2.5 rounded-lg text-[12px] font-medium border transition-all duration-300 ${
                                      flights === opt ? "border-primary bg-primary/10 text-primary" : "border-foreground/[0.06] bg-muted/40 text-foreground/50 hover:border-primary/30"
                                    }`}>{opt}</button>
                                ))}
                              </div>
                            </div>
                            <PremiumInput label="Typical Routes" value={typicalRoutes} onChange={(e) => setTypicalRoutes(e.target.value)} placeholder="Dubai → London, NYC → Miami" />
                            <div className="grid sm:grid-cols-2 gap-4">
                              <PremiumInput label="Usual Passengers" value={passengerCount} onChange={(e) => setPassengerCount(e.target.value)} placeholder="e.g. 2-4" />
                              <PremiumSelect label="Aircraft Preference" value={aircraftPref} onChange={(e) => setAircraftPref(e.target.value)}>
                                <option value="">Select...</option>
                                {aircraftCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                              </PremiumSelect>
                            </div>
                            <PremiumTextarea label="Why Are You Applying?" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Tell us about your travel needs..." maxLength={1000} />
                            <PremiumInput label="Invitation / Referral Code" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} placeholder="If you have one" maxLength={50} />
                          </FormSection>

                          <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} includeMarketing marketingChecked={marketingConsent} onMarketingChange={setMarketingConsent} />

                          <div className="flex gap-3 pt-1">
                            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 border border-foreground/[0.06] text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all hover:border-primary/30">Back</button>
                            <button type="button" disabled={!canSubmit || loading} onClick={handleSubmit}
                              className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.4)] disabled:opacity-40 btn-luxury">
                              {loading ? "Processing…" : "Request Invitation"}
                            </button>
                          </div>
                          <ConfidentialityNotice className="!mt-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* ── Digital Membership Card ── */
              <motion.div key="card" initial={{ opacity: 0, scale: 0.92, rotateX: 15 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-md mx-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
                  <p className="text-[11px] tracking-[0.35em] uppercase text-primary mb-2 font-medium">Welcome to Universal Jets</p>
                  <p className="text-[13px] text-muted-foreground font-light">Your Private Access is now active.</p>
                </motion.div>

                <div className="relative rounded-2xl overflow-hidden aspect-[1.586/1] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]" style={{ background: "linear-gradient(160deg, hsl(240 3% 15%) 0%, hsl(240 3% 8%) 40%, hsl(240 2% 12%) 100%)" }}>
                  <motion.div className="absolute inset-0 opacity-[0.07]" animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, hsla(43,74%,49%,0.4) 35%, transparent 45%, hsla(43,74%,49%,0.2) 55%, transparent 65%)", backgroundSize: "200% 200%" }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

                  <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] tracking-[0.4em] uppercase text-primary/70 font-medium">Universal Jets</p>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-primary/40 font-light">Founder Circle</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-8 rounded-[4px] border border-primary/25 relative overflow-hidden" style={{ background: "linear-gradient(145deg, hsla(43,74%,49%,0.2) 0%, hsla(43,74%,49%,0.08) 100%)" }}>
                        <div className="absolute inset-[3px] border border-primary/15 rounded-[2px]" />
                      </div>
                      <p className="text-[16px] tracking-[0.2em] text-white/60 font-light font-mono">{member.id}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[16px] text-white/85 font-display font-medium tracking-[0.05em] uppercase">{member.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-light leading-tight">Member<br />Since</span>
                          <span className="text-[13px] text-white/50 font-light tracking-wider">{member.memberSince}</span>
                        </div>
                      </div>
                      <p className="text-[9px] tracking-[0.35em] uppercase text-primary/50 font-light">Private Access Network</p>
                    </div>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-6">
                  <p className="text-center text-[13px] text-muted-foreground font-light leading-[1.9]">A dedicated aviation advisor will contact you shortly.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button onClick={() => toast.success("Card saved to your device.")} className="flex items-center gap-2 px-8 py-3.5 border border-foreground/[0.06] text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500">
                      <Download className="w-3.5 h-3.5" strokeWidth={1.3} /> Save Card
                    </button>
                    <button onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(43,74%,49%,0.5)] btn-luxury">
                      <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.3} /> Contact Advisor
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MembershipEnrollment;
