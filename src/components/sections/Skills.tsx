'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { overall, useSite } from '@/lib/store'
import { FadeUp, SectionHeading } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { UzFlag } from '@/components/ui/Icons'

/** Ko'ringanda 0 dan qiymatgacha sanaydigan raqam */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, { duration: 1.6, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value])
  return <span ref={ref}>{n}</span>
}

/** FIFA uslubidagi o'yinchi kartasi */
function PlayerCard() {
  const { site } = useSite()
  const { player, avatar, skills } = site
  return (
    <TiltCard max={14} cursor="Tilt" className="mx-auto w-[min(21rem,82vw)]">
      <div className="card-shield gold-surface relative aspect-[5/7.4] overflow-hidden text-[#2b1f08] shadow-2xl">
        {/* Yaltirash */}
        <div className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/40 blur-xl [animation:sheen_5s_ease-in-out_infinite]" />
        <div className="absolute inset-[7px] card-shield border border-[#6d4f12]/35" />

        <div className="relative flex h-[52%] px-[11%] pt-[13%]">
          <div className="flex flex-col items-center">
            <span className="display text-6xl not-italic leading-none">{overall(site)}</span>
            <span className="font-display text-xl font-bold uppercase leading-tight">{player.positionShort}</span>
            <span className="my-2 h-px w-8 bg-[#2b1f08]/40" />
            <UzFlag className="h-5 w-9 rounded-[2px] shadow" />
            <span className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#2b1f08] font-display text-sm font-bold text-[#f0d892]">
              {player.number}
            </span>
          </div>
          <div className="relative ml-2 flex-1 self-end">
            {avatar.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar.photo}
                alt={player.fullName}
                className="aspect-square w-full rounded-full object-cover shadow-[0_10px_30px_rgb(60_40_0/0.5)] ring-2 ring-[#2b1f08]/30"
                style={{ objectPosition: `50% ${50 - avatar.faceOffsetY * 30}%` }}
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-full bg-[#2b1f08]/85 shadow-[0_10px_30px_rgb(60_40_0/0.5)]">
                <span className="display text-7xl text-[#f0d892]">{player.firstName.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative px-[11%] text-center">
          <p className="display border-b border-[#2b1f08]/30 pb-1.5 pt-3 text-4xl not-italic tracking-wide">{player.jerseyName}</p>
          <ul className="mx-auto mt-3 grid w-fit grid-cols-2 gap-x-7 gap-y-0.5 text-left">
            {skills.slice(0, 6).map((s) => (
              <li key={s.short} className="flex items-baseline gap-2 font-display text-[1.35rem] leading-tight">
                <b className="w-7 font-extrabold tabular-nums">{s.value}</b>
                <span className="font-semibold uppercase tracking-wide opacity-80">{s.short}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TiltCard>
  )
}

export function Skills() {
  const { site } = useSite()

  return (
    <section id="skills" className="relative overflow-hidden bg-night px-5 py-28 md:px-10 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(233_196_106/0.13),transparent)]" />
      <div className="relative mx-auto max-w-[1300px]">
        <SectionHeading index="01" kicker="Player profile" title="The player" />

        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-24">
          <FadeUp>
            <PlayerCard />
          </FadeUp>

          <ul className="space-y-7">
            {site.skills.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.07}>
                <li>
                  <div className="flex items-end justify-between">
                    <span className="font-display text-2xl font-bold uppercase italic tracking-wide md:text-3xl">{s.label}</span>
                    <span className="display text-5xl text-uz md:text-6xl">
                      <Counter value={s.value} />
                      <span className="ml-0.5 text-2xl text-mute">%</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-uzdeep via-uz to-grass shadow-[0_0_18px_var(--color-uz)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 1.5, delay: 0.1 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </div>

        {/* Texnologiyalar — "asosiy tarkib" */}
        <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.stack.map((g, i) => (
            <FadeUp key={g.group} delay={(i % 4) * 0.06}>
              <div className="glass h-full rounded-2xl p-5">
                <p className="label text-uz">{g.group}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li key={item} className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[0.8rem] text-chalk/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
