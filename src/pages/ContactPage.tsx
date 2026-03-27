import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, FileCheck, Mail, Clock, Send, Shield, Globe, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput, PremiumSelect, PremiumTextarea,
  FormSection, LegalConsent, PremiumSubmitButton,
  FormSuccess, ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

const inquiryTypes = ["Charter Request", "Jet Card Consultation", "Membership Inquiry", "Corporate Charter Inquiry", "Partnership Request", "General Inquiry"];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const ContactPage = () => {
  const geo = useUserGeolocation();
  const [form, setForm] = useState({ name: "", email: "", countryCode: "+971", phone: "", inquiry: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const resolvedCode = resolveCountryCode(geo.countryCode);
  if (form.countryCode === "+971" && resolvedCode !== "+971") {
    setForm((p) => p.countryCode === "+971" ? { ...p, countryCode: resolvedCode } : p);
  }

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim() && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: buildFullPhone(form.countryCode, form.phone.trim()) || form.phone.trim(),
          departure: form.inquiry || "General Inquiry",
          destination: "Contact Form",
          source: "contact_page",
          notes: form.message.trim(),
        },
      });
      setSubmitted(true);
      toast.success("Your request has been received.");
    } catch {
      toast.error("We were unable to submit your request. Please try again or contact our team directly.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Contact Universal Jets — 24/7 Private Aviation" description="Contact Universal Jets for private jet charter, jet cards, membership inquiries. Available 24/7 via phone, email, and WhatsApp." path="/contact" />
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/40" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--gold)) 0%, transparent 70%)" }} />
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
            <motion.div {...fadeUp} className="space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium">Our Office</p>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[15px] text-foreground font-medium leading-[1.8]">Universal Jets Aviation Brokerage FZCO</p>
                  <p className="text-sm text-muted-foreground font-light leading-[1.8]">
                    Dubai Integrated Economic Zones Authority (DIEZ)<br />Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4 text-primary" strokeWidth={1.3} />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-foreground/80 font-light"><span className="font-medium">DIEZ</span> License No. 50370</p>
                  <p className="text-[13px] text-foreground/80 font-light"><span className="font-medium">DCAA</span> License No. 3342665</p>
                </div>
              </div>
            </motion.div>

            <div className="h-px bg-foreground/[0.06]" />

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-5">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium">Reach Us Directly</p>
              {[
                { href: "mailto:sales@universaljets.com", icon: Mail, label: "sales@universaljets.com", sub: "Charter · Jet Card · Membership" },
                { href: "mailto:info@universaljets.com", icon: Mail, label: "info@universaljets.com", sub: "General Inquiries" },
                { href: "mailto:hr@universaljets.com", icon: Mail, label: "hr@universaljets.com", sub: "Careers & Applications" },
                { href: "https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter.", icon: MessageCircle, label: "+44 7888 999944", sub: "WhatsApp — Tap to chat", external: true },
              ].map((item) => (
                <a key={item.label} href={item.href} target={(item as any).external ? "_blank" : undefined} rel={(item as any).external ? "noopener noreferrer" : undefined} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-foreground/[0.06] flex items-center justify-center bg-muted/30 group-hover:border-primary/20 group-hover:bg-primary/[0.04] transition-all duration-300">
                    <item.icon className="w-4 h-4 text-primary" strokeWidth={1.3} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors duration-300">{item.label}</p>
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
                <form onSubmit={handleSubmit} className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-8 md:p-10 space-y-6">
                  <FormSection title="Send a Request">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <PremiumInput label="Full Name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" maxLength={100} />
                      <PremiumInput label="Email" required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" maxLength={255} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <PremiumInput label="Phone / WhatsApp" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+971 50 000 0000" maxLength={20} />
                      <PremiumSelect label="Inquiry Type" value={form.inquiry} onChange={(e) => update("inquiry", e.target.value)}>
                        <option value="">Select...</option>
                        {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </PremiumSelect>
                    </div>
                    <PremiumTextarea label="Message" required value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} placeholder="Tell us about your requirements..." maxLength={2000} />
                  </FormSection>

                  <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} />

                  <PremiumSubmitButton loading={loading} disabled={!canSubmit}>
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" strokeWidth={1.3} />
                      Submit Request
                    </span>
                  </PremiumSubmitButton>

                  <ConfidentialityNotice />
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-foreground/[0.06] bg-muted/20 p-12">
                  <FormSuccess
                    icon={Send}
                    title="Thank You"
                    message="A Universal Jets advisor will contact you shortly to discuss your requirements. All inquiries are handled with discretion."
                  />
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
            <div className="rounded-2xl overflow-hidden border border-foreground/[0.06]" style={{ height: 400 }}>
              <iframe title="Universal Jets Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6828090625!2d54.89783796328778!3d25.076022017955997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.7) contrast(1.2)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
            <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Terms</Link>
            <span className="text-foreground/10">|</span>
            <Link to="/privacy" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Privacy</Link>
            <span className="text-foreground/10">|</span>
            <Link to="/cookies" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Cookies</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
