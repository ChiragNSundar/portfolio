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
    id: "entropy-mix",
    title: "Entropy",
    artist: "RMAN ft. CIPHER",
    genre: "R&B / Hip-Hop Vocal Mix",
    type: "mix",
    icon: "🔥",
    color: "#1DB954",
    audioBefore: "/audio/mixes/entropy/before.m4a",
    audioAfter: "/audio/mixes/entropy/after.mp3",
    description: "Real Vocal Stem Comparison. 'Before': Raw unmixed vocal recording (RxC Draft 2). 'After': Professionally tuned, EQ sculptured, compressed, saturated, and mastered final record.",
    spotifyUrl: "https://open.spotify.com/track/1RMaBcZWrsNII3XzHLzBPK?si=e6c2e32d07b149a7"
  },
  {
    id: "no-bitches",
    title: "No Bitches",
    artist: "Hazard Chirag",
    genre: "Trap / Comedy Synth",
    type: "original",
    icon: "🎤",
    color: "#e64980",
    description: "Original Track by Hazard Chirag. Focus: Aggressive sub-bass layering, detuned lead synths, and punchy 808 transient saturation.",
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
