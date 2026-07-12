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
* Floating navigational switch button (`🔄 Switch Role`) inside both views for dynamic mode swapping.

### 2. Software Engineering Dossier Console
* **"Ask Chirag AI" Chatbot**: Zero-latency interactive local query chatbot loaded with developer QA details (RAG models, YOLOv8 vision, Streamlit dashboards, internship specs, and strengths/weaknesses). Includes a typing indicator animation (`...`), auto-scrolling focus, and a clear logs tool (`🗑️`).
* **GitHub Stats & Commit Heatmap**: Displays your custom bio summary, commit counters (610 total commits, 10-day streak), and a CSS-drawn green contribution grid.
* **Tech Stack Badge Deck**: A colorful, flat neobrutalist grid showing all 27 technical tools/libraries matching their official brand colors.
* **Interactive Certificates Lightbox**: A stacked Polaroid display of credentials (Infosys, freeCodeCamp) that opens in a high-resolution preview modal with glassmorphic backdrop blur on click. Handles Esc-key close events.

### 3. Music Production Stems Studio
* **Bouncy Equalizer Waveform**: An animated SVG equalizer visualizer that dances to the stems playback in real time, and snaps back to static when paused.
* **Stems Crossfader**: Real-time Web Audio API comparison between "Before Mix" (raw multitracks) and "After Mix Master" (finished master).
* **Covers Catalog**: Displays your 20 performance videos from YouTube in bottom-up order, with video details and direct stream buttons.

---

## 🛠️ Technology Stack

- **Framework & Core**: React + TypeScript + Vite
- **3D Effects**: Pure CSS 3D Perspective Parallax (Cabinet shifts relative to cursor position)
- **Audio Processing**: Web Audio API (oscilloscope analyzer, gain-fading, dynamic audio nodes, key sound synthesis)
- **Database Backend**: Supabase (PostgreSQL, Row Level Security)
- **Hosting Platform**: Vercel (Continuous deployment from GitHub)

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
