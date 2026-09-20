import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useActiveSection } from '../hooks/useReveal'
import { languages, profile, sections } from '../data/content'

export default function Navbar() {
  const { t, lang, theme, setLang, toggleTheme } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const active = useActiveSection(sections)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobil menyu ochiqda: orqa fon scroll qilinmasin, Esc bilan yopilsin
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Til ro'yxati: tashqariga bosilganda yoki Esc bosilganda yopiladi
  useEffect(() => {
    if (!langOpen) return
    const onDown = (e) => {
      if (!langRef.current?.contains(e.target)) setLangOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setLangOpen(false)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      {/* Klaviatura foydalanuvchilari uchun: menyuni tashlab o'tish */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-chip focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg"
      >
        {lang === 'uz' ? 'Asosiy qismga o‘tish' : 'Skip to content'}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? 'border-b border-border bg-bg/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#hero"
            className="font-display cursor-pointer text-sm font-bold tracking-tight"
            aria-label={profile.name}
          >
            <span className="rounded-chip bg-fg px-2 py-1 text-bg">{initials}</span>
          </a>

          {/* Desktop menyu */}
          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={`relative cursor-pointer px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active === id ? 'text-fg' : 'text-muted-fg hover:text-fg'
                  }`}
                >
                  {t.nav[id]}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-0.5 bg-accent transition-transform duration-300 ${
                      active === id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t.a11y.toggleLang}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="font-display flex h-11 cursor-pointer items-center gap-1 rounded-chip px-3 text-xs font-bold tracking-wider text-muted-fg transition-colors duration-200 hover:text-fg"
              >
                {current.short}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {langOpen && (
                <ul
                  role="listbox"
                  aria-label={t.a11y.toggleLang}
                  className="absolute top-full right-0 z-10 mt-1 min-w-40 rounded-card border border-border bg-card py-1 shadow-lg"
                >
                  {languages.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={l.code === lang}
                        lang={l.code}
                        onClick={() => {
                          setLang(l.code)
                          setLangOpen(false)
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-muted ${
                          l.code === lang ? 'text-fg' : 'text-muted-fg'
                        }`}
                      >
                        {l.label}
                        {l.code === lang && (
                          <Check size={14} aria-hidden="true" className="text-accent" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.a11y.toggleTheme}
              className="grid size-11 cursor-pointer place-items-center rounded-chip text-muted-fg transition-colors duration-200 hover:text-fg"
            >
              {theme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              aria-expanded={open}
              className="grid size-11 cursor-pointer place-items-center rounded-chip text-fg md:hidden"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Mobil menyu */}
        {open && (
          <div className="border-t border-border bg-bg md:hidden">
            <ul className="mx-auto w-full max-w-5xl px-5 py-2 sm:px-8">
              {sections.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`block cursor-pointer border-b border-border py-4 text-base font-medium transition-colors last:border-b-0 ${
                      active === id ? 'text-accent' : 'text-fg'
                    }`}
                  >
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  )
}
