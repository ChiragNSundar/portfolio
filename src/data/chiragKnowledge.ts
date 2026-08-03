// ============================================================================
// AskChirag AI — Pre-Chunked Knowledge Base
// Derived from: chiragcontext.txt, resume.ts, and sample interview Q&A
// Each chunk is written in Chirag's conversational first-person voice
// ============================================================================

export interface KnowledgeChunk {
  id: string;
  category: "identity" | "behavioral" | "work_experience" | "project" | "system_design" | "meta" | "interview";
  title: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ==========================================================================
  // IDENTITY & CORE PROFILE
  // ==========================================================================
  {
    id: "intro",
    category: "identity",
    title: "Who is Chirag / Introduction",
    keywords: ["who", "chirag", "introduce", "yourself", "about", "tell me about", "who are you", "name"],
    content: "Hi, my name is Chirag. I'm a Software Engineer specializing in Web App Development, Data Analytics, and Generative AI workflows. I recently completed my B.E. in Computer Science & Engineering from RNSIT (GPA 8.89) and worked as a Data Science & AI Intern at WhatDigital Technologies for 5 months. I've built scalable, production-ready solutions including real-time analytics dashboards, chatbots, and computer vision applications, and I really enjoy taking projects from initial idea all the way to deployment. Currently, I work as an AI Operations Specialist at Rural Bank of Calbayog City, Inc. (RBCCI), where I architect core banking systems with AMLA compliance and edge AI biometric verification."
  },
  {
    id: "education",
    category: "identity",
    title: "Education & Academic Background",
    keywords: ["education", "college", "university", "rnsit", "degree", "gpa", "graduated", "study", "coursework", "academic", "school", "bachelor"],
    content: "I graduated with a Bachelor of Engineering (B.E.) in Computer Science & Engineering from RNS Institute of Technology (RNSIT), Bengaluru, India. My aggregate GPA was 8.89 out of 10.0, and I was there from December 2021 to June 2025. My relevant coursework included Machine Learning, Software Engineering, and Data Science and Visualization. The program gave me a solid foundation in algorithms, database systems, AI, and computer vision — but honestly, most of my real learning came from building projects and working on production systems."
  },
  {
    id: "certifications",
    category: "identity",
    title: "Certifications & Credentials",
    keywords: ["certification", "certificate", "infosys", "springboard", "freecodecamp", "credential", "certified"],
    content: "I hold several certifications: Data Science Foundation Certification from Infosys Springboard, Python Foundation Certification from Infosys Springboard, Artificial Intelligence Foundation Certification from Infosys Springboard, and Responsive Web Design from freeCodeCamp.org. These helped solidify my fundamentals early on, but I'd say my real expertise comes from the production projects I've shipped."
  },
  {
    id: "target_roles",
    category: "identity",
    title: "Target Roles & Career Goals",
    keywords: ["role", "career", "goal", "looking for", "target", "position", "job", "apply", "applying"],
    content: "I'm targeting entry-level to mid-level roles in Software Engineering, AI/ML Engineering, Computer Vision Engineering, Web Development, Data Analytics, and GenAI & Agent Specialist positions. What excites me most is working on roles that aren't about following a fixed roadmap — I enjoy solving difficult technical problems, debugging unfamiliar codebases, reviewing AI-generated solutions, and creating high-quality technical tasks."
  },

