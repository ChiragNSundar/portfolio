import React, { useState } from "react";
import { coverVideos } from "../data/tracks";

interface YoutubeCoversCardProps {
  onInteract?: () => void;
}

export const YoutubeCoversCard: React.FC<YoutubeCoversCardProps> = ({ onInteract }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeVideo = coverVideos[currentIdx];

  const handleSelectCover = (idx: number) => {
    setCurrentIdx(idx);
    if (onInteract) onInteract();
  };

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderColor: "#18181b",
        boxShadow: "8px 8px 0px rgba(12, 166, 120, 0.15), 8px 8px 0px #18181b"
      }}
    >
      {/* Category Tag & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            BAY 02 // COVERS & PRODUCTIONS
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
            [YOUTUBE PERFORMANCE CATALOG]
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--color-mint-accent)", fontWeight: "bold", marginTop: "2px" }}>
            Note: These covers showcase my mixing & production capabilities
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div 
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "stretch",
          flexDirection: "row"
        }}
      >
        {/* Left Column: Video Embed Screen */}
        <div 
          style={{
            flexGrow: 2,
            flexBasis: "0",
            position: "relative",
            backgroundColor: "#000",
            border: "1.5px solid #18181b",
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
            />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
              NO VIDEO BUFFERED
            </div>
          )}
        </div>

        {/* Right Column: Folder Directory Selector */}
        <div 
          style={{
            width: "220px",
            background: "#fafafa",
            border: "1.5px solid #18181b",
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
                borderBottom: "1px dashed #d4d4d8",
                paddingBottom: "6px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              📂 C:\VOL\COVERS\
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
              {coverVideos.map((video, idx) => {
                const isActive = currentIdx === idx;
                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectCover(idx)}
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
              borderTop: "1px dashed #d4d4d8",
              paddingTop: "6px",
              textAlign: "center"
            }}
          >
            ITEMS LOADED: {coverVideos.length} // STATE: STABLE
          </div>
        </div>
      </div>
    </div>
  );
};
export default YoutubeCoversCard;
