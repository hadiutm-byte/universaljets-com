import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Globe, Clock, ArrowRight, AlertTriangle, Check,
  Radio, MapPin, ShieldCheck, Plane, Users, Truck, Lock,
  Navigation, Zap, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ─── Data ─── */

const capabilities = [
  {
    icon: Shield,
    title: "Conflict Zone Extraction",
    desc: "Rapid extraction of personnel, families, and assets from active conflict zones, politically unstable regions, and areas under threat. Coordinated with security teams on the ground.",
    tags: ["Extraction", "Conflict Zone", "Personnel"],
  },
  {
    icon: Users,
    title: "Mass Evacuation Operations",
    desc: "Large-scale evacuation of corporate workforces, diplomatic staff, and civilian groups. Multi-aircraft coordination with staging areas and secure assembly points.",
    tags: ["Mass Evac", "Corporate", "Diplomatic"],
  },
  {
    icon: Lock,
    title: "Secure Corridor Planning",
    desc: "Identification and coordination of safe air corridors, overflight permits through restricted airspace, and contingency routing for denied or contested zones.",
    tags: ["Air Corridors", "Permits", "Contingency"],
  },
  {
    icon: Globe,
    title: "Cross-Border Repatriation",
    desc: "End-to-end repatriation logistics including documentation support, consular coordination, third-country staging, and onward travel arrangements.",
    tags: ["Repatriation", "Consular", "Staging"],
  },
  {
    icon: Truck,
    title: "Critical Asset & Cargo Evacuation",
    desc: "Secure transport of sensitive documents, equipment, valuables, and critical infrastructure components from high-risk locations.",
    tags: ["Assets", "Cargo", "Sensitive"],
  },
  {
    icon: Eye,
    title: "Situational Intelligence",
    desc: "Real-time threat monitoring, airport status assessment, and operational feasibility analysis before and during evacuation missions.",
    tags: ["Intel", "Threat Assessment", "Real-Time"],
  },
];

const operationalStrengths = [
  { icon: Zap, title: "Rapid Mobilization", stat: "4–12h", desc: "Aircraft positioned and crew briefed within hours of activation. Pre-planned contingency routes for high-risk regions." },
  { icon: Radio, title: "24/7 Crisis Desk", stat: "Always On", desc: "Dedicated crisis operations team with direct lines to security firms, embassies, and ground handlers in conflict zones." },
  { icon: Navigation, title: "Complex Routing", stat: "Global", desc: "NOTAM monitoring, restricted airspace navigation, alternate airport planning, and fuel contingency for denied diversion zones." },
  { icon: ShieldCheck, title: "Security Coordination", stat: "End-to-End", desc: "Integration with private security contractors, armored ground transport, secure assembly points, and protected embarkation." },
  { icon: MapPin, title: "Regional Expertise", stat: "190+", desc: "Deep operational knowledge across Middle East, Africa, Central Asia, and Eastern Europe. Established handler networks in austere locations." },
  { icon: Plane, title: "Aircraft Flexibility", stat: "All Types", desc: "From light jets for small-team extractions to wide-body aircraft for mass evacuations. Cargo-configured options for asset recovery." },
];

const scenarios = [
  { title: "Corporate Workforce Extraction", desc: "Evacuate employees and contractors from deteriorating security situations with minimum notice.", priority: "critical" },
  { title: "Diplomatic & Embassy Evacuation", desc: "Coordinate departure of diplomatic personnel, families, and classified materials under secure protocols.", priority: "critical" },
  { title: "NGO & Aid Worker Extraction", desc: "Rapid departure planning for humanitarian organizations when operational areas become hostile.", priority: "high" },
  { title: "Family & VIP Evacuation", desc: "Discreet, high-priority extraction of UHNW individuals and families from regions entering conflict.", priority: "high" },
  { title: "Insurance & Assistance Companies", desc: "Aircraft-on-standby contracts for travel insurers and global assistance providers covering high-risk regions.", priority: "medium" },
  { title: "Asset & Evidence Recovery", desc: "Secure extraction of critical documents, equipment, and digital assets from compromised locations.", priority: "medium" },
];

