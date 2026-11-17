'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/lib/game'
import { useSite } from '@/lib/store'

/* "GOAL!" yozuvi va stadiondan portfolioga kinematik o'tish.
   Ekran qisqa vaqtga qoplanadi — shu paytda sahna portfolio holatiga o'tkaziladi. */
export function GoalOverlay() {
  const { site } = useSite()
  const phase = useGame((s) => s.phase)
  const goals = useGame((s) => s.goals)
  const [cover, setCover] = useState(false)

  useEffect(() => {
    if (phase !== 'goal') return
    const a = setTimeout(() => setCover(true), 4300)
    const b = setTimeout(() => useGame.getState().setPhase('portfolio'), 4900)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [phase])

  // Portfolio ochilgach qoplama asta ko'tariladi
  useEffect(() => {
    if (phase !== 'portfolio' || !cover) return
    const id = setTimeout(() => setCover(false), 350)
    return () => clearTimeout(id)
  }, [phase, cover])

  return (
    <>
      <AnimatePresence>
        {phase === 'goal' && (
          <motion.div
            key={goals}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-start overflow-hidden pt-[9svh]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Oq chaqnash */}
            <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.9 }} />
            <motion.p
              className="display text-glow relative text-[clamp(5.5rem,21vw,17rem)] text-chalk"
              initial={{ scale: 3.2, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 13, delay: 0.15 }}
            >
              Goal!
            </motion.p>
            <motion.p
              className="label relative mt-2 rounded-full bg-ink/70 px-5 py-2 text-uz backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              #{site.player.number} {site.player.jerseyName} · {site.player.position}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-ink"
        initial={false}
        animate={{ opacity: cover ? 1 : 0 }}
        transition={{ duration: cover ? 0.5 : 0.9, ease: 'easeInOut' }}
      />
    </>
  )
}
