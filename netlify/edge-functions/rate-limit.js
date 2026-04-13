/**
 * Rate limiter for /api/subscribe
 * 5 requests per IP per 60-second window.
 * Uses an in-memory map — resets on cold start, which is fine
 * for a low-traffic editorial site. The goal is bot deterrence,
 * not DDoS-grade protection.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

/** @type {Map<string, { count: number, reset: number }>} */
const hits = new Map();

export default async (request, context) => {
  const ip = context.ip || request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  let record = hits.get(ip);

  if (!record || now > record.reset) {
    record = { count: 0, reset: now + WINDOW_MS };
    hits.set(ip, record);
  }

  record.count++;

  if (record.count > MAX_REQUESTS) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Try again in a minute." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  return context.next();
};

export const config = {
  path: "/api/subscribe",
};
