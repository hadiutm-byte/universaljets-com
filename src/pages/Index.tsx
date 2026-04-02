import { useState, lazy, Suspense } from "react";
import SEOHead from "@/components/SEOHead";
import JsonLd, { organizationSchema, localBusinessSchema, websiteSchema, serviceSchema, faqSchema } from "@/components/JsonLd";
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
        title="Private Jet Charter Dubai — On-Demand Flights"
        description="Charter a private jet from Dubai worldwide. On-demand flights, empty legs up to 75% off, jet cards with fixed rates. 18+ years, 7,000+ aircraft. Get an instant quote."
        path="/"
      />
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

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

        {/* 6. Empty Legs — lazy-loaded (Mapbox 456KB) */}
        <LazySection minHeight="600px" rootMargin="400px">
          <SectionGuard name="empty-legs">
            <Suspense fallback={<div className="py-16 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>}>
              <div className="section-white">
                <EmptyLegsMap />
              </div>
            </Suspense>
          </SectionGuard>
        </LazySection>

        {/* 7. Membership Hero — DARK CINEMATIC */}
        <LazySection minHeight="500px">
          <Suspense fallback={null}>
            <MembershipHero onRequestInvitation={() => setAuthOpen(true)} />
          </Suspense>
        </LazySection>

        {/* 8. Jet Card — CHARCOAL */}
        <LazySection minHeight="400px">
          <Suspense fallback={null}>
            <div className="section-charcoal">
              <JetCardSection />
            </div>
          </Suspense>
        </LazySection>

        <div className="divider-shimmer" />

        {/* 9. Beyond The Flight */}
        <LazySection minHeight="400px">
          <Suspense fallback={null}>
            <div className="section-light">
              <BeyondTheFlightSection />
            </div>
          </Suspense>
        </LazySection>

        <div className="divider-shimmer" />

        {/* 10. Events / Experiences */}
        <LazySection minHeight="400px">
          <SectionGuard name="events">
            <Suspense fallback={null}>
              <div className="section-white">
                <EventsSection />
              </div>
            </Suspense>
          </SectionGuard>
        </LazySection>

        <div className="divider-shimmer" />

        {/* 11. Partners */}
        <LazySection minHeight="300px">
          <Suspense fallback={null}>
            <div className="section-white">
              <PartnersSection />
            </div>
          </Suspense>
        </LazySection>

        {/* 12. SEO Content */}
        <Suspense fallback={null}>
          <SEOContentSection />
        </Suspense>

        {/* 13. Final CTA — DARK */}
        <Suspense fallback={null}>
          <div className="section-dark">
            <FinalCTASection />
          </div>
        </Suspense>
        </main>

        <Footer />
      </div>

      <StickyFloatingCTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;
