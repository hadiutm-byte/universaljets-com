import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initial?: any;
}

export default function ClientForm({ open, onOpenChange, onSuccess, initial }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: initial?.full_name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    company: initial?.company ?? "",
    notes: initial?.notes ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const op = initial?.id
      ? supabase.from("clients").update(form).eq("id", initial.id)
      : supabase.from("clients").insert(form);
    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success(initial?.id ? "Client updated" : "Client created"); onSuccess(); onOpenChange(false); }
    setLoading(false);
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/30 max-w-md">
        <DialogHeader><DialogTitle className="font-display text-lg">{initial?.id ? "Edit" : "New"} Client</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {field("Full Name", "full_name")}
          {field("Email", "email", "email")}
          {field("Phone", "phone")}
          {field("Company", "company")}
          {field("Notes", "notes")}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500 disabled:opacity-50">
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
