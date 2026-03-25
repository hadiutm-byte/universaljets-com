import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import WhySection from "@/components/WhySection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import JetCardSection from "@/components/JetCardSection";
import EmptyLegsSection from "@/components/EmptyLegsSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import SafetySection from "@/components/SafetySection";
import NewsletterSection from "@/components/NewsletterSection";
import FoundersCircleSection from "@/components/FoundersCircleSection";
import MembershipEnrollment from "@/components/MembershipEnrollment";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    <div className="fixed inset-0 opacity-[0.012] pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="relative z-[2]">
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <WhySection />
      <ServicesSection />
      <JetCardSection />
      <EmptyLegsSection />
      <DestinationsSection />
      <EventsSection />
      <SafetySection />
      <FoundersCircleSection />
      <MembershipEnrollment />
      <NewsletterSection />
      <CTASection />
      <Footer />
    </div>
  </div>
);

export default Index;
