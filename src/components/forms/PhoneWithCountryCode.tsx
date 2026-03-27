import useUserGeolocation from "@/hooks/useUserGeolocation";
import { useEffect, useState } from "react";

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
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+973", label: "🇧🇭 +973" },
  { code: "+968", label: "🇴🇲 +968" },
  { code: "+965", label: "🇰🇼 +965" },
  { code: "+20", label: "🇪🇬 +20" },
  { code: "+31", label: "🇳🇱 +31" },
  { code: "+32", label: "🇧🇪 +32" },
  { code: "+43", label: "🇦🇹 +43" },
  { code: "+351", label: "🇵🇹 +351" },
  { code: "+30", label: "🇬🇷 +30" },
  { code: "+52", label: "🇲🇽 +52" },
  { code: "+60", label: "🇲🇾 +60" },
  { code: "+66", label: "🇹🇭 +66" },
];

interface PhoneWithCountryCodeProps {
  label?: string;
  phone: string;
  onPhoneChange: (phone: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  className?: string;
}

/** Returns the full phone string like "+971 50 000 0000" */
export function buildFullPhone(countryCode: string, phone: string): string | undefined {
  return phone ? `${countryCode} ${phone}` : undefined;
}

/** Resolves the detected country code against the supported list, defaulting to +971. */
export function resolveCountryCode(detected: string): string {
  if (detected && countryCodes.some((c) => c.code === detected)) return detected;
  return "+971";
}

export { countryCodes };

const PhoneWithCountryCode = ({
  label = "Phone / WhatsApp",
  phone,
  onPhoneChange,
  countryCode,
  onCountryCodeChange,
  placeholder = "50 000 0000",
  className,
}: PhoneWithCountryCodeProps) => {
  return (
    <div className={className}>
      <label className="block text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="w-[100px] rounded-lg px-2 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
        >
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={placeholder}
          maxLength={15}
          className="flex-1 rounded-lg px-4 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:bg-background focus:shadow-[0_0_0_3px_hsla(43,74%,49%,0.06)]"
        />
      </div>
    </div>
  );
};

export default PhoneWithCountryCode;
