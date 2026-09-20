import { ArrowDown, ArrowUpRight, Download, Mail } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { profile, stats } from '../data/content'
import SocialLinks from './SocialLinks'
import HeroIntro from './HeroIntro'

export default function Hero() {
  const { t, pick, lang } = useApp()

  // Salom -> ism -> kasb -> tavsif: birin-ketin yozilib chiqadi
  const lines = [t.hero.greeting, profile.name, pick(profile.role), t.hero.tagline]

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-fg"
          role="status"
        >
          <span className="relative flex size-2">
            {profile.available && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            )}
            <span
              className={`relative inline-flex size-2 rounded-full ${
                profile.available ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>
          {profile.available ? t.hero.available : t.hero.unavailable}
        </div>

        {/* key={lang} — til almashsa animatsiya boshidan boshlanadi */}
        <HeroIntro key={lang} lines={lines} />

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-chip bg-fg px-6 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85"
          >
            {t.hero.cta}
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <a
            href="#contact"
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-chip border border-border px-6 text-sm font-semibold transition-colors duration-200 hover:bg-muted"
          >
            <Mail size={16} aria-hidden="true" />
            {t.hero.secondary}
          </a>

          <a
            href={profile.resumeUrl}
            download
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-chip px-4 text-sm font-medium text-muted-fg transition-colors duration-200 hover:text-fg"
          >
            <Download size={16} aria-hidden="true" />
            {t.hero.resume}
          </a>
        </div>

        <SocialLinks className="mt-6 -ml-3" />

        {/* Statistika */}
        <dl className="mt-16 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.value}
              className="rounded-card border border-border bg-card px-5 py-6"
            >
              <dt className="sr-only">{pick(s.label)}</dt>
              <dd>
                <span className="font-display block text-3xl font-bold sm:text-4xl">{s.value}</span>
                <span className="mt-1 block text-sm text-muted-fg">{pick(s.label)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <a
          href="#about"
          className="mt-12 inline-flex cursor-pointer items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-fg uppercase transition-colors duration-200 hover:text-fg"
        >
          <ArrowDown size={14} aria-hidden="true" className="animate-bounce" />
          {t.hero.scroll}
        </a>
      </div>
    </section>
  )
}
