'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { NAV_EVENT, jumpTo } from '@/lib/scroll'
import { prefersReducedMotion } from '@/lib/stage'

/* Bo'limlar orasidagi o'tish: beshta yo'lak pastdan ko'tarilib ekranni yopadi,
   sahifa kerakli bo'limga sakraydi, so'ng yo'laklar tepaga chiqib ketadi. */
export function Curtain() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let busy = false
    const onNav = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (prefersReducedMotion() || !root.current) return jumpTo(id)
      if (busy) return
      busy = true
      const bars = root.current.children
      gsap
        .timeline({ onComplete: () => void (busy = false) })
        .set(root.current, { visibility: 'visible' })
        .fromTo(bars, { yPercent: 100 }, { yPercent: 0, duration: 0.5, stagger: 0.05, ease: 'power3.inOut' })
        .call(() => jumpTo(id))
        .to(bars, { yPercent: -100, duration: 0.55, stagger: 0.05, ease: 'power3.inOut' }, '+=0.12')
        .set(root.current, { visibility: 'hidden' })
    }
    window.addEventListener(NAV_EVENT, onNav)
    return () => window.removeEventListener(NAV_EVENT, onNav)
  }, [])

  return (
    <div ref={root} className="pointer-events-none invisible fixed inset-0 z-[90] flex" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-full flex-1 border-x border-uz/20 bg-night" style={{ transform: 'translateY(100%)' }} />
      ))}
    </div>
  )
}