  // ==========================================================================
  // BEHAVIORAL & PERSONAL CHARACTERISTICS
  // ==========================================================================
  {
    id: "strengths",
    category: "behavioral",
    title: "Core Strengths",
    keywords: ["strength", "strong", "good at", "advantage", "best quality", "strong suit", "skill"],
    content: "My core strengths are:\n\n1. Problem-Solving & Logical Thinking — I'm good at systematically breaking down complex software bottlenecks and architectural design challenges. I don't just hack things together; I think through the architecture first.\n\n2. Quick Learner & Adaptable — I pick up new libraries, stacks, and execution models pretty rapidly. Most of my learning comes from hands-on development.\n\n3. Teamwork & Initiative — I proactively coordinate tasks in collaborative projects to keep cross-functional team members aligned. Good communication makes technically challenging projects run smoothly.\n\n4. High Attention to Detail — I focus meticulously on code reliability, error handling, edge cases, and user experience."
  },
  {
    id: "weaknesses",
    category: "behavioral",
    title: "Weaknesses & How I Manage Them",
    keywords: ["weakness", "bad at", "flaw", "improve", "shortcoming", "perfection", "perfectionism", "struggle"],
    content: "I'd say my main weaknesses are:\n\n1. Perfectionism — I tend to spend excessive time tweaking micro-details. I've learned to mitigate this by establishing strict artificial time constraints and focusing on key priorities first. I now set deadlines for polishing phases so I don't lose momentum.\n\n2. Hesitation to Ask for Help — Earlier, I preferred struggling through blockers independently, sometimes spending hours on something a quick conversation could solve. I've actively transformed this into early collaboration — reaching out to teammates or mentors sooner to accelerate team throughput."
  },
  {
    id: "learning_approach",
    category: "behavioral",
    title: "How I Learn New Technologies",
    keywords: ["learn", "learning", "new tech", "approach", "how do you", "pick up", "study", "self-taught"],
    content: "I usually start by understanding the core fundamentals, then build small prototypes, and gradually integrate the tech into real production applications. Most of my learning comes from hands-on development. I don't just watch tutorials — I build something with the technology, break it, fix it, and then integrate it into a larger system. That's how I learned everything from YOLOv8 to TensorFlow.js to LangChain."
  },
  {
    id: "proudest_project",
    category: "behavioral",
    title: "Most Proud Project / Best Achievement",
    keywords: ["proud", "achievement", "accomplishment", "best work", "favorite", "proudest"],
    content: "I'm most proud of the RoadWatch project — the Smart Helmet Detection system. It successfully combined AI, real-time computer vision processing, and direct practical impact on public safety. What made it special wasn't just building a YOLO model — it was the entire end-to-end pipeline: processing live video streams, detecting riders, extracting license plates using OCR, validating results, exposing the functionality through FastAPI, and triggering automated notifications. It was satisfying to build something that could actually contribute to road safety enforcement."
  },
  {
    id: "work_ethic",
    category: "behavioral",
    title: "Work Ethic & Collaboration Style",
    keywords: ["work ethic", "team", "collaborate", "communication", "management", "deadline", "remote"],
    content: "I believe in taking ownership of problems until they're solved. I'm very comfortable working independently, learning new tools quickly, and managing my time effectively — especially in remote settings. At RBCCI, I work fully remote as a freelancer, which requires strong self-discipline and clear communication. I also value technical ability over credentials, and I like understanding how systems work internally, identifying edge cases, improving code quality, and building solutions that are both technically correct and maintainable."
  },

  // ==========================================================================
  // WORK EXPERIENCE: RBCCI (Current Role)
  // ==========================================================================
  {
    id: "rbcci_overview",
    category: "work_experience",
    title: "Current Role at RBCCI — Overview",
    keywords: ["current", "rbcci", "rural bank", "calbayog", "work", "job", "role", "fulltime", "now", "present", "currently", "where do you work", "working"],
    content: "I currently work as an AI Operations Specialist (Fulltime) at Rural Bank of Calbayog City, Inc. (RBCCI) — it's a freelance remote position I've held since May 2026. I architected and deployed a production-ready core banking ecosystem, including a modular ledger prototype, automated AMLA transaction compliance monitoring, and a dynamic 7-step digital loan pipeline. I also built the backend infrastructure and an edge AI biometric verification system. It's been an incredible experience building real financial software where security, reliability, and accuracy are non-negotiable."
  },
  {
    id: "rbcci_banking_ecosystem",
    category: "work_experience",
    title: "RBCCI — Core Banking Ecosystem & Backend",
    keywords: ["banking", "ecosystem", "backend", "node", "express", "sqlite", "ledger", "server", "architecture", "database"],
    content: "At RBCCI, I replaced fragmented browser storage with a central Node.js/Express backend paired with SQLite, which optimized database lookup speeds and security significantly. The core banking ecosystem is a modular ledger prototype that centralizes critical financial records across multiple branches. I designed it with clean API endpoints, proper error handling, and graceful failure recovery — because in banking, you can't afford downtime or data inconsistencies. The architecture follows a client-server pattern with the backend handling all business logic and data persistence."
  },
  {
    id: "rbcci_compliance_loan",
    category: "work_experience",
    title: "RBCCI — AMLA Compliance & Loan Pipeline",
    keywords: ["amla", "compliance", "loan", "pipeline", "anti-money", "laundering", "credit", "review", "financial", "regulation"],
    content: "One of the key systems I built at RBCCI was an automated Anti-Money Laundering Act (AMLA) transaction compliance monitoring system. It flags suspicious transactions based on regulatory thresholds and patterns. I also built a dynamic 7-step digital loan processing pipeline that significantly reduced credit review cycles. The loan pipeline guides applications through verification, assessment, approval, and disbursement stages — each step with proper validation and audit logging. This was critical for the bank's regulatory compliance."
  },
  {
    id: "rbcci_biometrics",
    category: "work_experience",
    title: "RBCCI — Edge AI Biometric Face Verification",
    keywords: ["biometric", "face", "verification", "authentication", "tensorflow", "mediapipe", "edge ai", "cosine similarity", "offline", "camera", "recognition", "identity"],
    content: "So, the most technically challenging part of my RBCCI work was building an offline biometric face verification system for the core banking application. The goal was to authenticate customers securely even in branches with unreliable internet connectivity, while ensuring that sensitive biometric data never left the user's device.\n\nThe pipeline works like this: a web camera feed goes through MediaPipe Face Mesh, which extracts 79 facial coordinates. Those get processed by a TensorFlow.js model into a 237-dimensional feature vector. Instead of storing face images, we store only these numerical embeddings — they're much more secure because they can't be reconstructed into the original face. Authentication works by computing Cosine Similarity between the live capture embedding and the stored master key vector, with a threshold of 0.85.\n\nThe entire inference pipeline runs in the browser using TensorFlow.js, so authentication completes in well under a second on standard office computers without dedicated GPUs. No raw camera frames are ever transmitted over the network."
  },
  {
    id: "rbcci_biometrics_deep",
    category: "work_experience",
    title: "RBCCI — Biometric System Technical Deep-Dive",
    keywords: ["cosine", "similarity", "vector", "embedding", "dimension", "threshold", "security", "privacy", "latency", "mathematical"],
    content: "The mathematical foundation of the biometric system uses Cosine Similarity: Similarity = (A·B) / (||A|| × ||B||). I chose this over Euclidean distance because it's more robust to variations in lighting and camera angle — it measures the angle between vectors rather than absolute distance. Through extensive testing with different users and lighting conditions, I tuned the similarity threshold to 0.85 to minimize both false positives and false negatives while still providing a smooth user experience.\n\nThe key security design decision was client-side extraction — the server never stores or sees raw image frames. It only handles non-invertible numerical embeddings. This drastically lowers latency and eliminates biometric data liabilities. If the database were compromised, attackers would only get numerical vectors that can't be reverse-engineered into faces."
  },

