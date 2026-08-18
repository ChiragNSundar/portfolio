import React, { useState } from "react";

interface GuestbookEntry {
  id: string;
  name: string;
  email?: string;
  message: string;
  role?: string;
  created_at?: string;
}

interface ContactCardProps {
  mode: "engineer" | "producer";
  entries: GuestbookEntry[];
  guestName: string;
  guestEmail: string;
  guestMessage: string;
  isGuestbookSubmitting: boolean;
  moderationError: string | null;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onInteract?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  mode,
  entries,
  guestName,
  guestEmail,
  guestMessage,
  isGuestbookSubmitting,
  moderationError,
  onNameChange,
  onEmailChange,
  onMessageChange,
  onSubmit,
  onInteract
}) => {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      navigator.clipboard.writeText("chiragns12@gmail.com");
    } catch (_) {}
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=chiragns12@gmail.com", "_blank");
  };

  const contactLinks = mode === "engineer" ? [
    {
      title: "Direct Email",
      value: "chiragns12@gmail.com",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=chiragns12@gmail.com&su=Software%20Engineering%20Inquiry",
      iconImg: "/icons/gmail.png",
      color: "#ea4335",
      badge: "EMAIL DIRECT",
      isMail: true
    },
    {
      title: "GitHub Profile",
      value: "ChiragNSundar",
      url: "https://github.com/ChiragNSundar",
      iconImg: "/icons/github.png",
      color: "#24292e",
      badge: "CODE REPOS",
      isMail: false
    },
    {
      title: "LinkedIn Profile",
      value: "Chirag N Sundar",
      url: "https://www.linkedin.com/in/chiragnsundar/",
      iconImg: "/icons/linkedin.png",
      color: "#0a66c2",
      badge: "PROFESSIONAL",
      isMail: false
    }
  ] : [
    {
      title: "Fiverr Profile",
      value: "Book Mixing & Vocals",
      url: "https://www.fiverr.com/s/rEV8667",
      icon: "🟢",
      color: "#1dbf73",
      badge: "MIXING & VOCALS",
      isMail: false
    },
    {
      title: "Direct Email",
      value: "chiragns12@gmail.com",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=chiragns12@gmail.com&su=Vocal%20Mixing%20Inquiry",
      iconImg: "/icons/gmail.png",
      color: "#ea4335",
      badge: "EMAIL DIRECT",
      isMail: true
    },
    {
      title: "Instagram",
      value: "@chirag.localhost",
      url: "https://instagram.com/chirag.localhost",
      icon: "📸",
      color: "var(--color-rose-accent)",
      badge: "SOCIAL",
      isMail: false
    },
    {
      title: "YouTube Channel",
      value: "HazardChirag",
      url: "https://youtube.com/@HazardChirag",
      icon: "📺",
      color: "#ff0000",
      badge: "VIDEOS & MIXES",
      isMail: false
    },
    {
      title: "Spotify Profile",
      value: "HazardChirag",
      url: "https://open.spotify.com/user/wapj86uclwiwd4n2g94v7er6u",
      icon: "🎵",
      color: "#1DB954",
      badge: "SPOTIFY",
      isMail: false
    }
  ];

  return (
    <div
      id="contact-section"
      className="creative-card"
      onClick={onInteract}
      style={{
        padding: "36px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        borderColor: "var(--border-color)",
        boxShadow: "8px 8px 0px rgba(245, 159, 0, 0.2), 8px 8px 0px var(--card-shadow)"
      }}
    >
      {/* Header Tag */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.5rem" }}>📬</span>
          <span
            style={{
              fontFamily: "var(--font-lcd)",
              fontSize: "0.85rem",
              color: mode === "engineer" ? "var(--color-amber-accent)" : "var(--color-lavender-accent)",
              fontWeight: "900",
              letterSpacing: "1.5px"
            }}
          >
            {mode === "engineer" ? "DEVELOPER CONTACT CONSOLE" : "CONTACT & BOOKING CONSOLE"}
          </span>
        </div>
        <span
          style={{
            background: mode === "engineer" ? "var(--color-amber)" : "var(--color-lavender)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "0.72rem",
            fontWeight: "bold",
            color: "var(--text-dark)"
          }}
        >
          {mode === "engineer" ? "● OPEN FOR WORK" : "● OPEN FOR WORK & COLLABS"}
        </span>
      </div>

      {/* Intro Banner */}
      <div
        style={{
          background: "var(--card-bg-muted)",
          border: "2px solid var(--border-color)",
          borderRadius: "18px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxShadow: "4px 4px 0px var(--card-shadow)"
        }}
      >
        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-dark)", lineHeight: 1.1 }}>
          {mode === "engineer" ? "Let's Build Something Great Together" : "Let's Turn Your Raw Tracks Into Studio Records"}
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {mode === "producer"
            ? "Need professional vocal mixing, pitch correction, mastering, or beat production? You can book my services directly on Fiverr at https://www.fiverr.com/s/rEV8667, send a message below, or contact me via email and social channels."
            : "Looking for software development, full-stack web applications, data analytics, or Gen-AI integrations? Reach out to get started."}
        </p>
      </div>

      {/* Direct Contact Cards Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--text-dark)", letterSpacing: "0.5px" }}>
          DIRECT CHANNELS:
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >
          {contactLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              onClick={item.isMail ? handleEmailClick : undefined}
              target={item.isMail ? "_blank" : "_blank"}
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxShadow: "3px 3px 0px var(--card-shadow)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              className="tech-badge"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {"iconImg" in item && item.iconImg ? (
                  <img src={item.iconImg} alt={item.title} style={{ width: "26px", height: "26px", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: "1.5rem" }}>{"icon" in item ? item.icon : ""}</span>
                )}
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontFamily: "var(--font-lcd)",
                    fontWeight: "bold",
                    background: item.isMail && emailCopied ? "#10b981" : item.color,
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "6px"
                  }}
                >
                  {item.isMail && emailCopied ? "COPIED & OPENING!" : item.badge}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>{item.title}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--text-dark)", wordBreak: "break-all" }}>{item.value}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact & Guestbook Form */}
      <div
        style={{
          background: "var(--color-amber)",
          border: "2.5px solid var(--border-color)",
          borderRadius: "18px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "6px 6px 0px var(--card-shadow)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
            ✍️ Send Message / Sign Guestbook Log
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Leave a note, inquiry, or client review. Your email stays private.
          </span>
        </div>

        {/* Moderation Error Banner */}
        {moderationError && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "#b91c1c",
              fontWeight: "bold",
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              borderRadius: "8px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ⚠️ {moderationError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <input
              type="text"
              placeholder="Your Name *"
              value={guestName}
              onChange={(e) => onNameChange(e.target.value)}
              required
              maxLength={50}
              aria-label="Your Name"
              style={{
                flex: "1 1 200px",
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "0.9rem",
                outline: "none",
                color: "var(--text-dark)",
                fontWeight: "600"
              }}
            />
            <input
              type="email"
              placeholder="Your Email Address *"
              value={guestEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              aria-label="Your Email"
              style={{
                flex: "1 1 240px",
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "0.9rem",
                outline: "none",
                color: "var(--text-dark)",
                fontWeight: "600"
              }}
            />
          </div>

          <textarea
            placeholder="Write your message or inquiry here..."
            value={guestMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            required
            maxLength={300}
            rows={3}
            aria-label="Your Message"
            style={{
              width: "100%",
              background: "var(--card-bg)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "0.9rem",
              outline: "none",
              color: "var(--text-dark)",
              fontWeight: "500",
              resize: "vertical"
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              🔒 Guidelines: Respectful messages only. Max 300 characters.
            </span>
            <button
              type="submit"
              disabled={isGuestbookSubmitting}
              className="analog-btn active"
              style={{
                padding: "12px 28px",
                fontSize: "0.9rem",
                fontWeight: "900",
                background: "var(--text-dark)",
                color: "#ffffff",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              {isGuestbookSubmitting ? "SENDING..." : "✉️ SEND MESSAGE & SIGN LOG"}
            </button>
          </div>
        </form>

        {/* Recent Messages & Testimonials List */}
        <div style={{ marginTop: "12px", borderTop: "1.5px dashed var(--border-color)", paddingTop: "14px" }}>
          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-lcd)", fontWeight: "bold", color: "var(--text-dark)", display: "block", marginBottom: "8px" }}>
            RECENT MESSAGES & REVIEWS:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto" }}>
            {entries.length > 0 ? (
              entries.map((ent) => (
                <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.72rem", color: "var(--text-dark)", lineHeight: 1.4, padding: "6px 10px", background: "rgba(255,255,255,0.6)", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  &raquo; <span style={{ fontWeight: "bold", color: "var(--text-dark)" }}>{ent.name}</span>: {ent.message}
                </div>
              ))
            ) : (
              <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                No messages yet. Be the first to leave a message!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Music Producer Fiverr Booking Footer Banner */}
      {mode === "producer" && (
        <div
          style={{
            background: "linear-gradient(135deg, #1dbf73 0%, #108e52 100%)",
            border: "2.5px solid var(--border-color)",
            borderRadius: "18px",
            padding: "20px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            color: "#ffffff",
            boxShadow: "6px 6px 0px var(--card-shadow)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>💚</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-lcd)", fontWeight: "bold", letterSpacing: "1px" }}>
                FIVERR VERIFIED PROFILE
              </span>
            </div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "900", margin: 0, color: "#ffffff", lineHeight: 1.2 }}>
              Book My Services for Mixing & Vocal Processing
            </h4>
            <p style={{ fontSize: "0.82rem", margin: 0, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.4 }}>
              Looking for professional vocal tuning, pitch alignment, multitrack audio mixing, or mastering? Book directly through my Fiverr profile.
            </p>
          </div>
          <a
            href="https://www.fiverr.com/s/rEV8667"
            target="_blank"
            rel="noopener noreferrer"
            className="analog-btn active"
            style={{
              padding: "12px 22px",
              background: "#ffffff",
              color: "#0e6238",
              fontWeight: "900",
              fontSize: "0.88rem",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            🟢 BOOK SERVICES ON FIVERR ↗
          </a>
        </div>
      )}
    </div>
  );
};
