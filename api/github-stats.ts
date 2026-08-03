export default async function handler(req: any, res: any) {
  try {
    // Enable CORS for client fetching if needed
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

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