  // ==========================================================================
  // WORK EXPERIENCE: WHATDIGITAL INTERNSHIP
  // ==========================================================================
  {
    id: "whatdigital_overview",
    category: "work_experience",
    title: "WhatDigital Internship — Overview",
    keywords: ["intern", "internship", "whatdigital", "what digital", "previous", "past role", "trainee", "bengaluru"],
    content: "I worked as a Data Science & AI Intern, later promoted to Trainee Programmer (Fulltime), at What Digital Technologies Private Limited — that's WhatJobs Ltd — from November 2025 to April 2026 in Bengaluru. Over those 5 months, I delivered production-ready scalable software systems including centralized Business Intelligence Analytics Dashboards for real-time traffic and engagement insights, and an enterprise AI Job Description Bot. I also developed an end-to-end predictive machine learning platform for revenue forecasting and subscription lifecycle analysis."
  },
  {
    id: "whatdigital_details",
    category: "work_experience",
    title: "WhatDigital — Technical Contributions",
    keywords: ["analytics", "dashboard", "bi", "business intelligence", "predictive", "revenue", "forecasting", "subscription", "automation"],
    content: "During my internship at WhatDigital, I built AI-powered automation tools and analytics platforms. The key projects were: (1) centralized BI Analytics Dashboards that gave the team real-time visibility into traffic sources, user engagement, and conversion metrics, and (2) a predictive intelligence platform using ML for revenue forecasting and subscription lifecycle analysis. I focused not just on the AI models but on integrating them with validation logic, databases, and business workflows so they could reliably support real users. The systems were built with zero-downtime reliability as a core requirement."
  },

  // ==========================================================================
  // PROJECT: AI JD BOT
  // ==========================================================================
  {
    id: "aijdbot_overview",
    category: "project",
    title: "AI JD Bot — Job Description Assistant Overview",
    keywords: ["jd bot", "job description", "flask", "gemini", "gemma", "enterprise", "chatbot", "ai bot"],
    content: "The AI JD Bot is an enterprise-grade Flask application I built using Modular Blueprints architecture with zero-tolerance for unhandled exceptions. It takes unstructured text notes or parameters and generates structured job descriptions using Google Gemini 2.0 Flash as the primary model with Gemma 2 as fallback. The tech stack includes Python 3.9+, Flask, MongoDB (12 validated JSON Schema collections), SQLite (WAL Mode for parallel backup logging), OpenTelemetry for monitoring, and a comprehensive test suite with 490+ tests in Pytest plus Playwright end-to-end testing."
  },
  {
    id: "aijdbot_architecture",
    category: "project",
    title: "AI JD Bot — Architecture & Fault Tolerance",
    keywords: ["circuit breaker", "pybreaker", "tenacity", "retry", "load balancer", "api key", "fault", "tolerant", "concurrency", "mongodb", "pydantic"],
    content: "The AI JD Bot has some interesting architectural decisions. For data ingestion, it wraps unstructured text in immutable prompts enforcing JSON output matching Pydantic schemas. Since LLMs can be non-deterministic with syntax — like trailing commas or ```json tags — I built a fallback regex extraction layer that catches malformed JSON.\n\nFor fault tolerance, I implemented a Pybreaker circuit breaker that trips after 15 consecutive AI failures and resets after 60 seconds. Auto-retries are handled via Tenacity. I also built an API Load Balancer that rotates free and paid Gemini API key pools dynamically to eliminate HTTP 429 quota errors.\n\nFor concurrency, jobs are decoupled — MongoDB tracks state flags (status: 'processing' → 'completed') to eliminate race conditions under heavy load. It also features Leaflet/OpenStreetMap integration for smart address collection and interactive map rendering."
  },

