import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, CheckCircle, XCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Msg = { role: "user" | "assistant"; content: string };
type Stage = "hero" | "prequalify" | "details" | "interview" | "result" | "schedule";
type EvalResult = { passed: boolean; average: number; summary: string } | null;

const CareersPage = () => {
  const [stage, setStage] = useState<Stage>("hero");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvalResult>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleDetailsSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const { data, error } = await supabase.from("candidates").insert({
      full_name: form.name,
      email: form.email,
      phone: form.phone || null,
    }).select("id").single();

    if (!error && data) {
      setCandidateId(data.id);
    }
    setStage("interview");
    // Send first message to start interview
    setTimeout(() => startInterview(), 300);
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: { messages: [{ role: "user", content: "I'm ready to begin." }], candidateId },
      });
      if (error) throw error;
      setMessages([
        { role: "user", content: "I'm ready to begin." },
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages([{ role: "assistant", content: "Let's begin. Tell me about your background in sales or aviation." }]);
    } finally {
      setLoading(false);
    }
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: { messages: newMessages, candidateId },
      });
      if (error) throw error;

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setTimeout(() => setStage("result"), 2000);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Let me rephrase — please continue." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, candidateId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <AnimatePresence mode="wait">
        {/* HERO */}
        {stage === "hero" && (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-8"
              >
                Universal Jets — Talent Evaluation
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-4xl md:text-6xl font-semibold mb-6 leading-tight"
              >
                This Is Where Closers<br />Are Selected.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-foreground/40 text-sm md:text-base font-light leading-relaxed mb-12"
              >
                Not everyone qualifies.<br />
                Start your evaluation process below.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => setStage("prequalify")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-medium text-sm tracking-wider uppercase rounded-sm hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
              >
                Start Live Interview
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* PRE-QUALIFICATION */}
        {stage === "prequalify" && (
          <motion.section
            key="prequalify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-xl">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-6">
                Before You Begin
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">
                This process is designed for<br />high performers only.
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  "You will be evaluated in real-time",
                  "You will be asked business-driven questions",
                  "Your answers will determine your eligibility",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1 h-1 rounded-full bg-gold/60 mt-2 shrink-0" />
                    <p className="text-foreground/50 text-sm font-light">{item}</p>
                  </motion.div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-foreground/25 text-xs font-light mb-10 leading-relaxed"
              >
                If you are not comfortable with pressure, negotiation, or high-value clients, do not proceed.
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setStage("details")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-medium text-sm tracking-wider uppercase rounded-sm hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
              >
                Continue to Interview
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* DETAILS CAPTURE */}
        {stage === "details" && (
          <motion.section
            key="details"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-md w-full">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-6">
                Identification
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">
                Before we begin, confirm your details.
              </h2>
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 placeholder:text-foreground/20 outline-none focus:border-gold/20 transition-colors font-light"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 placeholder:text-foreground/20 outline-none focus:border-gold/20 transition-colors font-light"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 placeholder:text-foreground/20 outline-none focus:border-gold/20 transition-colors font-light"
                />
              </div>
              <button
                onClick={handleDetailsSubmit}
                disabled={!form.name.trim() || !form.email.trim()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-medium text-sm tracking-wider uppercase rounded-sm disabled:opacity-30 hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
              >
                Begin Evaluation
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.section>
        )}

        {/* LIVE INTERVIEW */}
        {stage === "interview" && (
          <motion.section
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 pb-6 px-4"
          >
            <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold text-xs font-semibold">R</span>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/90">
                    Ricky
                  </p>
                  <p className="text-[9px] text-gold/50 tracking-[0.15em] uppercase font-light">
                    {loading ? "Evaluating…" : "Senior Aviation Advisor"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[13px] leading-[1.8] font-light whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-gold/15 text-foreground/80 rounded-br-md"
                          : "bg-white/5 text-foreground/65 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response…"
                    className="flex-1 bg-transparent text-[13px] text-foreground/80 placeholder:text-foreground/20 outline-none font-light"
                    disabled={loading}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-30 hover:shadow-[0_0_15px_-3px_hsla(38,52%,50%,0.4)] transition-all duration-300"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* RESULT */}
        {stage === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-lg">
              {evaluation?.passed ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle className="text-emerald-400" size={28} />
                  </motion.div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    You have been shortlisted.
                  </h2>
                  <p className="text-foreground/40 text-sm font-light mb-10 leading-relaxed">
                    Schedule a face-to-face meeting with our management team<br />to proceed to the next stage.
                  </p>
                  <button
                    onClick={() => setStage("schedule")}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-medium text-sm tracking-wider uppercase rounded-sm hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
                  >
                    Schedule Interview
                    <Calendar size={16} />
                  </button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-8"
                  >
                    <XCircle className="text-foreground/30" size={28} />
                  </motion.div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Thank you for your time.
                  </h2>
                  <p className="text-foreground/40 text-sm font-light mb-10 leading-relaxed">
                    At this stage, we are looking for profiles with<br />stronger commercial alignment.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-foreground/50 font-medium text-sm tracking-wider uppercase rounded-sm hover:border-white/20 transition-all duration-500"
                  >
                    Exit
                  </a>
                </>
              )}
            </div>
          </motion.section>
        )}

        {/* SCHEDULE */}
        {stage === "schedule" && (
          <motion.section
            key="schedule"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-md w-full text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-6">
                Final Step
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                Schedule Your Meeting
              </h2>
              <p className="text-foreground/40 text-sm font-light mb-10 leading-relaxed">
                Select a time that works for you.<br />
                Our team will confirm within 24 hours.
              </p>

              <div className="space-y-4 mb-8 text-left">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 block">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 block">
                    Preferred Time
                  </label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light appearance-none">
                    <option value="">Select time</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2 block">
                    Format
                  </label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light appearance-none">
                    <option value="zoom">Video Call (Zoom)</option>
                    <option value="in-person">In-Person Meeting</option>
                  </select>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (candidateId) {
                    await supabase.from("candidates").update({ status: "scheduled" }).eq("id", candidateId);
                  }
                  alert("Your meeting has been requested. We'll confirm shortly.");
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-medium text-sm tracking-wider uppercase rounded-sm hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
              >
                Confirm Booking
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CareersPage;
