import { MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { profile } from '../data/content'
import SectionShell from './SectionShell'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const { t, pick } = useApp()
  const ref = useReveal()

  return (
    <SectionShell id="about" label={t.about.label} title={t.about.title}>
      <div ref={ref} className="reveal grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {t.about.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-fg sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="h-fit rounded-card border border-border bg-card p-6">
          {/* Avatar o'rniga: monogramma. O'z rasmingizni qo'ysangiz
              <img src="/avatar.jpg" alt={profile.name} /> qiling. */}
          <div className="font-display grid aspect-square w-20 place-items-center rounded-chip bg-fg text-2xl font-bold text-bg">
            {profile.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <p className="font-display mt-5 text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-fg">{pick(profile.role)}</p>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-fg">
            <MapPin size={15} aria-hidden="true" className="shrink-0" />
            {pick(profile.location)}
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-4 block cursor-pointer text-sm break-all text-accent underline-offset-4 hover:underline"
          >
            {profile.email}
          </a>
        </aside>
      </div>
    </SectionShell>
  )
}
