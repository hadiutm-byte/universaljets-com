import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  // Lead statuses
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  quote_sent: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  negotiation: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
  // Request statuses
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  quoted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  // Quote statuses
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  expired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  // Contract statuses
  signed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  // Invoice statuses
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  // Trip statuses
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  const colorClass = statusColors[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={`${colorClass} text-[10px] font-light capitalize`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
