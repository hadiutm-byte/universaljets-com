import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Send, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";

const MAPBOX_TOKEN = "pk.eyJ1IjoidW5pdmVyc2Fsam V0cyIsImEiOiJjbTRkOHBveHkwMXF5MmlzZG90bmV0dGVwIn0.bMMAJlmUVjT5gfMVRJaJMA".replace(" ", "");

const inquiryTypes = ["Charter Request", "Jet Card Consultation", "Membership Inquiry", "Corporate Charter", "Partnership", "General Inquiry"];

/* Dubai CommerCity coordinates */
const OFFICE_LNG = 55.3781;
const OFFICE_LAT = 25.1850;

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const ContactPage = () => {
  const geo = useUserGeolocation();
  const [form, setForm] = useState({ name: "", email: "", countryCode: "+971", phone: "", inquiry: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const resolvedCode = resolveCountryCode(geo.countryCode);
  useEffect(() => {
    if (form.countryCode === "+971" && resolvedCode !== "+971") {
      setForm((p) => p.countryCode === "+971" ? { ...p, countryCode: resolvedCode } : p);
    }
  }, [resolvedCode]);

  /* Mapbox */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [OFFICE_LNG, OFFICE_LAT],
      zoom: 14,
      attributionControl: false,
      interactive: true,
    });

    map.on("load", () => {
      /* Gold pin marker */
      const el = document.createElement("div");
      el.innerHTML = `<div style="width:40px;height:40px;border-radius:50%;background:hsl(43,85%,58%);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px hsla(43,85%,58%,0.4)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(220,10%,8%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
      new mapboxgl.Marker({ element: el })
        .setLngLat([OFFICE_LNG, OFFICE_LAT])
        .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
          `<div style="padding:12px 16px;font-family:Montserrat,sans-serif"><p style="font-weight:600;font-size:13px;margin:0 0 4px">Universal Jets</p><p style="font-size:11px;color:#888;margin:0">Dubai CommerCity, UAE</p></div>`
        ))
        .addTo(map);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

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
      toast.error("Unable to submit. Please try again or contact us directly.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Contact Universal Jets — 24/7 Private Aviation" description="Contact Universal Jets for private jet charter, jet cards, membership inquiries. Available 24/7 via phone, email, and WhatsApp." path="/contact" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <Navbar />

      {/* ═══ Apple-style Hero — clean, minimal, centered ═══ */}
      <section className="pt-36 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Get in touch.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto"
          >
            Our aviation advisors are available 24/7. Tell us what you need and we'll take it from there.
          </motion.p>
        </div>
      </section>

      {/* ═══ Contact Cards — Apple-style grid ═══ */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MessageCircle, title: "WhatsApp", desc: "Tap to chat instantly", href: "https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter.", external: true },
            { icon: Phone, title: "Call Us", desc: "+44 7888 999944", href: "tel:+447888999944", external: false },
            { icon: Mail, title: "Email", desc: "sales@universaljets.com", href: "mailto:sales@universaljets.com", external: false },
            { icon: Clock, title: "Availability", desc: "24 hours, 7 days a week", href: null, external: false },
          ].map((card, i) => (
            <motion.div key={card.title} {...fade} transition={{ delay: i * 0.08, duration: 0.6 }}>
              {card.href ? (
                <a
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="group block rounded-2xl border border-border/30 bg-card/40 p-6 hover:bg-card/70 hover:border-primary/20 transition-all duration-500 h-full"
                >
                  <card.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.3} />
                  <p className="text-foreground font-medium text-[15px] mb-1 group-hover:text-primary transition-colors">{card.title}</p>
                  <p className="text-muted-foreground text-[13px] font-light">{card.desc}</p>
                </a>
              ) : (
                <div className="rounded-2xl border border-border/30 bg-card/40 p-6 h-full">
                  <card.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.3} />
                  <p className="text-foreground font-medium text-[15px] mb-1">{card.title}</p>
                  <p className="text-muted-foreground text-[13px] font-light">{card.desc}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Form Section — clean, spacious ═══ */}
      <section className="py-24 md:py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fade} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Send a request.</h2>
            <p className="text-muted-foreground text-[15px] font-light">We'll respond within the hour.</p>
          </motion.div>

          {!submitted ? (
            <motion.form {...fade} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70 mb-2 font-medium">Full Name <span className="text-primary">*</span></label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} placeholder="Your full name"
                    className="w-full rounded-xl bg-card/50 border border-border/30 px-4 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/30 font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70 mb-2 font-medium">Email <span className="text-primary">*</span></label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={255} placeholder="you@example.com"
                    className="w-full rounded-xl bg-card/50 border border-border/30 px-4 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/30 font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <PhoneWithCountryCode phone={form.phone} onPhoneChange={(v) => update("phone", v)} countryCode={form.countryCode} onCountryCodeChange={(v) => update("countryCode", v)} />
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70 mb-2 font-medium">Inquiry Type</label>
                  <select value={form.inquiry} onChange={(e) => update("inquiry", e.target.value)}
                    className="w-full rounded-xl bg-card/50 border border-border/30 px-4 py-4 text-[15px] text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                    <option value="">Select...</option>
                    {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70 mb-2 font-medium">Message <span className="text-primary">*</span></label>
                <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} maxLength={2000} placeholder="Tell us about your requirements..."
                  className="w-full rounded-xl bg-card/50 border border-border/30 px-4 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/30 font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-border/40 accent-primary cursor-pointer" />
                <span className="text-[12px] text-muted-foreground/60 font-light leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary/70 hover:text-primary underline underline-offset-2">Terms</Link>{" "}and{" "}
                  <Link to="/privacy" className="text-primary/70 hover:text-primary underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>

              <button type="submit" disabled={!canSubmit || loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-4 text-[13px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    Submit Request
                  </>
                )}
              </button>

              <p className="text-[10px] text-muted-foreground/30 text-center font-light">
                Your information is encrypted and never shared with third parties.
              </p>
            </motion.form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Send className="w-7 h-7 text-primary" strokeWidth={1.3} />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Thank you.</h3>
              <p className="text-muted-foreground text-[15px] font-light max-w-sm mx-auto">
                A Universal Jets advisor will contact you shortly to discuss your requirements.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ Map — full-width, immersive ═══ */}
      <section className="relative">
        <div className="px-6 pb-6 max-w-6xl mx-auto">
          <motion.div {...fade} className="text-center mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary/60 font-medium mb-3">Our Office</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">Dubai CommerCity</h2>
            <p className="text-muted-foreground text-[13px] font-light">Dubai Integrated Economic Zones Authority (DIEZ)</p>
          </motion.div>
        </div>
        <div ref={mapContainer} className="w-full h-[450px] md:h-[550px]" />

        {/* Office info overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-4 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/30 px-6 py-4 shadow-[0_8px_40px_hsla(0,0%,0%,0.5)]">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] text-foreground font-medium">Universal Jets Aviation Brokerage FZCO</p>
              <p className="text-[11px] text-muted-foreground font-light">DIEZ License No. 50370 · DCAA License No. 3342665</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Legal footer strip ═══ */}
      <section className="py-14 px-6 border-t border-border/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] text-muted-foreground/40 font-light leading-[2] mb-5">
            Universal Jets Aviation Brokerage FZCO is a licensed aviation brokerage registered in Dubai, UAE under DIEZ. The company operates as a broker and does not operate aircraft.
          </p>
          <div className="flex items-center justify-center gap-6 text-[11px]">
            <Link to="/terms" className="text-primary/60 hover:text-primary transition-colors tracking-wide uppercase font-medium">Terms</Link>
            <span className="text-border">·</span>
            <Link to="/privacy" className="text-primary/60 hover:text-primary transition-colors tracking-wide uppercase font-medium">Privacy</Link>
            <span className="text-border">·</span>
            <Link to="/cookies" className="text-primary/60 hover:text-primary transition-colors tracking-wide uppercase font-medium">Cookies</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
