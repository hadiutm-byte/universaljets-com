import useUserGeolocation from "@/hooks/useUserGeolocation";
import { useState, useMemo } from "react";
import ALL_COUNTRY_CODES, { getSortedCountryCodes, resolveCountryCode, type CountryCodeEntry } from "@/lib/countryCodes";

interface PhoneWithCountryCodeProps {
  label?: string;
  phone: string;
  onPhoneChange: (phone: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

/** Returns the full phone string like "+971 50 000 0000" */
export function buildFullPhone(countryCode: string, phone: string): string | undefined {
  return phone ? `${countryCode} ${phone}` : undefined;
}

export { resolveCountryCode };
export { ALL_COUNTRY_CODES as countryCodes };

const PhoneWithCountryCode = ({
  label = "Phone / WhatsApp",
  phone,
  onPhoneChange,
  countryCode,
  onCountryCodeChange,
  placeholder = "50 000 0000",
  className,
  compact = false,
}: PhoneWithCountryCodeProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => getSortedCountryCodes(), []);

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  }, [search, sorted]);

  const selected = sorted.find(c => c.code === countryCode) || sorted[0];

  if (compact) {
    return (
      <div className={className}>
        <div className="flex gap-1.5">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="w-[90px] rounded-lg px-2 py-2.5 text-[12px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
          >
            {sorted.map((c) => (
              <option key={`${c.iso}-${c.code}`} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder={placeholder}
            maxLength={15}
            className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-[12px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5 text-foreground/55">
        {label}
      </label>
      <div className="flex gap-2 relative">
        {/* Searchable country dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-[110px] rounded-lg px-3 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] focus:outline-none focus:border-primary/30 cursor-pointer text-left flex items-center gap-1"
          >
            <span>{selected.flag}</span>
            <span className="text-[12px]">{selected.code}</span>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />
              <div className="absolute top-full left-0 mt-1 w-[260px] max-h-[280px] rounded-xl bg-card border border-border shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-border/20">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-2 text-[12px] rounded-lg bg-muted/50 border border-border/20 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="overflow-y-auto max-h-[220px]">
                  {filtered.map((c) => (
                    <button
                      key={`${c.iso}-${c.code}`}
                      type="button"
                      onClick={() => { onCountryCodeChange(c.code); setOpen(false); setSearch(""); }}
                      className={`w-full text-left px-3 py-2 text-[12px] hover:bg-secondary/50 transition-colors flex items-center gap-2 ${c.code === countryCode ? "bg-primary/5 text-primary" : "text-foreground/70"}`}
                    >
                      <span>{c.flag}</span>
                      <span className="font-medium">{c.code}</span>
                      <span className="text-[10px] text-muted-foreground/50 truncate">{c.name}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-[11px] text-muted-foreground/40 py-4">No countries found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={placeholder}
          maxLength={15}
          className="flex-1 rounded-lg px-4 py-3.5 text-[13px] text-foreground font-light bg-muted/50 border border-foreground/[0.06] placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:bg-background focus:shadow-[0_0_0_3px_hsla(43,85%,58%,0.06)]"
        />
      </div>
    </div>
  );
};

export default PhoneWithCountryCode;
