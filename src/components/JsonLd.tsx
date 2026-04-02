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
  name: "Universal Jets",
  url: "https://universaljets.com",
  logo: "https://universaljets.com/favicon.png",
  description:
    "Dubai-based private jet charter brokerage with 18+ years of experience. On-demand charter, empty legs, jet cards, ACMI leasing, and 24/7 concierge across 190+ countries.",
  foundingDate: "2006",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@universaljets.com",
      availableLanguage: ["English", "Arabic"],
      areaServed: "Worldwide",
      contactOption: "TollFree",
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
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://universaljets.com/#business",
  name: "Universal Jets Aviation Brokerage FZCO",
  url: "https://universaljets.com",
  email: "sales@universaljets.com",
  priceRange: "$$$$$",
  image: "https://universaljets.com/og-image.jpg",
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
  name: "Universal Jets",
  url: "https://universaljets.com",
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
  name: "Private Jet Charter",
  provider: {
    "@type": "Organization",
    name: "Universal Jets",
    url: "https://universaljets.com",
  },
  serviceType: "Private Aviation Charter Brokerage",
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  description:
    "On-demand private jet charter brokerage with access to 7,000+ vetted aircraft globally. Services include empty leg flights, jet card programs, ACMI leasing, cargo charter, medical evacuation, and full concierge coordination.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Charter Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "On-Demand Private Jet Charter" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Empty Leg Flights" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jet Card Program" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ACMI & Aircraft Leasing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cargo Charter" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Medical Evacuation Flights" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "VIP Concierge Services" } },
    ],
  },
};

/** FAQ schema for the homepage — improves rich snippet appearance */
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to charter a private jet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private jet charter costs vary based on aircraft type, distance, and availability. Light jets typically start from $3,000–$5,000 per flight hour, while heavy jets range from $8,000–$15,000+ per hour. Universal Jets compares pricing across 7,000+ aircraft to find the best rate for every trip.",
      },
    },
    {
      "@type": "Question",
      name: "What are empty leg flights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Empty leg flights are one-way repositioning flights that occur when a private jet needs to return to base or reposition for its next booking. These flights can be booked at significantly reduced rates — up to 75% less than standard charter pricing.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance do I need to book a private jet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private jets can be arranged with as little as 4–6 hours notice for domestic flights. International flights typically require 24–48 hours for permits and handling. Universal Jets operates 24/7 to accommodate urgent travel needs.",
      },
    },
    {
      "@type": "Question",
      name: "What is a jet card and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A jet card is a prepaid program that locks in fixed hourly rates for private jet travel. Universal Jets' Altus Jet Card offers guaranteed availability, no membership fees, and flight hours that carry forward — giving you the flexibility of charter with the predictability of ownership.",
      },
    },
    {
      "@type": "Question",
      name: "Does Universal Jets own the aircraft?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Universal Jets is an independent aviation broker, not an operator. This means we compare options across the entire global market of 7,000+ vetted aircraft to find you the best aircraft at the most competitive price — rather than being limited to a single fleet.",
      },
    },
  ],
};

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
