import { useEffect, useState } from 'react'
import { Check, Copy, Mail, MapPin, Phone } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { profile } from '../data/content'
import SectionShell from './SectionShell'
import SocialLinks from './SocialLinks'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const { t, pick } = useApp()
  const ref = useReveal()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      // Clipboard ruxsat bermasa — mailto oynasini ochamiz
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <SectionShell id="contact" label={t.contact.label} title={t.contact.title}>
      <div ref={ref} className="reveal rounded-card border border-border bg-card p-6 sm:p-10">
        <p className="max-w-xl text-base leading-relaxed text-muted-fg sm:text-lg">
          {t.contact.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-chip bg-fg px-6 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85"
          >
            <Mail size={16} aria-hidden="true" />
            {t.contact.emailMe}
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-chip border border-border px-6 text-sm font-semibold transition-colors duration-200 hover:bg-muted"
          >
            {copied ? (
              <Check size={16} aria-hidden="true" className="text-emerald-500" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {copied ? t.contact.copied : t.contact.copy}
          </button>

          {/* Ekran o'qigichlar nusxalanganini eshitishi uchun */}
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? t.contact.copied : ''}
          </span>
        </div>

        <dl className="mt-10 grid gap-5 border-t border-border pt-8 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-fg uppercase">
              <Mail size={14} aria-hidden="true" />
              Email
            </dt>
            <dd className="mt-1.5">
              <a
                href={`mailto:${profile.email}`}
                className="cursor-pointer text-sm break-all hover:text-accent"
              >
                {profile.email}
              </a>
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-fg uppercase">
              <Phone size={14} aria-hidden="true" />
              {t.nav.contact}
            </dt>
            <dd className="mt-1.5">
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="cursor-pointer text-sm hover:text-accent"
              >
                {profile.phone}
              </a>
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-fg uppercase">
              <MapPin size={14} aria-hidden="true" />
              {pick({ uz: 'Manzil', en: 'Location', ru: 'Адрес', ja: '所在地' })}
            </dt>
            <dd className="mt-1.5 text-sm text-muted-fg">{pick(profile.location)}</dd>
          </div>
        </dl>

        <SocialLinks className="mt-8 -ml-3" />
      </div>
    </SectionShell>
  )
}
