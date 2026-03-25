import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import WhySection from "@/components/WhySection";
import ServicesSection from "@/components/ServicesSection";
import FleetSection from "@/components/FleetSection";
import EmptyLegsSection from "@/components/EmptyLegsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <TrustStrip />
    <WhySection />
    <ServicesSection />
    <FleetSection />
    <EmptyLegsSection />
    <ExperienceSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
