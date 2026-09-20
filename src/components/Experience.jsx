import { ArrowUpRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { experience } from '../data/content'
import SectionShell from './SectionShell'
import { useReveal } from '../hooks/useReveal'

export default function Experience() {
  const { t, pick } = useApp()
  const ref = useReveal()

  return (
    <SectionShell id="experience" label={t.experience.label} title={t.experience.title}>
      <ol ref={ref} className="reveal relative border-l border-border">
        {experience.map((job) => (
          <li key={job.id} className="relative pb-10 pl-8 last:pb-0">
            {/* Vaqt chizig'idagi nuqta */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent ring-4 ring-bg"
            />

            <p className="font-display text-xs font-medium tracking-[0.12em] text-muted-fg uppercase">
              {pick(job.period)}
            </p>

            <h3 className="font-display mt-2 text-lg font-bold">
              {pick(job.role)}
              <span className="text-muted-fg"> · </span>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex cursor-pointer items-center gap-0.5 text-accent underline-offset-4 hover:underline"
                >
                  {job.company}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <span className="text-accent">{job.company}</span>
              )}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg sm:text-base">
              {pick(job.summary)}
            </p>

            <ul className="mt-3 flex flex-wrap gap-2">
              {job.stack.map((tech) => (
                <li key={tech} className="rounded-chip bg-muted px-2.5 py-1 text-xs font-medium text-muted-fg">
                  {tech}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
