# 📻 Dual-Role Analog Console Portfolio & Stems Studio

[![Live Website](https://img.shields.io/badge/Live-Vercel-blue?style=for-the-badge)](https://portfolio-one-blue-asoaj8ivp3.vercel.app/)

An immersive, skeuomorphic, and interactive developer portfolio website styled as a **1970s analog studio rack unit** in 3D. 

This project features a **Dual-Role Entry Portal** that custom-tailors the portfolio layout for different audiences:
* **💻 Software Engineering Dossier**: Focuses on computer science credentials, internship metrics, a neobrutalist tech stack deck, a simulated GitHub contributions heatmap, and an interactive representative chatbot.
* **🎚️ Music Production & Stems Studio**: Focuses on multitrack audio mixing comparison players, interactive performance covers, and music social channels.

Live Vercel Site: [portfolio-one-blue-asoaj8ivp3.vercel.app](https://portfolio-one-blue-asoaj8ivp3.vercel.app/)

---

## 🕹️ Interface & Key Features

### 1. Dual-Mode Landing Portal
* Splitted skeuomorphic splash screen allowing visitors to select their target role path immediately upon loading.
* Dynamic switch button with animation transforming the layout instantly.
* Animated hero greetings displaying **HazardChirag** with a custom scrambler text transition when loading the engineer dossier.

### 2. Software Engineer Dossier & Timeline
* **Professional Timeline**: Fully detailed work experience including B.E. Computer Science & Engineering (RNSIT), Data Science & AI Intern (WhatDigital Technologies, `Nov 2025 - Apr 2026`), and AI Operations Specialist (Rural Bank of Calbayog City, Inc. - RBCCI).
* **Micro-Interactions**: Custom hover-lift transitions (`transform: translateY(-4px)`) on CV sections and project card components.
* **"Ask Chirag AI" Chatbot**: Zero-latency local representative chatbot loaded with developer QA details. Includes custom typing loaders, scroll triggers, and clear history tools.
* **GitHub stats & tech badging**: Commit contribution grids and neobrutalist color-themed library badges.

### 3. Fullscreen Detailed Project Explorer Console
Clicking a project card launches a fullscreen console overlay modal (via React Portal) with tabs to swap between all projects:
* 🏍️ **RoadWatch**: Real-time motorcycle helmet detection (YOLOv8 + FastAPI + CLAHE normalization) showing text-based directory structure trees and `bike.gif` stream crops.
* 🧠 **Harmony Hub**: Streamlit-based mental wellness assistant (Gemini Pro + RAG) showing mood calculators and Plotly statistics graphs.
* 📊 **Job Portal BI Dashboard**: Interactive Dash dashboard querying SQL/Mongo backends, showing a text-based ASCII system flow diagram.
* 🤖 **AI JD Bot**: Job description assistant (Flask + Gemini/Gemma + 12 MongoDB collection tables). Set to text-only mode where visuals column auto-compresses to full width.
* 🎤 **VibeLyrics**: Professional hip-hop writing suite (React 19 + Zustand 5 + FastAPI + Librosa + LoRA DPO continual training), showing detailed directory structure trees and system layout charts.

### 4. Realigned Supabase Guestbook Footer
* Removed inline guestbook widgets to clear CV clutter.
* Mounted a full-width neobrutalist guestbook signature log card at the very bottom of the page, acting as the layout footer.
* Submits signatures dynamically to Supabase databases with fallback offline demo caches inside local storage.

---

## 🛠️ Technology Stack

- **Frontend & Core**: React 19 + TypeScript + Vite 7 + Zustand 5 + Framer Motion 12
- **Styling**: Vanilla CSS (Cream & pastel neobrutalist design system, locked in Light Mode)
- **Audio Processing**: Web Audio API (gain-fading, dynamic audio nodes, key sound synthesizers)
- **AI/ML & NLP Orchestration**: Gemini 2.0/2.5 Pro & Flash, Gemma 2, Spacy, NLTK, Librosa
- **Database & Persistence**: Supabase (PostgreSQL, RLS), MongoDB (JSON Schema validation), SQLite (WAL Mode parallel backup queues), IndexedDB
- **APM & Observability**: OpenTelemetry distributed tracing, circuit breaker patterns (pybreaker), health check pipelines
- **Testing Suites**: Pytest, Vitest, Playwright (E2E browser testing), Chaos engineering simulations

---

## 🚀 Setup & Execution

### 1. Database Configuration (Supabase)
1. Initialize a new project on your [Supabase Dashboard](https://supabase.com/).
2. Navigate to the **SQL Editor** tab.
3. Open the file [supabase-migration.sql](./supabase-migration.sql), copy its SQL structure, paste it into the editor, and click **Run**. This:
   - Configures the `guestbook` table.
   - Restricts queries with indexes.
   - Sets public Row Level Security (RLS) policies allowing visitors to read and write guestbook entries securely.

### 2. Local Environment Configuration
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: If these env variables are not found, the website will automatically load in Offline Demo Mode, logging warning prompts on the terminal screen and saving guestbook signups to `localStorage` instead.*

### 3. Running Locally
Install dependencies and run the Vite local development server:
```bash
npm install
# start the dev server
npm run dev
```

### 4. Build for Production
Verify compilation and output bundled minified production assets:
```bash
npm run build
```

---

## ⚡ Vercel Deployment

1. Push this project to your GitHub account.
2. Link your GitHub account and import the repository on your [Vercel Dashboard](https://vercel.com/).
3. In the project's **Environment Variables** configuration section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and serve your portfolio on a public URL.
