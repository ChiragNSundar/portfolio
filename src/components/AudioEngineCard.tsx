import React, { useState, useEffect, useRef } from "react";
import { mixAndOriginalTracks } from "../data/tracks";
import type { Track } from "../data/tracks";

interface AudioEngineCardProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  mixRatio: number;
  volume: number;
  onTrackSelect: (track: Track) => void;
  onPlayToggle: () => void;
  onStop: () => void;
  onMixRatioChange: (ratio: number) => void;
  onVolumeChange: (vol: number) => void;
  onInteract?: () => void;
}

export const AudioEngineCard: React.FC<AudioEngineCardProps> = ({
  currentTrack,
  isPlaying,
  mixRatio,
  volume,
  onTrackSelect,
  onPlayToggle,
  onMixRatioChange,
  onVolumeChange,
  onInteract
}) => {
  const [trackProgress, setTrackProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Simulated playhead progress tracking (19s duration)
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 19) return 0;
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    setTrackProgress(0);
  }, [currentTrack]);

  const formatProgressTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const waveformHeights = [
    25, 45, 30, 20, 15, 10, 12, 28, 48, 50, 42, 35, 20, 18, 12, 10, 
    15, 24, 38, 48, 44, 36, 28, 22, 16, 12, 10, 14, 25, 35, 48, 52, 
    55, 48, 42, 30, 24, 18, 14, 10, 12, 22, 36, 45, 52, 54, 48, 38, 
    32, 26, 20, 16, 12, 10, 15, 28, 42, 48, 45, 38, 30, 22, 15
  ];

  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(waveformHeights);

  useEffect(() => {
    if (!isPlaying) {
      setVisualizerHeights(waveformHeights);
      return;
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.25;
      setVisualizerHeights(() => {
        return waveformHeights.map((h, i) => {
          // Bouncy sine wave offset for dynamic audio wave look
          const bounce = Math.sin(time + i * 0.45) * (h * 0.45);
          const newHeight = Math.max(4, h + bounce);
          return newHeight;
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderColor: "#18181b",
        boxShadow: "8px 8px 0px rgba(147, 51, 234, 0.15), 8px 8px 0px #18181b"
      }}
    >
      {/* Category Tag & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.2rem" }}>🎛️</span>
          <span 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.8rem", 
              color: "var(--color-lavender-accent)",
              fontWeight: "bold",
              letterSpacing: "1px" 
            }}
          >
            BAY 01 // AUDIO REFINEMENT
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
          [DUAL-STAGE LOCKSTEP MIXING]
        </span>
      </div>

      {/* Main Compare Playback Block */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
          border: "1.5px solid #18181b",
          borderRadius: "16px",
          padding: "20px",
          gap: "18px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "1.1rem" }}>
            <span className="bouncy-emoji">🎧</span>
            Hear The Difference
          </div>

          {/* Pill Toggle Switch */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              background: "#eaeaea",
              border: "1.5px solid #18181b",
              borderRadius: "20px",
              padding: "2px"
            }}
          >
            <button
              onClick={() => {
                onMixRatioChange(0);
                if (onInteract) onInteract();
              }}
              style={{
                background: mixRatio === 0 ? "var(--color-lavender-accent)" : "transparent",
                border: "none",
                color: mixRatio === 0 ? "#ffffff" : "#555",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "6px 14px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Before Mix
            </button>

            <button
              onClick={() => {
                onMixRatioChange(1);
                if (onInteract) onInteract();
              }}
              style={{
                background: mixRatio === 1 ? "var(--color-lavender-accent)" : "transparent",
                border: "none",
                color: mixRatio === 1 ? "#ffffff" : "#555",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "6px 14px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              After Mix Master
            </button>
          </div>
        </div>

        {/* Loaded Track Info & YouTube Stream Button */}
        {currentTrack && (
          <div 
            style={{ 
              background: "#ffffff", 
              border: "1.5px solid #18181b", 
              borderRadius: "12px", 
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: "bold", color: "var(--color-lavender-accent)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                LOADED WORKPIECE:
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "#18181b" }}>
                {currentTrack.title} &mdash; <span style={{ color: "#52525b" }}>{currentTrack.artist}</span>
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Style: {currentTrack.genre}
              </span>
            </div>
            
            {currentTrack.youtubeUrl && (
              <a 
                href={currentTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#ff0000",
                  border: "1.5px solid #18181b",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  padding: "5px 10px",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0px #18181b",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none"
                }}
              >
                📺 Stream on YouTube
              </a>
            )}
          </div>
        )}

        {/* Playback Progress Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={onPlayToggle}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-lavender-accent)",
              border: "1.5px solid #18181b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "3px 3px 0px #18181b",
              color: "#ffffff",
              fontSize: "1.1rem",
              transition: "transform 0.1s"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "translate(2px, 2px)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "translate(0)"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            <svg width="100%" height="30" viewBox="0 0 380 40">
              {visualizerHeights.map((h, i) => {
                const barPercent = (i / visualizerHeights.length) * 100;
                const elapsedPercent = (trackProgress / 19) * 100;
                const isPassed = barPercent <= elapsedPercent;

                return (
                  <rect
                    key={i}
                    x={i * 6}
                    y={20 - h/2}
                    width="3.5"
                    height={h}
                    rx="1.5"
                    fill={isPassed ? "var(--color-lavender-accent)" : "#e4e4e7"}
                    style={{ transition: "fill 0.3s ease" }}
                  />
                );
              })}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-lcd)" }}>
              <span>{formatProgressTime(trackProgress)}</span>
              <span>0:19</span>
            </div>
          </div>
        </div>

        {/* Volume Fader Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderTop: "1px dashed #e4e4e7", paddingTop: "12px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            style={{
              flexGrow: 1,
              accentColor: "var(--color-lavender-accent)",
              cursor: "pointer",
              height: "4px"
            }}
          />
        </div>
      </div>

      {/* Playlist Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.5px" }}>
          SELECT REPERTOIRE STEM:
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {mixAndOriginalTracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => {
                  onTrackSelect(track);
                  if (onInteract) onInteract();
                }}
                style={{
                  background: isActive ? "var(--color-lavender)" : "#ffffff",
                  border: isActive ? "2px solid var(--color-lavender-accent)" : "1.5px solid #18181b",
                  borderRadius: "12px",
                  padding: "12px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: isActive ? "none" : "3px 3px 0px #18181b",
                  transition: "all 0.15s ease",
                  transform: isActive ? "translate(2px, 2px)" : "none"
                }}
              >
                <span className="bouncy-emoji" style={{ fontSize: "1.4rem" }}>{track.icon}</span>
                <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {track.title}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                    SYSTEM STEM
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
