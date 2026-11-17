'use client'

import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/config/site'
import { useSite } from '@/lib/store'
import { FadeUp, SectionHeading } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { GithubIcon } from '@/components/ui/Icons'

const HUES = [190, 135, 205, 160, 348]

/** Rasm berilmagan loyiha uchun avtomatik poster */
function Poster({ project, index }: { project: Project; index: number }) {
  const hue = HUES[index % HUES.length]
  const initials = project.title
    .split(/[\s—-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(140deg, hsl(${hue} 80% 22%), hsl(${hue + 30} 70% 8%))` }}
    >
      <div className="pitch-lines absolute inset-0 opacity-80" />
      <div className="absolute h-40 w-40 rounded-full border border-white/15" />
      <span className="display relative text-8xl text-white/90 drop-shadow-[0_0_30px_rgb(255_255_255/0.25)]">{initials}</span>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TiltCard max={7} className="rounded-[1.75rem]">
      <article className="glass flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-colors duration-500 group-hover:border-uz/50">
        <div className="relative aspect-[16/10] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <Poster project={project} index={index} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="display flex h-12 w-12 items-center justify-center rounded-xl bg-ink/80 text-2xl text-uz backdrop-blur">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="label rounded-full bg-ink/80 px-3 py-1.5 text-[0.6rem] text-chalk backdrop-blur">Season {project.year}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="font-display text-3xl font-bold uppercase italic leading-[0.95] md:text-4xl">{project.title}</h3>
          <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-mute">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li key={t} className="label rounded-full border border-line px-3 py-1.5 text-[0.58rem] text-chalk/80">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
                className="label flex items-center gap-2 rounded-full bg-chalk px-5 py-3 font-medium text-ink transition-colors hover:bg-uz"
              >
                Live demo <ArrowUpRight size={14} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="label flex items-center gap-2 rounded-full border border-line px-5 py-3 text-chalk transition-colors hover:border-uz hover:text-uz"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

export function Projects() {
  const { site } = useSite()
  return (
    <section id="projects" className="relative bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading index="02" kicker="Match highlights" title="Selected projects" />
        <div className="grid gap-7 md:grid-cols-2">
          {site.projects.map((p, i) => (
            <FadeUp key={p.id} delay={(i % 2) * 0.1}>
              <ProjectCard project={p} index={i} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
