import { Fragment } from 'react'
import { DEFAULT_SECTION_ORDER } from '../data/resume'

// ---------------------------------------------------------------------------
// The resume document itself.
//
// Everything here is semantic, single-column, selectable text — the layout
// style ATS parsers read most reliably. Avoid adding columns, tables, icons,
// or images here; they tend to break resume parsers.
// ---------------------------------------------------------------------------

const SECTION_TITLES = {
  summary: 'Summary',
  skills: 'Technical Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
}

function clean(value) {
  return String(value ?? '').trim()
}

function nonEmpty(items, keys) {
  return (items || []).filter((item) =>
    item && keys.some((key) => clean(item[key]) !== ''),
  )
}

function Bullets({ items }) {
  const bullets = (items || []).map(clean).filter(Boolean)
  if (!bullets.length) return null
  return (
    <ul className="r-bullets">
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
  )
}

function Separated({ items, render }) {
  return items.map((item, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <span className="r-sep" aria-hidden="true">
          |
        </span>
      )}
      {render(item)}
    </Fragment>
  ))
}

function Section({ title, children }) {
  return (
    <section className="r-section">
      <h2 className="r-h2">{title}</h2>
      {children}
    </section>
  )
}

function phonHref(phone) {
  return `tel:${clean(phone).replace(/[^+\d]/g, '')}`
}

function Header({ resume }) {
  const contact = [
    resume.location ? (
      <span key="location" className="r-contact-item">
        {resume.location}
      </span>
    ) : null,
    resume.phone ? (
      <a key="phone" className="r-link" href={phonHref(resume.phone)}>
        {resume.phone}
      </a>
    ) : null,
    resume.email ? (
      <a key="email" className="r-link" href={`mailto:${clean(resume.email)}`}>
        {resume.email}
      </a>
    ) : null,
  ].filter(Boolean)

  const links = (resume.links || []).filter(
    (link) => link && (clean(link.value) || clean(link.url)),
  )

  return (
    <header className="r-header">
      <h1 className="r-name">{resume.name}</h1>
      {clean(resume.headline) && <p className="r-headline">{resume.headline}</p>}

      {contact.length > 0 && (
        <p className="r-contact">
          <Separated items={contact} render={(node) => node} />
        </p>
      )}

      {links.length > 0 && (
        <p className="r-contact">
          <Separated
            items={links}
            render={(link) => (
              <a className="r-link" href={clean(link.url) || clean(link.value)}>
                {clean(link.label) ? `${clean(link.label)}: ` : ''}
                {clean(link.value) || clean(link.url)}
              </a>
            )}
          />
        </p>
      )}
    </header>
  )
}

function SummarySection({ resume }) {
  if (!clean(resume.summary)) return null
  return (
    <Section title={SECTION_TITLES.summary}>
      <p className="r-summary">{resume.summary}</p>
    </Section>
  )
}

function SkillsSection({ resume }) {
  const skills = nonEmpty(resume.skills, ['label', 'value'])
  if (!skills.length) return null
  return (
    <Section title={SECTION_TITLES.skills}>
      <ul className="r-skills">
        {skills.map((skill, index) => (
          <li key={index}>
            {clean(skill.label) && <strong>{clean(skill.label)}: </strong>}
            {skill.value}
          </li>
        ))}
      </ul>
    </Section>
  )
}

function ExperienceSection({ resume }) {
  const jobs = nonEmpty(resume.experience, ['title', 'company'])
  if (!jobs.length) return null
  return (
    <Section title={SECTION_TITLES.experience}>
      {jobs.map((job, index) => (
        <article className="r-entry" key={index}>
          <h3 className="r-h3">
            {[clean(job.title), clean(job.company)].filter(Boolean).join(' — ')}
          </h3>
          {clean(job.dates) && <p className="r-dates">{job.dates}</p>}
          <Bullets items={job.bullets} />
        </article>
      ))}
    </Section>
  )
}

function ProjectLinks({ links }) {
  const visible = (links || []).filter(
    (link) => link && (clean(link.value) || clean(link.url)),
  )
  if (!visible.length) return null
  return (
    <p className="r-project-links">
      <Separated
        items={visible}
        render={(link) => (
          <a className="r-link" href={clean(link.url) || clean(link.value)}>
            {clean(link.label) ? `${clean(link.label)}: ` : ''}
            {clean(link.value) || clean(link.url)}
          </a>
        )}
      />
    </p>
  )
}

function ProjectsSection({ resume }) {
  const projects = nonEmpty(resume.projects, ['name'])
  if (!projects.length) return null
  return (
    <Section title={SECTION_TITLES.projects}>
      {projects.map((project, index) => (
        <article className="r-entry" key={index}>
          <h3 className="r-h3">{project.name}</h3>
          {clean(project.tech) && <p className="r-tech">{project.tech}</p>}
          <ProjectLinks links={project.links} />
          <Bullets items={project.bullets} />
        </article>
      ))}
    </Section>
  )
}

function EducationSection({ resume }) {
  const education = nonEmpty(resume.education, ['degree', 'school'])
  if (!education.length) return null
  return (
    <Section title={SECTION_TITLES.education}>
      <ul className="r-education">
        {education.map((item, index) => {
          const parts = [item.degree, item.school, item.dates]
            .map(clean)
            .filter(Boolean)
          return <li key={index}>{parts.join(' — ')}</li>
        })}
      </ul>
    </Section>
  )
}

const SECTION_RENDERERS = {
  summary: SummarySection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
}

export default function ResumeSheet({ resume, density = 'compact' }) {
  const order =
    Array.isArray(resume.sectionOrder) && resume.sectionOrder.length
      ? resume.sectionOrder
      : DEFAULT_SECTION_ORDER

  return (
    <main className="sheet" id="resume" data-density={density}>
      <Header resume={resume} />
      {order.map((key) => {
        const Renderer = SECTION_RENDERERS[key]
        return Renderer ? <Renderer key={key} resume={resume} /> : null
      })}
    </main>
  )
}
