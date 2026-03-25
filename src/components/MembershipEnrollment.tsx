import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, UserCheck, Tag, Sparkles, CreditCard, Download, MessageCircle, Globe, Building2 } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";

const benefits = [
  { icon: Plane, text: "Priority aircraft access worldwide" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: Tag, text: "Exclusive empty leg opportunities" },
  { icon: Sparkles, text: "Preferential market pricing" },
];

const flightOptions = ["1–2", "3–10", "10+"];
const aircraftCategories = ["Light Jet", "Midsize", "Super Midsize", "Heavy Jet", "Ultra Long Range", "No Preference"];

const inputClass =
  "w-full bg-card rounded-lg px-4 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border";

const labelClass = "block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium";

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

  const canStep1 = name && email;
  const canStep2 = true; // optional fields
  const canSubmit = canStep1 && termsAccepted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email"); return; }
    setLoading(true);
    try {
      await capture({
        name,
        email,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        city: city || undefined,
        country: country || undefined,
        nationality: nationality || undefined,
        company: company || undefined,
        title: title || undefined,
        departure: city || "N/A",
        destination: "Membership Application",
        source: "membership_enrollment",
        travel_frequency: flights || undefined,
        typical_routes: typicalRoutes ? typicalRoutes.split(",").map((r) => r.trim()) : undefined,
        passenger_count: passengerCount || undefined,
        preferred_aircraft_category: aircraftPref || undefined,
        reason: reason || undefined,
        invitation_code: invitationCode || undefined,
        terms_accepted: termsAccepted,
      });
      const seq = Math.floor(1000 + Math.random() * 9000);
      setMember({ name: name.toUpperCase(), id: `5000 ${seq.toString().padStart(4, "0")}`, memberSince: String(new Date().getFullYear()) });
      toast.success("Welcome to the Universal Jets network.");
    } catch {
      toast.error("Something went wrong. Please try again.");
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
                    className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm"
                  >
                    {/* Progress */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-primary/60" : "bg-border"}`} />
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium mb-4">Step 1 — Your Identity</p>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Full Name *</label><input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Alexander Hartwell" /></div>
                            <div><label className={labelClass}>Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="alex@example.com" /></div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Phone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+971 50 000 0000" /></div>
                            <div><label className={labelClass}>WhatsApp</label><input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} placeholder="+971 50 000 0000" /></div>
                          </div>
                          <button type="button" disabled={!canStep1} onClick={() => setStep(2)}
                            className="w-full mt-2 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] disabled:opacity-40">
                            Continue
                          </button>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium mb-4">Step 2 — Background</p>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>City</label><input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Dubai" /></div>
                            <div><label className={labelClass}>Country</label><input value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="UAE" /></div>
                          </div>
                          <div><label className={labelClass}>Nationality</label><input value={nationality} onChange={(e) => setNationality(e.target.value)} className={inputClass} placeholder="British" /></div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Company</label><input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} placeholder="Company name" /></div>
                            <div><label className={labelClass}>Title / Role</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="CEO, Founder, etc." /></div>
                          </div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-border text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all hover:border-primary/30">Back</button>
                            <button type="button" onClick={() => setStep(3)} className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)]">Continue</button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium mb-4">Step 3 — Travel Profile</p>
                          <div>
                            <label className={labelClass}>Estimated Flights Per Year</label>
                            <div className="grid grid-cols-3 gap-2">
                              {flightOptions.map((opt) => (
                                <button key={opt} type="button" onClick={() => setFlights(opt)}
                                  className={`py-2.5 rounded-lg text-[12px] font-medium border transition-all duration-300 ${
                                    flights === opt ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground/50 hover:border-primary/30"
                                  }`}>{opt}</button>
                              ))}
                            </div>
                          </div>
                          <div><label className={labelClass}>Typical Routes</label><input value={typicalRoutes} onChange={(e) => setTypicalRoutes(e.target.value)} className={inputClass} placeholder="Dubai → London, NYC → Miami" /></div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Usual Passengers</label><input value={passengerCount} onChange={(e) => setPassengerCount(e.target.value)} className={inputClass} placeholder="e.g. 2-4" /></div>
                            <div><label className={labelClass}>Aircraft Preference</label>
                              <select value={aircraftPref} onChange={(e) => setAircraftPref(e.target.value)} className={inputClass}>
                                <option value="">Select...</option>
                                {aircraftCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                          <div><label className={labelClass}>Why are you applying?</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className={inputClass} placeholder="Tell us about your travel needs..." /></div>
                          <div><label className={labelClass}>Invitation / Referral Code</label><input value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} className={inputClass} placeholder="If you have one" /></div>
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 accent-primary" />
                            <span className="text-[11px] text-foreground/50 font-light">I accept the membership terms and privacy policy *</span>
                          </label>
                          <div className="flex gap-3 pt-1">
                            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 border border-border text-foreground/50 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all hover:border-primary/30">Back</button>
                            <button type="button" disabled={!canSubmit || loading} onClick={handleSubmit}
                              className="flex-1 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] disabled:opacity-40">
                              {loading ? "Processing..." : "Request Invitation"}
                            </button>
                          </div>
                          <p className="text-[11px] text-muted-foreground text-center font-light pt-1">
                            No commitment required. Your information is handled with absolute discretion.
                          </p>
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
                  <motion.div className="absolute inset-0 opacity-[0.07]" animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, hsla(45,79%,46%,0.4) 35%, transparent 45%, hsla(45,79%,46%,0.2) 55%, transparent 65%)", backgroundSize: "200% 200%" }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

                  <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] tracking-[0.4em] uppercase text-primary/70 font-medium">Universal Jets</p>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-primary/40 font-light">Founder Circle</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-8 rounded-[4px] border border-primary/25 relative overflow-hidden" style={{ background: "linear-gradient(145deg, hsla(45,79%,46%,0.2) 0%, hsla(45,79%,46%,0.08) 100%)" }}>
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
                    <button onClick={() => toast.success("Card saved to your device.")} className="flex items-center gap-2 px-8 py-3.5 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500">
                      <Download className="w-3.5 h-3.5" strokeWidth={1.3} /> Save Card
                    </button>
                    <button onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(45,79%,46%,0.5)]">
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
