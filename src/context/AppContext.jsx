import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { languages, ui } from '../data/content'

const CODES = languages.map((l) => l.code)

const AppContext = createContext(null)

const getInitialLang = () => {
  if (typeof window === 'undefined') return 'uz'
  const saved = localStorage.getItem('lang')
  if (CODES.includes(saved)) return saved
  // Brauzer tili mos kelsa o'shani olamiz (ja-JP -> ja), aks holda ingliz
  const nav = navigator.language?.toLowerCase() ?? ''
  return CODES.find((c) => nav.startsWith(c)) ?? 'en'
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(
    () => ({
      lang,
      theme,
      setLang,
      toggleTheme,
      t: ui[lang],
      // { uz, en, ru, ja } maydonidan joriy tildagisini oladi.
      // Tarjima yozilmagan bo'lsa inglizchaga, u ham bo'lmasa o'zbekchaga tushadi.
      pick: (field) =>
        field && typeof field === 'object' ? (field[lang] ?? field.en ?? field.uz) : field,
    }),
    [lang, theme, toggleTheme],
  )

  return <AppContext value={value}>{children}</AppContext>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
