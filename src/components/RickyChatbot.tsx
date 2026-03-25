import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import rickyIdle from "@/assets/ricky-idle.png";
import rickyThinking from "@/assets/ricky-thinking.png";
import rickyThumbsup from "@/assets/ricky-thumbsup.png";

type Msg = { role: "user" | "assistant"; content: string };

const FIRST_MESSAGE =
  "Hi Ricky, this is Hadi from Universal Jets.\n\nI saw you just activated your Private Access.\n\nCurious — do you have any upcoming trips we can assist with?";

const RickyChatbot = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: FIRST_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Appear after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Listen for open-ricky event
  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setOpen(true);
    };
    document.addEventListener("open-ricky", handler);
    return () => document.removeEventListener("open-ricky", handler);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ricky-chat", {
        body: { messages: newMessages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Let me get back to you on that." },
      ]);
    } catch (e: any) {
      console.error("Ricky chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having a moment — please try again, or I can connect you with our team directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const currentAvatar = loading ? rickyThinking : rickyIdle;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Floating avatar button */}
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full overflow-hidden shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)] hover:shadow-[0_0_35px_-5px_hsla(38,52%,50%,0.6)] transition-shadow duration-500 group"
              aria-label="Chat with Ricky"
            >
              <div className="absolute inset-0 rounded-full animate-pulse-glow pointer-events-none" style={{ boxShadow: "0 0 20px 4px hsla(38,52%,50%,0.25)" }} />
              <img
                src={rickyIdle}
                alt="Ricky — Universal Jets Concierge"
                className="w-full h-full object-cover bg-background group-hover:scale-110 transition-transform duration-500"
              />
            </motion.button>
          )}

          {/* Chat panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border border-gold/10 shadow-[0_0_50px_-12px_hsla(38,52%,50%,0.2)]"
                style={{ background: "hsl(228 22% 8% / 0.97)", backdropFilter: "blur(20px)" }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                  <img
                    src={currentAvatar}
                    alt="Ricky"
                    className="w-10 h-10 rounded-full object-cover bg-background/50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/90">
                      Ricky
                    </p>
                    <p className="text-[9px] text-gold/50 tracking-[0.15em] uppercase font-light">
                      {loading ? "Thinking…" : "Aviation Concierge"}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/30 hover:text-foreground/60 hover:bg-white/5 transition-all"
                  >
                    <X size={14} />
                  </button>
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
                            ? "bg-gold/15 text-foreground/80 rounded-br-md"
                            : "bg-white/5 text-foreground/65 rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      className="flex-1 bg-transparent text-[12px] text-foreground/80 placeholder:text-foreground/20 outline-none font-light"
                      disabled={loading}
                    />
                    <button
                      onClick={send}
                      disabled={!input.trim() || loading}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-30 hover:shadow-[0_0_15px_-3px_hsla(38,52%,50%,0.4)] transition-all duration-300"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default RickyChatbot;
