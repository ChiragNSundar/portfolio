import React from "react";
import { resumeData } from "../data/resume";

export const PolaroidCertificates: React.FC = () => {
  // A curated color palette for the polaroid inner backgrounds
  const colors = [
    "linear-gradient(135deg, #2b1055, #7597de)",
    "linear-gradient(135deg, #1f4037, #99f2c8)",
    "linear-gradient(135deg, #f12711, #f5af19)",
    "linear-gradient(135deg, #00c6ff, #0072ff)"
  ];

  // Rotate angles to fan out the cards
  const rotations = [-6, -2, 3, 7];

  return (
    <div 
      className="console-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "16px",
        border: "1px solid var(--color-gold-dark)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.95)"
      }}
    >
      <div 
        style={{
          borderBottom: "1px solid #2d2d32",
          paddingBottom: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
          BAY 03 // CREDENTIAL STACKS
        </span>
        <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "#666" }}>
          POLAROID FILE
        </span>
      </div>

      {/* Polaroid fan container */}
      <div 
        style={{
          height: "220px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          margin: "10px 0"
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
                width: "155px",
                height: "185px",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ddd",
                boxShadow: "0 8px 15px rgba(0,0,0,0.6)",
                padding: "8px 8px 24px 8px", // typical thick Polaroid bottom margin
                position: "absolute",
                transform: `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 1.5}px)`,
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
                zIndex: idx + 1
              }}
              // CSS custom variables on event handles for R3F-like hover animation
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.18) rotate(0deg) translateY(-15px)";
                el.style.zIndex = "20";
                el.style.boxShadow = "0 15px 30px rgba(0, 255, 120, 0.4)";
                el.style.borderColor = "var(--color-green-glow)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 1.5}px)`;
                el.style.zIndex = `${idx + 1}`;
                el.style.boxShadow = "0 8px 15px rgba(0,0,0,0.6)";
                el.style.borderColor = "#ddd";
              }}
            >
              {/* Polaroid Image Box */}
              <div 
                style={{
                  width: "100%",
                  height: "115px",
                  background: bg,
                  borderRadius: "2px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px",
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)"
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🎖️</div>
                <div style={{ fontSize: "0.6rem", fontWeight: "bold", fontFamily: "var(--font-display)", letterSpacing: "0.5px", textTransform: "uppercase", lineHeight: 1.2 }}>
                  {name}
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div 
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontFamily: "var(--font-retro)",
                  fontSize: "1.1rem",
                  color: "#2d3748",
                  lineHeight: 1.1,
                  transform: "rotate(-1deg)"
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
          fontSize: "0.6rem", 
          color: "#555", 
          textAlign: "center",
          marginTop: "4px"
        }}
      >
        HOVER OVER A POLAROID FILE TO FAN AND ROTATE THE CREDENTIALS FOR DISPLAY
      </div>
    </div>
  );
};
