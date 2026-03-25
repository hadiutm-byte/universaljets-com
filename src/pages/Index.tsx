import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import TrustStrip from "@/components/TrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import EmptyLegsMap from "@/components/EmptyLegsMap";
import MembershipEnrollment from "@/components/MembershipEnrollment";
import JetCardSection from "@/components/JetCardSection";
import PartnersSection from "@/components/PartnersSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    <div className="noise-overlay" />

    <div className="relative z-[2]">
      <Navbar />

      {/* 1. Hero — white gradient */}
      <HeroSection />

      {/* 2. Search — floats over transition */}
      <SearchSection />

      {/* 3. How It Works — white */}
      <div className="section-white">
        <HowItWorksSection />
      </div>

      <div className="divider-shimmer" />

      {/* 4. Services — light gray */}
      <div className="section-light">
        <ServicesSection />
      </div>

      <div className="divider-shimmer" />

      {/* 5. Empty Legs — white */}
      <div className="section-white">
        <EmptyLegsMap />
      </div>

      <div className="divider-shimmer" />

      {/* 6. Membership — light gray */}
      <div className="section-light">
        <MembershipEnrollment />
      </div>

      <div className="divider-shimmer" />

      {/* 7. Jet Card — white */}
      <div className="section-white">
        <JetCardSection />
      </div>

      <div className="divider-shimmer" />

      {/* 8. Partners — light gray */}
      <div className="section-light">
        <PartnersSection />
      </div>

      {/* 9. Trust Strip */}
      <TrustStrip />

      {/* 10. Final CTA — DARK charcoal for contrast */}
      <div className="section-dark">
        <FinalCTASection />
      </div>

      {/* Footer — dark */}
      <Footer />
    </div>
  </div>
);

export default Index;