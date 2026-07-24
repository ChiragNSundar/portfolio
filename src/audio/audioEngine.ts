import type { Track } from "../data/tracks";

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  
  // HTML5 Audio Elements for streaming tracks (when URLs are provided)
  private audioBefore: HTMLAudioElement | null = null;
  private audioAfter: HTMLAudioElement | null = null;
  private audioSourceBefore: MediaElementAudioSourceNode | null = null;
  private audioSourceAfter: MediaElementAudioSourceNode | null = null;

  // Web Audio Nodes
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private eqLow: BiquadFilterNode | null = null;
  private eqMid: BiquadFilterNode | null = null;
  private eqHigh: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  // Synth Sequencer State
  private isPlaying = false;
  private currentTrack: Track | null = null;
  private mixRatio = 1.0; // 0 = Before (Dry), 1 = After (Wet)
  private volume = 0.8;
  private sequencerTimer: number | null = null;
  private tempo = 118; // BPM
  private currentStep = 0;
  private nextStepTime = 0.0;
  private stepDuration = 0.127; // 16th note at 118 BPM (60 / 118 / 4)

  // Listeners for UI state updates
  private onStateChange: (() => void) | null = null;

  constructor() {
    this.stepDuration = 60 / this.tempo / 4;
  }

  public init(onStateChange?: () => void) {
    if (this.ctx) return;

    if (onStateChange) this.onStateChange = onStateChange;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create Analyser Node for visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;

    // Create Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;

    // Route Analyser to Master, and Master to output
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Create Mixer Gain Channels (pure uncolored 1:1 audio channels)
    this.dryGain = this.ctx.createGain();
    this.wetGain = this.ctx.createGain();

    // Route both Dry and Wet channels directly to Master with zero effects or EQ coloration
    this.dryGain.connect(this.masterGain);
    this.wetGain.connect(this.masterGain);

    // Setup crossfader volumes
    this.updateCrossfader();
  }



  private updateCrossfader() {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;
    const t = this.ctx.currentTime;
    
    // Clean 1:1 uncolored gain routing
    const dryVal = 1 - this.mixRatio;
    const wetVal = this.mixRatio;

    this.dryGain.gain.setValueAtTime(dryVal, t);
    this.wetGain.gain.setValueAtTime(wetVal, t);
  }

  public setMixRatio(ratio: number) {
    this.mixRatio = Math.max(0.0, Math.min(1.0, ratio));
    this.updateCrossfader();
    if (this.onStateChange) this.onStateChange();
  }

  public getMixRatio() {
    return this.mixRatio;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0.0, Math.min(1.0, vol));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
    if (this.onStateChange) this.onStateChange();
  }

  public getVolume() {
    return this.volume;
  }

  public setEQ(low: number, mid: number, high: number) {
    if (this.eqLow && this.eqMid && this.eqHigh) {
      // Map sliders (-10 to +10 dB)
      this.eqLow.gain.value = low;
      this.eqMid.gain.value = mid;
      this.eqHigh.gain.value = high;
    }
  }

  public play(track: Track) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    }

    this.isPlaying = true;
    this.currentTrack = track;

    // Check if the track has actual audio files
    if (track.audioBefore && track.audioAfter) {
      this.playAudioFiles(track.audioBefore, track.audioAfter);
    } else {
      // Procedurally generate synthesized retro loop
      this.playSynthLoop();
    }

    if (this.onStateChange) this.onStateChange();
  }

  private playAudioFiles(beforeUrl: string, afterUrl: string) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    this.audioBefore = new Audio(beforeUrl);
    this.audioBefore.crossOrigin = "anonymous";
    this.audioBefore.loop = true;

    this.audioAfter = new Audio(afterUrl);
    this.audioAfter.crossOrigin = "anonymous";
    this.audioAfter.loop = true;

    // Setup sources
    this.audioSourceBefore = this.ctx.createMediaElementSource(this.audioBefore);
    this.audioSourceBefore.connect(this.dryGain);

    this.audioSourceAfter = this.ctx.createMediaElementSource(this.audioAfter);
    this.audioSourceAfter.connect(this.wetGain);

    let syncStarted = false;
    const startSync = () => {
      if (syncStarted) return;
      syncStarted = true;
      if (this.audioBefore && this.audioAfter) {
        this.audioBefore.currentTime = 0;
        this.audioAfter.currentTime = 0;
        this.audioBefore.play().catch(e => console.log("Audio play error", e));
        this.audioAfter.play().catch(e => console.log("Audio play error", e));
      }
    };

    if (this.audioBefore.readyState >= 2 && this.audioAfter.readyState >= 2) {
      startSync();
    } else {
      this.audioBefore.oncanplaythrough = startSync;
      this.audioAfter.oncanplaythrough = startSync;
    }

    // Keep them in lockstep if they drift
    this.audioBefore.ontimeupdate = () => {
      if (this.audioBefore && this.audioAfter) {
        const drift = Math.abs(this.audioBefore.currentTime - this.audioAfter.currentTime);
        if (drift > 0.05) {
          this.audioAfter.currentTime = this.audioBefore.currentTime;
        }
      }
      if (this.onStateChange) this.onStateChange();
    };
  }

  public getCurrentTime(): number {
    if (this.audioBefore) return this.audioBefore.currentTime;
    return 0;
  }

  public getDuration(): number {
    if (this.audioBefore && !isNaN(this.audioBefore.duration) && this.audioBefore.duration > 0) {
      return this.audioBefore.duration;
    }
    return 180;
  }

  public seek(timeSeconds: number) {
    const dur = this.getDuration();
    const target = Math.max(0, Math.min(dur, timeSeconds));
    if (this.audioBefore) {
      this.audioBefore.currentTime = target;
    }
    if (this.audioAfter) {
      this.audioAfter.currentTime = target;
    }
    if (this.onStateChange) this.onStateChange();
  }

  private playSynthLoop() {
    if (!this.ctx) return;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.1;
    this.scheduler();
  }

  private scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextStepTime < this.ctx.currentTime + 0.1) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.nextStep();
    }

    // Schedule next tick
    this.sequencerTimer = window.setTimeout(() => this.scheduler(), 25);
  }

  private nextStep() {
    if (!this.ctx) return;
    this.nextStepTime += this.stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  // 16-step Synth Pop sequencer loop
  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    // Drum Patterns
    const kickPattern = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
    const snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    const hatPattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0];

    // Bassline note scale (A Minor / Outrun vibes)
    // MIDI: A1(33), C2(36), D2(38), E2(40), G2(43)
    const bassline = [33, 33, 36, 36, 40, 40, 38, 38, 33, 33, 43, 43, 40, 40, 38, 38];

    // Lead arpeggio melody (A Minor)
    // MIDI: A3(57), C4(60), D4(62), E4(64), G4(67), A4(69)
    const leadPattern = [
      57, 64, 60, 67, 62, 69, 64, -1,
      69, 64, 67, 60, 64, 62, 57, -1
    ];

    // DRUMS ROUTING
    // Route kick to both dry & wet, but wet gets slightly more transient punch
    if (kickPattern[step]) {
      this.synthKick(time);
    }
    if (snarePattern[step]) {
      this.synthSnare(time);
    }
    if (hatPattern[step]) {
      this.synthHat(time);
    }

    // BASSLINE ROUTING
    const bassMidiNote = bassline[step];
    this.synthBass(time, bassMidiNote);

    // LEAD ARPEGGIATOR
    const leadMidiNote = leadPattern[step];
    if (leadMidiNote !== -1) {
      this.synthLead(time, leadMidiNote);
    }
  }

  // Web Audio Synth voices
  private synthKick(time: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;
    
    // Kick sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    // Route to dry and wet gains symmetrically
    gain.connect(this.dryGain);
    gain.connect(this.wetGain);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.linearRampToValueAtTime(0.0, time + 0.12);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  private synthSnare(time: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    // Noise buffer snare
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1000;
    noiseFilter.Q.value = 2.0;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    // Snare tone body
    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(180, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(100, time + 0.08);

    const bodyGain = this.ctx.createGain();
    bodyGain.gain.setValueAtTime(0.25, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    // Connect noise
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.dryGain);
    noiseGain.connect(this.wetGain);

    // Connect body
    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.dryGain);
    bodyGain.connect(this.wetGain);

    noiseSource.start(time);
    noiseSource.stop(time + 0.16);

    bodyOsc.start(time);
    bodyOsc.stop(time + 0.09);
  }

  private synthHat(time: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 8000;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.wetGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  private synthBass(time: number, midiNote: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    const freq = this.midiNoteToFreq(midiNote);
    
    // Bass Oscillator (Juno Saw style, detuned)
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = freq;

    const osc2 = this.ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = freq + 1.2; // detuned

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    
    // DRY routing has flat, low frequency cut off (very boxy, mono)
    const dryFilterGain = this.ctx.createGain();
    filter.frequency.setValueAtTime(250, time); // flat, boxy
    dryFilterGain.gain.setValueAtTime(0.2, time);
    dryFilterGain.gain.exponentialRampToValueAtTime(0.001, time + this.stepDuration * 0.9);

    // WET routing gets juicy filter envelope sweep & chorus
    const wetFilter = this.ctx.createBiquadFilter();
    wetFilter.type = "lowpass";
    wetFilter.frequency.setValueAtTime(300, time);
    wetFilter.frequency.exponentialRampToValueAtTime(1500, time + 0.05); // envelope sweep!
    wetFilter.frequency.exponentialRampToValueAtTime(350, time + this.stepDuration * 0.9);

    const wetFilterGain = this.ctx.createGain();
    wetFilterGain.gain.setValueAtTime(0.22, time);
    wetFilterGain.gain.exponentialRampToValueAtTime(0.001, time + this.stepDuration * 0.9);

    // Connect
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(dryFilterGain);
    dryFilterGain.connect(this.dryGain);

    // wet branch
    const osc1Wet = this.ctx.createOscillator();
    osc1Wet.type = "sawtooth";
    osc1Wet.frequency.value = freq;
    const osc2Wet = this.ctx.createOscillator();
    osc2Wet.type = "sawtooth";
    osc2Wet.frequency.value = freq + 1.5;

    osc1Wet.connect(wetFilter);
    osc2Wet.connect(wetFilter);
    wetFilter.connect(wetFilterGain);
    wetFilterGain.connect(this.wetGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + this.stepDuration);
    osc2.stop(time + this.stepDuration);

    osc1Wet.start(time);
    osc2Wet.start(time);
    osc1Wet.stop(time + this.stepDuration);
    osc2Wet.stop(time + this.stepDuration);
  }

  private synthLead(time: number, midiNote: number) {
    if (!this.ctx || !this.dryGain || !this.wetGain) return;

    const freq = this.midiNoteToFreq(midiNote);

    // Lead oscillator
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);

    // DRY routing: Dry lead is simple and centered
    const dryG = this.ctx.createGain();
    dryG.gain.setValueAtTime(0.06, time);
    dryG.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(dryG);
    dryG.connect(this.dryGain);

    // WET routing: Wide, vibrato-infused lead with delay send
    const wetOsc = this.ctx.createOscillator();
    wetOsc.type = "triangle";
    wetOsc.frequency.setValueAtTime(freq, time);

    // Add subtle vibrato LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 6.0; // 6Hz
    lfoGain.gain.value = 3.0; // pitch shift deviation

    lfo.connect(lfoGain);
    lfoGain.connect(wetOsc.frequency);

    const wetG = this.ctx.createGain();
    wetG.gain.setValueAtTime(0.09, time);
    wetG.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    wetOsc.connect(wetG);
    wetG.connect(this.wetGain);

    lfo.start(time);
    osc.start(time);
    wetOsc.start(time);

    lfo.stop(time + 0.22);
    osc.stop(time + 0.22);
    wetOsc.stop(time + 0.22);
  }

  private midiNoteToFreq(note: number) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  public stop() {
    this.isPlaying = false;

    if (this.sequencerTimer) {
      clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }

    // Stop streams
    if (this.audioBefore) {
      this.audioBefore.pause();
      this.audioBefore = null;
    }
    if (this.audioAfter) {
      this.audioAfter.pause();
      this.audioAfter = null;
    }
    if (this.audioSourceBefore) {
      this.audioSourceBefore.disconnect();
      this.audioSourceBefore = null;
    }
    if (this.audioSourceAfter) {
      this.audioSourceAfter.disconnect();
      this.audioSourceAfter = null;
    }

    this.currentTrack = null;

    if (this.onStateChange) this.onStateChange();
  }

  public getAnalyserData() {
    if (!this.analyser) return new Float32Array(0);
    const dataArray = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      mixRatio: this.mixRatio,
      volume: this.volume
    };
  }
}

// Singleton pattern export
export const audioEngine = new AudioEngine();
