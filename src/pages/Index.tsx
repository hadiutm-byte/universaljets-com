import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import JsonLd, { organizationSchema, localBusinessSchema } from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import MembershipBanner from "@/components/MembershipBanner";
import AuthModal from "@/components/AuthModal";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import TrustStrip from "@/components/TrustStrip";
import CharterSolutionsSection from "@/components/CharterSolutionsSection";
import BeyondTheFlightSection from "@/components/BeyondTheFlightSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import EmptyLegsMap from "@/components/EmptyLegsMap";
import MembershipHero from "@/components/MembershipHero";
import JetCardSection from "@/components/JetCardSection";
import PartnersSection from "@/components/PartnersSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import StickyFloatingCTA from "@/components/StickyFloatingCTA";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);

  const openRicky = () => document.dispatchEvent(new CustomEvent("open-ricky"));

  return (
    <div className="min-h-screen bg-background relative">
      <div className="noise-overlay" />

      <div className="relative z-[2]">
        <MembershipBanner onRequestInvitation={() => setAuthOpen(true)} />
        <Navbar />

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Search */}
        <SearchSection />

        {/* 3. Trust Strip */}
        <TrustStrip />

        {/* 4. Charter Solutions */}
        <div className="section-white">
          <CharterSolutionsSection />
        </div>

        <div className="divider-shimmer" />

        {/* 5. How It Works — CHARCOAL */}
        <div className="section-charcoal">
          <HowItWorksSection />
        </div>

        <div className="divider-shimmer" />

        {/* 6. Empty Legs */}
        <div className="section-white">
          <EmptyLegsMap />
        </div>

        {/* 7. Membership Hero — DARK CINEMATIC */}
        <MembershipHero
          onRequestInvitation={() => setAuthOpen(true)}
          onSpeakToAdvisor={openRicky}
        />

        {/* 8. Jet Card — CHARCOAL */}
        <div className="section-charcoal">
          <JetCardSection />
        </div>

        <div className="divider-shimmer" />

        {/* 9. Beyond The Flight */}
        <div className="section-light">
          <BeyondTheFlightSection />
        </div>

        <div className="divider-shimmer" />

        {/* 10. Partners */}
        <div className="section-white">
          <PartnersSection />
        </div>

        {/* 11. Final CTA — DARK */}
        <div className="section-dark">
          <FinalCTASection />
        </div>

        <Footer />
      </div>

      <StickyFloatingCTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;
