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
    youtubeUrl: "https://youtu.be/srJudEKvoUk?si=Mc8EW9WZt63ZupuK"
  }
];

export const originalVideos: CoverVideo[] = [
  {
    id: "original-1",
    title: "No Bitches",
    youtubeId: "srJudEKvoUk",
    description: "Original Track by Hazard Chirag. Aggressive sub-bass layering, detuned lead synths, and punchy 808 transient saturation.",
    genre: "Trap / Comedy Synth"
  }
];

export const coverVideos: CoverVideo[] = [
  {
    id: "cover-1",
    title: "Sweet Poison (Cover)",
    youtubeId: "rLjiPfBCCeY",
    description: "Mixing Focus: Warm multi-band saturation, clean high-end vocal air boosts, and dynamic compression matching aggressive kick transients.",
    genre: "Pop / Trap Mix"
  },
  {
    id: "cover-2",
    title: "Narmahat Freestyle (Cover)",
    youtubeId: "mk_zQW2AhN4",
    description: "Mixing Focus: Raw dynamic vocal leveling, tape-delay echo structures, and punchy mid-range transient EQ carving.",
    genre: "Rap Freestyle Mix"
  },
  {
    id: "cover-3",
    title: "Kaale Ghere (Cover)",
    youtubeId: "7_eiu0cdhAk",
    description: "Mixing Focus: Deep sub-bass mono alignment, smooth de-essing on vocal sibilants, and ambient stereo reverb spreads.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-4",
    title: "Prove Them Wrong (Cover)",
    youtubeId: "tvDzmSU3iMg",
    description: "Mixing Focus: Upfront vocal presence, dynamic transient shaping on aggressive snare snaps, and sidechained synth busses.",
    genre: "Hardcore Rap Mix"
  },
  {
    id: "cover-5",
    title: "Balenciaga (Cover)",
    youtubeId: "4qGWJcXtHOU",
    description: "Mixing Focus: Dynamic bass-riding, transient punch adjustments, and parallel vocal widening processing.",
    genre: "Club / Trap Mix"
  },
  {
    id: "cover-6",
    title: "Heartache (Cover)",
    youtubeId: "UQ6lSh5OM48",
    description: "Mixing Focus: Lush vocal room tail reverbs, low-cut filtering on pads to clear room for the melody, and vocal alignment.",
    genre: "Melodic Pop Mix"
  },
  {
    id: "cover-7",
    title: "Im On Mars (Cover)",
    youtubeId: "m3rE27ih0WE",
    description: "Mixing Focus: Pitch Detuning adjustments, space-echo design, and heavy dynamic EQ control in the vocal low-mids.",
    genre: "Lo-Fi / Space Mix"
  },
  {
    id: "cover-8",
    title: "Cosmic Therapy (Cover)",
    youtubeId: "RVYmj29Nthc",
    description: "Mixing Focus: Shimmering high-frequency vocal sheen, ambient soundscape design, and sidechained dynamic pads.",
    genre: "Chillwave Mix"
  },
  {
    id: "cover-9",
    title: "Yadon Se (Cover)",
    youtubeId: "XQpIk5fSNV8",
    description: "Mixing Focus: Nostalgic tape warmth saturation, vocal presence boost in the mid-range, and atmospheric sidechain sweeps.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-10",
    title: "Mrignaini (Cover)",
    youtubeId: "IC3OZlGkU6w",
    description: "Mixing Focus: Organic space design using chorused tape delays, manual vocal pitch alignment, and high-frequency sheen enhancement.",
    genre: "Melodic Rap Mix"
  },
  {
    id: "cover-11",
    title: "Antidote (Cover)",
    youtubeId: "vmjqIMVtClE",
    description: "Mixing Focus: Multi-band dynamic leveling, tape bus compression, and dynamic EQ sculpting on backing vocal layers.",
    genre: "Trap Mix"
  },
  {
    id: "cover-12",
    title: "Nalla Freestyle (Cover) @SeedheMaut",
    youtubeId: "zJc7h8aS_PQ",
    description: "Mixing Focus: Fast transient drum bus compression, aggressive saturation on mid-bass, and rapid vocal alignment.",
    genre: "Hardcore Rap Mix"
  },
  {
    id: "cover-13",
    title: "Recycled (Cover) @Uday_Pandhi",
    youtubeId: "e02H9_poOX0",
    description: "Mixing Focus: Retro tape saturation, low-pass filter sweeps, and smooth transient compression on vintage drums.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-14",
    title: "Musical Satan (Cover) @BellaOfficials",
    youtubeId: "s_-80tXTJ78",
    description: "Mixing Focus: Heavy parallel saturation, upfront vocal dynamics control, and stereo spacing to glue the modern rap delivery.",
    genre: "Dark Hip Hop Mix"
  },
  {
    id: "cover-15",
    title: "Tere Bina (Cover) @BellaOfficials",
    youtubeId: "k7G6hDeuJVE",
    description: "Mixing Focus: Dynamic EQ adjustments, smooth de-essing, and wide stereo background harmony spreads.",
    genre: "Melodic Rap Mix"
  },
  {
    id: "cover-16",
    title: "Midas Touch (Cover)",
    youtubeId: "dWozATu_8I4",
    description: "Mixing Focus: Balancing punchy 808 transients with a clean, centered lead vocal, adding tape warble on pads.",
    genre: "Pop / Rap Mix"
  },
  {
    id: "cover-17",
    title: "Cloud 9 (Cover) @therealrapdemon",
    youtubeId: "WBzzQJ9SIdM",
    description: "Mixing Focus: Deep sub-bass mono alignment, aggressive multi-band saturation on synths, and lush vocal room reverbs.",
    genre: "Rap / Trap Mix"
  },
  {
    id: "cover-18",
    title: "Antidote 2 (Cover) @BellaOfficials",
    youtubeId: "cQ3Wh5tN-To",
    description: "Mixing Focus: Transient drum bus compression, vocal presence elevation in the mid-range, and atmospheric sweeps.",
    genre: "Hip Hop Mix"
  },
  {
    id: "cover-19",
    title: "Bloom (Cover) @bygsmyle @BellaOfficials",
    youtubeId: "8zYbJT8ZdVg",
    description: "Mixing Focus: High-frequency vocal air boosts, dynamic compressor matching, and wide harmony spreads.",
    genre: "Melodic Rap Mix"
  },
  {
    id: "cover-20",
    title: "Zamana Ho Gaya (Cover) @BellaOfficials",
    youtubeId: "zA_K5MbvP_w",
    description: "Mixing Focus: Parallel saturation on vocals, upfront presence control, and stereo spacing to glue rap deliveries into beats.",
    genre: "Hip Hop Mix"
  }
];
