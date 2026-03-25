import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import MembershipEnrollment from "@/components/MembershipEnrollment";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import CTASection from "@/components/CTASection";
import JetCardSection from "@/components/JetCardSection";
import ReferralSection from "@/components/ReferralSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import SafetySection from "@/components/SafetySection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    <div className="fixed inset-0 opacity-[0.012] pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="relative z-[2]">
      <Navbar />
      {/* 1. Traffic — capture attention */}
      <HeroSection />
      <TrustStrip />
      <HowItWorksSection />
      {/* 2. Services overview */}
      <ServicesSection />
      {/* 3. Membership conversion */}
      <MembershipEnrollment />
      {/* 4. WhatsApp — direct advisor contact */}
      <WhatsAppCTA />
      {/* 5. Flight request — first trip */}
      <CTASection />
      {/* 6. Jet Card upsell */}
      <JetCardSection />
      {/* 7. Referral program */}
      <ReferralSection />
      {/* 8. Destinations & Events — engagement */}
      <DestinationsSection />
      <EventsSection />
      {/* 9. Trust & Safety — reinforcement */}
      <SafetySection />
      <Footer />
    </div>
  </div>
);

export default Index;
