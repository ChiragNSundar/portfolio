export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  type: "mix" | "original";
  // File paths (optional, if empty the synth engine will auto-generate a cool retro beat)
  audioBefore?: string;
  audioAfter?: string;
  audioOriginal?: string; // For original tracks
  // Meta description shown on the CRT display
  description: string;
  // External links
  spotifyUrl?: string;
  soundCloudUrl?: string;
}

export interface CoverVideo {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  genre: string;
}

export const mixAndOriginalTracks: Track[] = [
  {
    id: "mix-1",
    title: "Midnight Drive",
    artist: "Chirag N Sundar",
    genre: "Synthwave / Outrun",
    type: "mix",
    audioBefore: "", // Empty triggers the Web Audio synthesis engine!
    audioAfter: "",
    description: "Focus: Enhancing low-end punch of the analog kick, gluing the Juno-106 bassline, adding stereo width to the lead synth hooks, and tape-saturation color.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "mix-2",
    title: "Retro Future",
    artist: "Chirag N Sundar",
    genre: "Electro Funk",
    type: "mix",
    audioBefore: "",
    audioAfter: "",
    description: "Focus: Compressing the drum bus for a classic snappy transient response, vocal processing (de-essing and widening), and dynamic EQ control in the mid-range.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "orig-1",
    title: "Ethereal Echoes",
    artist: "Chirag N Sundar",
    genre: "Ambient / Ambient House",
    type: "original",
    audioOriginal: "",
    description: "Original Track. A cinematic landscape featuring slow-burning synth pads, shimmering reverb textures, and a driving organic sub-bass line.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "orig-2",
    title: "Pulse Width",
    artist: "Chirag N Sundar",
    genre: "Chiptune / Progressive House",
    type: "original",
    audioOriginal: "",
    description: "Original Track. High-energy progressive beat utilizing raw square waves, pitch-bending arpeggios, and sidechained delay lines.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  }
];

export const coverVideos: CoverVideo[] = [
  {
    id: "cover-1",
    title: "After Hours - The Weeknd (Retro Synth Cover)",
    youtubeId: "dQw4w9WgXcQ", // Standard placeholder ID - user can easily swap
    description: "Re-imagining the modern classic using vintage Roland Juno and Korg Poly-800 hardware synths. Arranged, mixed, and performed live.",
    genre: "Retro Pop Cover"
  },
  {
    id: "cover-2",
    title: "Blinding Lights (80s Synth Live Instrumental Cover)",
    youtubeId: "y6120QOlsfU",
    description: "Live multi-instrumental loop cover featuring real guitar, retro drum machine, and keytar leads.",
    genre: "80s New Wave Cover"
  },
  {
    id: "cover-3",
    title: "Resonance - HOME (Synthesizer Cover)",
    youtubeId: "8GW6sLrK40k",
    description: "Fidelity replication of the legendary chillwave anthem, programming accurate oscillator detuning and tape wobble.",
    genre: "Chillwave Cover"
  }
];
