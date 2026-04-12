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
    "Dubai-based private jet charter brokerage with 18+ years of experience. On-demand charter, empty legs, jet cards, ACMI leasing, and 24/7 concierge across 190+ countries.",
  foundingDate: "2006",
  foundingLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
  },
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 },
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
    postalCode: "00000",
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
  priceRange: "$$$$$",
  image: "https://universaljets.com/og-image.jpg",
  currenciesAccepted: "USD, AED, EUR, GBP",
  paymentAccepted: "Wire Transfer, Credit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "CommerCity",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    postalCode: "00000",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "127",
    reviewCount: "98",
  },
  hasMap: "https://www.google.com/maps?cid=universaljets",
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
    name: "Worldwide — 190+ countries",
  },
  description:
    "On-demand private jet charter brokerage with access to 7,000+ vetted aircraft globally. Services include empty leg flights, jet card programs, ACMI leasing, cargo charter, medical evacuation, and full concierge coordination.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "3000",
    highPrice: "150000",
    offerCount: "7",
  },
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
    {
      "@type": "Question",
      name: "Is it safe to fly by private jet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Universal Jets only works with operators vetted through ARGUS and WYVERN international safety standards. Every aircraft is verified for maintenance records, crew certification, and insurance coverage before being offered to clients.",
      },
    },
    {
      "@type": "Question",
      name: "What destinations can I fly to by private jet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private jets can access over 10,000 airports worldwide — far more than commercial airlines. Universal Jets arranges flights to 190+ countries, including remote airstrips, island runways, and private terminals not served by scheduled carriers.",
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