import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import MembershipEnrollment from "@/components/MembershipEnrollment";
import MemberPrivileges from "@/components/MemberPrivileges";
import CTASection from "@/components/CTASection";
import JetCardSection from "@/components/JetCardSection";
import ReferralSection from "@/components/ReferralSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import SafetySection from "@/components/SafetySection";
import LiveMarketSection from "@/components/LiveMarketSection";
import EmptyLegsMap from "@/components/EmptyLegsMap";
import Footer from "@/components/Footer";

/* Cinematic section wrapper with parallax depth */
const CinematicSection = ({
  children,
  speed = 0.08,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
};

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

      {/* 1. Hero — immersive entrance (dark section) */}
      <div className="section-dark">
        <HeroSection />
      </div>

      <CinematicSection speed={0.06}>
        <div className="section-dark">
          <TrustStrip />
        </div>
      </CinematicSection>

      {/* Light section: How It Works */}
      <CinematicSection speed={0.1}>
        <HowItWorksSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Dark section: Services */}
      <CinematicSection speed={0.08}>
        <div className="section-dark">
          <ServicesSection />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light section: Empty Legs & Live Market */}
      <CinematicSection speed={0.05}>
        <EmptyLegsMap />
      </CinematicSection>
      <CinematicSection speed={0.07}>
        <LiveMarketSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Dark section: Membership */}
      <CinematicSection speed={0.09}>
        <div className="section-dark">
          <MembershipEnrollment />
        </div>
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <div className="section-dark">
          <MemberPrivileges />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light section: Flight request — conversion */}
      <CinematicSection speed={0.08}>
        <CTASection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Dark section: Jet Card & Referral */}
      <CinematicSection speed={0.07}>
        <div className="section-dark">
          <JetCardSection />
        </div>
      </CinematicSection>
      <CinematicSection speed={0.05}>
        <div className="section-dark">
          <ReferralSection />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light section: Destinations, Events */}
      <CinematicSection speed={0.1}>
        <DestinationsSection />
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <EventsSection />
      </CinematicSection>

      {/* Dark section: Safety */}
      <CinematicSection speed={0.08}>
        <div className="section-dark">
          <SafetySection />
        </div>
      </CinematicSection>

      <Footer />
    </div>
  </div>
);

export default Index;
