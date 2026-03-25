import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowDownLeft } from "lucide-react";

const ReceivablesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*, contracts(quotes(aircraft, flight_requests(departure, destination, clients(full_name))))")
        .eq("status", "pending")
        .order("due_date", { ascending: true });
      setInvoices(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const getAge = (dueDate: string | null) => {
    if (!dueDate) return "No due date";
    const days = Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000);
    if (days < 0) return `Due in ${Math.abs(days)}d`;
    if (days === 0) return "Due today";
    return `${days}d overdue`;
  };

  const getAgeColor = (dueDate: string | null) => {
    if (!dueDate) return "text-muted-foreground/40";
    const days = Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000);
    if (days < 0) return "text-emerald-400";
    if (days <= 7) return "text-amber-400";
    return "text-destructive";
  };

  const total = invoices.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Accounts Receivable</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Outstanding client invoices · Aging report</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-semibold">${total.toLocaleString()}</p>
          <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40">Total Outstanding</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20">
          <ArrowDownLeft className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No outstanding receivables</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                {["Client", "Route", "Amount", "Due Date", "Aging"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const q = inv.contracts?.quotes;
                const fr = q?.flight_requests;
                return (
                  <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-[12px] font-light">{fr?.clients?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground/50 font-light">
                      {fr ? `${fr.departure} → ${fr.destination}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-medium">${Number(inv.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className={`px-4 py-3 text-[11px] font-medium ${getAgeColor(inv.due_date)}`}>
                      {getAge(inv.due_date)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceivablesPage;
