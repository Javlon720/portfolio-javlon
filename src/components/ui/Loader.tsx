'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { READY_EVENT, finishIntro, prefersReducedMotion, startIntro } from '@/lib/stage'
import { useGame } from '@/lib/game'
import { useSite } from '@/lib/store'

/* Yuklanish ekrani: 3D sahna tayyor bo'lguncha hisoblagich aylanadi,
   so'ng parda ko'tarilib, stadion chiroqlari yonadi. */
export function Loader() {
  const { site } = useSite()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const ready = useRef(false)

  useEffect(() => {
    const onReady = () => (ready.current = true)
    window.addEventListener(READY_EVENT, onReady)
    // Sahna hech qachon tayyor bo'lmasa ham (WebGL yo'q) sayt ochilishi kerak
    const safety = setTimeout(onReady, 7000)

    let raf = 0
    let value = 0
    const start = performance.now()
    const loop = () => {
      const elapsed = performance.now() - start
      // Tayyor bo'lguncha 88% da kutadi, keyin tez yakunlanadi
      const target = ready.current && elapsed > 1400 ? 100 : Math.min(88, elapsed / 22)
      value += (target - value) * 0.09
      if (target === 100 && value > 99.4) value = 100
      setProgress(Math.round(value))
      if (value < 100) raf = requestAnimationFrame(loop)
      else setTimeout(() => setDone(true), 260)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      window.removeEventListener(READY_EVENT, onReady)
    }
  }, [])

  useEffect(() => {
    if (!done) return
    const { setPhase } = useGame.getState()
    // O'yin o'chirilgan yoki animatsiyalar cheklangan bo'lsa — to'g'ridan-to'g'ri portfolio
    if (!site.game.enabled || prefersReducedMotion()) {
      finishIntro()
      setPhase('portfolio')
      return
    }
    setPhase('intro')
    startIntro(() => useGame.getState().phase === 'intro' && useGame.getState().setPhase('walk'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="pitch-lines absolute inset-0 opacity-60" />
          {/* Markaziy doira — maydon chizig'i */}
          <svg viewBox="0 0 200 200" className="absolute h-[62vmin] w-[62vmin] -rotate-90 opacity-70">
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="1" />
            <circle
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="var(--color-uz)"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${progress} 100`}
              style={{ filter: 'drop-shadow(0 0 6px var(--color-uz))' }}
            />
          </svg>

          <p className="label relative text-mute">Entering the stadium</p>
          <p className="display relative mt-3 text-[clamp(5rem,22vmin,13rem)] tabular-nums text-chalk">
            {String(progress).padStart(2, '0')}
            <span className="text-uz">%</span>
          </p>
          <p className="label relative mt-2 text-uz">
            #{site.player.number} · {site.player.jerseyName}
          </p>

          <div className="absolute bottom-10 flex gap-2" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 w-10 rounded-full transition-all duration-300"
                style={{
                  background: progress > (i + 1) * 22 ? 'var(--color-uz)' : 'rgb(255 255 255 / 0.1)',
                  boxShadow: progress > (i + 1) * 22 ? '0 0 14px var(--color-uz)' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
