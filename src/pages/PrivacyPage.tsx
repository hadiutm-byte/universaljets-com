import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Privacy <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[13px] text-foreground/50 font-extralight leading-[2]">
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">1. Data Controller</h2>
            <p>Universal Jets is the data controller for personal information collected through this website and our services. We are committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">2. Information We Collect</h2>
            <p>We collect information you provide directly: name, email address, phone number, travel preferences, and flight requirements. We also collect technical data including IP address, browser type, device information, and usage patterns through cookies and similar technologies.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">3. How We Use Your Data</h2>
            <p>Your data is used to: process flight requests and bookings; manage your membership account; communicate with you about our services; improve our website and services; comply with legal obligations; and, with your consent, send marketing communications about relevant offers and events.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">4. Data Sharing</h2>
            <p>We share your data only with: aircraft operators and service providers necessary to fulfill your bookings; partner hotels and concierge services when you use member benefits; payment processors; and legal authorities when required by law. We never sell your personal data to third parties.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">5. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. Flight booking records are retained for 7 years for regulatory compliance. You may request deletion of your data at any time, subject to our legal obligations.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">6. Your Rights</h2>
            <p>Under UK GDPR, you have the right to: access your personal data; rectify inaccurate data; request erasure; restrict processing; data portability; and object to processing. To exercise these rights, contact us at privacy@universaljets.com.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">7. International Transfers</h2>
            <p>Your data may be transferred to countries outside the UK where our partner operators are based. We ensure appropriate safeguards are in place, including Standard Contractual Clauses, to protect your data during international transfers.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">8. Contact</h2>
            <p>For privacy-related inquiries, contact our Data Protection Officer at privacy@universaljets.com or write to Universal Jets, London, United Kingdom.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default PrivacyPage;
