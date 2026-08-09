# 📻 Dual-Role Analog Console Portfolio & Stems Studio

[![Live Website](https://img.shields.io/badge/Live-Vercel-blue?style=for-the-badge)](https://chiragns.vercel.app/)

An immersive, skeuomorphic, and interactive developer portfolio website styled as a **1970s analog studio rack unit** in 3D. 

This project features a **Dual-Role Entry Portal** that custom-tailors the portfolio layout for different audiences:
* **💻 Software Engineering Dossier**: Focuses on computer science credentials, internship metrics, a neobrutalist tech stack deck, live GitHub statistics, an offline semantic RAG chatbot, and 6 detailed project console breakdowns.
* **🎚️ Music Production & Stems Studio**: Focuses on multitrack audio mixing comparison players, an Originals & Covers tabbed YouTube player, and an FL Studio-themed entry splash.

Live Vercel Site: [chiragns.vercel.app](https://chiragns.vercel.app/)

### 🔗 Direct Access Links & Fiverr Services
* **💻 Software Engineering Dossier Direct Link**: [chiragns.vercel.app/#engineer](https://chiragns.vercel.app/#engineer) (or `https://chiragns.vercel.app/engineer`)
* **🎚️ Music Production & Mixing Studio Direct Link**: [chiragns.vercel.app/#producer](https://chiragns.vercel.app/#producer) (or `https://chiragns.vercel.app/music`)
* **🟢 Fiverr Profile (Mixing & Vocal Processing Services)**: [fiverr.com/s/rEV8667](https://www.fiverr.com/s/rEV8667) — Book custom vocal mixing, pitch tuning, multitrack balancing, and streaming mastering.

---

## 🕹️ Interface & Key Features

### 1. Dual-Mode Landing Portal
* Splitted skeuomorphic splash screen allowing visitors to select their target role path immediately upon loading, with direct link indicators for `#engineer` and `#producer`.
* Dynamic switch button with animation transforming the layout instantly.
* Animated hero greetings displaying **HazardChirag** with a custom scrambler text transition when loading the engineer dossier.
* **FL Studio Entry Splash**: Entering the Music Producer console triggers the iconic FL Studio startup sound (`/audio/sfx/fl_studio_start.mp3`) with the official fruit logo animating inline below the hero section.

### 2. Software Engineer Dossier & Offline Semantic RAG
* **Professional Bio**: "Result-driven Software Engineer specializing in Web App Development, Data Science/Analytics, and GenAI/AI Agents."
* **Professional Timeline**: Fully detailed work experience including B.E. Computer Science & Engineering (RNSIT, GPA 8.89), Data Science & AI Intern (WhatDigital Technologies, `Nov 2025 - Apr 2026`), and AI Operations Specialist (Rural Bank of Calbayog City, Inc. - RBCCI).
* **"Ask Chirag AI" Offline Semantic RAG Engine**: Zero-latency, client-side RAG engine loaded with ~40 pre-chunked knowledge chunks. Employs TF-IDF scoring, bigram matching, category boosting, dynamic follow-up chips, and embellishment rules to handle interview Q&A and technical inquiries 100% offline without API keys.
* **Live GitHub Activity Scraper & Heatmap**: Vercel Serverless Function (`/api/github-stats.ts`) with 1-hour CDN caching (`s-maxage=3600, stale-while-revalidate=86400`) that scrapes your exact live total contribution count (**788+**) and renders the real 52-week activity heatmap level boxes.

### 3. Contact, Fiverr & Social Integrations
* **Dedicated Contact Consoles**: Separate contact cards tailored for Software Engineering ("DEVELOPER CONTACT CONSOLE") and Music Production ("VOCAL MIXING & PRODUCER CONSOLE").
* **Fiverr Profile Integration**: Direct booking links for mixing and vocal processing at [fiverr.com/s/rEV8667](https://www.fiverr.com/s/rEV8667).
* **Social Links**: Connected to GitHub (`github.com/ChiragNSundar`), LinkedIn (`linkedin.com/in/chiragnsundar/`), Fiverr (`fiverr.com/s/rEV8667`), Spotify (`open.spotify.com/user/wapj86uclwiwd4n2g94v7er6u`), Instagram (`@chirag.localhost`), and email (`chiragns12@gmail.com`).

### 4. Fullscreen Detailed Project Explorer Console
Clicking any project card launches a fullscreen console overlay modal with roomier, high-contrast tab controls to navigate across all 6 core projects:
* 🏍️ **RoadWatch**: Real-time motorcycle helmet detection & OCR (YOLOv8 + FastAPI + OpenCV + CLAHE) with live GIF feed and OCR voting consensus.
* 🧠 **Harmony Hub**: Streamlit-based mental wellness RAG assistant (Gemini Pro + PDF Text Pipeline) with Plotly analytics and mood trackers.
* 📊 **Job Portal BI Dashboard**: Interactive Dash business intelligence dashboard querying MongoDB & MySQL databases with geospatial sunburst graphs.
* 🤖 **AI JD Bot**: Production Flask job description generator (Gemini 2.0 Flash + Gemma 2 + 12 MongoDB collections + Leaflet map selector).
* 🎤 **VibeLyrics**: Professional hip-hop writing suite (React 19 + Zustand 5 + FastAPI + Librosa + Continual LoRA DPO training).
* 🎛️ **Vocal Muse (VoxScript)**: Open-source, local-first studio workspace for vocalists & producers (React 19 + TanStack Start + Tailwind v4 + Web Audio API + faster-whisper-server + Reciprocal Rank Fusion RRF Hybrid RAG + 31,021-entry KEED 2018 Kannada-English & Hinglish dictionaries + OPFS audio storage + Graphify AST index).

### 5. Rich Image Captions & Fullscreen Lightbox
* **Portfolio-Wide Image Captions**: Every project in the modal visual gallery features custom amber-highlighted titles and feature descriptions beneath each screenshot.
* **Fullscreen Lightbox**: Click any project screenshot to launch a high-resolution lightbox viewer with spring-in transitions and skeleton shimmer preloaders.

### 6. Moderated Supabase Guestbook Footer
* Full-width neobrutalist guestbook signature log card at the bottom of the page.
* Submits signatures dynamically to Supabase databases with client-side content moderation, email validation, and local-storage fallback queueing.

---

## 🛠️ Technology Stack

- **Frontend & Core**: React 19 + TypeScript + Vite 7 + TanStack Start + Zustand 5 + Framer Motion 12 + Tailwind CSS v4
- **Audio Processing**: Web Audio API (oscilloscope waveform, metronome sync, gain-fading, sound synthesizers)
- **AI/ML & NLP Orchestration**: Gemini 2.0/2.5 Pro & Flash, Gemma 2, faster-whisper-server, Reciprocal Rank Fusion (RRF) Hybrid RAG, POS-Grammar engines, Spacy, NLTK, Librosa
- **Dictionaries & Datasets**: KEED 2018 Kannada-English Dictionary (31,021 entries) + Hinglish Rap Vocabulary
- **Database & Persistence**: Supabase (PostgreSQL), MongoDB, MySQL, SQLite (WAL Mode), IndexedDB, OPFS (Origin Private File System)
- **APM & Reliability**: Vercel Serverless API, OpenTelemetry distributed tracing, pybreaker circuit breakers, rate limiters
- **AST Knowledge Graph**: Graphify AST indexing & community detection graph

---

## 🚀 Setup & Execution

### 1. Database Configuration (Supabase)
1. Initialize a new project on your [Supabase Dashboard](https://supabase.com/).
2. Run [supabase-migration.sql](./supabase-migration.sql) in the SQL Editor to set up the `guestbook` table and Row Level Security (RLS) policies.

### 2. Local Environment Configuration
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Running Locally & Building
```bash
npm install
npm run dev     # Starts Vite development server
npm run build   # Compiles TypeScript & bundles production assets
```
