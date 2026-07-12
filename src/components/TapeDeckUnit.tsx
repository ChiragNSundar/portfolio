import React, { useState, useEffect, useRef } from "react";
import { mixAndOriginalTracks } from "../data/tracks";
import type { Track } from "../data/tracks";
import { audioEngine } from "../audio/audioEngine";

interface TapeDeckUnitProps {
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

export const TapeDeckUnit: React.FC<TapeDeckUnitProps> = ({
  currentTrack,
  isPlaying,
  mixRatio,
  volume,
  onTrackSelect,
  onPlayToggle,
  onStop,
  onMixRatioChange,
  onVolumeChange,
  onInteract
}) => {
  const [reelAngle, setReelAngle] = useState(0);
  const [vuLeft, setVuLeft] = useState(0);
  const [vuRight, setVuRight] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying) {
        setReelAngle((prev) => (prev + (0.15 * delta)) % 360);

        const data = audioEngine.getAnalyserData();
        if (data.length > 0) {
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += data[i] * data[i];
          }
          const rms = Math.sqrt(sum / data.length);
          const targetNeedle = Math.min(1.0, rms * 4.8);
          
          setVuLeft((prev) => prev + (targetNeedle - prev) * 0.22);
          setVuRight((prev) => prev + (targetNeedle * (0.85 + Math.random() * 0.3) - prev) * 0.22);
        } else {
          setVuLeft((prev) => prev + (0.015 * Math.random() - prev) * 0.1);
          setVuRight((prev) => prev + (0.015 * Math.random() - prev) * 0.1);
        }
      } else {
        setVuLeft((prev) => prev * 0.8);
        setVuRight((prev) => prev * 0.8);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const handlePrev = () => {
    const idx = currentTrack ? mixAndOriginalTracks.findIndex(t => t.id === currentTrack.id) : 0;
    const prevIdx = (idx - 1 + mixAndOriginalTracks.length) % mixAndOriginalTracks.length;
    onTrackSelect(mixAndOriginalTracks[prevIdx]);
    if (onInteract) onInteract();
  };

  const handleNext = () => {
    const idx = currentTrack ? mixAndOriginalTracks.findIndex(t => t.id === currentTrack.id) : 0;
    const nextIdx = (idx + 1) % mixAndOriginalTracks.length;
    onTrackSelect(mixAndOriginalTracks[nextIdx]);
    if (onInteract) onInteract();
  };

  return (
    <div 
      className="console-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        gap: "14px",
        border: "1px solid var(--color-gold-dark)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.95)"
      }}
    >
      {/* Dynamic Header */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #2d2d32",
          paddingBottom: "6px"
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
          BAY 01 // ANALOG AUDIO TRANSLATION
        </span>
        <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "#666" }}>
          SYSTEM READY
        </span>
      </div>

      {/* Reel-to-Reel Mechanics Panel */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#080809",
          border: "1px solid #1f1f22",
          padding: "12px 16px",
          borderRadius: "4px"
        }}
      >
        {/* Left Reel (Supply Reel) */}
        <div style={{ position: "relative", width: "95px", height: "95px" }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? "none" : "transform 1s ease-out" }}
          >
            {/* Skeuomorphic open-spoke design */}
            <circle cx="50" cy="50" r="47" fill="#18181c" stroke="#555" strokeWidth="1" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
            
            {/* Magnetic tape wrapping around the center spokes */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="#251205" strokeWidth="8" opacity="0.9" />

            {/* spokes */}
            <path d="M 50 4 L 50 96 M 4 50 L 96 50" stroke="#777" strokeWidth="1" />
            <circle cx="50" cy="50" r="14" fill="#111" stroke="var(--color-gold)" strokeWidth="1" />
            
            {/* Hub structure */}
            <polygon points="50,42 58,55 42,55" fill="var(--color-gold-dark)" />
            <polygon points="50,58 42,45 58,45" fill="var(--color-gold-dark)" />
            <circle cx="50" cy="50" r="4" fill="#000" />
          </svg>
          <div style={{ position: "absolute", bottom: "-15px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.5rem", color: "#666" }}>
            SUPPLY REEL
          </div>
        </div>

        {/* Center: VU Indicators and volume */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", color: "var(--color-gold)", letterSpacing: "1px" }}>
            OUTPUT LEVEL
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* VU Meter A */}
            <div 
              style={{
                width: "60px", 
                height: "38px", 
                background: "radial-gradient(circle at 50% 100%, #442a12 0%, #170a01 100%)",
                border: "1px solid var(--color-gold-dark)",
                borderRadius: "3px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)"
              }}
            >
              {/* Backlight glow */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0, background: "rgba(255,140,0,0.15)", pointerEvents: "none" }} />
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.5px",
                  height: "28px",
                  backgroundColor: "#e53e3e",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuLeft * 60) - 30}deg)`,
                  transition: "transform 0.05s ease-out"
                }}
              />
              <span style={{ position: "absolute", bottom: "1px", left: "3px", fontFamily: "var(--font-lcd)", fontSize: "0.4rem", color: "rgba(255,255,255,0.3)" }}>CH A</span>
            </div>

            {/* VU Meter B */}
            <div 
              style={{
                width: "60px", 
                height: "38px", 
                background: "radial-gradient(circle at 50% 100%, #442a12 0%, #170a01 100%)",
                border: "1px solid var(--color-gold-dark)",
                borderRadius: "3px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)"
              }}
            >
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0, background: "rgba(255,140,0,0.15)", pointerEvents: "none" }} />
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.5px",
                  height: "28px",
                  backgroundColor: "#e53e3e",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuRight * 60) - 30}deg)`,
                  transition: "transform 0.05s ease-out"
                }}
              />
              <span style={{ position: "absolute", bottom: "1px", right: "3px", fontFamily: "var(--font-lcd)", fontSize: "0.4rem", color: "rgba(255,255,255,0.3)" }}>CH B</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{
                accentColor: "var(--color-gold)",
                width: "70px",
                height: "4px",
                cursor: "pointer"
              }}
            />
            <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.55rem", color: "var(--color-gold-light)", minWidth: "22px" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Right Reel (Takeup Reel) */}
        <div style={{ position: "relative", width: "95px", height: "95px" }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? "none" : "transform 1s ease-out" }}
          >
            <circle cx="50" cy="50" r="47" fill="#18181c" stroke="#555" strokeWidth="1" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#251205" strokeWidth="8" opacity="0.9" />

            <path d="M 50 4 L 50 96 M 4 50 L 96 50" stroke="#777" strokeWidth="1" />
            <circle cx="50" cy="50" r="14" fill="#111" stroke="var(--color-gold)" strokeWidth="1" />
            
            <polygon points="50,42 58,55 42,55" fill="var(--color-gold-dark)" />
            <polygon points="50,58 42,45 58,45" fill="var(--color-gold-dark)" />
            <circle cx="50" cy="50" r="4" fill="#000" />
          </svg>
          <div style={{ position: "absolute", bottom: "-15px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.5rem", color: "#666" }}>
            TAKEUP REEL
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER Synced Mixing Fader Panel */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "#080809",
          border: "1px solid #1d1d20",
          borderRadius: "4px",
          padding: "12px 16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-lcd)", fontSize: "0.7rem", fontWeight: "bold" }}>
          <span style={{ color: mixRatio === 0 ? "var(--color-gold-light)" : "#666", textShadow: mixRatio === 0 ? "var(--glow-gold)" : "none" }}>
            [A] BEFORE (RAW)
          </span>
          <span style={{ color: mixRatio === 1 ? "var(--color-green-glow)" : "#666", textShadow: mixRatio === 1 ? "var(--glow-green)" : "none" }}>
            [B] AFTER (MIXED)
          </span>
        </div>

        {/* Skeuomorphic track fader rail */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "8px", position: "relative", height: "24px" }}>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mixRatio}
            onChange={(e) => onMixRatioChange(parseFloat(e.target.value))}
            style={{
              accentColor: mixRatio > 0.5 ? "rgb(0, 255, 120)" : "var(--color-gold)",
              width: "100%",
              cursor: "pointer"
            }}
          />
        </div>
      </div>

      {/* Tape Transport Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button className="analog-btn" onClick={handlePrev} style={{ padding: "6px 14px" }} title="Previous">
          ⏮
        </button>
        <button 
          className={`analog-btn ${isPlaying ? "active" : ""}`} 
          onClick={onPlayToggle} 
          style={{ 
            padding: "6px 16px",
            borderColor: isPlaying ? "rgb(0, 255, 120)" : "#4a4a50",
            color: isPlaying ? "rgb(0, 255, 120)" : "#a0a0ab"
          }}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="analog-btn" onClick={onStop} style={{ padding: "6px 14px" }} title="Stop">
          ⏹
        </button>
        <button className="analog-btn" onClick={handleNext} style={{ padding: "6px 14px" }} title="Next">
          ⏭
        </button>
      </div>

      {/* 12-Slot Cassette Track Matrix Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--color-gold)", letterSpacing: "1px", fontWeight: "bold" }}>
          SELECT CASSETTE TRACK:
        </span>
        
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, 1fr)", 
            gap: "6px" 
          }}
        >
          {mixAndOriginalTracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => {
                  onTrackSelect(track);
                  if (onInteract) onInteract();
                }}
                style={{
                  background: isActive 
                    ? `radial-gradient(circle at center, rgba(${parseInt(track.color.slice(1,3), 16)}, ${parseInt(track.color.slice(3,5), 16)}, ${parseInt(track.color.slice(5,7), 16)}, 0.15) 0%, #151518 100%)` 
                    : "#0a0a0c",
                  border: isActive ? `1.5px solid ${track.color}` : "1px solid #202024",
                  borderRadius: "3px",
                  padding: "6px 2px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: isActive ? `0 0 8px ${track.color}40` : "none",
                  transition: "all 0.15s ease",
                  height: "55px"
                }}
              >
                <span style={{ fontSize: "1.1rem", marginBottom: "2px" }}>
                  {track.icon}
                </span>
                <span 
                  style={{ 
                    fontFamily: "var(--font-lcd)", 
                    fontSize: "0.45rem", 
                    color: isActive ? "#ffffff" : "#666",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textTransform: "uppercase",
                    width: "100%",
                    display: "block"
                  }}
                >
                  {track.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
