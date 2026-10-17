import { useCallback, useEffect, useState } from 'react'
import { defaultResume } from '../data/resume'
import { DENSITY_KEY, RESUME_KEY, clone } from '../lib/resumeIO'

function loadResume() {
  try {
    const raw = window.localStorage.getItem(RESUME_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string') {
        // Merge over defaults so new fields added in code still show up.
        return { ...clone(defaultResume), ...parsed }
      }
    }
  } catch {
    // Corrupted or unavailable storage — fall back to the defaults.
  }
  return clone(defaultResume)
}

function loadDensity() {
  try {
    const saved = window.localStorage.getItem(DENSITY_KEY)
    if (saved === 'normal' || saved === 'compact') return saved
  } catch {
    // Ignore storage errors.
  }
  return 'compact'
}

/** Resume state with automatic localStorage persistence. */
export function useResume() {
  const [resume, setResume] = useState(loadResume)
  const [density, setDensity] = useState(loadDensity)

  useEffect(() => {
    try {
      window.localStorage.setItem(RESUME_KEY, JSON.stringify(resume))
    } catch {
      // Storage full or blocked (private mode) — the page still works.
    }
  }, [resume])

  useEffect(() => {
    try {
      window.localStorage.setItem(DENSITY_KEY, density)
    } catch {
      // Ignore storage errors.
    }
  }, [density])

  const reset = useCallback(() => {
    setResume(clone(defaultResume))
  }, [])

  const importResume = useCallback((data) => {
    if (data && typeof data === 'object' && typeof data.name === 'string') {
      setResume({ ...clone(defaultResume), ...data })
      return true
    }
    return false
  }, [])

  return { resume, setResume, density, setDensity, reset, importResume }
}
