import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Uses Web Speech API (SpeechSynthesis) to give Ricky a calm, premium voice.
 * Returns speak(), stop(), isSpeaking, and muted state.
 */
export function useRickyVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muted, setMuted] = useState(() => {
    // Only speak on first-ever visit
    const hasVisited = sessionStorage.getItem("ricky-greeted");
    return !!hasVisited;
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (muted || !("speechSynthesis" in window)) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
      utterance.volume = 0.7;

      // Pick a calm English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Daniel") ||
            v.name.includes("Samantha") ||
            v.name.includes("Alex"))
      );
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        sessionStorage.setItem("ricky-greeted", "1");
      };
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [muted]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      if (!prev) {
        // Muting — stop current speech
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return { speak, stop, isSpeaking, muted, toggleMute };
}
