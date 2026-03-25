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
  "Aircraft on Ground (AOG) replacement",
  "Seasonal peak capacity",
  "Hajj & Umrah operations",
  "Government and diplomatic missions",
  "Corporate and workforce transport",
  "Cargo and special operations",
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
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Aircraft Leasing Solutions</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
              Private Aviation.<span className="text-gradient-gold"> Perfected.</span>
            </h1>
            <p className="text-[14px] md:text-[16px] text-foreground/55 font-light leading-[1.9] max-w-xl mx-auto mb-10">
              Access the entire global private jet market — instantly compared, optimized, and secured for your mission.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a href="#acmi-form" className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
                Get My Aircraft Options
              </a>
              <a href="/search" className="px-8 py-3.5 border border-primary/20 text-primary/70 text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:border-primary/40 hover:text-primary transition-all duration-500">
                View Empty Legs
              </a>
            </div>

            <p className="text-[10px] tracking-[0.2em] text-foreground/25 font-extralight mb-10">
              6,000+ aircraft • 40,000 airports • 24/7 global coverage
            </p>

            <div className="divider-gold mb-8" />
            <p className="text-[13px] text-foreground/50 font-light leading-[1.8] mb-1">We don't operate aircraft.</p>
            <p className="text-[15px] text-primary/70 font-medium leading-[1.8] mb-4">We access them all.</p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto">
              By sourcing across a global network of operators, we secure the right aircraft, at the right price, for every mission.
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
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Global Access</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Fly Anywhere. Without Limits.</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto mb-2">
              Access 10,000+ destinations worldwide through a global network of private aircraft.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto">
              From major hubs to remote locations, we deliver seamless travel where commercial aviation stops.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { value: "10,000+", label: "Destinations" },
              { value: "160", label: "Countries" },
              { value: "40,000", label: "Airports" },
              { value: "24/7", label: "Global Availability" },
            ].map((s, i) => (
              <div key={i} className="text-center py-6 rounded-lg border border-border/20 bg-card/20">
                <p className="font-display text-2xl md:text-3xl font-semibold text-gradient-gold mb-2">{s.value}</p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/35 font-light">{s.label}</p>
              </div>
            ))}
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

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-12 italic"
          >
            No routes. No restrictions. Only possibilities.
          </motion.p>
        </div>
      </section>

      {/* High-Demand Global Events */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Fly for the Moments That Matter</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">High-Demand Global Events</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto mb-2">
              Strategic access to the world's most important events — where aircraft availability, slot coordination, and timing are critical.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto">
              Global events, elite destinations, and peak travel periods — where timing, access, and precision define the experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Hajj & Umrah", desc: "Large-scale pilgrimage operations with dedicated aircraft and crew rotations." },
              { title: "Formula 1 & Motorsport", desc: "Peak-demand race weekends requiring precise slot coordination and positioning." },
              { title: "World Cup & Olympics", desc: "Multi-city delegation transport with complex scheduling and VIP protocols." },
              { title: "Davos & G20 Summits", desc: "Diplomatic and executive movements under tight security and airspace windows." },
              { title: "Art Basel & Fashion Weeks", desc: "High-net-worth travel surges across multiple global hubs in rapid succession." },
              { title: "Ramadan & Holiday Peaks", desc: "Seasonal demand spikes requiring advance fleet planning and guaranteed availability." },
            ].map((event, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                className="p-6 rounded-lg border border-border/20 bg-card/20 backdrop-blur-sm group hover:border-primary/20 transition-all duration-500"
              >
                <h3 className="font-display text-[15px] font-medium text-foreground mb-3 group-hover:text-primary/80 transition-colors duration-500">{event.title}</h3>
                <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{event.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Featured Routes */}
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { route: "Dubai → Mykonos", tag: "Peak summer demand", demand: "Very High", booking: "3–6 weeks", aircraft: "Heavy / Ultra-Long Range" },
              { route: "Riyadh → London", tag: "Business & diplomatic corridor", demand: "High", booking: "2–4 weeks", aircraft: "Heavy Jets" },
              { route: "Paris → Nice", tag: "Riviera season", demand: "High", booking: "2–4 weeks", aircraft: "Midsize / Heavy Jets" },
              { route: "Dubai → Maldives", tag: "Luxury leisure", demand: "High", booking: "2–4 weeks", aircraft: "Heavy / Ultra-Long Range" },
              { route: "New York → Miami", tag: "High-frequency route", demand: "Very High", booking: "1–2 weeks", aircraft: "Midsize / Heavy Jets" },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}
                className="relative p-5 rounded-lg border border-primary/10 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-sm group hover:border-primary/25 transition-all duration-500"
              >
                <p className="font-display text-[14px] font-medium text-foreground mb-1 group-hover:text-primary/80 transition-colors duration-500">{r.route}</p>
                <p className="text-[10px] text-foreground/30 font-extralight mb-3">{r.tag}</p>
                <div className="space-y-1 text-[10px] text-foreground/35 font-extralight">
                  <div className="flex justify-between"><span className="text-foreground/25">Demand</span><span className="text-primary/60 font-light">{r.demand}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/25">Booking</span><span>{r.booking}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/25">Aircraft</span><span>{r.aircraft}</span></div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-14 italic"
          >
            When the world moves — we're already there.
          </motion.p>
        </div>
      </section>

      {/* Elite Destinations */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-8 relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Elite Destinations</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Where the World's Most Demanding Clients Travel</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-xl mx-auto mb-2">
              From Mediterranean summer hotspots to global financial hubs and remote island escapes — we position aircraft where demand is highest.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { region: "French Riviera", tag: "Nice · Cannes · Monaco", demand: "Very High", booking: "2–4 weeks", airports: "Nice, Cannes Mandelieu", aircraft: "Midsize / Heavy Jets" },
              { region: "Greek Islands", tag: "Mykonos · Santorini · Athens", demand: "High", booking: "1–3 weeks", airports: "Mykonos, Santorini, Athens Intl", aircraft: "Light / Midsize Jets" },
              { region: "Swiss Alps", tag: "Geneva · Zurich · St. Moritz", demand: "Very High", booking: "2–4 weeks", airports: "Geneva, Zurich, Samedan", aircraft: "Midsize / Heavy Jets" },
              { region: "Gulf States", tag: "Dubai · Riyadh · Jeddah", demand: "Extreme", booking: "3–6 weeks", airports: "DWC, OERK, OEJN", aircraft: "Heavy / VIP Airliners" },
              { region: "Caribbean", tag: "St. Barts · Turks & Caicos", demand: "High", booking: "2–4 weeks", airports: "SBH, PLS, SXM", aircraft: "Light / Midsize Jets" },
              { region: "East Africa", tag: "Nairobi · Zanzibar · Seychelles", demand: "Moderate", booking: "1–2 weeks", airports: "JKIA, ZNZ, SEZ", aircraft: "Midsize / Heavy Jets" },
              { region: "London & Paris", tag: "Farnborough · Le Bourget", demand: "Very High", booking: "1–3 weeks", airports: "Farnborough, Le Bourget, Luton", aircraft: "All Categories" },
              { region: "Maldives & Indian Ocean", tag: "Malé · Mauritius", demand: "High", booking: "2–4 weeks", airports: "Velana Intl, SSR Intl", aircraft: "Heavy / Ultra-Long Range" },
            ].map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-5 rounded-lg border border-border/20 bg-card/20 backdrop-blur-sm group hover:border-primary/20 transition-all duration-500"
              >
                <p className="font-display text-[14px] font-medium text-foreground mb-1 group-hover:text-primary/80 transition-colors duration-500">{d.region}</p>
                <p className="text-[10px] text-foreground/30 font-extralight tracking-wide mb-4">{d.tag}</p>
                <div className="space-y-1.5 text-[10px] text-foreground/35 font-extralight">
                  <div className="flex justify-between"><span className="text-foreground/25">Demand</span><span className="text-primary/60 font-light">{d.demand}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/25">Booking</span><span>{d.booking}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/25">Airports</span><span className="text-right max-w-[60%]">{d.airports}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/25">Aircraft</span><span>{d.aircraft}</span></div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-14 italic"
          >
            Wherever the destination — we deliver.
          </motion.p>
        </div>
      </section>

      {/* Request Your Flight */}
      <section id="acmi-form" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Get Started</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Request Your Flight</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto mb-2">
              Access the entire global private jet market — not just one fleet.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto">
              Our team analyzes aircraft availability, positioning, and pricing in real time to secure the best option for your mission.
            </p>
            <p className="text-[10px] tracking-[0.2em] text-foreground/25 font-extralight mt-6">
              6,000+ aircraft worldwide • 24/7 global coverage • Optimized pricing through full market access
            </p>
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

            <div className="pt-2 pb-1">
              <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 font-light">Flight Details</p>
              <div className="mt-3 h-px bg-border/20" />
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

            <p className="text-[10px] text-foreground/25 font-extralight leading-[1.8] text-center">
              Our team reviews every request manually to secure the most suitable aircraft, routing, and pricing based on your requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={loading} className="flex-1 py-6 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
                <FileText className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Request ACMI Proposal"}
              </Button>
              <a href="/#cta" className="flex-1 inline-flex items-center justify-center py-6 border border-primary/20 rounded-md text-primary/70 text-[11px] tracking-[0.25em] uppercase font-medium hover:border-primary/40 hover:text-primary transition-all duration-500">
                Speak to an Aviation Advisor
              </a>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Why Clients Choose Us */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-8 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">The Difference</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Why Clients Choose Universal Jets</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
              We don't sell aircraft. We give you access to 7,000+ vetted aircraft worldwide — and find the best option for every mission.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { title: "Full Market Access", desc: "Not limited to one fleet — we search the entire global market for the best aircraft." },
              { title: "Better Pricing", desc: "Better pricing through real-time sourcing, positioning optimization, and empty leg matching." },
              { title: "Rapid Response", desc: "Fast response for urgent missions — aircraft on station within days, not weeks." },
              { title: "Proven Experience", desc: "Experience across corporate, VIP, and government travel — from routine charters to complex operations." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex gap-5 p-5 rounded-lg border border-border/20 bg-card/20 backdrop-blur-sm group hover:border-primary/15 transition-all duration-500"
              >
                <div className="w-1 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 flex-shrink-0" />
                <div>
                  <h3 className="font-display text-[14px] font-medium text-foreground mb-2 group-hover:text-primary/80 transition-colors duration-500">{item.title}</h3>
                  <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center text-[11px] text-foreground/25 font-extralight mt-12 italic"
          >
            Every request is handled by an experienced aviation advisor — not an automated system.
          </motion.p>
        </div>
      </section>

      {/* Jet Card Membership */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">For clients who fly without limits</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Guaranteed Access. Fixed Rates. Total Control.</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto mb-2">
              Secure access to private aviation with guaranteed availability, transparent pricing, and priority service.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto mb-4">
              Designed for frequent flyers, corporate executives, and UHNW individuals who value consistency, priority, and transparency.
            </p>
            <p className="text-[10px] tracking-[0.2em] text-foreground/25 font-extralight">
              Priority access • Fixed hourly rates • No ownership commitment
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              "Unlimited confirmed charter requests",
              "Priority aircraft access worldwide",
              "24-hour guaranteed availability",
              "Dedicated personal aviation manager",
              "Private concierge & VIP handling",
              "No repositioning or hidden costs",
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/20 bg-card/20 backdrop-blur-sm"
              >
                <ArrowRight className="w-4 h-4 text-primary/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-[12px] text-foreground/50 font-light">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="text-center">
            <a href="/jet-card" className="inline-block px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
              Request Jet Card Details
            </a>
            <p className="text-[10px] tracking-[0.2em] text-foreground/25 font-extralight mt-5">Programs starting from $150,000</p>
            <p className="text-[11px] text-foreground/20 font-extralight mt-3 italic">Lock your hourly rate. Avoid market fluctuations. Fly on your terms.</p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/20 font-extralight mt-5">Limited availability per region — acceptance subject to client profile.</p>
            <p className="text-[11px] text-foreground/25 font-extralight mt-4 leading-[1.8]">Unlike operators, your jet card is not tied to one fleet — we source the best aircraft globally for every mission.</p>
            <p className="text-[11px] text-primary/40 font-light mt-4 italic">This is not a membership. It's a smarter way to fly private.</p>
          </motion.div>
        </div>
      </section>

      {/* Broker vs Operator */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-8 relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Broker vs Operator</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Why access beats ownership.</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-14"
          >
            <p className="text-[13px] text-foreground/40 font-extralight leading-[2.2] italic">
              Operators sell their aircraft.<br />
              <span className="text-primary/60 font-light not-italic">We source the best aircraft for your mission.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="p-7 rounded-xl border border-border/20 bg-card/20 backdrop-blur-sm"
            >
              <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/30 font-light mb-5">Direct Operator</p>
              <div className="space-y-3">
                {[
                  "Limited to their own fleet",
                  "Fixed pricing — no market comparison",
                  "Availability depends on their aircraft",
                  "May not serve all routes or aircraft types",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-foreground/20 text-[11px] mt-0.5">✕</span>
                    <span className="text-[12px] text-foreground/35 font-extralight leading-[1.8]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="p-7 rounded-xl border border-primary/15 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm"
            >
              <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 font-light mb-5">Universal Jets Broker</p>
              <div className="space-y-3">
                {[
                  "Access to 7,000+ aircraft globally",
                  "Market-optimized pricing every time",
                  "Guaranteed availability — even peak demand",
                  "Any aircraft, any route, any mission",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-primary/50 text-[11px] mt-0.5">✓</span>
                    <span className="text-[12px] text-foreground/50 font-light leading-[1.8]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-14 italic"
          >
            We don't sell aircraft. We represent your best interest.
          </motion.p>
        </div>
      </section>

      {/* How Pricing Works */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Pricing Intelligence</p>
            <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">How Private Jet Pricing Works</h2>
            <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto mb-2">
              More than just hourly rates.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto">
              Private jet pricing is influenced by multiple factors — not just flight time.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { title: "Aircraft Positioning", desc: "Where the aircraft starts and ends determines a significant portion of the cost. We optimize routing to reduce empty repositioning." },
              { title: "Aircraft Category & Availability", desc: "Light, midsize, heavy, or VIP airliner — pricing varies by type, demand, and real-time availability across operators." },
              { title: "Seasonal & Event Demand", desc: "Peak periods like Hajj, F1, and holiday seasons drive prices up. Early planning and broker access unlock better rates." },
              { title: "Empty Leg Opportunities", desc: "One-way repositioning flights at up to 75% lower cost. We actively match clients to available empty legs." },
              { title: "Route Complexity", desc: "Overflight permits, fuel stops, landing fees, and ground handling all factor in. We handle the full cost structure transparently." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex gap-5 p-5 rounded-lg border border-border/20 bg-card/20 backdrop-blur-sm group hover:border-primary/15 transition-all duration-500"
              >
                <div className="w-1 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 flex-shrink-0" />
                <div>
                  <h3 className="font-display text-[14px] font-medium text-foreground mb-2 group-hover:text-primary/80 transition-colors duration-500">{item.title}</h3>
                  <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mt-14 mb-6 max-w-md mx-auto"
          >
            <p className="text-[12px] text-foreground/40 font-extralight leading-[2] italic mb-1">
              A 2-hour flight does not always equal 2 hours of cost.
            </p>
            <p className="text-[11px] text-foreground/30 font-extralight leading-[2]">
              Positioning and operational requirements are often the deciding factors.
            </p>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.8 }}
            className="text-center text-[11px] text-foreground/30 font-extralight leading-[2] max-w-md mx-auto mb-6"
          >
            Empty legs are one-way repositioning flights that can offer up to 75% savings — depending on timing and flexibility.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight italic"
          >
            Transparent pricing. No hidden fees. Market-driven value.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }} className="text-center mt-10">
            <a href="#acmi-form" className="inline-block px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
              Request a Flight Estimate
            </a>
          </motion.div>

          <p className="text-center text-[10px] tracking-[0.2em] text-foreground/25 font-extralight mt-6">
            6,000+ aircraft • 40,000 airports • 24/7 global coverage
          </p>
        </div>
      </section>

      {/* Immediate Assistance CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center p-10 md:p-14 rounded-xl border border-primary/15 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-md"
          >
            <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4">Need Immediate Assistance?</h2>
            <p className="text-[12px] text-foreground/35 font-extralight leading-[2] mb-2">
              Speak directly with an aviation advisor for urgent or complex requests.
            </p>
            <p className="text-[11px] text-foreground/25 font-extralight leading-[2] mb-8">
              Access the entire global private jet market — instantly compared, optimized, and secured for your mission.
            </p>
            <a href="/#cta" className="inline-block px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
              Speak to an Advisor
            </a>
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-6">Typical Response Time: Under 30 minutes</p>
            <p className="text-[11px] text-foreground/20 font-extralight mt-3 italic">Tell us your route — we'll handle the rest.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ACMILeasingPage;
