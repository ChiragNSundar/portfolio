import React, { useState } from "react";
import { coverVideos, originalVideos } from "../data/tracks";

interface YoutubeCoversCardProps {
  onInteract?: () => void;
}

// Inline SVG YouTube play-button logo component
const YoutubeLogo: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 20, color = "#ff0000", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <rect x="1" y="4" width="22" height="16" rx="4" ry="4" fill={color} />
    <polygon points="10,8.5 16,12 10,15.5" fill="#fff" />
  </svg>
);

export const YoutubeCoversCard: React.FC<YoutubeCoversCardProps> = ({ onInteract }) => {
  const [activeTab, setActiveTab] = useState<"originals" | "covers">("originals");
  const videoList = activeTab === "originals" ? originalVideos : coverVideos;
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeVideo = videoList[currentIdx];

  const [emailCopied, setEmailCopied] = useState(false);

  const handleTabSwitch = (tab: "originals" | "covers") => {
    setActiveTab(tab);
    setCurrentIdx(0);
    if (onInteract) onInteract();
  };

  const handleSelectVideo = (idx: number) => {
    setCurrentIdx(idx);
    if (onInteract) onInteract();
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("chiragns12@gmail.com");
    setEmailCopied(true);
    window.location.href = "mailto:chiragns12@gmail.com";
    setTimeout(() => {
      setEmailCopied(false);
    }, 2000);
  };

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderColor: "var(--border-color)",
        boxShadow: "8px 8px 0px rgba(12, 166, 120, 0.15), 8px 8px 0px var(--card-shadow)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* YouTube logo border decorations */}
      <div style={{ position: "absolute", top: "10px", right: "12px", opacity: 0.08, pointerEvents: "none" }}>
        <YoutubeLogo size={64} color="var(--text-dark)" />
      </div>
      <div style={{ position: "absolute", bottom: "10px", left: "12px", opacity: 0.06, pointerEvents: "none", transform: "rotate(-15deg)" }}>
        <YoutubeLogo size={48} color="var(--text-dark)" />
      </div>
      <div style={{ position: "absolute", top: "50%", right: "-8px", opacity: 0.04, pointerEvents: "none", transform: "translateY(-50%) rotate(12deg)" }}>
        <YoutubeLogo size={80} color="var(--text-dark)" />
      </div>

      {/* Category Tag & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.2rem" }}>📺</span>
          <span 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.8rem", 
              color: "var(--color-mint-accent)",
              fontWeight: "bold",
              letterSpacing: "1px" 
            }}
          >
            ORIGINALS & COVERS
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
            [YOUTUBE PERFORMANCE CATALOG]
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--color-mint-accent)", fontWeight: "bold", marginTop: "2px" }}>
            Originals & covers showcasing mixing & production
          </span>
        </div>
      </div>

      {/* Originals / Covers Tab Switcher */}
      <div style={{ display: "flex", gap: "0", position: "relative", zIndex: 1 }}>
        <button
          onClick={() => handleTabSwitch("originals")}
          style={{
            flex: 1,
            padding: "10px 16px",
            fontFamily: "var(--font-lcd)",
            fontSize: "0.75rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            cursor: "pointer",
            border: "1.5px solid var(--border-color)",
            borderRadius: "12px 0 0 12px",
            background: activeTab === "originals" ? "var(--color-mint)" : "var(--card-bg-muted)",
            color: activeTab === "originals" ? "var(--color-mint-accent)" : "var(--text-muted)",
            borderRight: activeTab === "originals" ? "1.5px solid var(--color-mint-accent)" : "none",
            boxShadow: activeTab === "originals" ? "inset 0 -3px 0 var(--color-mint-accent)" : "none",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          🎤 ORIGINALS
        </button>
        <button
          onClick={() => handleTabSwitch("covers")}
          style={{
            flex: 1,
            padding: "10px 16px",
            fontFamily: "var(--font-lcd)",
            fontSize: "0.75rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            cursor: "pointer",
            border: "1.5px solid var(--border-color)",
            borderRadius: "0 12px 12px 0",
            background: activeTab === "covers" ? "var(--color-mint)" : "var(--card-bg-muted)",
            color: activeTab === "covers" ? "var(--color-mint-accent)" : "var(--text-muted)",
            borderLeft: activeTab === "covers" ? "1.5px solid var(--color-mint-accent)" : "none",
            boxShadow: activeTab === "covers" ? "inset 0 -3px 0 var(--color-mint-accent)" : "none",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          🎧 COVERS
        </button>
      </div>

      {/* Main Split Layout */}
      <div 
        className="flex-row-mobile-stack"
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "stretch",
          flexDirection: "row",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Left Column: Video Embed Screen */}
        <div 
          className="full-width-mobile"
          style={{
            flexGrow: 2,
            flexBasis: "0",
            position: "relative",
            backgroundColor: "#000",
            border: "1.5px solid var(--border-color)",
            borderRadius: "16px",
            height: "310px",
            overflow: "hidden",
            boxShadow: "inset 0 4px 10px rgba(0,0,0,0.3)"
          }}
        >
          {activeVideo ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ display: "block" }}
              loading="lazy"
            />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
              NO VIDEO BUFFERED
            </div>
          )}
        </div>

        {/* Right Column: Folder Directory Selector */}
        <div 
          className="full-width-mobile"
          style={{
            width: "100%",
            maxWidth: "220px",
            background: "var(--card-bg-muted)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "space-between"
          }}
        >
          {/* Folder Path header */}
          <div>
            <div 
              style={{
                fontFamily: "var(--font-lcd)",
                fontSize: "0.7rem",
                color: "var(--color-mint-accent)",
                fontWeight: "bold",
                borderBottom: "1px dashed var(--border-color)",
                paddingBottom: "6px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span>📂</span> C:\VOL\{activeTab === "originals" ? "ORIGINALS" : "COVERS"}\
              </div>
              <a 
                href="https://www.youtube.com/@HazardChirag" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: "#ff0000",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.58rem",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0px var(--card-shadow)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                  textDecoration: "none",
                  width: "fit-content"
                }}
              >
                <YoutubeLogo size={14} color="#fff" /> VISIT YOUTUBE
              </a>
            </div>

            {/* List */}
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                maxHeight: "200px",
                overflowY: "auto"
              }}
            >
              {videoList.map((video, idx) => {
                const isActive = currentIdx === idx;
                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      background: isActive ? "var(--color-mint)" : "transparent",
                      color: isActive ? "var(--color-mint-accent)" : "var(--text-dark)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      fontWeight: isActive ? "700" : "500",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      border: isActive ? "1.5px solid var(--color-mint-accent)" : "1.5px solid transparent",
                      transition: "all 0.1s"
                    }}
                    title={video.title}
                  >
                    <span>{isActive ? "🟢" : "📄"}</span>
                    <span style={{ textTransform: "uppercase" }}>
                      {video.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Directory Info */}
          <div 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.55rem", 
              color: "var(--text-muted)",
              borderTop: "1px dashed var(--border-color)",
              paddingTop: "6px",
              textAlign: "center"
            }}
          >
            ITEMS LOADED: {videoList.length} // MODE: {activeTab.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Playful Contact Panel for Music Production */}
      <div 
        style={{ 
          display: "flex", 
          gap: "12px", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          marginTop: "16px", 
          paddingTop: "16px", 
          borderTop: "1.5px dashed var(--border-color)",
          position: "relative",
          zIndex: 1
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
            color: "var(--text-dark)",
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
          href="https://instagram.com/chirag.localhost"
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
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          INSTAGRAM
        </a>
        <a 
          href="https://www.youtube.com/@HazardChirag"
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
          <YoutubeLogo size={16} />
          YOUTUBE
        </a>
      </div>
    </div>
  );
};
export default YoutubeCoversCard;
