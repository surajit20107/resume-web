// Compact Light / Dark / System switch. Icons are inline SVG so they render
// consistently without depending on emoji fonts.

const ICONS = {
  light: (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2.6v2.5M12 18.9v2.5M2.6 12h2.5M18.9 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
      </g>
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z"
        fill="currentColor"
      />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.9a8.1 8.1 0 0 1 0 16.2z" fill="currentColor" />
    </svg>
  ),
}

const OPTIONS = [
  { id: 'light', label: 'Light theme' },
  { id: 'dark', label: 'Dark theme' },
  { id: 'system', label: 'Match system theme' },
]

export default function ThemeToggle({ theme, onChange }) {
  return (
    <div className="seg" role="group" aria-label="Color theme">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`seg-btn seg-btn-icon ${theme === option.id ? 'is-active' : ''}`}
          title={option.label}
          aria-label={option.label}
          aria-pressed={theme === option.id}
          onClick={() => onChange(option.id)}
        >
          {ICONS[option.id]}
        </button>
      ))}
    </div>
  )
}
