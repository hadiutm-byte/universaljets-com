import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, FileCheck, Phone, Mail, Clock, Send, Shield, Globe, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeReveal } from "@/components/ui/ScrollEffects";

const inquiryTypes = ["Charter", "Jet Card", "Partnership", "General Inquiry"];

const inputClass =
  "w-full bg-card rounded-xl px-4 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border transition-all duration-300";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", inquiry: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          departure: form.inquiry || "General Inquiry",
          destination: "Contact Form",
          source: "contact_page",
          notes: form.message.trim(),
        },
      });
      setSubmitted(true);
      toast.success("Your request has been submitted.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="noise-overlay" />
      <div className="relative z-[2]">
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16 text-center" style={{ background: "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,96%) 100%)" }}>
          <FadeReveal>
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-5">
              Contact <span className="text-gradient-gold italic">Us</span>
            </h1>
            <p className="text-[16px] text-muted-foreground font-light leading-[1.9] max-w-lg mx-auto">
              Available 24/7 for urgent charter requests.
            </p>
          </FadeReveal>
        </section>

        {/* Main content */}
        <section className="section-white">
          <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">

              {/* LEFT — Office & Contact */}
              <div className="lg:col-span-2 space-y-10">
                <FadeReveal>
                  {/* Office */}
                  <div className="space-y-6">
                    <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">Our Office</p>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.3} />
                      <div>
                        <p className="text-[15px] text-foreground font-medium leading-[1.8]">
                          Universal Jets Aviation Brokerage FZCO
                        </p>
                        <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">
                          Dubai Integrated Economic Zones Authority (DIEZ)<br />
                          Dubai, United Arab Emirates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.3} />
                      <div className="space-y-1">
                        <p className="text-[13px] text-foreground/80 font-light">
                          <span className="font-medium">DIEZ</span> License No. 50370
                        </p>
                        <p className="text-[13px] text-foreground/80 font-light">
                          <span className="font-medium">DCAA</span> License No. 3342665
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeReveal>

                <div className="h-px bg-border" />

                <FadeReveal delay={0.1}>
                  {/* Contact methods */}
                  <div className="space-y-6">
                    <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">Reach Us Directly</p>
                    
                    <a href="mailto:sales@universaljets.com" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary/30 transition-colors">
                        <Mail className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      </div>
                      <div>
                        <p className="text-[14px] text-foreground font-medium group-hover:text-primary transition-colors">sales@universaljets.com</p>
                        <p className="text-[11px] text-muted-foreground font-light">Sales & Charter Inquiries</p>
                      </div>
                    </a>

                    <a href="mailto:info@universaljets.com" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary/30 transition-colors">
                        <Mail className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      </div>
                      <div>
                        <p className="text-[14px] text-foreground font-medium group-hover:text-primary transition-colors">info@universaljets.com</p>
                        <p className="text-[11px] text-muted-foreground font-light">General Inquiries</p>
                      </div>
                    </a>

                    <a href="mailto:hr@universaljets.com" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary/30 transition-colors">
                        <Mail className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      </div>
                      <div>
                        <p className="text-[14px] text-foreground font-medium group-hover:text-primary transition-colors">hr@universaljets.com</p>
                        <p className="text-[11px] text-muted-foreground font-light">Careers & Applications</p>
                      </div>
                    </a>

                    <a href="https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary/30 transition-colors">
                        <MessageCircle className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      </div>
                      <div>
                        <p className="text-[14px] text-foreground font-medium group-hover:text-primary transition-colors">+44 7888 999944</p>
                        <p className="text-[11px] text-muted-foreground font-light">WhatsApp — Tap to chat</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card">
                        <Clock className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      </div>
                      <div>
                        <p className="text-[14px] text-foreground font-medium">24/7 Availability</p>
                        <p className="text-[11px] text-muted-foreground font-light">We never close</p>
                      </div>
                    </div>
                  </div>
                </FadeReveal>

                <div className="h-px bg-border" />

                <FadeReveal delay={0.2}>
                  {/* Trust badges */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      <span className="text-[11px] text-muted-foreground font-light">ARGUS Registered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" strokeWidth={1.3} />
                      <span className="text-[11px] text-muted-foreground font-light">WYVERN Certified</span>
                    </div>
                  </div>
                </FadeReveal>
              </div>

              {/* RIGHT — Form */}
              <div className="lg:col-span-3">
                <FadeReveal delay={0.15}>
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 md:p-10 space-y-6 shadow-sm">
                      <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Send a Request</p>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Full Name *</label>
                          <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="Your full name" maxLength={100} />
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Email *</label>
                          <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="you@example.com" maxLength={255} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Phone / WhatsApp</label>
                          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+971 50 000 0000" maxLength={20} />
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Inquiry Type</label>
                          <select value={form.inquiry} onChange={(e) => update("inquiry", e.target.value)} className={inputClass + " appearance-none"}>
                            <option value="">Select...</option>
                            {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Message *</label>
                        <textarea required value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} className={inputClass + " resize-none"} placeholder="Tell us about your requirements..." maxLength={2000} />
                      </div>

                      <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(38,52%,50%,0.4)] hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" strokeWidth={1.3} />
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>

                      <p className="text-[11px] text-muted-foreground text-center font-light">
                        Your information is kept strictly confidential and used only to process your request.
                      </p>
                    </form>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Send className="w-6 h-6 text-primary" strokeWidth={1.3} />
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-3">Thank You</h3>
                      <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-md mx-auto">
                        A Universal Jets advisor will contact you shortly to discuss your requirements.
                      </p>
                    </motion.div>
                  )}
                </FadeReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="section-light">
          <div className="container mx-auto px-6 py-20">
            <FadeReveal className="text-center mb-10">
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-4">Location</p>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">Dubai, UAE</h2>
            </FadeReveal>
            <FadeReveal delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 400 }}>
                <iframe
                  title="Universal Jets Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6828090625!2d54.89783796328778!3d25.076022017955997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeReveal>
          </div>
        </section>

        {/* Legal */}
        <section className="section-white">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-[12px] text-muted-foreground font-light leading-[2] mb-6">
                Universal Jets Aviation Brokerage FZCO is a licensed aviation brokerage company registered in Dubai, United Arab Emirates, under Dubai Integrated Economic Zones Authority (DIEZ). The company operates as a broker and does not operate aircraft.
              </p>
              <div className="flex items-center justify-center gap-6 text-[11px]">
                <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors tracking-wide uppercase font-medium">Terms & Conditions</Link>
                <span className="text-border">|</span>
                <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors tracking-wide uppercase font-medium">Privacy Policy</Link>
                <span className="text-border">|</span>
                <Link to="/cookies" className="text-primary hover:text-primary/80 transition-colors tracking-wide uppercase font-medium">Cookies Policy</Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