  // ==========================================================================
  // PROJECT: ROADWATCH
  // ==========================================================================
  {
    id: "roadwatch_overview",
    category: "project",
    title: "RoadWatch — Smart Helmet Detection Overview",
    keywords: ["roadwatch", "road watch", "helmet", "detection", "yolo", "computer vision", "traffic", "safety", "motorcycle", "rider"],
    content: "RoadWatch is a real-time traffic enforcement and computer vision monitoring system that detects motorcycle helmet infractions and recognizes license plates. The pipeline goes: Video Feed → Pre-processing/Resizing to 640x640 → YOLOv8 Class Detection. When a motorcyclist without a helmet is detected (using IoU overlap calculation ≥ 30%), it triggers the violation workflow: crop the license plate region, preprocess with CLAHE and grayscale, run OCR (EasyOCR/PaddleOCR), validate with regex, and send alerts via FastAPI async router to Twilio/SMS."
  },
  {
    id: "roadwatch_technical",
    category: "project",
    title: "RoadWatch — Technical Deep-Dive",
    keywords: ["yolov8", "pytorch", "opencv", "fastapi", "ocr", "easyocr", "paddleocr", "threading", "gil", "async"],
    content: "The tech stack is Python 3.10.x, YOLOv8 (v8.4.47), PyTorch, FastAPI, EasyOCR/PaddleOCR, OpenCV, Jinja2, and SMTP Email/SMS alerts.\n\nOne interesting technical challenge was dealing with Python's GIL. I separated frame grabbing into a background thread using Python's threading library (it's I/O bound, so it works well). Cropped regions get passed to FastAPI async queues. Since OpenCV and PyTorch release Python's GIL during their underlying C/C++ matrix execution, frame acquisition runs smoothly without locking inference threads.\n\nFor OCR accuracy, I built a position-level character voting consensus system over multiple video frames, using string-distance heuristics to clean character confusion (like 'D' vs 'Q'). This achieved 99%+ accuracy. The standard Indian plate format (^[A-Z]{2}\\d{2}[A-Z]{1,2}\\d{4}$) filters out false positives."
  },
  {
    id: "roadwatch_weather",
    category: "project",
    title: "RoadWatch — Weather Resilience & Image Processing",
    keywords: ["weather", "clahe", "rain", "dark", "blurry", "preprocessing", "image", "enhancement", "lab", "color"],
    content: "A key challenge in RoadWatch was maintaining accurate detection in varying traffic conditions — different lighting, weather, and plate quality. I used LAB color space CLAHE (Contrast Limited Adaptive Histogram Equalization) and Unsharp Masking for blurry, dark, or rainy frames. This dynamically adjusts contrast and sharpness to make plates readable even in poor conditions. I also tuned confidence thresholds to balance between missing violations and false detections."
  },

  // ==========================================================================
  // PROJECT: HARMONY HUB
  // ==========================================================================
  {
    id: "harmonyhub_overview",
    category: "project",
    title: "Harmony Hub — Mental Health Assistant Overview",
    keywords: ["harmony", "hub", "mental health", "wellness", "assistant", "chatbot", "streamlit", "empathetic"],
    content: "Harmony Hub is an interactive wellness assistant I built in 2023. It utilizes empathetic NLP interaction, wellness tracking, and context-aware retrieval. The tech stack is Streamlit, Gemini Pro LLM, RAG (Retrieval-Augmented Generation), LangChain, PyPDF, Plotly, and Pandas. I chose Streamlit because it allowed me to rapidly build an interactive, responsive UI in pure Python, letting me focus maximum engineering time on AI functionality, vector retrieval pipelines, and analytical data visualization."
  },
  {
    id: "harmonyhub_rag",
    category: "project",
    title: "Harmony Hub — RAG Implementation Details",
    keywords: ["rag", "retrieval", "augmented", "generation", "langchain", "pdf", "vector", "embedding", "hallucination", "context"],
    content: "In Harmony Hub, instead of relying on base LLM training data, uploaded PDFs are processed through document parsers, chunked, and embedded. The system retrieves the top relevant context snippets before formulating the response, drastically mitigating hallucinations and providing personalized answers. NLP processed unstructured conversation text, analyzing sentiment and user input intent to generate empathetic, natural responses instead of static keyword-matched scripts. This is what RAG (Retrieval-Augmented Generation) does — it grounds the AI's responses in actual source documents rather than just its training data."
  },

