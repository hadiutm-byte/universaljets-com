import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const actionColors: Record<string, string> = {
  created: "text-emerald-400",
  updated: "text-blue-400",
  status_changed: "text-amber-400",
  handoff: "text-purple-400",
  document_generated: "text-primary",
  note_added: "text-muted-foreground",
};

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Realtime removed for security — use refresh button instead

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Activity Log</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Real-time platform activity across all departments</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground transition-colors">
          <RefreshCw size={14} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <Activity className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No activity logged yet</p>
          <p className="text-[11px] text-muted-foreground/30 font-light mt-1">Actions will appear here as the platform is used</p>
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              className="flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-secondary/30 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${actionColors[log.action] || "text-foreground/60"}`}>
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground/30">on</span>
                  <span className="text-[11px] text-foreground/50 font-light">{log.entity_type.replace(/_/g, " ")}</span>
                  {log.department && (
                    <span className="text-[9px] tracking-[0.1em] uppercase bg-secondary/50 text-muted-foreground/40 px-1.5 py-0.5 rounded">
                      {log.department}
                    </span>
                  )}
                </div>
                {log.notes && <p className="text-[11px] text-muted-foreground/40 font-light mt-0.5">{log.notes}</p>}
              </div>
              <span className="text-[10px] text-muted-foreground/25 font-light flex-shrink-0">
                {new Date(log.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;
