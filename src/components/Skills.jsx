import { useApp } from '../context/AppContext'
import { skills } from '../data/content'
import SectionShell from './SectionShell'
import TechIcon from './TechIcons'
import { useReveal } from '../hooks/useReveal'

export default function Skills() {
  const { t, pick } = useApp()
  const ref = useReveal()

  return (
    <SectionShell id="skills" label={t.skills.label} title={t.skills.title}>
      <div ref={ref} className="reveal grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={pick(group.group)} className="rounded-card border border-border bg-card p-6">
            <h3 className="font-display text-sm font-bold tracking-[0.12em] uppercase">
              {pick(group.group)}
            </h3>

            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-chip border border-border px-3 py-1.5 text-sm text-muted-fg transition-colors duration-200 hover:border-accent hover:text-fg"
                >
                  <TechIcon name={item} size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
