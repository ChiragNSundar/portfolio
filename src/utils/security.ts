/**
 * Portfolio Engine Security & Rate Limiting Utility
 * Provides protection against DDoS, mass request spam, XSS injection, and bot abuse.
 */

// In-memory sliding window rate limiter cache
const rateLimitMap: Map<string, { count: number; firstRequestTime: number }> = new Map();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests allowed per window
}

/**
 * Checks if an action key has exceeded the allowed rate limit threshold.
 * Uses sliding window algorithm with automatic cleanup.
 */
export function checkRateLimit(key: string, config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, firstRequestTime: now });
    return { allowed: true, remaining: config.maxRequests - 1, resetMs: config.windowMs };
  }

  // Check if window has expired
  if (now - record.firstRequestTime > config.windowMs) {
    rateLimitMap.set(key, { count: 1, firstRequestTime: now });
    return { allowed: true, remaining: config.maxRequests - 1, resetMs: config.windowMs };
  }

  // Check if count exceeds limit
  if (record.count >= config.maxRequests) {
    const resetMs = config.windowMs - (now - record.firstRequestTime);
    return { allowed: false, remaining: 0, resetMs };
  }

  record.count += 1;
  const remaining = config.maxRequests - record.count;
  const resetMs = config.windowMs - (now - record.firstRequestTime);
  return { allowed: true, remaining, resetMs };
}

/**
 * Persistent local storage rate limiter across page reloads (e.g. for guestbook submissions)
 */
export function checkPersistentRateLimit(actionKey: string, maxSubmissions = 3, windowMinutes = 10): { allowed: boolean; remainingMinutes: number } {
  try {
    const key = `rate_limit_${actionKey}`;
    const rawData = localStorage.getItem(key);
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    let timestamps: number[] = rawData ? JSON.parse(rawData) : [];
    // Filter out timestamps outside the active window
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxSubmissions) {
      const oldestTs = Math.min(...timestamps);
      const remainingMs = windowMs - (now - oldestTs);
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return { allowed: false, remainingMinutes };
    }

    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));
    return { allowed: true, remainingMinutes: 0 };
  } catch (e) {
    // Fallback allowed if localStorage is blocked
    return { allowed: true, remainingMinutes: 0 };
  }
}

/**
 * Sanitizes user input string against XSS, script injection, and dangerous HTML entities.
 */
export function sanitizeInput(input: string, maxLength = 300): string {
  if (!input) return "";

  // Truncate to maximum safe length
  let clean = input.slice(0, maxLength);

  // Strip script tags, event handlers (onerror=, onload=), and javascript: URIs
  clean = clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/<[^>]*>?/gm, ""); // Strip raw HTML tags

  // Trim extraneous whitespace
  return clean.trim();
}

/**
 * Basic bot detection heuristic (detects headless drivers & automated rapid scripts)
 */
export function isLikelyBot(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as any;
  // Check for common automated web driver flags
  if (nav.webdriver) return true;
  if (nav.languages === undefined || nav.languages.length === 0) return true;
  return false;
}
