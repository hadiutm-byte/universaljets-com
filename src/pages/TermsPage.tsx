import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const sections = [
  {
    title: "1. Agreement",
    content: "By accessing or using the Universal Jets website and services, you agree to be bound by these Terms & Conditions. Universal Jets Aviation Brokerage FZCO acts exclusively as an aviation broker and does not operate aircraft directly. All flights are arranged through independently certified operators holding valid Air Operator Certificates (AOC).",
  },
  {
    title: "2. Services",
    content: "Universal Jets provides private aviation brokerage services including charter flight arrangement, jet card programs, empty leg opportunities, ACMI leasing, and concierge services. All services are subject to aircraft and operator availability. Quotes provided are indicative and valid for 48 hours unless otherwise stated in writing.",
  },
  {
    title: "3. Booking & Payment",
    content: "Charter bookings require a signed charter agreement and full payment 72 hours prior to departure unless alternate terms are agreed in writing. Cancellation within 48 hours of departure incurs 100% of the charter cost. Cancellation between 48–168 hours incurs 50% of the charter cost. All pricing is subject to aircraft availability, routing, permits, and operational confirmation.",
  },
  {
    title: "4. Membership",
    content: "The Universal Jets Private Access Network membership is offered on a complimentary and invitation-only basis for qualified applicants. Membership benefits — including priority booking, dedicated advisor access, and preferential pricing — are subject to availability. Universal Jets reserves the right to accept, decline, or revoke membership applications and access at its sole discretion.",
  },
  {
    title: "5. Liability",
    content: "Universal Jets acts as an intermediary broker between the client and the operating carrier. Liability for flight operations, safety, passenger welfare, and service delivery rests solely with the operating carrier. Universal Jets maintains comprehensive professional indemnity and errors & omissions insurance. Our liability is limited to the brokerage fee paid for the relevant service.",
  },
  {
    title: "6. Intellectual Property",
    content: "All content on this website, including text, graphics, logos, brand marks, and software, is the property of Universal Jets Aviation Brokerage FZCO and protected by applicable intellectual property laws. Reproduction, redistribution, or commercial use without prior written consent is strictly prohibited.",
  },
  {
    title: "7. Data Protection",
    content: "All personal data collected through our website and services is processed in accordance with our Privacy Policy and applicable data protection legislation, including the UAE Federal Decree-Law No. 45 of 2021. Your information is handled with absolute discretion and is never sold to third parties.",
  },
  {
    title: "8. Governing Law",
    content: "These Terms & Conditions are governed by the laws of the United Arab Emirates. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
  },
  {
    title: "9. Contact",
    content: "For any questions regarding these terms, please contact us at legal@universaljets.com or via our Contact page.",
  },
];

const TermsPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead title="Terms & Conditions — Universal Jets" description="Universal Jets terms and conditions for private aviation brokerage services, charter bookings, jet card programs, and membership." path="/terms" />
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60 mb-5 font-medium text-center">Legal</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Terms & <span className="text-gradient-gold italic">Conditions</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-6">Last updated: March 2026</p>
        <p className="text-[13px] text-muted-foreground font-light text-center mb-16 max-w-lg mx-auto leading-[1.9]">
          These terms govern your use of Universal Jets services. Please read them carefully before using our platform.
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
            <Link to="/privacy" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Privacy Policy</Link>
            <span className="text-foreground/10">|</span>
            <Link to="/cookies" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TermsPage;
