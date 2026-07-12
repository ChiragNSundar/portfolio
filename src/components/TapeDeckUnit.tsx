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

  // Animate spinning reels and VU meters
  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying) {
        // Spin reels (approx 120 deg per second)
        setReelAngle((prev) => (prev + (0.12 * delta)) % 360);

        // Bouncing VU meters based on real time domain data
        const data = audioEngine.getAnalyserData();
        if (data.length > 0) {
          // Calculate RMS (Root Mean Square) for volume level
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += data[i] * data[i];
          }
          const rms = Math.sqrt(sum / data.length);
          // Normalize and scale level to degrees (-20 to +30 deg needle range)
          const targetNeedle = Math.min(1.0, rms * 4.5);
          
          // Add some analog needle bounce / inertia
          setVuLeft((prev) => prev + (targetNeedle - prev) * 0.25);
          setVuRight((prev) => prev + (targetNeedle * (0.9 + Math.random() * 0.2) - prev) * 0.25);
        } else {
          // Subtle resting rumble
          setVuLeft((prev) => prev + (0.02 * Math.random() - prev) * 0.15);
          setVuRight((prev) => prev + (0.02 * Math.random() - prev) * 0.15);
        }
      } else {
        // Slowly settle VU needles back to zero
        setVuLeft((prev) => prev * 0.85);
        setVuRight((prev) => prev * 0.85);
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
      style={{
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #252528, #18181a)",
        border: "5px solid #2d2d30",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)",
        gap: "20px"
      }}
    >
      {/* Top Section: Reels & VU Meters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Left Reel */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? "none" : "transform 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)" }}
          >
            {/* Reel base plate */}
            <circle cx="50" cy="50" r="46" fill="#121214" stroke="#c5a059" strokeWidth="2" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#3a3a40" strokeWidth="6" />
            
            {/* 3 spokes */}
            <path d="M 50 4 L 50 96 M 4 50 L 96 50" stroke="#c5a059" strokeWidth="3" />
            <path d="M 17.5 17.5 L 82.5 82.5" stroke="#c5a059" strokeWidth="3" />
            <path d="M 17.5 82.5 L 82.5 17.5" stroke="#c5a059" strokeWidth="3" />

            <circle cx="50" cy="50" r="10" fill="#2d2d30" stroke="#c5a059" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#000" />
          </svg>
          <div style={{ position: "absolute", bottom: "-18px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "var(--color-gold)" }}>
            SUPPLY REEL
          </div>
        </div>

        {/* Center: VU Meters & Volume */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            
            {/* Left VU Meter */}
            <div 
              style={{
                width: "80px", 
                height: "50px", 
                background: "radial-gradient(circle at 50% 100%, #3e2008 20%, #1f0d00 80%)",
                border: "2px solid var(--color-gold-dark)",
                borderRadius: "4px 4px 0 0",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Dial markings */}
              <div style={{ position: "absolute", top: "4px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "rgba(255,155,0,0.6)" }}>
                -20  -10  -5  0  +3 VU
              </div>
              {/* Needle pivot */}
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.5px",
                  height: "36px",
                  backgroundColor: "#ff5500",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuLeft * 50) - 25}deg)`,
                  transition: "transform 0.05s ease-out",
                  boxShadow: "0 0 3px rgba(255,85,0,0.8)"
                }}
              />
              <div style={{ position: "absolute", bottom: "2px", left: "6px", fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#888" }}>CH A</div>
            </div>

            {/* Right VU Meter */}
            <div 
              style={{
                width: "80px", 
                height: "50px", 
                background: "radial-gradient(circle at 50% 100%, #3e2008 20%, #1f0d00 80%)",
                border: "2px solid var(--color-gold-dark)",
                borderRadius: "4px 4px 0 0",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: "4px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "rgba(255,155,0,0.6)" }}>
                -20  -10  -5  0  +3 VU
              </div>
              <div 
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  width: "1.5px",
                  height: "36px",
                  backgroundColor: "#ff5500",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${(vuRight * 50) - 25}deg)`,
                  transition: "transform 0.05s ease-out",
                  boxShadow: "0 0 3px rgba(255,85,0,0.8)"
                }}
              />
              <div style={{ position: "absolute", bottom: "2px", right: "6px", fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#888" }}>CH B</div>
            </div>

          </div>

          {/* Master Output Level Volume Knobs */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "#777" }}>OUTPUT LEVEL</span>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{
                accentColor: "var(--color-gold)",
                width: "90px",
                cursor: "pointer"
              }}
            />
            <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--color-gold)", width: "30px" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Right Reel */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? "none" : "transform 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)" }}
          >
            <circle cx="50" cy="50" r="46" fill="#121214" stroke="#c5a059" strokeWidth="2" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#3a3a40" strokeWidth="6" />
            
            <path d="M 50 4 L 50 96 M 4 50 L 96 50" stroke="#c5a059" strokeWidth="3" />
            <path d="M 17.5 17.5 L 82.5 82.5" stroke="#c5a059" strokeWidth="3" />
            <path d="M 17.5 82.5 L 82.5 17.5" stroke="#c5a059" strokeWidth="3" />

            <circle cx="50" cy="50" r="10" fill="#2d2d30" stroke="#c5a059" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#000" />
          </svg>
          <div style={{ position: "absolute", bottom: "-18px", width: "100%", textAlign: "center", fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "var(--color-gold)" }}>
            TAKEUP REEL
          </div>
        </div>

      </div>

      {/* Bottom Section: Tape Track Controls & Sycned Before/After Crossfader */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          gap: "24px",
          background: "#121214",
          border: "2px solid var(--color-gold-dark)",
          borderRadius: "6px",
          padding: "16px"
        }}
      >
        
        {/* A/B Crossfader / Toggle Slider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexGrow: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontFamily: "var(--font-lcd)", fontSize: "0.75rem", fontWeight: "bold" }}>
            <span style={{ color: mixRatio === 0 ? "var(--color-gold-light)" : "#666", textShadow: mixRatio === 0 ? "var(--glow-amber)" : "none" }}>[A] BEFORE (RAW)</span>
            <span style={{ color: mixRatio === 1 ? "var(--color-green-glow)" : "#666", textShadow: mixRatio === 1 ? "var(--glow-green)" : "none" }}>[B] AFTER (MIXED)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "8px" }}>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mixRatio}
              onChange={(e) => onMixRatioChange(parseFloat(e.target.value))}
              style={{
                accentColor: mixRatio > 0.5 ? "rgb(0, 255, 100)" : "var(--color-gold)",
                width: "100%",
                height: "8px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
            />
          </div>
          
          <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "#555" }}>
            SLIDE THE CROSSFADER IN REAL-TIME TO INSTANTLY COMPARE RAW RECORDINGS WITH FINAL POLISHED MIXES
          </div>
        </div>

        {/* Tactile Push Buttons (Play, Stop, Prev, Next) */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          
          {/* PREV */}
          <button 
            className="analog-btn" 
            onClick={handlePrev}
            style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}
            title="Previous Track"
          >
            ⏮
          </button>

          {/* PLAY / PAUSE */}
          <button 
            className={`analog-btn ${isPlaying ? "active" : ""}`} 
            onClick={onPlayToggle}
            style={{ 
              width: "55px", 
              height: "55px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              borderRadius: "4px",
              borderColor: isPlaying ? "rgb(0, 255, 100)" : "var(--color-gold-dark)",
              color: isPlaying ? "rgb(0,255,100)" : "var(--color-gold)"
            }}
            title={isPlaying ? "Pause Tape" : "Play Tape"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* STOP */}
          <button 
            className="analog-btn" 
            onClick={onStop}
            style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}
            title="Stop & Rewind"
          >
            ⏹
          </button>

          {/* NEXT */}
          <button 
            className="analog-btn" 
            onClick={handleNext}
            style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}
            title="Next Track"
          >
            ⏭
          </button>

        </div>

      </div>

      {/* Track Selector Bar (Tape Selector Slots) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.7rem", color: "var(--color-gold)", letterSpacing: "1px" }}>
          SELECT CASSETTE TRACK:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {mixAndOriginalTracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => {
                  onTrackSelect(track);
                  if (onInteract) onInteract();
                }}
                className={`analog-btn ${isActive ? "active" : ""}`}
                style={{
                  padding: "8px 12px",
                  fontSize: "0.75rem",
                  justifyContent: "flex-start",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: "0.55rem", opacity: 0.6, marginRight: "6px" }}>
                  {track.type === "mix" ? "🎚️ MIX" : "🎵 ORIG"}
                </span>
                {track.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
