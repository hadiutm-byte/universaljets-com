import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Hotel, Car, Gem, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { icon: Hotel, title: "Luxury Hotels", desc: "Connect your property with our global UHNW clientele" },
  { icon: Car, title: "Premium Ground Transport", desc: "Offer chauffeur and rental services to private jet travelers" },
  { icon: Gem, title: "Luxury Brands", desc: "Position your brand within an ultra-premium aviation ecosystem" },
];

const inputClass =
  "w-full bg-secondary/30 backdrop-blur-sm rounded-sm px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10";

const PartnerPage = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          departure: form.company,
          destination: "Partnership Inquiry",
          source: "partner_inquiry",
        },
      });
      setSubmitted(true);
      toast.success("Partnership inquiry received.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 opacity-[0.012] pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
      <div className="relative z-[2]">
        <Navbar />

        {/* Hero */}
        <section className="pt-40 pb-24 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 30%, hsla(38,52%,50%,0.3) 0%, transparent 70%)" }} />
          <div className="container mx-auto px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 glow-subtle">
                <Handshake className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
              </div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Strategic Partnerships</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
                Partner With <span className="text-gradient-gold italic">Universal Jets</span>
              </h1>
              <p className="text-[13px] md:text-[15px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto">
                Join an exclusive network that connects your luxury brand, hotel, or service directly with our elite clientele.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Value */}
        <section className="pb-24">
          <div className="container mx-auto px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-[12px] text-foreground/35 font-extralight leading-[2.2]">
                We partner with multinational hotels, luxury car rental companies, and premium travel brands worldwide.
                Offer our UHNW members exclusive concessions — upgrades, discounts, and premium experiences — while
                gaining access to one of the most exclusive private aviation networks.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
              {benefits.map((b, i) => (
                <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center py-10 px-6 rounded-xl border border-border/8 bg-card/8 hover:border-primary/15 hover:bg-card/15 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-5 group-hover:glow-subtle transition-all duration-700">
                    <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                  </div>
                  <h3 className="font-display text-[14px] text-foreground mb-2">{b.title}</h3>
                  <p className="text-[11px] text-foreground/30 font-extralight leading-[1.8]">{b.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Partner Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="max-w-lg mx-auto rounded-2xl border border-border/10 bg-card/20 backdrop-blur-md p-8 md:p-10">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg mb-2 text-foreground">Inquiry Received</h3>
                  <p className="text-[11px] text-foreground/35 font-extralight">Our partnerships team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light text-center mb-2">Become a Partner</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">Contact Name *</label>
                      <input required value={form.name} onChange={set("name")} placeholder="Jane Smith" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">Company *</label>
                      <input required value={form.company} onChange={set("company")} placeholder="Four Seasons" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">Email *</label>
                      <input type="email" required value={form.email} onChange={set("email")} placeholder="jane@company.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">Phone</label>
                      <input value={form.phone} onChange={set("phone")} placeholder="+44 20 1234 5678" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">Message</label>
                    <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your brand and the partnership you envision..." rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(38,52%,50%,0.4)] hover:scale-[1.01] disabled:opacity-50">
                    {loading ? "Submitting..." : "Submit Partnership Inquiry"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default PartnerPage;
