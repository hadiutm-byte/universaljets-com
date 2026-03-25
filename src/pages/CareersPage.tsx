import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, Calendar, Briefcase, Users, Globe, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Msg = { role: "user" | "assistant"; content: string };
type Stage = "hero" | "culture" | "warning" | "details" | "interview" | "result" | "schedule";
type EvalResult = { passed: boolean; average: number; summary: string } | null;

const VALUES = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Operate across 190+ countries, connecting clients to the world's most exclusive destinations.",
  },
  {
    icon: Users,
    title: "People First",
    description: "Every team member is valued. We invest in growth, mentorship, and long-term careers.",
  },
  {
    icon: Briefcase,
    title: "Excellence Always",
    description: "We don't settle. From operations to client service, precision defines everything we do.",
  },
];

const POSITIONS = [
  { title: "Charter Sales Executive", location: "Dubai, UAE", type: "Full-time" },
  { title: "Operations Coordinator", location: "London, UK", type: "Full-time" },
  { title: "Membership Concierge", location: "Remote", type: "Full-time" },
  { title: "Finance Analyst", location: "Dubai, UAE", type: "Full-time" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const sectionFade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: EASE as unknown as [number, number, number, number] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE as unknown as [number, number, number, number] } },
};

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
    const { data, error } = await supabase
      .from("candidates")
      .insert({ full_name: form.name, email: form.email, phone: form.phone || null })
      .select("id")
      .single();
    if (!error && data) setCandidateId(data.id);
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
      setMessages([{ role: "assistant", content: "Tell me about yourself and why you want to work in private aviation." }]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setTimeout(() => setStage("result"), 2500);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Please elaborate on your answer." }]);
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
        {/* ═══════════ HERO ═══════════ */}
        {stage === "hero" && (
          <motion.div key="hero" {...sectionFade}>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
              {/* Subtle warm gradient background */}
              <div className="absolute inset-0 bg-[hsl(var(--muted))]" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--gold)) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
                <motion.p
                  {...fadeUp}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-8"
                >
                  Careers at Universal Jets
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-8"
                />

                <motion.h1
                  {...fadeUp}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6"
                >
                  You Don't Apply.
                  <br />
                  <span className="text-primary">You Get Selected.</span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto mb-4"
                >
                  We're building the future of private aviation.
                  <br />
                  If you belong here, you'll know.
                </motion.p>

                <motion.p
                  {...fadeUp}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-muted-foreground/60 text-xs font-light mb-12"
                >
                  Or send your CV to{" "}
                  <a
                    href="mailto:hr@universaljets.com"
                    className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30"
                  >
                    hr@universaljets.com
                  </a>
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <button
                    onClick={() => setStage("culture")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Explore Careers
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => setStage("warning")}
                    className="inline-flex items-center gap-3 px-10 py-4 border border-foreground/10 text-foreground/70 font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:border-primary/30 hover:text-primary transition-all duration-300"
                  >
                    Face Ricky — AI Interview
                  </button>
                </motion.div>
              </div>
            </section>

            {/* Values Section */}
            <section className="py-24 md:py-32 px-6 bg-background">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={stagger}
                  className="text-center mb-16"
                >
                  <motion.p variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">
                    Our Values
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-semibold">
                    What Drives Us
                  </motion.h2>
                </motion.div>

                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={stagger}
                  className="grid md:grid-cols-3 gap-8"
                >
                  {VALUES.map((v) => (
                    <motion.div
                      key={v.title}
                      variants={fadeUp}
                      className="group p-8 rounded-sm border border-foreground/[0.04] bg-muted/30 hover:border-primary/15 hover:bg-muted/60 transition-all duration-500"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/[0.06] flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                        <v.icon size={20} className="text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-3">{v.title}</h3>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">{v.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Open Positions */}
            <section className="py-24 md:py-32 px-6 bg-muted/40">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={stagger}
                  className="text-center mb-16"
                >
                  <motion.p variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">
                    Open Positions
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Current Opportunities
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-muted-foreground text-sm font-light max-w-md mx-auto">
                    Each role is handpicked. We don't mass-hire — we select individuals who raise the standard.
                  </motion.p>
                </motion.div>

                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={stagger}
                  className="space-y-3"
                >
                  {POSITIONS.map((pos) => (
                    <motion.div
                      key={pos.title}
                      variants={fadeUp}
                      onClick={() => setStage("warning")}
                      className="group flex items-center justify-between p-6 rounded-sm border border-foreground/[0.04] bg-background hover:border-primary/20 cursor-pointer transition-all duration-400"
                    >
                      <div>
                        <h3 className="font-display text-base font-semibold group-hover:text-primary transition-colors duration-300">
                          {pos.title}
                        </h3>
                        <p className="text-muted-foreground text-xs font-light mt-1">
                          {pos.location} · {pos.type}
                        </p>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* CTA to AI Interview */}
            <section className="py-24 md:py-32 px-6 bg-background">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={stagger}
                >
                  <motion.div variants={fadeUp} className="w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-8" />
                  <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Ready to Prove Yourself?
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-muted-foreground text-sm font-light leading-relaxed max-w-md mx-auto mb-10">
                    Skip the resume. Our AI interviewer, Ricky, evaluates how you think, speak, and perform — in real time.
                  </motion.p>
                  <motion.button
                    variants={fadeUp}
                    onClick={() => setStage("warning")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Start AI Interview
                    <ArrowRight size={15} />
                  </motion.button>
                </motion.div>
              </div>
            </section>

            <Footer />
          </motion.div>
        )}

        {/* ═══════════ CULTURE (scrollable detail page) ═══════════ */}
        {stage === "culture" && (
          <motion.div key="culture" {...sectionFade}>
            <section className="pt-32 pb-24 px-6 bg-background">
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => setStage("hero")}
                  className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.15em] uppercase hover:text-primary transition-colors mb-12"
                >
                  <ArrowRight size={12} className="rotate-180" /> Back
                </button>

                <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Life at Universal Jets</p>
                <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-6">
                  A Culture Built on
                  <br />
                  <span className="text-primary">Uncompromising Standards</span>
                </h2>
                <div className="w-12 h-px bg-primary/20 mb-10" />

                <div className="space-y-8 text-muted-foreground text-[15px] font-light leading-[2]">
                  <p>
                    Universal Jets isn't a typical workplace. We operate at the intersection of luxury, technology, and aviation —
                    where every detail matters and mediocrity is not tolerated.
                  </p>
                  <p>
                    Our team spans Dubai, London, and remote locations worldwide. We're a lean, high-performance group that moves
                    fast, thinks big, and delivers excellence for clients who expect nothing less.
                  </p>
                  <p>
                    We invest in our people: competitive compensation, flexible work arrangements, continuous learning, and a
                    clear path to leadership. If you're exceptional, you'll be recognized.
                  </p>
                </div>

                <div className="mt-16 grid sm:grid-cols-3 gap-6">
                  {[
                    { label: "Team Members", value: "40+" },
                    { label: "Countries", value: "12" },
                    { label: "Client Satisfaction", value: "98%" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-6 bg-muted/40 rounded-sm">
                      <p className="font-display text-2xl font-semibold text-primary mb-1">{stat.value}</p>
                      <p className="text-muted-foreground text-xs font-light tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <button
                    onClick={() => setStage("warning")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Start AI Interview
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </section>
            <Footer />
          </motion.div>
        )}

        {/* ═══════════ RICKY WARNING ═══════════ */}
        {stage === "warning" && (
          <motion.section key="warning" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="max-w-md text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-primary/[0.06] border border-primary/10 flex items-center justify-center mx-auto mb-10"
              >
                <span className="text-primary text-2xl font-display font-semibold">R</span>
              </motion.div>

              <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="space-y-5 mb-12">
                <p className="text-foreground/80 text-sm font-light leading-[2]">
                  You are about to speak with <span className="font-medium text-foreground">Ricky</span>.
                </p>
                <p className="text-muted-foreground text-sm font-light leading-[2]">
                  Senior Aviation Advisor at Universal Jets.
                </p>
                <div className="w-8 h-px bg-primary/20 mx-auto" />
                <p className="text-muted-foreground/70 text-sm font-light leading-[2]">
                  He evaluates people, not résumés.
                </p>
                <p className="text-muted-foreground/50 text-xs font-light leading-[2] pt-2">
                  Proceed only if you are confident in how you think,
                  <br />
                  speak, and perform.
                </p>
              </motion.div>

              <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="space-y-4">
                <button
                  onClick={() => setStage("details")}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                >
                  Start Interview
                </button>
                <div>
                  <button
                    onClick={() => setStage("hero")}
                    className="text-muted-foreground/40 text-[10px] tracking-[0.3em] uppercase hover:text-muted-foreground/60 transition-colors"
                  >
                    I'm not ready
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ═══════════ DETAILS CAPTURE ═══════════ */}
        {stage === "details" && (
          <motion.section key="details" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="max-w-md w-full">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 mb-6">Identify Yourself</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Who are you?</h2>
              <p className="text-muted-foreground text-xs font-light mb-10">Ricky doesn't speak to unknowns.</p>

              <div className="space-y-4 mb-10">
                {[
                  { key: "name", type: "text", placeholder: "Full Name" },
                  { key: "email", type: "email", placeholder: "Email" },
                  { key: "phone", type: "tel", placeholder: "Phone (optional)" },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-muted/50 border border-foreground/[0.06] rounded-sm px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/30 focus:bg-muted/80 transition-all duration-300 font-light"
                  />
                ))}
              </div>

              <button
                onClick={handleDetailsSubmit}
                disabled={!form.name.trim() || !form.email.trim()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm disabled:opacity-30 hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
              >
                Enter
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.section>
        )}

        {/* ═══════════ LIVE INTERVIEW ═══════════ */}
        {stage === "interview" && (
          <motion.section key="interview" {...sectionFade} className="min-h-screen flex flex-col pt-24 pb-6 px-4 bg-background">
            <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-foreground/[0.06]">
                <div className="w-10 h-10 rounded-full bg-primary/[0.06] border border-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">R</span>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground">Ricky</p>
                  <p className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-light">
                    {loading ? "Evaluating..." : "Senior Aviation Advisor"}
                  </p>
                </div>
              </div>

              {/* Messages */}
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
                          ? "bg-primary/[0.08] text-foreground/80 rounded-br-md"
                          : "bg-muted/60 text-foreground/70 rounded-bl-md border border-foreground/[0.04]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-muted/60 border border-foreground/[0.04] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-foreground/[0.06] pt-4">
                <div className="flex items-center gap-2 bg-muted/40 border border-foreground/[0.06] rounded-xl px-4 py-3 focus-within:border-primary/20 transition-all duration-300">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response..."
                    className="flex-1 bg-transparent text-[13px] text-foreground/80 placeholder:text-muted-foreground/40 outline-none font-light"
                    disabled={loading}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-20 hover:bg-primary/90 transition-all duration-300"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════ RESULT ═══════════ */}
        {stage === "result" && (
          <motion.section key="result" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="text-center max-w-lg">
              {evaluation?.passed ? (
                <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-10" />
                  <p className="text-muted-foreground text-sm font-light mb-6 leading-[2]">Impressive.</p>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                    Let's see if you're consistent.
                  </h2>
                  <p className="text-muted-foreground/60 text-xs font-light mb-12 leading-relaxed">
                    Schedule a face-to-face with our management team.
                  </p>
                  <button
                    onClick={() => setStage("schedule")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Schedule Meeting
                    <Calendar size={15} />
                  </button>
                </motion.div>
              ) : (
                <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-foreground/10 to-transparent mx-auto mb-10" />
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                    You are not ready
                    <br />
                    for this environment.
                  </h2>
                  <div className="w-8 h-px bg-foreground/10 mx-auto mb-8" />
                  <button
                    onClick={() => setStage("hero")}
                    className="text-muted-foreground/40 text-[10px] tracking-[0.3em] uppercase hover:text-muted-foreground/60 transition-colors"
                  >
                    Return
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* ═══════════ SCHEDULE ═══════════ */}
        {stage === "schedule" && (
          <motion.section key="schedule" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="max-w-md w-full">
              <div className="text-center mb-10">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 mb-4">Next Step</p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Select Your Time</h2>
                <p className="text-muted-foreground text-xs font-light">We confirm within 24 hours.</p>
              </div>

              <div className="space-y-5 mb-10">
                {[
                  { label: "Date", type: "date", element: "input" },
                  { label: "Time", type: "select", options: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
                  { label: "Format", type: "select", options: ["Video Call", "In-Person"] },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2 block">
                      {field.label}
                    </label>
                    {field.type === "date" ? (
                      <input
                        type="date"
                        className="w-full bg-muted/50 border border-foreground/[0.06] rounded-sm px-5 py-4 text-sm text-foreground outline-none focus:border-primary/30 transition-all duration-300 font-light"
                      />
                    ) : (
                      <select className="w-full bg-muted/50 border border-foreground/[0.06] rounded-sm px-5 py-4 text-sm text-foreground outline-none focus:border-primary/30 transition-all duration-300 font-light appearance-none">
                        <option value="">Select</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={async () => {
                    if (candidateId) {
                      await supabase.from("candidates").update({ status: "scheduled" }).eq("id", candidateId);
                    }
                    alert("Confirmed. We'll be in touch.");
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                >
                  Confirm
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareersPage;
