/**
 * Request guards shared by the public edge functions.
 *
 * - enforceRateLimit: one counter per caller and function, kept in Postgres
 *   so every instance of every function shares it (the previous in-memory
 *   counters reset whenever an instance restarted and were never shared).
 * - requireHuman: Cloudflare Turnstile, verified server-side, one use per token.
 * - featureEnabled: switches read from the environment.
 *
 * Both guards prefer availability over strictness: if the database or
 * Cloudflare cannot be reached, the request is allowed and the failure logged.
 * A lead form that silently drops leads is worse than a few extra requests.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

export const clientIp = (req: Request): string =>
  req.headers.get("cf-connecting-ip") ??
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
  "unknown";

export const jsonResponse = (body: unknown, status: number, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });

let adminClient: ReturnType<typeof createClient> | null = null;
const admin = () =>
  (adminClient ??= createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  ));

export interface RateLimitOptions {
  /** Name of the function or action, e.g. "crm-capture". */
  scope: string;
  /** Requests allowed per caller within the window. */
  limit: number;
  windowSeconds: number;
  /** CORS headers to attach to a 429 response. */
  cors: HeadersInit;
}

/**
 * Returns a 429 Response when the caller is over the limit, otherwise null.
 * Backed by public.consume_rate_limit (see the migration of the same name).
 */
export async function enforceRateLimit(req: Request, opts: RateLimitOptions): Promise<Response | null> {
  const ip = clientIp(req);
  try {
    const { data, error } = await admin().rpc("consume_rate_limit", {
      p_bucket: `${opts.scope}:${ip}`,
      p_limit: opts.limit,
      p_window_seconds: opts.windowSeconds,
    });
    if (error) throw error;
    if (typeof data === "number" && data > opts.limit) {
      console.warn(`[guard] rate limit scope=${opts.scope} ip=${ip} hits=${data}`);
      return jsonResponse(
        { error: "Too many requests. Please try again in a few minutes." },
        429,
        { ...opts.cors, "Retry-After": String(opts.windowSeconds) },
      );
    }
  } catch (err) {
    console.error(`[guard] rate limit unavailable scope=${opts.scope}:`, err);
  }
  return null;
}

/**
 * Verifies a Cloudflare Turnstile token. Returns a 403 Response when the
 * token is missing or rejected, otherwise null.
 *
 * Until TURNSTILE_SECRET_KEY is configured the check is skipped (and logged),
 * so the forms keep working before the widget ships in the front end. Set the
 * secret only once every form sends `turnstileToken`.
 */
export async function requireHuman(req: Request, token: unknown, cors: HeadersInit): Promise<Response | null> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) {
    console.warn("[guard] TURNSTILE_SECRET_KEY not set; bot check skipped");
    return null;
  }
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return jsonResponse({ error: "Verification missing. Please reload the page and try again." }, 403, cors);
  }
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  const ip = clientIp(req);
  if (ip !== "unknown") form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const outcome = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (outcome.success) return null;
    console.warn("[guard] turnstile rejected:", outcome["error-codes"]);
    return jsonResponse({ error: "Verification failed. Please reload the page and try again." }, 403, cors);
  } catch (err) {
    console.error("[guard] turnstile unavailable:", err);
    return null;
  }
}

/** True when the environment variable is exactly "true" (case-insensitive). */
export const featureEnabled = (name: string): boolean =>
  (Deno.env.get(name) ?? "").trim().toLowerCase() === "true";
