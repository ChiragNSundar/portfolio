// ============================================================================
// AskChirag AI — Offline Semantic RAG Engine
// Client-side retrieval + response composition (no API keys needed)
// ============================================================================

import { KNOWLEDGE_BASE, type KnowledgeChunk } from "../data/chiragKnowledge";

// ---------------------------------------------------------------------------
// STOPWORDS — common English words to ignore during scoring
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "out", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "no", "not", "only", "own", "same",
  "so", "than", "too", "very", "just", "because", "but", "and", "or",
  "if", "while", "about", "up", "it", "its", "he", "she", "they",
  "them", "their", "this", "that", "these", "those", "i", "me", "my",
  "we", "our", "you", "your", "what", "which", "who", "whom",
  "am", "im", "dont", "ive", "youre",
]);

// ---------------------------------------------------------------------------
// TOKENIZER — splits text into scored tokens
// ---------------------------------------------------------------------------
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Generate bigrams from token array
function bigrams(tokens: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]}_${tokens[i + 1]}`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// CATEGORY INTENT DETECTION — boost chunks from relevant categories
// ---------------------------------------------------------------------------
const CATEGORY_SIGNALS: { category: string; patterns: string[] }[] = [
  { category: "project",         patterns: ["project", "built", "build", "made", "create", "portfolio", "roadwatch", "harmony", "jd bot", "job portal"] },
  { category: "work_experience", patterns: ["intern", "internship", "work", "job", "role", "company", "rbcci", "whatdigital", "rural bank", "employed", "experience", "current"] },
  { category: "identity",        patterns: ["who", "about", "introduce", "name", "education", "college", "degree", "certify", "certification"] },
  { category: "behavioral",      patterns: ["strength", "weakness", "learn", "proud", "achieve", "ethic", "team", "collaborate"] },
  { category: "system_design",   patterns: ["system design", "architecture", "scalab", "docker", "kubernetes", "microservice", "async", "queue", "vector db", "rag architecture", "cloud", "deploy", "test"] },
  { category: "interview",       patterns: ["complex", "challenge", "difficult", "niche", "fit", "hire", "jd", "why you", "sets apart", "technically"] },
  { category: "meta",            patterns: ["tech stack", "technologies", "skills", "contact", "email", "summary", "overview", "everything", "tools"] },
];

function detectCategoryIntent(query: string): string | null {
  const q = query.toLowerCase();
  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const signal of CATEGORY_SIGNALS) {
    let score = 0;
    for (const pattern of signal.patterns) {
      if (q.includes(pattern)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = signal.category;
    }
  }

  return bestScore > 0 ? bestCategory : null;
}

// ---------------------------------------------------------------------------
// SCORING ENGINE — TF-IDF-inspired with bigram and keyword boosting
// ---------------------------------------------------------------------------

interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

function scoreChunk(
  queryTokens: string[],
  queryBigrams: string[],
  chunk: KnowledgeChunk,
  categoryBoost: string | null
): ScoredChunk {
  const contentTokens = tokenize(chunk.content);
  const titleTokens = tokenize(chunk.title);
  const keywordTokens = chunk.keywords.flatMap((k) => tokenize(k));
  const contentBigrams = bigrams(contentTokens);

  // Build term frequency maps
  const contentFreq = buildFreqMap(contentTokens);
  const titleFreq = buildFreqMap(titleTokens);
  const keywordFreq = buildFreqMap(keywordTokens);
  const contentBigramFreq = buildFreqMap(contentBigrams);

  let score = 0;
  const matchedTerms: string[] = [];

  // Score each query token
  for (const token of queryTokens) {
    let tokenScore = 0;

    // Content match (base weight: 1.0)
    if (contentFreq[token]) {
      tokenScore += Math.min(contentFreq[token], 3); // cap repeats
      matchedTerms.push(token);
    }

    // Title match (weight: 3.0 — titles are very indicative)
    if (titleFreq[token]) {
      tokenScore += titleFreq[token] * 3;
      if (!matchedTerms.includes(token)) matchedTerms.push(token);
    }

    // Keyword match (weight: 4.0 — these are curated semantic signals)
    if (keywordFreq[token]) {
      tokenScore += keywordFreq[token] * 4;
      if (!matchedTerms.includes(token)) matchedTerms.push(token);
    }

    score += tokenScore;
  }

  // Bigram matching (weight: 5.0 — phrase matches are high-signal)
  for (const bg of queryBigrams) {
    if (contentBigramFreq[bg]) {
      score += 5;
    }
    // Also check keyword bigrams
    const kwBigrams = bigrams(keywordTokens);
    if (kwBigrams.includes(bg)) {
      score += 6;
    }
  }

  // Exact substring matching in keywords (very powerful for multi-word keywords)
  const queryLower = queryTokens.join(" ");
  for (const kw of chunk.keywords) {
    if (queryLower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(queryLower)) {
      score += 8;
    }
  }

  // Category boost (weight: 3.0)
  if (categoryBoost && chunk.category === categoryBoost) {
    score += 3;
  }

  // Normalize by query length to not penalize short queries
  const normalizedScore = queryTokens.length > 0 ? score / Math.sqrt(queryTokens.length) : 0;

  return { chunk, score: normalizedScore, matchedTerms };
}

function buildFreqMap(tokens: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const t of tokens) {
    map[t] = (map[t] || 0) + 1;
  }
  return map;
}

// ---------------------------------------------------------------------------
// RETRIEVAL — Find top-K most relevant chunks
// ---------------------------------------------------------------------------

export interface RetrievalResult {
  chunks: ScoredChunk[];
  topScore: number;
  query: string;
}

export function retrieveChunks(query: string, topK: number = 3): RetrievalResult {
  const queryTokens = tokenize(query);
  const queryBgrams = bigrams(queryTokens);
  const categoryBoost = detectCategoryIntent(query);

  // Also check for exact keyword phrase matches in the raw query
  const rawQueryLower = query.toLowerCase();

  const scored = KNOWLEDGE_BASE.map((chunk) => {
    const result = scoreChunk(queryTokens, queryBgrams, chunk, categoryBoost);

    // Bonus: check raw query against keywords (handles multi-word phrases better)
    for (const kw of chunk.keywords) {
      if (rawQueryLower.includes(kw)) {
        result.score += 10;
      }
    }

    return result;
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top-K, but only include chunks with meaningful scores
  const threshold = scored[0]?.score ? scored[0].score * 0.15 : 0;
  const topChunks = scored
    .slice(0, topK)
    .filter((s) => s.score > threshold && s.score > 2);

  return {
    chunks: topChunks,
    topScore: scored[0]?.score || 0,
    query,
  };
}

// ---------------------------------------------------------------------------
// RESPONSE COMPOSER — Stitch chunks into natural responses
// ---------------------------------------------------------------------------

// Greeting patterns
const GREETING_PATTERNS = [
  /^(hi|hello|hey|howdy|sup|yo|what'?s up|greetings|good (morning|afternoon|evening))/i,
];

// Thank-you patterns
const THANKS_PATTERNS = [
  /^(thanks|thank you|thx|ty|cheers|appreciate|great|awesome|cool|nice|perfect|got it)/i,
];

export function composeResponse(query: string, retrieval: RetrievalResult): {
  response: string;
  matchedChunkIds: string[];
  confidence: "high" | "medium" | "low";
} {
  // Handle greetings
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(query.trim())) {
      return {
        response: "Hey! 👋 I'm Chirag's AI assistant. Ask me anything about my projects, work experience, technical skills, or even interview-style questions like \"What's your biggest technical challenge?\" I'm ready to chat!",
        matchedChunkIds: [],
        confidence: "high",
      };
    }
  }

  // Handle thank-you
  for (const pattern of THANKS_PATTERNS) {
    if (pattern.test(query.trim())) {
      return {
        response: "You're welcome! 😊 Feel free to ask anything else — whether it's about my projects, tech stack, work experience, or anything technical. I'm here to help!",
        matchedChunkIds: [],
        confidence: "high",
      };
    }
  }

  const { chunks, topScore } = retrieval;

  // No relevant chunks found
  if (chunks.length === 0 || topScore < 2) {
    return {
      response: applyEmbellishment(query),
      matchedChunkIds: [],
      confidence: "low",
    };
  }

  // High confidence: single strong match
  if (chunks.length === 1 || (chunks[0].score > chunks[1]?.score * 2)) {
    return {
      response: chunks[0].chunk.content,
      matchedChunkIds: [chunks[0].chunk.id],
      confidence: chunks[0].score > 15 ? "high" : "medium",
    };
  }

  // Multiple relevant chunks: compose a combined response
  // If the top 2 chunks are from the same topic area, combine them
  const primary = chunks[0];
  const secondary = chunks[1];

  if (primary.chunk.category === secondary.chunk.category ||
      primary.score - secondary.score < primary.score * 0.4) {
    // Combine top 2 chunks
    const combined = primary.chunk.content + "\n\n" + secondary.chunk.content;
    return {
      response: combined,
      matchedChunkIds: [primary.chunk.id, secondary.chunk.id],
      confidence: primary.score > 15 ? "high" : "medium",
    };
  }

  // Otherwise just return the best match
  return {
    response: primary.chunk.content,
    matchedChunkIds: [primary.chunk.id],
    confidence: primary.score > 15 ? "high" : "medium",
  };
}

// ---------------------------------------------------------------------------
// EMBELLISHMENT ENGINE — Section 6 rules from chiragcontext.txt
// When asked about unfamiliar tech, frame it as an extension of real projects
// ---------------------------------------------------------------------------

const EMBELLISHMENT_TEMPLATES: { patterns: RegExp[]; response: string }[] = [
  {
    patterns: [/agent/i, /agentic/i, /autonomous/i, /multi.?step/i],
    response: "So, while building the AI JD Bot, I actually extended the LLM pipeline into an autonomous agent-like workflow using tool execution, automated validation loops, and fallback steps to handle complex document parsing. The system uses structured multi-step reasoning — the LLM generates output, gets validated against Pydantic schemas, and if validation fails, it retries with corrected prompts. The circuit breaker ensures it doesn't get stuck in infinite retry loops. It's essentially an early form of agentic AI with tool execution and error recovery."
  },
  {
    patterns: [/microservice/i, /distributed/i, /service.?mesh/i, /api.?gateway/i],
    response: "In my RBCCI banking ecosystem, the architecture naturally evolved toward a microservices-like pattern. The core banking backend, AMLA compliance module, loan processing pipeline, and biometric authentication system all operate as independent modules with clean API boundaries. Each component can be updated, tested, and scaled independently — which is the core principle of microservices architecture."
  },
  {
    patterns: [/kubernetes/i, /k8s/i, /orchestrat/i, /helm/i],
    response: "I've containerized applications with Docker and understand container orchestration concepts. For instance, the AI JD Bot was containerized with all its dependencies for consistent deployment across environments. While my current projects don't require full Kubernetes orchestration, the modular architecture I use (separate services with clean API boundaries) translates naturally to K8s deployments."
  },
  {
    patterns: [/blockchain/i, /web3/i, /solidity/i, /smart.?contract/i],
    response: "While blockchain isn't my primary stack, the security principles I applied in the RBCCI biometric system — non-invertible embeddings, tamper-proof audit logging, and cryptographic data protection — share core concepts with blockchain. I'm confident I could adapt to blockchain development quickly, especially given my strong foundation in backend engineering and security architecture."
  },
  {
    patterns: [/mobile/i, /react.?native/i, /flutter/i, /ios/i, /android/i, /swift/i, /kotlin/i],
    response: "Most of my experience is in web development with React/TypeScript and Python backends. However, the edge AI biometric system I built for RBCCI runs entirely in the browser — handling camera feeds, running TensorFlow.js inference, and performing real-time authentication — which is architecturally similar to what you'd build in a mobile app. The component-based React architecture I use translates well to React Native."
  },
  {
    patterns: [/rust/i, /go\b/i, /golang/i, /systems.?programming/i],
    response: "My primary stack is Python and JavaScript/TypeScript, but I understand systems-level concepts well. In RoadWatch, I dealt with Python's GIL by separating frame grabbing into background threads and leveraging the fact that OpenCV and PyTorch release the GIL during C/C++ matrix execution. I enjoy understanding performance at that level, and picking up systems languages like Rust or Go would be a natural extension."
  },
  {
    patterns: [/data.?engineer/i, /etl/i, /data.?pipeline/i, /airflow/i, /spark/i],
    response: "My data engineering experience comes from building analytics pipelines at WhatDigital — ingesting data from multiple sources (MongoDB, MySQL), transforming it with Pandas, and visualizing it in real-time dashboards. In the Job Portal Dashboard, I implemented a multi-source fallback controller that queries databases in priority order. The principles are the same as production ETL: extract from sources, transform for analysis, load into visualizations."
  },
  {
    patterns: [/nlp/i, /transformer/i, /bert/i, /gpt/i, /large.?language/i, /llm/i, /fine.?tun/i],
    response: "I've worked extensively with LLMs and NLP. In the AI JD Bot, I integrated Gemini 2.0 Flash and Gemma 2 for structured text generation with Pydantic validation and fault-tolerant circuit breakers. In Harmony Hub, I implemented RAG with LangChain for context-aware responses. I understand transformer architectures, prompt engineering, and the practical challenges of deploying LLMs — like handling non-deterministic outputs, managing rate limits, and mitigating hallucinations."
  },
];

function applyEmbellishment(query: string): string {
  // Try to match against embellishment templates
  for (const template of EMBELLISHMENT_TEMPLATES) {
    for (const pattern of template.patterns) {
      if (pattern.test(query)) {
        return template.response;
      }
    }
  }

  // Generic fallback — still conversational and helpful
  return "That's an interesting question! While I could go into more detail on that specific topic, I'd love for you to ask me about my projects (RoadWatch, AI JD Bot, Harmony Hub), my work at RBCCI or WhatDigital, my tech stack, or even interview-style questions. I have deep answers ready for those! 😄";
}

// ---------------------------------------------------------------------------
// MAIN API — Single function for the chatbot to call
// ---------------------------------------------------------------------------

export function askChiragAI(query: string): {
  response: string;
  matchedChunkIds: string[];
  confidence: "high" | "medium" | "low";
  suggestedFollowUps: { label: string; query: string }[];
} {
  const retrieval = retrieveChunks(query, 3);
  const result = composeResponse(query, retrieval);

  // Generate contextual follow-up suggestions
  const followUps = generateFollowUps(result.matchedChunkIds);

  return {
    ...result,
    suggestedFollowUps: followUps,
  };
}

// ---------------------------------------------------------------------------
// FOLLOW-UP SUGGESTIONS — contextual chips based on what was just answered
// ---------------------------------------------------------------------------

const FOLLOW_UP_MAP: Record<string, { label: string; query: string }[]> = {
  intro:                 [{ label: "Projects 🚀", query: "What projects have you built?" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Current Role 🏦", query: "Where do you currently work?" }],
  education:             [{ label: "Certifications 📜", query: "What certifications do you have?" }, { label: "Strengths ⚡", query: "What are your strengths?" }],
  certifications:        [{ label: "Education 🎓", query: "Where did you study?" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }],
  strengths:             [{ label: "Weaknesses ⚖️", query: "What are your weaknesses?" }, { label: "Work Ethic 💪", query: "Describe your work ethic" }],
  weaknesses:            [{ label: "Strengths ⚡", query: "What are your strengths?" }, { label: "Learning 📚", query: "How do you learn new tech?" }],
  learning_approach:     [{ label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Projects 🚀", query: "Tell me about your projects" }],
  proudest_project:      [{ label: "RoadWatch Details 🏍️", query: "Tell me about RoadWatch in detail" }, { label: "Challenges 💪", query: "What's the most technically complex challenge you've faced?" }],
  rbcci_overview:        [{ label: "Biometrics 🔐", query: "How does the biometric system work?" }, { label: "Banking Backend 🏗️", query: "Tell me about the banking backend" }, { label: "Internship 💼", query: "Where did you intern?" }],
  rbcci_biometrics:      [{ label: "Technical Deep-Dive 🔬", query: "Explain the cosine similarity in the biometric system" }, { label: "AMLA Compliance ⚖️", query: "Tell me about the AMLA compliance system" }],
  rbcci_banking_ecosystem: [{ label: "Loan Pipeline 💰", query: "How does the loan pipeline work?" }, { label: "Biometrics 🔐", query: "How does the biometric system work?" }],
  whatdigital_overview:  [{ label: "Current Role 🏦", query: "Where do you currently work?" }, { label: "AI JD Bot 🤖", query: "Tell me about the AI JD Bot" }],
  roadwatch_overview:    [{ label: "OCR Technical 🔍", query: "How does the license plate OCR work?" }, { label: "Weather Resilience 🌧️", query: "How does RoadWatch handle bad weather?" }],
  harmonyhub_overview:   [{ label: "RAG Explained 🧠", query: "How did you implement RAG?" }, { label: "RoadWatch 🏍️", query: "Tell me about RoadWatch" }],
  harmonyhub_rag:        [{ label: "Advanced RAG 🏗️", query: "Tell me about advanced RAG architecture" }, { label: "AI JD Bot 🤖", query: "Tell me about the AI JD Bot" }],
  aijdbot_overview:      [{ label: "Architecture 🏗️", query: "How is the AI JD Bot architected?" }, { label: "Testing 🧪", query: "How do you approach testing?" }],
  jobportal_overview:    [{ label: "DB Optimization ⚡", query: "How did you optimize the database?" }, { label: "Internship 💼", query: "Tell me about your internship" }],
  technical_challenge:   [{ label: "Niche Strength 🎯", query: "What sets you apart technically?" }, { label: "Projects 🚀", query: "What projects have you built?" }],
  niche_strength:        [{ label: "Current Role 🏦", query: "Where do you currently work?" }, { label: "JD Fit 📋", query: "Why should we hire you?" }],
  jd_fit:                [{ label: "Strengths ⚡", query: "What are your strengths?" }, { label: "Projects 🚀", query: "What projects have you built?" }],
  techstack:             [{ label: "Projects 🚀", query: "Tell me about your projects" }, { label: "Certifications 📜", query: "What certifications do you have?" }],
  contact:               [{ label: "Summary 📋", query: "Give me a quick summary" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }],
  summary:               [{ label: "Internship 💼", query: "Tell me about your internship" }, { label: "Current Role 🏦", query: "Where do you currently work?" }],
  projects_overview:     [{ label: "RoadWatch 🏍️", query: "Tell me about RoadWatch in detail" }, { label: "AI JD Bot 🤖", query: "Tell me about the AI JD Bot" }, { label: "Current Role 🏦", query: "Where do you currently work?" }],
  experience_overview:   [{ label: "RBCCI Details 🏦", query: "Tell me about your work at RBCCI" }, { label: "Projects 🚀", query: "What projects have you built?" }],
  testing:               [{ label: "AI JD Bot 🤖", query: "Tell me about the AI JD Bot" }, { label: "System Design 🏗️", query: "Tell me about your system design knowledge" }],
};

const DEFAULT_FOLLOW_UPS: { label: string; query: string }[] = [
  { label: "About Chirag 👤", query: "Who is Chirag?" },
  { label: "Projects 🚀", query: "What projects have you built?" },
  { label: "Technical Challenge 💪", query: "What's the most technically complex challenge you've faced?" },
  { label: "Quick Summary 📋", query: "Give me a quick summary" },
];

function generateFollowUps(matchedIds: string[]): { label: string; query: string }[] {
  if (matchedIds.length === 0) return DEFAULT_FOLLOW_UPS;

  // Get follow-ups for the primary matched chunk
  const primaryId = matchedIds[0];
  const followUps = FOLLOW_UP_MAP[primaryId];

  if (followUps && followUps.length > 0) return followUps;

  // Fallback: look up by category of the matched chunk
  const matchedChunk = KNOWLEDGE_BASE.find((c) => c.id === primaryId);
  if (matchedChunk) {
    // Find other chunks in different categories and suggest exploring them
    const otherCategories = KNOWLEDGE_BASE
      .filter((c) => c.category !== matchedChunk.category && c.id !== primaryId)
      .slice(0, 3)
      .map((c) => ({ label: `${c.title.split("—")[0].trim()} 💡`, query: c.title }));
    if (otherCategories.length > 0) return otherCategories;
  }

  return DEFAULT_FOLLOW_UPS;
}
