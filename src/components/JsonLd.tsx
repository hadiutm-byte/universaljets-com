import { FAQS } from "@/lib/siteContent";

interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://universaljets.com/#organization",
  name: "Universal Jets",
  legalName: "Universal Jets Aviation Brokerage FZCO",
  url: "https://universaljets.com",
  logo: {
    "@type": "ImageObject",
    url: "https://universaljets.com/favicon.png",
    width: 512,
    height: 512,
  },
  image: "https://universaljets.com/og-image.jpg",
  description:
    "Dubai-based independent private jet charter brokerage. On-demand charter, empty legs, jet cards, membership, ACMI leasing and 24/7 concierge worldwide.",
  foundingLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
  },
  slogan: "Your World. Your Schedule. Your Jet.",
  knowsAbout: [
    "Private jet charter",
    "Empty leg flights",
    "Jet card programs",
    "ACMI leasing",
    "Aircraft management",
    "VIP concierge services",
    "Medical evacuation flights",
    "Cargo charter",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@universaljets.com",
      availableLanguage: ["English", "Arabic", "French", "Russian"],
      areaServed: "Worldwide",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "concierge@universaljets.com",
      availableLanguage: ["English", "Arabic"],
      areaServed: "Worldwide",
    },
  ],
  sameAs: [
    "https://www.instagram.com/universaljetsfzco",
    "https://www.facebook.com/share/1CNWNni3gE/",
    "https://www.linkedin.com/company/universal-travel-management-&-network/",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "CommerCity",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 25.185, longitude: 55.3781 },
    geoRadius: "20000 km",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://universaljets.com/#business",
  name: "Universal Jets Aviation Brokerage FZCO",
  url: "https://universaljets.com",
  email: "sales@universaljets.com",
  image: "https://universaljets.com/og-image.jpg",
  currenciesAccepted: "USD, AED, EUR, GBP",
  paymentAccepted: "Wire Transfer, Credit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "CommerCity",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.185,
    longitude: 55.3781,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
};

/** WebSite schema with SearchAction for Google sitelinks searchbox */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://universaljets.com/#website",
  name: "Universal Jets",
  url: "https://universaljets.com",
  publisher: { "@id": "https://universaljets.com/#organization" },
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://universaljets.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

/** Service schema for private jet charter */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://universaljets.com/#service",
  name: "Private Jet Charter",
  provider: { "@id": "https://universaljets.com/#organization" },
  serviceType: "Private Aviation Charter Brokerage",
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  description:
    "On-demand private jet charter brokerage sourcing from licensed operators worldwide. Services include empty leg flights, jet card programs, ACMI leasing, cargo charter, medical evacuation, and full concierge coordination.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Charter Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "On-Demand Private Jet Charter", url: "https://universaljets.com/request-flight" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Empty Leg Flights", url: "https://universaljets.com/" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jet Card Program", url: "https://universaljets.com/jet-card" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ACMI & Aircraft Leasing", url: "https://universaljets.com/acmi-leasing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cargo Charter" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Medical Evacuation Flights" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "VIP Concierge Services", url: "https://universaljets.com/concierge" } },
    ],
  },
  termsOfService: "https://universaljets.com/terms",
};

/** Builds FAQPage JSON-LD from the same copy rendered on the page. */
export const buildFaqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const faqSchema = buildFaqSchema(FAQS);

/** Helper to generate BreadcrumbList schema */
export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/** Speakable schema for Google Assistant / voice search */
export const speakableSchema = (cssSelectors: string[]) => ({
  "@type": "SpeakableSpecification",
  cssSelector: cssSelectors,
});

/** Contact page schema */
export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Universal Jets",
  url: "https://universaljets.com/contact",
  mainEntity: { "@id": "https://universaljets.com/#organization" },
};

/** About page schema */
export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Universal Jets",
  url: "https://universaljets.com/about",
  mainEntity: { "@id": "https://universaljets.com/#organization" },
};