/**
 * Shared public-site copy. Intentionally contains no prices, ratings, fleet counts,
 * or credentials — anything numeric must be supplied/approved by the business first.
 */

export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  bestFor: string[];
  howItWorks: string[];
  /** Existing in-app page with deeper detail, if any */
  moreHref?: string;
  moreLabel?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "private-jet-charter",
    title: "On-Demand Private Jet Charter",
    tagline: "A private aircraft, matched to your trip.",
    summary:
      "Tell us your route, date and group size. We source options from the operators we work with and present a clear quote, so you can choose the aircraft that fits the trip.",
    bestFor: ["Business travel on your schedule", "Family and leisure trips", "Multi-stop itineraries"],
    howItWorks: [
      "Share your route, dates and passenger count.",
      "We check availability with operators and prepare a quote.",
      "You confirm the aircraft and we coordinate the details through to departure.",
    ],
    moreHref: "/request-flight",
    moreLabel: "Request a detailed quote",
  },
  {
    slug: "empty-legs",
    title: "Empty Leg Flights",
    tagline: "Repositioning flights, offered when they are available.",
    summary:
      "An empty leg is a one-way flight an aircraft must make without passengers. When the timing and route suit you, it can cost less than a standard charter. Availability is time-sensitive and changes often.",
    bestFor: ["Flexible dates and airports", "Short-notice departures", "One-way trips"],
    howItWorks: [
      "Browse the live empty leg list.",
      "Send an enquiry on the flight you like.",
      "We confirm current availability and final pricing with the operator.",
    ],
    moreHref: "/empty-legs",
    moreLabel: "View live empty legs",
  },
  {
    slug: "jet-card",
    title: "Jet Card",
    tagline: "Prepaid flying with agreed terms.",
    summary:
      "A jet card is a prepaid arrangement for frequent flyers. Terms differ between programmes, so we walk you through exactly what is included before you commit.",
    bestFor: ["Frequent flyers", "Companies with regular travel", "Budget predictability"],
    howItWorks: [
      "Tell us how often and where you fly.",
      "We explain the card options and their terms.",
      "You decide whether a card or on-demand charter suits you better.",
    ],
    moreHref: "/jet-card",
    moreLabel: "Explore the Jet Card",
  },
  {
    slug: "group-and-corporate",
    title: "Group & Corporate Charter",
    tagline: "Larger aircraft and coordinated logistics.",
    summary:
      "Delegations, teams and events often need larger cabins and careful planning. We coordinate aircraft selection, schedules and ground arrangements with the operator.",
    bestFor: ["Corporate delegations", "Sports teams and events", "Large family groups"],
    howItWorks: [
      "Share group size, route and timing.",
      "We propose suitable aircraft types and operators.",
      "We coordinate schedule changes and passenger details with you.",
    ],
    moreHref: "/charter/corporate",
    moreLabel: "Corporate solutions",
  },
  {
    slug: "helicopter-transfers",
    title: "Helicopter Transfers",
    tagline: "Short-hop rotorcraft transfers.",
    summary:
      "Where helicopter operations are available, we can arrange city, airport and event transfers alongside or independent of a jet charter.",
    bestFor: ["Airport transfers", "Event and yacht transfers", "Time-critical short hops"],
    howItWorks: [
      "Share pick-up, drop-off and timing.",
      "We confirm operator availability and permissions.",
      "We send you a quote and coordinate the transfer.",
    ],
    moreHref: "/charter/helicopter",
    moreLabel: "Helicopter charter",
  },
  {
    slug: "cargo-and-special-missions",
    title: "Cargo & Special Missions",
    tagline: "Freight and non-standard missions.",
    summary:
      "Oversized, urgent or sensitive freight, and humanitarian or specialist missions, arranged with suitably equipped operators. Permits and compliance depend on the cargo and route.",
    bestFor: ["Urgent freight", "Oversized shipments", "Humanitarian operations"],
    howItWorks: [
      "Describe the cargo, route and deadline.",
      "We identify suitable aircraft and operators.",
      "We coordinate permits and handling requirements with you.",
    ],
    moreHref: "/charter/cargo",
    moreLabel: "Cargo charter",
  },
  {
    slug: "medical-and-evacuation",
    title: "Medical & Emergency Evacuation",
    tagline: "Urgent flights, coordinated quickly.",
    summary:
      "For medical repatriation and emergency evacuation we coordinate with specialist operators. Contact us directly for urgent cases rather than waiting for an emailed reply.",
    bestFor: ["Medical repatriation", "Emergency evacuation", "Urgent requests"],
    howItWorks: [
      "Contact us with the situation, location and timing.",
      "We coordinate with suitable specialist operators.",
      "We keep you updated on clearances and schedule.",
    ],
    moreHref: "/evacuation",
    moreLabel: "Evacuation services",
  },
  {
    slug: "acmi-leasing",
    title: "ACMI & Aircraft Leasing",
    tagline: "Aircraft, crew, maintenance and insurance.",
    summary:
      "For airlines, operators and large programmes that need capacity rather than a single trip. Contact us with your requirements and we will explain what is possible.",
    bestFor: ["Airlines and operators", "Seasonal capacity", "Large programmes"],
    howItWorks: [
      "Share aircraft type, period and region.",
      "We discuss what is available.",
      "Commercial terms are agreed directly.",
    ],
    moreHref: "/acmi-leasing",
    moreLabel: "ACMI details",
  },
  {
    slug: "concierge",
    title: "Concierge",
    tagline: "Everything around the flight.",
    summary:
      "Ground transport, catering and other travel arrangements around your trip, requested alongside your quote.",
    bestFor: ["Ground transport", "Catering requests", "Special assistance"],
    howItWorks: [
      "Mention what you need in your quote request.",
      "We confirm what can be arranged for your route.",
      "Costs are itemised in your quote.",
    ],
    moreHref: "/concierge",
    moreLabel: "Concierge services",
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "How much does it cost to charter a private jet?",
    a: "Cost depends on the route, aircraft category, dates, airport fees and any extra services. Because every trip differs, we provide a written quote for your specific itinerary instead of a generic price. See our pricing page for what drives the total.",
  },
  {
    q: "How does the two-step quote request work?",
    a: "Step one asks for your route, date and passengers. Step two asks for your contact details so we can reply. There is no payment and no obligation when you request a quote.",
  },
  {
    q: "What are empty leg flights?",
    a: "An empty leg is a one-way flight an aircraft makes without passengers, for example when returning to base. If it matches your route and timing, it can be offered at a lower price than a standard charter. Availability and pricing change quickly and are confirmed with the operator.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as you can. Short-notice trips are sometimes possible, but availability, permits and handling arrangements vary by route and aircraft, so we confirm what is feasible when you send your request.",
  },
  {
    q: "Is Universal Jets an operator or a broker?",
    a: "Universal Jets is an aviation broker. We arrange flights with third-party operators rather than flying our own aircraft, which lets us compare options for your trip.",
  },
  {
    q: "What is a jet card?",
    a: "A jet card is a prepaid way to buy flight time. Terms such as rates, availability and flexibility differ between programmes, so we explain the details before you commit.",
  },
  {
    q: "Can I fly from Dubai?",
    a: "Yes. Dubai is our home market and we arrange charters from the Dubai area to destinations worldwide, subject to aircraft availability and permits.",
  },
  {
    q: "How do I contact you about an urgent request?",
    a: "Use the WhatsApp or email links on our contact page and mention that your request is urgent.",
  },
  {
    q: "What information do I need for a quote?",
    a: "Departure and destination, preferred date, and the number of passengers. Optional extras such as aircraft preference or special requests help us refine the quote.",
  },
  {
    q: "How is my personal data used?",
    a: "We use your details to respond to your request. See our Privacy Policy for full information.",
  },
];

export const PRICING_FACTORS: { title: string; body: string }[] = [
  {
    title: "Route and flight time",
    body: "Longer routes mean more flight hours, fuel and crew time. Your quote reflects the actual route.",
  },
  {
    title: "Aircraft category",
    body: "Light, midsize, heavy and long-range aircraft are priced differently. We recommend the smallest category that suits your passengers and range.",
  },
  {
    title: "One-way vs round trip",
    body: "If the aircraft must return empty, that positioning can be part of the cost. Empty legs can sometimes reduce this when they match your route.",
  },
  {
    title: "Dates and demand",
    body: "Peak periods, events and short notice affect availability and pricing.",
  },
  {
    title: "Airport and handling fees",
    body: "Landing, parking, handling and any permits vary by airport and country and are listed in the quote.",
  },
  {
    title: "Extras",
    body: "Catering, ground transport, Wi-Fi or other requests are itemised where applicable.",
  },
];
