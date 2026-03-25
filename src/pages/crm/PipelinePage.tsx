import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GripVertical, User, Plane, Calendar } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type LeadStatus = Database["public"]["Enums"]["lead_status"];

const STAGES: { status: LeadStatus; label: string; color: string }[] = [
  { status: "new", label: "New Inquiry", color: "border-blue-500/40 bg-blue-500/5" },
  { status: "contacted", label: "Contacted", color: "border-cyan-500/40 bg-cyan-500/5" },
  { status: "quote_sent", label: "Quoted", color: "border-amber-500/40 bg-amber-500/5" },
  { status: "negotiation", label: "Negotiation", color: "border-purple-500/40 bg-purple-500/5" },
  { status: "confirmed", label: "Confirmed", color: "border-emerald-500/40 bg-emerald-500/5" },
  { status: "lost", label: "Lost", color: "border-red-500/30 bg-red-500/5" },
];

interface Lead {
  id: string;
  status: LeadStatus;
  source: string | null;
  created_at: string;
  client_id: string | null;
  clients?: { full_name: string } | null;
  flight_requests?: { departure: string; destination: string; date: string | null; passengers: number | null }[];
}

const PipelinePage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*, clients(full_name), flight_requests(departure, destination, date, passengers)")
      .order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const moveToStage = async (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) { toast.error("Failed to update"); load(); }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (draggedId) { moveToStage(draggedId, status); setDraggedId(null); }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl">Pipeline</h1>
        <p className="text-[11px] text-muted-foreground/60 mt-1">{leads.length} leads · Drag cards to move between stages</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.status === stage.status);
          return (
            <div
              key={stage.status}
              className={`flex-shrink-0 w-64 rounded-xl border ${stage.color} p-3 flex flex-col`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.status)}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium text-foreground/60">{stage.label}</p>
                <span className="text-[10px] text-foreground/30 font-light bg-secondary/50 rounded-full w-5 h-5 flex items-center justify-center">{stageLeads.length}</span>
              </div>

              <div className="flex-1 space-y-2 min-h-[100px]">
                {stageLeads.map((lead, i) => {
                  const req = lead.flight_requests?.[0];
                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, lead.id)}
                      className={`bg-card rounded-lg p-3 border border-border/20 cursor-grab active:cursor-grabbing hover:border-gold/20 transition-all shadow-sm hover:shadow-md group ${draggedId === lead.id ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-foreground/15 mt-0.5 flex-shrink-0 group-hover:text-foreground/30 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User className="w-3 h-3 text-foreground/30" />
                            <p className="text-[11px] font-medium truncate">{lead.clients?.full_name ?? "Unknown"}</p>
                          </div>
                          {req && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <Plane className="w-3 h-3 text-gold/40" />
                              <p className="text-[10px] text-foreground/40 font-light truncate">{req.departure} → {req.destination}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-foreground/20" />
                              <p className="text-[9px] text-foreground/25 font-light">{new Date(lead.created_at).toLocaleDateString()}</p>
                            </div>
                            {lead.source && (
                              <span className="text-[8px] tracking-[0.1em] uppercase bg-secondary/50 text-foreground/30 px-1.5 py-0.5 rounded font-light">{lead.source}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelinePage;
