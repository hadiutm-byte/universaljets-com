import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Plane, CreditCard, Tag, Handshake, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RickyAvatar, { type RickyPose } from "./ricky/RickyAvatar";
import GuidedBookingFlow from "./ricky/GuidedBookingFlow";

type Msg = { role: "user" | "assistant"; content: string };

const INTRO_SCRIPT = `Welcome to Universal Jets.

I'm Ricky — your personal aviation advisor.

Tell me what you need, and I'll take care of the rest.`;

const quickActions = [
  { icon: Plane, label: "Request a Flight", action: "booking" as const },
  { icon: CreditCard, label: "Explore Jet Card", action: "chat" as const, msg: "Tell me about your Jet Card options." },
  { icon: Tag, label: "Find Empty Legs", action: "chat" as const, msg: "Show me available empty leg flights." },
  { icon: Handshake, label: "Partner With Us", action: "chat" as const, msg: "I'd like to explore partnership opportunities." },
];

const Ricky3D = () => {
  const [phase, setPhase] = useState<"hidden" | "arriving" | "ready" | "minimized" | "chat" | "booking">("hidden");
  const [showBubble, setShowBubble] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Delayed entrance — 3 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => setPhase("arriving"), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter when arriving
  useEffect(() => {
    if (phase !== "arriving") return;
    const bubbleTimer = setTimeout(() => {
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
          setTimeout(() => {
            setShowActions(true);
            setPhase("ready");
          }, 400);
        }
      }, 28);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(bubbleTimer);
  }, [phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Listen for external events
  useEffect(() => {
    const bookingHandler = () => setPhase("booking");
    const chatHandler = () => openChat();
    document.addEventListener("open-ricky-booking", bookingHandler);
    document.addEventListener("open-ricky", chatHandler);
    return () => {
      document.removeEventListener("open-ricky-booking", bookingHandler);
      document.removeEventListener("open-ricky", chatHandler);
    };
  }, []);

  const dismiss = () => {
    setPhase("minimized");
    setShowBubble(false);
    setShowActions(false);
  };

  const openChat = (initialMsg?: string) => {
    setPhase("chat");
    if (initialMsg) {
      const userMsg: Msg = { role: "user", content: initialMsg };
      setMessages([userMsg]);
      setLoading(true);
      setSpeaking(true);
      supabase.functions.invoke("ricky-chat", { body: { messages: [userMsg] } })
        .then(({ data, error }) => {
          if (error) throw error;
          setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        })
        .catch(() => {
          setMessages(prev => [...prev, { role: "assistant", content: "An advisor will reach out shortly." }]);
        })
        .finally(() => { setLoading(false); setSpeaking(false); });
    } else if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "How can I assist you today?" }]);
    }
  };

  const openBooking = () => setPhase("booking");

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.action === "booking") {
      setPhase("booking");
    } else {
      openChat(action.msg);
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
    setSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("ricky-chat", {
        body: { messages: newMessages },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "We'll continue this shortly. An advisor will follow up." }]);
    } finally {
      setLoading(false);
      setSpeaking(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleBookingComplete = useCallback(async (data: any) => {
    const summary = `I'd like to book a ${data.tripType} flight from ${data.from} to ${data.to}${data.date ? ` on ${data.date}` : ""} for ${data.passengers} passenger(s). Priority: ${data.preference || "flexible"}.`;
    const bookingMsg: Msg = { role: "user", content: summary };
    setMessages([bookingMsg]);
    setPhase("chat");
    setLoading(true);
    setSpeaking(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("ricky-chat", { body: { messages: [bookingMsg] } });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: resp.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Your request is logged. An advisor will reach out shortly." }]);
    } finally {
      setLoading(false);
      setSpeaking(false);
    }
  }, []);

  const panelClasses =
    "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden";
  const panelStyle = {
    background: "hsla(0, 0%, 100%, 0.97)",
    backdropFilter: "blur(24px)",
    border: "1px solid hsla(0, 0%, 0%, 0.08)",
    boxShadow: "0 25px 80px -15px hsla(0,0%,0%,0.15), 0 0 60px -15px hsla(38,52%,53%,0.08)",
  };

  return (
    <>
      {/* INTRO — Bottom-right slide-in panel (NOT fullscreen) */}
      <AnimatePresence>
        {(phase === "arriving" || phase === "ready") && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col items-center rounded-2xl overflow-hidden"
            style={panelStyle}
          >
            {/* Header with close */}
            <div className="w-full flex items-center justify-between px-5 pt-4 pb-2">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary/60 font-medium">
                  Meet Your Advisor
                </p>
              </div>
              <button
                onClick={dismiss}
                className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>

            {/* Avatar — half body (smaller, cropped feel) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
              className="my-2"
            >
              <RickyAvatar speaking={speaking} size={140} pose="wave" />
            </motion.div>

            {/* Title & role */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-3"
            >
              <p className="text-[13px] tracking-[0.15em] uppercase text-foreground/80 font-medium">
                Ricky
              </p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-0.5">
                Personal Aviation Advisor
              </p>
            </motion.div>

            {/* Speech bubble */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="mx-5 mb-3 px-6 py-5 rounded-xl relative"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsla(0,0%,0%,0.04)",
                  }}
                >
                  <p className="text-[13px] text-foreground/80 font-light leading-[2] whitespace-pre-wrap">
                    {displayedText}
                    {!showActions && <span className="animate-pulse text-primary">|</span>}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick actions */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-wrap justify-center gap-2 mx-5 mb-4"
                >
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border/60 bg-card hover:border-primary/25 hover:shadow-sm transition-all duration-300 cursor-pointer group"
                    >
                      <action.icon size={11} className="text-primary/50 group-hover:text-primary/80 transition-colors" strokeWidth={1.3} />
                      <span className="text-[9px] tracking-[0.1em] uppercase text-foreground/50 group-hover:text-foreground/80 font-light transition-colors">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dismiss link */}
            {showActions && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={dismiss}
                className="mb-4 flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                <ChevronDown size={10} /> Minimize
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED — Floating orb, bottom-right */}
      <AnimatePresence>
        {phase === "minimized" && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            drag
            dragMomentum={false}
            dragElastic={0.15}
            dragSnapToOrigin
            whileDrag={{ scale: 1.1 }}
            className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
          >
            <div className="relative flex items-end gap-2">
              {/* Quick book button */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-2"
              >
                <button
                  onClick={openBooking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/60 shadow-sm text-[8px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground/80 hover:border-primary/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plane size={9} strokeWidth={1.5} /> Request a Flight
                </button>
              </motion.div>

              {/* Avatar orb */}
              <div className="relative" onClick={() => openChat()}>
                <RickyAvatar speaking={false} size={64} />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: "0 0 20px -5px hsla(38,52%,50%,0.25)" }}
                />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary/70 animate-pulse" />
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
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
              <div className="shrink-0"><RickyAvatar speaking={speaking} size={40} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/80">Ricky</p>
                <p className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-light">Booking Concierge</p>
              </div>
              <button onClick={() => setPhase("minimized")} className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-muted/50 transition-all cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <GuidedBookingFlow onComplete={handleBookingComplete} onSpeaking={setSpeaking} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT */}
      <AnimatePresence>
        {phase === "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={panelClasses}
            style={panelStyle}
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
              <div className="shrink-0"><RickyAvatar speaking={speaking} size={40} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/80">Ricky</p>
                <p className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-light">
                  {loading ? "Thinking..." : "Personal Aviation Advisor"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={openBooking} className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-primary/60 hover:bg-primary/[0.06] transition-all cursor-pointer" title="Start booking">
                  <Plane size={13} />
                </button>
                <button onClick={dismiss} className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/20 hover:text-foreground/50 hover:bg-muted/50 transition-all cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>

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
                        ? "bg-primary/10 text-foreground/80 rounded-br-md"
                        : "bg-muted text-foreground/70 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border/30">
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-primary/25 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent text-[12px] text-foreground/80 placeholder:text-muted-foreground/50 outline-none font-light"
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-30 hover:shadow-[0_0_15px_-3px_hsla(38,52%,50%,0.4)] transition-all duration-300 cursor-pointer"
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
