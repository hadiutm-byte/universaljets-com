import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane, Shield, Globe, Clock, FileText, ArrowRight, Users, Building2,
  Landmark, Briefcase, Zap, Target, Navigation, AlertTriangle, Check,
  Radio, Truck, MapPin, ShieldCheck, Radar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ─── Data ─── */

const coreCapabilities = [
  {
    icon: Plane,
    title: "Full ACMI Leasing",
    desc: "Aircraft, Crew, Maintenance, and Insurance — delivered as a turnkey wet lease solution. Short-term, seasonal, or long-term contracts structured to your operational timeline.",
    tags: ["Wet Lease", "Crew Included", "Turnkey"],
  },
  {
    icon: Truck,
    title: "Cargo & Freight",
    desc: "Dedicated freighter aircraft for time-critical cargo, oversized loads, dangerous goods, and humanitarian logistics. Global positioning within 48 hours.",
    tags: ["Freighter", "DG Cargo", "Oversize"],
  },
  {
    icon: Landmark,
    title: "Government & Diplomatic",
    desc: "Secure transport for heads of state, ministerial delegations, and sovereign operations. Full protocol compliance, crew vetting, and operational security.",
    tags: ["Sovereign", "Protocol", "Secure"],
  },
  {
    icon: AlertTriangle,
    title: "Humanitarian & Urgent Deployment",
    desc: "Rapid aircraft mobilization for disaster response, medical evacuation, emergency repatriation, and crisis logistics. Operational within hours, not days.",
    tags: ["Emergency", "MedEvac", "Crisis"],
  },
  {
    icon: Globe,
    title: "Global Positioning",
    desc: "Aircraft sourced and deployed worldwide across all regions. Complex routing, overflight permits, and multi-sector missions handled end-to-end.",
    tags: ["Worldwide", "Permits", "Multi-Sector"],
  },
  {
    icon: Building2,
    title: "Corporate & Charter Programs",
    desc: "Large-scale workforce transport, executive shuttle services, and corporate charter programmes with fixed schedules and guaranteed capacity.",
    tags: ["Corporate", "Shuttle", "Programme"],
  },
];

const operationalStrengths = [
  { icon: Zap, title: "Rapid Deployment", stat: "48h", desc: "Aircraft on station within 48–72 hours for urgent requirements. AOG replacement and emergency mobilization." },
  { icon: Radar, title: "Global Sourcing Network", stat: "7,000+", desc: "Access to 7,000+ vetted aircraft worldwide through our operator network — narrow-body to wide-body." },
  { icon: Target, title: "Aircraft Flexibility", stat: "All Types", desc: "From turboprops to B777s. VIP configuration, cargo, combi, and special mission aircraft available." },
  { icon: ShieldCheck, title: "Regulatory Compliance", stat: "100%", desc: "AOC structuring, overflight permits, slot coordination, and full regulatory awareness across jurisdictions." },
  { icon: Navigation, title: "Complex Routing", stat: "Global", desc: "Multi-sector missions, positioning flights, technical stops, and ETOPS routing planned and executed." },
  { icon: Radio, title: "Mission Planning", stat: "24/7", desc: "Dedicated operations desk for flight planning, crew scheduling, ground handling, and real-time mission support." },
];

const useCases = [
  { title: "Short-Term ACMI", desc: "Immediate capacity for planned or unplanned fleet gaps. Aircraft on station within 48–72 hours.", priority: "high" },
  { title: "Seasonal Capacity", desc: "Peak-period aircraft for summer schedules, holiday surges, Hajj/Umrah operations, or route launches.", priority: "high" },
  { title: "AOG Replacement", desc: "Emergency aircraft substitution when your fleet is grounded — minimum downtime, maximum reliability.", priority: "critical" },
  { title: "Cargo & Special Missions", desc: "Freighter ACMI, dangerous goods, oversized cargo, and time-critical logistics worldwide.", priority: "medium" },
  { title: "Government & Diplomatic", desc: "Secure transport for heads of state, delegations, and sensitive operations with full protocol compliance.", priority: "high" },
  { title: "Humanitarian Response", desc: "Crisis logistics, disaster relief flights, medical evacuation, and emergency repatriation operations.", priority: "critical" },
  { title: "Hajj & Umrah Operations", desc: "Dedicated wide-body aircraft with crew rotations for large-scale pilgrimage operations.", priority: "medium" },
  { title: "Corporate Shuttle", desc: "Scheduled workforce transport between production sites, HQs, and remote locations.", priority: "medium" },
];

const trustSignals = [
  "ARGUS Registered Broker",
  "WYVERN Certified Network",
  "ICAO Compliant Operations",
  "Global AOC Structuring",
  "24/7 Operations Desk",
  "DCAA License No. 3342665",
];

