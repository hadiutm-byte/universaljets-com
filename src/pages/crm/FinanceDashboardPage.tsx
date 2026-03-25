import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt, ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const FinanceDashboardPage = () => {
  const [stats, setStats] = useState({
    totalReceivable: 0, totalPayable: 0, pendingInvoices: 0, paidInvoices: 0,
    pendingPayments: 0, completedPayments: 0, unreconciled: 0, totalCredits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [invoicesRes, paymentsInRes, paymentsOutRes, bankRes, creditsRes] = await Promise.all([
        supabase.from("invoices").select("amount, status"),
        supabase.from("payments").select("amount, status").eq("payment_type", "incoming"),
        supabase.from("payments").select("amount, status").eq("payment_type", "outgoing"),
        supabase.from("bank_transactions").select("reconciled"),
        supabase.from("credit_notes").select("amount, status").eq("note_type", "credit"),
      ]);

      const invoices = invoicesRes.data ?? [];
      const incoming = paymentsInRes.data ?? [];
      const outgoing = paymentsOutRes.data ?? [];
      const bankTx = bankRes.data ?? [];
      const credits = creditsRes.data ?? [];

      setStats({
        totalReceivable: invoices.filter(i => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0),
        totalPayable: outgoing.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
        pendingInvoices: invoices.filter(i => i.status === "pending").length,
        paidInvoices: invoices.filter(i => i.status === "paid").length,
        pendingPayments: incoming.filter(p => p.status === "pending").length,
        completedPayments: incoming.filter(p => p.status === "completed").length,
        unreconciled: bankTx.filter(t => !t.reconciled).length,
        totalCredits: credits.filter(c => c.status === "issued").reduce((s, c) => s + Number(c.amount), 0),
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Receivables", value: `$${stats.totalReceivable.toLocaleString()}`, icon: ArrowDownLeft, color: "text-emerald-400", href: "/crm/finance/receivables" },
    { label: "Payables", value: `$${stats.totalPayable.toLocaleString()}`, icon: ArrowUpRight, color: "text-amber-400", href: "/crm/finance/payables" },
    { label: "Pending Invoices", value: stats.pendingInvoices, icon: Receipt, color: "text-blue-400", href: "/crm/invoices" },
    { label: "Payments", value: `${stats.completedPayments} completed`, icon: CreditCard, color: "text-primary", href: "/crm/finance/payments" },
    { label: "Unreconciled", value: stats.unreconciled, icon: Landmark, color: "text-destructive", href: "/crm/finance/bank" },
    { label: "Credits Issued", value: `$${stats.totalCredits.toLocaleString()}`, icon: FileText, color: "text-purple-400", href: "/crm/finance/credits" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl md:text-2xl">Finance & Accounting</h1>
        <p className="text-[11px] text-muted-foreground/60 mt-1">Receivables · Payables · Reconciliation · Statements</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cards.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={c.href} className="block rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group">
                  <c.icon className={`w-5 h-5 ${c.color} opacity-60 group-hover:opacity-100 transition-opacity mb-4`} strokeWidth={1.5} />
                  <p className="text-2xl font-display font-semibold">{c.value}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light mt-1">{c.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/crm/finance/statements" className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Financial Statements</span>
              </div>
              <p className="text-[12px] text-muted-foreground/40 font-light">P&L summary, balance sheet, period closing</p>
            </Link>
            <div className="rounded-xl border border-border/20 bg-card/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400/60" strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Attention Required</span>
              </div>
              <p className="text-[12px] text-muted-foreground/40 font-light">
                {stats.pendingInvoices > 0 ? `${stats.pendingInvoices} pending invoices · ` : ""}
                {stats.unreconciled > 0 ? `${stats.unreconciled} unreconciled transactions` : "All clear"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboardPage;
