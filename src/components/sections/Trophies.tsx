'use client'

import { Medal, ShieldCheck, Star, Trophy } from 'lucide-react'
import { useSite } from '@/lib/store'
import { FadeUp, SectionHeading } from '@/components/ui/Reveal'

const ICONS = { cup: Trophy, medal: Medal, star: Star, shield: ShieldCheck }

/* Kuboklar xonasi: har bir vitrina tepadan projektor bilan yoritilgan */
export function Trophies() {
  const { site } = useSite()
  return (
    <section id="trophies" className="relative overflow-hidden bg-[#06080c] px-5 py-28 md:px-10 md:py-40">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="gold-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff1c2" />
            <stop offset="0.5" stopColor="#e9c46a" />
            <stop offset="1" stopColor="#9a6f1d" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-[1300px]">
        <SectionHeading index="04" kicker="Trophy room" title="Silverware" />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {site.trophies.map((t, i) => {
            const Icon = ICONS[t.kind]
            return (
              <FadeUp key={t.id} delay={i * 0.09} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-white/[0.05] to-transparent px-6 pb-7 pt-0">
                  {/* Projektor nuri */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: 'conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgb(233 196 106 / 0.28) 20deg, transparent 40deg)',
                      filter: 'blur(14px)',
                    }}
                  />
                  <div className="mx-auto h-1 w-16 rounded-b-full bg-gold shadow-[0_0_24px_4px_rgb(233_196_106/0.7)]" />

                  <div className="relative mx-auto mt-10 flex h-36 w-36 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(233_196_106/0.22),transparent)] transition-transform duration-700 group-hover:scale-125" />
                    <Icon
                      size={92}
                      strokeWidth={1}
                      stroke="url(#gold-stroke)"
                      className="relative drop-shadow-[0_0_18px_rgb(233_196_106/0.55)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[-6deg]"
                    />
                  </div>
                  {/* Vitrina poydevori */}
                  <div className="mx-auto h-2 w-28 rounded-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                  <p className="label mt-7 text-gold">{t.title}</p>
                  <p className="display mt-2 break-words text-[clamp(2.4rem,4vw,3.4rem)] text-chalk">{t.value}</p>
                  <p className="mt-1 text-sm text-mute">{t.caption}</p>

                  <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-chalk/80">
                    {t.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
