import React from "react";
import { resumeData } from "../data/resume";

export const PolaroidCertificates: React.FC = () => {
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
        borderColor: "#18181b",
        boxShadow: "8px 8px 0px rgba(230, 73, 128, 0.15), 8px 8px 0px #18181b"
      }}
    >
      <div 
        style={{
          borderBottom: "1.5px solid #18181b",
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
              style={{
                width: "145px",
                height: "180px",
                backgroundColor: "#ffffff",
                border: "2px solid #18181b",
                boxShadow: "4px 4px 0px #18181b",
                padding: "8px 8px 20px 8px", // typical thick Polaroid bottom margin
                transform: `rotate(${rotation}deg)`,
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.12) rotate(0deg) translateY(-8px)";
                el.style.boxShadow = "6px 6px 0px var(--color-rose-accent), 6px 6px 0px #18181b";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = `rotate(${rotation}deg)`;
                el.style.boxShadow = "4px 4px 0px #18181b";
              }}
            >
              {/* Polaroid Image Box */}
              <div 
                style={{
                  width: "100%",
                  height: "110px",
                  background: bg,
                  borderRadius: "6px",
                  border: "1.5px solid #18181b",
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
                  color: "#18181b",
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
          borderTop: "1.5px dashed #e4e4e7" 
        }}
      >
        <a 
          href="mailto:chiragns12@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="analog-btn"
          style={{ padding: "8px 16px", fontSize: "0.78rem", textDecoration: "none", color: "#18181b" }}
        >
          📧 EMAIL: chiragns12@gmail.com
        </a>
        <a 
          href="https://github.com/ChiragNSundar"
          target="_blank"
          rel="noopener noreferrer"
          className="analog-btn"
          style={{ padding: "8px 16px", fontSize: "0.78rem", textDecoration: "none", color: "#18181b" }}
        >
          💻 GITHUB: github.com/ChiragNSundar
        </a>
        <a 
          href="https://www.linkedin.com/in/chiragnsundar/"
          target="_blank"
          rel="noopener noreferrer"
          className="analog-btn"
          style={{ padding: "8px 16px", fontSize: "0.78rem", textDecoration: "none", color: "#18181b" }}
        >
          🔗 LINKEDIN: chiragnsundar
        </a>
      </div>
    </div>
  );
};
export default PolaroidCertificates;
