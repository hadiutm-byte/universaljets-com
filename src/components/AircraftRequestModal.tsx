import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCrmApi } from "@/hooks/useCrmApi";
import { toast } from "sonner";

const inputClass =
  "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/20 border border-border/20 transition-all";
const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraftName: string;
}

export default function AircraftRequestModal({ open, onOpenChange, aircraftName }: Props) {
  const { capture } = useCrmApi();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", departure: "", destination: "",
    date: "", passengers: "1", special_requests: "", flexible_dates: false,
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const canSubmit = form.name && form.email && form.departure && form.destination && form.date;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Invalid email"); return; }
    setLoading(true);
    try {
      await capture({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        departure: form.departure,
        destination: form.destination,
        date: form.date,
        passengers: form.passengers,
        source: "aircraft_guide",
        specific_aircraft: aircraftName,
        special_requests: form.special_requests || undefined,
        notes: form.flexible_dates ? "Flexible on dates" : undefined,
      });
      toast.success(`Request submitted for ${aircraftName}`);
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
          <DialogTitle className="font-display text-lg">Request {aircraftName}</DialogTitle>
          <p className="text-[11px] text-muted-foreground font-light">Fill in your trip details and an advisor will prepare options.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Name *</label><input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Full name" /></div>
            <div><label className={labelClass}>Email *</label><input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" /></div>
          </div>
          <div><label className={labelClass}>Phone / WhatsApp</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+971 50 000 0000" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Departure *</label><input required value={form.departure} onChange={(e) => set("departure", e.target.value)} className={inputClass} placeholder="City or airport" /></div>
            <div><label className={labelClass}>Destination *</label><input required value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputClass} placeholder="City or airport" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Date *</label><input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Passengers</label>
              <select value={form.passengers} onChange={(e) => set("passengers", e.target.value)} className={inputClass}>
                {[...Array(19)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelClass}>Special Requests</label><textarea value={form.special_requests} onChange={(e) => set("special_requests", e.target.value)} rows={2} className={inputClass} placeholder="Any preferences or requirements..." /></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.flexible_dates} onChange={(e) => set("flexible_dates", e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
            <span className="text-[11px] text-foreground/50 font-light">I'm flexible on dates</span>
          </label>
          <button type="submit" disabled={!canSubmit || loading}
            className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500 disabled:opacity-40">
            {loading ? "Submitting..." : "Request This Aircraft"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
