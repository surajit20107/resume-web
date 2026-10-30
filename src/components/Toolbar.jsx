import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'
import { copyText, downloadBlob, printResume, slugify, toPlainText } from '../lib/resumeIO'

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
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const pasteRef = useRef(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!pasteOpen) return
    pasteRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPasteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pasteOpen])

  const baseName = slugify(resume.name)

  const handlePrint = () => {
    toast(
      'In the print dialog pick "Save as PDF". Turn off "Headers and footers" and use Default margins for the cleanest, most ATS-friendly file.',
      { duration: 9000, icon: '🖨️' },
    )
    // Let the toast render before the (blocking) print dialog opens.
    window.setTimeout(() => printResume(), 80)
  }

  const handleTxt = () => {
    downloadBlob(`${baseName}-resume.txt`, toPlainText(resume))
    toast.success('Downloaded a plain-text (.txt) version — the most ATS-safe format.')
  }

  const handleJson = () => {
    downloadBlob(
      `${baseName}-resume.json`,
      JSON.stringify(resume, null, 2),
      'application/json;charset=utf-8',
    )
    toast.success('Exported your resume data (JSON). Keep it to restore later.')
  }

  const handleCopyJson = async () => {
    const copied = await copyText(JSON.stringify(resume, null, 2))
    if (copied) {
      toast.success('Copied your resume data (JSON) to the clipboard.')
    } else {
      toast.error('Could not copy to the clipboard — your browser blocked it.')
    }
  }

  const handlePasteOpen = () => {
    setPasteText('')
    setPasteOpen(true)
  }

  const handlePasteImport = () => {
    const text = pasteText.trim()
    if (!text) {
      toast.error('Paste the JSON you were sent, then choose "Use this resume".')
      return
    }
    try {
      const parsed = JSON.parse(text)
      if (onImport(parsed)) {
        setPasteOpen(false)
        setPasteText('')
        toast.success('Resume imported from the pasted JSON.')
      } else {
        toast.error('That JSON does not look like a resume export.')
      }
    } catch {
      toast.error('Could not read that as JSON — check the text and try again.')
    }
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (onImport(parsed)) {
          toast.success('Resume imported successfully.')
        } else {
          toast.error('That JSON file does not look like a resume export.')
        }
      } catch {
        toast.error('Could not read that file as JSON.')
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
      toast.success('Reset to the default resume content.')
    }
  }

  return (
    <>
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
            <button type="button" className="btn" onClick={handleCopyJson}>
              Copy JSON
            </button>
            <button type="button" className="btn" onClick={handlePasteOpen}>
              Paste JSON
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
              <button type="button" className="btn btn-danger" onClick={handleReset}>
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

            <div className="menu">
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>

      </header>

      {pasteOpen &&
        createPortal(
          <div
            className="modal-backdrop no-print"
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) setPasteOpen(false)
            }}
          >
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="paste-json-title"
            >
              <h2 className="modal-title" id="paste-json-title">
                Paste shared resume JSON
              </h2>
              <p className="modal-sub">
                Paste the JSON someone shared with you (from their "Copy JSON"
                button). It will replace the resume in this browser.
              </p>
              <textarea
                ref={pasteRef}
                className="modal-textarea"
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
                placeholder='{ "name": "Ada Lovelace", ... }'
                spellCheck="false"
                rows={10}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setPasteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasteImport}
                >
                  Use this resume
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
