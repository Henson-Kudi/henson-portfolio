"use client"
import resumeData from "@/data/resume-data"
import "../app/pdf-styles.css"

export function ResumePDFTemplate() {
  return (
    <div className="resume-container">
      <div className="resume-main">
        {/* Header */}
        <header className="resume-header">
          <h1 className="resume-name">{resumeData.personalInfo.name}</h1>
          <h2 className="resume-title">{resumeData.personalInfo.title}</h2>
          <p className="resume-subtitle">
            {resumeData.personalInfo.yearsOfExperience} and {resumeData.personalInfo.teamLeadExperience}
          </p>
          <p className="resume-contact">
            {resumeData.personalInfo.email} • {resumeData.personalInfo.linkedin} • {resumeData.personalInfo.website}
          </p>
        </header>

        {/* Content */}
        <div className="resume-content">
          {/* Skills Section */}
          <section className="resume-section">
            <h3 className="resume-section-title">SKILLS</h3>
            <ul className="resume-skills-list">
              <li className="resume-skill-item">
                <span className="resume-skill-bullet">●</span> Languages & Frameworks (
                {resumeData.skills.languages.join(", ")})
              </li>
              <li className="resume-skill-item">
                <span className="resume-skill-bullet">●</span> Architecture & Patterns (
                {resumeData.skills.architecture.join(", ")})
              </li>
              <li className="resume-skill-item">
                <span className="resume-skill-bullet">●</span> Cloud & DevOps ({resumeData.skills.cloud.join("; ")})
              </li>
              <li className="resume-skill-item">
                <span className="resume-skill-bullet">●</span> Data & Messaging ({resumeData.skills.data.join(", ")})
              </li>
              <li className="resume-skill-item">
                <span className="resume-skill-bullet">●</span> Quality ({resumeData.skills.quality.join(", ")})
              </li>
            </ul>
          </section>

          {/* Experience Section */}
          <section className="resume-section">
            <h3 className="resume-section-title">LATEST PROFESSIONAL EXPERIENCE</h3>

            {resumeData.experience.map((job, index) => (
              <div key={index} className="resume-job">
                <div className="resume-job-header">
                  <div className="resume-job-company-title">
                    <span className="resume-job-company">{job.company.toUpperCase()}</span> -{" "}
                    <span className="resume-job-title">{job.title}</span>
                  </div>
                  <div className="resume-job-period">
                    {job.period} ({job.location})
                  </div>
                </div>
                <ul className="resume-job-responsibilities">
                  {job.responsibilities.map((responsibility, respIndex) => (
                    <li key={respIndex} className="resume-job-responsibility">
                      <span className="resume-responsibility-bullet">●</span> {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
