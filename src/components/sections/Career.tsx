'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useSite } from '@/lib/store'
import { FadeUp, SectionHeading } from '@/components/ui/Reveal'

/* Karyera rejimi: mavsumlar vaqt chizig'i. Chiziq skroll bilan "chiziladi". */
export function Career() {
  const { site } = useSite()
  const list = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  // Fon raqami parallaksi
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress: sp } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const ghostY = useTransform(sp, [0, 1], ['-12%', '18%'])

  return (
    <section id="career" ref={section} className="relative overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="pitch-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
      <motion.span
        aria-hidden
        style={{ y: ghostY }}
        className="display text-outline pointer-events-none absolute -right-6 top-10 select-none text-[34vw] opacity-40"
      >
        {site.player.number}
      </motion.span>

      <div className="relative mx-auto max-w-[1300px]">
        <SectionHeading index="03" kicker="Career mode" title="Clubs I have played for" />

        <ol ref={list} className="relative">
          {/* Vaqt chizig'i */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2" />
          <motion.div
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-uz via-uz to-grass shadow-[0_0_14px_var(--color-uz)] md:left-1/2"
            style={{ scaleY: line }}
          />

          {site.career.map((item, i) => {
            const left = i % 2 === 0
            return (
              <li key={item.club} className="relative grid pb-16 pl-12 last:pb-0 md:grid-cols-2 md:gap-24 md:pb-28 md:pl-0">
                <span className="absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-uz bg-ink md:left-1/2 md:-translate-x-1/2">
                  <span className="h-2 w-2 rounded-full bg-uz shadow-[0_0_12px_var(--color-uz)]" />
                </span>

                <FadeUp className={left ? 'md:text-right' : 'md:order-2'}>
                  <p className={`label flex items-center gap-3 text-mute ${left ? 'md:justify-end' : ''}`}>
                    Club {String(i + 1).padStart(2, '0')}
                    {item.current && (
                      <span className="flex items-center gap-2 rounded-full border border-grass/40 bg-grass/10 px-3 py-1 text-grass">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-grass" />
                        Now
                      </span>
                    )}
                  </p>
                  <p className="display mt-1 text-[clamp(4rem,10vw,8.5rem)] text-chalk">{item.club}</p>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="label mt-3 inline-block text-uz underline-offset-4 hover:underline">
                      {item.company} ↗
                    </a>
                  ) : (
                    <p className="label mt-3 text-uz">{item.company}</p>
                  )}
                </FadeUp>

                <FadeUp delay={0.12} className={left ? '' : 'md:order-1'}>
                  <div className="glass rounded-3xl p-6 md:p-8">
                    <h3 className="font-display text-3xl font-bold uppercase italic leading-none text-uz md:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-mute">{item.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <li key={t} className="label rounded-full border border-line px-3 py-1.5 text-[0.6rem] text-chalk/80">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