/* ─── Component ─── */

const ACMILeasingPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    aircraft_type: "", lease_type: "", duration: "", details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.error("Please fill in required fields.");
      return;
    }
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name, email: form.email, phone: form.phone,
          departure: `ACMI — ${form.lease_type || "General"}`,
          destination: form.company,
          source: "acmi_operations",
          notes: `Aircraft: ${form.aircraft_type || "Any"}\nDuration: ${form.duration || "TBD"}\n\n${form.details}`,
        },
      });
      setSubmitted(true);
      toast.success("Operational inquiry received. Our team will respond within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const inputClass = "bg-[hsl(228,20%,8%)] border-[hsl(228,15%,18%)] text-foreground/80 text-[13px] placeholder:text-foreground/20 focus:border-primary/30";

  return (
    <div className="min-h-screen bg-[hsl(228,28%,4%)]">
      <SEOHead
        title="ACMI & Operations — Mission-Ready Aviation Solutions"
        description="ACMI leasing, cargo, government missions, and urgent deployment. Enterprise-grade aviation operations with global reach and rapid positioning."
        path="/acmi-leasing"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        {/* Dark cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,30%,3%)] via-[hsl(228,28%,5%)] to-[hsl(228,28%,4%)]" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(0,0%,100%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsla(43,74%,49%,1) 0%, transparent 70%)" }} />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] tracking-[0.4em] uppercase text-primary/70 font-medium">Operations Active</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-foreground mb-6 leading-[1.1] tracking-[-0.01em]">
              Operational Reach.<br />
              <span className="text-gradient-gold italic font-semibold">Mission Ready.</span>
            </h1>

            <p className="text-[14px] md:text-[16px] text-foreground/50 font-light leading-[1.9] max-w-2xl mx-auto mb-10">
              ACMI, cargo, urgent deployment, and tailored aviation support for enterprise, government, and time-critical operations worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#acmi-form" className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(43,74%,49%,0.5)] transition-all duration-500 inline-flex items-center gap-2">
                Request Operational Support <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href="#capabilities" className="px-8 py-4 border border-[hsl(228,15%,18%)] text-foreground/50 text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:border-primary/20 hover:text-foreground/70 transition-all duration-500">
                View Capabilities
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-6 border-y border-[hsl(228,15%,12%)] bg-[hsl(228,25%,5%)]">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {trustSignals.map((signal, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-primary/40" strokeWidth={2} />
                <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/30 font-light whitespace-nowrap">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ── */}
      <section id="capabilities" className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Core Capabilities</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-4">
              Full-Spectrum <span className="text-gradient-gold italic">Aviation Operations</span>
            </h2>
            <p className="text-[13px] text-foreground/35 font-extralight leading-[2] max-w-lg mx-auto">
              From ACMI wet leases to humanitarian response — we deploy the right aircraft for every mission.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreCapabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group rounded-xl border border-[hsl(228,15%,12%)] bg-gradient-to-br from-[hsl(228,22%,7%)] to-[hsl(228,22%,5%)] p-7 hover:border-primary/15 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/6 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-500">
                    <cap.icon className="w-5 h-5 text-primary/60" strokeWidth={1.3} />
                  </div>
                  <h3 className="font-display text-[15px] font-semibold text-foreground leading-tight">{cap.title}</h3>
                </div>
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9] mb-5">{cap.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded text-[8px] tracking-[0.15em] uppercase text-primary/50 font-medium border border-primary/8 bg-primary/3">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONAL STRENGTHS ── */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,25%,3%)] via-[hsl(228,22%,5%)] to-[hsl(228,28%,4%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsla(43,74%,49%,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsla(43,74%,49%,0.1) 0%, transparent 50%)" }} />

        <div className="container mx-auto px-8 max-w-5xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Why Universal Jets</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-4">
              Operational <span className="text-gradient-gold italic">Strengths</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {operationalStrengths.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="rounded-xl border border-[hsl(228,15%,12%)] bg-[hsl(228,22%,6%)] p-6 text-center hover:border-primary/12 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-4.5 h-4.5 text-primary/50" strokeWidth={1.3} />
                </div>
                <p className="text-[22px] font-display font-bold text-primary/70 mb-1">{s.stat}</p>
                <h4 className="font-display text-[13px] font-semibold text-foreground mb-2">{s.title}</h4>
                <p className="text-[10px] text-foreground/30 font-extralight leading-[1.9]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Deployment Scenarios</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-4">
              What We <span className="text-gradient-gold italic">Deploy For</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group rounded-xl border border-[hsl(228,15%,12%)] bg-gradient-to-b from-[hsl(228,22%,7%)] to-[hsl(228,22%,5%)] p-5 hover:border-primary/15 transition-all duration-500 relative overflow-hidden"
              >
                {uc.priority === "critical" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 rounded-full bg-red-500/60 animate-pulse" />
                  </div>
                )}
                {uc.priority === "high" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                  </div>
                )}
                <h4 className="font-display text-[13px] font-semibold text-foreground mb-2 group-hover:text-primary/80 transition-colors duration-500">{uc.title}</h4>
                <p className="text-[10px] text-foreground/30 font-extralight leading-[1.9]">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="py-16 md:py-20 border-y border-[hsl(228,15%,10%)] bg-[hsl(228,25%,5%)]">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Plane, label: "Airlines", desc: "Fleet supplementation, seasonal capacity, AOG replacement" },
              { icon: Landmark, label: "Governments", desc: "Diplomatic missions, delegation transport, sovereign operations" },
              { icon: Users, label: "NGOs & Humanitarian", desc: "Disaster response, aid operations, medical logistics" },
              { icon: Briefcase, label: "Corporations", desc: "Workforce transport, executive shuttle, charter programmes" },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full border border-[hsl(228,15%,15%)] flex items-center justify-center mx-auto mb-4 bg-[hsl(228,22%,7%)]">
                  <c.icon className="w-5 h-5 text-primary/45" strokeWidth={1.3} />
                </div>
                <p className="font-display text-[14px] font-semibold text-foreground mb-1">{c.label}</p>
                <p className="text-[10px] text-foreground/30 font-extralight leading-[1.8]">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="acmi-form" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 20%, hsla(43,74%,49%,0.3) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-8 relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Get Started</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">
              Discuss an ACMI / <span className="text-gradient-gold italic">Mission Requirement</span>
            </h2>
            <p className="text-[13px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto">
              Tell us your operational requirements — our team will structure a proposal within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="rounded-2xl border border-primary/8 bg-gradient-to-br from-[hsl(228,22%,7%)] to-[hsl(228,22%,5%)] p-8 md:p-10"
          >
            {submitted ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5 bg-primary/5">
                  <Check className="w-6 h-6 text-primary/70" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-foreground mb-3">Operational Inquiry Received</h3>
                <p className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-sm mx-auto">
                  Our operations team will review your requirements and respond within 24 hours with a structured proposal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Full Name *</label>
                    <Input value={form.name} onChange={e => set("name", e.target.value)} className={inputClass} placeholder="John Smith" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Company / Organization *</label>
                    <Input value={form.company} onChange={e => set("company", e.target.value)} className={inputClass} placeholder="Airline / Government / Organization" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Email *</label>
                    <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} placeholder="email@company.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Phone</label>
                    <Input value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} placeholder="+971 ..." />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Requirement Type</label>
                    <Select value={form.lease_type} onValueChange={v => set("lease_type", v)}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wet_lease">Wet Lease (ACMI)</SelectItem>
                        <SelectItem value="dry_lease">Dry Lease</SelectItem>
                        <SelectItem value="cargo">Cargo / Freight</SelectItem>
                        <SelectItem value="government">Government / Diplomatic</SelectItem>
                        <SelectItem value="humanitarian">Humanitarian / Emergency</SelectItem>
                        <SelectItem value="charter_programme">Charter Programme</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Aircraft Type</label>
                    <Input value={form.aircraft_type} onChange={e => set("aircraft_type", e.target.value)} className={inputClass} placeholder="e.g. A320, B737, B777, any" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Duration / Timeline</label>
                  <Input value={form.duration} onChange={e => set("duration", e.target.value)} className={inputClass} placeholder="e.g. Immediate, 3 months, seasonal, 1 year" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Mission Details</label>
                  <Textarea value={form.details} onChange={e => set("details", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Routes, schedule, capacity requirements, regulatory considerations, urgency level..." />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(43,74%,49%,0.5)] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {loading ? "Submitting..." : "Request Operational Support"}
                </button>

                <p className="text-[10px] text-foreground/15 font-extralight text-center">
                  Every inquiry is reviewed by our operations team — not an automated system.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 md:py-24 border-t border-[hsl(228,15%,10%)] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, hsla(43,74%,49%,0.2) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/40 mb-5 font-light">Ready to Deploy</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-6">
              Mission-Critical Aviation. <span className="text-gradient-gold italic">On Demand.</span>
            </h2>
            <p className="text-[13px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto mb-10">
              Whether you need an aircraft in 48 hours or a long-term ACMI contract, we're ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#acmi-form" className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(43,74%,49%,0.5)] transition-all duration-500 inline-flex items-center gap-2">
                Request Operational Support <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href="mailto:ops@universaljets.com" className="px-8 py-4 border border-[hsl(228,15%,18%)] text-foreground/50 text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:border-primary/20 hover:text-foreground/70 transition-all duration-500">
                ops@universaljets.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ACMILeasingPage;