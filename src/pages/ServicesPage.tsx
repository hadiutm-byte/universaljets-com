import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PublicPageShell, { PageHero, CtaLink } from "@/components/public/PublicPageShell";
import { SERVICES } from "@/lib/siteContent";

const ServicesPage = () => (
  <PublicPageShell>
    <SEOHead
      title="Private Jet Charter Services"
      description="On-demand charter, empty legs, jet cards, group and corporate travel, helicopter transfers, cargo, medical flights and ACMI — arranged by Universal Jets."
      path="/services"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
    />
    <PageHero
      eyebrow="Services"
      title="Private aviation, arranged around your trip"
      intro="Choose the service that fits. If you are not sure, send a quote request and an advisor will recommend an approach."
    />
    <section className="pb-20">
      <div className="container mx-auto px-5 md:px-8 max-w-5xl grid gap-5 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            to={`/services/${s.slug}`}
            className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <h2 className="font-display text-xl mb-2">{s.title}</h2>
            <p className="text-[13px] text-muted-foreground font-light leading-[1.8]">{s.tagline}</p>
          </Link>
        ))}
      </div>
      <div className="text-center mt-12"><CtaLink to="/private-jet-charter-dubai#quote">Request a quote</CtaLink></div>
    </section>
  </PublicPageShell>
);

export default ServicesPage;
