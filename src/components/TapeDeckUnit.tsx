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

  // Playhead tracking for the waveform progress bar (0 to 19 seconds)
  const [trackProgress, setTrackProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Sync reels, VU meters, and simulated progress
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

  // Handle playhead timer progress increment (simulating 19s track duration)
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 19) {
            // Loop progress back to start
            return 0;
          }
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

  // Reset playhead progress on track change or manual stop
  useEffect(() => {
    setTrackProgress(0);
  }, [currentTrack]);

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

  const formatProgressTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Static waveform bar heights representing a typical vocal/synth track
  const waveformHeights = [
    25, 45, 30, 20, 15, 10, 12, 28, 48, 50, 42, 35, 20, 18, 12, 10, 
    15, 24, 38, 48, 44, 36, 28, 22, 16, 12, 10, 14, 25, 35, 48, 52, 
    55, 48, 42, 30, 24, 18, 14, 10, 12, 22, 36, 45, 52, 54, 48, 38, 
    32, 26, 20, 16, 12, 10, 15, 28, 42, 48, 45, 38, 30, 22, 15
  ];

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
      {/* Header */}
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
          padding: "10px 16px",
          borderRadius: "4px"
        }}
      >
        {/* Left Reel */}
        <div style={{ position: "relative", width: "85px", height: "85px" }}>
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
        </div>

        {/* Center VU meters */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", color: "var(--color-gold)", letterSpacing: "1px" }}>
            VU LEVEL
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <div 
              style={{
                width: "50px", 
                height: "30px", 
                background: "radial-gradient(circle at 50% 100%, #442a12 0%, #170a01 100%)",
                border: "1px solid var(--color-gold-dark)",
                borderRadius: "3px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.2px",
                  height: "22px",
                  backgroundColor: "#e53e3e",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuLeft * 60) - 30}deg)`
                }}
              />
            </div>
            <div 
              style={{
                width: "50px", 
                height: "30px", 
                background: "radial-gradient(circle at 50% 100%, #442a12 0%, #170a01 100%)",
                border: "1px solid var(--color-gold-dark)",
                borderRadius: "3px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.2px",
                  height: "22px",
                  backgroundColor: "#e53e3e",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuRight * 60) - 30}deg)`
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "2px" }}>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{
                accentColor: "var(--color-gold)",
                width: "60px",
                height: "3px",
                cursor: "pointer"
              }}
            />
          </div>
        </div>

        {/* Right Reel */}
        <div style={{ position: "relative", width: "85px", height: "85px" }}>
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
        </div>
      </div>

      {/* "HEAR THE DIFFERENCE" Waveform Player Panel (Pixel-Perfect from Screenshot) */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#0d0d0f",
          border: "1px solid #1c1c1f",
          borderRadius: "8px",
          padding: "16px",
          gap: "14px"
        }}
      >
        {/* Header line: Title on left, Pill Toggle Switch on right */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}
        >
          {/* Left Title */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              fontFamily: "var(--font-body)",
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#ffffff"
            }}
          >
            <span style={{ color: "#a855f7" }}>🎵</span>
            Hear The Difference
          </div>

          {/* Right Pill Toggle Switch */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              background: "#16161a",
              border: "1px solid #25252b",
              borderRadius: "20px",
              padding: "2px",
              position: "relative",
              cursor: "pointer"
            }}
          >
            {/* Dry Option */}
            <button
              onClick={() => onMixRatioChange(0)}
              style={{
                background: "transparent",
                border: "none",
                color: mixRatio === 0 ? "#ffffff" : "#7c7c8a",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "6px 14px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "color 0.2s",
                zIndex: 2
              }}
            >
              Dry Vocal
            </button>

            {/* With Preset Option */}
            <button
              onClick={() => onMixRatioChange(1)}
              style={{
                background: "transparent",
                border: "none",
                color: mixRatio === 1 ? "#ffffff" : "#7c7c8a",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "6px 14px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "color 0.2s",
                zIndex: 2
              }}
            >
              With Preset
            </button>

            {/* Sliding Pill Highlight background */}
            <div 
              style={{
                position: "absolute",
                top: "2px",
                left: mixRatio === 0 ? "2px" : "80px", // offset slide
                width: mixRatio === 0 ? "76px" : "90px", // match text width
                height: "calc(100% - 4px)",
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                borderRadius: "16px",
                boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)",
                transition: "all 0.25s cubic-bezier(0.19, 1, 0.22, 1)",
                zIndex: 1
              }}
            />
          </div>
        </div>

        {/* Playback Controls & Waveform Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Play/Pause round button */}
          <button
            onClick={onPlayToggle}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(124, 58, 237, 0.45)",
              color: "#ffffff",
              fontSize: "1.2rem",
              transition: "transform 0.1s"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Audio Waveform Graphic */}
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            <svg 
              width="100%" 
              height="35" 
              viewBox="0 0 380 40" 
              style={{ display: "block" }}
            >
              {waveformHeights.map((h, i) => {
                // Determine if this bar has been traversed by the playhead
                const barPercent = (i / waveformHeights.length) * 100;
                const elapsedPercent = (trackProgress / 19) * 100;
                const isPassed = barPercent <= elapsedPercent;

                return (
                  <rect
                    key={i}
                    x={i * 6} // bar width 4px + gap 2px
                    y={20 - h/2}
                    width="3.5"
                    height={h}
                    rx="1.5"
                    fill={isPassed 
                      ? "url(#passedGrad)" 
                      : "#202026"
                    }
                    style={{ transition: "fill 0.3s ease" }}
                  />
                );
              })}
              <defs>
                <linearGradient id="passedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>

            {/* Time labels under waveform */}
            <div 
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-lcd)",
                fontSize: "0.6rem",
                color: "#555"
              }}
            >
              <span>{formatProgressTime(trackProgress)}</span>
              <span>0:19</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tape navigation transport controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button className="analog-btn" onClick={handlePrev} style={{ padding: "4px 12px" }}>
          ⏮ PREV
        </button>
        <button className="analog-btn" onClick={onStop} style={{ padding: "4px 12px" }}>
          ⏹ STOP
        </button>
        <button className="analog-btn" onClick={handleNext} style={{ padding: "4px 12px" }}>
          ⏭ NEXT
        </button>
      </div>

      {/* Cassette grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--color-gold)", letterSpacing: "1px", fontWeight: "bold" }}>
          SELECT CASSETTE TRACK:
        </span>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
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
                    ? `radial-gradient(circle at center, rgba(${parseInt(track.color.slice(1,3), 16)}, ${parseInt(track.color.slice(3,5), 16)}, ${parseInt(track.color.slice(5,7), 16)}, 0.12) 0%, #151518 100%)` 
                    : "#08080a",
                  border: isActive ? `1.5px solid ${track.color}` : "1px solid #1c1c20",
                  borderRadius: "3px",
                  padding: "6px 2px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: isActive ? `0 0 6px ${track.color}30` : "none",
                  transition: "all 0.12s ease",
                  height: "52px"
                }}
              >
                <span style={{ fontSize: "1.05rem", marginBottom: "1px" }}>
                  {track.icon}
                </span>
                <span 
                  style={{ 
                    fontFamily: "var(--font-lcd)", 
                    fontSize: "0.45rem", 
                    color: isActive ? "#ffffff" : "#555",
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