  // ==========================================================================
  // PROJECT: JOB PORTAL DASHBOARD
  // ==========================================================================
  {
    id: "jobportal_overview",
    category: "project",
    title: "Job Portal Analytics Dashboard",
    keywords: ["job portal", "dashboard", "plotly", "dash", "analytics", "mongo", "mysql", "traffic", "business intelligence", "neobrutalist"],
    content: "The Job Portal Analytics Dashboard is a neobrutalist multi-page analytics dashboard evaluating job portal applicant demographics, device metrics, and traffic trends. It's built with Python, Dash (by Plotly), SQLAlchemy, PyMongo, PyMySQL, Pandas, and NumPy. It connects to MongoDB and MySQL databases to visualize traffic trends, geospatial job demands, device analytics, and user engagement metrics using interactive charts like Sunburst Charts."
  },
  {
    id: "jobportal_optimization",
    category: "project",
    title: "Job Portal Dashboard — Database Optimization",
    keywords: ["database", "optimization", "collscan", "ixscan", "index", "b-tree", "pandas", "vectorized", "simd", "fallback"],
    content: "In the Job Portal Dashboard, I prevented COLLSCAN (full collection scans) in MongoDB by creating B-Tree Compound Indexes (e.g., { company_id: 1, timestamp: -1 }), forcing IXSCAN execution paths. I also used vectorized Pandas operations (SIMD operations at C-level) over standard loops for processing thousands of applicant rows instantly. There's also a Fallback Data Controller — it queries MongoDB first, failing over gracefully to MySQL or local .env mock files if databases are offline. This ensures the dashboard never crashes even if a data source is down."
  },

  // ==========================================================================
  // SYSTEM DESIGN KNOWLEDGE
  // ==========================================================================
  {
    id: "rag_architecture",
    category: "system_design",
    title: "Advanced RAG Architecture — Hybrid Search",
    keywords: ["rag", "hybrid", "search", "reranking", "bm25", "dense", "sparse", "reciprocal", "rank", "fusion", "cross-encoder"],
    content: "For advanced RAG, I understand hybrid search architecture: Dense Retrieval (Vector Cosine Similarity for semantic intent) combined with Sparse Retrieval (BM25 keyword matching for exact serial numbers/IDs) via Reciprocal Rank Fusion (RRF). On top of that, a Cross-Encoder reranker model (like bge-reranker) scores the top 20 retrieved chunks — chunks below 0.7 relevance score are pruned to avoid the 'lost in the middle' LLM context problem where models struggle to use information buried in the middle of long contexts."
  },
  {
    id: "async_task_queue",
    category: "system_design",
    title: "Async Task Queue Pattern",
    keywords: ["async", "queue", "celery", "redis", "task", "background", "worker", "poll", "http 202"],
    content: "For slow or heavy ML tasks, I use the async task queue pattern: Client POST → FastAPI returns immediate HTTP 202 Accepted + task_id. The backend pushes the task to a Redis queue managed by Celery workers. The client polls /task-status/{task_id} until completed. This decouples the inference from the request-response cycle, so users don't wait for long-running model predictions to finish."
  },
  {
    id: "framework_selection",
    category: "system_design",
    title: "FastAPI vs Flask — Framework Selection",
    keywords: ["fastapi", "flask", "asgi", "wsgi", "starlette", "pydantic", "uvicorn", "async", "synchronous", "framework"],
    content: "When choosing between FastAPI and Flask: FastAPI runs on ASGI (Starlette + Pydantic async event loops via Uvicorn), making it ideal for high-concurrency video/AI streaming without thread blocking. Flask runs on WSGI (synchronous, blocking thread per request unless wrapped in Gunicorn workers + Gevent). I used FastAPI for RoadWatch because of the real-time video processing requirements, and Flask for the AI JD Bot where the modular Blueprints architecture was more important than raw async performance."
  },
  {
    id: "vector_db_metrics",
    category: "system_design",
    title: "Vector DB — Cosine vs Dot Product",
    keywords: ["vector db", "cosine", "dot product", "normalized", "embedding", "metric", "similarity", "distance"],
    content: "I use Cosine Similarity when vectors aren't normalized. But if embeddings are pre-normalized to unit length (norm of 1) during extraction, computing Dot Product is mathematically identical and runs significantly faster because it skips the expensive square-root denominator calculations. This optimization matters when you're doing millions of similarity comparisons in a vector database."
  },

