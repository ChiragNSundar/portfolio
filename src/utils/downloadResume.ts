import { resumeData } from "../data/resume";

export const downloadSoftwareEngineerResume = () => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.name} - Software Engineer Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Share+Tech+Mono&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #18181b;
      background: #ffffff;
      padding: 40px;
      line-height: 1.5;
      font-size: 13.5px;
    }

    .resume-container {
      max-width: 820px;
      margin: 0 auto;
    }

    header {
      border-bottom: 2.5px solid #18181b;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .header-left h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #18181b;
    }

    .header-left .subtitle {
      font-size: 14px;
      font-weight: 600;
      color: #d97706;
      font-family: 'Share Tech Mono', monospace;
      margin-top: 2px;
    }

    .header-right {
      text-align: right;
      font-size: 12px;
      color: #52525b;
      font-family: 'Share Tech Mono', monospace;
    }

    .header-right a {
      color: #18181b;
      text-decoration: none;
      font-weight: bold;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1.5px solid #e4e4e7;
      padding-bottom: 4px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }

    .summary-text {
      font-size: 13px;
      color: #3f3f46;
      line-height: 1.6;
    }

    .exp-item, .project-item {
      margin-bottom: 14px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      font-size: 14px;
    }

    .item-subheader {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: #71717a;
      font-family: 'Share Tech Mono', monospace;
      margin-bottom: 4px;
    }

    ul.bullets {
      padding-left: 18px;
      color: #27272a;
    }

    ul.bullets li {
      margin-bottom: 3px;
      font-size: 12.5px;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 6px 12px;
      font-size: 12.5px;
    }

    .skill-category {
      font-weight: 700;
      font-family: 'Share Tech Mono', monospace;
      color: #18181b;
    }

    .skill-list {
      color: #3f3f46;
    }

    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .no-print {
        display: none !important;
      }
      .resume-container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="position: fixed; top: 16px; right: 20px; z-index: 1000; background: #faf9f5; padding: 10px 16px; border: 2px solid #18181b; border-radius: 12px; box-shadow: 4px 4px 0 #18181b; font-family: 'Share Tech Mono', monospace;">
    <button onclick="window.print()" style="background: #f59f00; color: #fff; border: none; padding: 8px 16px; font-weight: bold; cursor: pointer; border-radius: 6px; font-family: inherit;">🖨️ PRINT / SAVE AS PDF</button>
    <button onclick="window.close()" style="background: #18181b; color: #fff; border: none; padding: 8px 16px; font-weight: bold; cursor: pointer; border-radius: 6px; font-family: inherit; margin-left: 8px;">✖ CLOSE</button>
  </div>

  <div class="resume-container">
    <header>
      <div class="header-left">
        <h1>${resumeData.name}</h1>
        <div class="subtitle">${resumeData.title.toUpperCase()}</div>
      </div>
      <div class="header-right">
        <div>📧 ${resumeData.email}</div>
        <div>🌐 <a href="https://${resumeData.linkedin}" target="_blank">${resumeData.linkedin}</a></div>
        <div>💻 <a href="https://${resumeData.github}" target="_blank">${resumeData.github}</a></div>
        <div>📍 Bengaluru, India</div>
      </div>
    </header>

    <div class="section">
      <div class="section-title">01 // PROFESSIONAL SUMMARY</div>
      <p class="summary-text">${resumeData.about}</p>
    </div>

    <div class="section">
      <div class="section-title">02 // EDUCATION</div>
      <div class="item-header">
        <span>${resumeData.education.institution}</span>
        <span>${resumeData.education.period}</span>
      </div>
      <div class="item-subheader">
        <span>${resumeData.education.degree}</span>
        <span>GPA: ${resumeData.education.gpa}</span>
      </div>
      <div style="font-size: 12px; color: #52525b; margin-top: 2px;">
        <strong>Relevant Coursework:</strong> ${resumeData.education.coursework}
      </div>
    </div>

    <div class="section">
      <div class="section-title">03 // WORK EXPERIENCE</div>
      ${resumeData.experience.map(exp => `
        <div class="exp-item">
          <div class="item-header">
            <span>${exp.role}</span>
            <span style="font-size: 12px; font-family: 'Share Tech Mono', monospace; font-weight: normal;">${exp.period}</span>
          </div>
          <div class="item-subheader">
            <span>${exp.company} — ${exp.location}</span>
          </div>
          <ul class="bullets">
            ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">04 // KEY AI & SOFTWARE PROJECTS</div>
      ${resumeData.projects.map(proj => `
        <div class="project-item">
          <div class="item-header">
            <span>${proj.title}</span>
            <span style="font-size: 11.5px; font-family: 'Share Tech Mono', monospace; font-weight: normal; color: #71717a;">[${proj.technologies.join(', ')}]</span>
          </div>
          <ul class="bullets" style="margin-top: 4px;">
            ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">05 // TECHNICAL SKILLS</div>
      <div class="skills-grid">
        <div class="skill-category">LANGUAGES:</div>
        <div class="skill-list">${resumeData.skills.languages.join(', ')}</div>
        <div class="skill-category">FRAMEWORKS:</div>
        <div class="skill-list">${resumeData.skills.frameworks.join(', ')}</div>
        <div class="skill-category">DATABASES:</div>
        <div class="skill-list">${resumeData.skills.databases.join(', ')}</div>
        <div class="skill-category">TOOLS & AI:</div>
        <div class="skill-list">${resumeData.skills.tools.join(', ')}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">06 // CERTIFICATIONS</div>
      <ul class="bullets">
        ${resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
      </ul>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
