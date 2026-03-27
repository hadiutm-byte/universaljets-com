import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import { trackEmptyLegInquiry } from "@/lib/gtmEvents";
import useUserGeolocation from "@/hooks/useUserGeolocation";
import PhoneWithCountryCode, { buildFullPhone, resolveCountryCode } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  LegalConsent, FormDisclaimer, PremiumSubmitButton, ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emptyLeg?: { route?: string; date?: string; aircraft?: string };
}

export default function EmptyLegInquiryModal({ open, onOpenChange, emptyLeg }: Props) {
  const { capture } = useCrmApi();
  const geo = useUserGeolocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", countryCode: "+971", phone: "", passengers: "1",
    flexible_timing: false, additional_destination: "", notes: "",
    confirmation_speed: "standard",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const resolvedCode = resolveCountryCode(geo.countryCode);
  useEffect(() => {
    if (form.countryCode === "+971" && resolvedCode !== "+971") {
      setForm((p) => p.countryCode === "+971" ? { ...p, countryCode: resolvedCode } : p);
    }
  }, [resolvedCode]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const canSubmit = form.name && form.email && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const routeParts = emptyLeg?.route?.split(" → ") || ["TBD", "TBD"];
      await capture({
        name: form.name, email: form.email,
        phone: buildFullPhone(form.countryCode, form.phone),
        departure: routeParts[0] || "TBD",
        destination: routeParts[1] || "TBD",
        date: emptyLeg?.date, passengers: form.passengers,
        source: "empty_leg_inquiry",
        specific_aircraft: emptyLeg?.aircraft,
        notes: [
          `Confirmation speed: ${form.confirmation_speed}`,
          form.flexible_timing ? "Flexible on timing" : null,
          form.additional_destination ? `Alt destination: ${form.additional_destination}` : null,
          form.notes || null,
        ].filter(Boolean).join(" | "),
      });
      trackEmptyLegInquiry(emptyLeg?.route);
      toast.success("Your inquiry has been received. We will confirm availability shortly.");
      onOpenChange(false);
    } catch { toast.error("We were unable to submit your request. Please try again or contact our team directly."); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-foreground/[0.06] max-w-md rounded-2xl">
        <DialogHeader>
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary/60 font-medium">Empty Leg Inquiry</p>
          <DialogTitle className="font-display text-lg mt-1">Secure This Flight</DialogTitle>
          {emptyLeg?.route && <p className="text-[12px] text-primary/70 font-light mt-1">{emptyLeg.route}</p>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput label="Full Name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" maxLength={100} />
            <PremiumInput label="Email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" maxLength={255} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PhoneWithCountryCode phone={form.phone} onPhoneChange={(v) => set("phone", v)} countryCode={form.countryCode} onCountryCodeChange={(v) => set("countryCode", v)} />
            <PremiumSelect label="Passengers" value={form.passengers} onChange={(e) => set("passengers", e.target.value)}>
              {[...Array(19)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </PremiumSelect>
          </div>
          <PremiumSelect label="Confirmation Speed" value={form.confirmation_speed} onChange={(e) => set("confirmation_speed", e.target.value)}>
            <option value="asap">ASAP — within the hour</option>
            <option value="standard">Standard — within 24 hours</option>
            <option value="flexible">Flexible — no rush</option>
          </PremiumSelect>
          <PremiumCheckbox label="I'm flexible on timing" checked={form.flexible_timing} onChange={(v) => set("flexible_timing", v)} />
          <PremiumInput label="Alternative Destination" value={form.additional_destination} onChange={(e) => set("additional_destination", e.target.value)} placeholder="If the exact route doesn't work..." />
          <PremiumTextarea label="Notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Any additional information..." maxLength={1000} />
          <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} />
          <FormDisclaimer />
          <PremiumSubmitButton loading={loading} disabled={!canSubmit}>Inquire About This Flight</PremiumSubmitButton>
          <ConfidentialityNotice />
        </form>
      </DialogContent>
    </Dialog>
  );
}
