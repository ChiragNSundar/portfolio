# 📻 Warm 70s Analog Studio Rack Portfolio

An immersive, highly graphical, and interactive developer portfolio website styled as a **1970s analog studio rack unit** in 3D. This project combines tactile skeuomorphic interfaces (wood cabinet, gold faceplates, rotating tape reels, bouncing VU needles) with high-performance modern web technologies (React, TypeScript, Canvas API, and Web Audio API) to showcase both **music production** and **software engineering** credentials.

---

## 🕹️ Interface Modules

### 1. Supply & Takeup Tape Deck
- **Tactile Transport**: Giant metal controls for `PLAY/PAUSE`, `STOP`, `PREV`, and `NEXT` track navigation.
- **Spinning Tape Reels**: SVG-rendered tape reels that dynamically accelerate and decelerate matching audio status.
- **Dual Needle VU Meters**: Bouncing CH A and CH B volume meters responsive to active wave levels.
- **Before/After Crossfader**: A custom Web Audio fader letting visitors compare raw recordings with final polished tracks in real-time.

### 2. CRT Oscilloscope Screen
- **Phosphor Reticle Visualizer**: Canvas-drawn real-time frequency sine wave analyser showing audio oscillations.
- **LCD Status Bar**: Monospace indicator showing track titles, genres, and mix notes.

### 3. Cathode-Ray Cover TV
- **Curved Glass CRT Frame**: Displays embedded YouTube covers with custom curved scanlines, glass curvature, and tube grids.
- **Tuner Rotary Dial**: Clickable channel selector knob that rotates to cycle covers, triggering screen static and channels flicker.
- **Power Button**: Retro red push button to toggle monitor grid on/off.

### 4. MS-DOS Developer Resume Terminal
- **Retro Phosphor Console**: MS-DOS interface housing the complete developer resume.
- **F-Key Hotkeys & CLI Command Prompt**: Browse sections using physical console buttons (`F1` - `F5`) or type interactive terminal commands (`help`, `experience`, `projects`, `skills`, `education`, `certifications`, `about`, `clear`).
- **Interactive Supabase Guestbook**: Command module enabling visitors to fetch guestbook logs from a database or run the interactive signing wizard (`guestbook sign`).
- **Tactile Key Clicks**: Synthesizes real-time terminal key-down clicks dynamically via the browser's Web Audio API.

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
