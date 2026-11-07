import {
  contactEmail,
  contactPhone,
  templateProfile,
  templateResume,
} from './content';

export default function ResumeDetails() {
  return (
    <article className="archive-resume-details" aria-label="Curriculum vitae template">
      <header className="archive-resume-details-header">
        <h2 className="archive-resume-details-name">{templateProfile.name}</h2>
        <p className="archive-resume-subline">{templateProfile.disciplines}</p>
        <div className="archive-resume-contact">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <span aria-hidden="true">/</span>
          <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}>{contactPhone}</a>
          <span aria-hidden="true">/</span>
          <span>{templateProfile.location}</span>
          <span aria-hidden="true">/</span>
          <span className="archive-resume-portfolio-label">作品集</span>
        </div>
      </header>

      <div className="archive-resume-details-body">
        <section className="archive-resume-section">
          <h3>关于</h3>
          <p>{templateProfile.biography}</p>
        </section>

        <section className="archive-resume-section">
          <h3>精选经历</h3>
          <div className="archive-resume-entry-heading">
            <h4>{templateResume.experience.title}</h4>
            <span className="archive-resume-entry-date">{templateResume.experience.period}</span>
          </div>
          <ul className="archive-resume-bullets">
            {templateResume.experience.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="archive-resume-section">
          <h3>实践</h3>
          <p>{templateResume.practice}</p>
        </section>

        <section className="archive-resume-section">
          <h3>教育背景</h3>
          <div className="archive-resume-entry-heading">
            <h4>{templateResume.education.title}</h4>
            <span className="archive-resume-entry-date">{templateResume.education.period}</span>
          </div>
        </section>

        <section className="archive-resume-section">
          <h3>工具</h3>
          <div className="archive-resume-skills">
            {templateResume.tools.map((item) => <p key={item}>{item}</p>)}
          </div>
        </section>
      </div>
    </article>
  );
}
