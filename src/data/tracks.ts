export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  type: "mix" | "original";
  icon: string; // Emoji/icon representer
  color: string; // Glow color indicator
  audioBefore?: string;
  audioAfter?: string;
  audioOriginal?: string;
  description: string;
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
    id: "track-1",
    title: "Midnight Drive",
    artist: "Chirag N Sundar",
    genre: "Outrun Synthwave",
    type: "mix",
    icon: "🚗",
    color: "#ff007f",
    description: "Focus: Gluing the driving Juno-106 bassline, enhancing low-end punch of the analog kick, and adding tape-saturation character.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-2",
    title: "Cyberpunk City",
    artist: "Chirag N Sundar",
    genre: "Cyberpunk / Industrial",
    type: "mix",
    icon: "🌃",
    color: "#00ffff",
    description: "Focus: Sidechain compression matching sub-bass to the kick drum, aggressive mid-range saturation on synths, and stereo widening.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-3",
    title: "Retro Funk",
    artist: "Chirag N Sundar",
    genre: "Electro Funk / Nu-Disco",
    type: "mix",
    icon: "🕺",
    color: "#ffaa00",
    description: "Focus: Compressing the drum bus for a classic snappy transient response, vocal processing (de-essing and widening), and dynamic EQ control in the mid-range.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-4",
    title: "Neon Horizon",
    artist: "Chirag N Sundar",
    genre: "Dreamwave Synth",
    type: "mix",
    icon: "🌅",
    color: "#ff55ff",
    description: "Focus: Shimmering reverb tails, low-cut filtering on pads to clear room for the melody, and vocal alignment.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-5",
    title: "Deep Pulse",
    artist: "Chirag N Sundar",
    genre: "Deep House",
    type: "mix",
    icon: "🌊",
    color: "#00ff66",
    description: "Focus: Stereo widening on synth stabs, transient shaper on drums to cut through the mix, and dynamic bass riding.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-6",
    title: "Lo-Fi Beats",
    artist: "Chirag N Sundar",
    genre: "Lo-Fi Hip Hop",
    type: "mix",
    icon: "☕",
    color: "#e28743",
    description: "Focus: Applying tape warble, high-cut filters for warmth, vinyl crackle blending, and smooth transient compression.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-7",
    title: "Ethereal Echoes",
    artist: "Chirag N Sundar",
    genre: "Ambient Space",
    type: "original",
    icon: "🌌",
    color: "#b983ff",
    description: "Original Track. A cinematic landscape featuring slow-burning synth pads, shimmering reverb textures, and a driving organic sub-bass line.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-8",
    title: "Pulse Width",
    artist: "Chirag N Sundar",
    genre: "Chiptune / Progressive",
    type: "original",
    icon: "👾",
    color: "#ff5555",
    description: "Original Track. High-energy progressive beat utilizing raw square waves, pitch-bending arpeggios, and sidechained delay lines.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-9",
    title: "Golden Era",
    artist: "Chirag N Sundar",
    genre: "Classic Hip Hop",
    type: "original",
    icon: "🎤",
    color: "#d4af37",
    description: "Original Track. Dusty MPC drum breaks combined with vintage Rhodes chord progressions, upright bass, and brass hooks.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-10",
    title: "Analog Dreams",
    artist: "Chirag N Sundar",
    genre: "Retrowave Beat",
    type: "original",
    icon: "🔮",
    color: "#4ecca3",
    description: "Original Track. Nostalgic synth progression driven by vintage 70s oscillators, gated drums, and a chorused bassline.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-11",
    title: "Lighthouse",
    artist: "Chirag N Sundar",
    genre: "Indie Pop / Electronica",
    type: "original",
    icon: "💡",
    color: "#3498db",
    description: "Original Track. Uplifting synth hooks with acoustic guitar arpeggios, dynamic drums, and lush layered vocals.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  },
  {
    id: "track-12",
    title: "No Bitches",
    artist: "Hazard Chirag",
    genre: "Trap / Comedy Synth",
    type: "original",
    icon: "🔥",
    color: "#e64980",
    description: "Original Track by Hazard Chirag. Focus: Aggressive sub-bass layering, detuned lead synths, and punchy 808 transient saturation.",
    spotifyUrl: "https://spotify.com",
    soundCloudUrl: "https://soundcloud.com"
  }
];

export const coverVideos: CoverVideo[] = [
  {
    id: "cover-1",
    title: "After Hours - The Weeknd (Retro Synth Cover)",
    youtubeId: "dQw4w9WgXcQ",
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