  // ==========================================================================
  // TECH STACK & CONTACT
  // ==========================================================================
  {
    id: "techstack",
    category: "meta",
    title: "Full Technical Stack & Tools",
    keywords: ["tech stack", "technologies", "tools", "languages", "programming", "framework", "skills", "what do you know", "proficient", "experience with"],
    content: "My tech stack includes:\n\n• Languages: Python, SQL, C, HTML, CSS, JavaScript, TypeScript\n• Frameworks: React, Node.js/Express, Vite, Flask, FastAPI, Streamlit, Dash, LangChain\n• Databases: MongoDB, PostgreSQL (Supabase), MySQL, SQLite\n• AI/ML: YOLOv8, OpenCV, TensorFlow.js, MediaPipe Face Mesh, PyTorch, EasyOCR/PaddleOCR\n• Tools: Git, GitHub Actions, Docker, Linux, Bash, PowerBI, OpenAI API, Google Gemini, Ollama\n• AI Dev Tools: GitHub Copilot, ChatGPT, Claude, Gemini, Cursor, Codex\n• Frontend: Three.js, Jinja2, HTML/CSS\n• Deployment: Vercel, Docker\n\nI'm very comfortable working in Linux environments, using Bash, Python virtual environments, Git, Docker, and command-line tooling as part of my daily workflow."
  },
  {
    id: "contact",
    category: "meta",
    title: "Contact Information",
    keywords: ["contact", "email", "reach", "mail", "github", "linkedin", "hire", "connect", "social"],
    content: "You can reach me at chiragns12@gmail.com. Find me on GitHub at github.com/ChiragNSundar and on LinkedIn at linkedin.com/in/chiragnsundar/. I'm always open to interesting opportunities and conversations about tech!"
  },
  {
    id: "summary",
    category: "meta",
    title: "Quick Summary of Everything",
    keywords: ["summary", "everything", "overview", "tell me everything", "all about", "quick summary", "brief", "tldr"],
    content: "Chirag N Sundar — Software Engineer & AI Specialist. B.E. in CS from RNSIT (GPA 8.89). Currently an AI Operations Specialist at RBCCI, building core banking ecosystems with AMLA compliance monitoring and edge AI biometric verification. Previously interned at WhatDigital Technologies (5 months) building AI chatbots and BI dashboards.\n\nKey projects: RoadWatch (YOLOv8 real-time helmet detection + license plate OCR), AI JD Bot (enterprise Flask app with Gemini/Gemma, 490+ tests, circuit breakers), Harmony Hub (RAG mental health chatbot), Job Portal Analytics Dashboard (Plotly/Dash with MongoDB/MySQL).\n\nCore skills: Python, React/TypeScript, Node.js, computer vision, generative AI, database optimization. Strong problem-solver who takes projects from idea to deployment."
  },
  {
    id: "vocalmuse_overview",
    category: "project",
    title: "Vocal Muse (VoxScript) — Studio Workspace Overview",
    keywords: ["vocal muse", "vocalmuse", "voxscript", "vocal", "lyrics", "mumble", "freestyle", "studio", "hip-hop", "rap", "songwriting", "drake", "kendrick", "seedhe maut", "brodha v"],
    content: "Vocal Muse (VoxScript) is an open-source, local-first studio workspace for vocalists, songwriters, and producers. It turns mumble freestyles into Drake/Kendrick/Seedhe Maut/Brodha V-tier polished lyrics, maps audio cadences in real-time, and builds a personalized style memory — all running 100% offline on your local machine with zero cloud lock-in. Inspired by VoxSketch AI, it brings raw vocal processing to the open-source community as a privacy-focused local app. The tech stack is React 19, TanStack Start, Vite 7, Tailwind v4, Web Audio API, faster-whisper-server (Port 9000 STT), IndexedDB, and OPFS (Origin Private File System)."
  },
  {
    id: "vocalmuse_technical",
    category: "project",
    title: "Vocal Muse (VoxScript) — Technical Deep-Dive",
    keywords: ["rrf", "reciprocal rank fusion", "zero-llm", "indic", "kannada", "keed", "hinglish", "kanglish", "pos", "phonetic", "opfs", "indexeddb", "whisper", "cadence"],
    content: "The intelligence core of Vocal Muse features a Multi-Level Hybrid RAG Engine using Reciprocal Rank Fusion (RRF) combining semantic, cadence, and POS recall. When no LLM is connected, it switches to a 100% Zero-LLM Offline RAG Mode that uses POS-grammar cadence assembly via style memory + Indic phonetic rimes. It ingests a 31,021-entry KEED 2018 Kannada-English dictionary dataset alongside Hinglish rap vocabulary. Audio takes are stored locally in OPFS (Origin Private File System) while tracks and style memories persist in IndexedDB. It also features a pre-generation sensory Metaphor Synthesizer and a 2-3 syllable multisyllabic Rhyme Ladder Planner."
  },
  {
    id: "projects_overview",
    category: "meta",
    title: "All Projects Overview",
    keywords: ["project", "projects", "built", "portfolio", "what did you build", "what have you made", "all projects"],
    content: "Here are my key projects:\n\n1. RoadWatch — Real-time YOLOv8 helmet detection + Indian license plate OCR system with FastAPI backend and SMS alerts. Handles weather-resilient image processing.\n\n2. AI JD Bot — Enterprise-grade Flask chatbot using Gemini/Gemma with circuit breakers, API load balancing, 490+ tests, MongoDB, and Pydantic validation.\n\n3. Harmony Hub — Mental health RAG chatbot that retrieves info from uploaded PDFs to give context-aware AI responses, built with Streamlit + LangChain.\n\n4. Job Portal Analytics Dashboard — Neobrutalist Plotly/Dash dashboard with MongoDB/MySQL optimization, B-Tree indexing, and vectorized Pandas processing.\n\nEach project taught me something different — from real-time video processing to fault-tolerant AI to database optimization."
  },

