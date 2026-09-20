import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { useApp } from '../context/AppContext'
import { projects } from '../data/content'
import SectionShell from './SectionShell'
import { useReveal } from '../hooks/useReveal'

function ProjectCard({ project, featured }) {
  const { t, pick } = useApp()

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-card border border-border bg-card transition-colors duration-300 hover:border-accent ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      {/* Rasm yoki gradient plashka */}
      <div
        className={`relative overflow-hidden border-b border-border ${
          featured ? 'aspect-[2.4/1]' : 'aspect-[16/10]'
        }`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={pick(project.title)}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-full place-items-center bg-accent-soft bg-[radial-gradient(circle_at_30%_20%,var(--color-accent)_0%,transparent_55%)] opacity-90"
          >
            <span className="font-display text-4xl font-bold text-fg/15 select-none">
              {pick(project.title).charAt(0)}
            </span>
          </div>
        )}

        <span className="font-display absolute top-3 right-3 rounded-chip bg-bg/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
          {project.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold">{pick(project.title)}</h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-fg">
          {pick(project.description)}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-chip bg-muted px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted-fg"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center gap-1.5 py-2 text-sm font-semibold transition-colors duration-200 hover:text-accent"
            >
              {t.projects.live}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}

          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center gap-1.5 py-2 text-sm font-medium text-muted-fg transition-colors duration-200 hover:text-fg"
            >
              <GithubIcon size={15} />
              {t.projects.source}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { t } = useApp()
  const ref = useReveal()

  return (
    <SectionShell id="projects" label={t.projects.label} title={t.projects.title}>
      <div ref={ref} className="reveal grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} featured={project.featured} />
        ))}
      </div>
    </SectionShell>
  )
}
