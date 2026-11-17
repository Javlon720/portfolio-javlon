'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUp, Check, Copy, Mail } from 'lucide-react'
import { navigateTo } from '@/lib/scroll'
import { useSite } from '@/lib/store'
import { Magnetic } from '@/components/ui/Magnetic'
import { FadeUp, RevealText } from '@/components/ui/Reveal'
import { GithubIcon, LinkedinIcon, TelegramIcon } from '@/components/ui/Icons'

const TunnelCanvas = dynamic(() => import('@/components/three/TunnelCanvas'), { ssr: false })

/* Stadiondan chiqish tunneli. 3D sahna faqat bo'limga yaqinlashganda yuklanadi. */
export function Contact() {
  const { site } = useSite()
  const { socials, player } = site
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '60% 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socials.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard ruxsati yo'q — mailto havolasi baribir ishlaydi */
    }
  }

  const links = [
    { label: 'GitHub', href: socials.github, icon: <GithubIcon className="h-5 w-5" /> },
    { label: 'LinkedIn', href: socials.linkedin, icon: <LinkedinIcon className="h-5 w-5" /> },
    { label: 'Email', href: `mailto:${socials.email}`, icon: <Mail size={20} /> },
    ...(socials.telegram ? [{ label: 'Telegram', href: socials.telegram, icon: <TelegramIcon className="h-5 w-5" /> }] : []),
  ]

  return (
    <section id="contact" ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#03060a]">
      {near && <TunnelCanvas />}
      {/* Markaz matn uchun qoraytiriladi, tunnel harakati chetlarda ko'rinadi */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_46%,rgb(3_6_10/0.86)_0%,rgb(3_6_10/0.6)_45%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06080c] to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center px-5 py-28 text-center md:px-10">
        <FadeUp className="label flex items-center gap-3 text-uz">
          <span className="text-mute">05</span>
          <span className="h-px w-10 bg-uz/60" />
          Players&apos; tunnel
        </FadeUp>

        <h2 className="display text-glow mt-6 text-[clamp(3.4rem,11vw,10rem)]">
          <RevealText text="Ready for the" />
          <br />
          <RevealText text="next match?" delay={0.15} className="text-uz" />
        </h2>

        <FadeUp delay={0.2}>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-chalk/75">
            Got a project, a role or just a question? Send a message — I usually reply within a day.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="mt-10">
          <div className="glass flex items-center gap-2 rounded-full py-2 pl-6 pr-2">
            <a href={`mailto:${socials.email}`} className="break-all font-mono text-sm text-chalk hover:text-uz md:text-base">
              {socials.email}
            </a>
            <button
              onClick={copy}
              aria-label="Copy email address"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-uz hover:text-ink"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </FadeUp>

        <FadeUp delay={0.4} className="mt-8">
          <ul className="flex flex-wrap justify-center gap-4">
            {links.map((l) => (
              <li key={l.label}>
                <Magnetic strength={0.45}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="label glass group flex items-center gap-3 rounded-full px-7 py-5 text-chalk transition-all duration-300 hover:border-uz hover:bg-uz hover:text-ink hover:shadow-[0_0_50px_rgb(25_195_230/0.5)]"
                  >
                    {l.icon}
                    {l.label}
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      <footer className="relative flex flex-col items-center justify-between gap-4 border-t border-line px-5 py-6 text-xs text-mute md:flex-row md:px-10">
        <p>
          © {new Date().getFullYear()} {player.fullName} · #{player.number} · {player.location}
        </p>
        <button onClick={() => navigateTo('top')} className="label flex items-center gap-2 hover:text-uz">
          Back to pitch <ArrowUp size={13} />
        </button>
      </footer>
    </section>
  )
}
