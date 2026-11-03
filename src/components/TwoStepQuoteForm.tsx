import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";
import { QuoteRequestSchema } from "@/lib/websiteValidation";
import { trackGenerateLead } from "@/lib/gtmEvents";
import PhoneWithCountryCode, { buildFullPhone } from "@/components/forms/PhoneWithCountryCode";
import {
  PremiumInput,
  PremiumTextarea,
  PremiumSubmitButton,
  FormSuccess,
  ConfidentialityNotice,
} from "@/components/forms/PremiumFormComponents";

interface TwoStepQuoteFormProps {
  /** Recorded on the CRM lead so the source page can be told apart */
  source?: string;
  defaultDeparture?: string;
}

type Errors = Partial<Record<"departure" | "destination" | "date" | "passengers" | "name" | "email" | "phone", string>>;

const today = () => new Date().toISOString().slice(0, 10);

const TwoStepQuoteForm = ({ source = "two_step_quote", defaultDeparture = "" }: TwoStepQuoteFormProps) => {
  const { capture } = useCrmApi();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [departure, setDeparture] = useState(defaultDeparture);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const validateStep1 = (): boolean => {
    const next: Errors = {};
    if (departure.trim().length < 2) next.departure = "Enter your departure city or airport";
    if (destination.trim().length < 2) next.destination = "Enter your destination city or airport";
    const pax = Number(passengers);
    if (!Number.isInteger(pax) || pax < 1 || pax > 50) next.passengers = "Enter 1–50 passengers";
    if (date && date < today()) next.date = "Date cannot be in the past";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const fullPhone = buildFullPhone(phoneCode, phone.trim());
    const parsed = QuoteRequestSchema.safeParse({
      name, email, phone: fullPhone, departure, destination, date, passengers, notes,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (next.departure || next.destination || next.date || next.passengers) setStep(1);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await capture({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        departure: parsed.data.departure,
        destination: parsed.data.destination,
        date: parsed.data.date,
        passengers: parsed.data.passengers,
        notes: parsed.data.notes || undefined,
        source,
      });
      if (result?.error) throw new Error(result.error);
      trackGenerateLead({ source, name: parsed.data.name });
      setSubmitted(true);
    } catch (err) {
      console.error("Quote request failed:", err);
      setSubmitError("We couldn't send your request. Please try again or email sales@universaljets.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <FormSuccess
        icon={CheckCircle}
        title="Request received"
        message="Thank you. An advisor will review your trip and reply to the contact details you provided."
      />
    );
  }

  return (
    <form
      onSubmit={step === 1 ? goNext : submit}
      noValidate
      aria-label="Request a private jet quote"
      className="space-y-5"
    >
      <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground" aria-live="polite">
        Step {step} of 2 — {step === 1 ? "Your trip" : "Your details"}
      </p>
      <div className="h-1 rounded-full bg-muted overflow-hidden" aria-hidden="true">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: step === 1 ? "50%" : "100%" }} />
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <PremiumInput label="From" required value={departure} onChange={(e) => setDeparture(e.target.value)}
            placeholder="City or airport, e.g. Dubai" maxLength={200} autoComplete="off" error={errors.departure} />
          <PremiumInput label="To" required value={destination} onChange={(e) => setDestination(e.target.value)}
            placeholder="City or airport" maxLength={200} autoComplete="off" error={errors.destination} />
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput label="Date" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
            <PremiumInput label="Passengers" required type="number" inputMode="numeric" min={1} max={50}
              value={passengers} onChange={(e) => setPassengers(e.target.value)} error={errors.passengers} />
          </div>
          <PremiumSubmitButton>Continue</PremiumSubmitButton>
        </div>
      ) : (
        <div className="space-y-4">
          <PremiumInput label="Full name" required value={name} onChange={(e) => setName(e.target.value)}
            maxLength={100} autoComplete="name" error={errors.name} />
          <PremiumInput label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            maxLength={255} autoComplete="email" error={errors.email} />
          <PhoneWithCountryCode label="Phone / WhatsApp (optional)" phone={phone} onPhoneChange={setPhone}
            countryCode={phoneCode} onCountryCodeChange={setPhoneCode} />
          {errors.phone && <p className="text-[11px] text-destructive/80" role="alert">{errors.phone}</p>}
          <PremiumTextarea label="Anything else? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
            maxLength={2000} rows={3} />
          {submitError && <p className="text-[12px] text-destructive" role="alert">{submitError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[48px] px-5 rounded-lg border border-border text-[11px] tracking-[0.15em] uppercase inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <PremiumSubmitButton loading={submitting}>Request quote</PremiumSubmitButton>
          </div>
        </div>
      )}
      <ConfidentialityNotice />
    </form>
  );
};

export default TwoStepQuoteForm;
