// Helpers for persisting the resume and exporting it in ATS-friendly formats.

import { DEFAULT_SECTION_ORDER } from '../data/resume'

export const RESUME_KEY = 'ats-resume:data:v1'
export const DENSITY_KEY = 'ats-resume:density:v1'
// Keep in sync with the no-flash script in index.html.
export const THEME_KEY = 'ats-resume:theme:v1'

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'resume'
}

/** Trigger a client-side file download. */
export function downloadBlob(filename, text, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Copy text to the clipboard, falling back to a temporary textarea. */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the legacy approach (e.g. non-secure contexts).
    }
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let copied
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  area.remove()
  return copied
}

/** Open the browser print dialog (Chrome/Edge/Firefox "Save as PDF"). */
export function printResume() {
  window.print()
}

function orderedSections(resume) {
  const order = Array.isArray(resume.sectionOrder) && resume.sectionOrder.length
    ? resume.sectionOrder
    : DEFAULT_SECTION_ORDER
  return order
}

/**
 * Serialize the resume to plain text.
 * Plain text is the most universally parseable format for ATS software:
 * no columns, no graphics, one fact per line.
 */
export function toPlainText(resume) {
  const lines = []
  const push = (line = '') => lines.push(line)
  const bullets = (items) => (items || []).filter((item) => String(item).trim() !== '')

  push(String(resume.name || '').toUpperCase())
  if (resume.headline) push(resume.headline)

  const contact = [resume.location, resume.phone, resume.email].filter(Boolean)
  if (contact.length) push(contact.join(' | '))

  const links = (resume.links || [])
    .filter((link) => link && link.value)
    .map((link) => `${link.label}: ${link.value}`)
  if (links.length) push(links.join(' | '))

  orderedSections(resume).forEach((key) => {
    if (key === 'summary' && resume.summary) {
      push()
      push('SUMMARY')
      push(resume.summary)
    }

    if (key === 'skills' && (resume.skills || []).length) {
      push()
      push('TECHNICAL SKILLS')
      resume.skills
        .filter((skill) => skill && (skill.label || skill.value))
        .forEach((skill) => push(`${skill.label}: ${skill.value}`))
    }

    if (key === 'education' && (resume.education || []).length) {
      push()
      push('EDUCATION')
      resume.education
        .filter((item) => item && (item.degree || item.school))
        .forEach((item) =>
          push(
            [item.degree, item.school, item.dates].filter(Boolean).join(' — '),
          ),
        )
    }

    if (key === 'experience' && (resume.experience || []).length) {
      push()
      push('EXPERIENCE')
      resume.experience
        .filter((job) => job && (job.title || job.company))
        .forEach((job) => {
          push([job.title, job.company].filter(Boolean).join(' — '))
          if (job.dates) push(job.dates)
          bullets(job.bullets).forEach((bullet) => push(`- ${bullet}`))
        })
    }

    if (key === 'projects' && (resume.projects || []).length) {
      push()
      push('PROJECTS')
      resume.projects
        .filter((project) => project && project.name)
        .forEach((project) => {
          push(project.name)
          if (project.tech) push(project.tech)
          const projectLinks = (project.links || [])
            .filter((link) => link && link.value)
            .map((link) => `${link.label}: ${link.value}`)
          if (projectLinks.length) push(projectLinks.join(' | '))
          bullets(project.bullets).forEach((bullet) => push(`- ${bullet}`))
        })
    }
  })

  return `${lines.join('\n').trim()}\n`
}
