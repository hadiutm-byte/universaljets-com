import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Plane, CreditCard, Tag, Handshake, ChevronDown, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RickyAvatar, { type RickyPose } from "./ricky/RickyAvatar";
import RickyThreeAvatar from "./ricky/RickyThreeAvatar";
import { useRickyVoice } from "@/hooks/useRickyVoice";
import GuidedBookingFlow from "./ricky/GuidedBookingFlow";

type Msg = { role: "user" | "assistant"; content: string };

const INTRO_SCRIPT = `Welcome to Universal Jets.

I'm Ricky, your personal aviation advisor.

Tell me your destination and I'll take care of everything.`;

const INTRO_SPEECH =
  "Welcome to Universal Jets. I'm Ricky, your personal aviation advisor. Tell me your destination and I'll take care of everything.";

const quickActions = [
  { icon: Plane, label: "Request a Flight", action: "booking" as const },
  { icon: MessageCircle, label: "Chat on WhatsApp", action: "whatsapp" as const },
  { icon: CreditCard, label: "Explore Jet Card", action: "chat" as const, msg: "Tell me about your Jet Card options." },
  { icon: Tag, label: "Find Empty Legs", action: "chat" as const, msg: "Show me available empty leg flights." },
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
  const { speak: speakVoice, isSpeaking: voiceSpeaking, muted, toggleMute } = useRickyVoice();

  const rickySpeaking = speaking || voiceSpeaking;

  // Delayed entrance — 3 seconds after page load
  useEffect(() => {
    if (phase !== "hidden") return;

    const timer = setTimeout(() => setPhase("arriving"), 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Typewriter when arriving — with 1.5s delay before speaking
  useEffect(() => {
    if (phase !== "arriving") return;
    setShowBubble(true);
    setShowActions(false);
    setDisplayedText("");
    setSpeaking(true);

    // Delay voice by 1.5s for a natural entrance feel
    const voiceDelay = window.setTimeout(() => {
      speakVoice(INTRO_SPEECH);
    }, 1500);

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplayedText(INTRO_SCRIPT.slice(0, index));

      if (index >= INTRO_SCRIPT.length) {
        window.clearInterval(interval);
        setSpeaking(false);
        window.setTimeout(() => {
          setShowActions(true);
          setPhase("ready");
        }, 350);
      }
    }, 26);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(voiceDelay);
    };
  }, [phase, speakVoice]);

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
    setSpeaking(false);
  };

  const replayGreeting = useCallback(() => {
    setShowBubble(true);
    setShowActions(true);
    setDisplayedText(INTRO_SCRIPT);
    if (!muted) {
      speakVoice(INTRO_SPEECH);
    }
  }, [muted, speakVoice]);

  const openCharacter = useCallback(() => {
    setPhase("ready");
    replayGreeting();
  }, [replayGreeting]);

  const openChat = (initialMsg?: string) => {
    setPhase("chat");
    setShowBubble(false);
    setShowActions(false);
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

  const openBooking = () => {
    setPhase("booking");
    setShowBubble(false);
    setShowActions(false);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.action === "booking") {
      setPhase("booking");
    } else if (action.action === "whatsapp") {
      window.open("https://wa.me/447888999944?text=" + encodeURIComponent("Hello, I would like to request a private jet charter."), "_blank");
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
    "ricky-panel fixed bottom-4 right-4 z-[60] flex h-[600px] max-h-[calc(100vh-1.5rem)] w-[420px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[1.75rem]";

  return (
    <>
      {/* FLOATING CHARACTER */}
      <AnimatePresence>
        {(phase === "arriving" || phase === "ready") && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.12}
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 z-50 cursor-grab active:cursor-grabbing"
            style={{ pointerEvents: "none" }}
          >
            {/* Speech cloud above Ricky's head */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="ricky-speech-cloud absolute bottom-[480px] right-[60px] z-[2] w-[320px] px-6 py-5"
                  style={{ pointerEvents: "auto" }}
                >
                  {/* Cloud tail/orbs now handled by CSS ::before/::after */}
                  <p className="text-[13px] font-light leading-[1.85] text-foreground/80 whitespace-pre-wrap">
                    {displayedText}
                    {!showActions && <span className="animate-pulse text-primary">|</span>}
                  </p>
                  <div className="mt-3 flex items-center justify-end gap-1.5" style={{ pointerEvents: "auto" }}>
                    <button onClick={toggleMute} className="ricky-control" title={muted ? "Unmute" : "Mute"}>
                      {muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                    </button>
                    <button onClick={dismiss} className="ricky-control" title="Minimize">
                      <ChevronDown size={11} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-[430px] right-[46px] z-[2] flex max-w-[320px] flex-wrap justify-end gap-2"
                  style={{ pointerEvents: "auto" }}
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
                      className="ricky-action-chip group"
                    >
                      <action.icon size={11} className="text-primary/55 transition-colors group-hover:text-primary/80" strokeWidth={1.3} />
                      <span className="text-[9px] font-light uppercase tracking-[0.12em] text-foreground/55 transition-colors group-hover:text-foreground/82">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ricky — large, transparent, anchored bottom-right */}
            <motion.button
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 16, delay: 0.12 }}
              onClick={replayGreeting}
              className="relative cursor-pointer focus:outline-none"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ pointerEvents: "auto" }}
            >
              <div className="ricky-presence ricky-presence-3d">
                <RickyThreeAvatar speaking={rickySpeaking} size={520} />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED */}
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
            whileDrag={{ scale: 1.1 }}
            className="fixed bottom-4 right-4 z-50 cursor-grab active:cursor-grabbing"
          >
            <button
              onClick={openCharacter}
              className="relative cursor-pointer focus:outline-none"
            >
              <div className="ricky-presence ricky-presence-compact ricky-presence-3d">
                <RickyThreeAvatar speaking={false} size={128} compact />
              </div>
              <span className="ricky-status-dot" />
            </button>
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
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
              <div className="shrink-0"><RickyAvatar speaking={rickySpeaking} size={44} pose="thinking" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/80">Ricky</p>
                <p className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-light">Booking Concierge</p>
              </div>
              <button onClick={() => setPhase("minimized")} className="ricky-control">
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
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
              <div className="shrink-0"><RickyAvatar speaking={rickySpeaking} size={44} pose={rickySpeaking ? "thinking" : "idle"} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/80">Ricky</p>
                <p className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-light">
                  {loading ? "Thinking..." : "Personal Aviation Advisor"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={openBooking} className="ricky-control" title="Start booking">
                  <Plane size={13} />
                </button>
                <button onClick={dismiss} className="ricky-control">
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
                  className="btn-luxury flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-30"
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
