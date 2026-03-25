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

  const getPreferredVoice = useCallback(() => {
    if (!("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    const priority = [
      "Google UK English Male",
      "Daniel",
      "Google UK English Female",
      "Samantha",
      "Alex",
      "Karen",
    ];

    for (const name of priority) {
      const match = voices.find(
        (voice) => voice.lang.startsWith("en") && voice.name.includes(name),
      );
      if (match) return match;
    }

    return (
      voices.find((voice) => voice.lang === "en-GB") ??
      voices.find((voice) => voice.lang.startsWith("en")) ??
      null
    );
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (muted || !("speechSynthesis" in window)) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.92;
      utterance.volume = 0.82;

      const preferred = getPreferredVoice();
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
    [getPreferredVoice, muted]
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
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.getVoices();

    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return { speak, stop, isSpeaking, muted, toggleMute };
}
