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
  youtubeUrl?: string;
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
    soundCloudUrl: "https://soundcloud.com",
    youtubeUrl: "https://www.youtube.com/@HazardChirag"
  }
];

export const coverVideos: CoverVideo[] = [
  {
    id: "cover-1",
    title: "Zamana Ho Gaya (Cover) @BellaOfficials",
    youtubeId: "dQw4w9WgXcQ", // Keep placeholder, customizable
    description: "Mixing Focus: Heavy parallel saturation, upfront vocal dynamics control, and stereo spacing to glue the modern rap delivery into the beat.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-2",
    title: "Bloom (Cover) @bygsmyle @BellaOfficials",
    youtubeId: "y6120QOlsfU",
    description: "Mixing Focus: Dynamic EQ adjustments on vocal low-mids, smooth de-essing, and wide stereo background harmony spreads.",
    genre: "Melodic Rap Mix"
  },
  {
    id: "cover-3",
    title: "Antidote 2 (Cover) @BellaOfficials",
    youtubeId: "8GW6sLrK40k",
    description: "Mixing Focus: Transient drum bus compression, vocal presence elevation in the mid-range, and atmospheric sidechain sweeps.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-4",
    title: "Cloud 9 (Cover) @therealrapdemon",
    youtubeId: "dQw4w9WgXcQ",
    description: "Mixing Focus: Deep sub-bass mono alignment, aggressive multi-band saturation on synths, and lush vocal room reverbs.",
    genre: "Rap / Trap Mix"
  },
  {
    id: "cover-5",
    title: "Midas Touch (Cover)",
    youtubeId: "y6120QOlsfU",
    description: "Mixing Focus: Balancing punchy 808 transients with a clean, centered lead vocal, adding tape tape warble on pads.",
    genre: "Pop / Rap Mix"
  },
  {
    id: "cover-6",
    title: "Tere Bina (Cover) @BellaOfficials",
    youtubeId: "8GW6sLrK40k",
    description: "Mixing Focus: Organic space design using chorused tape delays, manual vocal pitch alignment, and high-frequency sheen enhancement.",
    genre: "R&B / Rap Mix"
  },
  {
    id: "cover-7",
    title: "Nalla Freestyle (Cover) @SeedheMaut",
    youtubeId: "dQw4w9WgXcQ",
    description: "Mixing Focus: Raw dual-vocal dynamic saturation, analog tape bus compression, and sharp transient shaping on aggressive kicks.",
    genre: "Hardcore Rap Mix"
  }
];
