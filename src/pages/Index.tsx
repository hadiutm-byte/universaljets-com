import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import MembershipEnrollment from "@/components/MembershipEnrollment";
import MemberPrivileges from "@/components/MemberPrivileges";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import CTASection from "@/components/CTASection";
import JetCardSection from "@/components/JetCardSection";
import ReferralSection from "@/components/ReferralSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import SafetySection from "@/components/SafetySection";
import LiveMarketSection from "@/components/LiveMarketSection";
import EmptyLegsMap from "@/components/EmptyLegsMap";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    {/* Ambient lights — living background */}
    <div className="ambient-light-1" />
    <div className="ambient-light-2" />

    {/* Noise texture */}
    <div className="noise-overlay" />

    {/* Scan line — futuristic */}
    <div className="scan-line" />

    <div className="relative z-[2]">
      <Navbar />
      {/* 1. Traffic — capture attention */}
      <HeroSection />

      {/* Shimmer divider */}
      <div className="divider-shimmer" />

      <TrustStrip />
      <HowItWorksSection />

      <div className="divider-shimmer" />

      {/* 2. Services overview */}
      <ServicesSection />

      <div className="divider-shimmer" />

      {/* 3. Empty Legs & Live Market */}
      <EmptyLegsMap />
      <LiveMarketSection />

      <div className="divider-shimmer" />

      {/* 4. Membership conversion */}
      <MembershipEnrollment />
      {/* 5. Member Privileges */}
      <MemberPrivileges />

      <div className="divider-shimmer" />

      {/* 6. WhatsApp — direct advisor contact */}
      <WhatsAppCTA />
      {/* 7. Flight request — first trip */}
      <CTASection />

      <div className="divider-shimmer" />

      {/* 8. Jet Card upsell */}
      <JetCardSection />
      {/* 9. Referral program */}
      <ReferralSection />

      <div className="divider-shimmer" />

      {/* 10. Destinations & Events — engagement */}
      <DestinationsSection />
      <EventsSection />
      {/* 11. Trust & Safety — reinforcement */}
      <SafetySection />
      <Footer />
    </div>
  </div>
);

export default Index;