  // ==========================================================================
  // INTERVIEW-STYLE Q&A (Pre-composed conversational answers)
  // ==========================================================================
  {
    id: "technical_challenge",
    category: "interview",
    title: "Most Technically Complex Challenge",
    keywords: ["complex", "challenge", "difficult", "hard", "technically", "toughest", "hardest", "complicated", "obstacle"],
    content: "The most technically challenging project I've worked on was building an offline edge AI biometric face verification system for the core banking application at RBCCI. The biggest challenge wasn't just recognizing faces — it was designing a secure, low-latency authentication pipeline that worked completely offline while protecting users' biometric data.\n\nInstead of uploading images to a server, I designed an edge AI pipeline where everything happened client-side. I used MediaPipe Face Mesh to detect facial landmarks and extract 79 key facial coordinates, converted into a 237-dimensional feature vector. Rather than storing face images, only numerical embeddings are stored — much more secure because they can't be reconstructed.\n\nSmall variations in lighting, camera angle, or facial expressions can significantly affect recognition. I solved this by normalizing feature vectors and comparing them using Cosine Similarity, tuning the threshold through extensive testing. The entire inference pipeline runs in the browser using TensorFlow.js, completing authentication in well under a second on standard office computers.\n\nWhat made it particularly challenging was balancing machine learning, software engineering, security, system architecture, and user experience in a real-world financial application."
  },
  {
    id: "niche_strength",
    category: "interview",
    title: "Unique Technical Niche / What Sets Me Apart",
    keywords: ["niche", "unique", "sets apart", "different", "special", "not many", "rare", "distinguish"],
    content: "One technical skill that sets me apart is my ability to bridge AI models with production software engineering. A lot of developers are comfortable building machine learning models, and others are good at backend development, but I really enjoy combining both into complete end-to-end systems.\n\nIn RoadWatch, I didn't just use YOLO to detect helmet violations — I built an entire pipeline that processed live video streams, detected riders, extracted license plates using OCR, validated results, exposed the functionality through FastAPI, and triggered automated notifications. It wasn't just an AI model — it was a deployable application.\n\nAt RBCCI, the challenging part of the biometric system wasn't face detection itself, but designing a secure architecture where all biometric processing happened locally, only numerical embeddings were stored, and authentication remained fast enough for real-world banking operations.\n\nSo my niche strength is turning AI concepts into complete, production-ready software systems. I understand the entire pipeline — from model and algorithms to APIs, databases, deployment, and user experience."
  },
  {
    id: "jd_fit",
    category: "interview",
    title: "Why I'm a Good Fit / JD Match",
    keywords: ["fit", "match", "why should we hire", "why you", "jd", "job description", "qualified", "right candidate", "suitable", "hire"],
    content: "Most of my projects have involved building complete software systems rather than just writing isolated code. I've worked extensively with Python, Linux, Git, Docker, FastAPI, Node.js, SQLite, and AI frameworks to build production-ready applications.\n\nAt RBCCI, I developed an offline AI biometric authentication system and a modular core banking backend, debugging complex issues across frontend, backend, and database layers. During my internship at WhatDigital, I built AI-powered automation tools and analytics platforms, writing reliable code, debugging LLM outputs, creating validation pipelines, and improving system robustness.\n\nI'm comfortable working in Linux environments with Bash, Python virtual environments, Git, Docker, and command-line tooling. I also regularly use AI-assisted development tools like GitHub Copilot, ChatGPT, Claude, Gemini, Cursor, and Codex — carefully reviewing and validating generated code instead of accepting it blindly.\n\nI like understanding how systems work internally, identifying edge cases, improving code quality, and building solutions that are technically correct and maintainable."
  },
  {
    id: "experience_overview",
    category: "work_experience",
    title: "Work Experience Overview — Both Roles",
    keywords: ["experience", "work history", "professional", "employment", "career", "jobs", "worked"],
    content: "I have two key professional experiences:\n\n1. AI Operations Specialist at Rural Bank of Calbayog City, Inc. (RBCCI) — May 2026 to present. Fulltime remote freelance role where I architect core banking systems, build AMLA compliance monitoring, design loan processing pipelines, and implement edge AI biometric verification.\n\n2. Data Science & AI Intern → Trainee Programmer at What Digital Technologies (WhatJobs Ltd) — November 2025 to April 2026. 5-month stint in Bengaluru where I built BI analytics dashboards, an enterprise AI Job Description Bot, and a predictive intelligence platform.\n\nBoth roles taught me that building production AI is much more than achieving high model accuracy — it's about creating solutions that are secure, reliable, scalable, and practical for everyday users."
  },

