import React from "react";

interface SpotifyReleaseCardProps {
  onInteract?: () => void;
}

export const SpotifyReleaseCard: React.FC<SpotifyReleaseCardProps> = ({ onInteract }) => {
  const trackUrl = "https://open.spotify.com/track/1RMaBcZWrsNII3XzHLzBPK?si=e6c2e32d07b149a7";
  const embedUrl = "https://open.spotify.com/embed/track/1RMaBcZWrsNII3XzHLzBPK?utm_source=generator&theme=0";

  return (
    <div
      className="creative-card"
      onClick={onInteract}
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        background: "#121212",
        color: "#ffffff",
        borderColor: "#1DB954",
        boxShadow: "0 0 20px rgba(29, 185, 84, 0.15), 8px 8px 0px var(--card-shadow)"
      }}
    >
      {/* Header Tag with Spotify Logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Spotify SVG Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3.102zM18.96 14.1c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.96-.18-1.08-.66-.12-.48.18-.96.66-1.08 4.32-1.32 9.78-.66 13.44 1.56.42.3.54.9.18 1.32zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.36z" />
          </svg>

          <span
            style={{
              fontFamily: "var(--font-lcd)",
              fontSize: "0.85rem",
              color: "#1DB954",
              fontWeight: "900",
              letterSpacing: "1.5px"
            }}
          >
            SPOTIFY RELEASES
          </span>
        </div>

        <span
          style={{
            background: "rgba(29, 185, 84, 0.15)",
            border: "1px solid #1DB954",
            color: "#1DB954",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.7rem",
            fontWeight: "bold"
          }}
        >
          ● NEW RELEASE
        </span>
      </div>

      {/* Mini Embedded Spotify Web Player */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            background: "#181818",
            border: "1px solid #282828",
            borderRadius: "14px",
            padding: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
          }}
        >
          <iframe
            title="Spotify Track Player"
            style={{ borderRadius: "12px" }}
            src={embedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Track Credits Section (Scraped from Image 2) */}
      <div
        style={{
          background: "#181818",
          border: "1.5px solid #282828",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #282828", paddingBottom: "10px" }}>
          <span style={{ fontSize: "1.1rem" }}>📋</span>
          <span style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>Official Track Credits</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {/* Artist Credits */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a7a7a7", fontWeight: "700", letterSpacing: "0.5px" }}>
              Artist
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#282828", padding: "8px 12px", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.88rem", display: "block", color: "#ffffff" }}>RMAN</span>
                  <span style={{ fontSize: "0.7rem", color: "#a7a7a7" }}>Main Artist</span>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(29, 185, 84, 0.2)", color: "#1DB954", padding: "2px 8px", borderRadius: "10px", fontWeight: "bold" }}>Verified</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#282828", padding: "8px 12px", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.88rem", display: "block", color: "#ffffff" }}>CIPHER</span>
                  <span style={{ fontSize: "0.7rem", color: "#a7a7a7" }}>Featured Artist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Composition & Lyrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a7a7a7", fontWeight: "700", letterSpacing: "0.5px" }}>
              Composition & Lyrics
            </span>
            <div style={{ background: "#282828", padding: "8px 12px", borderRadius: "8px" }}>
              <span style={{ fontWeight: "700", fontSize: "0.88rem", display: "block", color: "#ffffff" }}>RMAN</span>
              <span style={{ fontSize: "0.7rem", color: "#a7a7a7" }}>Composer • Lyricist</span>
            </div>
          </div>

          {/* Production & Engineering */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#1DB954", fontWeight: "800", letterSpacing: "0.5px" }}>
              Production & Engineering
            </span>
            <div style={{ background: "linear-gradient(135deg, #282828 0%, rgba(29, 185, 84, 0.15) 100%)", border: "1px solid #1DB954", padding: "8px 12px", borderRadius: "8px" }}>
              <span style={{ fontWeight: "800", fontSize: "0.92rem", display: "block", color: "#ffffff" }}>HazardChirag</span>
              <span style={{ fontSize: "0.72rem", color: "#1DB954", fontWeight: "700" }}>Studio Producer</span>
            </div>
          </div>
        </div>
      </div>

      {/* External Spotify Action Link */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#1DB954",
            color: "#000000",
            fontWeight: "900",
            fontSize: "0.82rem",
            padding: "10px 20px",
            borderRadius: "24px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s ease, background-color 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.backgroundColor = "#1ed760";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#1DB954";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3.102zM18.96 14.1c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.96-.18-1.08-.66-.12-.48.18-.96.66-1.08 4.32-1.32 9.78-.66 13.44 1.56.42.3.54.9.18 1.32zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.36z" />
          </svg>
          LISTEN ON SPOTIFY &rarr;
        </a>
      </div>
    </div>
  );
};
