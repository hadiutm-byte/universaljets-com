import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";

const stages = [
  { value: "applied", label: "Applied", color: "bg-blue-500/20 text-blue-400" },
  { value: "under_review", label: "Under Review", color: "bg-amber-500/20 text-amber-400" },
  { value: "approved", label: "Approved", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "active", label: "Active", color: "bg-primary/20 text-primary" },
  { value: "rejected", label: "Rejected", color: "bg-destructive/20 text-destructive" },
];

const MembershipPipelinePage = () => {
  const { getMembershipApplications, updateStatus } = useCrmApi();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getMembershipApplications(filter || undefined);
      setApps(res?.data?.applications ?? []);
      setLoading(false);
    };
    load();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateStatus("membership_applications", id, status);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Membership Applications</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Review and manage membership pipeline</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("")}
            className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase rounded-lg border transition-all ${!filter ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground/50"}`}>
            All
          </button>
          {stages.map((s) => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase rounded-lg border transition-all ${filter === s.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground/50"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No applications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app, i) => {
            const stage = stages.find((s) => s.value === app.status) || stages[0];
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/20 bg-card/50 p-5 hover:border-border/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[14px] font-medium truncate">{app.full_name}</h3>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${stage.color}`}>{stage.label}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-[11px] text-muted-foreground/50 font-light">
                      <span>{app.email}</span>
                      <span>{app.phone || "—"}</span>
                      <span>{[app.city, app.country].filter(Boolean).join(", ") || "—"}</span>
                      <span>{app.company || "—"}</span>
                    </div>
                    {app.reason && <p className="text-[11px] text-muted-foreground/40 font-light mt-2 line-clamp-2">{app.reason}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                    {app.status === "applied" && (
                      <button onClick={() => updateStatus(app.id, "under_review")}
                        className="p-2 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-amber-400 hover:border-amber-400/30 transition-all" title="Move to Review">
                        <Eye size={14} strokeWidth={1.5} />
                      </button>
                    )}
                    {(app.status === "applied" || app.status === "under_review") && (
                      <>
                        <button onClick={() => updateStatus(app.id, "approved")}
                          className="p-2 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-emerald-400 hover:border-emerald-400/30 transition-all" title="Approve">
                          <CheckCircle size={14} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => updateStatus(app.id, "rejected")}
                          className="p-2 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-destructive hover:border-destructive/30 transition-all" title="Reject">
                          <XCircle size={14} strokeWidth={1.5} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[9px] text-muted-foreground/30">
                  <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                  {app.travel_frequency && <span>Flights/yr: {app.travel_frequency}</span>}
                  {app.preferred_tier && <span>Tier: {app.preferred_tier}</span>}
                  {app.invitation_code && <span>Code: {app.invitation_code}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MembershipPipelinePage;
