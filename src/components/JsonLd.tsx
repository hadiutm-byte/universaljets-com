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
  url: "https://www.universaljets.com",
  logo: "https://www.universaljets.com/favicon.png",
  description: "Private jet charter brokerage with 18+ years of experience. On-demand charter, empty legs, jet cards, and 24/7 concierge.",
  foundingDate: "2006",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@universaljets.com",
      availableLanguage: ["English", "Arabic"],
    },
  ],
  sameAs: [
    "https://www.instagram.com/universaljetsfzco",
    "https://www.facebook.com/share/1CNWNni3gE/",
    "https://www.linkedin.com/company/universal-travel-management-&-network/",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Universal Jets Aviation Brokerage FZCO",
  url: "https://www.universaljets.com",
  telephone: "+44-7888-999944",
  email: "sales@universaljets.com",
  priceRange: "$$$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  openingHours: "Mo-Su 00:00-23:59",
};
