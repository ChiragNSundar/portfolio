# Graph Report - .  (2026-08-03)

## Corpus Check
- Large corpus: 71 files · ~953,866 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 182 nodes · 233 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `AudioEngine` - 30 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `Track` - 9 edges
5. `scripts` - 5 edges
6. `retrieveChunks()` - 5 edges
7. `askChiragAI()` - 5 edges
8. `scoreChunk()` - 4 edges
9. `rules` - 3 edges
10. `KnowledgeChunk` - 3 edges

## Surprising Connections (you probably didn't know these)
- `AudioEngine` --references--> `Track`  [EXTRACTED]
  src/audio/audioEngine.ts → src/data/tracks.ts
- `AudioEngineCardProps` --references--> `Track`  [EXTRACTED]
  src/components/AudioEngineCard.tsx → src/data/tracks.ts
- `VocalMixingCardProps` --references--> `Track`  [EXTRACTED]
  src/components/VocalMixingCard.tsx → src/data/tracks.ts
- `ScoredChunk` --references--> `KnowledgeChunk`  [EXTRACTED]
  src/lib/ragEngine.ts → src/data/chiragKnowledge.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (15): ContactCard(), ContactCardProps, GuestbookEntry, DeveloperResumeCard(), DeveloperResumeCardProps, PolaroidCertificates(), SpotifyReleaseCard(), SpotifyReleaseCardProps (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (22): CATEGORY_LABELS, KNOWLEDGE_BASE, KnowledgeChunk, applyEmbellishment(), askChiragAI(), bigrams(), buildFreqMap(), CATEGORY_SIGNALS (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): AudioEngineCardProps, VocalMixingCard(), VocalMixingCardProps, YoutubeCoversCard(), YoutubeCoversCardProps, CoverVideo, coverVideos, mixAndOriginalTracks (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (9): dependencies, lucide-react, react, react-dom, @react-three/drei, @react-three/fiber, @supabase/supabase-js, three (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): background_color, display, icons, name, orientation, short_name, start_url, theme_color

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **92 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AudioEngine` connect `Community 0` to `Community 1`, `Community 5`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `Track` connect `Community 5` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 7` to `Community 4`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08831908831908832 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._