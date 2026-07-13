# Graph Report - portfolio  (2026-07-12)

## Corpus Check
- 20 files · ~889,592 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 166 nodes · 196 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `088be8f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `AudioEngine` - 27 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `Track` - 7 edges
5. `scripts` - 5 edges
6. `📻 Dual-Role Analog Console Portfolio & Stems Studio` - 5 edges
7. `🕹️ Interface & Key Features` - 5 edges
8. `🚀 Setup & Execution` - 5 edges
9. `rules` - 3 edges
10. `mixAndOriginalTracks` - 3 edges

## Surprising Connections (you probably didn't know these)
- `AudioEngine` --references--> `Track`  [EXTRACTED]
  src/audio/audioEngine.ts → src/data/tracks.ts
- `AudioEngineCardProps` --references--> `Track`  [EXTRACTED]
  src/components/AudioEngineCard.tsx → src/data/tracks.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

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
Cohesion: 0.11
Nodes (15): AudioEngineCard(), AudioEngineCardProps, PolaroidCertificates(), YoutubeCoversCard(), YoutubeCoversCardProps, Experience, Project, ResumeData (+7 more)

### Community 5 - "React & Skeuomorphic Dependencies"
Cohesion: 0.14
Nodes (13): 1. Database Configuration (Supabase), 1. Dual-Mode Landing Portal, 2. Local Environment Configuration, 2. Software Engineer Dossier & Timeline, 3. Fullscreen Detailed Project Explorer Console, 3. Running Locally, 4. Build for Production, 4. Realigned Supabase Guestbook Footer (+5 more)

### Community 6 - "Resume Terminal & Chatbot"
Cohesion: 0.22
Nodes (9): dependencies, lucide-react, react, react-dom, @react-three/drei, @react-three/fiber, @supabase/supabase-js, three (+1 more)

### Community 7 - "Portfolio Semantic Architecture"
Cohesion: 0.33
Nodes (6): Ask Chirag AI, Equalizer Waveform, New Folder Portfolio, Polaroid Lightbox, Software Engineering Dossier, Stems Mixing Studio

### Community 8 - "Polaroid Stack & Resume Data"
Cohesion: 0.22
Nodes (6): CHATBOT_KB, DEFAULT_SUGGESTIONS, DeveloperResumeCard(), DeveloperResumeCardProps, FOLLOW_UPS, TOPIC_SYNONYMS

### Community 9 - "Oxlint Linter Configuration"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (8): background_color, display, icons, name, orientation, short_name, start_url, theme_color

## Knowledge Gaps
- **93 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AudioEngine` connect `Audio Engine Core` to `Audio Stems Compare Player`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Resume Terminal & Chatbot` to `NPM DevDependencies`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App TypeScript Compilation` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `NPM DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Node TypeScript Compilation` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Audio Stems Compare Player` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._