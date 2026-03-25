import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Msg = { role: "user" | "assistant"; content: string };
type Stage = "hero" | "warning" | "details" | "interview" | "result" | "schedule";
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
    setTimeout(() => startInterview(), 300);
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: { messages: [{ role: "user", content: "I'm ready." }], candidateId },
      });
      if (error) throw error;
      setMessages([
        { role: "user", content: "I'm ready." },
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages([{ role: "assistant", content: "Talk. What's your background and why are you here?" }]);
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
        setTimeout(() => setStage("result"), 2500);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Answer the question." }]);
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-px h-12 bg-gradient-to-b from-transparent to-gold/30 mx-auto mb-10"
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-4xl md:text-6xl font-semibold mb-6 leading-tight"
              >
                You Don't Apply to<br />Universal Jets.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-display text-2xl md:text-3xl text-gold/70 font-light mb-8"
              >
                You Get Selected.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-foreground/30 text-sm font-light leading-relaxed mb-8 max-w-md mx-auto"
              >
                Your first conversation is not with HR.<br />
                It's with Ricky.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-foreground/40 text-xs font-light mb-14"
              >
                Or send your CV directly to{" "}
                <a href="mailto:hr@universaljets.com" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">hr@universaljets.com</a>
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={() => setStage("warning")}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-sm hover:shadow-[0_0_40px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500"
              >
                Face Ricky
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* RICKY WARNING */}
        {stage === "warning" && (
          <motion.section
            key="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto mb-10"
              >
                <span className="text-gold text-2xl font-display font-semibold">R</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mb-12"
              >
                <p className="text-foreground/70 text-sm font-light leading-[2]">
                  You are about to speak with Ricky.
                </p>
                <p className="text-foreground/50 text-sm font-light leading-[2]">
                  Senior Aviation Advisor at Universal Jets.
                </p>
                <div className="w-8 h-px bg-gold/20 mx-auto my-6" />
                <p className="text-foreground/40 text-sm font-light leading-[2]">
                  He evaluates people, not resumes.
                </p>
                <p className="text-foreground/25 text-xs font-light leading-[2] mt-6">
                  Proceed only if you are confident in how you think,<br />speak, and perform.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setStage("details")}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-sm hover:shadow-[0_0_40px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500"
                >
                  Start Interview
                </button>
                <div>
                  <a href="/" className="text-foreground/15 text-[10px] tracking-wider uppercase hover:text-foreground/30 transition-colors">
                    I'm not ready
                  </a>
                </div>
              </motion.div>
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
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/40 mb-6">
                Identify Yourself
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                Who are you?
              </h2>
              <p className="text-foreground/25 text-xs font-light mb-8">
                Ricky doesn't speak to unknowns.
              </p>
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
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-sm disabled:opacity-30 hover:shadow-[0_0_30px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
              >
                Enter
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
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center">
                  <span className="text-gold text-xs font-semibold">R</span>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/90">
                    Ricky
                  </p>
                  <p className="text-[9px] text-gold/40 tracking-[0.15em] uppercase font-light">
                    {loading ? "Evaluating..." : "Senior Aviation Advisor"}
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
                          ? "bg-gold/10 text-foreground/70 rounded-br-md"
                          : "bg-white/[0.03] text-foreground/60 rounded-bl-md border border-white/[0.03]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/[0.03] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gold/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gold/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gold/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.03] rounded-xl px-4 py-3 focus-within:border-gold/10 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Respond..."
                    className="flex-1 bg-transparent text-[13px] text-foreground/80 placeholder:text-foreground/15 outline-none font-light"
                    disabled={loading}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-20 hover:shadow-[0_0_15px_-3px_hsla(38,52%,50%,0.4)] transition-all duration-300"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-lg">
              {evaluation?.passed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/30 mx-auto mb-10" />
                  <p className="text-foreground/50 text-sm font-light mb-6 leading-[2]">
                    You're not bad.
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                    Let's see if you're consistent.
                  </h2>
                  <p className="text-foreground/30 text-xs font-light mb-12 leading-relaxed">
                    Schedule a face-to-face with our management team.
                  </p>
                  <button
                    onClick={() => setStage("schedule")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-sm hover:shadow-[0_0_40px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500"
                  >
                    Schedule Meeting
                    <Calendar size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-px h-12 bg-gradient-to-b from-transparent to-foreground/10 mx-auto mb-10" />
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                    You are not ready<br />for this environment.
                  </h2>
                  <div className="w-8 h-px bg-foreground/10 mx-auto mb-8" />
                  <a
                    href="/"
                    className="text-foreground/20 text-[10px] tracking-[0.3em] uppercase hover:text-foreground/40 transition-colors"
                  >
                    Exit
                  </a>
                </motion.div>
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
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/40 mb-6">
                Next Step
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                Select Your Time
              </h2>
              <p className="text-foreground/25 text-xs font-light mb-10">
                We confirm within 24 hours.
              </p>

              <div className="space-y-4 mb-10 text-left">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-2 block">Date</label>
                  <input type="date" className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-2 block">Time</label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light appearance-none">
                    <option value="">Select</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-2 block">Format</label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-sm px-4 py-3.5 text-sm text-foreground/80 outline-none focus:border-gold/20 transition-colors font-light appearance-none">
                    <option value="zoom">Video Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (candidateId) {
                    await supabase.from("candidates").update({ status: "scheduled" }).eq("id", candidateId);
                  }
                  alert("Confirmed. We'll be in touch.");
                }}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-sm hover:shadow-[0_0_40px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500"
              >
                Confirm
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
