import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";

interface VoiceSearchProps {
  onResult?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * VoiceSearch — Web Speech API-powered voice input widget.
 * Renders a mic button that activates speech recognition and returns the
 * transcript to the parent via `onResult`.
 */
const VoiceSearch = ({ onResult, placeholder = "Say something…", className = "" }: VoiceSearchProps) => {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setError(null);
    setTranscript("");

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const interim = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(interim);

      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        onResult?.(lastResult[0].transcript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error === "not-allowed" ? "Microphone access denied." : "Recognition failed. Try again.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  if (!supported) return null;

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Transcript display */}
      <AnimatePresence>
        {(transcript || error) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 glass-card px-4 py-2.5 rounded-xl min-w-[180px] max-w-[260px] shadow-lg z-50"
          >
            <p className={`text-sm leading-snug ${error ? "text-red-400" : "text-white/80"}`}>
              {error || transcript || placeholder}
            </p>
            {transcript && (
              <button
                onClick={clearTranscript}
                className="absolute top-1 right-1 p-0.5 text-muted-foreground/40 hover:text-white/60 transition-colors"
                aria-label="Clear transcript"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic button */}
      <motion.button
        onClick={listening ? stopListening : startListening}
        whileTap={{ scale: 0.9 }}
        aria-label={listening ? "Stop listening" : "Start voice search"}
        className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
          listening
            ? "bg-primary text-primary-foreground voice-active"
            : "glass border border-border/30 text-muted-foreground hover:text-white hover:border-primary/30"
        }`}
      >
        {/* Listening pulse rings */}
        {listening && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <span className="absolute inset-[-4px] rounded-full border border-primary/30 animate-pulse" />
          </>
        )}
        {listening ? (
          <MicOff className="w-4 h-4 relative z-10" strokeWidth={2} />
        ) : (
          <Mic className="w-4 h-4 relative z-10" strokeWidth={1.5} />
        )}
      </motion.button>
    </div>
  );
};

export default VoiceSearch;
