import { useEffect, useState, useCallback } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass } from "@/components/crm/crmStyles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Trash2, Plus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["admin", "sales", "operations", "finance", "account_management", "client"];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  profile?: { full_name: string | null; phone: string | null } | null;
}

const AdminUsersPage = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ user_id: "", role: "client" as AppRole });
  const [profiles, setProfiles] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("*, profile:profiles(full_name, phone)").order("created_at", { ascending: false });
    setRoles((data as any[]) ?? []);
    const { data: p } = await supabase.from("profiles").select("id, full_name");
    setProfiles(p ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_id) { toast.error("Select a user"); return; }
    const { data, error } = await supabase.functions.invoke("admin-roles", {
      body: { action: "assign", user_id: form.user_id, role: form.role },
    });
    if (error) { toast.error("Failed to assign role"); return; }
    const result = data as any;
    if (result?.error) {
      toast.error(result.error);
    } else { toast.success("Role assigned"); load(); setAddOpen(false); }
  };

  const removeRole = async (id: string) => {
    if (!confirm("Remove this role assignment?")) return;
    const { data, error } = await supabase.functions.invoke("admin-roles", {
      body: { action: "remove", role_id: id },
    });
    if (error) { toast.error("Failed to remove role"); return; }
    const result = data as any;
    if (result?.error) { toast.error(result.error); } else { toast.success("Removed"); load(); }
  };

  // Group by user
  const userMap = new Map<string, { name: string; roles: UserRole[] }>();
  roles.forEach(r => {
    const existing = userMap.get(r.user_id);
    const name = (r as any).profile?.full_name || r.user_id.slice(0, 8);
    if (existing) { existing.roles.push(r); }
    else { userMap.set(r.user_id, { name, roles: [r] }); }
  });

  const inputClass = crmInputClass;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl md:text-2xl">User Management</h1>
          <p className="text-[11px] text-muted-foreground/60 mt-1">{userMap.size} users · {roles.length} role assignments</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">
          <Plus className="w-3.5 h-3.5" /> Assign Role
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from(userMap.entries()).map(([userId, { name, roles: userRoles }]) => (
            <div key={userId} className="rounded-xl border border-border/20 bg-card/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground text-[10px] font-semibold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">{name}</p>
                    <p className="text-[9px] text-foreground/30 font-light font-mono">{userId.slice(0, 12)}…</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {userRoles.map(r => (
                  <div key={r.id} className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-3 py-1.5 group">
                    <Shield className="w-3 h-3 text-gold/50" />
                    <span className="text-[10px] tracking-[0.1em] uppercase font-light">{r.role.replace("_", " ")}</span>
                    <button onClick={() => removeRole(r.id)} className="ml-1 text-foreground/20 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Assign Role</DialogTitle></DialogHeader>
          <form onSubmit={addRole} className="space-y-4 mt-2">
            <div>
              <label className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light">User</label>
              <select value={form.user_id} onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))} className={inputClass}>
                <option value="">Select user…</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name || p.id.slice(0, 8)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as AppRole }))} className={inputClass}>
                {ALL_ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Assign</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
