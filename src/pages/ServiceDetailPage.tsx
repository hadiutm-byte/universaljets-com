import { Link, useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import PublicPageShell, { PageHero, Crumbs, CtaLink } from "@/components/public/PublicPageShell";
import NotFound from "@/pages/NotFound";
import { getService } from "@/lib/siteContent";

const ServiceDetailPage = () => {
  const { slug = "" } = useParams();
  const service = getService(slug);
  if (!service) return <NotFound />;

  const path = `/services/${service.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: `https://universaljets.com${path}`,
    provider: { "@id": "https://universaljets.com/#organization" },
  };

  return (
    <PublicPageShell>
      <SEOHead
        title={service.title}
        description={service.summary}
        path={path}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path },
        ]}
      />
      <JsonLd data={schema} />
      <PageHero eyebrow={service.tagline} title={service.title} intro={service.summary}>
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: service.title }]} />
      </PageHero>
      <section className="pb-20">
        <div className="container mx-auto px-5 md:px-8 max-w-4xl grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl mb-4">Best for</h2>
            <ul className="space-y-2 text-[14px] text-muted-foreground font-light list-disc pl-5">
              {service.bestFor.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl mb-4">How it works</h2>
            <ol className="space-y-2 text-[14px] text-muted-foreground font-light list-decimal pl-5">
              {service.howItWorks.map((h) => <li key={h}>{h}</li>)}
            </ol>
          </div>
        </div>
        <div className="container mx-auto px-5 md:px-8 max-w-4xl mt-12 flex flex-wrap gap-4 items-center">
          <CtaLink to="/private-jet-charter-dubai#quote">Request a quote</CtaLink>
          {service.moreHref && (
            <Link to={service.moreHref} className="text-[12px] tracking-[0.15em] uppercase text-primary underline-offset-4 hover:underline min-h-[44px] inline-flex items-center">
              {service.moreLabel}
            </Link>
          )}
          <Link to="/pricing" className="text-[12px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary min-h-[44px] inline-flex items-center">
            How pricing works
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
};

export default ServiceDetailPage;
