import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plane, Users, Ruler, Clock, Briefcase, CheckCircle, XCircle, Calendar, Shield, MapPin } from "lucide-react";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import { toast } from "sonner";

const QuoteViewPage = () => {
  const { quoteId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    if (!quoteId) return;
    const loadQuote = async () => {
      const { data } = await supabase
        .from("quotes")
        .select("*, flight_requests(departure, destination, date, passengers, trip_type, preferred_aircraft_category, contact_name)")
        .eq("id", quoteId)
        .single();
      setQuote(data);
      setLoading(false);
    };
    loadQuote();
  }, [quoteId]);

  const handleAccept = async () => {
    if (!quote) return;
    setAccepting(true);
    const { error } = await supabase.from("quotes").update({ status: "accepted" }).eq("id", quote.id);
    if (error) { toast.error("Failed to accept quote"); setAccepting(false); return; }
    setResponded(true);
    setAccepting(false);
    toast.success("Quote accepted! Our team will contact you shortly.");
  };

  const handleDecline = async () => {
    if (!quote) return;
    setDeclining(true);
    const { error } = await supabase.from("quotes").update({ status: "rejected" }).eq("id", quote.id);
    if (error) { toast.error("Failed to decline quote"); setDeclining(false); return; }
    setResponded(true);
    setDeclining(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="w-6 h-6 border-2 border-[#A8850F]/30 border-t-[#A8850F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <Plane className="w-12 h-12 text-[#A8850F]/20 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-[#1a1a1a] mb-2">Quote Not Found</h1>
          <p className="text-[#666] text-sm">This quote may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  const fr = quote.flight_requests;
  const category = getAircraftCategory(quote.aircraft || "");
  const image = getAircraftImage(quote.aircraft || "");
  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();
  const isResolved = quote.status === "accepted" || quote.status === "rejected" || responded;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <div className="bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#A8850F]" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#A8850F] font-light">Universal Jets</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-2">
            Your Charter Quote
          </h1>
          {fr?.contact_name && (
            <p className="text-[#999] text-sm font-light">Prepared for {fr.contact_name}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Route Summary */}
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={14} className="text-[#A8850F]" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#A8850F] font-medium">Route</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-2xl font-serif text-[#1a1a1a]">{fr?.departure || "—"}</p>
              <p className="text-[11px] text-[#999] mt-1">Departure</p>
            </div>
            <div className="flex-shrink-0 px-6">
              <Plane className="w-5 h-5 text-[#A8850F] rotate-90" />
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-serif text-[#1a1a1a]">{fr?.destination || "—"}</p>
              <p className="text-[11px] text-[#999] mt-1">Destination</p>
            </div>
          </div>
          {fr?.date && (
            <div className="mt-6 pt-4 border-t border-[#f0ede5] flex items-center justify-center gap-2 text-[12px] text-[#666]">
              <Calendar size={12} />
              {new Date(fr.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {fr.trip_type === "round_trip" && <span className="ml-2 px-2 py-0.5 bg-[#f5f2eb] text-[#A8850F] text-[9px] tracking-wider uppercase rounded">Round Trip</span>}
            </div>
          )}
        </div>

        {/* Aircraft */}
        <div className="bg-white rounded-2xl border border-[#e8e4dc] overflow-hidden shadow-sm">
          <div className="aspect-[21/9] overflow-hidden">
            <img src={image} alt={quote.aircraft} className="w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={12} className="text-[#A8850F]" />
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#A8850F] font-medium">Verified Aircraft</span>
            </div>
            <h2 className="text-2xl font-serif text-[#1a1a1a] mb-4">{quote.aircraft || "Private Jet"}</h2>
            {category && (
              <span className="inline-block px-3 py-1 bg-[#f5f2eb] text-[#A8850F] text-[9px] tracking-[0.2em] uppercase rounded-full mb-6">{category}</span>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {fr?.passengers && (
                <div className="flex items-start gap-3">
                  <Users size={16} className="text-[#A8850F] mt-0.5" />
                  <div>
                    <p className="text-[11px] text-[#999] uppercase tracking-wider">Passengers</p>
                    <p className="text-[15px] text-[#1a1a1a] font-medium">{fr.passengers}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Briefcase size={16} className="text-[#A8850F] mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#999] uppercase tracking-wider">Luggage</p>
                  <p className="text-[15px] text-[#1a1a1a] font-medium">Included</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Ruler size={16} className="text-[#A8850F] mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#999] uppercase tracking-wider">Category</p>
                  <p className="text-[15px] text-[#1a1a1a] font-medium">{category || "Premium"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#A8850F] mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#999] uppercase tracking-wider">Validity</p>
                  <p className="text-[15px] text-[#1a1a1a] font-medium">
                    {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#999] mb-2">Total Amount</p>
              <p className="text-4xl font-serif text-[#1a1a1a]">
                {quote.price ? `$${Number(quote.price).toLocaleString()}` : "Price on request"}
              </p>
              <p className="text-[11px] text-[#999] mt-1">All-inclusive charter price · USD</p>
            </div>
            {isExpired && (
              <span className="px-4 py-2 bg-red-50 text-red-600 text-[10px] tracking-wider uppercase rounded-lg">Expired</span>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-8 shadow-sm">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-[#A8850F] mb-4">Terms & Conditions Summary</h3>
          <ul className="space-y-2 text-[12px] text-[#666] leading-relaxed">
            <li>• Quote valid until {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "confirmed"}</li>
            <li>• Full payment required prior to departure</li>
            <li>• Cancellation policy applies as per charter agreement</li>
            <li>• Aircraft subject to availability at time of confirmation</li>
            <li>• All prices in USD unless stated otherwise</li>
          </ul>
        </div>

        {/* Actions */}
        {!isResolved && !isExpired && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 py-4 bg-[#0a0a0a] text-white text-[10px] tracking-[0.3em] uppercase font-medium rounded-xl hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={14} />
              {accepting ? "Processing..." : "Accept Quote"}
            </button>
            <button
              onClick={handleDecline}
              disabled={declining}
              className="flex-1 py-4 bg-white text-[#1a1a1a] border border-[#e8e4dc] text-[10px] tracking-[0.3em] uppercase font-medium rounded-xl hover:bg-[#f5f2eb] transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={14} />
              {declining ? "Processing..." : "Decline"}
            </button>
          </div>
        )}

        {isResolved && (
          <div className="text-center py-8">
            {(quote.status === "accepted" || (responded && !declining)) ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-serif text-[#1a1a1a] mb-2">Quote Accepted</h3>
                <p className="text-[#666] text-sm">Our team will be in touch shortly to finalize your charter.</p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-[#999] mx-auto mb-3" />
                <h3 className="text-xl font-serif text-[#1a1a1a] mb-2">Quote Declined</h3>
                <p className="text-[#666] text-sm">Thank you for considering Universal Jets. We're here whenever you need us.</p>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-12 border-t border-[#e8e4dc]">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#A8850F] mb-2">Universal Jets</p>
          <p className="text-[11px] text-[#999]">Private Aviation · Worldwide</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteViewPage;
