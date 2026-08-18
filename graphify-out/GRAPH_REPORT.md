# Graph Report - d:\GitHub\portfolio  (2026-08-18)

## Corpus Check
- 19 files · ~25,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 110 nodes · 179 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Security & Anti-DDoS Architecture|Security & Anti-DDoS Architecture]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `AudioEngine` - 31 edges
2. `Track` - 9 edges
3. `retrieveChunks()` - 5 edges
4. `askChiragAI()` - 5 edges
5. `mixAndOriginalTracks` - 4 edges
6. `scoreChunk()` - 4 edges
7. `KnowledgeChunk` - 3 edges
8. `tokenize()` - 3 edges
9. `bigrams()` - 3 edges
10. `composeResponse()` - 3 edges

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

## Communities (10 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (22): CATEGORY_LABELS, KNOWLEDGE_BASE, KnowledgeChunk, applyEmbellishment(), askChiragAI(), bigrams(), buildFreqMap(), CATEGORY_SIGNALS (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (9): ContactCard(), ContactCardProps, GuestbookEntry, LegalModal(), LegalModalProps, SpotifyReleaseCard(), SpotifyReleaseCardProps, GuestbookEntry (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (10): AudioEngineCardProps, VocalMixingCard(), VocalMixingCardProps, YoutubeCoversCard(), YoutubeCoversCardProps, CoverVideo, coverVideos, mixAndOriginalTracks (+2 more)

### Community 3 - "Security & Anti-DDoS Architecture"
Cohesion: 0.21
Nodes (9): DeveloperResumeCard(), DeveloperResumeCardProps, downloadSoftwareEngineerResume(), checkPersistentRateLimit(), checkRateLimit(), isLikelyBot(), RateLimitConfig, rateLimitMap (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (4): PolaroidCertificates(), Experience, Project, ResumeData

## Knowledge Gaps
- **23 isolated node(s):** `GuestbookEntry`, `PROJECT_DETAILS_DATA`, `GuestbookEntry`, `ContactCardProps`, `DeveloperResumeCardProps` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AudioEngine` connect `Community 4` to `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 9`?**
  _High betweenness centrality (0.405) - this node is a cross-community bridge._
- **Why does `Track` connect `Community 2` to `Community 1`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `askChiragAI()` connect `Community 0` to `Security & Anti-DDoS Architecture`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `GuestbookEntry`, `PROJECT_DETAILS_DATA`, `GuestbookEntry` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._