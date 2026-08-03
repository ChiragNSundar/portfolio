export const downloadSoftwareEngineerResume = () => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chirag_N_Sundar_Software_Engineer_Resume</title>
  <style>
    @page {
      margin: 10mm 14mm;
      size: letter;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      color: #000000;
      background: #ffffff;
      padding: 10px 20px;
      line-height: 1.35;
      font-size: 10.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .resume-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header Styling matching LaTeX template */
    .header {
      text-align: center;
      margin-bottom: 12px;
    }

    .header h1 {
      font-size: 24pt;
      font-weight: normal;
      font-family: 'Times New Roman', Times, serif;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      color: #000000;
    }

    .contact-line {
      font-size: 9.5pt;
      color: #000000;
      margin-top: 2px;
    }

    .contact-line a {
      color: #000000;
      text-decoration: underline;
    }

    /* Section Headers */
    .section {
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      margin-bottom: 6px;
      color: #000000;
    }

    .summary-text {
      font-size: 10pt;
      text-align: justify;
      color: #000000;
    }

    /* Entry Row (Experience, Education, Projects) */
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10.5pt;
      font-weight: bold;
    }

    .entry-subheader {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10pt;
      font-style: italic;
      margin-bottom: 3px;
    }

    ul.bullets {
      padding-left: 18px;
      margin-top: 2px;
      margin-bottom: 6px;
    }

    ul.bullets li {
      font-size: 9.8pt;
      margin-bottom: 2px;
      text-align: justify;
      color: #000000;
    }

    ul.bullets li strong {
      font-weight: bold;
    }

    .skills-block {
      font-size: 9.8pt;
      line-height: 1.4;
    }

    .skills-row {
      margin-bottom: 2px;
    }

    .skills-row strong {
      font-weight: bold;
    }

    .cert-list {
      padding-left: 18px;
      margin-top: 2px;
    }

    .cert-list li {
      font-size: 9.8pt;
      margin-bottom: 2px;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    
    <!-- HEADER -->
    <div class="header">
      <h1>Chirag N Sundar</h1>
      <div class="contact-line">
        ✉ <a href="mailto:chiragns12@gmail.com">chiragns12@gmail.com</a> &nbsp;|&nbsp; 
        🌐 <a href="https://linkedin.com/in/chiragnsundar" target="_blank">linkedin.com/in/chiragnsundar</a> &nbsp;|&nbsp; 
        💻 <a href="https://github.com/ChiragNSundar" target="_blank">github.com/ChiragNSundar</a>
      </div>
    </div>

    <!-- PROFESSIONAL SUMMARY -->
    <div class="section">
      <div class="section-title">PROFESSIONAL SUMMARY</div>
      <p class="summary-text">
        Result-driven Software Engineer specializing in Web App Development, Data Science/Analytics, and GenAI/AI Agents. Passionate about architecting and deploying high-quality, robust user-centric solutions.
      </p>
    </div>

    <!-- EXPERIENCE -->
    <div class="section">
      <div class="section-title">EXPERIENCE</div>
      
      <div class="entry-header">
        <span>Data Science & AI Intern &rarr; Trainee Programmer(Fulltime)</span>
        <span>Nov 2025 &ndash; Apr 2026</span>
      </div>
      <div class="entry-subheader">
        <span>What Digital Technologies Private Limited</span>
        <span>Bengaluru, India</span>
      </div>
      <ul class="bullets">
        <li>Engineered and delivered production-ready, scalable software systems, including centralized <strong>Analytics Dashboards</strong> for real-time traffic/engagement insights and an <strong>AI Job Description Bot</strong> for enterprise automation.</li>
        <li>Developed an end-to-end predictive intelligence platform incorporating machine learning for revenue forecasting, subscription lifecycle analysis, and implemented enterprise-grade AI solutions focusing on reliability and fault tolerance.</li>
      </ul>

      <div class="entry-header" style="margin-top: 6px;">
        <span>AI Operations Specialist(Fulltime)</span>
        <span>May 2026 &ndash; Current</span>
      </div>
      <div class="entry-subheader">
        <span>Rural Bank Of Calbayog City, Inc. (RBCCI)</span>
        <span>Freelance, Remote</span>
      </div>
      <ul class="bullets">
        <li>Architected and deployed a production-ready, client-server core banking ecosystem comprising a modular ledger prototype, automated <strong>AMLA transaction compliance monitoring</strong>, and a dynamic 7-step digital loan pipeline that drastically accelerated credit review cycles.</li>
        <li>Engineered a high-performance <strong>Node.js/Express backend integrated with SQLite</strong> to replace fragmented browser storage, centralizing critical financial records across multiple branches while optimizing security and database lookup speeds.</li>
        <li>Implemented <strong>edge AI biometric identity verification</strong> using client-side TensorFlow.js and MediaPipe Face Mesh, mapping 79 facial coordinates to 237-dimensional vectors to securely authenticate bank clients offline via Cosine Similarity.</li>
      </ul>
    </div>

    <!-- EDUCATION -->
    <div class="section">
      <div class="section-title">EDUCATION</div>
      <div class="entry-header">
        <span>RNS Institute of Technology</span>
        <span>Bengaluru, India</span>
      </div>
      <div class="entry-subheader">
        <span>Bachelor of Engineering in Computer Science &mdash; <strong>GPA: 8.89/10.0</strong></span>
        <span>Dec 2021 &ndash; June 2025</span>
      </div>
      <div style="font-size: 9.8pt; margin-top: 2px;">
        <strong>Relevant Coursework:</strong> Machine Learning, Software Engineering, Data Science and Visualization.
      </div>
    </div>

    <!-- TECHNICAL SKILLS -->
    <div class="section">
      <div class="section-title">TECHNICAL SKILLS</div>
      <div class="skills-block">
        <div class="skills-row"><strong>Languages:</strong> Python, SQL, C, HTML, CSS, JavaScript</div>
        <div class="skills-row"><strong>Frameworks & Libraries:</strong> Streamlit, Dash, Flask, LangChain, FastAPI</div>
        <div class="skills-row"><strong>Databases:</strong> MongoDB, PostgreSQL, XAMPP</div>
        <div class="skills-row"><strong>Developer Tools:</strong> Git, GitHub Actions, Docker, PowerBi, OpenAI API, Google Gemini, Ollama, GenAI, Linux</div>
      </div>
    </div>

    <!-- PROJECTS -->
    <div class="section">
      <div class="section-title">PROJECTS</div>

      <div class="entry-header">
        <span>Roadwatch: Smart Helmet (Realtime)</span>
        <span style="font-weight: normal; font-style: italic; font-size: 9.5pt;">Python &mdash; OpenCV &mdash; FastAPI &mdash; YOLO &mdash; EasyOCR</span>
      </div>
      <ul class="bullets">
        <li>Developed an <strong>AI-powered computer vision</strong> solution to automatically <strong>detect motorcyclists without helmets</strong>.</li>
        <li>Implemented real-time traffic/helmet violation detection with <strong>vehicle number plate recognition</strong> and <strong>instant SMS notifications</strong> to traffic authorities.</li>
        <li>Utilized machine learning models for <strong>object detection</strong>, integrated an SMS gateway for <strong>automated traffic rule enforcement</strong>, and created a scalable system for road safety monitoring.</li>
      </ul>

      <div class="entry-header" style="margin-top: 4px;">
        <span>HarmonyHub: Mental Health Assistant</span>
        <span style="font-weight: normal; font-style: italic; font-size: 9.5pt;">Python &mdash; GenAI &mdash; RAG &mdash; NLP &mdash; Streamlit &mdash; Plotly</span>
      </div>
      <ul class="bullets">
        <li>Developed and designed a comprehensive mental health application with mood tracking, goal setting, habit tracking, community forums, and a user-friendly interface built using Streamlit for enhanced engagement and accessibility.</li>
        <li>Implemented advanced AI solutions including a generative <strong>Gemini chatbot</strong> for personalized support, and integrated <strong>natural language processing</strong>, <strong>machine learning</strong>, and <strong>PDF processing</strong> for context-aware, insightful user interactions.</li>
        <li>Created interactive data visualization tools with <strong>Plotly</strong>, allowing users to track their progress, analyze daily habits, and gain personalized insights to support long-term mental well-being.</li>
      </ul>

      <div class="entry-header" style="margin-top: 4px;">
        <span>Job Portal Analytics Dashboard</span>
        <span style="font-weight: normal; font-style: italic; font-size: 9.5pt;">Data Visualization &mdash; Business Intelligence &mdash; Interactive Dashboards</span>
      </div>
      <ul class="bullets">
        <li>Developed interactive <strong>Dash/Plotly</strong> dashboard for job portal traffic, trends, and demographics.</li>
        <li><strong>Engineered</strong> architecture fetching data from <strong>MongoDB</strong> and <strong>MySQL</strong> via <strong>SQLAlchemy</strong>.</li>
        <li><strong>Created</strong> key analytics (Device Intelligence, Geospatial) using Sunburst Charts.</li>
      </ul>

      <div class="entry-header" style="margin-top: 4px;">
        <span>AI JD Bot: Job Description Assistant</span>
        <span style="font-weight: normal; font-style: italic; font-size: 9.5pt;">Python &mdash; Flask &mdash; Gemini 2.0 &mdash; MongoDB &mdash; SQLite</span>
      </div>
      <ul class="bullets">
        <li>Built an enterprise Flask chatbot using Gemini 2.0 & Gemma models with zero-tolerance exception handling, Pydantic validation, and Pybreaker circuit breakers.</li>
        <li>Engineered parallel SQLite write-queues (WAL mode) and 100-connection MongoDB pool for fault-tolerant automated job description generation.</li>
      </ul>

      <div class="entry-header" style="margin-top: 4px;">
        <span>Vocal Muse (VoxScript): Studio Workspace</span>
        <span style="font-weight: normal; font-style: italic; font-size: 9.5pt;">React 19 &mdash; TanStack &mdash; Web Audio API &mdash; Hybrid RAG</span>
      </div>
      <ul class="bullets">
        <li>Engineered a 100% local-first studio workspace turning mumble freestyles into polished lyrics via Multi-Level Hybrid RAG (RRF) and 31k-entry Indic dictionary datasets.</li>
      </ul>
    </div>

    <!-- CERTIFICATIONS -->
    <div class="section">
      <div class="section-title">CERTIFICATIONS</div>
      <ul class="cert-list">
        <li><strong>Data Science Foundation Certification</strong> - Infosys Springboard</li>
        <li><strong>Python Foundation Certification</strong> - Infosys Springboard</li>
        <li><strong>Responsive Web Design</strong> - freeCodeCamp.org</li>
        <li><strong>Artificial Intelligence Foundation Certification</strong> - Infosys Springboard</li>
      </ul>
    </div>

  </div>
</body>
</html>`;

  // Hidden print iframe to suppress 'about:blank' URL and browser headers/footers
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error("Print failed:", e);
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
    }, 250);
  }
};
