import React, { useState } from "react";
import { resumeData } from "../data/resume";

export const PolaroidCertificates: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{ name: string; provider: string; bg: string } | null>(null);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("chiragns12@gmail.com");
    setEmailCopied(true);
    window.location.href = "mailto:chiragns12@gmail.com";
    setTimeout(() => {
      setEmailCopied(false);
    }, 2000);
  };

  // Close lightbox modal on Escape press
  React.useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);
  // A curated color palette for the polaroid inner backgrounds
  const colors = [
    "linear-gradient(135deg, #f8bbd0, #f06292)", // rose pastels
    "linear-gradient(135deg, #e1bee7, #ba68c8)", // lavender pastels
    "linear-gradient(135deg, #b2dfdb, #4db6ac)", // mint pastels
    "linear-gradient(135deg, #ffe082, #ffb300)"  // amber pastels
  ];

  // Rotate angles to fan out the cards
  const rotations = [-6, -2, 3, 7];

  return (
    <div 
      className="creative-card"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "28px",
        gap: "20px",
        borderColor: "var(--border-color)",
        boxShadow: "8px 8px 0px rgba(230, 73, 128, 0.15), 8px 8px 0px var(--card-shadow)"
      }}
    >
      <div 
        style={{
          borderBottom: "1.5px solid var(--border-color)",
          paddingBottom: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.2rem" }}>🎖️</span>
          <span 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.8rem", 
              color: "var(--color-rose-accent)",
              fontWeight: "bold",
              letterSpacing: "1px" 
            }}
          >
            BAY 04 // CREDENTIAL STACKS
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
          [POLAROID DOSSIER]
        </span>
      </div>

      {/* Polaroid side-by-side container */}
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          margin: "15px 0",
          padding: "10px"
        }}
      >
        {resumeData.certifications.map((cert, idx) => {
          const rotation = rotations[idx % rotations.length];
          const bg = colors[idx % colors.length];

          // Split credentials for clean typesetting
          const name = cert.split(" - ")[0];
          const provider = cert.split(" - ")[1] || "Credential";

          return (
            <div
              key={idx}
              onClick={() => setSelectedCert({ name, provider, bg })}
              style={{
                width: "145px",
                height: "180px",
                backgroundColor: "var(--card-bg)",
                border: "2px solid var(--border-color)",
                boxShadow: "4px 4px 0px var(--card-shadow)",
                padding: "8px 8px 20px 8px", // typical thick Polaroid bottom margin
                transform: `rotate(${rotation}deg)`,
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.12) rotate(0deg) translateY(-8px)";
                el.style.boxShadow = "6px 6px 0px var(--color-rose-accent), 6px 6px 0px var(--card-shadow)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = `rotate(${rotation}deg)`;
                el.style.boxShadow = "4px 4px 0px var(--card-shadow)";
              }}
            >
              {/* Polaroid Image Box */}
              <div 
                style={{
                  width: "100%",
                  height: "110px",
                  background: bg,
                  borderRadius: "6px",
                  border: "1.5px solid var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "6px",
                  textAlign: "center",
                  color: "#18181b",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)"
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "2px" }}>🥇</div>
                <div style={{ fontSize: "0.58rem", fontWeight: "900", fontFamily: "var(--font-body)", letterSpacing: "0.2px", textTransform: "uppercase", lineHeight: 1.15 }}>
                  {name}
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div 
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontFamily: "var(--font-retro)",
                  fontSize: "1.15rem",
                  color: "var(--text-dark)",
                  lineHeight: 1.1,
                  transform: "rotate(-1deg)",
                  fontWeight: "bold"
                }}
              >
                {provider}
              </div>
            </div>
          );
        })}
      </div>
      
      <div 
        style={{ 
          fontFamily: "var(--font-lcd)", 
          fontSize: "0.65rem", 
          color: "var(--text-muted)", 
          textAlign: "center",
          marginTop: "4px"
        }}
      >
        HOVER OVER A CREDENTIAL FILE TO FAN AND ROTATE THE POLAROIDS FOR ANALYSIS
      </div>

      {/* Playful Contact Panel */}
      <div 
        style={{ 
          display: "flex", 
          gap: "12px", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          marginTop: "16px", 
          paddingTop: "16px", 
          borderTop: "1.5px dashed var(--border-color)" 
        }}
      >
        <a 
          href="mailto:chiragns12@gmail.com"
          onClick={handleEmailClick}
          className="analog-btn"
          style={{ 
            padding: "8px 16px", 
            fontSize: "0.75rem", 
            textDecoration: "none", 
            color: "#18181b",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: "block" }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {emailCopied ? "COPIED!" : "EMAIL"}
        </a>
        <a 
          href="https://github.com/ChiragNSundar"
          target="_blank"
          rel="noopener noreferrer"
          className="analog-btn"
          style={{ 
            padding: "8px 16px", 
            fontSize: "0.75rem", 
            textDecoration: "none", 
            color: "#18181b",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: "block" }}>
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          GITHUB
        </a>
        <a 
          href="https://www.linkedin.com/in/chiragnsundar/"
          target="_blank"
          rel="noopener noreferrer"
          className="analog-btn"
          style={{ 
            padding: "8px 16px", 
            fontSize: "0.75rem", 
            textDecoration: "none", 
            color: "var(--text-dark)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: "block" }}>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          LINKEDIN
        </a>
      </div>

      {/* Lightbox Modal Overlay */}
      {selectedCert && (
        <div 
          onClick={() => setSelectedCert(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24, 24, 27, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          {/* Polaroid card content */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "320px",
              backgroundColor: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              borderRadius: "4px",
              boxShadow: "12px 12px 0px var(--card-shadow)",
              padding: "16px 16px 40px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            {/* Close button inside card */}
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--card-bg-muted)",
                border: "2px solid var(--border-color)",
                fontWeight: "900",
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 2px 0px var(--card-shadow)",
                zIndex: 10,
                color: "var(--text-dark)"
              }}
            >
              ✕
            </button>

            {/* Polaroid image container (high-res display) */}
            <div 
              style={{
                width: "100%",
                height: "220px",
                background: selectedCert.bg,
                border: "2.5px solid var(--border-color)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                color: "#18181b",
                textAlign: "center"
              }}
            >
              <span style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🏆</span>
              <span style={{ fontSize: "1rem", fontWeight: "900", fontFamily: "var(--font-body)", textTransform: "uppercase", lineHeight: 1.2 }}>
                {selectedCert.name}
              </span>
            </div>

            {/* Handwritten caption */}
            <div 
              style={{
                marginTop: "12px",
                textAlign: "center",
                fontFamily: "var(--font-lcd)",
                fontSize: "1.1rem",
                color: "var(--text-dark)"
              }}
            >
              {selectedCert.provider}
            </div>

            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", marginTop: "4px" }}>
              STATE: VERIFIED &middot; SECURITY LOCK: ACTIVE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PolaroidCertificates;
