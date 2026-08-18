// Serverless sliding window rate limiter for DDoS & mass-request mitigation
const ipCache: Map<string, { count: number; windowStart: number }> = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 requests per minute per IP

export default async function handler(req: any, res: any) {
  try {
    // 1. Guard HTTP method (DDoS mitigation against POST/PUT/DELETE floods)
    if (req.method && req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 2. Extract Client IP
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    // 3. Sliding Window Rate Limiter
    const now = Date.now();
    const clientRecord = ipCache.get(clientIp);

    if (!clientRecord) {
      ipCache.set(clientIp, { count: 1, windowStart: now });
    } else if (now - clientRecord.windowStart > RATE_LIMIT_WINDOW_MS) {
      ipCache.set(clientIp, { count: 1, windowStart: now });
    } else {
      clientRecord.count += 1;
      if (clientRecord.count > MAX_REQUESTS_PER_WINDOW) {
        res.setHeader("Retry-After", "60");
        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", Math.ceil((clientRecord.windowStart + RATE_LIMIT_WINDOW_MS) / 1000).toString());
        return res.status(429).json({ error: "Too Many Requests. Rate limit exceeded. Please wait a minute before retrying." });
      }
    }

    const currentCount = ipCache.get(clientIp)?.count || 1;
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
    res.setHeader("X-RateLimit-Remaining", (MAX_REQUESTS_PER_WINDOW - currentCount).toString());

    // Security & CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    // Fetch user basic profile (repos, followers) from official REST API
    const userRes = await fetch("https://api.github.com/users/ChiragNSundar", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PortfolioApp/1.0"
      }
    });
    const userData = userRes.ok ? await userRes.json() : {};

    // Fetch public contributions HTML page for live yearly contribution count & calendar heat map
    const contribRes = await fetch("https://github.com/users/ChiragNSundar/contributions", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });

    let totalContributions = 788;
    let levels: number[] = [];

    if (contribRes.ok) {
      const html = await contribRes.text();
      
      // Parse total contributions e.g. "788 contributions in the last year"
      const match = html.match(/([\d,]+)\s+contributions/i);
      if (match) {
        totalContributions = parseInt(match[1].replace(/,/g, ""), 10);
      }

      // Parse data-level="0..4" for each day box in the contribution grid
      const matches = [...html.matchAll(/data-level="(\d+)"/g)];
      if (matches.length > 0) {
        levels = matches.map(m => parseInt(m[1], 10));
      }
    }

    // Set Vercel Edge CDN caching headers: Cache for 1 hour (3600s), background refresh (stale-while-revalidate)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

    return res.status(200).json({
      contributions: totalContributions,
      repos: userData.public_repos ?? 20,
      followers: userData.followers ?? 5,
      levels
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
      contributions: 788,
      repos: 20,
      followers: 5,
      levels: []
    });
  }
}
