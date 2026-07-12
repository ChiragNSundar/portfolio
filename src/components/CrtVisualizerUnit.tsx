import React, { useEffect, useRef } from "react";
import type { Track } from "../data/tracks";
import { audioEngine } from "../audio/audioEngine";

interface CrtVisualizerUnitProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  mixRatio: number;
}

export const CrtVisualizerUnit: React.FC<CrtVisualizerUnitProps> = ({
  currentTrack,
  isPlaying,
  mixRatio
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let phaseOffset = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark background representing phosphor cathode tube screen
      ctx.fillStyle = "rgba(0, 12, 4, 0.25)"; // screen persistence trails
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines (retro screen reticle)
      ctx.strokeStyle = "rgba(0, 255, 100, 0.04)";
      ctx.lineWidth = 1 * window.devicePixelRatio;
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += height / 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Vertical grid lines
      for (let x = 0; x < width; x += width / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Read audio data
      const dataArray = isPlaying ? audioEngine.getAnalyserData() : new Float32Array(0);

      phaseOffset += isPlaying ? 0.05 : 0.01;

      // WAVE 1: Primary Neon Green (Processed/Mix representation)
      ctx.lineWidth = 3.0 * window.devicePixelRatio;
      ctx.strokeStyle = "rgb(0, 255, 120)";
      ctx.shadowBlur = 12 * window.devicePixelRatio;
      ctx.shadowColor = "rgba(0, 255, 120, 0.8)";
      ctx.beginPath();

      if (dataArray.length === 0) {
        // Dynamic flatline with slight analog wobble
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
          const wobble = Math.sin(i * 0.02 + phaseOffset) * 2 * window.devicePixelRatio + (Math.random() - 0.5) * 1.5;
          ctx.lineTo(i, height / 2 + wobble);
        }
      } else {
        const sliceWidth = width / dataArray.length;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i];
          const y = (v * 0.38 + 0.5) * height;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      }
      ctx.stroke();

      // WAVE 2: Secondary Coral/Red (Raw representation, detuned & phase-shifted)
      ctx.lineWidth = 2.0 * window.devicePixelRatio;
      ctx.strokeStyle = "rgb(255, 80, 80)";
      ctx.shadowColor = "rgba(255, 80, 80, 0.7)";
      ctx.beginPath();

      if (dataArray.length === 0) {
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
          const wobble = Math.sin(i * 0.015 - phaseOffset * 0.7) * 3 * window.devicePixelRatio + (Math.random() - 0.5) * 1;
          ctx.lineTo(i, height / 2 + wobble);
        }
      } else {
        const sliceWidth = width / dataArray.length;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          // Read from dataArray but offset or mirror slightly for detune effect
          const idx = (i + 15) % dataArray.length;
          const v = dataArray[idx];
          // Wave 2 has phase offset and lower amplitude
          const y = (v * 0.3 * Math.sin(i * 0.05 + phaseOffset) + 0.5) * height;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, mixRatio]);

  return (
    <div 
      className="crt-screen crt-scanlines crt-flicker-animation"
      style={{
        width: "100%",
        height: "270px",
        backgroundColor: "var(--color-green-bg)",
        display: "flex",
        flexDirection: "column",
        border: "3px solid #1c1c1f",
        borderRadius: "4px"
      }}
    >
      {/* Scope Header */}
      <div 
        style={{
          background: "#000",
          color: "rgba(0, 255, 100, 0.45)",
          fontFamily: "var(--font-lcd)",
          fontSize: "0.65rem",
          padding: "4px 8px",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 255, 100, 0.15)"
        }}
      >
        <span>MODEL-72 OSCILLOSCOPE</span>
        <span>AC COUPLING / DUAL STAGE</span>
      </div>

      {/* Waveform Drawing Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          flexGrow: 1,
          width: "100%",
          display: "block",
          cursor: "crosshair"
        }}
      />

      {/* Scope Footer Meta Panel */}
      <div className="lcd-info-panel" style={{ height: "70px", padding: "6px" }}>
        <div style={{ flexGrow: 1, paddingRight: "8px" }}>
          {currentTrack ? (
            <>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "1px" }}>
                ACTIVE TAPE: {currentTrack.title.toUpperCase()}
              </div>
              <div style={{ color: "var(--color-green-glow)", fontSize: "0.65rem", height: "30px", overflow: "hidden", lineHeight: "1.2" }}>
                {currentTrack.description}
              </div>
            </>
          ) : (
            <>
              <div style={{ color: "var(--color-green-glow)", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "2px" }}>
                SYSTEM IDLE
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(0, 255, 100, 0.5)" }}>
                SELECT A TAPE ON BAY 01 TO PLOT MULTI-STAGE SIGNAL OSCILLATION.
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end", minWidth: "90px" }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span 
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isPlaying ? "rgb(0, 255, 120)" : "rgb(0, 80, 20)",
                boxShadow: isPlaying ? "0 0 6px rgb(0, 255, 120)" : "none",
                display: "inline-block"
              }}
            />
            <span style={{ fontSize: "0.6rem", color: "rgba(0, 255, 100, 0.7)" }}>
              {isPlaying ? "RUNNING" : "STANDBY"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
            {currentTrack?.spotifyUrl && (
              <a 
                href={currentTrack.spotifyUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="analog-btn"
                style={{ padding: "2px 5px", fontSize: "0.55rem", borderBottomWidth: "1px" }}
              >
                SPOTIFY
              </a>
            )}
            {currentTrack?.soundCloudUrl && (
              <a 
                href={currentTrack.soundCloudUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="analog-btn"
                style={{ padding: "2px 5px", fontSize: "0.55rem", borderBottomWidth: "1px" }}
              >
                SOUNDCLOUD
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
