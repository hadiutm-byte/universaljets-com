import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, FileCheck, Mail, Clock, Send, Shield, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const inquiryTypes = ["Charter", "Jet Card", "Membership", "Partnership", "General Inquiry"];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

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

  const inputClass =
    "w-full bg-muted/50 border border-foreground/[0.06] rounded-sm px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/30 focus:bg-muted/80 transition-all duration-300 font-light";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/40" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--gold)) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <motion.p {...fadeUp} className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            Get in Touch
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-6" />
          <motion.h1 {...fadeUp} transition={{ delay: 0.15, duration: 0.6 }} className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-5">
            Contact <span className="text-primary italic">Us</span>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.25, duration: 0.5 }} className="text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
            Available 24/7 for urgent charter requests.
            <br />
            Reach us however works best for you.
          </motion.p>
        </div>
      </section>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">

          {/* LEFT — Office & Contact Details */}
          <div className="lg:col-span-2 space-y-10">

            {/* Office */}
            <motion.div {...fadeUp} className="space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium">Our Office</p>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[15px] text-foreground font-medium leading-[1.8]">
                    Universal Jets Aviation Brokerage FZCO
                  </p>
                  <p className="text-sm text-muted-foreground font-light leading-[1.8]">
                    Dubai Integrated Economic Zones Authority (DIEZ)
                    <br />
                    Dubai, United Arab Emirates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4 text-primary" strokeWidth={1.3} />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-foreground/80 font-light">
                    <span className="font-medium">DIEZ</span> License No. 50370
                  </p>
                  <p className="text-[13px] text-foreground/80 font-light">
                    <span className="font-medium">DCAA</span> License No. 3342665
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="h-px bg-foreground/[0.06]" />

            {/* Contact Methods */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-5">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium">Reach Us Directly</p>

              {[
                { href: "mailto:sales@universaljets.com", icon: Mail, label: "sales@universaljets.com", sub: "Charter · Jet Card · Membership" },
                { href: "mailto:info@universaljets.com", icon: Mail, label: "info@universaljets.com", sub: "General Inquiries" },
                { href: "mailto:hr@universaljets.com", icon: Mail, label: "hr@universaljets.com", sub: "Careers & Applications" },
                {
                  href: "https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter.",
                  icon: MessageCircle,
                  label: "+44 7888 999944",
                  sub: "WhatsApp — Tap to chat",
                  external: true,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full border border-foreground/[0.06] flex items-center justify-center bg-muted/30 group-hover:border-primary/20 group-hover:bg-primary/[0.04] transition-all duration-300">
                    <item.icon className="w-4 h-4 text-primary" strokeWidth={1.3} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-light">{item.sub}</p>
                  </div>
                </a>
              ))}

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-foreground/[0.06] flex items-center justify-center bg-muted/30">
                  <Clock className="w-4 h-4 text-primary" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">24/7 Availability</p>
                  <p className="text-[11px] text-muted-foreground font-light">We never close</p>
                </div>
              </div>
            </motion.div>

            <div className="h-px bg-foreground/[0.06]" />

            {/* Trust Badges */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                <span className="text-[11px] text-muted-foreground font-light">ARGUS Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                <span className="text-[11px] text-muted-foreground font-light">WYVERN Certified</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Form */}
          <div className="lg:col-span-3">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="rounded-sm border border-foreground/[0.06] bg-muted/20 p-8 md:p-10 space-y-6">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium mb-2">Send a Request</p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Full Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="Your full name" maxLength={100} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="you@example.com" maxLength={255} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Phone / WhatsApp</label>
                      <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+971 50 000 0000" maxLength={20} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Inquiry Type</label>
                      <select value={form.inquiry} onChange={(e) => update("inquiry", e.target.value)} className={inputClass + " appearance-none"}>
                        <option value="">Select...</option>
                        {inquiryTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Message *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={5}
                      className={inputClass + " resize-none"}
                      placeholder="Tell us about your requirements..."
                      maxLength={2000}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium rounded-sm transition-all duration-300 hover:bg-primary/90 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.3} />
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>

                  <p className="text-[11px] text-muted-foreground/50 text-center font-light">
                    Your information is kept strictly confidential.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-sm border border-foreground/[0.06] bg-muted/20 p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/[0.06] flex items-center justify-center mx-auto mb-6">
                    <Send className="w-6 h-6 text-primary" strokeWidth={1.3} />
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-3">Thank You</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                    A Universal Jets advisor will contact you shortly to discuss your requirements.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ MAP ═══════════ */}
      <section className="py-20 md:py-24 px-6 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium mb-4">Location</p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold">Dubai, UAE</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <div className="rounded-sm overflow-hidden border border-foreground/[0.06]" style={{ height: 400 }}>
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
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LEGAL ═══════════ */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/60 font-light leading-[2] mb-6">
            Universal Jets Aviation Brokerage FZCO is a licensed aviation brokerage company registered in Dubai, United Arab Emirates, under Dubai Integrated Economic Zones Authority (DIEZ). The company operates as a broker and does not operate aircraft.
          </p>
          <div className="flex items-center justify-center gap-6 text-[11px]">
            <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">
              Terms
            </Link>
            <span className="text-foreground/10">|</span>
            <Link to="/privacy" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">
              Privacy
            </Link>
            <span className="text-foreground/10">|</span>
            <Link to="/cookies" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">
              Cookies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
