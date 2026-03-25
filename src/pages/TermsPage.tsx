import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Terms & <span className="text-gradient-gold italic">Conditions</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[13px] text-foreground/50 font-extralight leading-[2]">
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">1. Agreement</h2>
            <p>By accessing or using the Universal Jets website and services, you agree to be bound by these Terms & Conditions. Universal Jets acts exclusively as an aviation broker and does not operate aircraft directly. All flights are arranged through independently certified operators holding valid Air Operator Certificates (AOC).</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">2. Services</h2>
            <p>Universal Jets provides private aviation brokerage services including charter flight arrangement, jet card programs, empty leg opportunities, and ACMI leasing. All services are subject to aircraft and operator availability. Quotes provided are valid for 48 hours unless otherwise stated.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">3. Booking & Payment</h2>
            <p>Charter bookings require a signed agreement and full payment 72 hours prior to departure unless alternate terms are agreed in writing. Cancellation within 48 hours of departure incurs 100% of the charter cost. Cancellation between 48–168 hours incurs 50% of the charter cost.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">4. Membership</h2>
            <p>The Universal Jets Private Access Network membership is complimentary for qualified applicants. Membership benefits including priority booking, dedicated advisor access, and preferential pricing are subject to availability. Universal Jets reserves the right to accept or decline membership applications at its sole discretion.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">5. Liability</h2>
            <p>Universal Jets acts as an intermediary broker. Liability for flight operations, safety, and service delivery rests with the operating carrier. Universal Jets maintains comprehensive professional indemnity and errors & omissions insurance. Our liability is limited to the brokerage fee paid for the relevant service.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">6. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and software, is the property of Universal Jets and protected by applicable intellectual property laws. Reproduction or redistribution without prior written consent is prohibited.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">7. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">8. Contact</h2>
            <p>For any questions regarding these terms, please contact us at legal@universaljets.com or +44 20 1234 5678.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TermsPage;
