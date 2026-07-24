import React, { useState } from "react";

interface VocalMixingCardProps {
  onInteract?: () => void;
}

export const VocalMixingCard: React.FC<VocalMixingCardProps> = ({ onInteract }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const services = [
    { title: "Professional Vocal Mixing", subtitle: "Lead, Doubles, Ad-libs", icon: "🎙️" },
    { title: "Pitch Correction & Tuning", subtitle: "Transparent to hard Auto-Tune FX", icon: "🎵" },
    { title: "EQ & Frequency Balancing", subtitle: "Surgical dynamic EQ & air boosts", icon: "🎚️" },
    { title: "Compression & Dynamics", subtitle: "Punchy transient control & glue", icon: "🔊" },
    { title: "Reverb & Delay FX Processing", subtitle: "Spatial depth & tempo delays", icon: "🌊" },
    { title: "Stereo Imaging & Width", subtitle: "3D width & center lead focus", icon: "🌌" },
    { title: "Streaming-Ready Mastering", subtitle: "Loudness & spectral balance", icon: "💿" }
  ];

  const workflowSteps = [
    { step: "01", title: "Clean-up & Gain Staging", desc: "De-noising, mouth click removal, and headroom calibration." },
    { step: "02", title: "Surgical EQ & Tone Shaping", desc: "Carving room for the beat and removing resonant boxy frequencies." },
    { step: "03", title: "Controlled Compression", desc: "Multi-stage compression and subtle tube saturation for warmth." },
    { step: "04", title: "Creative FX Processing", desc: "Custom reverbs, ping-pong delays, and stereo width alignment." },
    { step: "05", title: "Final Bus & Master Polish", desc: "Limiting, dynamic EQ balance, and competitive streaming LUFS." }
  ];

  const whyChooseMe = [
    { text: "Industry-level clarity and punch", icon: "✨" },
    { text: "Modern streaming-ready loudness", icon: "📈" },
    { text: "Balanced low-end and crisp highs", icon: "⚖️" },
    { text: "Fast turnaround time", icon: "⚡" },
    { text: "Client-focused revisions until satisfaction", icon: "🤝" }
  ];

  return (
    <div
      className="creative-card"
      onClick={onInteract}
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        borderColor: "var(--border-color)",
        boxShadow: "8px 8px 0px rgba(147, 51, 234, 0.15), 8px 8px 0px var(--card-shadow)"
      }}
    >
      {/* Header Tag & Section Title */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.4rem" }}>🎛️</span>
          <span
            style={{
              fontFamily: "var(--font-lcd)",
              fontSize: "0.85rem",
              color: "var(--color-lavender-accent)",
              fontWeight: "bold",
              letterSpacing: "1.5px"
            }}
          >
            VOCAL MIXING & MASTERING PORTFOLIO
          </span>
        </div>
        <div
          style={{
            background: "var(--color-lavender)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "var(--color-lavender-accent)"
          }}
        >
          FL STUDIO WORKFLOW
        </div>
      </div>

      {/* Main Bio Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(243, 232, 255, 0.4) 100%)",
          border: "2px solid var(--border-color)",
          borderRadius: "18px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "4px 4px 0px var(--card-shadow)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "1.7rem", fontWeight: "900", color: "var(--text-dark)", lineHeight: 1.1 }}>
            Chirag N Sundar – Vocal Mixing & Mastering Engineer
          </h2>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["R&B", "Hip-Hop", "Rap", "Trap"].map((genre) => (
            <span
              key={genre}
              style={{
                background: "var(--text-dark)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: "800",
                padding: "3px 10px",
                borderRadius: "6px",
                letterSpacing: "0.5px"
              }}
            >
              {genre}
            </span>
          ))}
        </div>

        <p style={{ fontSize: "0.95rem", color: "var(--text-dark)", lineHeight: 1.6, fontWeight: "500" }}>
          I deliver clean, punchy, radio-ready vocals using professional workflows inside FL Studio with premium plugins and advanced processing chains.
        </p>
      </div>

      {/* FL Studio Vocal Processing Graphic Banner (Image 1 attached by user) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "#09090b",
          border: "2px solid var(--border-color)",
          borderRadius: "18px",
          padding: "16px",
          boxShadow: "6px 6px 0px var(--card-shadow)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.75rem", color: "#a1a1aa", fontWeight: "bold", letterSpacing: "1px" }}>
            FL STUDIO STUDIO RACK & PROCESSING PIPELINE
          </span>
          <span
            onClick={() => setShowImageModal(true)}
            style={{
              fontSize: "0.7rem",
              color: "#38bdf8",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline"
            }}
          >
            🔍 ENLARGE GRAPHIC
          </span>
        </div>

        <div
          onClick={() => setShowImageModal(true)}
          style={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "zoom-in",
            border: "1px solid #27272a"
          }}
        >
          <img
            src="/fl_vocal_mixing.jpg"
            alt="Vocal Mixing in FL Studio - Professional Vocal Processing Workflow"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              transition: "transform 0.3s ease"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              background: "rgba(0, 0, 0, 0.75)",
              color: "#22c55e",
              backdropFilter: "blur(4px)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.7rem",
              fontFamily: "var(--font-lcd)",
              fontWeight: "bold",
              border: "1px solid rgba(34, 197, 94, 0.4)"
            }}
          >
            ● FL STUDIO PRO CHAIN
          </div>
        </div>
      </div>

      {/* Services Offered Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
          🛠️ Services Offered
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >
          {services.map((srv, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--card-bg-muted)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                boxShadow: "3px 3px 0px var(--card-shadow)",
                transition: "transform 0.2s ease"
              }}
              className="tech-badge"
            >
              <span style={{ fontSize: "1.4rem" }}>{srv.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: "800", fontSize: "0.88rem", color: "var(--text-dark)" }}>{srv.title}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{srv.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Mixing Workflow Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
          🔄 My Mixing Workflow
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "3px 3px 0px var(--card-shadow)"
              }}
            >
              <div
                style={{
                  background: "var(--color-lavender-accent)",
                  color: "#ffffff",
                  fontFamily: "var(--font-lcd)",
                  fontWeight: "900",
                  fontSize: "0.85rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {step.step}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "800", fontSize: "0.92rem", color: "var(--text-dark)" }}>{step.title}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--color-lavender)",
            border: "1.5px dashed var(--color-lavender-accent)",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "0.85rem",
            color: "var(--color-lavender-accent)",
            fontWeight: "600",
            fontStyle: "italic",
            lineHeight: 1.5,
            textAlign: "center"
          }}
        >
          "Every mix is crafted to sit perfectly in the beat while keeping the vocals powerful, clear, and emotionally impactful."
        </div>
      </div>

      {/* Why Choose My Mixes & CTA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          alignItems: "stretch"
        }}
      >
        {/* Why Choose */}
        <div
          style={{
            background: "var(--card-bg-muted)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: "4px 4px 0px var(--card-shadow)"
          }}
        >
          <h4 style={{ fontSize: "1.05rem", fontWeight: "900", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "6px" }}>
            🌟 Why Choose My Mixes?
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {whyChooseMe.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", fontWeight: "600", color: "var(--text-dark)" }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Contact Box */}
        <div
          style={{
            background: "var(--text-dark)",
            color: "#ffffff",
            border: "2px solid var(--border-color)",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "16px",
            boxShadow: "6px 6px 0px rgba(147, 51, 234, 0.3)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.75rem", color: "var(--color-amber-accent)", fontWeight: "bold" }}>
              ELEVATE YOUR SOUND
            </span>
            <h4 style={{ fontSize: "1.2rem", fontWeight: "900", lineHeight: 1.2 }}>
              Ready to turn raw vocals into a professional record?
            </h4>
            <p style={{ fontSize: "0.8rem", color: "#a1a1aa", lineHeight: 1.4 }}>
              Let's work together on your next single or album project. Guaranteed radio-ready quality.
            </p>
          </div>

          <a
            href="mailto:chirag.n.sundar@gmail.com?subject=Vocal%20Mixing%20Inquiry"
            className="analog-btn active"
            style={{
              padding: "12px 20px",
              justifyContent: "center",
              background: "var(--color-lavender-accent)",
              color: "#ffffff",
              borderColor: "#ffffff",
              textDecoration: "none"
            }}
          >
            ✉️ CONTACT ME FOR MIXING &rarr;
          </a>
        </div>
      </div>

      {/* Image Modal Lightbox */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              maxHeight: "90vh",
              background: "#09090b",
              border: "2px solid var(--color-lavender-accent)",
              borderRadius: "16px",
              overflow: "hidden",
              padding: "12px",
              boxShadow: "0 0 40px rgba(147, 51, 234, 0.4)"
            }}
          >
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "var(--color-rose-accent)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontWeight: "900",
                fontSize: "1.1rem",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              ✕
            </button>

            <img
              src="/fl_vocal_mixing.jpg"
              alt="FL Studio Vocal Processing Diagram"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "82vh",
                objectFit: "contain",
                borderRadius: "8px",
                display: "block"
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
