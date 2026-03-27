import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import usePhoneGeolocation from "@/hooks/usePhoneGeolocation";
import {
  PremiumInput, PremiumSelect, PremiumTextarea, PremiumCheckbox,
  LegalConsent, FormDisclaimer, PremiumSubmitButton, ConfidentialityNotice,
  ValidationMessage,
} from "@/components/forms/PremiumFormComponents";

const countryCodes = [
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+41", label: "🇨🇭 +41" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+7", label: "🇷🇺 +7" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+86", label: "🇨🇳 +86" },
  { code: "+81", label: "🇯🇵 +81" },
  { code: "+82", label: "🇰🇷 +82" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+55", label: "🇧🇷 +55" },
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+90", label: "🇹🇷 +90" },
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+852", label: "🇭🇰 +852" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraftName: string;
}

export default function AircraftRequestModal({ open, onOpenChange, aircraftName }: Props) {
  const { capture } = useCrmApi();
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", countryCode: "+971", phone: "", departure: "", destination: "",
    date: "", passengers: "1", special_requests: "", flexible_dates: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const detectedCountryCode = usePhoneGeolocation();
  const resolvedCountryCode = detectedCountryCode && countryCodes.some((c) => c.code === detectedCountryCode)
    ? detectedCountryCode
    : "+971";

  useEffect(() => {
    if (resolvedCountryCode !== "+971") {
      setForm((prev) => ({ ...prev, countryCode: resolvedCountryCode }));
    }
  }, [resolvedCountryCode]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const canSubmit = form.name && form.email && form.departure && form.destination && form.date && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) {
      toast.error("Please complete all required fields and accept the terms.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const fullPhone = form.phone ? `${form.countryCode} ${form.phone}` : undefined;
      await capture({
        name: form.name, email: form.email,
        phone: fullPhone,
        departure: form.departure, destination: form.destination,
        date: form.date, passengers: form.passengers,
        source: "aircraft_guide", specific_aircraft: aircraftName,
        special_requests: form.special_requests || undefined,
        notes: form.flexible_dates ? "Flexible on dates" : undefined,
      });
      toast.success(`Your request for the ${aircraftName} has been received.`);
      onOpenChange(false);
      setAttempted(false);
      setForm({ name: "", email: "", countryCode: resolvedCountryCode, phone: "", departure: "", destination: "", date: "", passengers: "1", special_requests: "", flexible_dates: false });
      setTermsAccepted(false);
    } catch {
      toast.error("We were unable to submit your request. Please try again or contact our team directly.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-foreground/[0.06] max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary/60 font-medium">Aircraft Request</p>
          <DialogTitle className="font-display text-lg mt-1">Request {aircraftName}</DialogTitle>
          <p className="text-[11px] text-muted-foreground font-light mt-1">Complete your trip details and an advisor will prepare options.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Full Name" required
              value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="Full name" maxLength={100}
              error={attempted && !form.name ? "Required" : undefined}
            />
            <PremiumInput
              label="Email" required type="email"
              value={form.email} onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com" maxLength={255}
              error={attempted && !form.email ? "Required" : undefined}
            />
          </div>

          {/* Phone with country code */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">
              Phone / WhatsApp
            </label>
            <div className="flex gap-2">
              <select
                value={form.countryCode}
                onChange={(e) => set("countryCode", e.target.value)}
                className="w-[100px] rounded-lg px-2 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="50 000 0000"
                maxLength={15}
                className="flex-1 rounded-lg px-4 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:bg-background focus:shadow-[0_0_0_3px_hsla(43,74%,49%,0.06)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Departure (IATA/ICAO)" required
              value={form.departure} onChange={(e) => set("departure", e.target.value)}
              placeholder="e.g. DXB, OMDB" maxLength={100}
              error={attempted && !form.departure ? "Required" : undefined}
            />
            <PremiumInput
              label="Destination (IATA/ICAO)" required
              value={form.destination} onChange={(e) => set("destination", e.target.value)}
              placeholder="e.g. LHR, EGLL" maxLength={100}
              error={attempted && !form.destination ? "Required" : undefined}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Date" required type="date"
              value={form.date} onChange={(e) => set("date", e.target.value)}
              error={attempted && !form.date ? "Required" : undefined}
            />
            <PremiumSelect label="Passengers" value={form.passengers} onChange={(e) => set("passengers", e.target.value)}>
              {[...Array(19)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </PremiumSelect>
          </div>
          <PremiumTextarea label="Special Requests" value={form.special_requests} onChange={(e) => set("special_requests", e.target.value)} rows={2} placeholder="Any preferences or requirements..." maxLength={1000} />
          <PremiumCheckbox label="I'm flexible on dates" checked={form.flexible_dates} onChange={(v) => set("flexible_dates", v)} />

          <LegalConsent checked={termsAccepted} onChange={setTermsAccepted} />
          <ValidationMessage show={attempted && !canSubmit} />
          <FormDisclaimer />

          <PremiumSubmitButton loading={loading} disabled={!canSubmit}>
            Request This Aircraft
          </PremiumSubmitButton>
          <ConfidentialityNotice />
        </form>
      </DialogContent>
    </Dialog>
  );
}
