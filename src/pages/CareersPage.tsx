import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ArrowRight, Calendar, Briefcase, Users, Globe, ChevronRight,
  Heart, TrendingUp, Shield, Award, Plane, Scale, Leaf, HardHat, BookOpen, FileCheck, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import careersHero from "@/assets/careers-hero.jpg";

/* ─── Types ─── */
type Msg = { role: "user" | "assistant"; content: string };
type Stage = "main" | "warning" | "details" | "interview" | "result" | "schedule";
type EvalResult = { passed: boolean; average: number; summary: string } | null;

/* ─── Animation helpers ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: EASE },
};
const sectionFade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: EASE },
};

/* ─── Content from live site ─── */
const WHY_VALUES = [
  { icon: Heart, title: "Family First", desc: "We treat every team member like family. Your growth is our growth, your success is our success." },
  { icon: Globe, title: "Global Reach", desc: "Work with clients and partners across 190+ countries. Your office is the world." },
  { icon: TrendingUp, title: "Unlimited Growth", desc: "No ceilings, no limits. We promote from within and invest in your professional development." },
  { icon: Award, title: "Industry Leaders", desc: "ARGUS Registered, Wyvern Certified, DCAA Licensed. Join a company that sets the standard." },
  { icon: Briefcase, title: "Rewarding Culture", desc: "Competitive compensation, performance bonuses, and the satisfaction of working in the world's most exciting industry." },
  { icon: Plane, title: "Aviation Passion", desc: "If you love aviation, you'll love working here. Every day brings new challenges and extraordinary experiences." },
];

const PRINCIPLES = [
  { icon: Scale, title: "Anti-Corruption", desc: "Zero-tolerance policy towards bribery and corruption. We comply fully with UAE, UK, and US anti-corruption laws." },
  { icon: Leaf, title: "Environmental Responsibility", desc: "Carbon offset programmes, sustainable aviation fuel partnerships, and paperless operations for a greener future." },
  { icon: HardHat, title: "Health & Safety", desc: "Non-negotiable safety standards — ARGUS Platinum, Wyvern Wingman, IS-BAO certified operators only." },
  { icon: BookOpen, title: "Ethical Business Practices", desc: "Fair pricing, transparent dealings, and client confidentiality upheld in every interaction." },
  { icon: FileCheck, title: "Regulatory Compliance", desc: "DCAA License #3342665, DIEZ License #50370, with full GCAA, GACA, EASA, and FAA compliance." },
  { icon: Shield, title: "Code of Ethics", desc: "Human rights, diversity, data privacy, whistleblower protections — our compass for every decision." },
];

const POSITIONS = [
  { title: "Sales Executive — Leisure", dept: "Sales", location: "Dubai, UAE / Remote", type: "Full-time" },
  { title: "Sales Executive — Corporate", dept: "Sales", location: "Dubai, UAE / Remote", type: "Full-time" },
  { title: "ACMI Sales Manager", dept: "Leasing", location: "Dubai, UAE", type: "Full-time" },
  { title: "Cargo Business Development Manager", dept: "Cargo & Special Missions", location: "Dubai, UAE", type: "Full-time" },
  { title: "Sales Director — EMEA", dept: "Leadership", location: "Dubai, UAE / London, UK", type: "Full-time" },
  { title: "Personal Assistant to the CEO", dept: "Executive Office", location: "Dubai, UAE", type: "Full-time" },
  { title: "Public Relations & Social Media Officer", dept: "Marketing", location: "Dubai, UAE / Remote", type: "Full-time" },
];

