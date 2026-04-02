import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, MapPin, Phone, Plane, Shield } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initial?: any;
}

const clientTypes = [
  "lead", "prospect", "active_client", "member", "vip", "corporate",
  "family_office", "government", "broker", "concierge_only",
];

const contactMethods = ["email", "phone", "whatsapp"];

import { crmInputClass, crmLabelClass, crmCheckboxClass } from "@/components/crm/crmStyles";

const inputClass = crmInputClass + " placeholder:text-foreground/20";
const labelClass = crmLabelClass;

export default function ClientForm({ open, onOpenChange, onSuccess, initial }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    setForm({
      full_name: initial?.full_name ?? "",
      first_name: initial?.first_name ?? "",
      last_name: initial?.last_name ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      whatsapp: initial?.whatsapp ?? "",
      nationality: initial?.nationality ?? "",
      date_of_birth: initial?.date_of_birth ?? "",
      gender: initial?.gender ?? "",
      preferred_language: initial?.preferred_language ?? "en",
      company: initial?.company ?? "",
      notes: initial?.notes ?? "",
      industry: initial?.industry ?? "",
      office_location: initial?.office_location ?? "",
      company_billing_name: initial?.company_billing_name ?? "",
      company_vat: initial?.company_vat ?? "",
      country: initial?.country ?? "",
      city: initial?.city ?? "",
      address: initial?.address ?? "",
      billing_address: initial?.billing_address ?? "",
      passport_country: initial?.passport_country ?? "",
      client_type: initial?.client_type ?? "lead",
      preferred_contact_method: initial?.preferred_contact_method ?? "email",
      preferred_contact_time: initial?.preferred_contact_time ?? "",
      email_allowed: initial?.email_allowed ?? true,
      whatsapp_allowed: initial?.whatsapp_allowed ?? true,
      phone_allowed: initial?.phone_allowed ?? true,
      marketing_optin: initial?.marketing_optin ?? false,
      lead_source: initial?.lead_source ?? "",
    });
  }, [initial, open]);

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name) { toast.error("Full name is required"); return; }
    if (!form.email && !form.phone) { toast.error("Email or phone is required"); return; }
    if (!form.lead_source && !initial?.id) { toast.error("Lead source is required"); return; }

    setLoading(true);
    const payload = { ...form };
    // Remove empty strings
    Object.keys(payload).forEach((k) => { if (payload[k] === "") payload[k] = null; });

    // Compute profile completeness
    const fields = ["full_name", "email", "phone", "company", "country", "city", "nationality", "billing_address", "preferred_contact_method"];
    const filled = fields.filter((f) => payload[f]).length;
    payload.profile_completeness = Math.round((filled / fields.length) * 100);

    const op = initial?.id
      ? supabase.from("clients").update(payload as any).eq("id", initial.id)
      : supabase.from("clients").insert(payload as any);
    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success(initial?.id ? "Client updated" : "Client created"); onSuccess(); onOpenChange(false); }
    setLoading(false);
  };

  const field = (label: string, key: string, type = "text", placeholder = "") => (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder} className={inputClass} />
    </div>
  );

  const selectField = (label: string, key: string, options: { value: string; label: string }[]) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)}
        className={inputClass}>
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const checkbox = (label: string, key: string) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={form[key] ?? false} onChange={(e) => set(key, e.target.checked)}
        className="w-3.5 h-3.5 rounded border-border/40 accent-primary" />
      <span className="text-[11px] text-foreground/60 font-light">{label}</span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/30 max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{initial?.id ? "Edit" : "New"} Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="w-full bg-secondary/30 mb-4">
              <TabsTrigger value="identity" className="text-[10px] gap-1"><User size={10} /> Identity</TabsTrigger>
              <TabsTrigger value="company" className="text-[10px] gap-1"><Building2 size={10} /> Company</TabsTrigger>
              <TabsTrigger value="location" className="text-[10px] gap-1"><MapPin size={10} /> Location</TabsTrigger>
              <TabsTrigger value="comms" className="text-[10px] gap-1"><Phone size={10} /> Comms</TabsTrigger>
              <TabsTrigger value="classification" className="text-[10px] gap-1"><Shield size={10} /> Classification</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {field("Full Name *", "full_name", "text", "Alexander Hartwell")}
                {field("Email", "email", "email", "alex@example.com")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field("First Name", "first_name")}
                {field("Last Name", "last_name")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field("Phone", "phone", "tel", "+971 50 000 0000")}
                {field("WhatsApp", "whatsapp", "tel", "+971 50 000 0000")}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {field("Nationality", "nationality")}
                {field("Date of Birth", "date_of_birth", "date")}
                {selectField("Gender", "gender", [
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ])}
              </div>
              {selectField("Preferred Language", "preferred_language", [
                { value: "en", label: "English" },
                { value: "ar", label: "Arabic" },
                { value: "fr", label: "French" },
                { value: "ru", label: "Russian" },
                { value: "zh", label: "Chinese" },
                { value: "es", label: "Spanish" },
              ])}
            </TabsContent>

            <TabsContent value="company" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {field("Company Name", "company")}
                {field("Industry", "industry")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field("Office Location", "office_location")}
                {field("Billing Name", "company_billing_name")}
              </div>
              {field("VAT / Tax ID", "company_vat")}
            </TabsContent>

            <TabsContent value="location" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {field("Country", "country")}
                {field("City", "city")}
              </div>
              {field("Address", "address")}
              {field("Billing Address", "billing_address")}
              {field("Passport Country", "passport_country")}
            </TabsContent>

            <TabsContent value="comms" className="space-y-3">
              {selectField("Preferred Contact Method", "preferred_contact_method",
                contactMethods.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))
              )}
              {field("Preferred Contact Time", "preferred_contact_time", "text", "e.g. Mornings GMT+4")}
              <div className="space-y-2 pt-2">
                <p className={labelClass}>Communication Permissions</p>
                {checkbox("Email allowed", "email_allowed")}
                {checkbox("WhatsApp allowed", "whatsapp_allowed")}
                {checkbox("Phone allowed", "phone_allowed")}
                {checkbox("Marketing opt-in", "marketing_optin")}
              </div>
            </TabsContent>

            <TabsContent value="classification" className="space-y-3">
              {selectField("Client Type *", "client_type",
                clientTypes.map((t) => ({ value: t, label: t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }))
              )}
              {field("Lead Source *", "lead_source", "text", "e.g. website, referral, event")}
              <div>
                <label className={labelClass}>Notes</label>
                <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)}
                  rows={3} className={inputClass} placeholder="Internal notes..." />
              </div>
            </TabsContent>
          </Tabs>

          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500 disabled:opacity-50">
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
