# Graph Report - .  (2026-07-12)

## Corpus Check
- Corpus is ~15,183 words - fits in a single context window. You may not need a graph.

## Summary
- 133 nodes · 165 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Audio Engine Core|Audio Engine Core]]
- [[_COMMUNITY_App TypeScript Compilation|App TypeScript Compilation]]
- [[_COMMUNITY_NPM DevDependencies|NPM DevDependencies]]
- [[_COMMUNITY_Node TypeScript Compilation|Node TypeScript Compilation]]
- [[_COMMUNITY_Audio Stems Compare Player|Audio Stems Compare Player]]
- [[_COMMUNITY_React & Skeuomorphic Dependencies|React & Skeuomorphic Dependencies]]
- [[_COMMUNITY_Resume Terminal & Chatbot|Resume Terminal & Chatbot]]
- [[_COMMUNITY_Portfolio Semantic Architecture|Portfolio Semantic Architecture]]
- [[_COMMUNITY_Polaroid Stack & Resume Data|Polaroid Stack & Resume Data]]
- [[_COMMUNITY_Oxlint Linter Configuration|Oxlint Linter Configuration]]
- [[_COMMUNITY_Global TypeScript References|Global TypeScript References]]

## God Nodes (most connected - your core abstractions)
1. `AudioEngine` - 27 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `Track` - 7 edges
5. `scripts` - 5 edges
6. `rules` - 3 edges
7. `mixAndOriginalTracks` - 3 edges
8. `AudioEngineCardProps` - 2 edges
9. `AudioEngineCard()` - 2 edges
10. `DeveloperResumeCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `AudioEngine` --references--> `Track`  [EXTRACTED]
  src/audio/audioEngine.ts → src/data/tracks.ts
- `AudioEngineCardProps` --references--> `Track`  [EXTRACTED]
  src/components/AudioEngineCard.tsx → src/data/tracks.ts

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 1 - "App TypeScript Compilation"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 2 - "NPM DevDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+9 more)

### Community 3 - "Node TypeScript Compilation"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 4 - "Audio Stems Compare Player"
Cohesion: 0.25
Nodes (8): AudioEngineCard(), AudioEngineCardProps, YoutubeCoversCard(), YoutubeCoversCardProps, CoverVideo, coverVideos, mixAndOriginalTracks, Track

### Community 5 - "React & Skeuomorphic Dependencies"
Cohesion: 0.22
Nodes (9): dependencies, lucide-react, react, react-dom, @react-three/drei, @react-three/fiber, @supabase/supabase-js, three (+1 more)

### Community 6 - "Resume Terminal & Chatbot"
Cohesion: 0.29
Nodes (5): CHATBOT_KB, DeveloperResumeCard(), DeveloperResumeCardProps, GuestbookEntry, MOCK_ENTRIES

### Community 7 - "Portfolio Semantic Architecture"
Cohesion: 0.33
Nodes (6): Ask Chirag AI, Equalizer Waveform, New Folder Portfolio, Polaroid Lightbox, Software Engineering Dossier, Stems Mixing Studio

### Community 8 - "Polaroid Stack & Resume Data"
Cohesion: 0.40
Nodes (4): PolaroidCertificates(), Experience, Project, ResumeData

### Community 9 - "Oxlint Linter Configuration"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **70 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AudioEngine` connect `Audio Engine Core` to `Audio Stems Compare Player`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `dependencies` connect `React & Skeuomorphic Dependencies` to `NPM DevDependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App TypeScript Compilation` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `NPM DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Node TypeScript Compilation` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._