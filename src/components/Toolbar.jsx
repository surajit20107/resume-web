import { useEffect, useRef, useState } from 'react'
import { downloadBlob, printResume, slugify, toPlainText } from '../lib/resumeIO'

export default function Toolbar({
  editing,
  onToggleEdit,
  density,
  onDensityChange,
  resume,
  onReset,
  onImport,
}) {
  const fileRef = useRef(null)
  const [notice, setNotice] = useState('')
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const flash = (message, duration = 5000) => {
    window.clearTimeout(timerRef.current)
    setNotice(message)
    timerRef.current = window.setTimeout(() => setNotice(''), duration)
  }

  const baseName = slugify(resume.name)

  const handlePrint = () => {
    flash(
      'In the print dialog pick "Save as PDF". Turn off "Headers and footers" and use Default margins for the cleanest, most ATS-friendly file.',
      9000,
    )
    // Let the notice render before the (blocking) print dialog opens.
    window.setTimeout(() => printResume(), 80)
  }

  const handleTxt = () => {
    downloadBlob(`${baseName}-resume.txt`, toPlainText(resume))
    flash('Downloaded a plain-text (.txt) version — the most ATS-safe format.')
  }

  const handleJson = () => {
    downloadBlob(
      `${baseName}-resume.json`,
      JSON.stringify(resume, null, 2),
      'application/json;charset=utf-8',
    )
    flash('Exported your resume data (JSON). Keep it to restore later.')
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        flash(
          onImport(parsed)
            ? 'Resume imported successfully.'
            : 'That JSON file does not look like a resume export.',
        )
      } catch {
        flash('Could not read that file as JSON.')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Reset everything back to the content in src/data/resume.js? Your current browser edits will be lost.',
      )
    ) {
      onReset()
      flash('Reset to the default resume content.')
    }
  }

  return (
    <header className="toolbar no-print">
      <div className="toolbar-inner">
        <div className="toolbar-brand">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name">Resume Studio</span>
          <span className="brand-sub">ATS-friendly · autosaved</span>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className={`btn ${editing ? 'btn-primary' : ''}`}
            onClick={onToggleEdit}
            aria-pressed={editing}
          >
            {editing ? 'Done editing' : 'Edit'}
          </button>

          <div className="seg" role="group" aria-label="Print density">
            <button
              type="button"
              className={`seg-btn ${density === 'compact' ? 'is-active' : ''}`}
              onClick={() => onDensityChange('compact')}
            >
              1-page
            </button>
            <button
              type="button"
              className={`seg-btn ${density === 'normal' ? 'is-active' : ''}`}
              onClick={() => onDensityChange('normal')}
            >
              Roomier
            </button>
          </div>

          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Download PDF
          </button>
          <button type="button" className="btn" onClick={handleTxt}>
            .txt
          </button>

          <div className="menu">
            <button type="button" className="btn" onClick={handleJson}>
              Export
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => fileRef.current?.click()}
            >
              Import
            </button>
            <button type="button" className="btn btn-quiet" onClick={handleReset}>
              Reset
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleFile}
            />
          </div>
        </div>
      </div>

      {notice && <div className="toolbar-notice">{notice}</div>}
    </header>
  )
}
