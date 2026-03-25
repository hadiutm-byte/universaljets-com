import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    {/* Noise texture */}
    <div className="noise-overlay" />

    <div className="relative z-[2]">
      <Navbar />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Search Engine — floating below hero */}
      <SearchSection />

      {/* 3. How It Works */}
      <HowItWorksSection />

      <div className="divider-shimmer" />

      {/* 4. Services */}
      <div className="section-alt">
        <ServicesSection />
      </div>

      <div className="divider-shimmer" />

      {/* 5. Empty Legs */}
      <EmptyLegsMap />

      <div className="divider-shimmer" />

      {/* 6. Membership */}
      <div className="section-alt">
        <MembershipEnrollment />
      </div>

      <div className="divider-shimmer" />

      {/* 7. Jet Card */}
      <JetCardSection />

      <div className="divider-shimmer" />

      {/* 8. Partners */}
      <div className="section-alt">
        <PartnersSection />
      </div>

      {/* 9. Trust Strip */}
      <TrustStrip />

      {/* 10. Final CTA */}
      <FinalCTASection />

      <Footer />
    </div>
  </div>
);

export default Index;
