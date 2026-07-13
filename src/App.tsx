import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AudioEngineCard } from "./components/AudioEngineCard";
import { YoutubeCoversCard } from "./components/YoutubeCoversCard";
import { DeveloperResumeCard } from "./components/DeveloperResumeCard";
import { PolaroidCertificates } from "./components/PolaroidCertificates";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import type { Track } from "./data/tracks";
import { mixAndOriginalTracks } from "./data/tracks";
import { audioEngine } from "./audio/audioEngine";

interface GuestbookEntry {
  id: string;
  name: string;
  email?: string;
  message: string;
  created_at: string;
}

const MOCK_ENTRIES = [
  { id: "mock-1", name: "Infosys Recruiter", message: "Loved the interactive CV & SVG treemaps! 👍" },
  { id: "mock-2", name: "WhatDigital Supervisor", message: "Outstanding execution on LLM chatbot architectures." },
  { id: "mock-3", name: "GitHub Visitor", message: "Awesome YOLOv8 helmet detection main pipeline." },
  { id: "mock-4", name: "Gen-AI Recruiter", message: "The local RAG chatbot is incredibly fast and fun!" },
  { id: "mock-5", name: "Creative Dev", message: "Fascinating Neobrutalist cream design styling." }
];

const PROJECT_DETAILS_DATA = {
  roadwatch: {
    title: "RoadWatch: Smart Helmet & License Plate Recognition",
    github: "https://github.com/ChiragNSundar/Helmet-Violation-Detection-and-License-Plate-Recognition-Realtime",
    images: ["/rw/bike.gif"],
    pitch: "An AI-powered traffic enforcement system designed for real-time monitoring of motorcycle helmet violations. It detects riders without helmets, recognizes their license plates via advanced OCR consensus logic, and logs violations with visual evidence.",
    techStack: [
      { component: "Language", tech: "Python 3.10.x" },
      { component: "Object Detection", tech: "YOLOv8 (v8.4.47)" },
      { component: "Backend", tech: "FastAPI" },
      { component: "OCR Engines", tech: "EasyOCR / PaddleOCR" },
      { component: "Deep Learning", tech: "PyTorch" },
      { component: "Graphics / UI", tech: "OpenCV / Jinja2" }
    ],
    features: [
      "Real-Time Detection: High-speed YOLOv8 predictions mapping riders, helmets, and number plates.",
      "OCR Consensus: Position-Level Voting System resolving character confusion (e.g., D vs Q) with 99%+ accuracy.",
      "Smart Filtering: Automatically drops duplicate logs and matches Indian License Standard formats.",
      "Automated Alerts: E-mails warning notices with attached infraction crop images to authorities.",
      "Admin Dashboard: Built in FastAPI for uploading videos and tracking violation database logs."
    ],
    coreIntelligence: [
      "Spatial Association: Triggers violations only when no-helmet detections and plate detections overlap the rider box by >=30%.",
      "Weather-Resilient CLAHE: LAB color space CLAHE normalisation and Unsharp Masking applied dynamically in rain/low light.",
      "Consensus Aggregator: Groups frame-by-frame readings using string-distance heuristics to clean OCR noise."
    ],
    challenges: "Maintaining accurate OCR reading on plates that were blurry, dirty, or captured in bad lighting. Solved by integrating CLAHE image pre-processing and custom tuning confidence bounds.",
    projectStructure: `/Helmet-Violation-Detection-and-License-Plate-Recognition-Realtime
├── app/
│   ├── main.py                 # FastAPI application web server
│   └── ...                     # API endpoints & frame pipelines
├── Training _module/
│   ├── scripts/
│   │   └── main.py             # Standalone CLI detection script
│   ├── coco128.yaml            # Dataset & classes configuration
│   └── training.py             # YOLOv8 custom model training script
├── best.pt                     # Trained custom weights (.pt weights)
├── requirements.txt            # Python dependencies configuration
└── .env.example                # Server & SMTP email alert templates`,
    architecture: undefined,
    databaseSchema: undefined
  },
  harmony: {
    title: "Harmony Hub: Mental Health & Wellness Assistant",
    github: "https://github.com/Mental-Wellbeing-App/MentalHealthApp",
    images: [
      "/hm/GenAI AssistantChat.jpeg",
      "/hm/Chat2.jpeg",
      "/hm/HabitTracker.jpeg",
      "/hm/PlotlyGraphData.png",
      "/hm/UserAuthPage.jpeg"
    ],
    pitch: "A comprehensive mental health assistant helping users with mood logs, habit trackers, and personalized AI support through a generative Gemini RAG chatbot.",
    techStack: [
      { component: "Frontend / UI", tech: "Streamlit (Python)" },
      { component: "AI Chatbot", tech: "Gemini Pro LLM" },
      { component: "Search Pipeline", tech: "RAG (Retrieval-Augmented Generation)" },
      { component: "Data Parsing", tech: "NLP / PDF Parser text pipelines" },
      { component: "Visual Analytics", tech: "Plotly Charts" }
    ],
    features: [
      "AI Gemini Chatbot: Converses empathetically utilizing NLP pipelines.",
      "Retrieval-Augmented Generation: Upload personal documents (PDFs) to feed context-aware answers to the LLM chatbot.",
      "Wellness Tracking: Streamlit-based interfaces for tracking mood patterns, habit goals, and progress notes.",
      "Dynamic Graphs: Plotly charts demonstrating wellness improvements."
    ],
    coreIntelligence: [
      "RAG Architecture: Bypasses generic LLM boundaries by retrieving localized context from documents before formulating answers.",
      "NLP Processing: Text queries analyzed naturally to return empathetic mental wellness replies rather than simple keyword matches.",
      "Visual Insights: Pandas processes logs on-the-fly to render interactive Streamlit graph metrics."
    ],
    challenges: "Context injection accuracy for larger PDF uploads. Solved by refining text splitting algorithms and chunk size configurations.",
    projectStructure: `/HarmonyHealthApp
├── main.py                     # Streamlit application entrypoint
├── chatbot.py                  # Gemini Pro RAG chatbot processor
├── auth.py                     # User session & authorization handler
├── tracker/
│   ├── mood.py                 # Mood entries log & calendar tracker
│   └── habits.py               # Habit analytics & metrics plots
├── utils/
│   ├── pdf_parser.py           # Text extraction pipeline
│   └── plot_helper.py          # Custom Plotly data visuals
└── requirements.txt            # Project python pack list`,
    architecture: undefined,
    databaseSchema: undefined
  },
  jobportal: {
    title: "Job Portal Business Intelligence Dashboard",
    github: "https://github.com/ChiragNSundar/JobPortalDashboard",
    images: [
      "/jp/Screenshot 2026-07-12 205812.png",
      "/jp/image copy.png",
      "/jp/image.png",
      "/jp/image copy 2.png",
      "/jp/image copy 3.png",
      "/jp/image copy 4.png",
      "/jp/image copy 5.png"
    ],
    pitch: "A comprehensive, interactive data visualization dashboard querying user device preference models, application status distributions, and geo-spatial applicant locations.",
    techStack: [
      { component: "Core Logic", tech: "Python 3.x" },
      { component: "Framework", tech: "Dash (by Plotly)" },
      { component: "Database Controllers", tech: "SQLAlchemy / PyMongo / PyMySQL" },
      { component: "Configuration Source", tech: "MongoDB Config documents / .env variables" },
      { component: "Data Wrangling", tech: "Pandas / NumPy" }
    ],
    features: [
      "Trend Analysis: Tracks daily and monthly application volumes over time with dual-axis Plotly charts.",
      "Device Intelligence: Desktop vs mobile adoption charts modeling user device trends.",
      "Geospatial Analytics: Bar charts mapping applicant regions and sunburst graphs representing countries.",
      "Interactive UI: Neobrutalist glassmorphism layouts with global multi-metric dropdown filtering."
    ],
    coreIntelligence: [
      "Fallback Config Pipeline: Centralized SQL controller attempts Mongo extraction first, defaulting to local environment variables if database is offline.",
      "Modular Layout Architecture: Separates dashboard pages (Daily_Overview, Monthly_Trend) to ease maintenance.",
      "Data Optimization: Uses optimized SQL query indices and Pandas aggregations to load thousands of rows quickly."
    ],
    challenges: "Managing connections across multiple remote database servers. Solved by building a centralized SQL controller utilizing local backups as fallback options.",
    projectStructure: `/JobPortalDashboard
├── Data/
│   ├── datasetsql.py           # Core SQL + Mongo connection load logic
│   └── jobseeker_dashboard...  # Local backup dataset CSV
├── jobpage_status/             # Dashboard Layout Pages
│   ├── Daily_Overview.py       # Metrics timeline
│   ├── Monthly_Trend.py        # Analytics trends
│   ├── Location_Analysis.py    # Region distribution
│   └── ... (Other dashboards)
├── main_file/
│   ├── app.py                  # Main Application startup file
│   ├── mongoconnector.py       # MongoDB credentials helper
│   └── sql_connector.py        # MySQL database helper connection
├── .env.example                # Env settings configuration
├── requirements.txt            # Requirements python list
└── README.md                   # Setup documentation`,
    architecture: `           +---------------------------------------------+
           |               BROWSER CLIENTS               |
           +----------------------+----------------------+
                                  | (HTTP / Dash events)
           +----------------------+----------------------+
           |         DASH BOOTSTRAP DASHBOARDS           |
           |   (Daily, Monthly, Location, Source Pages)  |
           +----------------------+----------------------+
                                  | (Queries Data)
           +----------------------+----------------------+
           |               DATA CONTROLLER               |
           |             (datasetsql.py)                 |
           +----------+-----------------------+-----------+
                      |                       |
      (Pull Config if |                       | (Fallbacks to
       Mongo online)  |                       |  local .env credentials)
+---------------------v-----+           +-----v-------------------+
|      MONGODB SERVER       |           |      MYSQL SERVER       |
| (db_connection_config doc)|           |    (jobseeker_data)     |
+---------------------------+           +-------------------------+`,
    databaseSchema: undefined
  },
  aijdbot: {
    title: "AI JD Bot: Job Description Assistant",
    github: "https://github.com/ChiragNSundar/ai-jd-bot",
    images: [],
    pitch: "An AI-powered job description chatbot built with Flask and Gemini & Gemma Models. It features a modular architecture, parallel SQLite backup storage, and Pydantic validation, with zero-tolerance for unhandled exceptions.",
    techStack: [
      { component: "Core Logic", tech: "Python 3.9+" },
      { component: "AI / LLM Orchestration", tech: "Google Gemini 2.0 Flash (Primary), Gemma 2 (Fallback)" },
      { component: "Backend Framework", tech: "Flask (Blueprints architecture)" },
      { component: "Primary Database", tech: "MongoDB (12 Collections with JSON Schema validation)" },
      { component: "Backup Database", tech: "SQLite (WAL Mode parallel backup queue)" },
      { component: "Reliability & APM", tech: "OpenTelemetry, Circuit Breaker, rate limiters, security headers" },
      { component: "Testing Coverage", tech: "Pytest (490+ tests), Playwright E2E, Chaos Engineering" }
    ],
    features: [
      "Job Details Collection: Interactive chatbot interface with a smart address dialog flow.",
      "Interactive Map Service: Location selection using Leaflet (OpenStreetMap) with Google Maps fallback.",
      "AI-Assisted Generation: Create professional JDs. Supports PDF/DOCX resume upload & text extraction.",
      "Flexible Document Exports: Download JDs in PDF, Word (.docx), or Markdown formats.",
      "Location Extraction: Automates full address details (Street, City, State, Zip) parsing.",
      "MongoDB Connection Pool: Upgraded connections to support 100 concurrent pools, auto-reconnect, and health checks.",
      "Audit Trail & Versions: Immutable history of job post changes, security events, and rotations.",
      "SQLite Backup Queue: Parallel SQLite logging with async write queue & WAL Mode.",
      "Circuit Breaker & Fallback: Automatic fallback pool routing (Gemma -> Gemini Flash -> Pro)."
    ],
    coreIntelligence: [
      "Fault-Tolerant Circuit Breakers: Trips after 15 AI request failures, auto-resetting after 60s to prevent server lockups.",
      "API Key Load Balancer: Smart rate-balancer rotating between free/paid key pools to avoid 429 quota exhaustion.",
      "Token Tracking Heuristics: Accurate prompt and response token counter for both streaming and batch requests."
    ],
    challenges: "Handling transient LLM rate-limits and synchronizing concurrent state modifications. Solved using Tenacity auto-retries, pybreaker circuits, and continuous SQLite background session syncing.",
    projectStructure: `ai-jd-bot/
├── app/
│   ├── routes/                  # Route Blueprints (chat, job, helpers)
│   ├── services/                # Business Logic (ai, audit, key_manager, db)
│   ├── utils/                   # Shared Utilities (telemetry, input_sanitizer, schemas)
│   ├── templates/               # Jinja2 HTML Templates
│   └── static/                  # Vanilla JS controllers & modern CSS
├── tests/                       # Comprehensive Pytest & Playwright E2E Suite
├── data/                        # SQLite managed backup stores
├── run.py                       # App Entry Point
└── Dockerfile                   # Deployment container settings`,
    architecture: `                                 +-------------------------+
                                 |     USER BROWSER /      |
                                 |    PLAYWRIGHT CLIENTS   |
                                 +------------+------------+
                                              | (HTTP requests / Jinja2 pages / Map inputs)
                                 +------------v------------+
                                 |    FLASK APPLICATION    |
                                 |  (routes/ chat/ job/    |
                                 |      helper blueprints) |
                                 +------------+------------+
                                              |
                       +----------------------+----------------------+
                       |                                             |
            +----------v----------+                       +----------v----------+
            |  AI SERVICE ENGINE  |                       |  SERVICES LAYER     |
            | (CircuitBreaker /   |                       | (Progress/ Address/ |
            |  KeyManager/ Cache) |                       |  Salary/ Export)    |
            +----------+----------+                       +----------+----------+
                       |                                             |
           +-----------+-----------+                     +-----------+-----------+
           |                       |                     |                       |
     +-----v-----+           +-----v-----+         +-----v-----+           +-----v-----+
     |  GEMINI   |           |   GEMMA   |         |  MONGODB  |           |  SQLITE   |
     | 2.0 FLASH |           |   2 MODEL |         | (12 colls |           | (Parallel |
     | (Primary) |           | (Fallback)|         |  validated|           |  WAL queue|
     +-----------+           +-----------+         +-----------+           +-----------+`,
    databaseSchema: [
      {
        collection: "job_posts (Core Data)",
        fields: [
          { field: "job_id", type: "UUID", desc: "Unique identifier (Primary Key)" },
          { field: "session_id", type: "UUID", desc: "Linked user session ID" },
          { field: "status", type: "String", desc: "final, edited" },
          { field: "job_details", type: "Object", desc: "Structured map of all job fields (title, company, salary)" },
          { field: "job_description", type: "String", desc: "The final generated markdown description" },
          { field: "version", type: "Int", desc: "Current version number (increments only on changes)" },
          { field: "flags", type: "Object", desc: "State flags (is_seeded, address_complete, saved)" },
          { field: "ai_meta", type: "Object", desc: "Model used, temperature, and generation latency" },
          { field: "created_at", type: "Date", desc: "Creation timestamp" }
        ]
      },
      {
        collection: "job_versions (Audit Trail)",
        fields: [
          { field: "job_id", type: "UUID", desc: "Reference to job_posts" },
          { field: "version", type: "Int", desc: "Version number of this snapshot" },
          { field: "changeset", type: "Object", desc: "List of updated_fields and target changes" },
          { field: "job_details", type: "Object", desc: "Full snapshot of job details at this version" },
          { field: "actor", type: "Object", desc: "session_id, ip_hash (who changed)" },
          { field: "created_at", type: "Date", desc: "Timestamp of change" }
        ]
      },
      {
        collection: "conversation_messages",
        fields: [
          { field: "session_id", type: "UUID", desc: "User session identifier" },
          { field: "role", type: "String", desc: "user or bot" },
          { field: "text", type: "String", desc: "The message content" },
          { field: "meta", type: "Object", desc: "Context like detected_question_key, input_method" },
          { field: "ai_meta", type: "Object", desc: "Token usage, latency, model version (for bot responses)" }
        ]
      },
      {
        collection: "ai_events (LLM Logs)",
        fields: [
          { field: "event_type", type: "String", desc: "generate_content, stream_chat, salary_suggestion" },
          { field: "prompt_tokens", type: "Int", desc: "Input token count (from API usage_metadata)" },
          { field: "response_tokens", type: "Int", desc: "Output token count (from candidates_token_count)" },
          { field: "latency_ms", type: "Int", desc: "Time taken for generation" },
          { field: "cache_hit", type: "Bool", desc: "Whether response was served from cache" },
          { field: "outcome", type: "String", desc: "success or error" }
        ]
      },
      {
        collection: "conversation_sessions",
        fields: [
          { field: "session_id", type: "UUID", desc: "Unique session identifier" },
          { field: "job_id", type: "UUID", desc: "Linked job ID (if any)" },
          { field: "state_flags", type: "Object", desc: "seeded, description_generated" },
          { field: "progress", type: "Object", desc: "current_step, mandatory_fields_completed" },
          { field: "error_counts", type: "Int", desc: "Number of errors encountered" },
          { field: "expires_at", type: "Date", desc: "Time when session expires (TTL)" }
        ]
      },
      {
        collection: "salary_suggestions",
        fields: [
          { field: "job_id", type: "UUID", desc: "Linked job ID" },
          { field: "source", type: "String", desc: "ai or static_fallback" },
          { field: "input", type: "Object", desc: "Criteria used (title, location, etc.)" },
          { field: "output", type: "Object", desc: "minimum_salary, maximum_salary, currency" },
          { field: "model_meta", type: "Object", desc: "AI model used and latency" }
        ]
      },
      {
        collection: "address_extractions",
        fields: [
          { field: "user_input", type: "String", desc: "Raw address text from user" },
          { field: "ai_result", type: "Object", desc: "Address parts extracted by AI" },
          { field: "rule_based_result", type: "Object", desc: "Address parts extracted by regex" },
          { field: "final_used", type: "Object", desc: "The actual address data used" },
          { field: "geo_meta", type: "Object", desc: "Geocoding results (lat, lng, confidence)" }
        ]
      },
      {
        collection: "uploads",
        fields: [
          { field: "file", type: "Object", desc: "name, size_bytes, extension, mime_type" },
          { field: "parse_result", type: "Object", desc: "Status of parsing and extracted fields" },
          { field: "seeded_job_details", type: "Object", desc: "Data extracted from resume" }
        ]
      },
      {
        collection: "exports",
        fields: [
          { field: "format", type: "String", desc: "pdf, docx, markdown" },
          { field: "file_meta", type: "Object", desc: "filename, byte_size, duration_ms" },
          { field: "job_snapshot_version", type: "Int", desc: "Version of job used for export" }
        ]
      },
      {
        collection: "analytics_events",
        fields: [
          { field: "event_name", type: "String", desc: "e.g., chat_response, description_generated" },
          { field: "properties", type: "Object", desc: "Custom event data" },
          { field: "expires_at", type: "Date", desc: "TTL for auto-deletion" }
        ]
      },
      {
        collection: "error_logs",
        fields: [
          { field: "route", type: "String", desc: "API endpoint or service method" },
          { field: "error_type", type: "String", desc: "Exception class name" },
          { field: "message", type: "String", desc: "Error message" },
          { field: "severity", type: "String", desc: "error, warning, info" }
        ]
      },
      {
        collection: "audit_logs",
        fields: [
          { field: "timestamp", type: "Date", desc: "UTC timestamp of event" },
          { field: "action", type: "String", desc: "e.g. key_rotation, config_change" },
          { field: "actor", type: "Object", desc: "session_id, ip_hash" },
          { field: "severity", type: "String", desc: "info, warning, critical" },
          { field: "details", type: "Object", desc: "Event-specific metadata" }
        ]
      }
    ]
  },
  vibelyrics: {
    title: "VibeLyrics: Hip-Hop Lyric Writing Assistant & Suite",
    github: "https://github.com/ChiragNSundar/VibeLyrics",
    images: [
      "/vbl/image.png",
      "/vbl/image copy.png",
      "/vbl/image copy 2.png",
      "/vbl/image copy 3.png",
      "/vbl/image copy 4.png",
      "/vbl/image copy 5.png",
      "/vbl/image copy 6.png"
    ],
    pitch: "A professional-grade hip-hop lyric writing assistant and analysis suite. It combines a distraction-free writing environment with real-time rhyme highlighting, multi-LoRA continual DPO training pipelines, and interactive 3D theme networks.",
    techStack: [
      { component: "Frontend Language", tech: "React 19 + TypeScript + Vite 7" },
      { component: "Styling & UI", tech: "Tailwind CSS 4 + clsx + tailwind-merge" },
      { component: "State Engine", tech: "Zustand 5 (Atomic state)" },
      { component: "Animations & Motion", tech: "Framer Motion 12" },
      { component: "Backend API Framework", tech: "FastAPI (Python 3.11+)" },
      { component: "Database ORM Engine", tech: "SQLAlchemy 2.0 (Async) + AIOSQLite" },
      { component: "NLP & Rhyme Pipeline", tech: "NLTK / Spacy / CMU Pronouncing Dictionary" },
      { component: "Audio Extraction Engine", tech: "Librosa + NumPy" }
    ],
    features: [
      "Rhyme Engine & Highlights: Real-time assonance, consonance, and internal rhyme visual highlights.",
      "AI Ghostwriter ('Vibe'): Personalized assistant matching user headspace, journal emotions, and banned words.",
      "Multi-Language Rhymes: Phonetic dictionaries for English, Hindi (Hinglish), and Kannada (Kanglish).",
      "Syllable stress timeline: Syllable stress indicators collapsible with flow-aligned rhyme matching.",
      "PWA Offline Mode: Service worker assets caching & IndexedDB sync queues.",
      "Learning Center: Lyrics web scraper (BeautifulSoup), PDF parser, and 3D theme network visualization.",
      "Training Pipeline: Score-gated DPO training, multi-LoRA profiles (Aggressive, Melodic), and LM Studio GGUF exports."
    ],
    coreIntelligence: [
      "Continual DPO learning: Background buffer compiles high-complexity lines to auto-trigger model retraining.",
      "Doppelreim alignment: Syllable stress templates matching candidate rhymes with target syllable counts.",
      "RAG-Augmented Callbacks: Indexes historical sessions to suggest thematic self-referential adlibs."
    ],
    challenges: "Synchronizing state updates offline and optimizing rendering for thousands of lyrics lines. Solved via IndexedDB write queues, atomic Zustand state blocks, and react-window virtualization.",
    projectStructure: `vibelyrics/
├── backend/                # FastAPI Application
│   ├── models/             # SQLAlchemy Database Models
│   ├── routers/            # API Route Handlers (ai, scraper, stats)
│   ├── schemas/            # Pydantic schemas
│   └── services/           # Core Logic (ai_provider, rhyme_detector)
├── frontend/               # React 19 + Vite 7 Frontend
│   ├── src/
│   │   ├── components/     # UI Components (session, stats)
│   │   ├── styles/         # Global Styles (Dreamy Theme)
│   │   └── main.tsx        # App entry & service worker setup
│   └── public/             # Static PWA assets & manifest.json
├── data/                   # Local Persistence (sqlite db, indices)
├── scripts/                # Dict seeder & icon generator
└── requirements.txt        # Python Dependencies`,
    architecture: `                                +-------------------+
                                |    USER SYSTEM    |
                                +---------+---------+
                                          | (Interaction)
                                +---------v---------+
                                |  REACT FRONTEND   |
                                +---------+---------+
                                          | (REST / SSE / WebSockets)
  +---------------------------------------v---------------------------------------+
  |                               BACKEND (FastAPI)                               |
  |  +-------------------------------------------------------------------------+  |
  |  |                            SERVICES LAYER                               |  |
  |  |  +-------------------------------------------------------------------+  |  |
  |  |  |                            Core Services                          |  |  |
  |  |  | [Rhyme Engine]  [Audio Analyzer]  [NLP Analysis]  [Lyrics Scraper] |  |  |
  |  |  | [Training & Auto-Train]   [AI Arena/RLHF]   [Continual Learning]  |  |  |
  |  |  +-----------------------------------+-------------------------------+  |  |
  |  |                                      |                                  |  |
  |  |                              +-------v-------+                          |  |
  |  |                              |  AI PROVIDER  |                          |  |
  |  |                              +-------+-------+                          |  |
  |  +--------------------------------------+----------------------------------+  |
  |                                         | (Async DB Session)                  |
  |                                 +-------v-------+                             |
  |                                 |   SQLITE DB   |                             |
  |                                 +---------------+                             |
  +-----------------------------------------+-------------------------------------+
                                            |
                         +------------------+------------------+
                         |                                     |
               +---------v---------+                 +---------v---------+
               | EXTERNAL PROVIDERS|                 |    PERSISTENCE    |
               | (DuckDuckGo /     |                 | (Training ZIP /   |
               |  Gemini / GPT)    |                 |  DPO Logs JSON)   |
               +-------------------+                 +-------------------+`,
    databaseSchema: undefined
  }
};

