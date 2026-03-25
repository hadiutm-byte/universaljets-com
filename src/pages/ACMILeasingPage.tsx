import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Shield, Globe, Clock, FileText, ArrowRight, Users, Building2, Landmark, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const capabilities = [
  { icon: Plane, title: "Full ACMI", desc: "Aircraft, Crew, Maintenance, and Insurance — delivered as a turnkey solution." },
  { icon: Shield, title: "AOC Compliant", desc: "All operations structured under applicable Air Operator Certificates with full regulatory compliance." },
  { icon: Globe, title: "Global Positioning", desc: "Aircraft sourced and positioned worldwide within days, not weeks." },
  { icon: Clock, title: "Rapid Deployment", desc: "From AOG emergencies to seasonal peaks — we mobilize fast when your operation demands it." },
];

const targetClients = [
  { icon: Plane, label: "Airlines", desc: "Fleet supplementation, seasonal capacity, AOG replacement" },
  { icon: Landmark, label: "Governments", desc: "Diplomatic missions, delegation transport, sovereign operations" },
  { icon: Building2, label: "NGOs & Organizations", desc: "Humanitarian logistics, disaster response, aid operations" },
  { icon: Briefcase, label: "Corporations", desc: "Large-scale workforce transport, executive shuttle programmes" },
];

const useCases = [
  { title: "Short-Term ACMI", desc: "Immediate capacity for planned or unplanned fleet gaps. Aircraft on station within 48–72 hours." },
  { title: "Seasonal Demand", desc: "Peak-period capacity for summer schedules, holiday surges, or route launches." },
  { title: "Hajj & Umrah Operations", desc: "Dedicated wide-body aircraft with crew rotations for large-scale pilgrimage operations." },
  { title: "Cargo & Special Missions", desc: "Freighter ACMI, dangerous goods transport, oversized cargo, and time-critical logistics." },
  { title: "AOG Replacement", desc: "Emergency aircraft substitution when your fleet is grounded — minimum downtime, maximum reliability." },
  { title: "Government & Diplomatic", desc: "Secure transport for heads of state, delegations, and sensitive operations with full protocol compliance." },
];

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
          notes: `Aircraft: ${form.aircraft_type || "Any"}\nDuration: ${form.duration || "TBD"}\n\n${form.details}`,
        },
      });
      setSubmitted(true);
      toast.success("Proposal request received. Our team will be in touch shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const inputClass = "bg-secondary/30 border-border/15 text-foreground/80 text-[13px] placeholder:text-foreground/20";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,28%,5%)] via-background to-background" />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(0,0%,100%,0.06) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">ACMI & Aircraft Leasing</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
              Global Aircraft Capacity,<br />
              <span className="text-gradient-gold">Delivered On Demand</span>
            </h1>
            <p className="text-[14px] md:text-[16px] text-foreground/50 font-light leading-[1.9] max-w-xl mx-auto mb-4">
              From urgent fleet replacement to long-term ACMI contracts, we source and deploy aircraft worldwide for airlines, governments, and organizations.
            </p>
            <p className="text-[12px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto mb-10">
              Wet lease, dry lease, and charter programme solutions — structured, compliant, and operational.
            </p>

            <a href="#acmi-form" className="inline-block px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">
              Request ACMI Proposal
            </a>
          </motion.div>
        </div>
      </section>

      {/* Target Clients */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-14">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">Who We Serve</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">Built for Operational Clients</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {targetClients.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                className="text-center p-6 rounded-xl border border-border/10 bg-card/15"
              >
                <c.icon className="w-5 h-5 text-primary/45 mx-auto mb-4" strokeWidth={1.3} />
                <p className="font-display text-[15px] font-medium text-foreground mb-2">{c.label}</p>
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.8]">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-14">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">Capabilities</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">Operational Excellence</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }} className="text-center">
                <div className="w-14 h-14 rounded-full border border-border/20 flex items-center justify-center mx-auto mb-6">
                  <c.icon className="w-5 h-5 text-primary/50" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-[15px] font-medium text-foreground mb-3">{c.title}</h3>
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-14">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">Use Cases</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">What We Deploy For</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}
                className="p-6 rounded-xl border border-border/10 bg-card/15 group hover:border-primary/15 transition-all duration-500"
              >
                <h3 className="font-display text-[14px] font-medium text-foreground mb-2 group-hover:text-primary/80 transition-colors duration-500">{uc.title}</h3>
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="acmi-form" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">Get Started</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">Request ACMI Proposal</h2>
            <p className="text-[13px] text-foreground/40 font-extralight leading-[2] max-w-md mx-auto">
              Tell us your operational requirements — our team will structure a proposal within 24 hours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.8 }}
            className="rounded-2xl border border-primary/8 bg-gradient-to-br from-card/25 to-card/10 backdrop-blur-md p-8 md:p-10"
          >
            {submitted ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-6 h-6 text-primary/60" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-foreground mb-3">Proposal Request Received</h3>
                <p className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-sm mx-auto">
                  Our ACMI team will review your requirements and respond within 24 hours with a structured proposal.
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
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Lease Type</label>
                    <Select value={form.lease_type} onValueChange={v => set("lease_type", v)}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wet_lease">Wet Lease (ACMI)</SelectItem>
                        <SelectItem value="dry_lease">Dry Lease</SelectItem>
                        <SelectItem value="damp_lease">Damp Lease</SelectItem>
                        <SelectItem value="charter_programme">Charter Programme</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Aircraft Type</label>
                    <Input value={form.aircraft_type} onChange={e => set("aircraft_type", e.target.value)} className={inputClass} placeholder="e.g. A320, B737, B777" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Duration</label>
                  <Input value={form.duration} onChange={e => set("duration", e.target.value)} className={inputClass} placeholder="e.g. 3 months, 1 year, seasonal" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-primary/45 font-light">Project Details</label>
                  <Textarea value={form.details} onChange={e => set("details", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Routes, schedule, capacity requirements, regulatory considerations..." />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {loading ? "Submitting..." : "Request ACMI Proposal"}
                </button>

                <p className="text-[10px] text-foreground/20 font-extralight text-center">
                  Every request is reviewed by our operations team — not an automated system.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ACMILeasingPage;
