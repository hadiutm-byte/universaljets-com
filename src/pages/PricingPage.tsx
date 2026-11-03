import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PublicPageShell, { PageHero, Crumbs, CtaLink } from "@/components/public/PublicPageShell";
import { PRICING_FACTORS } from "@/lib/siteContent";

const PricingPage = () => (
  <PublicPageShell>
    <SEOHead
      title="How Private Jet Charter Pricing Works"
      description="What determines the cost of a private jet charter: route, aircraft category, dates, airport fees and extras. Request a written quote for your trip."
      path="/pricing"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]}
    />
    <PageHero
      eyebrow="Pricing"
      title="How charter pricing works"
      intro="Charter pricing is specific to each trip, so we quote your actual itinerary instead of publishing generic rates. Here is what shapes the number."
    >
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Pricing" }]} />
    </PageHero>
    <section className="pb-12">
      <div className="container mx-auto px-5 md:px-8 max-w-4xl grid gap-5 md:grid-cols-2">
        {PRICING_FACTORS.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg mb-2">{f.title}</h2>
            <p className="text-[13px] text-muted-foreground font-light leading-[1.8]">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="pb-20">
      <div className="container mx-auto px-5 md:px-8 max-w-4xl space-y-4 text-[14px] text-muted-foreground font-light leading-[1.9]">
        <h2 className="font-display text-xl text-foreground">What you receive</h2>
        <p>A written quote for your route and dates, including the aircraft category and what is and is not included. Quotes are subject to aircraft availability at the time you confirm.</p>
        <p>Looking for lower cost? Flexible dates may let you take advantage of <Link to="/empty-legs" className="text-primary underline">empty legs</Link>.</p>
        <div className="pt-6"><CtaLink to="/private-jet-charter-dubai#quote">Get a quote</CtaLink></div>
      </div>
    </section>
  </PublicPageShell>
);

export default PricingPage;