// Scrambled text animation component for high-quality transitions
const ScrambledText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&";
    const targetText = text.toUpperCase();
    const length = targetText.length;
    
    const interval = setInterval(() => {
      frame++;
      const current = targetText.split("").map((char, index) => {
        if (char === "\n" || char === " ") return char;
        if (index > frame / 2.5) {
          return chars[Math.floor(Math.random() * chars.length)];
        }
        return targetText[index];
      }).join("");

      setDisplayedText(current);

      if (frame >= length * 2.5) {
        clearInterval(interval);
        setDisplayedText(text);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

// Typewriter text animation component for hero subtitles
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

// Component for screenshots with skeleton loading shim
const ScreenshotWithSkeleton: React.FC<{
  imgSrc: string;
  title: string;
  idx: number;
  onEnlarge: (src: string) => void;
}> = ({ imgSrc, title, idx, onEnlarge }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset load state on image switch
    setLoaded(false);
    
    // Check if browser has already cached/completed loading this image
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [imgSrc]);

  return (
    <div 
      onClick={() => onEnlarge(imgSrc)}
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--border-color)",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "4px 4px 0px var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        cursor: "zoom-in",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative"
      }}
      className="screenshot-card-hover"
    >
      {!loaded && (
        <div className="skeleton-shimmer" style={{ height: "180px", width: "100%" }} />
      )}
      <img 
        ref={imgRef}
        src={imgSrc} 
        alt={`${title} Asset ${idx + 1}`}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "auto",
          display: loaded ? "block" : "none",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          transition: "transform 0.2s ease"
        }}
        loading="lazy"
      />
    </div>
  );
};

