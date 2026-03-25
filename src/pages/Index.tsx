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

      {/* 1. Hero — immersive entrance */}
      <HeroSection />

      <div className="divider-shimmer" />

      <CinematicSection speed={0.06}>
        <TrustStrip />
      </CinematicSection>

      <CinematicSection speed={0.1}>
        <HowItWorksSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 2. Services */}
      <CinematicSection speed={0.08}>
        <ServicesSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 3. Empty Legs & Live Market */}
      <CinematicSection speed={0.05}>
        <EmptyLegsMap />
      </CinematicSection>
      <CinematicSection speed={0.07}>
        <LiveMarketSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 4. Membership */}
      <CinematicSection speed={0.09}>
        <MembershipEnrollment />
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <MemberPrivileges />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 5. Flight request — conversion */}
      <CinematicSection speed={0.08}>
        <CTASection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 6. Jet Card & Referral */}
      <CinematicSection speed={0.07}>
        <JetCardSection />
      </CinematicSection>
      <CinematicSection speed={0.05}>
        <ReferralSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* 7. Destinations, Events, Safety */}
      <CinematicSection speed={0.1}>
        <DestinationsSection />
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <EventsSection />
      </CinematicSection>
      <CinematicSection speed={0.08}>
        <SafetySection />
      </CinematicSection>

      <Footer />
    </div>
  </div>
);

export default Index;
