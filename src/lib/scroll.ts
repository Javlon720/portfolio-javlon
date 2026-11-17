import type Lenis from 'lenis'

/* Lenis nusxasi va bo'limlar orasidagi "parda" o'tishi uchun yordamchilar */
let lenis: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  lenis = l
}
export const getLenis = () => lenis

export const NAV_EVENT = 'stadium:navigate'

/** Parda animatsiyasi bilan bo'limga o'tish */
export function navigateTo(id: string) {
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: id }))
}

/** Darhol (animatsiyasiz) bo'limga sakrash — parda yopiq paytda chaqiriladi */
export function jumpTo(id: string) {
  const el = id === 'top' ? document.body : document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { immediate: true, force: true })
  else window.scrollTo(0, id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY)
}
