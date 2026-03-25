import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Shield, Globe, Clock, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const pillars = [
  { icon: Plane, title: "Wet & Dry Lease", desc: "Full ACMI (Aircraft, Crew, Maintenance, Insurance) or dry lease arrangements tailored to your operational needs." },
  { icon: Shield, title: "AOC Compliant", desc: "All operations structured under applicable Air Operator Certificates with full regulatory compliance." },
  { icon: Globe, title: "Global Positioning", desc: "Aircraft sourced and positioned worldwide — from short-term seasonal cover to long-term fleet solutions." },
  { icon: Clock, title: "Rapid Deployment", desc: "Aircraft on station within days, not weeks. We move fast when your operation demands it." },
];

const useCases = [
  "Airline seasonal capacity",
  "Ad-hoc charter programmes",
  "Government & diplomatic transport",
  "Crew training & positioning",
  "Emergency fleet replacement",
  "Long-term corporate shuttle",
];

const ACMILeasingPage = () => {
  const [loading, setLoading] = useState(false);
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
          name: form.name,
          email: form.email,
          phone: form.phone,
          departure: `ACMI — ${form.lease_type || "General"}`,
          destination: form.company,
          date: null,
          passengers: null,
          notes: `Aircraft: ${form.aircraft_type || "Any"}\nDuration: ${form.duration || "TBD"}\n\n${form.details}`,
          source: "acmi_leasing_page",
        },
      });
      toast.success("Proposal request received. Our team will be in touch shortly.");
      setForm({ name: "", company: "", email: "", phone: "", aircraft_type: "", lease_type: "", duration: "", details: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,28%,5%)] via-background to-background" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(38,52%,50%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(38,52%,50%,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">ACMI & Aircraft Leasing</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
              Global ACMI &<br />Aircraft Leasing<span className="text-gradient-gold"> Solutions</span>
            </h1>
            <p className="text-[13px] md:text-[15px] text-foreground/45 font-extralight leading-[2] max-w-xl mx-auto">
              Whether you need a single aircraft for a week or a fleet for a season, Universal Jets structures and delivers leasing solutions across the global market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {pillars.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }} className="text-center group">
                <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 group-hover:glow-subtle transition-all duration-700">
                  <p.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-lg mb-4 text-foreground">{p.title}</h3>
                <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Applications</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground">Built For Every Operation</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
              >
                <ArrowRight className="w-4 h-4 text-primary/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-foreground/60 font-light">{uc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal Form */}
      <section id="acmi-form" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Get Started</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-4">Request ACMI Proposal</h2>
            <p className="text-[12px] text-foreground/35 font-extralight leading-[2]">Tell us about your requirements. Our leasing team will respond within 24 hours.</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="glass-strong rounded-xl p-8 md:p-10 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Full Name *</label>
                <Input value={form.name} onChange={e => update("name", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Company *</label>
                <Input value={form.company} onChange={e => update("company", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="Airline / Operator" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Email *</label>
                <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="email@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Phone</label>
                <Input value={form.phone} onChange={e => update("phone", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="+971 ..." />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Lease Type</label>
                <Select value={form.lease_type} onValueChange={v => update("lease_type", v)}>
                  <SelectTrigger className="bg-input/50 border-border/30 text-foreground/80 text-[13px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wet_lease">Wet Lease (ACMI)</SelectItem>
                    <SelectItem value="dry_lease">Dry Lease</SelectItem>
                    <SelectItem value="damp_lease">Damp Lease</SelectItem>
                    <SelectItem value="charter_programme">Charter Programme</SelectItem>
                    <SelectItem value="other">Other / Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Aircraft Type</label>
                <Input value={form.aircraft_type} onChange={e => update("aircraft_type", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="e.g. A320, B737, G650" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Duration</label>
              <Input value={form.duration} onChange={e => update("duration", e.target.value)} className="bg-input/50 border-border/30 text-foreground/80 text-[13px]" placeholder="e.g. 3 months, 1 year, seasonal" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">Project Details</label>
              <Textarea value={form.details} onChange={e => update("details", e.target.value)} rows={4} className="bg-input/50 border-border/30 text-foreground/80 text-[13px] resize-none" placeholder="Routes, schedule, capacity requirements, regulatory considerations..." />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-6 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
              <FileText className="w-4 h-4 mr-2" />
              {loading ? "Submitting..." : "Request ACMI Proposal"}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ACMILeasingPage;
