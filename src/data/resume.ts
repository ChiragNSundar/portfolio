export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface Project {
  title: string;
  technologies: string[];
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  github: string;
  about: string;
  experience: Experience[];
  education: {
    institution: string;
    degree: string;
    location: string;
    gpa: string;
    period: string;
    coursework: string;
  };
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
  projects: Project[];
  certifications: string[];
}

export const resumeData: ResumeData = {
  name: "Chirag N Sundar",
  title: "Software Engineer & AI Specialist",
  email: "chiragns12@gmail.com",
  linkedin: "linkedin.com/in/chiragnsundar",
  github: "github.com/ChiragNSundar",
  about: "Result-driven Software Engineer specializing in Web App Development, Data Science/Analytics, and GenAI/AI Agents. Passionate about architecting and deploying high-quality, robust user-centric solutions.",
  experience: [
    {
      role: "AI Operations Specialist (Fulltime)",
      company: "Rural Bank Of Calbayog City, Inc. (RBCCI)",
      location: "Freelance, Remote",
      period: "May 2026 - Current",
      bullets: [
        "Architected and deployed a production-ready, client-server core banking ecosystem comprising a modular ledger prototype, automated AMLA transaction compliance monitoring, and a dynamic 7-step digital loan pipeline that drastically accelerated credit review cycles.",
        "Engineered a high-performance Node.js/Express backend integrated with SQLite to replace fragmented browser storage, centralizing critical financial records across multiple branches while optimizing security and database lookup speeds.",
        "Implemented edge AI biometric identity verification using client-side TensorFlow.js and MediaPipe Face Mesh, mapping 79 facial coordinates to 237-dimensional vectors to securely authenticate bank clients offline via Cosine Similarity."
      ]
    },
    {
      role: "Data Science & AI Intern → Trainee Programmer (Fulltime)",
      company: "What Digital Technologies Private Limited",
      location: "Bengaluru, India",
      period: "Nov 2025 - Apr 2026",
      bullets: [
        "Engineered and delivered production-ready, scalable software systems, including centralized Analytics Dashboards for real-time traffic/engagement insights and an AI Job Description Bot for enterprise automation.",
        "Developed an end-to-end predictive intelligence platform incorporating machine learning for revenue forecasting, subscription lifecycle analysis, and implemented enterprise-grade AI solutions focusing on reliability and fault tolerance."
      ]
    }
  ],
  education: {
    institution: "RNS Institute of Technology",
    degree: "Bachelor of Engineering in Computer Science",
    location: "Bengaluru, India",
    gpa: "8.89/10.0",
    period: "Dec 2021 - June 2025",
    coursework: "Machine Learning, Software Engineering, Data Science and Visualization"
  },
  skills: {
    languages: ["Python", "SQL", "C", "HTML", "CSS", "JavaScript"],
    frameworks: ["Streamlit", "Dash", "Flask", "LangChain", "FastAPI"],
    databases: ["MongoDB", "PostgreSQL", "XAMPP (MySQL)"],
    tools: ["Git", "GitHub Actions", "Docker", "PowerBi", "OpenAI API", "Google Gemini", "Ollama", "GenAI", "Linux"]
  },
  projects: [
    {
      title: "Roadwatch: Smart Helmet (Realtime)",
      technologies: ["Python", "OpenCV", "FastAPI", "YOLO", "EasyOCR"],
      bullets: [
        "Developed an AI-powered computer vision solution to automatically detect motorcyclists without helmets.",
        "Implemented real-time traffic/helmet violation detection with vehicle number plate recognition and instant SMS notifications to traffic authorities.",
        "Utilized machine learning models for object detection, integrated an SMS gateway for automated traffic rule enforcement, and created a scalable system for road safety monitoring."
      ]
    },
    {
      title: "HarmonyHub: Mental Health Assistant",
      technologies: ["Python", "GenAI", "RAG", "NLP", "Streamlit", "Plotly"],
      bullets: [
        "Developed and designed a comprehensive mental health application with mood tracking, goal setting, habit tracking, community forums, and a user-friendly interface built using Streamlit for enhanced engagement and accessibility.",
        "Implemented advanced AI solutions including a generative Gemini chatbot for personalized support, and integrated natural language processing, machine learning, and PDF processing for context-aware, insightful user interactions.",
        "Created interactive data visualization tools with Plotly, allowing users to track their progress, analyze daily habits, and gain personalized insights to support long-term mental well-being."
      ]
    },
    {
      title: "Job Portal Analytics Dashboard",
      technologies: ["Data Visualization", "Business Intelligence", "Interactive Dashboards"],
      bullets: [
        "Developed interactive Dash/Plotly dashboard for job portal traffic, trends, and demographics.",
        "Engineered architecture fetching data from MongoDB and MySQL via SQLAlchemy.",
        "Created key analytics (Device Intelligence, Geospatial) using Sunburst Charts."
      ]
    }
  ],
  certifications: [
    "Data Science Foundation Certification - Infosys Springboard",
    "Python Foundation Certification - Infosys Springboard",
    "Responsive Web Design - freeCodeCamp.org",
    "Artificial Intelligence Foundation Certification - Infosys Springboard"
  ]
};
