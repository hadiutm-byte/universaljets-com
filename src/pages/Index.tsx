import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import ServicesSection from "@/components/ServicesSection";
import FleetSection from "@/components/FleetSection";
import WhySection from "@/components/WhySection";
import EmptyLegsSection from "@/components/EmptyLegsSection";
import ConciergeSection from "@/components/ConciergeSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <TrustStrip />
    <ServicesSection />
    <FleetSection />
    <WhySection />
    <EmptyLegsSection />
    <ConciergeSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
