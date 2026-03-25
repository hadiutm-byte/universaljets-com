import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Plane, Clock, Globe, MapPin, Users } from "lucide-react";

const trustSignals = [
  { icon: Plane, value: "6,000+", label: "Aircraft" },
  { icon: MapPin, value: "40,000", label: "Airports" },
  { icon: Globe, value: "24/7", label: "Global Coverage" },
  { icon: Clock, value: "<30 min", label: "Response Time" },
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
    "w-full bg-secondary/30 backdrop-blur-sm rounded-lg px-4 py-3.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all duration-300 border border-border/10 hover:border-primary/15";
  const labelClass = "text-[9px] tracking-[0.25em] uppercase text-primary/45 mb-1.5 block font-light";

  return (
    <section id="cta" className="py-24 md:py-36 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,3.5%)] to-background pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, hsla(38,52%,50%,0.15) 0%, transparent 60%)" }} />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-6"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-8 font-light">Start Your Journey</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-5 leading-tight">
              Request Your <span className="text-gradient-gold italic font-medium">Flight</span>
            </h2>
            <p className="text-[13px] md:text-[15px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto">
              Access the entire global private jet market — instantly compared, optimized, and secured for your mission.
            </p>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14 max-w-2xl mx-auto"
          >
            {trustSignals.map((s, i) => (
              <div key={i} className="text-center py-4 rounded-lg border border-border/5 bg-card/10">
                <s.icon className="w-4 h-4 text-primary/40 mx-auto mb-2.5" strokeWidth={1.5} />
                <p className="text-[16px] md:text-[18px] font-display font-semibold text-foreground/80 mb-0.5">{s.value}</p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 font-light">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Micro copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center text-[11px] text-foreground/30 font-extralight tracking-wide mb-8"
          >
            Tell us your route — we'll handle the rest.
          </motion.p>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="rounded-2xl border border-primary/8 bg-gradient-to-br from-card/25 to-card/10 backdrop-blur-md p-8 md:p-12"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl mb-3 text-foreground">Request Received</h3>
                <p className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-sm mx-auto mb-2">
                  Our aviation advisors are sourcing the best options now.
                </p>
                <p className="text-[11px] text-primary/40 font-light">
                  Expect a personalised quote within minutes.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Route */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-4">Route</p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>From *</label>
                      <input value={form.departure} onChange={set("departure")} placeholder="City or airport" required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>To *</label>
                      <input value={form.destination} onChange={set("destination")} placeholder="City or airport" required className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Trip details */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-4">Trip Details</p>
                  <div className="grid md:grid-cols-4 gap-5">
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
                      <label className={labelClass}>Aircraft Preference</label>
                      <select value={form.aircraft} onChange={set("aircraft")} className={inputClass}>
                        <option value="">No preference</option>
                        <option value="Light Jet">Light Jet</option>
                        <option value="Midsize Jet">Midsize Jet</option>
                        <option value="Super Midsize">Super Midsize</option>
                        <option value="Heavy Jet">Heavy Jet</option>
                        <option value="Ultra Long Range">Ultra Long Range</option>
                        <option value="VIP Airliner">VIP Airliner</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className={labelClass}>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Catering, ground transport, special requirements..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Contact */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-4">Contact</p>
                  <div className="grid md:grid-cols-3 gap-5">
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
                </div>

                {/* Submit */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-16 py-4.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Get My Aircraft Options"}
                  </button>
                  <p className="text-[10px] text-foreground/18 font-extralight mt-2 tracking-wide">
                    Handled by experienced aviation advisors — not automated systems.
                  </p>
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
