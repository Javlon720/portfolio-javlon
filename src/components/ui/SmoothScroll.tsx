'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis, setLenis } from '@/lib/scroll'
import { prefersReducedMotion } from '@/lib/stage'
import { useGame } from '@/lib/game'

gsap.registerPlugin(ScrollTrigger)

/** Lenis silliq skrolli, GSAP ticker va ScrollTrigger bilan sinxron */
export function SmoothScroll() {
  const locked = useGame((s) => s.phase !== 'portfolio')

  // O'yin paytida sahifa skrolli qulflanadi; portfolio ochilgach bo'shatiladi
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked)
    if (locked) {
      window.scrollTo(0, 0)
      getLenis()?.scrollTo(0, { immediate: true, force: true })
      getLenis()?.stop()
    } else {
      getLenis()?.start()
      ScrollTrigger.refresh()
    }
  }, [locked])

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    setLenis(lenis)
    if (document.documentElement.classList.contains('is-locked')) lenis.stop()

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
