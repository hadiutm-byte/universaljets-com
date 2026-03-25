import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";

const CTASection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", departure: "", destination: "", date: "", returnDate: "", passengers: "", aircraft: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.departure || !form.destination) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("crm-capture", { body: form });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
      toast.success("Your flight request has been received.");
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-secondary/60 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-primary/50 mb-1.5 block font-light";

  return (
    <section id="cta" className="section-padding">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl py-20 md:py-28 px-8 md:px-16 text-center glow-subtle relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-8 font-light">Start Your Journey</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-4 max-w-2xl mx-auto leading-tight text-foreground">
            Your Journey Starts
            <br />
            <span className="text-gradient-gold italic font-medium">Here</span>
          </h2>
          <p className="text-[13px] text-foreground/40 font-extralight max-w-md mx-auto mb-4 leading-[2]">
            Our team analyzes the entire market in real-time to secure the best aircraft and pricing.
          </p>
          <p className="text-[11px] text-foreground/25 font-extralight max-w-sm mx-auto mb-12 leading-[2]">
            Personalised quote within minutes. Available 24/7.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto py-12"
            >
              <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl mb-3">Request Received</h3>
              <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">
                Our team will be in touch within minutes. Thank you for choosing Universal Jets.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" required className={inputClass} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+44 20 1234 5678" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>From *</label>
                  <input value={form.departure} onChange={e => setForm(p => ({ ...p, departure: e.target.value }))} placeholder="London" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>To *</label>
                  <input value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} placeholder="Dubai" required className={inputClass} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Departure Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Return Date</label>
                  <input type="date" value={form.returnDate} onChange={e => setForm(p => ({ ...p, returnDate: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className={labelClass}>Passengers</label>
                  <input type="number" min={1} max={50} value={form.passengers} onChange={e => setForm(p => ({ ...p, passengers: e.target.value }))} placeholder="4" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Aircraft Preference</label>
                  <input value={form.aircraft} onChange={e => setForm(p => ({ ...p, aircraft: e.target.value }))} placeholder="e.g. Midsize, Heavy" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <input value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. €15,000 – €25,000" className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-14 py-4 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Request a Flight"}
                </button>
                <a
                  href="mailto:charter@universaljets.com"
                  className="inline-flex items-center gap-2 px-10 py-4 luxury-border text-foreground/50 hover:text-foreground/80 text-[9px] tracking-[0.25em] uppercase font-light rounded-sm transition-all duration-500 luxury-border-hover"
                >
                  Speak to an Advisor <ArrowRight size={10} />
                </a>
              </div>
            </form>
          )}

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
