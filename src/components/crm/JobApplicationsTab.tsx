import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, X, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  ai_score: number | null;
  interview_answers: any;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  reviewed: "bg-amber-500/20 text-amber-400",
  interviewed: "bg-purple-500/20 text-purple-400",
  rejected: "bg-destructive/20 text-destructive",
  hired: "bg-emerald-500/20 text-emerald-400",
};

const JobApplicationsTab = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    let query = supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      toast({ title: "Error loading candidates", description: error.message, variant: "destructive" });
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCandidates(); }, [filterStatus]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("candidates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchCandidates();
      if (selected?.id === id) setSelected({ ...selected, status: newStatus });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-display font-semibold">Job Applications</h2>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-0.5">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-[11px] rounded-lg border border-border/20 bg-secondary/30 text-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="interviewed">Interviewed</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No applications found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                {["Name", "Email", "Phone", "Applied", "Score", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/5 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 text-[12px] font-medium">{c.full_name}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/50 font-light">{c.email}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/50 font-light">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/50 font-light">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/50 font-light">
                    {c.ai_score != null ? `${c.ai_score}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded font-medium border-0 cursor-pointer ${statusColors[c.status] || "bg-secondary text-muted-foreground"}`}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(c)}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground/40 hover:text-primary"
                      title="View details"
                    >
                      <Eye size={14} strokeWidth={1.5} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/20 rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-semibold">{selected.full_name}</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-secondary/50 rounded-lg">
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-3 text-[12px]">
              <div><span className="text-muted-foreground/50">Email:</span> <span className="ml-2">{selected.email}</span></div>
              <div><span className="text-muted-foreground/50">Phone:</span> <span className="ml-2">{selected.phone || "Not provided"}</span></div>
              <div><span className="text-muted-foreground/50">Applied:</span> <span className="ml-2">{new Date(selected.created_at).toLocaleDateString()}</span></div>
              <div><span className="text-muted-foreground/50">AI Score:</span> <span className="ml-2">{selected.ai_score != null ? `${selected.ai_score}%` : "Not scored"}</span></div>
              <div>
                <span className="text-muted-foreground/50">Status:</span>
                <span className={`ml-2 text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded font-medium ${statusColors[selected.status] || "bg-secondary text-muted-foreground"}`}>
                  {selected.status}
                </span>
              </div>
              {selected.interview_answers && (
                <div className="mt-4 pt-4 border-t border-border/10">
                  <p className="text-muted-foreground/50 mb-2 text-[11px] font-medium uppercase tracking-[0.15em]">Interview Answers</p>
                  <pre className="text-[11px] text-muted-foreground/60 whitespace-pre-wrap bg-secondary/20 rounded-lg p-3 font-light">
                    {typeof selected.interview_answers === "string" ? selected.interview_answers : JSON.stringify(selected.interview_answers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsTab;
