import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Shield, Check } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   PREMIUM FORM DESIGN SYSTEM — Universal Jets
   Consistent luxury form components across the entire site.
   ═══════════════════════════════════════════════════════════ */

// ── Premium Label ──
export const PremiumLabel = ({
  children,
  required,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <label
    className={cn(
      "block text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5",
      "text-foreground/55",
      className
    )}
  >
    {children}
    {required && <span className="text-primary ml-1">*</span>}
  </label>
);

// ── Premium Input ──
const premiumInputBase =
  "w-full rounded-lg px-4 py-3.5 text-[13px] text-foreground font-light transition-all duration-300 " +
  "bg-muted/50 border border-foreground/[0.06] " +
  "placeholder:text-muted-foreground/40 " +
  "focus:outline-none focus:border-primary/30 focus:bg-background focus:shadow-[0_0_0_3px_hsla(45,79%,46%,0.06)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const PremiumInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean; error?: string }
>(({ label, required, error, className, ...props }, ref) => (
  <div>
    {label && <PremiumLabel required={required}>{label}</PremiumLabel>}
    <input ref={ref} className={cn(premiumInputBase, error && "border-destructive/40 focus:border-destructive/60", className)} {...props} />
    {error && <p className="mt-1.5 text-[11px] text-destructive/80 font-light">{error}</p>}
  </div>
));
PremiumInput.displayName = "PremiumInput";

// ── Premium Select ──
export const PremiumSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; required?: boolean; error?: string }
>(({ label, required, error, className, children, ...props }, ref) => (
  <div>
    {label && <PremiumLabel required={required}>{label}</PremiumLabel>}
    <select ref={ref} className={cn(premiumInputBase, "appearance-none cursor-pointer", error && "border-destructive/40", className)} {...props}>
      {children}
    </select>
    {error && <p className="mt-1.5 text-[11px] text-destructive/80 font-light">{error}</p>}
  </div>
));
PremiumSelect.displayName = "PremiumSelect";

// ── Premium Textarea ──
export const PremiumTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; required?: boolean; error?: string }
>(({ label, required, error, className, ...props }, ref) => (
  <div>
    {label && <PremiumLabel required={required}>{label}</PremiumLabel>}
    <textarea ref={ref} className={cn(premiumInputBase, "resize-none min-h-[80px]", error && "border-destructive/40", className)} {...props} />
    {error && <p className="mt-1.5 text-[11px] text-destructive/80 font-light">{error}</p>}
  </div>
));
PremiumTextarea.displayName = "PremiumTextarea";

// ── Premium Checkbox ──
export const PremiumCheckbox = ({
  label,
  checked,
  onChange,
  className,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) => (
  <label className={cn("flex items-start gap-3 cursor-pointer group", className)}>
    <div className={cn(
      "mt-0.5 w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-300",
      checked
        ? "bg-primary border-primary"
        : "border-foreground/15 bg-muted/40 group-hover:border-primary/30"
    )}>
      {checked && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={2.5} />}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <span className="text-[12px] text-foreground/55 font-light leading-[1.7] group-hover:text-foreground/70 transition-colors">
      {label}
    </span>
  </label>
);

// ── Form Section Divider ──
export const FormSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-4", className)}>
    <div className="flex items-center gap-4">
      <p className="text-[10px] tracking-[0.35em] uppercase text-primary/60 font-medium whitespace-nowrap">
        {title}
      </p>
      <div className="flex-1 h-px bg-foreground/[0.04]" />
    </div>
    {children}
  </div>
);

// ── Legal Consent ──
export const LegalConsent = ({
  checked,
  onChange,
  includeMarketing = false,
  marketingChecked = false,
  onMarketingChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  includeMarketing?: boolean;
  marketingChecked?: boolean;
  onMarketingChange?: (checked: boolean) => void;
}) => (
  <div className="space-y-3 pt-2">
    <div className="h-px bg-foreground/[0.04]" />
    <PremiumCheckbox
      checked={checked}
      onChange={onChange}
      label={
        <span>
          I agree to the{" "}
          <Link to="/terms" className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>
          .
        </span>
      }
    />
    {includeMarketing && onMarketingChange && (
      <PremiumCheckbox
        checked={marketingChecked || false}
        onChange={onMarketingChange}
        label="I would like to receive exclusive offers, flight opportunities, and aviation insights from Universal Jets."
      />
    )}
  </div>
);

// ── Quote / Request Disclaimer ──
export const FormDisclaimer = ({ className }: { className?: string }) => (
  <div className={cn("flex items-start gap-3 pt-3", className)}>
    <Shield className="w-3.5 h-3.5 text-primary/40 flex-shrink-0 mt-0.5" strokeWidth={1.3} />
    <p className="text-[11px] text-muted-foreground/50 font-light leading-[1.8]">
      All pricing is subject to aircraft availability, routing, permits, and operational confirmation.
      Charter offers are not final until confirmed in writing by Universal Jets.
      Your information is handled with absolute discretion.
    </p>
  </div>
);

// ── Premium CTA Button ──
export const PremiumSubmitButton = ({
  loading,
  disabled,
  children,
  className,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="submit"
    disabled={disabled || loading}
    className={cn(
      "w-full py-4 text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500",
      "bg-gradient-gold text-primary-foreground",
      "hover:shadow-[0_0_40px_-8px_hsla(45,79%,46%,0.45)]",
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
      "btn-luxury",
      className
    )}
  >
    {loading ? "Processing…" : children}
  </button>
);

// ── Success Confirmation ──
export const FormSuccess = ({
  icon: Icon,
  title,
  message,
  children,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  children?: React.ReactNode;
}) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 rounded-full border border-primary/15 flex items-center justify-center mx-auto mb-6 bg-primary/[0.04]">
      <Icon className="w-7 h-7 text-primary" strokeWidth={1.2} />
    </div>
    <h3 className="text-2xl font-display font-semibold mb-3">{title}</h3>
    <p className="text-[14px] text-muted-foreground font-light leading-[1.9] max-w-md mx-auto mb-6">
      {message}
    </p>
    {children}
  </div>
);

// ── Confidentiality Notice (for below submit buttons) ──
export const ConfidentialityNotice = ({ className }: { className?: string }) => (
  <p className={cn("text-[11px] text-muted-foreground/45 text-center font-light mt-3", className)}>
    All requests are handled discreetly by our advisory team.
  </p>
);

// ── Validation Error Summary ──
export const ValidationMessage = ({
  show,
  message = "Please complete the required fields to continue.",
}: {
  show: boolean;
  message?: string;
}) =>
  show ? (
    <p className="flex items-center gap-2 text-[11px] text-destructive/70 font-light py-2">
      <span className="w-1 h-1 rounded-full bg-destructive/60 flex-shrink-0" />
      {message}
    </p>
  ) : null;
