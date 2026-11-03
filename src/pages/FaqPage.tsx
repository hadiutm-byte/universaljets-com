import SEOHead from "@/components/SEOHead";
import JsonLd, { buildFaqSchema } from "@/components/JsonLd";
import PublicPageShell, { PageHero, Crumbs, CtaLink } from "@/components/public/PublicPageShell";
import FaqList from "@/components/public/FaqList";
import { FAQS } from "@/lib/siteContent";

const FaqPage = () => (
  <PublicPageShell>
    <SEOHead
      title="Private Jet Charter FAQ"
      description="Answers about private jet charter, empty legs, jet cards, booking lead times and how Universal Jets prepares your quote."
      path="/faq"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]}
    />
    <JsonLd data={buildFaqSchema(FAQS)} />
    <PageHero eyebrow="FAQ" title="Frequently asked questions">
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />
    </PageHero>
    <section className="pb-20">
      <div className="container mx-auto px-5 md:px-8 max-w-3xl">
        <FaqList items={FAQS} />
        <div className="mt-12 text-center"><CtaLink to="/private-jet-charter-dubai#quote">Request a quote</CtaLink></div>
      </div>
    </section>
  </PublicPageShell>
);

export default FaqPage;
