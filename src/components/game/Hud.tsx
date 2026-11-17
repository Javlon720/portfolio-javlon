'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsRight, Volume2, VolumeX } from 'lucide-react'
import { rt, useGame } from '@/lib/game'
import { finishIntro } from '@/lib/stage'
import { useSite } from '@/lib/store'

/* O'yin interfeysi: vazifa, boshqaruv yo'riqnomasi, zarba kuchi, virtual joystik,
   "Skip" tugmasi (o'ynashni istamaganlar to'g'ridan-to'g'ri portfolioga o'tadi). */

/** Telefon uchun virtual joystik */
function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const id = useRef<number | null>(null)

  const set = (e: React.PointerEvent) => {
    if (!base.current) return
    const r = base.current.getBoundingClientRect()
    const max = r.width / 2
    let x = e.clientX - (r.left + max)
    let y = e.clientY - (r.top + max)
    const len = Math.hypot(x, y)
    if (len > max) {
      x = (x / len) * max
      y = (y / len) * max
    }
    rt.input.x = x / max
    rt.input.y = -y / max
    // Chetga to'liq surilsa — tezlanish
    rt.input.sprint = len > max * 0.92
    if (knob.current) knob.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const release = () => {
    id.current = null
    rt.input.x = rt.input.y = 0
    rt.input.sprint = false
    if (knob.current) knob.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={base}
      data-ui
      className="glass pointer-events-auto relative h-32 w-32 touch-none rounded-full"
      onPointerDown={(e) => {
        id.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        set(e)
      }}
      onPointerMove={(e) => id.current === e.pointerId && set(e)}
      onPointerUp={release}
      onPointerCancel={release}
      aria-label="Move joystick"
    >
      <div ref={knob} className="absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full bg-uz/80 shadow-[0_0_24px_var(--color-uz)]" />
    </div>
  )
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-white/25 bg-white/10 px-1.5 font-mono text-[0.65rem] text-chalk">
      {children}
    </kbd>
  )
}

export function Hud() {
  const { site } = useSite()
  const phase = useGame((s) => s.phase)
  const toast = useGame((s) => s.toast)
  const muted = useGame((s) => s.muted)
  const toggleMute = useGame((s) => s.toggleMute)
  const setPhase = useGame((s) => s.setPhase)
  const bar = useRef<HTMLDivElement>(null)
  const [touch, setTouch] = useState(false)

  useEffect(() => setTouch(window.matchMedia('(pointer: coarse)').matches), [])

  // Zarba kuchi chizig'i — React state'siz, to'g'ridan-to'g'ri DOM'ga
  useEffect(() => {
    let raf = 0
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${rt.charge})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const inGame = phase === 'intro' || phase === 'walk' || phase === 'play'
  const playing = phase === 'play'

  const skip = () => {
    finishIntro()
    setPhase('portfolio')
  }

  return (
    <AnimatePresence>
      {inGame && (
        <motion.div
          key="hud"
          className="pointer-events-none absolute inset-0 z-20 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Yuqori qator */}
          <div className="flex items-start justify-between gap-3 p-4 md:p-8">
            <div className="glass rounded-2xl px-4 py-3">
              <p className="label text-[0.6rem] text-uz">
                #{site.player.number} · {site.player.jerseyName}
              </p>
              <p className="display mt-1 text-2xl md:text-3xl">{playing ? 'Score a goal' : 'Kick-off'}</p>
              <p className="mt-1 max-w-[15rem] text-xs text-mute">
                {playing ? 'Aim for a corner and beat the keeper to unlock the portfolio.' : 'Walking out onto the pitch…'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2" data-ui>
              <button
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="glass pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={skip}
                className="label glass pointer-events-auto flex h-11 items-center gap-2 rounded-full px-4 text-chalk hover:border-uz hover:text-uz md:px-5"
              >
                Skip <span className="max-md:hidden">to portfolio</span> <ChevronsRight size={14} />
              </button>
            </div>
          </div>

          {/* Xabar: "Saved!" / "Wide!" */}
          <AnimatePresence>
            {toast && (
              <motion.p
                key={toast}
                className="display absolute inset-x-0 top-[30%] text-center text-5xl text-chalk drop-shadow-[0_0_30px_rgb(0_0_0/0.8)] md:text-7xl"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>

          {playing && (
            <>
              {/* Zarba kuchi */}
              <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 w-52 -translate-x-1/2 md:bottom-10 md:w-72">
                <p className="label mb-2 text-center text-[0.58rem] text-mute">Shot power</p>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div ref={bar} className="h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-uz via-grass to-flare" />
                </div>
              </div>

              {touch ? (
                <div className="absolute inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] flex items-end justify-between px-6">
                  <Joystick />
                  <button
                    data-ui
                    className="display pointer-events-auto flex h-24 w-24 touch-none items-center justify-center rounded-full bg-uz text-xl text-ink shadow-[0_0_40px_rgb(25_195_230/0.55)] active:scale-95"
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId)
                      rt.input.kick = true
                    }}
                    onPointerUp={() => (rt.input.kick = false)}
                    onPointerCancel={() => (rt.input.kick = false)}
                    aria-label="Kick (hold for power)"
                  >
                    Kick
                  </button>
                </div>
              ) : (
                <ul className="glass absolute bottom-8 left-8 space-y-2 rounded-2xl px-4 py-3 text-xs text-mute">
                  <li className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <Key>W</Key>
                      <Key>A</Key>
                      <Key>S</Key>
                      <Key>D</Key>
                    </span>
                    Move
                  </li>
                  <li className="flex items-center gap-2">
                    <Key>Shift</Key> Sprint
                  </li>
                  <li className="flex items-center gap-2">
                    <Key>Space</Key> Hold to charge, release to shoot
                  </li>
                  <li className="flex items-center gap-2">
                    <Key>Drag</Key> Look around
                  </li>
                </ul>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
