import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RickyAvatar from "./ricky/RickyAvatar";
import GuidedBookingFlow from "./ricky/GuidedBookingFlow";

type Msg = { role: "user" | "assistant"; content: string };

const INTRO_SCRIPT = `Welcome to Universal Jets.

I'm Ricky — Senior Aviation Advisor.

Before you explore, tell me what brought you here. Are you looking to fly, to partner, or to join?

I decide what happens next.`;

const Ricky3D = () => {
  const [phase, setPhase] = useState<"intro" | "minimized" | "chat" | "booking">("intro");
  const [showBubble, setShowBubble] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Typewriter intro
  useEffect(() => {
    if (phase !== "intro") return;
    const timer = setTimeout(() => {
      setShowBubble(true);
      setSpeaking(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < INTRO_SCRIPT.length) {
          setDisplayedText(INTRO_SCRIPT.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setSpeaking(false);
        }
      }, 30);
      return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Listen for open-ricky-booking event
  useEffect(() => {
    const handler = () => {
      setPhase("booking");
    };
    document.addEventListener("open-ricky-booking", handler);
    return () => document.removeEventListener("open-ricky-booking", handler);
  }, []);

  const dismiss = () => {
    setPhase("minimized");
    setShowBubble(false);
  };

  const openChat = () => {
    setPhase("chat");
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Talk. What do you need?" }]);
    }
  };

  const openBooking = () => {
    setPhase("booking");
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("ricky-chat", {
        body: { messages: newMessages },
      });
      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "We'll continue this later." }]);
    } finally {
      setLoading(false);
      setSpeaking(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleBookingComplete = useCallback(async (data: any) => {
    // Send booking data to Ricky for follow-up
    const summary = `I'd like to book a ${data.tripType} flight from ${data.from} to ${data.to}${data.date ? ` on ${data.date}` : ""} for ${data.passengers} passenger(s). Priority: ${data.preference || "flexible"}.`;
    const bookingMsg: Msg = { role: "user", content: summary };
    setMessages([bookingMsg]);
    setPhase("chat");
    setLoading(true);
    setSpeaking(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("ricky-chat", {
        body: { messages: [bookingMsg] },
      });
      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: resp.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Your request is logged. An advisor will reach out shortly." },
      ]);
    } finally {
      setLoading(false);
      setSpeaking(false);
    }
  }, []);

  const panelClasses =
    "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border border-white/[0.04]";
  const panelStyle = {
    background: "hsl(228 22% 6% / 0.97)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 60px -15px hsla(38,52%,50%,0.15)",
  };

  return (
    <>
      {/* INTRO */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ background: "radial-gradient(ellipse at center, hsla(228,28%,6%,0.95) 0%, hsla(228,28%,3%,0.98) 70%)" }}
          >
            <button
              onClick={dismiss}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-white/5 transition-all z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.3 }}
            >
              <RickyAvatar speaking={speaking} size={280} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] tracking-[0.4em] uppercase text-primary/50 mt-2 mb-1"
            >
              Ricky
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[9px] tracking-[0.2em] uppercase text-foreground/20 mb-8"
            >
              Senior Aviation Advisor
            </motion.p>

            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-md mx-6 px-8 py-6 rounded-2xl border border-white/[0.04] relative"
                  style={{ background: "hsla(228,22%,8%,0.8)", backdropFilter: "blur(20px)" }}
                >
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t border-white/[0.04]"
                    style={{ background: "hsla(228,22%,8%,0.8)" }}
                  />
                  <p className="text-[13px] text-foreground/60 font-light leading-[2] whitespace-pre-wrap">
                    {displayedText}
                    <span className="animate-pulse text-primary/40">|</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={dismiss}
              className="mt-8 text-[10px] tracking-[0.3em] uppercase text-foreground/15 hover:text-foreground/30 transition-colors cursor-pointer"
            >
              Continue to site
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED — Draggable floating orb */}
      <AnimatePresence>
        {phase === "minimized" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            whileDrag={{ scale: 1.1 }}
            className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
          >
            <div className="relative flex items-end gap-2">
              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-1.5 mb-2"
              >
                <button
                  onClick={openBooking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm text-[8px] tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground/70 hover:border-primary/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plane size={9} strokeWidth={1.5} /> Book a Flight
                </button>
              </motion.div>

              <div className="relative" onClick={openChat}>
                <RickyAvatar speaking={false} size={72} />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: "0 0 25px -5px hsla(38,52%,50%,0.3)" }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/80 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING — Guided flow panel */}
      <AnimatePresence>
        {phase === "booking" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={panelClasses}
            style={panelStyle}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
              <div className="shrink-0">
                <RickyAvatar speaking={speaking} size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/90">
                  Ricky
                </p>
                <p className="text-[9px] text-primary/40 tracking-[0.15em] uppercase font-light">
                  Booking Concierge
                </p>
              </div>
              <button
                onClick={() => setPhase("minimized")}
                className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Guided Flow */}
            <GuidedBookingFlow
              onComplete={handleBookingComplete}
              onSpeaking={setSpeaking}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT — Standard chat panel */}
      <AnimatePresence>
        {phase === "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            className={panelClasses}
            style={panelStyle}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
              <div className="shrink-0">
                <RickyAvatar speaking={speaking} size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/90">
                  Ricky
                </p>
                <p className="text-[9px] text-primary/40 tracking-[0.15em] uppercase font-light">
                  {loading ? "Thinking..." : "Senior Aviation Advisor"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={openBooking}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-primary/60 hover:bg-primary/[0.06] transition-all cursor-pointer"
                  title="Start booking"
                >
                  <Plane size={13} />
                </button>
                <button
                  onClick={dismiss}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[12px] leading-[1.8] font-light whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/10 text-foreground/70 rounded-br-md"
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
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.03] rounded-xl px-4 py-2.5 focus-within:border-primary/10 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Respond..."
                  className="flex-1 bg-transparent text-[12px] text-foreground/80 placeholder:text-foreground/15 outline-none font-light"
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-20 hover:shadow-[0_0_15px_-3px_hsla(38,52%,50%,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Ricky3D;
