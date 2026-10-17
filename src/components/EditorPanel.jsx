import { DEFAULT_SECTION_ORDER } from '../data/resume'

// ---------------------------------------------------------------------------
// Live editor for the resume data. It edits plain objects, so the rendered
// resume DOM stays clean and semantic (important for ATS parsing).
// ---------------------------------------------------------------------------

const SECTION_LABELS = {
  summary: 'Summary',
  skills: 'Technical Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
}

function move(list, index, delta) {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = list.slice()
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="fld">
      <span className="fld-label">{label}</span>
      <input
        className="fld-input"
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function Area({ label, value, onChange, rows = 3, hint }) {
  return (
    <label className="fld">
      <span className="fld-label">{label}</span>
      <textarea
        className="fld-input fld-textarea"
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <span className="fld-hint">{hint}</span>}
    </label>
  )
}

function Card({ title, onRemove, onUp, onDown, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">{title}</span>
        <div className="card-actions">
          <button type="button" className="icon-btn" title="Move up" onClick={onUp}>
            ↑
          </button>
          <button type="button" className="icon-btn" title="Move down" onClick={onDown}>
            ↓
          </button>
          <button
            type="button"
            className="icon-btn icon-btn-danger"
            title="Remove"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

function Group({ title, onAdd, addLabel = '+ Add item', children }) {
  return (
    <div className="group">
      <div className="group-head">
        <h3 className="group-title">{title}</h3>
        {onAdd && (
          <button type="button" className="ghost-btn" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>
      <div className="group-body">{children}</div>
    </div>
  )
}

function bulletsToText(bullets) {
  return (bullets || []).join('\n')
}

function textToBullets(text) {
  return text.split('\n')
}

export default function EditorPanel({ resume, onChange }) {
  const update = (partial) => onChange({ ...resume, ...partial })

  const order =
    Array.isArray(resume.sectionOrder) && resume.sectionOrder.length
      ? resume.sectionOrder
      : DEFAULT_SECTION_ORDER

  return (
    <aside className="editor no-print" aria-label="Resume editor">
      <div className="editor-scroll">
        <Group title="Header">
          <Field
            label="Full name"
            value={resume.name}
            onChange={(value) => update({ name: value })}
          />
          <Area
            label="Headline / target role"
            rows={2}
            value={resume.headline}
            onChange={(value) => update({ headline: value })}
          />
          <div className="row-2">
            <Field
              label="Location"
              value={resume.location}
              onChange={(value) => update({ location: value })}
            />
            <Field
              label="Phone"
              value={resume.phone}
              onChange={(value) => update({ phone: value })}
            />
          </div>
          <Field
            label="Email"
            value={resume.email}
            onChange={(value) => update({ email: value })}
          />
        </Group>

        <Group
          title="Links"
          addLabel="+ Add link"
          onAdd={() =>
            update({
              links: [
                ...(resume.links || []),
                { label: 'Label', value: '', url: '' },
              ],
            })
          }
        >
          {(resume.links || []).map((link, index) => (
            <Card
              key={index}
              title={link.label || `Link ${index + 1}`}
              onUp={() => update({ links: move(resume.links || [], index, -1) })}
              onDown={() => update({ links: move(resume.links || [], index, 1) })}
              onRemove={() =>
                update({
                  links: (resume.links || []).filter((_, i) => i !== index),
                })
              }
            >
              <div className="row-2">
                <Field
                  label="Label"
                  value={link.label}
                  onChange={(value) => {
                    const links = (resume.links || []).slice()
                    links[index] = { ...link, label: value }
                    update({ links })
                  }}
                />
                <Field
                  label="Shown text"
                  value={link.value}
                  onChange={(value) => {
                    const links = (resume.links || []).slice()
                    links[index] = { ...link, value }
                    update({ links })
                  }}
                />
              </div>
              <Field
                label="URL"
                value={link.url}
                onChange={(value) => {
                  const links = (resume.links || []).slice()
                  links[index] = { ...link, url: value }
                  update({ links })
                }}
              />
            </Card>
          ))}
        </Group>

        <Group title="Summary">
          <Area
            label="Professional summary"
            rows={5}
            value={resume.summary}
            onChange={(value) => update({ summary: value })}
          />
        </Group>

        <Group title="Section order">
          <ul className="order-list">
            {order.map((key, index) => (
              <li key={key} className="order-item">
                <span>{SECTION_LABELS[key] || key}</span>
                <div className="card-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Move up"
                    onClick={() => update({ sectionOrder: move(order, index, -1) })}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Move down"
                    onClick={() => update({ sectionOrder: move(order, index, 1) })}
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Group>

        <Group
          title="Technical skills"
          addLabel="+ Add skill group"
          onAdd={() =>
            update({
              skills: [...(resume.skills || []), { label: 'Category', value: '' }],
            })
          }
        >
          {(resume.skills || []).map((skill, index) => (
            <Card
              key={index}
              title={skill.label || `Skill group ${index + 1}`}
              onUp={() => update({ skills: move(resume.skills || [], index, -1) })}
              onDown={() => update({ skills: move(resume.skills || [], index, 1) })}
              onRemove={() =>
                update({
                  skills: (resume.skills || []).filter((_, i) => i !== index),
                })
              }
            >
              <Field
                label="Category"
                value={skill.label}
                onChange={(value) => {
                  const skills = (resume.skills || []).slice()
                  skills[index] = { ...skill, label: value }
                  update({ skills })
                }}
              />
              <Area
                label="Skills (comma separated)"
                rows={2}
                value={skill.value}
                onChange={(value) => {
                  const skills = (resume.skills || []).slice()
                  skills[index] = { ...skill, value }
                  update({ skills })
                }}
              />
            </Card>
          ))}
        </Group>

        <Group
          title="Experience"
          addLabel="+ Add role"
          onAdd={() =>
            update({
              experience: [
                ...(resume.experience || []),
                { title: '', company: '', dates: '', bullets: [''] },
              ],
            })
          }
        >
          {(resume.experience || []).map((job, index) => (
            <Card
              key={index}
              title={job.title || `Role ${index + 1}`}
              onUp={() =>
                update({ experience: move(resume.experience || [], index, -1) })
              }
              onDown={() =>
                update({ experience: move(resume.experience || [], index, 1) })
              }
              onRemove={() =>
                update({
                  experience: (resume.experience || []).filter(
                    (_, i) => i !== index,
                  ),
                })
              }
            >
              <Field
                label="Job title"
                value={job.title}
                onChange={(value) => {
                  const experience = (resume.experience || []).slice()
                  experience[index] = { ...job, title: value }
                  update({ experience })
                }}
              />
              <Field
                label="Company / arrangement"
                value={job.company}
                onChange={(value) => {
                  const experience = (resume.experience || []).slice()
                  experience[index] = { ...job, company: value }
                  update({ experience })
                }}
              />
              <Field
                label="Dates"
                value={job.dates}
                placeholder="Jun 2024 – Present"
                onChange={(value) => {
                  const experience = (resume.experience || []).slice()
                  experience[index] = { ...job, dates: value }
                  update({ experience })
                }}
              />
              <Area
                label="Bullet points"
                rows={4}
                hint="One bullet per line."
                value={bulletsToText(job.bullets)}
                onChange={(value) => {
                  const experience = (resume.experience || []).slice()
                  experience[index] = { ...job, bullets: textToBullets(value) }
                  update({ experience })
                }}
              />
            </Card>
          ))}
        </Group>

        <Group
          title="Projects"
          addLabel="+ Add project"
          onAdd={() =>
            update({
              projects: [
                ...(resume.projects || []),
                { name: '', tech: '', links: [], bullets: [''] },
              ],
            })
          }
        >
          {(resume.projects || []).map((project, index) => (
            <Card
              key={index}
              title={project.name || `Project ${index + 1}`}
              onUp={() =>
                update({ projects: move(resume.projects || [], index, -1) })
              }
              onDown={() =>
                update({ projects: move(resume.projects || [], index, 1) })
              }
              onRemove={() =>
                update({
                  projects: (resume.projects || []).filter((_, i) => i !== index),
                })
              }
            >
              <Field
                label="Project name"
                value={project.name}
                onChange={(value) => {
                  const projects = (resume.projects || []).slice()
                  projects[index] = { ...project, name: value }
                  update({ projects })
                }}
              />
              <Area
                label="Tech stack (comma separated)"
                rows={2}
                value={project.tech}
                onChange={(value) => {
                  const projects = (resume.projects || []).slice()
                  projects[index] = { ...project, tech: value }
                  update({ projects })
                }}
              />
              <Area
                label="Links (one per line: Label | text | url)"
                rows={2}
                hint="Example: Live | my-app.vercel.app | https://my-app.vercel.app"
                value={(project.links || [])
                  .map((link) => [link.label, link.value, link.url].join(' | '))
                  .join('\n')}
                onChange={(value) => {
                  const links = value
                    .split('\n')
                    .map((line) => line.split('|').map((part) => part.trim()))
                    .filter((parts) => parts.join('') !== '')
                    .map(([label = '', shown = '', url = '']) => ({
                      label,
                      value: shown,
                      url,
                    }))
                  const projects = (resume.projects || []).slice()
                  projects[index] = { ...project, links }
                  update({ projects })
                }}
              />
              <Area
                label="Bullet points"
                rows={4}
                hint="One bullet per line."
                value={bulletsToText(project.bullets)}
                onChange={(value) => {
                  const projects = (resume.projects || []).slice()
                  projects[index] = {
                    ...project,
                    bullets: textToBullets(value),
                  }
                  update({ projects })
                }}
              />
            </Card>
          ))}
        </Group>

        <Group
          title="Education"
          addLabel="+ Add education"
          onAdd={() =>
            update({
              education: [
                ...(resume.education || []),
                { degree: '', school: '', dates: '' },
              ],
            })
          }
        >
          {(resume.education || []).map((item, index) => (
            <Card
              key={index}
              title={item.degree || `Education ${index + 1}`}
              onUp={() =>
                update({ education: move(resume.education || [], index, -1) })
              }
              onDown={() =>
                update({ education: move(resume.education || [], index, 1) })
              }
              onRemove={() =>
                update({
                  education: (resume.education || []).filter(
                    (_, i) => i !== index,
                  ),
                })
              }
            >
              <Field
                label="Degree"
                value={item.degree}
                onChange={(value) => {
                  const education = (resume.education || []).slice()
                  education[index] = { ...item, degree: value }
                  update({ education })
                }}
              />
              <Field
                label="Institution"
                value={item.school}
                onChange={(value) => {
                  const education = (resume.education || []).slice()
                  education[index] = { ...item, school: value }
                  update({ education })
                }}
              />
              <Field
                label="Status / year"
                value={item.dates}
                placeholder="Currently Pursuing"
                onChange={(value) => {
                  const education = (resume.education || []).slice()
                  education[index] = { ...item, dates: value }
                  update({ education })
                }}
              />
            </Card>
          ))}
        </Group>
      </div>
    </aside>
  )
}
