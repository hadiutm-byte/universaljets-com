import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { toast } from "sonner";
import {
  ArrowLeft, Send, FileText, Receipt, CheckCircle, Plane, Clock, DollarSign, Loader2, Copy,
  ArrowRight, History,
} from "lucide-react";

const QuoteDetailPage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const [quote, setQuote] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [operatorReqs, setOperatorReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canManageOps = roles.includes("admin") || roles.includes("operations");
  const canManageFinance = roles.includes("admin") || roles.includes("finance");

  const load = useCallback(async () => {
    if (!quoteId) return;
    setLoading(true);
    const { data } = await supabase
      .from("quotes")
      .select("*, flight_requests(*, clients(full_name, email, phone))")
      .eq("id", quoteId)
      .single();
    setQuote(data);

    // Activity log
    const { data: logs } = await supabase
      .from("activity_log")
      .select("*")
      .eq("entity_id", quoteId)
      .order("created_at", { ascending: false });
    setActivity(logs ?? []);

    // Operator requests
    const { data: ops } = await supabase
      .from("operator_requests")
      .select("*")
      .or(`request_id.eq.${data?.request_id},quote_id.eq.${quoteId}`)
      .order("created_at", { ascending: false });
    setOperatorReqs(ops ?? []);

    setLoading(false);
  }, [quoteId]);

  useEffect(() => { load(); }, [load]);

  const logActivity = async (action: string, notes?: string) => {
    await supabase.from("activity_log").insert({
      entity_type: "quote",
      entity_id: quoteId!,
      action,
      action_by: user?.id,
      department: roles[0] || "sales",
      notes,
    });
  };

  const handleSendQuote = async () => {
    setActionLoading("send");
    await supabase.from("quotes").update({ status: "sent" }).eq("id", quoteId!);
    await logActivity("quote_sent", "Quote sent to client");
    toast.success("Quote marked as sent");
    setActionLoading(null);
    load();
  };

  const handleAcceptQuote = async () => {
    setActionLoading("accept");
    await supabase.from("quotes").update({ status: "accepted" }).eq("id", quoteId!);
    await logActivity("quote_accepted", "Client accepted quote");
    toast.success("Quote marked as accepted");
    setActionLoading(null);
    load();
  };

  const handleGenerateContract = async () => {
    if (!quote) return;
    setActionLoading("contract");
    const { data: contract, error } = await supabase.from("contracts").insert({
      quote_id: quote.id,
      status: "draft",
    }).select("id").single();

    if (error) { toast.error(error.message); setActionLoading(null); return; }
    await logActivity("contract_generated", `Contract ${contract.id.slice(0, 8)} created`);
    toast.success("Contract generated");
    setActionLoading(null);
    load();
  };

  const handleGenerateInvoice = async () => {
    if (!quote) return;
    setActionLoading("invoice");
    // Find the contract for this quote
    const { data: contracts } = await supabase.from("contracts").select("id").eq("quote_id", quote.id).limit(1);
    const contractId = contracts?.[0]?.id;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const { error } = await supabase.from("invoices").insert({
      contract_id: contractId || null,
      amount: quote.price || 0,
      status: "pending",
      due_date: dueDate.toISOString(),
    });

    if (error) { toast.error(error.message); setActionLoading(null); return; }
    await logActivity("invoice_generated", `Invoice for $${Number(quote.price).toLocaleString()}`);
    toast.success("Invoice generated");
    setActionLoading(null);
    load();
  };

  const handleMarkPaid = async () => {
    setActionLoading("paid");
    // Find invoices linked to this quote's contract
    const { data: contracts } = await supabase.from("contracts").select("id").eq("quote_id", quoteId!);
    if (contracts?.length) {
      await supabase.from("invoices").update({ status: "paid" }).in("contract_id", contracts.map(c => c.id));
    }
    await logActivity("payment_received", "Invoice marked as paid");
    toast.success("Marked as paid");
    setActionLoading(null);
    load();
  };

  const handleGenerateBooking = async () => {
    if (!quote?.flight_requests) return;
    setActionLoading("booking");
    const fr = quote.flight_requests;
    const { data: contracts } = await supabase.from("contracts").select("id").eq("quote_id", quote.id).limit(1);

    const { error } = await supabase.from("trips").insert({
      client_id: fr.client_id,
      departure: fr.departure,
      destination: fr.destination,
      aircraft: quote.aircraft,
      date: fr.date,
      contract_id: contracts?.[0]?.id || null,
      status: "scheduled",
    });

    if (error) { toast.error(error.message); setActionLoading(null); return; }
    await logActivity("booking_created", "Trip/booking generated");
    await supabase.from("flight_requests").update({ status: "confirmed" }).eq("id", fr.id);
    toast.success("Booking created");
    setActionLoading(null);
    load();
  };

  const copyQuoteLink = () => {
    const url = `${window.location.origin}/quote/${quoteId}`;
    navigator.clipboard.writeText(url);
    toast.success("Quote link copied");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!quote) return <div className="text-center py-20 text-muted-foreground">Quote not found</div>;

  const fr = quote.flight_requests;
  const client = fr?.clients;

  const ActionBtn = ({ icon: Icon, label, onClick, loading: isLoading, variant = "default" }: any) => (
    <button
      onClick={onClick}
      disabled={isLoading || actionLoading !== null}
      className={`flex items-center gap-2 px-4 py-2.5 text-[9px] tracking-[0.15em] uppercase font-medium rounded-lg transition-all disabled:opacity-40 ${
        variant === "primary"
          ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_20px_-6px_hsla(43,74%,49%,0.4)]"
          : "bg-secondary/50 text-foreground hover:bg-secondary/80 border border-border/20"
      }`}
    >
      {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Icon size={10} />}
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate("/crm/quotes")} className="flex items-center gap-2 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
        <ArrowLeft size={12} /> Back to Quotes
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl mb-1">
            Quote: {fr?.departure || "—"} → {fr?.destination || "—"}
          </h1>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
            {client && <span>{client.full_name}</span>}
            <StatusBadge status={quote.status} />
            <span>{quote.aircraft}</span>
            {quote.price && <span className="text-primary font-medium">${Number(quote.price).toLocaleString()}</span>}
          </div>
        </div>
        <button onClick={copyQuoteLink} className="flex items-center gap-1.5 px-3 py-2 text-[9px] tracking-wider uppercase bg-secondary/50 hover:bg-secondary rounded-lg border border-border/20 transition-all">
          <Copy size={10} /> Copy Link
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-border/20 bg-card/50">
        <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground/40 self-center mr-2">Actions</span>
        {quote.status === "draft" && <ActionBtn icon={Send} label="Send Quote" onClick={handleSendQuote} loading={actionLoading === "send"} variant="primary" />}
        {quote.status === "sent" && <ActionBtn icon={CheckCircle} label="Mark Accepted" onClick={handleAcceptQuote} loading={actionLoading === "accept"} variant="primary" />}
        {quote.status === "accepted" && canManageOps && <ActionBtn icon={FileText} label="Generate Contract" onClick={handleGenerateContract} loading={actionLoading === "contract"} variant="primary" />}
        {quote.status === "accepted" && canManageFinance && <ActionBtn icon={Receipt} label="Generate Invoice" onClick={handleGenerateInvoice} loading={actionLoading === "invoice"} />}
        {canManageFinance && <ActionBtn icon={DollarSign} label="Mark Paid" onClick={handleMarkPaid} loading={actionLoading === "paid"} />}
        {quote.status === "accepted" && canManageOps && <ActionBtn icon={Plane} label="Generate Booking" onClick={handleGenerateBooking} loading={actionLoading === "booking"} />}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quote Info */}
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Quote Details</h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted-foreground/60">Aircraft</span><span>{quote.aircraft || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Price</span><span className="font-medium">{quote.price ? `$${Number(quote.price).toLocaleString()}` : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Valid Until</span><span>{quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Created</span><span>{new Date(quote.created_at).toLocaleDateString()}</span></div>
          </div>
        </div>

        {/* Client Info */}
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Client</h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted-foreground/60">Name</span><span>{client?.full_name || fr?.contact_name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Email</span><span>{client?.email || fr?.contact_email || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Phone</span><span>{client?.phone || fr?.contact_phone || "—"}</span></div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Flight Request</h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted-foreground/60">Route</span><span>{fr?.departure} → {fr?.destination}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Date</span><span>{fr?.date ? new Date(fr.date).toLocaleDateString() : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Passengers</span><span>{fr?.passengers || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Trip Type</span><span>{fr?.trip_type || "—"}</span></div>
          </div>
        </div>

        {/* Operator Requests */}
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Operator Requests</h3>
          {operatorReqs.length === 0 ? (
            <p className="text-[11px] text-muted-foreground/40">No operator requests yet</p>
          ) : (
            <div className="space-y-2">
              {operatorReqs.map(op => (
                <div key={op.id} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-secondary/20">
                  <div>
                    <span className="font-medium">{op.operator_name}</span>
                    <span className="text-muted-foreground/50 ml-2">{op.aircraft_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {op.offered_price && <span className="text-primary">${Number(op.offered_price).toLocaleString()}</span>}
                    <StatusBadge status={op.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-xl border border-border/20 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={12} className="text-muted-foreground/40" />
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Activity Timeline</h3>
        </div>
        {activity.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/40">No activity recorded yet</p>
        ) : (
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-foreground/80">{a.action.replace(/_/g, " ")}</p>
                  {a.notes && <p className="text-[10px] text-muted-foreground/50">{a.notes}</p>}
                  <p className="text-[9px] text-muted-foreground/30 mt-0.5">
                    {new Date(a.created_at).toLocaleString()} · {a.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteDetailPage;
