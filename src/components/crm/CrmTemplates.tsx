import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface CrmTemplate {
  title: string;
  description: string;
  content: string;
}

export const downloadTemplate = (template: CrmTemplate) => {
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

export const TemplateDownloadCard = ({ template }: { template: CrmTemplate }) => (
  <button
    onClick={() => downloadTemplate(template)}
    className="group flex items-center gap-3 p-3 rounded-sm border border-border/20 bg-muted/20 hover:border-primary/20 hover:bg-muted/40 transition-all duration-300 w-full text-left"
  >
    <div className="w-8 h-8 rounded-sm bg-primary/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
      <FileText className="w-3.5 h-3.5 text-primary" strokeWidth={1.3} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-medium text-foreground">{template.title}</p>
      <p className="text-[10px] text-muted-foreground font-light">{template.description}</p>
    </div>
    <Download className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" strokeWidth={1.3} />
  </button>
);

// ─── TEMPLATES BY DEPARTMENT ───

export const quoteRequestTemplate: CrmTemplate = {
  title: "Quote Request Form",
  description: "Client flight requirements form",
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

Universal Jets Aviation Brokerage FZCO
DIEZ License No. 50370 | DCAA License No. 3342665
sales@universaljets.com | +44 7888 999944`,
};

export const charterContractTemplate: CrmTemplate = {
  title: "Charter Contract",
  description: "Standard charter flight agreement",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
CHARTER FLIGHT AGREEMENT
────────────────────────────────────────

Agreement No.: UJ-________
Date: ____________________

PARTIES
───────
Broker: Universal Jets Aviation Brokerage FZCO
        DIEZ License No. 50370 | DCAA License No. 3342665

Client: ______________________________

1. FLIGHT DETAILS
─────────────────
Aircraft Type: ________________________
Operator: _____________________________
Departure: ____________________________
Destination: __________________________
Date & Time (UTC): ____________________
Passengers: ___________________________

2. PRICE & PAYMENT
──────────────────
Total Charter Price: USD _______________
Deposit (50%): USD ____________________
Balance Due Before Departure: USD ______

3. CANCELLATION POLICY
──────────────────────
• 72+ hours: Full refund minus admin fee
• 48–72 hours: 50% of charter price
• Less than 48 hours: No refund

4. TERMS
────────
• Broker acts solely as intermediary.
• Client responsible for valid travel documents.

SIGNATURES
──────────
Client: _________________________  Date: ____________
Broker: _________________________  Date: ____________

sales@universaljets.com | +44 7888 999944`,
};

export const invoiceTemplate: CrmTemplate = {
  title: "Invoice Template",
  description: "Flight services invoice",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
INVOICE
────────────────────────────────────────

Invoice No.: UJ-INV-________
Date: ____________________
Due Date: ________________

BILL TO
───────
Client: ______________________________
Email: _______________________________

FLIGHT DETAILS
──────────────
Route: ____________ → ____________
Date: _____________________________
Aircraft: _________________________

CHARGES
───────
Charter Fee                        ____________
Fuel Surcharge                     ____________
Landing / Handling Fees            ____________
Catering                           ____________
Ground Transportation              ____________
─────────────────────────────────
TOTAL DUE                          ____________

PAYMENT INSTRUCTIONS
────────────────────
Bank: __________________________________
Account: Universal Jets Aviation Brokerage FZCO
IBAN: __________________________________
SWIFT: _________________________________

sales@universaljets.com | +44 7888 999944`,
};

export const receiptTemplate: CrmTemplate = {
  title: "Payment Receipt",
  description: "Confirmation of payment received",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PAYMENT RECEIPT
────────────────────────────────────────

Receipt No.: UJ-REC-________
Date: ____________________

RECEIVED FROM
─────────────
Client: ______________________________

PAYMENT DETAILS
───────────────
Invoice No.: UJ-INV-________
Amount Received: USD _______________
Payment Method: ____________________
Transaction Reference: _____________

STATUS: [ ] Deposit  [ ] Full Payment  [ ] Final Balance

Authorized Signature: _________________________

sales@universaljets.com | +44 7888 999944`,
};

export const membershipTermsTemplate: CrmTemplate = {
  title: "Membership Enrollment Terms",
  description: "Private Access Network terms",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PRIVATE ACCESS NETWORK — MEMBERSHIP ENROLLMENT
────────────────────────────────────────

Member Name: ______________________________
Member ID: UJ-MEM-________
Tier: [ ] Founder's Circle  [ ] Elite  [ ] Premium

1. BENEFITS
───────────
• Priority access to empty legs
• Dedicated account manager
• Preferential pricing
• Concierge services
• Referral credit program

2. TERMS
────────
• Annual membership, auto-renewing
• Cancellation with 30 days written notice
• Benefits subject to availability

Member Signature: _________________________  Date: ____________

sales@universaljets.com | +44 7888 999944`,
};

export const partnershipAgreementTemplate: CrmTemplate = {
  title: "Partnership Agreement",
  description: "Luxury brand & hotel partnership terms",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
PARTNERSHIP AGREEMENT
────────────────────────────────────────

Agreement No.: UJ-PART-________
Effective Date: ____________________

Party A: Universal Jets Aviation Brokerage FZCO
Party B: ______________________________

1. PURPOSE
──────────
Mutual promotion and benefit sharing between
Universal Jets members and Partner's services.

2. PARTNER OBLIGATIONS
──────────────────────
• Provide exclusive benefits to members
• Maintain service quality standards
• Report usage metrics monthly

3. TERM
───────
• Initial term: 12 months
• Auto-renewal unless 60-day notice

SIGNATURES
──────────
Party A: _________________________  Date: ____________
Party B: _________________________  Date: ____________

partners@universaljets.com`,
};

export const flightRequestTemplate: CrmTemplate = {
  title: "Flight Request Form",
  description: "Internal flight request intake form",
  content: `UNIVERSAL JETS AVIATION BROKERAGE FZCO
FLIGHT REQUEST — INTERNAL FORM
────────────────────────────────────────

Date Received: ____________________
Received By: ______________________

CLIENT INFORMATION
──────────────────
Name: _________________________________
Company: ______________________________
Phone / WhatsApp: _____________________
Email: ________________________________

FLIGHT REQUIREMENTS
───────────────────
Departure: ____________________________
Destination: __________________________
Date: _________________________________
Return: _______________________________
Passengers: ___________________________
Aircraft Preference: __________________

SPECIAL REQUIREMENTS
────────────────────
Catering: _____________________________
Ground Transport: _____________________
VIP Terminal: [ ] Yes  [ ] No
Pets: [ ] Yes  [ ] No
Notes:
___________________________________________

STATUS: [ ] Pending  [ ] Quoted  [ ] Confirmed
Assigned To: ______________________________`,
};
