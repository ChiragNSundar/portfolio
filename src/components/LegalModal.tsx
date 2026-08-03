import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface LegalModalProps {
  activeTab: "privacy" | "terms" | null;
  onClose: () => void;
  onSelectTab: (tab: "privacy" | "terms") => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  activeTab,
  onClose,
  onSelectTab
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (activeTab) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, onClose]);

  if (!activeTab) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(24, 24, 27, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        padding: "20px"
      }}
    >
      <div
        className="modal-spring-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "85vh",
          backgroundColor: "var(--card-bg)",
          border: "3px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "12px 12px 0px var(--card-shadow)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "2px solid var(--border-color)",
            backgroundColor: "var(--bg-cream)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          {/* Tab Selection Buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-lcd)",
                fontSize: "0.7rem",
                color: "var(--color-amber-accent)",
                fontWeight: "bold",
                marginRight: "6px"
              }}
            >
              LEGAL CONSOLE //
            </div>
            <button
              onClick={() => onSelectTab("privacy")}
              className={`analog-btn ${activeTab === "privacy" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-lcd)",
                background: activeTab === "privacy" ? "var(--color-amber-accent)" : "var(--card-bg)",
                color: activeTab === "privacy" ? "#ffffff" : "var(--text-dark)"
              }}
            >
              🔒 PRIVACY POLICY
            </button>
            <button
              onClick={() => onSelectTab("terms")}
              className={`analog-btn ${activeTab === "terms" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-lcd)",
                background: activeTab === "terms" ? "var(--color-lavender-accent)" : "var(--card-bg)",
                color: activeTab === "terms" ? "#ffffff" : "var(--text-dark)"
              }}
            >
              📜 TERMS & CONDITIONS
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="analog-btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-lcd)",
              fontWeight: "bold"
            }}
          >
            ✖ CLOSE [ESC]
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: "28px 32px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            fontSize: "0.92rem",
            lineHeight: 1.6,
            color: "var(--text-dark)"
          }}
        >
          {activeTab === "privacy" ? (
            <>
              <div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-lcd)",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: "var(--color-amber-accent)",
                    background: "var(--color-amber)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    marginBottom: "8px"
                  }}
                >
                  SYSTEM AUDIT // PRIVACY PROTOCOL 2026
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-0.5px" }}>
                  Privacy Policy
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                  Last updated: August 2026 — Chirag N Sundar Portfolio Engine
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    1. Data Collection & Guestbook Submissions
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    Chirag N Sundar's Portfolio Engine collects minimal data necessary to power interactive functions. When you sign the Guestbook, the details provided (Name, Message, and optional Email) are stored in our secure backend (Supabase) to display signatures across portfolio sessions.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    2. Client-Side Web Audio & Interactive Processing
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    All interactive audio stem playback, vocal multitrack mixing, 3D tilt math, and visual oscilloscope renders occur strictly inside your browser memory using Web Audio API. No raw microphone, audio stream, or biological biometric data is captured or transmitted to external servers.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    3. Local Storage & Spam Protection
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    We utilize browser local storage strictly for functional preferences (such as maintaining your active console role, storing offline guestbook drafts, and rate-limiting timestamp hashes for spam prevention). We do not use third-party tracking pixels or commercial ad networks.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    4. External Services & Media Integrations
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    Embedded elements (such as YouTube video cover players and Spotify media previews) operate under their respective platform privacy policies. Interacting with embedded players may load external assets governed by those third-party providers.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    5. Data Rights & Contact
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    You have full rights to request the removal or editing of any guestbook entry submitted under your name. To request removal or inquire about privacy practices, please contact Chirag N Sundar directly via the portfolio contact module or email.
                  </p>
                </section>
              </div>
            </>
          ) : (
            <>
              <div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-lcd)",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: "var(--color-lavender-accent)",
                    background: "var(--color-lavender)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    marginBottom: "8px"
                  }}
                >
                  SYSTEM RULES // TERMS OF SERVICE 2026
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-0.5px" }}>
                  Terms & Conditions (T&C)
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                  Last updated: August 2026 — Chirag N Sundar Portfolio Engine
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    1. Acceptance of Terms
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    By accessing, navigating, or interacting with Chirag N Sundar's Portfolio Engine (including all interactive modules, audio mixing suites, and project console views), you agree to comply with and be bound by these Terms and Conditions.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    2. Intellectual Property Rights
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    All original software code, project architecture designs, custom UI components, audio stem mix files, video content, and original musical tracks (including "No Bitches", vocal mix chains, and production assets) are the exclusive intellectual property of Chirag N Sundar unless explicitly attributed to external open-source projects or third-party licensors.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    3. Permitted & Fair Use
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    Visitors are granted a limited, personal, non-transferable license to view, test, and evaluate the portfolio engine for hiring, collaboration, engineering review, or production inquiry purposes. You may not re-distribute, re-sell, or re-brand these assets as your own work without prior written consent.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    4. Acceptable Conduct & Security
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    Users must refrain from submitting profane, abusive, or automated spam content through the guestbook console, attempting SQL/NoSQL injection, or initiating denial-of-service attempts against backend endpoints. System integrity is monitored automatically.
                  </p>
                </section>

                <section style={{ background: "#fafafa", padding: "16px", borderRadius: "10px", border: "1.5px solid var(--border-color)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "6px", color: "var(--text-dark)" }}>
                    5. Disclaimer & Limitation of Liability
                  </h3>
                  <p style={{ color: "#3f3f46" }}>
                    This portfolio platform and all featured engineering applications (RoadWatch, AI JD Bot, Harmony Hub, VibeLyrics, Vocal Muse) are provided "as is" for demonstration and educational purposes. Chirag N Sundar is not liable for any temporary service interruptions or third-party network outages.
                  </p>
                </section>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "2px solid var(--border-color)",
            backgroundColor: "var(--bg-cream)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "bold" }}>
            CHIRAG N SUNDAR &copy; 2026 // ALL RIGHTS RESERVED
          </div>
          <button
            onClick={onClose}
            className="analog-btn active"
            style={{
              padding: "6px 18px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-lcd)"
            }}
          >
            ACKNOWLEDGE & CLOSE &rarr;
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
