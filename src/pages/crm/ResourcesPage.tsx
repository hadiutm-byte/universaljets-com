import { useState } from "react";
import { FileText, Download, FolderOpen, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Template {
  title: string;
  description: string;
  category: "client" | "partner" | "internal";
  content: string;
}

const templates: Template[] = [
  {
    title: "Quote Request Form",
    description: "Submit flight requirements for a detailed quote.",
    category: "client",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
QUOTE REQUEST FORM
────────────────────────────────────────

Client Name: ______________________________
Company: __________________________________
Email: ____________________________________
Phone / WhatsApp: _________________________

FLIGHT DETAILS
──────────────
Departure City / Airport: _________________
Destination City / Airport: _______________
Date of Travel: ___________________________
Return Date (if applicable): ______________
Number of Passengers: _____________________
Preferred Aircraft Category:
  [ ] Light Jet   [ ] Midsize   [ ] Super-Midsize
  [ ] Heavy Jet   [ ] Ultra-Long Range   [ ] VIP Airliner

ADDITIONAL REQUIREMENTS
───────────────────────
Catering Preferences: _____________________
Ground Transportation: ____________________
Pet on Board:  [ ] Yes  [ ] No
Special Requests / Notes:
___________________________________________
___________________________________________

By submitting this form you agree to Universal Jets' Terms of Service.

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
Dubai, United Arab Emirates
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Charter Contract",
    description: "Standard charter flight agreement template.",
    category: "client",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
CHARTER FLIGHT AGREEMENT
────────────────────────────────────────

Agreement No.: UJ-________
Date: ____________________

PARTIES
───────
Broker: Universal Jets Aviation Brokerage FZCO
        DIEZ License No. 50370 | DCAA License No. 3342665
        Dubai, United Arab Emirates

Client: ______________________________
        ______________________________

1. FLIGHT DETAILS
─────────────────
Aircraft Type: ________________________
Operator: _____________________________
Registration: _________________________
Departure: ____________________________
Destination: __________________________
Date & Time (UTC): ____________________
Passengers: ___________________________

2. PRICE & PAYMENT
──────────────────
Total Charter Price: USD _______________
Deposit (50%): USD ____________________
Balance Due Before Departure: USD ______
Payment Method: [ ] Wire Transfer  [ ] Credit Card

3. CANCELLATION POLICY
──────────────────────
• 72+ hours before departure: Full refund minus admin fee
• 48–72 hours: 50% of charter price
• Less than 48 hours: No refund

4. TERMS & CONDITIONS
─────────────────────
• Broker acts solely as intermediary between Client and Operator.
• Operator holds the Air Operator Certificate (AOC).
• Flight operations are subject to weather and ATC clearances.
• Client is responsible for valid travel documents for all passengers.

SIGNATURES
──────────
Client: _________________________  Date: ____________
Broker: _________________________  Date: ____________

Universal Jets Aviation Brokerage FZCO
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Invoice Template",
    description: "Flight services invoice template.",
    category: "client",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
INVOICE
────────────────────────────────────────

Invoice No.: UJ-INV-________
Date: ____________________
Due Date: ________________

BILL TO
───────
Client: ______________________________
Company: _____________________________
Address: _____________________________
Email: _______________________________

FLIGHT DETAILS
──────────────
Agreement No.: UJ-________
Route: ____________ → ____________
Date of Flight: ___________________
Aircraft: _________________________
Passengers: _______________________

CHARGES
───────
Description                        Amount (USD)
─────────────────────────────────  ────────────
Charter Fee                        ____________
Fuel Surcharge                     ____________
Landing / Handling Fees            ____________
Catering                           ____________
Ground Transportation              ____________
VIP Terminal Access                ____________
─────────────────────────────────  ────────────
SUBTOTAL                           ____________
VAT (if applicable)                ____________
─────────────────────────────────  ────────────
TOTAL DUE                          ____________

PAYMENT INSTRUCTIONS
────────────────────
Bank: __________________________________
Account Name: Universal Jets Aviation Brokerage FZCO
IBAN: __________________________________
SWIFT: _________________________________
Reference: Invoice No. UJ-INV-________

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Payment Receipt",
    description: "Confirmation of payment received.",
    category: "client",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PAYMENT RECEIPT
────────────────────────────────────────

Receipt No.: UJ-REC-________
Date: ____________________

RECEIVED FROM
─────────────
Client: ______________________________
Company: _____________________________

PAYMENT DETAILS
───────────────
Invoice No.: UJ-INV-________
Amount Received: USD _______________
Payment Method: ____________________
Transaction Reference: _____________
Date of Payment: ___________________

STATUS: [ ] Deposit  [ ] Full Payment  [ ] Final Balance

FLIGHT REFERENCE
────────────────
Route: ____________ → ____________
Date: _____________________________
Aircraft: _________________________

This receipt confirms that the above payment has been received
by Universal Jets Aviation Brokerage FZCO.

Authorized Signature: _________________________
Name: ________________________________________
Date: ________________________________________

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Membership Enrollment Terms",
    description: "Private Access Network terms and conditions.",
    category: "client",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PRIVATE ACCESS NETWORK — MEMBERSHIP ENROLLMENT
────────────────────────────────────────

Member Name: ______________________________
Member ID: UJ-MEM-________
Enrollment Date: __________________________
Tier: [ ] Founder's Circle  [ ] Elite  [ ] Premium

1. MEMBERSHIP BENEFITS
──────────────────────
• Priority access to empty leg opportunities
• Dedicated account manager
• Preferential pricing on charter bookings
• Concierge services (ground transport, catering, hotels)
• Referral credit program
• Access to partner benefits and experiences

2. MEMBERSHIP TERMS
───────────────────
• Annual membership, auto-renewing
• Cancellation with 30 days written notice
• Benefits subject to availability
• Member data kept strictly confidential

3. REFERRAL PROGRAM
───────────────────
• Earn credit for each successful referral
• Credit applied to future charter bookings
• No limit on referrals

ACKNOWLEDGMENT
──────────────
I acknowledge that I have read and agree to the membership terms.

Member Signature: _________________________  Date: ____________

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Partnership Agreement",
    description: "Standard partnership terms for luxury brands and hotels.",
    category: "partner",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PARTNERSHIP AGREEMENT
────────────────────────────────────────

Agreement No.: UJ-PART-________
Effective Date: ____________________

PARTIES
───────
Party A (Broker):
  Universal Jets Aviation Brokerage FZCO
  DIEZ License No. 50370 | DCAA License No. 3342665
  Dubai, United Arab Emirates

Party B (Partner):
  Company: ______________________________
  Contact: ______________________________
  Address: ______________________________

1. PURPOSE
──────────
This agreement establishes a partnership for mutual promotion
and benefit sharing between Universal Jets members and
Partner's services/products.

2. PARTNER OBLIGATIONS
──────────────────────
• Provide exclusive benefits to Universal Jets members
• Maintain service quality standards
• Report usage/redemption metrics monthly

3. UNIVERSAL JETS OBLIGATIONS
─────────────────────────────
• Promote Partner through member communications
• Include Partner in concierge recommendations
• Provide Partner branding visibility on platform

4. TERM & TERMINATION
─────────────────────
• Initial term: 12 months from Effective Date
• Auto-renewal unless 60-day written notice
• Either party may terminate with 30-day notice

5. CONFIDENTIALITY
──────────────────
Both parties agree to keep all terms and member data confidential.

SIGNATURES
──────────
Party A: _________________________  Date: ____________
Party B: _________________________  Date: ____________

Universal Jets Aviation Brokerage FZCO
sales@universaljets.com | +44 7888 999944`,
  },
  {
    title: "Concession Proposal",
    description: "Template for submitting member benefit proposals.",
    category: "partner",
    content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
CONCESSION / BENEFIT PROPOSAL
────────────────────────────────────────

Date: ____________________
Submitted By: ______________________________
Company: ___________________________________

1. PROPOSED BENEFIT
───────────────────
Title: _____________________________________
Category: [ ] Hotel  [ ] Dining  [ ] Wellness  [ ] Lifestyle  [ ] Other
Description:
___________________________________________
___________________________________________

2. BENEFIT DETAILS
──────────────────
• Discount / Value: ________________________
• Availability: ____________________________
• Location(s): _____________________________
• Booking Method: __________________________
• Blackout Dates: __________________________

3. TARGET AUDIENCE
──────────────────
• All Members  [ ]
• Founder's Circle Only  [ ]
• Elite & Above  [ ]

4. MARKETING SUPPORT
────────────────────
• Assets provided: [ ] Images  [ ] Logo  [ ] Copy
• Co-marketing agreement: [ ] Yes  [ ] No

5. CONTACT
──────────
Name: _____________________________________
Email: ____________________________________
Phone: ____________________________________

Submit this proposal to: partners@universaljets.com

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
Dubai, United Arab Emirates`,
  },
];

const categories = [
  { key: "all", label: "All Templates" },
  { key: "client", label: "Client Documents" },
  { key: "partner", label: "Partner Documents" },
] as const;

const downloadTemplate = (template: Template) => {
  const blob = new Blob([template.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${template.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`Downloaded: ${template.title}`);
};

const ResourcesPage = () => {
  const [filter, setFilter] = useState<"all" | "client" | "partner">("all");
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => {
    if (filter !== "all" && t.category !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground mb-1">
          Resources & Templates
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Download operational documents for charter, membership, and partnerships.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key as any)}
              className={`px-4 py-2 text-[11px] tracking-wide uppercase font-medium rounded-sm border transition-all duration-300 ${
                filter === c.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border/30 hover:border-primary/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.3} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/30 border border-border/30 rounded-sm outline-none focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => (
          <div
            key={t.title}
            className="group flex items-start gap-4 p-5 rounded-sm border border-border/30 bg-card/50 hover:border-primary/20 hover:bg-muted/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-sm bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
              <FileText className="w-4 h-4 text-primary" strokeWidth={1.3} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground mb-0.5">{t.title}</h3>
              <p className="text-[11px] text-muted-foreground font-light mb-3">{t.description}</p>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium bg-muted/50 px-2 py-0.5 rounded-sm">
                {t.category}
              </span>
            </div>
            <button
              onClick={() => downloadTemplate(t)}
              className="flex-shrink-0 w-9 h-9 rounded-sm border border-border/30 flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-300"
              title={`Download ${t.title}`}
            >
              <Download className="w-4 h-4" strokeWidth={1.3} />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground/50 font-light">No templates match your search.</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
