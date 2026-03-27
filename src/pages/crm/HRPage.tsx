import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JobApplicationsTab from "@/components/crm/JobApplicationsTab";

const roleColors: Record<string, string> = {
  admin: "bg-destructive/20 text-destructive",
  sales: "bg-blue-500/20 text-blue-400",
  operations: "bg-emerald-500/20 text-emerald-400",
  finance: "bg-amber-500/20 text-amber-400",
  account_management: "bg-purple-500/20 text-purple-400",
  hr: "bg-pink-500/20 text-pink-400",
  client: "bg-secondary text-muted-foreground",
};

const HRPage = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "applications">("staff");
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .neq("role", "client");

      if (!roles || roles.length === 0) { setLoading(false); return; }

      const userIds = [...new Set(roles.map((r) => r.user_id))];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone, city, country, company, title")
        .in("id", userIds);

      const staffList = userIds.map((uid) => {
        const profile = profiles?.find((p) => p.id === uid);
        const userRoles = roles.filter((r) => r.user_id === uid).map((r) => r.role);
        return { id: uid, ...profile, roles: userRoles };
      });

      setStaff(staffList);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-display font-semibold">Human Resources</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Staff directory, roles, and job applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border/10">
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 border-b-2 ${
            activeTab === "staff" ? "border-primary text-primary" : "border-transparent text-muted-foreground/40 hover:text-muted-foreground/60"
          }`}
        >
          Staff Directory
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 border-b-2 ${
            activeTab === "applications" ? "border-primary text-primary" : "border-transparent text-muted-foreground/40 hover:text-muted-foreground/60"
          }`}
        >
          Job Applications
        </button>
      </div>

      {activeTab === "applications" ? (
        <JobApplicationsTab />
      ) : (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
              <p className="text-[13px] text-muted-foreground/40 font-light">No staff members found</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/20 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/10">
                    {["Name", "Title", "Location", "Roles", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, i) => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium">{s.full_name || "Unnamed"}</p>
                        <p className="text-[10px] text-muted-foreground/40 font-light">{s.phone || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground/50 font-light">{s.title || "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground/50 font-light">
                        {[s.city, s.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.roles.map((r: string) => (
                            <span key={r} className={`text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded font-medium ${roleColors[r] || "bg-secondary text-muted-foreground"}`}>
                              {r.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Shield size={14} className="text-muted-foreground/20" strokeWidth={1.5} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HRPage;