export const App: React.FC = () => {
  // Console Role Mode: 'select' = Decision screen, 'engineer' = Coding portfolio, 'producer' = Audio mixing portfolio
  const [mode, setMode] = useState<'select' | 'engineer' | 'producer'>('select');
  const [activeDetailProject, setActiveDetailProject] = useState<"roadwatch" | "harmony" | "jobportal" | "aijdbot" | "vibelyrics" | null>(null);
  const [activeScreenshotLightbox, setActiveScreenshotLightbox] = useState<string | null>(null);

  // Background Preloading & Esc key listeners
  useEffect(() => {
    // 1. Preload modal visual assets in background
    Object.values(PROJECT_DETAILS_DATA).forEach((proj) => {
      if (proj.images) {
        proj.images.forEach((imgUrl) => {
          const img = new Image();
          img.src = imgUrl;
        });
      }
    });

    // 2. Keyboard listeners to close modals on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveScreenshotLightbox(null);
        setActiveDetailProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Guestbook Footer states & handlers
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [isGuestbookSubmitting, setIsGuestbookSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  // FL Studio splash overlay state
  const [showFlSplash, setShowFlSplash] = useState(false);

  // Community guidelines moderation — blocks spam, NSFW, gibberish
  const moderateContent = (name: string, message: string): string | null => {
    const blocked = [
      "fuck","shit","ass","damn","bitch","dick","pussy","cock","cunt","nigger","nigga",
      "faggot","retard","slut","whore","porn","xxx","nsfw","sex","nude","naked",
      "viagra","casino","crypto","buy now","click here","free money","subscribe",
      "follow me","check out my","onlyfans","telegram"
    ];
    const combined = (name + " " + message).toLowerCase();
    for (const word of blocked) {
      if (combined.includes(word)) {
        return "Your message was flagged by community guidelines. Please keep it clean and respectful.";
      }
    }
    // Block gibberish: message too short or all same character
    if (message.length < 3) return "Message is too short. Please write at least 3 characters.";
    if (/^(.)\1+$/.test(message.replace(/\s/g, ""))) return "Please write a meaningful message.";
    // Block excessive caps
    const upper = message.replace(/[^A-Z]/g, "").length;
    if (message.length > 10 && upper / message.length > 0.8) return "Please avoid excessive caps.";
    // Block repeated submissions (same name+message within 2 minutes)
    const recentKey = `gb_last_${name.toLowerCase().replace(/\s/g, "")}`;
    const lastSubmit = localStorage.getItem(recentKey);
    if (lastSubmit && Date.now() - Number(lastSubmit) < 120000) {
      return "You signed recently. Please wait a couple of minutes before signing again.";
    }
    return null;
  };


  const fetchSignatures = async () => {
    if (!isSupabaseConfigured) {
      const local = localStorage.getItem("local_signatures");
      setEntries(local ? JSON.parse(local) : []);
      return;
    }
    try {
      const { data, error } = await supabase!
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error("Error fetching signatures:", err);
    }
  };

  useEffect(() => {
    if (mode !== 'select') {
      fetchSignatures();
    }
  }, [mode]);

  // Handle offline sync when network status shifts to online
  useEffect(() => {
    const syncOfflineSignatures = async () => {
      if (!isSupabaseConfigured || !navigator.onLine) return;
      const queued = localStorage.getItem("offline_signatures");
      if (!queued) return;

      try {
        const signaturesList = JSON.parse(queued);
        if (signaturesList.length === 0) return;

        console.log(`Syncing ${signaturesList.length} offline signatures...`);
        const { error } = await supabase!.from("guestbook").insert(
          signaturesList.map((sig: any) => ({
            name: sig.name,
            message: sig.message
          }))
        );

        if (!error) {
          localStorage.removeItem("offline_signatures");
          await fetchSignatures();
          console.log("Successfully synchronized offline signatures.");
        }
      } catch (err) {
        console.error("Error syncing offline signatures:", err);
      }
    };

    window.addEventListener("online", syncOfflineSignatures);
    syncOfflineSignatures();

    return () => window.removeEventListener("online", syncOfflineSignatures);
  }, []);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || !guestMessage.trim()) return;
    setModerationError(null);
    unlockAudioContext();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail.trim())) {
      setModerationError("Please enter a valid email address.");
      return;
    }

    // Content moderation
    const modResult = moderateContent(guestName.trim(), guestMessage.trim());
    if (modResult) {
      setModerationError(modResult);
      return;
    }

    setIsGuestbookSubmitting(true);

    // Record throttle timestamp
    const recentKey = `gb_last_${guestName.trim().toLowerCase().replace(/\s/g, "")}`;
    localStorage.setItem(recentKey, String(Date.now()));

    const entryData = {
      name: guestName.trim(),
      email: guestEmail.trim(),
      message: guestMessage.trim(),
      created_at: new Date().toISOString()
    };

    const clearFields = () => {
      setGuestName("");
      setGuestEmail("");
      setGuestMessage("");
    };

    if (!isSupabaseConfigured) {
      const local = localStorage.getItem("local_signatures");
      const list = local ? JSON.parse(local) : [];
      list.unshift(entryData);
      localStorage.setItem("local_signatures", JSON.stringify(list));
      setEntries(prev => [entryData as any, ...prev.slice(0, 5)]);
      clearFields();
      setIsGuestbookSubmitting(false);
      return;
    }

    if (!navigator.onLine) {
      const queued = localStorage.getItem("offline_signatures");
      const signaturesList = queued ? JSON.parse(queued) : [];
      signaturesList.push(entryData);
      localStorage.setItem("offline_signatures", JSON.stringify(signaturesList));

      setEntries(prev => [entryData as any, ...prev.slice(0, 5)]);
      clearFields();
      setIsGuestbookSubmitting(false);
      console.log("Offline: Queued guestbook signature locally.");
      return;
    }

    try {
      const { error } = await supabase!.from("guestbook").insert([
        { name: guestName.trim(), email: guestEmail.trim(), message: guestMessage.trim() }
      ]);
      if (error) throw error;
      
      clearFields();
      await fetchSignatures();
    } catch (err: any) {
      const queued = localStorage.getItem("offline_signatures");
      const signaturesList = queued ? JSON.parse(queued) : [];
      signaturesList.push(entryData);
      localStorage.setItem("offline_signatures", JSON.stringify(signaturesList));

      setEntries(prev => [entryData as any, ...prev.slice(0, 5)]);
      clearFields();
      console.warn("Connection lost. Queued locally.");
    } finally {
      setIsGuestbookSubmitting(false);
    }
  };

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixRatio, setMixRatio] = useState(1.0);
  const [volume, setVolume] = useState(0.85);

  // Active section tracking (0 = Intro, 1 = Content section A, 2 = Content section B)
  const [activeSection, setActiveSection] = useState(0);

  // 3D Parallax Tilt state per section
  const [tilts, setTilts] = useState<Record<number, { rx: number; ry: number }>>({
    0: { rx: 0, ry: 0 },
    1: { rx: 0, ry: 0 },
    2: { rx: 0, ry: 0 }
  });
  const [unlocked, setUnlocked] = useState(false);

  // Section Refs for scroll-trigger navigation
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  // Synchronise state with the audio engine
  useEffect(() => {
    audioEngine.init(() => {
      const state = audioEngine.getState();
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      setMixRatio(state.mixRatio);
      setVolume(state.volume);
    });

    return () => {
      audioEngine.stop();
    };
  }, []);

  // Setup IntersectionObserver using direct DOM queries to bypass conditional mount ref gotchas
  useEffect(() => {
    if (mode === 'select') return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.1
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-section-idx") || "0");
          setActiveSection(index);
          entry.target.classList.add("active");
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    const elements = document.querySelectorAll("section[data-section-idx]");
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [mode]);

  // Fallback scroll listener to force-activate the last section when user reaches page end
  useEffect(() => {
    if (mode === 'select') return;

    const handleScroll = () => {
      const bottomThreshold = 60; // pixels from the bottom
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - bottomThreshold);
      if (isAtBottom) {
        setActiveSection(2); // index 2 is always the last section (Certificates or YouTube Covers)
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode]);

  // Mouse parallax movement tracking
  useEffect(() => {
    if (mode === 'select') return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;

      setTilts(prev => ({
        ...prev,
        [activeSection]: {
          rx: -y * 6,
          ry: x * 6
        }
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeSection, mode]);

  const handleTrackSelect = (track: Track) => {
    setUnlocked(true);
    audioEngine.play(track);
  };

  const handlePlayToggle = () => {
    setUnlocked(true);
    if (isPlaying) {
      audioEngine.stop();
    } else if (currentTrack) {
      audioEngine.play(currentTrack);
    } else {
      audioEngine.play(mixAndOriginalTracks[0]);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
  };

  const handleMixRatioChange = (ratio: number) => {
    audioEngine.setMixRatio(ratio);
  };

  const handleVolumeChange = (vol: number) => {
    audioEngine.setVolume(vol);
  };

  const unlockAudioContext = () => {
    if (!unlocked) {
      audioEngine.init();
      setUnlocked(true);
    }
  };

  const scrollToSection = (idx: number) => {
    playBipSound();
    const el = document.querySelector(`section[data-section-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const playBipSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  // Coordinated scroll transitions style generator
  const getSectionStyles = (idx: number) => {
    const isActive = activeSection === idx;
    const tilt = tilts[idx] || { rx: 0, ry: 0 };
    
    return {
      opacity: isActive ? 1 : 0.6,
      filter: "none",
      transform: isActive 
        ? `perspective(1600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(0) scale(1)` 
        : `perspective(1600px) rotateX(8deg) rotateY(-3deg) translateY(40px) scale(0.96)`,
      transition: isActive 
        ? "transform 0.15s ease-out, opacity 0.6s ease" 
        : "transform 0.9s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease",
      transformStyle: "preserve-3d" as const,
      backfaceVisibility: "hidden" as const
    };
  };

  // Navigation menu items mapped based on active view console role
  const getMenuItems = () => {
    if (mode === 'engineer') {
      return [
        { label: "01 INTRO", index: 0, color: "var(--color-amber-accent)" },
        { label: "02 PROFILES", index: 1, color: "var(--color-amber-accent)" },
        { label: "03 CERTIFICATES", index: 2, color: "var(--color-rose-accent)" }
      ];
    } else {
      return [
        { label: "01 INTRO", index: 0, color: "var(--color-lavender-accent)" },
        { label: "02 STEM MIXES", index: 1, color: "var(--color-lavender-accent)" },
        { label: "03 COVERS", index: 2, color: "var(--color-mint-accent)" }
      ];
    }
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-cream)",
        color: "var(--text-dark)",
        overflowX: "hidden",
        position: "relative",
        backgroundImage: "radial-gradient(#e4e4e7 1.2px, transparent 0)",
        backgroundSize: "32px 32px"
      }}
      onClick={unlockAudioContext}
    >
      {/* DECISION SPLASH VIEW: Mode Selector */}
      {mode === 'select' && (
        <div 
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
            gap: "36px",
            position: "relative"
          }}
        >
          {/* Top Header Section */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px" }}>
            <div 
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                padding: "6px 14px",
                fontFamily: "var(--font-lcd)",
                fontSize: "0.75rem",
                color: "var(--color-amber-accent)",
                fontWeight: "bold",
                marginBottom: "16px",
                boxShadow: "3px 3px 0px var(--card-shadow)"
              }}
            >
              PORTFOLIO WEBSITE: ACTIVE CONSOLE <span className="bouncy-emoji">👋</span>
            </div>

            <h1 
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "4.8rem",
                fontWeight: "900",
                lineHeight: "1.0",
                letterSpacing: "-2px",
                color: "var(--text-dark)",
                marginBottom: "12px",
                textTransform: "uppercase"
              }}
            >
              CHIRAG N SUNDAR
            </h1>

            <p 
              style={{
                fontFamily: "var(--font-lcd)",
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                letterSpacing: "1.5px"
              }}
            >
              // PORTFOLIO WEBSITE: CODES & AUDIO SYSTEMS //
            </p>
          </div>

          {/* Cards Split Wrapper */}
          <div 
            className="flex-row-mobile-stack"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "32px",
              width: "100%"
            }}
          >
            {/* Split 1: Software Engineer */}
            <div 
              className="creative-card splash-card full-width-mobile"
              onClick={() => { playBipSound(); setMode('engineer'); }}
              style={{
                flex: "1 1 350px",
                maxWidth: "440px",
                height: "440px",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                borderColor: "var(--border-color)",
                boxShadow: "10px 10px 0px rgba(245, 159, 0, 0.15), 10px 10px 0px var(--card-shadow)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "3.2rem" }} className="bouncy-emoji">💻</div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", textTransform: "uppercase", lineHeight: 1.1 }}>
                  Software<br/>Engineering<br/>Dossier
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Review my Computer Science degree from RNSIT (8.89 GPA), WhatDigital Tech Data Science internship, detailed project technical sheets (RoadWatch, Harmony Hub), and query my local AI chatbot.
                </p>
              </div>
              
              <button className="analog-btn active" style={{ padding: "12px 24px", justifyContent: "center" }}>
                LOAD DOSSIER CONSOLE &rarr;
              </button>
            </div>

            {/* Split 2: Music Producer */}
            <div 
              className="creative-card splash-card full-width-mobile"
              onClick={() => {
                playBipSound();
                setShowFlSplash(true);
                // Play actual FL Studio startup sound
                try {
                  const audio = new Audio('/fl_studio_start.mp3');
                  audio.volume = 0.5;
                  audio.play();
                } catch (e) {}
                setTimeout(() => {
                  setShowFlSplash(false);
                  setMode('producer');
                }, 2500);
              }}
              style={{
                flex: "1 1 350px",
                maxWidth: "440px",
                height: "440px",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                borderColor: "var(--border-color)",
                boxShadow: "10px 10px 0px rgba(147, 51, 234, 0.15), 10px 10px 0px var(--card-shadow)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "3.2rem" }} className="bouncy-emoji">🎚️</div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", textTransform: "uppercase", lineHeight: 1.1 }}>
                  Music<br/>Production &<br/>Mixing Studio
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Step inside the audio mixing studio. Interact with my live synchronized before/after multitrack stems player and watch YouTube video covers demonstrating my mixing capabilities.
                </p>
              </div>
              
              <button className="analog-btn active" style={{ padding: "12px 24px", justifyContent: "center" }}>
                ENTER AUDIO STUDIO &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO CONSOLE VIEWS (Rendered when a mode is active) */}
      {mode !== 'select' && (
        <>
          {/* Mobile top bar navigation */}
          <nav 
            className="mobile-nav" 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              background: "var(--card-bg)",
              borderBottom: "2px solid var(--border-color)",
              padding: "8px 16px",
              display: "none",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }}
                className="analog-btn"
                style={{ padding: "4px 8px", fontSize: "0.58rem" }}
              >
                🔄 ROLE
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {getMenuItems().map((item) => {
                const isActive = activeSection === item.index;
                return (
                  <button
                    key={item.index}
                    onClick={() => scrollToSection(item.index)}
                    className={`analog-btn ${isActive ? "active" : ""}`}
                    style={{ padding: "4px 8px", fontSize: "0.58rem" }}
                  >
                    {item.label.split(" ")[1] || item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Floating Navigation panel with switch console selector */}
          <nav
            className="sidebar-nav"
            style={{
              position: "fixed",
              right: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "var(--card-bg)",
              border: "2px solid var(--border-color)",
              borderRadius: "16px",
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "6px 6px 0px var(--card-shadow)",
              zIndex: 100
            }}
          >
            {/* Back to Console choice selector */}
            <button
              onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }}
              className="analog-btn"
              style={{
                padding: "6px 10px",
                fontSize: "0.58rem",
                justifyContent: "center",
                fontWeight: "900"
              }}
            >
              🔄 SWITCH ROLE
            </button>

            <div style={{ borderBottom: "1.5px solid var(--border-color)", margin: "4px 0" }} />

            {getMenuItems().map((item) => {
              const isActive = activeSection === item.index;
              return (
                <div 
                  key={item.index}
                  onClick={() => scrollToSection(item.index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer"
                  }}
                >
                  <span 
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isActive ? item.color : "var(--card-bg-muted)",
                      boxShadow: isActive ? `0 0 10px ${item.color}, 0 0 4px ${item.color}` : "inset 0 1px 2px rgba(0,0,0,0.1)",
                      border: "1.5px solid var(--border-color)",
                      transition: "all 0.25s ease"
                    }}
                  />
                  <span 
                    style={{
                      fontFamily: "var(--font-lcd)",
                      fontSize: "0.65rem",
                      color: isActive ? "var(--text-dark)" : "var(--text-muted)",
                      fontWeight: isActive ? "bold" : "normal",
                      transition: "color 0.25s"
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Main Content Sections Wrapper */}
          <div 
            className="main-content-wrapper"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "140px",
              padding: "80px 20px"
            }}
          >
            
            {/* SECTION 1: HERO LANDING (Customized based on active mode) */}
            <section 
              ref={sectionRefs[0]}
              data-section-idx="0"
              className="scroll-fade-in"
              style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                maxWidth: "800px",
                zIndex: 10,
                ...getSectionStyles(0)
              }}
            >
              <div 
                style={{
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  fontFamily: "var(--font-lcd)",
                  fontSize: "0.8rem",
                  color: mode === 'engineer' ? "var(--color-amber-accent)" : "var(--color-lavender-accent)",
                  fontWeight: "bold",
                  marginBottom: "24px",
                  boxShadow: "3px 3px 0px var(--card-shadow)"
                }}
              >
                ROLE: {mode === 'engineer' ? "SOFTWARE ENGINEER" : "MUSIC PRODUCER"} CONSOLE <span className="bouncy-emoji">{mode === 'engineer' ? "💻" : "🎚️"}</span>
              </div>
              
              <h1 
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "5.5rem",
                  fontWeight: "900",
                  lineHeight: "1.0",
                  letterSpacing: "-2px",
                  color: "var(--text-dark)",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  whiteSpace: "pre-line"
                }}
              >
                <ScrambledText text={mode === 'producer' ? "HAZARD\nCHIRAG" : "CHIRAG N\nSUNDAR"} />
              </h1>

              <p 
                style={{
                  fontFamily: "var(--font-lcd)",
                  fontSize: "1.1rem",
                  color: "var(--text-muted)",
                  letterSpacing: "1.5px",
                  marginBottom: "36px",
                  minHeight: "1.65rem"
                }}
              >
                <TypewriterText 
                  text={mode === 'engineer' 
                    ? "// WEB APP DEVELOPER // DATA ANALYTICS & GEN-AI //" 
                    : "// AUDIO MIXING & POST PRODUCTION SPECIALIST //"
                  } 
                />
              </p>

              <div style={{ display: "flex", gap: "16px" }}>
                <button className="analog-btn active" onClick={() => scrollToSection(1)} style={{ padding: "12px 24px" }}>
                  {mode === 'engineer' ? "LOAD INTERVIEW DOSSIER 📂" : "LAUNCH MIXER DECK 🎛️"}
                </button>
                <button 
                  className="analog-btn" 
                  onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }} 
                  style={{ padding: "12px 24px" }}
                >
                  🔄 SWITCH PORTFOLIO
                </button>
              </div>

              <div 
                style={{
                  marginTop: "80px",
                  animation: "float 2.5s ease-in-out infinite",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  opacity: 0.6
                }}
                onClick={() => scrollToSection(1)}
              >
                👇
              </div>
            </section>

            {/* SECTION 2 & 3: Mode Conditional Display */}
            {mode === 'engineer' ? (
              <>
                {/* Software Engineer: Resume & QA Chatbot */}
                <section 
                  ref={sectionRefs[1]}
                  data-section-idx="1"
                  className="scroll-fade-in"
                  style={{
                    width: "100%",
                    maxWidth: "850px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(1)
                  }}
                >
                  <DeveloperResumeCard 
                    onInteract={unlockAudioContext} 
                    onLaunchDetails={(key) => { playBipSound(); setActiveDetailProject(key); }}
                  />
                </section>

                {/* Software Engineer: Polaroid Certifications */}
                <section 
                  ref={sectionRefs[2]}
                  data-section-idx="2"
                  className="scroll-fade-in"
                  style={{
                    width: "100%",
                    maxWidth: "850px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(2)
                  }}
                >
                  <PolaroidCertificates />
                </section>
              </>
            ) : (
              <>
                {/* Music Producer: Audio Stems Mixer */}
                <section 
                  ref={sectionRefs[1]}
                  data-section-idx="1"
                  className="scroll-fade-in"
                  style={{
                    width: "100%",
                    maxWidth: "750px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(1)
                  }}
                >
                  <AudioEngineCard 
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    mixRatio={mixRatio}
                    volume={volume}
                    onTrackSelect={handleTrackSelect}
                    onPlayToggle={handlePlayToggle}
                    onMixRatioChange={handleMixRatioChange}
                    onVolumeChange={handleVolumeChange}
                    onInteract={unlockAudioContext}
                    onStop={handleStop}
                  />
                </section>

                {/* Music Producer: Youtube Cover Videos */}
                <section 
                  ref={sectionRefs[2]}
                  data-section-idx="2"
                  className="scroll-fade-in"
                  style={{
                    width: "100%",
                    maxWidth: "750px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(2)
                  }}
                >
                  <YoutubeCoversCard onInteract={unlockAudioContext} />
                </section>
              </>
            )}

            {/* Visual Divider */}
            <div 
              style={{
                width: "100%",
                maxWidth: mode === 'engineer' ? "850px" : "750px",
                borderTop: "3px dashed var(--border-color)",
                marginTop: "60px",
                marginBottom: "40px"
              }}
            />

            {/* Supabase Guestbook Card Footer */}
            <div 
              style={{
                width: "100%",
                maxWidth: mode === 'engineer' ? "850px" : "750px",
                background: "var(--color-amber)",
                border: "2.5px solid var(--border-color)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "6px 6px 0px var(--card-shadow)",
                marginBottom: "40px"
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--text-dark)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                ✍️ Guestbook Signature Log
              </h3>

              {/* Community Guidelines */}
              <div style={{
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                marginBottom: "14px",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.5)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                lineHeight: 1.5
              }}>
                <strong style={{ color: "var(--text-dark)" }}>📋 Community Guidelines:</strong> Be respectful & constructive. No spam, NSFW content, promotions, or gibberish. Your email is required for accountability but will not be displayed publicly. Repeat submissions are rate-limited.
              </div>

              {/* Moderation error banner */}
              {moderationError && (
                <div style={{
                  fontSize: "0.75rem",
                  color: "#b91c1c",
                  fontWeight: "bold",
                  background: "#fef2f2",
                  border: "1.5px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  ⚠️ {moderationError}
                </div>
              )}
              
              <form onSubmit={handleGuestbookSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={guestName}
                  onChange={(e) => { setGuestName(e.target.value); setModerationError(null); }}
                  required
                  maxLength={50}
                  aria-label="Your Name"
                  style={{
                    flex: "1 1 160px",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    outline: "none",
                    color: "var(--text-dark)"
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={guestEmail}
                  onChange={(e) => { setGuestEmail(e.target.value); setModerationError(null); }}
                  required
                  aria-label="Your Email"
                  style={{
                    flex: "1 1 200px",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    outline: "none",
                    color: "var(--text-dark)"
                  }}
                />
                <input
                  type="text"
                  placeholder="Leave a short comment... *"
                  value={guestMessage}
                  onChange={(e) => { setGuestMessage(e.target.value); setModerationError(null); }}
                  required
                  maxLength={200}
                  aria-label="Your Comment"
                  style={{
                    flex: "2 1 300px",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    outline: "none",
                    color: "var(--text-dark)"
                  }}
                />
                <button
                  type="submit"
                  disabled={isGuestbookSubmitting}
                  style={{
                    flex: "0 0 auto",
                    background: "var(--color-amber-accent)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 24px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "var(--card-bg)",
                    cursor: "pointer",
                    boxShadow: "3px 3px 0px var(--card-shadow)"
                  }}
                >
                  {isGuestbookSubmitting ? "SIGNING..." : "SIGN THE LOG"}
                </button>
              </form>

              {/* Guestbook signatures list */}
              <div style={{ marginTop: "16px", borderTop: "1.5px dashed var(--border-color)", paddingTop: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px", maxHeight: "120px", overflowY: "auto" }}>
                  {entries.length > 0 ? (
                    entries.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.68rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  ) : (
                    MOCK_ENTRIES.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.68rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Scroll bottom spacer to provide scrolling headroom */}
            <div style={{ height: "160px" }} />

          </div>

          {/* Persistent Bottom Ticker Strip */}
          <div 
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              borderTop: "3.5px solid #18181b",
              background: "#ffffff",
              zIndex: 90,
              padding: "10px 24px",
              boxShadow: "0 -4px 15px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span 
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  background: isPlaying ? "var(--color-lavender-accent)" : "#d4d4d8", 
                  boxShadow: isPlaying ? "0 0 6px var(--color-lavender-accent)" : "none" 
                }} 
              />
              <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "bold" }}>
                {isPlaying ? "AUDIO STREAMING ACTIVE" : "SIGNAL STANDBY"}
              </span>
            </div>

            <div 
              style={{
                flexGrow: 1,
                maxWidth: "500px",
                background: "#f4f4f5",
                border: "1.5px solid #18181b",
                borderRadius: "8px",
                height: "28px",
                padding: "2px 8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span 
                className="scrolling-text"
                style={{ 
                  fontFamily: "var(--font-lcd)", 
                  fontSize: "0.6rem", 
                  color: "var(--text-dark)",
                  fontWeight: "bold"
                }}
              >
                CHIRAG N SUNDAR PORTFOLIO ENGINE // ACTIVE ROLE: {mode.toUpperCase()} // SYSTEM STATUS: ACTIVE // CREATIVE GRID LOADED // LOCKSTEP SIGNAL READY
              </span>
            </div>

            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--text-muted)", display: "flex", gap: "12px", fontWeight: "bold" }}>
              <span>BAUD: 9600</span>
              <span>&copy; 2026</span>
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Detailed Project Explorer Console Modal */}
      {activeDetailProject && createPortal(
        <div 
          onClick={() => setActiveDetailProject(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24, 24, 27, 0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "20px"
          }}
        >
          <div 
            className="modal-spring-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1000px",
              height: "90vh",
              backgroundColor: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              borderRadius: "16px",
              boxShadow: "12px 12px 0px var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* Header console bar */}
            <div 
              style={{
                background: "var(--card-bg-muted)",
                borderBottom: "3px solid var(--border-color)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.3rem" }}>📂</span>
                <span style={{ fontFamily: "var(--font-lcd)", fontWeight: "bold", fontSize: "0.85rem", color: "var(--color-amber-accent)" }}>
                  PROJECT CONSOLE: {activeDetailProject.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setActiveDetailProject(null)}
                className="analog-btn active"
                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              >
                ✕ CLOSE PANEL
              </button>
            </div>

            {/* Project selection tabs inside modal */}
            <div 
              style={{
                display: "flex",
                background: "var(--card-bg)",
                borderBottom: "1.5px solid var(--border-color)",
                padding: "8px 12px",
                gap: "8px",
                overflowX: "auto"
              }}
            >
              {(["roadwatch", "harmony", "jobportal", "aijdbot", "vibelyrics"] as const).map((key) => {
                const isActive = activeDetailProject === key;
                const icon = key === "roadwatch" ? "🏍️" : key === "harmony" ? "🧠" : key === "jobportal" ? "📊" : key === "aijdbot" ? "🤖" : "🎤";
                const label = key === "roadwatch" ? "ROADWATCH" : key === "harmony" ? "HARMONY HUB" : key === "jobportal" ? "JOB PORTAL" : key === "aijdbot" ? "AI JD BOT" : "VIBELYRICS";
                return (
                  <button
                    key={key}
                    onClick={() => { playBipSound(); setActiveDetailProject(key); }}
                    className={`analog-btn ${isActive ? "active" : ""}`}
                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                  >
                    {icon} {label}
                  </button>
                );
              })}
            </div>

            {/* Split Screen Panel Content */}
            {(() => {
              const data = PROJECT_DETAILS_DATA[activeDetailProject];
              return (
                <div 
                  className="flex-row-mobile-stack"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    overflow: "hidden"
                  }}
                >
                  {/* Left Column: Specs */}
                  <div 
                    className="full-width-mobile"
                    style={{
                      flex: data.images.length === 0 ? "1 1 100%" : "1.3 1 0",
                      padding: "24px",
                      overflowY: "auto",
                      borderRight: data.images.length === 0 ? "none" : "2px solid var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1.4rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px" }}>
                        {data.title}
                      </h2>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.45, opacity: 0.9 }}>
                        {data.pitch}
                      </p>
                    </div>

                    {/* GitHub Link button */}
                    <div>
                      <a 
                        href={data.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="analog-btn active"
                        style={{ display: "inline-flex", textDecoration: "none", color: "var(--card-bg)", padding: "8px 16px", fontSize: "0.8rem", gap: "6px" }}
                      >
                        VIEW WORK ON GITHUB 🔗
                      </a>
                    </div>

                    {/* Tech stack grid */}
                    <div style={{ background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "12px", padding: "14px" }}>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px", color: "var(--color-amber-accent)" }}>
                        ⚙️ Tech Stack & Dependencies
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {data.techStack.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", borderBottom: "1px dashed var(--border-color)", paddingBottom: "3px" }}>
                            <span style={{ fontWeight: "bold", opacity: 0.8 }}>{item.component}</span>
                            <span>{item.tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                        🚀 Key Features
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.4 }}>
                        {data.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Intelligence pipelines */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                        🧠 Core Intelligence
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.4 }}>
                        {data.coreIntelligence.map((intel, idx) => (
                          <li key={idx}>{intel}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Project Structure Tree */}
                    {data.projectStructure && (
                      <div>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                          📁 Project Structure
                        </h3>
                        <pre 
                          style={{ 
                            background: "var(--card-bg-muted)", 
                            border: "1.5px solid var(--border-color)", 
                            borderRadius: "8px", 
                            padding: "12px", 
                            fontSize: "0.72rem", 
                            fontFamily: "monospace", 
                            color: "var(--text-dark)",
                            overflowX: "auto",
                            whiteSpace: "pre"
                          }}
                        >
                          {data.projectStructure}
                        </pre>
                      </div>
                    )}

                    {/* Architecture diagram */}
                    {data.architecture && (
                      <div>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                          🏛️ System Architecture
                        </h3>
                        <pre 
                          style={{ 
                            background: "var(--card-bg-muted)", 
                            border: "1.5px solid var(--border-color)", 
                            borderRadius: "8px", 
                            padding: "12px", 
                            fontSize: "0.72rem", 
                            fontFamily: "monospace", 
                            color: "var(--text-dark)",
                            overflowX: "auto",
                            whiteSpace: "pre"
                          }}
                        >
                          {data.architecture}
                        </pre>
                      </div>
                    )}
                    {/* Database Schemas */}
                    {data.databaseSchema && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                          🗄️ Database Schema Collections
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {data.databaseSchema.map((col: { collection: string; fields: { field: string; type: string; desc: string }[] }, cIdx: number) => (
                            <div key={cIdx} style={{ background: "var(--card-bg)", border: "1.5px solid var(--border-color)", borderRadius: "10px", padding: "14px", boxShadow: "4px 4px 0px var(--card-shadow)" }}>
                              <h4 style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-amber-accent)", marginBottom: "8px", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "4px" }}>
                                Collection: {col.collection}
                              </h4>
                              <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem", textAlign: "left" }}>
                                  <thead>
                                    <tr style={{ borderBottom: "1.5px solid var(--border-color)" }}>
                                      <th style={{ padding: "4px 8px", fontWeight: "bold" }}>Field</th>
                                      <th style={{ padding: "4px 8px", fontWeight: "bold" }}>Type</th>
                                      <th style={{ padding: "4px 8px", fontWeight: "bold" }}>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {col.fields.map((f: { field: string; type: string; desc: string }, fIdx: number) => (
                                      <tr key={fIdx} style={{ borderBottom: "1px dashed var(--border-color)" }}>
                                        <td style={{ padding: "4px 8px", fontFamily: "monospace", fontWeight: "bold" }}>{f.field}</td>
                                        <td style={{ padding: "4px 8px", color: "var(--color-amber-accent)", fontWeight: "600" }}>{f.type}</td>
                                        <td style={{ padding: "4px 8px", opacity: 0.9 }}>{f.desc}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Challenges faced */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                        ⚖️ Development Challenges
                      </h3>
                      <p style={{ fontSize: "0.78rem", lineHeight: 1.45, opacity: 0.85 }}>
                        {data.challenges}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Visual screenshot feed */}
                  {data.images.length > 0 && (
                    <div 
                      className="full-width-mobile"
                      style={{
                        flex: "0.9 1 0",
                        padding: "24px",
                        background: "var(--card-bg-muted)",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                      }}
                    >
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        🖼️ Visual Assets & Demos
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {data.images.map((imgSrc, idx) => {
                          return (
                            <ScreenshotWithSkeleton 
                              key={idx} 
                              imgSrc={imgSrc} 
                              title={data.title} 
                              idx={idx} 
                              onEnlarge={setActiveScreenshotLightbox} 
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>,
        document.body
      )}
      {activeScreenshotLightbox && (
        <div 
          onClick={() => setActiveScreenshotLightbox(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24, 24, 27, 0.7)",
            backdropFilter: "blur(12px)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            cursor: "zoom-out"
          }}
        >
          <div 
            className="modal-spring-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              background: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              borderRadius: "16px",
              padding: "12px",
              boxShadow: "10px 10px 0px var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              cursor: "default"
            }}
          >
            <button
              onClick={() => setActiveScreenshotLightbox(null)}
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                width: "36px",
                height: "36px",
                background: "var(--color-rose-accent)",
                color: "white",
                border: "2px solid var(--border-color)",
                borderRadius: "50%",
                fontSize: "1rem",
                fontWeight: "900",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "2px 2px 0px var(--card-shadow)"
              }}
            >
              ✕
            </button>
            <img 
              src={activeScreenshotLightbox} 
              alt="Project Screenshot Enlarged"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
                border: "1.5px solid var(--border-color)",
                display: "block"
              }}
            />
          </div>
        </div>
      )}
      {/* FL Studio Splash — floating logo, page stays visible */}
      {showFlSplash && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          animation: "fl-splash-in 0.3s ease-out"
        }}>
          <img
            src="/fl_logo.png"
            alt="FL Studio"
            style={{
              width: "160px",
              height: "auto",
              animation: "fl-logo-pulse 1.5s ease-in-out infinite",
              filter: "drop-shadow(0 0 40px rgba(255,140,0,0.6)) drop-shadow(0 0 80px rgba(255,140,0,0.25))"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
