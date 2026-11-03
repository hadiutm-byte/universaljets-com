import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import PublicPageShell, { PageHero, Crumbs } from "@/components/public/PublicPageShell";
import FaqList from "@/components/public/FaqList";
import TwoStepQuoteForm from "@/components/TwoStepQuoteForm";
import { FAQS, SERVICES } from "@/lib/siteContent";

const dubaiFaqs = FAQS.filter((f) =>
  ["How much does it cost to charter a private jet?", "Can I fly from Dubai?", "What are empty leg flights?", "How far in advance should I book?"].includes(f.q),
);

const featured = SERVICES.filter((s) => ["private-jet-charter", "empty-legs", "helicopter-transfers", "jet-card"].includes(s.slug));

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private Jet Charter from Dubai",
  url: "https://universaljets.com/private-jet-charter-dubai",
  serviceType: "Private jet charter brokerage",
  provider: { "@id": "https://universaljets.com/#organization" },
  areaServed: { "@type": "City", name: "Dubai" },
};

const DubaiCharterPage = () => (
  <PublicPageShell>
    <SEOHead
      title="Private Jet Charter Dubai"
      description="Charter a private jet from Dubai to destinations worldwide. Request a quote in two quick steps and an advisor will reply with options."
      path="/private-jet-charter-dubai"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Private Jet Charter Dubai", path: "/private-jet-charter-dubai" }]}
    />
    <JsonLd data={pageSchema} />
    <PageHero
      eyebrow="Dubai"
      title="Private jet charter from Dubai"
      intro="Universal Jets is a Dubai-based aviation broker. Tell us where and when you want to fly and we will come back with aircraft options and a written quote."
    >
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Private Jet Charter Dubai" }]} />
    </PageHero>

    <section id="quote" className="pb-16 scroll-mt-28">
      <div className="container mx-auto px-5 md:px-8 max-w-xl rounded-2xl border border-border bg-card p-5 md:p-8">
        <h2 className="font-display text-2xl mb-5">Request a quote</h2>
        <TwoStepQuoteForm source="dubai_landing_quote" defaultDeparture="Dubai" />
      </div>
    </section>

    <section className="pb-16">
      <div className="container mx-auto px-5 md:px-8 max-w-4xl">
        <h2 className="font-display text-2xl mb-6">Popular ways to fly from Dubai</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="rounded-2xl border border-border p-5 hover:border-primary/40 transition-colors">
              <h3 className="font-display text-lg mb-1">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground font-light">{s.tagline}</p>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-muted-foreground font-light">
          See the <Link to="/empty-legs" className="text-primary underline">live empty leg list</Link>, or read{" "}
          <Link to="/pricing" className="text-primary underline">how pricing works</Link>. Learn more about{" "}
          <Link to="/destinations/dubai" className="text-primary underline">Dubai as a destination</Link>.
        </p>
      </div>
    </section>

    <section className="pb-20">
      <div className="container mx-auto px-5 md:px-8 max-w-3xl">
        <h2 className="font-display text-2xl mb-4">Dubai charter questions</h2>
        <FaqList items={dubaiFaqs} />
        <p className="mt-6 text-[13px]"><Link to="/faq" className="text-primary underline">All FAQs</Link></p>
      </div>
    </section>
  </PublicPageShell>
);

export default DubaiCharterPage;
