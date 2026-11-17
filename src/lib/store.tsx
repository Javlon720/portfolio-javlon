'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { site as defaults, type SiteConfig } from '@/config/site'

/* site.ts dagi sozlamalar + brauzerda (localStorage) saqlangan o'zgartirishlar.
   Sozlash paneli shu yerga yozadi, butun sayt shu yerdan o'qiydi. */

export type Overrides = Partial<Pick<SiteConfig, 'player' | 'avatar' | 'kit' | 'skills' | 'projects' | 'socials'>>

const KEY = 'stadium-config-v1'

interface Ctx {
  site: SiteConfig
  overrides: Overrides
  update: (patch: Overrides) => void
  reset: () => void
}

const SiteContext = createContext<Ctx>({ site: defaults, overrides: {}, update: () => {}, reset: () => {} })

function merge(base: SiteConfig, o: Overrides): SiteConfig {
  return {
    ...base,
    player: { ...base.player, ...o.player },
    avatar: { ...base.avatar, ...o.avatar },
    kit: { ...base.kit, ...o.kit },
    socials: { ...base.socials, ...o.socials },
    skills: o.skills ?? base.skills,
    projects: o.projects ?? base.projects,
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({})

  // Saqlangan sozlamalarni faqat mount'dan keyin o'qiymiz (hydration mos kelishi uchun)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setOverrides(JSON.parse(raw))
    } catch {
      /* buzilgan yozuv — e'tiborsiz qoldiramiz */
    }
  }, [])

  const update = useCallback((patch: Overrides) => {
    setOverrides((prev) => {
      const next: Overrides = { ...prev }
      for (const key of Object.keys(patch) as (keyof Overrides)[]) {
        const value = patch[key]
        if (Array.isArray(value)) (next as Record<string, unknown>)[key] = value
        else (next as Record<string, unknown>)[key] = { ...(prev[key] as object), ...(value as object) }
      }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* xotira to'lgan bo'lishi mumkin (katta rasm) — sessiya ichida baribir ishlaydi */
      }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setOverrides({})
    try {
      localStorage.removeItem(KEY)
    } catch {}
  }, [])

  const value = useMemo(() => ({ site: merge(defaults, overrides), overrides, update, reset }), [overrides, update, reset])
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)

/** Kartadagi umumiy reyting */
export const overall = (site: SiteConfig) => site.player.rating
