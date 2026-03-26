import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";
import { trackEmptyLegInquiry } from "@/lib/gtmEvents";

const inputClass =
  "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/20 border border-border/20 transition-all";
const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emptyLeg?: { route?: string; date?: string; aircraft?: string };
}

export default function EmptyLegInquiryModal({ open, onOpenChange, emptyLeg }: Props) {
  const { capture } = useCrmApi();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", passengers: "1",
    flexible_timing: false, additional_destination: "", notes: "",
    confirmation_speed: "standard",
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const canSubmit = form.name && form.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Invalid email"); return; }
    setLoading(true);
    try {
      const routeParts = emptyLeg?.route?.split(" → ") || ["TBD", "TBD"];
      await capture({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        departure: routeParts[0] || "TBD",
        destination: routeParts[1] || "TBD",
        date: emptyLeg?.date,
        passengers: form.passengers,
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
      toast.success("Inquiry submitted. We'll confirm availability shortly.");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Empty Leg Inquiry</DialogTitle>
          {emptyLeg?.route && <p className="text-[12px] text-primary/70 font-light">{emptyLeg.route}</p>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Name *</label><input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Full name" /></div>
            <div><label className={labelClass}>Email *</label><input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Phone / WhatsApp</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+971 50 000 0000" /></div>
            <div><label className={labelClass}>Passengers</label>
              <select value={form.passengers} onChange={(e) => set("passengers", e.target.value)} className={inputClass}>
                {[...Array(19)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelClass}>How quickly do you need confirmation?</label>
            <select value={form.confirmation_speed} onChange={(e) => set("confirmation_speed", e.target.value)} className={inputClass}>
              <option value="asap">ASAP — within the hour</option>
              <option value="standard">Standard — within 24 hours</option>
              <option value="flexible">Flexible — no rush</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.flexible_timing} onChange={(e) => set("flexible_timing", e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
            <span className="text-[11px] text-foreground/50 font-light">I'm flexible on timing</span>
          </label>
          <div><label className={labelClass}>Alternative Destination</label><input value={form.additional_destination} onChange={(e) => set("additional_destination", e.target.value)} className={inputClass} placeholder="If the exact route doesn't work..." /></div>
          <div><label className={labelClass}>Notes</label><textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={inputClass} placeholder="Any additional info..." /></div>
          <button type="submit" disabled={!canSubmit || loading}
            className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500 disabled:opacity-40">
            {loading ? "Submitting..." : "Inquire About This Leg"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