const trustSignals = [
  "ARGUS Registered Broker",
  "Conflict Zone Experience",
  "Global Security Network",
  "24/7 Crisis Operations",
  "190+ Country Reach",
  "DCAA License No. 3342665",
];

/* ─── Page schema ─── */
const evacuationServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "War Zone & Crisis Evacuation",
  provider: { "@id": "https://universaljets.com/#organization" },
  serviceType: "Crisis Evacuation & Conflict Zone Extraction",
  areaServed: { "@type": "Place", name: "Worldwide — conflict zones & high-risk regions" },
  description: "Rapid evacuation and extraction services from conflict zones, war-affected regions, and politically unstable areas. Personnel extraction, mass evacuation, asset recovery, and cross-border repatriation.",
};

/* ─── Component ─── */

const EvacuationPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", organization: "", email: "", phone: "",
    urgency: "", region: "", people_count: "", details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in required fields.");
      return;
    }
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          departure: `EVACUATION — ${form.region || "Undisclosed"}`,
          destination: form.organization || "N/A",
          source: "evacuation_crisis",
          notes: `Urgency: ${form.urgency || "TBD"}\nPeople: ${form.people_count || "TBD"}\nRegion: ${form.region || "TBD"}\n\n${form.details}`,
        },
      });
      setSubmitted(true);
      toast.success("Crisis inquiry received. Our operations desk will contact you immediately.");
    } catch {
      toast.error("Something went wrong. Please try again or call directly.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const inputClass = "bg-[hsl(228,20%,8%)] border-[hsl(228,15%,18%)] text-white/80 text-[13px] placeholder:text-white/25 focus:border-primary/30";

  return (
    <div className="min-h-screen bg-[hsl(228,28%,4%)]">
      <SEOHead
        title="War Zone Evacuation — Crisis Extraction & Repatriation"
        description="Rapid evacuation from conflict zones and war-affected regions. Personnel extraction, mass evacuation, asset recovery, and cross-border repatriation. 24/7 crisis operations desk."
        path="/evacuation"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Evacuation", path: "/evacuation" }]}
      />
      <JsonLd data={evacuationServiceSchema} />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,20%,4%)] via-[hsl(228,28%,5%)] to-[hsl(228,28%,4%)]" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(0,0%,100%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsla(0,70%,50%,1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] tracking-[0.4em] uppercase text-red-400/80 font-medium">Crisis Operations</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-white mb-6 leading-[1.1] tracking-[-0.01em]" style={{ textShadow: "0 2px 20px hsla(0,0%,0%,0.7)" }}>
              When Every Hour<br />
              <span className="text-gradient-gold italic font-semibold">Counts.</span>
            </h1>

            <p className="text-[14px] md:text-[16px] text-white/65 font-light leading-[1.9] max-w-2xl mx-auto mb-10">
              Rapid evacuation and extraction from conflict zones, war-affected regions, and politically unstable areas. Personnel, families, and critical assets — moved to safety.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#evac-form" className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(43,85%,58%,0.5)] transition-all duration-500 inline-flex items-center gap-2">
                Request Evacuation Support <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href="#capabilities" className="px-8 py-4 border border-[hsl(228,15%,18%)] text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:border-primary/20 hover:text-white/70 transition-all duration-500">
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
                <span className="text-[9px] tracking-[0.2em] uppercase text-white/55 font-light whitespace-nowrap">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section id="capabilities" className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Capabilities</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-white mb-4">
              Crisis-Grade <span className="text-gradient-gold italic">Evacuation Operations</span>
            </h2>
            <p className="text-[13px] text-white/60 font-extralight leading-[2] max-w-lg mx-auto">
              From single-person extraction to full-scale workforce evacuation — planned, coordinated, and executed under pressure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative p-6 rounded-lg border border-[hsl(228,15%,12%)] bg-[hsl(228,25%,6%)] hover:border-primary/15 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                    <cap.icon className="w-5 h-5 text-primary/60" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">{cap.title}</h3>
                  <p className="text-[12px] text-white/55 font-extralight leading-[1.9] mb-4">{cap.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {cap.tags.map(tag => (
                      <span key={tag} className="text-[8px] tracking-[0.2em] uppercase text-primary/40 bg-primary/5 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONAL STRENGTHS ── */}
      <section className="py-20 md:py-28 bg-[hsl(228,25%,5%)] border-y border-[hsl(228,15%,12%)]">
        <div className="container mx-auto px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Operational Edge</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-white mb-4">
              Built for <span className="text-gradient-gold italic">High-Threat Environments</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operationalStrengths.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary/50" />
                </div>
                <div className="text-xl font-display font-bold text-primary mb-1">{item.stat}</div>
                <h3 className="text-[13px] font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-[11px] text-white/50 font-extralight leading-[1.8]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCENARIOS ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Use Cases</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-white mb-4">
              Mission <span className="text-gradient-gold italic">Scenarios</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-lg border border-[hsl(228,15%,12%)] bg-[hsl(228,25%,6%)] hover:border-primary/10 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${
                    s.priority === "critical" ? "bg-red-500" :
                    s.priority === "high" ? "bg-amber-500" : "bg-primary/50"
                  }`} />
                  <span className={`text-[8px] tracking-[0.3em] uppercase font-medium ${
                    s.priority === "critical" ? "text-red-400/70" :
                    s.priority === "high" ? "text-amber-400/70" : "text-primary/40"
                  }`}>{s.priority}</span>
                </div>
                <h3 className="text-[13px] font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-[11px] text-white/50 font-extralight leading-[1.8]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="evac-form" className="py-20 md:py-28 bg-[hsl(228,25%,5%)] border-t border-[hsl(228,15%,12%)]">
        <div className="container mx-auto px-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
              <AlertTriangle className="w-3 h-3 text-primary/60" />
              <span className="text-[8px] tracking-[0.4em] uppercase text-primary/70 font-medium">Secure Channel</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
              Request Evacuation Support
            </h2>
            <p className="text-[13px] text-white/55 font-extralight leading-[1.9]">
              All inquiries are treated with the highest level of confidentiality. For immediate assistance, contact our 24/7 crisis desk directly.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-8 rounded-lg border border-primary/15 bg-[hsl(228,25%,6%)]">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Inquiry Received</h3>
              <p className="text-[13px] text-white/55 font-light leading-[1.8] max-w-md mx-auto">
                Our crisis operations team has been alerted and will contact you as soon as possible. For urgent matters, please call our 24/7 operations desk directly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-lg border border-[hsl(228,15%,12%)] bg-[hsl(228,25%,6%)]">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Full Name *</label>
                  <Input className={inputClass} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Organization</label>
                  <Input className={inputClass} value={form.organization} onChange={e => set("organization", e.target.value)} placeholder="Company, embassy, NGO..." />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Email *</label>
                  <Input className={inputClass} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Phone / WhatsApp</label>
                  <Input className={inputClass} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+971 XX XXX XXXX" />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Urgency</label>
                  <Select onValueChange={v => set("urgency", v)}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (24h)</SelectItem>
                      <SelectItem value="urgent">Urgent (48–72h)</SelectItem>
                      <SelectItem value="contingency">Contingency Planning</SelectItem>
                      <SelectItem value="standby">Standby Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Region</label>
                  <Select onValueChange={v => set("region", v)}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="middle_east">Middle East</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="central_asia">Central Asia</SelectItem>
                      <SelectItem value="eastern_europe">Eastern Europe</SelectItem>
                      <SelectItem value="south_asia">South Asia</SelectItem>
                      <SelectItem value="other">Other / Undisclosed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">People Count</label>
                  <Select onValueChange={v => set("people_count", v)}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1–5</SelectItem>
                      <SelectItem value="6-20">6–20</SelectItem>
                      <SelectItem value="21-50">21–50</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                      <SelectItem value="tbd">To Be Determined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-medium">Mission Details</label>
                <Textarea className={`${inputClass} min-h-[120px]`} value={form.details} onChange={e => set("details", e.target.value)} placeholder="Describe the situation, location, extraction requirements, security considerations..." />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_40px_-8px_hsla(43,85%,58%,0.5)] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Submit Evacuation Inquiry <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>

              <p className="text-[10px] text-white/30 text-center font-light">
                All communications are confidential. By submitting, you agree to our privacy policy.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EvacuationPage;
