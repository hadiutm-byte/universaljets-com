/**
 * Input validation helpers shared by the public edge functions.
 *
 * Pure TypeScript with no Deno or browser APIs, so the unit tests in
 * src/test can import it directly.
 */

/** A string clipped to `max` characters, or undefined when absent. */
export const str = (v: unknown, max: number): string | undefined => {
  if (v == null) return undefined;
  const s = typeof v === "string" ? v : String(v);
  const trimmed = s.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A normalised email address, or undefined when it is not one. */
export const email = (v: unknown): string | undefined => {
  const s = str(v, 254)?.toLowerCase();
  return s && EMAIL_RE.test(s) ? s : undefined;
};

/** An integer within [min, max], or `fallback` when the input is not usable. */
export const int = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.trunc(n), min), max);
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const CHAT_LIMITS = { maxMessages: 30, maxChars: 4000 } as const;

/**
 * The conversation a chat function may forward to the AI model.
 * Only user and assistant turns are accepted (the system prompt is set
 * server-side), each clipped to CHAT_LIMITS.maxChars, and only the last
 * CHAT_LIMITS.maxMessages turns are kept. Returns null when the input is
 * not a usable conversation at all.
 */
export const chatMessages = (v: unknown): ChatMessage[] | null => {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const m of v) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    out.push({ role, content: content.slice(0, CHAT_LIMITS.maxChars) });
  }
  return out.slice(-CHAT_LIMITS.maxMessages);
};

/**
 * Interview answers submitted with a job application: at most `maxItems`
 * entries, each serialised to at most `maxChars` characters.
 */
export const answers = (v: unknown, maxItems = 50, maxChars = 4000): unknown[] => {
  if (!Array.isArray(v)) return [];
  return v.slice(0, maxItems).map((a) => {
    if (typeof a === "string") return a.slice(0, maxChars);
    if (a && typeof a === "object") {
      const s = JSON.stringify(a);
      return s.length > maxChars ? s.slice(0, maxChars) : a;
    }
    return a == null ? null : String(a).slice(0, maxChars);
  });
};
