import { useState, lazy, Suspense } from "react";
import SEOHead from "@/components/SEOHead";
import JsonLd, { organizationSchema, localBusinessSchema } from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import MembershipBanner from "@/components/MembershipBanner";
import AuthModal from "@/components/AuthModal";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import TrustStrip from "@/components/TrustStrip";
import CharterSolutionsSection from "@/components/CharterSolutionsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import StickyFloatingCTA from "@/components/StickyFloatingCTA";
import ErrorBoundary from "@/components/ErrorBoundary";
import LazySection from "@/components/LazySection";

// Lazy-load heavy below-fold sections
const EmptyLegsMap = lazy(() => import("@/components/EmptyLegsMap"));
const MembershipHero = lazy(() => import("@/components/MembershipHero"));
const JetCardSection = lazy(() => import("@/components/JetCardSection"));
const BeyondTheFlightSection = lazy(() => import("@/components/BeyondTheFlightSection"));
const EventsSection = lazy(() => import("@/components/EventsSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));
const FinalCTASection = lazy(() => import("@/components/FinalCTASection"));
const SEOContentSection = lazy(() => import("@/components/SEOContentSection"));

/** Wrap a section so if it crashes, only that section shows a fallback — not the whole page. */
const SectionGuard = ({ children, name }: { children: React.ReactNode; name: string }) => (
  <ErrorBoundary
    fallback={
      <div className="py-16 text-center">
        <p className="text-[12px] text-muted-foreground font-light">
          This section couldn't load. Please refresh or try again later.
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <SEOHead
        title="Private Jet Charter — Fly Smarter. Fly Private"
        description="Access the global private jet market with Universal Jets. On-demand charter, empty legs, and 24/7 concierge. 18+ years of private aviation excellence."
        path="/"
      />
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />

      <div className="relative">
        <MembershipBanner onRequestInvitation={() => setAuthOpen(true)} />
        <Navbar />

        {/* 1. Hero */}
        <main id="main-content">
        <HeroSection />

        {/* 2. Search */}
        <SectionGuard name="search">
          <SearchSection />
        </SectionGuard>

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
        <SectionGuard name="empty-legs">
          <div className="section-white">
            <EmptyLegsMap />
          </div>
        </SectionGuard>

        {/* 7. Membership Hero — DARK CINEMATIC */}
        <MembershipHero
          onRequestInvitation={() => setAuthOpen(true)}
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

        {/* 10. Events / Experiences */}
        <SectionGuard name="events">
          <div className="section-white">
            <EventsSection />
          </div>
        </SectionGuard>

        <div className="divider-shimmer" />

        {/* 10. Partners */}
        <div className="section-white">
          <PartnersSection />
        </div>

        {/* 11. SEO Content — keyword-rich text for Google */}
        <SEOContentSection />

        {/* 12. Final CTA — DARK */}
        <div className="section-dark">
          <FinalCTASection />
        </div>
        </main>

        <Footer />
      </div>

      <StickyFloatingCTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;
