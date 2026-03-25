import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const FinancialStatementsPage = () => {
  const [data, setData] = useState({ revenue: 0, expenses: 0, receivables: 0, payables: 0, credits: 0, paidInvoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [invoicesRes, paymentsInRes, paymentsOutRes, creditsRes] = await Promise.all([
        supabase.from("invoices").select("amount, status"),
        supabase.from("payments").select("amount, status").eq("payment_type", "incoming"),
        supabase.from("payments").select("amount, status").eq("payment_type", "outgoing"),
        supabase.from("credit_notes").select("amount, note_type, status"),
      ]);

      const invoices = invoicesRes.data ?? [];
      const incoming = paymentsInRes.data ?? [];
      const outgoing = paymentsOutRes.data ?? [];
      const credits = creditsRes.data ?? [];

      setData({
        revenue: incoming.filter(p => p.status === "completed").reduce((s, p) => s + Number(p.amount), 0),
        expenses: outgoing.filter(p => p.status === "completed").reduce((s, p) => s + Number(p.amount), 0),
        receivables: invoices.filter(i => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0),
        payables: outgoing.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
        credits: credits.filter(c => c.status === "issued" && c.note_type === "credit").reduce((s, c) => s + Number(c.amount), 0),
        paidInvoices: invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0),
      });
      setLoading(false);
    };
    load();
  }, []);

  const netIncome = data.revenue - data.expenses;
  const netAssets = data.receivables - data.payables;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-display font-semibold">Financial Statements</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">P&L summary · Balance sheet · Period overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* P&L Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/20 bg-card/50 p-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-light mb-5">Profit & Loss Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/10">
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400/60" strokeWidth={1.5} /><span className="text-[12px] font-light">Revenue (Received)</span></div>
              <span className="text-[14px] font-display font-semibold text-emerald-400">${data.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/10">
              <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-amber-400/60" strokeWidth={1.5} /><span className="text-[12px] font-light">Expenses (Paid Out)</span></div>
              <span className="text-[14px] font-display font-semibold text-amber-400">${data.expenses.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t-2 border-border/20">
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary/60" strokeWidth={1.5} /><span className="text-[12px] font-medium">Net Income</span></div>
              <span className={`text-[16px] font-display font-bold ${netIncome >= 0 ? "text-emerald-400" : "text-destructive"}`}>${netIncome.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Balance Sheet */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border/20 bg-card/50 p-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-light mb-5">Balance Sheet Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/30 mb-2">Assets</p>
              <div className="flex items-center justify-between py-2 border-b border-border/10">
                <span className="text-[12px] font-light">Accounts Receivable</span>
                <span className="text-[13px] font-display font-medium">${data.receivables.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/10">
                <span className="text-[12px] font-light">Cash Received</span>
                <span className="text-[13px] font-display font-medium">${data.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/30 mb-2">Liabilities</p>
              <div className="flex items-center justify-between py-2 border-b border-border/10">
                <span className="text-[12px] font-light">Accounts Payable</span>
                <span className="text-[13px] font-display font-medium">${data.payables.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/10">
                <span className="text-[12px] font-light">Outstanding Credits</span>
                <span className="text-[13px] font-display font-medium">${data.credits.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t-2 border-border/20">
              <span className="text-[12px] font-medium">Net Position</span>
              <span className={`text-[16px] font-display font-bold ${netAssets >= 0 ? "text-emerald-400" : "text-destructive"}`}>${netAssets.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialStatementsPage;
