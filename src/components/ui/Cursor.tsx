'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Maxsus kursor: nuqta + kechikib ergashuvchi halqa.
   [data-cursor] atributli elementlar ustida halqa kattalashib, yozuv ko'rsatadi. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, textarea, label')
      const text = target?.dataset.cursor ?? ''
      const active = !!target
      gsap.to(ring.current, {
        scale: text ? 2.6 : active ? 1.7 : 1,
        backgroundColor: text ? 'rgba(25,195,230,0.92)' : 'rgba(25,195,230,0)',
        borderColor: active ? 'rgba(25,195,230,1)' : 'rgba(255,255,255,0.5)',
        duration: 0.3,
      })
      gsap.to(dot.current, { scale: active ? 0 : 1, duration: 0.2 })
      if (label.current) label.current.textContent = text
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[120] hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden>
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-uz opacity-0" />
      <div
        ref={ring}
        className="absolute -ml-[18px] -mt-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-white/50 opacity-0"
      >
        <span ref={label} className="font-mono text-[4.5px] font-medium uppercase tracking-[0.12em] text-ink" />
      </div>
    </div>
  )
}
