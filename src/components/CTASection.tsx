import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Plane, Clock, Globe, Shield } from "lucide-react";

const trustSignals = [
  { icon: Plane, label: "6,000+ Aircraft" },
  { icon: Globe, label: "24/7 Global Coverage" },
  { icon: Clock, label: "Response Under 30 Min" },
];

const CTASection = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", departure: "", destination: "",
    date: "", returnDate: "", passengers: "", aircraft: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.departure || !form.destination) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.functions.invoke("crm-capture", { body: form });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
      toast.success("Your flight request has been received.");
    }
    setLoading(false);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const inputClass =
    "w-full bg-secondary/40 backdrop-blur-sm rounded-lg px-4 py-3.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all border border-border/15 hover:border-border/30";
  const labelClass = "text-[9px] tracking-[0.25em] uppercase text-primary/50 mb-1.5 block font-light";

  return (
    <section id="cta" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-background pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
              Start Your Journey
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4 leading-tight">
              Request Your <span className="text-gradient-gold italic font-medium">Flight</span>
            </h2>
            <p className="text-[13px] md:text-[14px] text-foreground/45 font-extralight leading-[2] max-w-md mx-auto">
              Access the entire global private jet market — instantly compared and optimized.
            </p>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-14"
          >
            {trustSignals.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <s.icon className="w-4 h-4 text-primary/50" strokeWidth={1.5} />
                <span className="text-[11px] tracking-[0.15em] uppercase text-foreground/35 font-light">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="rounded-2xl border border-primary/10 bg-card/20 backdrop-blur-md p-8 md:p-12"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full border border-primary/25 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl mb-3 text-foreground">Request Received</h3>
                <p className="text-[12px] text-foreground/40 font-extralight leading-[2] max-w-sm mx-auto">
                  Our team is sourcing the best options now. Expect a personalised quote within minutes.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Row 1 — Name, Email, Phone */}
                <div className="grid md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input value={form.name} onChange={set("name")} placeholder="John Smith" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={set("email")} placeholder="john@company.com" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={form.phone} onChange={set("phone")} placeholder="+44 20 1234 5678" className={inputClass} />
                  </div>
                </div>

                {/* Row 2 — From, To */}
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>From *</label>
                    <input value={form.departure} onChange={set("departure")} placeholder="London" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>To *</label>
                    <input value={form.destination} onChange={set("destination")} placeholder="Dubai" required className={inputClass} />
                  </div>
                </div>

                {/* Row 3 — Dates, Passengers, Aircraft */}
                <div className="grid md:grid-cols-4 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Departure Date</label>
                    <input type="date" value={form.date} onChange={set("date")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Return Date</label>
                    <input type="date" value={form.returnDate} onChange={set("returnDate")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Passengers</label>
                    <input type="number" min={1} max={50} value={form.passengers} onChange={set("passengers")} placeholder="4" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Aircraft Type</label>
                    <select value={form.aircraft} onChange={set("aircraft")} className={inputClass}>
                      <option value="">Any</option>
                      <option value="Light Jet">Light Jet</option>
                      <option value="Midsize Jet">Midsize Jet</option>
                      <option value="Super Midsize">Super Midsize</option>
                      <option value="Heavy Jet">Heavy Jet</option>
                      <option value="Ultra Long Range">Ultra Long Range</option>
                      <option value="VIP Airliner">VIP Airliner</option>
                    </select>
                  </div>
                </div>

                {/* Row 4 — Notes */}
                <div className="mb-8">
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Catering preferences, ground transport, any special requirements..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-16 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Get My Aircraft Options"}
                  </button>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3 h-3 text-foreground/15" strokeWidth={1.5} />
                    <span className="text-[10px] text-foreground/20 font-extralight">
                      Typical response time: under 30 minutes
                    </span>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
