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

      {/* Polaroid fan container */}
      <div 
        style={{
          height: "220px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          margin: "15px 0"
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
                backgroundColor: "#ffffff",
                border: "2px solid #18181b",
                boxShadow: "4px 4px 0px #18181b",
                padding: "8px 8px 24px 8px", // typical thick Polaroid bottom margin
                position: "absolute",
                transform: `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 1.5}px)`,
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
                zIndex: idx + 1
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.15) rotate(0deg) translateY(-15px)";
                el.style.zIndex = "20";
                el.style.boxShadow = "8px 8px 0px var(--color-rose-accent), 8px 8px 0px #18181b";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 1.5}px)`;
                el.style.zIndex = `${idx + 1}`;
                el.style.boxShadow = "4px 4px 0px #18181b";
              }}
            >
              {/* Polaroid Image Box */}
              <div 
                style={{
                  width: "100%",
                  height: "115px",
                  background: bg,
                  borderRadius: "6px",
                  border: "1.5px solid #18181b",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px",
                  textAlign: "center",
                  color: "#18181b",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)"
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>🥇</div>
                <div style={{ fontSize: "0.6rem", fontWeight: "900", fontFamily: "var(--font-body)", letterSpacing: "0.2px", textTransform: "uppercase", lineHeight: 1.2 }}>
                  {name}
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div 
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontFamily: "var(--font-retro)",
                  fontSize: "1.2rem",
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
    </div>
  );
};
export default PolaroidCertificates;
