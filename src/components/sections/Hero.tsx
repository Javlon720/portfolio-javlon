'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, Gamepad2 } from 'lucide-react'
import { stage } from '@/lib/stage'
import { useGame } from '@/lib/game'
import { GameInput } from '@/components/game/GameInput'
import { Hud } from '@/components/game/Hud'
import { GoalOverlay } from '@/components/game/GoalOverlay'
import { navigateTo } from '@/lib/scroll'
import { overall, useSite } from '@/lib/store'
import { Magnetic } from '@/components/ui/Magnetic'
import { RevealText } from '@/components/ui/Reveal'
import { UzFlag } from '@/components/ui/Icons'

// Three.js faqat brauzerda va alohida chunk bo'lib yuklanadi
const StadiumCanvas = dynamic(() => import('@/components/three/StadiumCanvas'), { ssr: false })

const EASE = [0.2, 0.8, 0.2, 1] as const

export function Hero() {
  const { site } = useSite()
  const { player, hero } = site
  const wrap = useRef<HTMLElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLDivElement>(null)
  // Portfolio qatlamlari faqat gol urilgach (yoki Skip bosilgach) ko'rinadi
  const ready = useGame((s) => s.phase === 'portfolio')
  const goals = useGame((s) => s.goals)
  const [role, setRole] = useState(0)

  const replay = () => {
    stage.scroll = 0
    useGame.getState().setPhase('play')
  }

  // Kasb nomlari navbat bilan almashadi
  useEffect(() => {
    if (!ready || hero.roles.length < 2) return
    const id = setInterval(() => setRole((r) => (r + 1) % hero.roles.length), 2800)
    return () => clearInterval(id)
  }, [ready, hero.roles.length])

  // Skroll: kamera orbitasi (stage.scroll) + matn qatlamlarining almashinuvi
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => (stage.scroll = self.progress),
          },
        })
        .to(front.current, { autoAlpha: 0, y: -90, duration: 0.24 }, 0.02)
        .fromTo(back.current, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.5)
        .to(back.current, { autoAlpha: 0, y: -50, duration: 0.1 }, 0.9)
        .fromTo(shade.current, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.86)
    }, wrap)
    return () => ctx.revert()
  }, [])

  const rows = [
    ['Name', player.fullName],
    ['Squad number', String(player.number)],
    ['Position', player.position],
    ['Nation', player.nation],
    ['Based in', player.location],
    ['Status', player.available ? 'Open to offers' : 'Under contract'],
  ]

  return (
    <section id="top" ref={wrap} className="relative h-[250vh]">
      <div className={`sticky top-0 h-[100svh] overflow-hidden ${ready ? '' : 'touch-none'}`}>
        <StadiumCanvas />
        <GameInput />
        <Hud />
        <GoalOverlay />

        {/* O'qilishi uchun qorong'ilatish qatlamlari */}
        <div
          className={`pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(4_7_13/0.82)_0%,rgb(4_7_13/0.35)_38%,transparent_62%)] transition-opacity duration-1000 max-md:bg-[linear-gradient(180deg,rgb(4_7_13/0.8)_0%,rgb(4_7_13/0.25)_42%,transparent_60%)] ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div ref={shade} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

        {/* ------------------------------------------------ 1-qatlam: salomlashuv */}
        <div
          ref={front}
          className={`absolute inset-0 mx-auto flex max-w-[1500px] flex-col justify-start px-5 pt-28 md:justify-center md:px-10 md:pt-0 ${ready ? '' : 'pointer-events-none'}`}
        >
          <motion.div
            className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-mute"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <UzFlag className="h-3.5 w-7 rounded-[2px]" />
            <span className="text-chalk">№ {player.number}</span>
            <span className="h-px w-6 bg-white/30" />
            {player.position}
            {player.available && (
              <span className="flex items-center gap-2 rounded-full border border-grass/40 bg-grass/10 px-3 py-1 text-grass">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-grass" />
                Available
              </span>
            )}
          </motion.div>

          <h1 className="mt-5 md:mt-7">
            <span className="block font-display text-[clamp(1.6rem,3.4vw,3rem)] font-semibold uppercase italic tracking-wide text-chalk/80">
              <RevealText text={hero.greeting} show={ready} />
            </span>
            <span className="display text-glow block text-[clamp(4.6rem,15vw,15rem)] text-chalk">
              <RevealText text={player.firstName} show={ready} delay={0.12} />
            </span>
          </h1>

          <div className="mt-3 h-[1.25em] overflow-hidden font-display text-[clamp(1.7rem,4.2vw,3.8rem)] font-bold uppercase italic leading-none text-uz md:mt-5">
            <AnimatePresence mode="wait">
              {ready && (
                <motion.span
                  key={role}
                  className="block"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  {hero.roles[role]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="flex flex-1 flex-col md:flex-none"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.9, delay: ready ? 0.55 : 0, ease: EASE }}
          >
            <p className="mt-4 font-display text-[clamp(1.05rem,1.9vw,1.6rem)] font-semibold uppercase tracking-[0.18em] text-chalk">
              {hero.tagline}
            </p>
            <p className="mt-4 hidden max-w-md text-[0.95rem] leading-relaxed text-chalk/70 md:block">{hero.intro}</p>

            <div className="mb-16 mt-auto flex flex-wrap items-center gap-3 md:mb-0 md:mt-9">
              <Magnetic>
                <button
                  onClick={() => navigateTo('projects')}
                  data-cursor="Go"
                  className="label group flex items-center gap-3 rounded-full bg-uz px-7 py-4 font-medium text-ink shadow-[0_0_40px_rgb(25_195_230/0.45)] transition-transform active:scale-95"
                >
                  View projects
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => navigateTo('contact')}
                  className="label glass rounded-full px-7 py-4 text-chalk transition-colors hover:border-uz/60"
                >
                  Contact
                </button>
              </Magnetic>
              {site.game.enabled && (
                <button
                  onClick={replay}
                  className="label flex items-center gap-2 rounded-full px-4 py-4 text-mute transition-colors hover:text-uz"
                >
                  <Gamepad2 size={16} /> {goals > 0 ? 'Play again' : 'Play the match'}
                </button>
              )}
            </div>
          </motion.div>

          {/* Gologramma yorlig'i — o'yinchi yonida */}
          <motion.div
            className="hologram absolute right-4 top-[47%] w-[7.25rem] overflow-hidden rounded-xl px-3 py-2.5 md:right-[6%] md:top-[24%] md:w-52 md:px-4 md:py-3"
            initial={{ opacity: 0, scaleY: 0.02, filter: 'blur(8px)' }}
            animate={ready ? { opacity: 1, scaleY: 1, filter: 'blur(0px)' } : { opacity: 0, scaleY: 0.02, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, delay: ready ? 0.25 : 0, ease: EASE }}
          >
            <p className="label text-[0.6rem] text-uz/80">Player ID</p>
            <p className="display mt-1 text-[1.7rem] text-white md:text-5xl">{player.jerseyName}</p>
            <div className="mt-2 flex items-end justify-between font-mono text-[0.55rem] uppercase tracking-widest md:text-[0.65rem]">
              <span>
                #{player.number} · {player.positionShort}
              </span>
              <span className="display text-lg text-white md:text-2xl">
                {overall(site)}
                <span className="ml-1 font-mono text-[0.55rem] not-italic tracking-widest text-uz max-md:hidden">OVR</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------- 2-qatlam: forma orqasi / profil */}
        <div
          ref={back}
          className="invisible absolute inset-0 mx-auto flex max-w-[1500px] items-end px-5 pb-14 md:items-center md:justify-end md:px-10 md:pb-0"
        >
          <div className="glass w-full max-w-md rounded-3xl !bg-ink/70 p-5 md:p-8">
            <p className="label text-uz">Squad profile</p>
            <p className="display mt-2 text-5xl md:mt-3 md:text-7xl">
              <span className="text-outline">#</span>
              {player.number} {player.jerseyName}
            </p>
            <dl className="mt-4 divide-y divide-line md:mt-6">
              {rows.map(([k, v], i) => (
                <div key={k} className={`flex items-baseline justify-between gap-6 py-2 md:py-2.5 ${i === 0 || i === 4 ? 'max-md:hidden' : ''}`}>
                  <dt className="label text-[0.62rem] text-mute">{k}</dt>
                  <dd className="text-right text-sm font-semibold text-chalk">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <motion.div
          className="label pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-mute"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: ready ? 1.4 : 0, duration: ready ? 1 : 0.3 }}
        >
          <ArrowDown size={13} className="animate-bounce" />
          Scroll
        </motion.div>
      </div>
    </section>
  )
}
