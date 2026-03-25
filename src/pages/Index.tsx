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
    {/* Ambient lights */}
    <div className="ambient-light-1" />
    <div className="ambient-light-2" />

    {/* Noise texture */}
    <div className="noise-overlay" />

    {/* Scan line */}
    <div className="scan-line" />

    <div className="relative z-[2]">
      <Navbar />

      {/* Hero — keeps dark overlay on image for contrast */}
      <HeroSection />

      <CinematicSection speed={0.06}>
        <TrustStrip />
      </CinematicSection>

      {/* Light: How It Works */}
      <CinematicSection speed={0.1}>
        <HowItWorksSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Alt bg: Services */}
      <CinematicSection speed={0.08}>
        <div className="section-alt">
          <ServicesSection />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light: Empty Legs & Live Market */}
      <CinematicSection speed={0.05}>
        <EmptyLegsMap />
      </CinematicSection>
      <CinematicSection speed={0.07}>
        <div className="section-alt">
          <LiveMarketSection />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light: Membership */}
      <CinematicSection speed={0.09}>
        <MembershipEnrollment />
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <div className="section-alt">
          <MemberPrivileges />
        </div>
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light: Flight request */}
      <CinematicSection speed={0.08}>
        <CTASection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Alt bg: Jet Card & Referral */}
      <CinematicSection speed={0.07}>
        <div className="section-alt">
          <JetCardSection />
        </div>
      </CinematicSection>
      <CinematicSection speed={0.05}>
        <ReferralSection />
      </CinematicSection>

      <div className="divider-shimmer" />

      {/* Light: Destinations, Events */}
      <CinematicSection speed={0.1}>
        <div className="section-alt">
          <DestinationsSection />
        </div>
      </CinematicSection>
      <CinematicSection speed={0.06}>
        <EventsSection />
      </CinematicSection>

      {/* Alt bg: Safety */}
      <CinematicSection speed={0.08}>
        <div className="section-alt">
          <SafetySection />
        </div>
      </CinematicSection>

      <Footer />
    </div>
  </div>
);

export default Index;
