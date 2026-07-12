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
  
  // 3D Parallax Rotation angles
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [unlocked, setUnlocked] = useState(false);

  // Synchronise state with the audio engine
  useEffect(() => {
    // Initialise audio engine state listener
    audioEngine.init(() => {
      const state = audioEngine.getState();
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      setMixRatio(state.mixRatio);
      setVolume(state.volume);
    });

    // Cleanup on unmount
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Track mouse movements to rotate the studio rack in 3D
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate position relative to center of screen (-0.5 to 0.5)
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      
      // Limit rotation to max 4 degrees for subtle premium parallax
      setTilt({
        rx: -y * 8,
        ry: x * 8
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
      // Default to first track if none selected
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

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #1a1a24 0%, #060608 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: "60px",
        overflowX: "hidden"
      }}
      onClick={unlockAudioContext}
    >
      {/* Dynamic Header */}
      <header className="rack-header">
        <h1>CHIRAG N SUNDAR</h1>
        <p>// AI DEPLOYMENT ENGINE & ANALOG MIXING STATION</p>
      </header>

      {/* Main 3D Perspective Cabinet Wrapper */}
      <main
        style={{
          width: "100%",
          maxWidth: "1280px",
          padding: "0 20px",
          marginTop: "20px",
          transformStyle: "preserve-3d",
          transform: `perspective(2000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {/* Skeuomorphic Rack Frame */}
        <div 
          style={{
            background: "#121214",
            border: "12px solid var(--color-wood)",
            borderImage: "linear-gradient(to right, #4a2810, #6f3b17, #311808) 12",
            borderRadius: "4px",
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.75), 
              inset 0 0 20px rgba(0,0,0,0.9), 
              0 0 40px rgba(197, 160, 89, 0.1)
            `,
            position: "relative"
          }}
        >
          {/* Wood corner brackets & industrial rack screws */}
          <div style={{ position: "absolute", top: "5px", left: "5px", color: "#444", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", top: "5px", right: "5px", color: "#444", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", bottom: "5px", left: "5px", color: "#444", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>
          <div style={{ position: "absolute", bottom: "5px", right: "5px", color: "#444", fontSize: "0.8rem", pointerEvents: "none" }}>⊗</div>

          {/* Grid Layout inside the rack */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: "24px",
              padding: "24px",
              background: "linear-gradient(135deg, #0e0e10, #151518)",
            }}
          >
            {/* LEFT CHANNEL: SOUND PRODUCTION (Tape deck + CRT waveform screen) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-gold)", letterSpacing: "1.5px" }}>
                  BAY 01 // ANALOG AUDIO TRANSLATION
                </span>
              </div>
              
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

            {/* RIGHT CHANNEL: VIDEO & BIO PORTAL (CRT TV covers + MS-DOS resume terminal) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-gold)", letterSpacing: "1.5px" }}>
                  BAY 02 // VISUAL COVERS & CORE SYSTEM
                </span>
              </div>

              <CrtTvUnit 
                onInteract={unlockAudioContext}
              />

              <CrtTerminalUnit 
                onInteract={unlockAudioContext}
              />
            </div>

          </div>
        </div>
      </main>

      {/* Subtitle / Footer info */}
      <footer 
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontFamily: "var(--font-lcd)",
          fontSize: "0.75rem",
          color: "#4e4e56",
          letterSpacing: "1px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <div>SYSTEM STATUS: COUPLING ARRAYS STABLE // TAPE BIAS ADJUSTED</div>
        <div>MADE BY CHIRAG N SUNDAR &copy; 2026</div>
      </footer>
    </div>
  );
};

export default App;