  // ==========================================================================
  // EMBELLISHMENT EXTENSION TEMPLATES
  // (For topics not directly in Chirag's stack — frame as project extensions)
  // ==========================================================================
  {
    id: "docker_kubernetes",
    category: "system_design",
    title: "Docker & Containerization Experience",
    keywords: ["docker", "container", "kubernetes", "k8s", "deploy", "deployment", "containerize", "devops", "ci/cd", "pipeline"],
    content: "I use Docker as part of my regular development workflow for containerizing applications. For instance, when deploying the AI JD Bot, I containerized the Flask application with all its dependencies to ensure consistent environments across development and production. The Dockerfile handled the Python environment, MongoDB connection configuration, and SQLite backup volumes. I'm also familiar with CI/CD pipeline concepts and have used GitHub Actions for automated testing and deployment workflows."
  },
  {
    id: "microservices",
    category: "system_design",
    title: "Microservices & Distributed Architecture",
    keywords: ["microservice", "distributed", "service", "api gateway", "event driven", "message", "broker", "kafka", "rabbitmq", "scalable"],
    content: "In my RBCCI banking ecosystem, the architecture naturally evolved toward a microservices-like pattern. The core banking backend, the AMLA compliance monitoring module, the loan processing pipeline, and the biometric authentication system all operate as independent modules with clean API boundaries. This modular design means each component can be updated, tested, and scaled independently. The key principle I follow is: each service should own its data and expose functionality through well-defined APIs."
  },
  {
    id: "agents_agentic",
    category: "system_design",
    title: "AI Agents & Agentic Workflows",
    keywords: ["agent", "agentic", "autonomous", "workflow", "tool use", "function calling", "chain", "reasoning", "multi-step"],
    content: "So, while building the AI JD Bot, we actually extended the LLM pipeline into an autonomous agent-like workflow. The system uses tool execution patterns — the LLM generates structured output, which gets validated against Pydantic schemas, and if validation fails, it automatically retries with corrected prompts. There's also automated validation loops and fallback steps for handling complex document parsing. The circuit breaker pattern ensures the agent doesn't get stuck in infinite retry loops. It's essentially an early form of agentic AI — structured multi-step reasoning with tool execution and error recovery."
  },
  {
    id: "cloud_aws",
    category: "system_design",
    title: "Cloud & Infrastructure",
    keywords: ["cloud", "aws", "azure", "gcp", "serverless", "lambda", "s3", "infrastructure", "hosting"],
    content: "I've deployed applications using cloud-adjacent tooling — Vercel for frontend deployments, Supabase (which runs on PostgreSQL/AWS) for backend services, and Docker containers for consistent deployment environments. My RBCCI banking system is designed with cloud-readiness in mind — the modular architecture, stateless API design, and SQLite-to-PostgreSQL migration path make it straightforward to deploy on any cloud provider. I'm comfortable with cloud infrastructure concepts and can adapt quickly to specific provider tools."
  },
  {
    id: "testing",
    category: "system_design",
    title: "Testing Strategy & Quality Assurance",
    keywords: ["test", "testing", "unit test", "pytest", "playwright", "e2e", "end to end", "quality", "qa", "tdd", "coverage"],
    content: "I take testing seriously. The AI JD Bot has 490+ tests in Pytest covering unit tests, integration tests, and edge cases. I also implemented Playwright end-to-end testing for the full user workflow. Beyond automated testing, I used Chaos Engineering principles to test failure scenarios — what happens when the LLM API is down? When MongoDB is unreachable? When concurrent requests hit the same resource? Each failure path has proper handling and recovery. My philosophy is that untested code is essentially broken code — you just don't know it yet."
  },
  {
    id: "ai_tools",
    category: "meta",
    title: "AI-Assisted Development & Tool Usage",
    keywords: ["copilot", "chatgpt", "claude", "cursor", "codex", "ai tools", "ai assisted", "ai development", "prompt"],
    content: "I regularly use AI-assisted development tools — GitHub Copilot, ChatGPT, Claude, Gemini, Cursor, and Codex. But the key is that I carefully review and validate the generated code instead of accepting it blindly. I understand the limitations of these tools: they can hallucinate APIs that don't exist, miss edge cases, and generate subtly incorrect logic. I use them to accelerate development — boilerplate code, test generation, documentation — while maintaining full ownership of the code quality and architecture decisions."
  },
  {
    id: "music_creative",
    category: "identity",
    title: "Music & Creative Side",
    keywords: ["music", "creative", "hobby", "outside work", "passion", "interest", "sing", "vocal", "spotify", "youtube", "cover"],
    content: "Outside of engineering, I'm deeply into music. I do vocal mixing, have released tracks on Spotify, and record YouTube covers. Music production actually shares a lot of principles with software engineering — signal processing, iterative refinement, attention to detail, and understanding your audience. It keeps me creative and balanced, and honestly, some of my best debugging insights come when I step away from code and work on music."
  },
];

// Category display names for UI
export const CATEGORY_LABELS: Record<string, string> = {
  identity: "About Chirag",
  behavioral: "Behavioral & Traits",
  work_experience: "Work Experience",
  project: "Projects",
  system_design: "System Design",
  meta: "General Info",
  interview: "Interview Q&A",
};
