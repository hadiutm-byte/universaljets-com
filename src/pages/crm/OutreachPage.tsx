import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Plus, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OutreachTemplate {
  id: string;
  name: string;
  channel: string;
  subject: string | null;
  body: string;
  placeholders: string[];
  created_at: string;
}

const OutreachPage = () => {
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<OutreachTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "linkedin", subject: "", body: "" });
  const [previewName, setPreviewName] = useState("Alexander");

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from("outreach_templates" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load templates");
    } else {
      setTemplates((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.body) return;
    const placeholders = (form.body.match(/\[[\w\s]+\]/g) || []);

    if (editing) {
      const { error } = await supabase
        .from("outreach_templates" as any)
        .update({ name: form.name, channel: form.channel, subject: form.subject || null, body: form.body, placeholders } as any)
        .eq("id", editing.id);
      if (error) toast.error("Failed to update");
      else toast.success("Template updated");
    } else {
      const { error } = await supabase
        .from("outreach_templates" as any)
        .insert({ name: form.name, channel: form.channel, subject: form.subject || null, body: form.body, placeholders } as any);
      if (error) toast.error("Failed to create");
      else toast.success("Template created");
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", channel: "linkedin", subject: "", body: "" });
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("outreach_templates" as any).delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Template deleted"); fetchTemplates(); }
  };

  const copyToClipboard = (body: string) => {
    const filled = body.replace(/\[Name\]/g, previewName || "[Name]");
    navigator.clipboard.writeText(filled);
    toast.success("Copied to clipboard");
  };

  const startEdit = (t: OutreachTemplate) => {
    setEditing(t);
    setForm({ name: t.name, channel: t.channel, subject: t.subject || "", body: t.body });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">Outreach Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">LinkedIn & email outreach messages</p>
          </div>
          <Button
            onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", channel: "linkedin", subject: "", body: "" }); }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> New Template
          </Button>
        </div>

        {showForm && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-medium">{editing ? "Edit Template" : "New Template"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Template Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="LinkedIn - Initial Outreach" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Channel</label>
                <select
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>
            {form.channel === "email" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Subject Line</label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Quick question about private travel" />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={8}
                placeholder="Hi [Name],&#10;&#10;Your message here..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Use [Name] for dynamic placeholders</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Preview name input */}
        {!showForm && templates.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Preview name:</label>
            <Input value={previewName} onChange={(e) => setPreviewName(e.target.value)} className="w-40 h-8 text-xs" />
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : templates.length === 0 && !showForm ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-4 opacity-40" />
            <p className="text-sm">No outreach templates yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{t.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.channel}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(t.body)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(t)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <pre className="text-xs text-foreground/60 whitespace-pre-wrap font-sans leading-relaxed bg-secondary/30 rounded-lg p-4">
                  {t.body.replace(/\[Name\]/g, previewName || "[Name]")}
                </pre>
                {t.placeholders.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {t.placeholders.map((p) => (
                      <span key={p} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutreachPage;
