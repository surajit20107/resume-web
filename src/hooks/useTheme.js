import { useCallback, useEffect, useState } from 'react'
import { THEME_KEY } from '../lib/resumeIO'

export const THEMES = ['light', 'dark', 'system']

function readStoredTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (THEMES.includes(saved)) return saved
  } catch {
    // Storage unavailable — fall back to the system preference.
  }
  return 'system'
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Color theme with three modes: 'light', 'dark' and 'system'.
 * `theme` is what the user picked; `resolved` is what is actually shown.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setSystemDark(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolved)
    root.style.colorScheme = resolved
  }, [resolved])

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore storage errors.
    }
  }, [theme])

  const cycle = useCallback(() => {
    setTheme((current) => THEMES[(THEMES.indexOf(current) + 1) % THEMES.length])
  }, [])

  return { theme, resolved, setTheme, cycle }
}
