import React, { useState, useEffect } from "react";
import { TapeDeckUnit } from "./components/TapeDeckUnit";
import { CrtVisualizerUnit } from "./components/CrtVisualizerUnit";
import { CrtTvUnit } from "./components/CrtTvUnit";
import { CrtTerminalUnit } from "./components/CrtTerminalUnit";
import type { Track } from "./data/tracks";
import { mixAndOriginalTracks } from "./data/tracks";
import { audioEngine } from "./audio/audioEngine";

export const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixRatio, setMixRatio] = useState(1.0); // Starts wet
  const [volume, setVolume] = useState(0.85);
  
  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [unlocked, setUnlocked] = useState(false);

  // Bottom Deck controls state (visual only, for high skeuomorphism fidelity)
  const [consolePower, setConsolePower] = useState(true);
  const [faderLevels, setFaderLevels] = useState([70, 45, 60]);

  // Synchronise state with the audio engine
  useEffect(() => {
    audioEngine.init(() => {
      const state = audioEngine.getState();
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      setMixRatio(state.mixRatio);
      setVolume(state.volume);
    });

    return () => {
      audioEngine.stop();
    };
  }, []);

  // Track mouse movements to rotate the studio rack in 3D
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      
      // Subtle premium parallax tilt limit (max 5 degrees)
      setTilt({
        rx: -y * 7,
        ry: x * 7
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleTrackSelect = (track: Track) => {
    setUnlocked(true);
    audioEngine.play(track);
  };

  const handlePlayToggle = () => {
    setUnlocked(true);
    if (isPlaying) {
      audioEngine.stop();
    } else if (currentTrack) {
      audioEngine.play(currentTrack);
    } else {
      audioEngine.play(mixAndOriginalTracks[0]);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
  };

  const handleMixRatioChange = (ratio: number) => {
    audioEngine.setMixRatio(ratio);
  };

  const handleVolumeChange = (vol: number) => {
    audioEngine.setVolume(vol);
  };

  const unlockAudioContext = () => {
    if (!unlocked) {
      audioEngine.init();
      setUnlocked(true);
    }
  };

  const handleRotateFader = (index: number) => {
    setFaderLevels(prev => {
      const copy = [...prev];
      copy[index] = (copy[index] + 15) % 90;
      return copy;
    });
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #18191f 0%, #030304 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "20px 10px 40px 10px",
        overflowX: "hidden"
      }}
      onClick={unlockAudioContext}
    >
      {/* Immersive HUD Console Header */}
      <header className="rack-header" style={{ marginBottom: "16px" }}>
        <h1 style={{ letterSpacing: "6px" }}>CHIRAG N SUNDAR</h1>
        <p style={{ color: "var(--color-gold)", letterSpacing: "3px" }}>
          // SYSTEM CORE // ANALOG DATA TRANSLATOR & MIX ENGINE
        </p>
      </header>

      {/* Main 3D Perspective Cabinet Wrapper */}
      <main
        style={{
          width: "100%",
          maxWidth: "1280px",
          transformStyle: "preserve-3d",
          transform: `perspective(2200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.15s ease-out"
        }}
      >
        {/* Skeuomorphic Rack Frame with thick wood texture wrap */}
        <div 
          className="console-frame"
          style={{
            border: "12px solid #2e1709",
            borderImage: "linear-gradient(to right, #351c0d, #4d2b15, #221005) 12",
            padding: "8px",
            background: "#09090a",
            position: "relative"
          }}
        >
          {/* Metal Corner Screws */}
          <div style={{ position: "absolute", top: "4px", left: "4px", color: "#555", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", top: "4px", right: "4px", color: "#555", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", bottom: "4px", left: "4px", color: "#555", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", bottom: "4px", right: "4px", color: "#555", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>

          {/* 2-Column Desktop Grid Layout */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 15fr))",
              gap: "16px",
              padding: "16px",
              background: "linear-gradient(135deg, #0f0f12, #070708)"
            }}
          >
            {/* LEFT COLUMN: BAY 01 Sound System (Tape Deck + Oscilloscope) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TapeDeckUnit 
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                mixRatio={mixRatio}
                volume={volume}
                onTrackSelect={handleTrackSelect}
                onPlayToggle={handlePlayToggle}
                onStop={handleStop}
                onMixRatioChange={handleMixRatioChange}
                onVolumeChange={handleVolumeChange}
                onInteract={unlockAudioContext}
              />

              <CrtVisualizerUnit 
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                mixRatio={mixRatio}
              />
            </div>

            {/* RIGHT COLUMN: BAY 02 Visual covers & Terminal Bio (TV covers + MS-DOS resume) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <CrtTvUnit 
                onInteract={unlockAudioContext}
              />

              <CrtTerminalUnit 
                onInteract={unlockAudioContext}
              />
            </div>
          </div>

          {/* BOTTOM DECK STRIP: Hardware Buttons & Keyboard Console */}
          <div 
            className="deck-strip"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              marginTop: "8px",
              borderTop: "3px solid #1f1f24",
              background: "linear-gradient(180deg, #16161a, #0b0b0c)"
            }}
          >
            {/* Group 1: Colored Buttons & Faders */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Colored Push Buttons */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button 
                  onClick={() => handleRotateFader(0)} 
                  style={{
                    width: "18px", height: "18px", background: "radial-gradient(circle, #f56565, #c53030)", 
                    border: "1.5px solid #000", borderRadius: "2px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
                  }} 
                  title="Sys Trigger A"
                />
                <button 
                  onClick={() => handleRotateFader(1)} 
                  style={{
                    width: "18px", height: "18px", background: "radial-gradient(circle, #ecc94b, #b7791f)", 
                    border: "1.5px solid #000", borderRadius: "2px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
                  }} 
                  title="Sys Trigger B"
                />
                <button 
                  onClick={() => handleRotateFader(2)} 
                  style={{
                    width: "18px", height: "18px", background: "radial-gradient(circle, #48bb78, #22543d)", 
                    border: "1.5px solid #000", borderRadius: "2px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
                  }} 
                  title="Sys Trigger C"
                />
                <button 
                  onClick={() => setConsolePower(!consolePower)} 
                  style={{
                    width: "18px", height: "18px", background: consolePower ? "radial-gradient(circle, #4299e1, #2b6cb0)" : "radial-gradient(circle, #4a5568, #2d3748)", 
                    border: "1.5px solid #000", borderRadius: "2px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    boxShadow: consolePower ? "0 0 6px #4299e1" : "0 2px 4px rgba(0,0,0,0.5)"
                  }} 
                  title="Master Console Power"
                />
              </div>

              {/* Faders */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.5rem", color: "#666" }}>SYS CONTROL:</div>
                <div className="fader-rail" style={{ height: "45px", width: "4px" }}>
                  <div className="fader-cap" style={{ width: "14px", height: "8px", left: "-5px", top: `${faderLevels[0]}%` }} />
                </div>
                <div className="fader-rail" style={{ height: "45px", width: "4px" }}>
                  <div className="fader-cap" style={{ width: "14px", height: "8px", left: "-5px", top: `${faderLevels[1]}%` }} />
                </div>
                <div className="fader-rail" style={{ height: "45px", width: "4px" }}>
                  <div className="fader-cap" style={{ width: "14px", height: "8px", left: "-5px", top: `${faderLevels[2]}%` }} />
                </div>
              </div>
            </div>

            {/* Group 2: Glowing Diagnostic readout window */}
            <div 
              style={{
                flexGrow: 1,
                maxWidth: "400px",
                background: "#050506",
                border: "1px solid #202025",
                borderRadius: "3px",
                height: "40px",
                padding: "4px 8px",
                overflow: "hidden"
              }}
            >
              <marquee 
                scrollamount="2" 
                style={{ 
                  fontFamily: "var(--font-lcd)", 
                  fontSize: "0.55rem", 
                  color: consolePower ? "rgb(0, 255, 120)" : "rgba(0,255,120,0.1)",
                  textShadow: consolePower ? "0 0 3px rgba(0,255,120,0.8)" : "none" 
                }}
              >
                BJONSTRAC LENN // SIGNAL ANALYTICS: RUNNING // ENCRYPTION KEY: STABLE // BIOMETRIC PROFILES LOADED // CODESOURCE SECURE // READY
              </marquee>
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontFamily: "var(--font-lcd)", 
                  fontSize: "0.45rem", 
                  color: "#444", 
                  marginTop: "2px" 
                }}
              >
                <span>SYS ADDR: 0x7FFF // DECRYPTION CHANNEL</span>
                <span>BAUD RATE: 9600</span>
              </div>
            </div>

            {/* Group 3: Tactile Keypad */}
            <div style={{ display: "flex", gap: "2px", background: "#0a0a0c", padding: "3px", border: "1px solid #202024", borderRadius: "2px" }}>
              {[...Array(10)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={playClickSound}
                  style={{
                    background: "linear-gradient(180deg, #2a2a2d 0%, #161618 100%)",
                    border: "1px solid #333",
                    borderBottom: "2px solid #000",
                    color: "#777",
                    fontFamily: "var(--font-lcd)",
                    fontSize: "0.55rem",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    borderRadius: "1px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer 
        style={{
          marginTop: "24px",
          textAlign: "center",
          fontFamily: "var(--font-lcd)",
          fontSize: "0.7rem",
          color: "#5e5e66",
          letterSpacing: "1px"
        }}
      >
        <div>MATRIX INTERRUPT OK // COUPLING LOOP BACK STABLE</div>
        <div>MADE BY CHIRAG N SUNDAR &copy; 2026</div>
      </footer>
    </div>
  );
};

const playClickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.01);
    gain.gain.setValueAtTime(0.008, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
  } catch (e) {}
};

export default App;
