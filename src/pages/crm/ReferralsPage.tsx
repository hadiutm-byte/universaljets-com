import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  invite_sent: "bg-blue-500/20 text-blue-400",
  accepted: "bg-amber-500/20 text-amber-400",
  qualified: "bg-emerald-500/20 text-emerald-400",
  reward_unlocked: "bg-primary/20 text-primary",
  credit_issued: "bg-primary/30 text-primary",
  credit_used: "bg-muted-foreground/20 text-muted-foreground",
};

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("referrals").select("*").order("created_at", { ascending: false });
      setReferrals(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Referral Pipeline</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Track referrals, qualifications, and credit rewards</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-20">
          <Gift className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No referrals yet</p>
          <p className="text-[11px] text-muted-foreground/30 font-light mt-1">Referrals will appear here when members invite others</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                {["Referred Name", "Email", "Status", "Reward", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-light">{r.referred_name}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground/50 font-light">{r.referred_email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || "bg-secondary text-muted-foreground"}`}>
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-light">{r.reward_amount ? `$${r.reward_amount}` : "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{new Date(r.created_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