const inputClass =
  "w-full bg-muted/50 border border-foreground/[0.06] rounded-sm px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/30 focus:bg-muted/80 transition-all duration-300 font-light";

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
const CareersPage = () => {
  const [stage, setStage] = useState<Stage>("main");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvalResult>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [applyForm, setApplyForm] = useState({ position: "", name: "", email: "", phone: "", cover: "" });
  const [applySubmitted, setApplySubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Interview logic ── */
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  /* ── Application form submit ── */
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.email.trim() || !applyForm.position) return;
    try {
      await supabase.from("candidates").insert({
        full_name: applyForm.name.trim(),
        email: applyForm.email.trim(),
        phone: applyForm.phone.trim() || null,
        interview_answers: [{ position: applyForm.position, cover_letter: applyForm.cover }],
      });
      setApplySubmitted(true);
      toast.success("Application submitted successfully.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <AnimatePresence mode="wait">
        {/* ═══════════ MAIN PAGE ═══════════ */}
        {stage === "main" && (
          <motion.div key="main" {...sectionFade}>

            {/* ── HERO with image ── */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img src={careersHero} alt="Private jet cabin interior" className="w-full h-full object-cover" width={1920} height={1080} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 max-w-3xl px-8 md:px-16 py-32">
                <motion.p {...fadeUp} className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-primary mb-6">
                  Careers at Universal Jets
                </motion.p>
                <motion.h1 {...fadeUp} transition={{ delay: 0.15 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-white mb-6">
                  Join the <span className="text-primary italic">Family</span>
                </motion.h1>
                <motion.p {...fadeUp} transition={{ delay: 0.3 }} className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-lg mb-4">
                  We don't recruit employees — we invite new family members to be part of our success story.
                </motion.p>
                <motion.p {...fadeUp} transition={{ delay: 0.4 }} className="text-white/50 text-sm font-light leading-relaxed max-w-lg mb-10">
                  At Universal Jets, every person who joins us becomes a vital part of something bigger. We're building the future of private aviation together, and there's a seat with your name on it.
                </motion.p>
                <motion.a
                  {...fadeUp}
                  transition={{ delay: 0.5 }}
                  href="#positions"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                >
                  Explore Opportunities <ArrowRight size={15} />
                </motion.a>
              </div>
            </section>

            {/* ── WHY UNIVERSAL JETS ── */}
            <section className="py-24 md:py-32 px-6 bg-background">
              <div className="max-w-5xl mx-auto">
                <motion.div {...fadeUp} className="text-center mb-16">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Why Universal Jets</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    More Than a Workplace — <span className="text-primary italic">A Family</span>
                  </h2>
                  <p className="text-muted-foreground text-sm font-light max-w-2xl mx-auto leading-relaxed">
                    Universal Jets Aviation Brokerage is Dubai's premier private aviation broker with access to over 50,000 aircraft worldwide. We serve high-net-worth individuals, corporations, governments, and NGOs across leisure, corporate, medical evacuation, cargo, ACMI leasing, and humanitarian missions. We're growing fast — and we want the right people beside us.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                  {WHY_VALUES.map((v, i) => (
                    <motion.div
                      key={v.title}
                      {...fadeUp}
                      transition={{ delay: i * 0.08 }}
                      className="group p-7 rounded-sm border border-foreground/[0.04] bg-muted/30 hover:border-primary/15 hover:bg-muted/60 transition-all duration-500"
                    >
                      <div className="w-11 h-11 rounded-full bg-primary/[0.06] flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                        <v.icon size={18} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-base font-semibold mb-2">{v.title}</h3>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">{v.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── OUR PRINCIPLES ── */}
            <section className="py-24 md:py-32 px-6 bg-muted/40">
              <div className="max-w-5xl mx-auto">
                <motion.div {...fadeUp} className="text-center mb-16">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Our Principles</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Built on <span className="text-primary italic">Integrity</span>
                  </h2>
                  <p className="text-muted-foreground text-sm font-light max-w-lg mx-auto leading-relaxed">
                    At Universal Jets, we believe that how we do business is just as important as what we achieve.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {PRINCIPLES.map((p, i) => (
                    <motion.div
                      key={p.title}
                      {...fadeUp}
                      transition={{ delay: i * 0.06 }}
                      className="group p-7 rounded-sm border border-foreground/[0.04] bg-background hover:border-primary/15 transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
                          <p.icon size={16} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold mb-2">{p.title}</h3>
                          <p className="text-muted-foreground text-sm font-light leading-relaxed">{p.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── OPEN POSITIONS ── */}
            <section id="positions" className="py-24 md:py-32 px-6 bg-background scroll-mt-24">
              <div className="max-w-4xl mx-auto">
                <motion.div {...fadeUp} className="text-center mb-16">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Open Positions</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Find Your Seat at the <span className="text-primary italic">Table</span>
                  </h2>
                  <p className="text-muted-foreground text-sm font-light max-w-md mx-auto">
                    We're looking for passionate individuals who want to make a real impact in private aviation.
                  </p>
                </motion.div>

                <div className="space-y-3">
                  {POSITIONS.map((pos, i) => (
                    <motion.a
                      key={pos.title}
                      href="#apply"
                      {...fadeUp}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center justify-between p-6 rounded-sm border border-foreground/[0.04] bg-muted/20 hover:border-primary/20 hover:bg-muted/40 transition-all duration-400"
                    >
                      <div>
                        <h3 className="font-display text-base font-semibold group-hover:text-primary transition-colors duration-300">
                          {pos.title}
                        </h3>
                        <p className="text-muted-foreground text-xs font-light mt-1">
                          {pos.dept} · {pos.location} · {pos.type}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>

            {/* ── APPLICATION FORM ── */}
            <section id="apply" className="py-24 md:py-32 px-6 bg-muted/40 scroll-mt-24">
              <div className="max-w-2xl mx-auto">
                <motion.div {...fadeUp} className="text-center mb-12">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Apply Now</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Ready to <span className="text-primary italic">Join Us</span>?
                  </h2>
                  <p className="text-muted-foreground text-sm font-light max-w-md mx-auto leading-relaxed">
                    Tell us about yourself. We read every single application personally.
                  </p>
                </motion.div>

                {!applySubmitted ? (
                  <motion.form {...fadeUp} transition={{ delay: 0.1 }} onSubmit={handleApply} className="rounded-sm border border-foreground/[0.06] bg-background p-8 md:p-10 space-y-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Position *</label>
                      <select
                        required
                        value={applyForm.position}
                        onChange={(e) => setApplyForm((p) => ({ ...p, position: e.target.value }))}
                        className={inputClass + " appearance-none"}
                      >
                        <option value="">Select a position...</option>
                        {POSITIONS.map((p) => <option key={p.title} value={p.title}>{p.title}</option>)}
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Full Name *</label>
                        <input type="text" required value={applyForm.name} onChange={(e) => setApplyForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Email *</label>
                        <input type="email" required value={applyForm.email} onChange={(e) => setApplyForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Phone</label>
                      <input type="tel" value={applyForm.phone} onChange={(e) => setApplyForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="+971 50 000 0000" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2.5 font-medium">Cover Letter</label>
                      <textarea rows={5} value={applyForm.cover} onChange={(e) => setApplyForm((p) => ({ ...p, cover: e.target.value }))} className={inputClass + " resize-none"} placeholder="Tell us why you'd be a great fit..." />
                    </div>
                    <button type="submit" className="w-full py-4 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium rounded-sm transition-all duration-300 hover:bg-primary/90 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)] flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" strokeWidth={1.3} />
                      Submit Application
                    </button>
                    <p className="text-[11px] text-muted-foreground/50 text-center font-light">Your information is kept strictly confidential.</p>
                  </motion.form>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-foreground/[0.06] bg-background p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/[0.06] flex items-center justify-center mx-auto mb-6">
                      <Send className="w-6 h-6 text-primary" strokeWidth={1.3} />
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3">Thank You</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                      We've received your application and will review it personally. If there's a fit, we'll be in touch soon.
                    </p>
                  </motion.div>
                )}
              </div>
            </section>

            {/* ── AI INTERVIEW CTA ── */}
            <section className="py-24 md:py-32 px-6 bg-background">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div {...fadeUp}>
                  <div className="w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-8" />
                  <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4">Or Skip the CV</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                    Face <span className="text-primary italic">Ricky</span> — AI Interview
                  </h2>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-md mx-auto mb-10">
                    Our AI interviewer evaluates how you think, speak, and perform — in real time. No CV required.
                  </p>
                  <button
                    onClick={() => setStage("warning")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Start AI Interview <ArrowRight size={15} />
                  </button>
                </motion.div>
                <p className="text-muted-foreground/40 text-xs font-light mt-8">
                  Or send your CV to{" "}
                  <a href="mailto:hr@universaljets.com" className="text-primary/60 hover:text-primary transition-colors underline underline-offset-4 decoration-primary/20">
                    hr@universaljets.com
                  </a>
                </p>
              </div>
            </section>

            <Footer />
          </motion.div>
        )}

        {/* ═══════════ RICKY WARNING ═══════════ */}
        {stage === "warning" && (
          <motion.section key="warning" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="max-w-md text-center">
              <button onClick={() => setStage("main")} className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.15em] uppercase hover:text-primary transition-colors mb-16">
                <ArrowLeft size={12} /> Back
              </button>

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-primary/[0.06] border border-primary/10 flex items-center justify-center mx-auto mb-10"
              >
                <span className="text-primary text-2xl font-display font-semibold">R</span>
              </motion.div>

              <div className="space-y-5 mb-12">
                <p className="text-foreground/80 text-sm font-light leading-[2]">
                  You are about to speak with <span className="font-medium text-foreground">Ricky</span>.
                </p>
                <p className="text-muted-foreground text-sm font-light leading-[2]">Senior Aviation Advisor at Universal Jets.</p>
                <div className="w-8 h-px bg-primary/20 mx-auto" />
                <p className="text-muted-foreground/70 text-sm font-light leading-[2]">He evaluates people, not résumés.</p>
                <p className="text-muted-foreground/50 text-xs font-light leading-[2] pt-2">
                  Proceed only if you are confident in how you think,<br />speak, and perform.
                </p>
              </div>

              <div className="space-y-4">
                <button onClick={() => setStage("details")} className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]">
                  Start Interview
                </button>
                <div>
                  <button onClick={() => setStage("main")} className="text-muted-foreground/40 text-[10px] tracking-[0.3em] uppercase hover:text-muted-foreground/60 transition-colors">
                    I'm not ready
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════ DETAILS CAPTURE ═══════════ */}
        {stage === "details" && (
          <motion.section key="details" {...sectionFade} className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="max-w-md w-full">
              <button onClick={() => setStage("warning")} className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.15em] uppercase hover:text-primary transition-colors mb-12">
                <ArrowLeft size={12} /> Back
              </button>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 mb-6">Identify Yourself</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Who are you?</h2>
              <p className="text-muted-foreground text-xs font-light mb-10">Ricky doesn't speak to unknowns.</p>

              <div className="space-y-4 mb-10">
                {[
                  { key: "name", type: "text", placeholder: "Full Name" },
                  { key: "email", type: "email", placeholder: "Email" },
                  { key: "phone", type: "tel", placeholder: "Phone (optional)" },
                ].map((field) => (
                  <input key={field.key} type={field.type} placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className={inputClass}
                  />
                ))}
              </div>

              <button onClick={handleDetailsSubmit} disabled={!form.name.trim() || !form.email.trim()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm disabled:opacity-30 hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
              >
                Enter <ArrowRight size={15} />
              </button>
            </div>
          </motion.section>
        )}

        {/* ═══════════ LIVE INTERVIEW ═══════════ */}
        {stage === "interview" && (
          <motion.section key="interview" {...sectionFade} className="min-h-screen flex flex-col pt-24 pb-6 px-4 bg-background">
            <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
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

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[13px] leading-[1.8] font-light whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/[0.08] text-foreground/80 rounded-br-md"
                        : "bg-muted/60 text-foreground/70 rounded-bl-md border border-foreground/[0.04]"
                    }`}>
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

              <div className="border-t border-foreground/[0.06] pt-4">
                <div className="flex items-center gap-2 bg-muted/40 border border-foreground/[0.06] rounded-xl px-4 py-3 focus-within:border-primary/20 transition-all duration-300">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Type your response..." disabled={loading}
                    className="flex-1 bg-transparent text-[13px] text-foreground/80 placeholder:text-muted-foreground/40 outline-none font-light"
                  />
                  <button onClick={send} disabled={!input.trim() || loading}
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto mb-10" />
                  <p className="text-muted-foreground text-sm font-light mb-6 leading-[2]">Impressive.</p>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">Let's see if you're consistent.</h2>
                  <p className="text-muted-foreground/60 text-xs font-light mb-12 leading-relaxed">Schedule a face-to-face with our management team.</p>
                  <button onClick={() => setStage("schedule")}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                  >
                    Schedule Meeting <Calendar size={15} />
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-foreground/10 to-transparent mx-auto mb-10" />
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                    You are not ready<br />for this environment.
                  </h2>
                  <div className="w-8 h-px bg-foreground/10 mx-auto mb-8" />
                  <button onClick={() => setStage("main")} className="text-muted-foreground/40 text-[10px] tracking-[0.3em] uppercase hover:text-muted-foreground/60 transition-colors">
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
                  { label: "Date", type: "date" },
                  { label: "Time", type: "select", options: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
                  { label: "Format", type: "select", options: ["Video Call", "In-Person"] },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-2 block">{field.label}</label>
                    {field.type === "date" ? (
                      <input type="date" className={inputClass} />
                    ) : (
                      <select className={inputClass + " appearance-none"}>
                        <option value="">Select</option>
                        {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={async () => {
                    if (candidateId) await supabase.from("candidates").update({ status: "scheduled" }).eq("id", candidateId);
                    toast.success("Confirmed. We'll be in touch.");
                    setStage("main");
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_24px_-4px_hsl(var(--gold)/0.3)]"
                >
                  Confirm <ArrowRight size={15} />
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
