import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const sections = [
  {
    title: "1. Data Controller",
    content: "Universal Jets Aviation Brokerage FZCO is the data controller for personal information collected through this website and our services. We are committed to protecting your privacy in accordance with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data, the UK General Data Protection Regulation (UK GDPR), and all applicable data protection legislation.",
  },
  {
    title: "2. Information We Collect",
    content: "We collect information you provide directly: name, email address, phone number, nationality, travel preferences, and flight requirements. We also collect technical data including IP address, browser type, device information, and usage patterns through cookies and similar technologies. For membership applicants, we may collect additional professional and financial information relevant to qualification.",
  },
  {
    title: "3. How We Use Your Data",
    content: "Your data is used to: process flight requests and bookings; manage your membership account and travel profile; communicate with you about our services and relevant opportunities; improve our website and service delivery; comply with legal obligations; and, with your explicit consent, send marketing communications about relevant offers, empty legs, and events.",
  },
  {
    title: "4. Data Sharing",
    content: "We share your data only with: aircraft operators and service providers necessary to fulfill your bookings; partner hotels and concierge services when you use member benefits; payment processors; and legal authorities when required by law. We never sell your personal data to third parties. All data sharing is governed by strict confidentiality agreements.",
  },
  {
    title: "5. Data Retention",
    content: "We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. Flight booking records are retained for 7 years for regulatory compliance. Membership records are retained for the duration of your membership plus 5 years. You may request deletion of your data at any time, subject to our legal obligations.",
  },
  {
    title: "6. Your Rights",
    content: "You have the right to: access your personal data; rectify inaccurate data; request erasure; restrict processing; data portability; and object to processing. To exercise these rights, contact us at privacy@universaljets.com. We will respond to your request within 30 days.",
  },
  {
    title: "7. International Transfers",
    content: "Your data may be transferred to countries outside the UAE where our partner operators are based. We ensure appropriate safeguards are in place, including Standard Contractual Clauses and data processing agreements, to protect your data during international transfers.",
  },
  {
    title: "8. Security",
    content: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. All data transmission is encrypted using industry-standard TLS protocols.",
  },
  {
    title: "9. Contact",
    content: "For privacy-related inquiries, contact our Data Protection Officer at privacy@universaljets.com or write to Universal Jets Aviation Brokerage FZCO, Dubai, United Arab Emirates.",
  },
];

const PrivacyPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead title="Privacy Policy — Universal Jets" description="Universal Jets privacy policy covering data collection, processing, and your rights regarding personal information." path="/privacy" />
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60 mb-5 font-medium text-center">Legal</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Privacy <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-6">Last updated: March 2026</p>
        <p className="text-[13px] text-muted-foreground font-light text-center mb-16 max-w-lg mx-auto leading-[1.9]">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>

        <div className="space-y-10 text-[13px] text-foreground/55 font-light leading-[2]">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-medium mb-4">{s.title}</h2>
              <p>{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-foreground/[0.04] text-center">
          <p className="text-[12px] text-muted-foreground/50 font-light mb-4">Related Documents</p>
          <div className="flex items-center justify-center gap-6 text-[11px]">
            <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Terms & Conditions</Link>
            <span className="text-foreground/10">|</span>
            <Link to="/cookies" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default PrivacyPage;
