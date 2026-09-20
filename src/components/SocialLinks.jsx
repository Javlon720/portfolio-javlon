import { Globe } from 'lucide-react'
import { socials } from '../data/content'
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  XIcon,
} from './BrandIcons'

const ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  twitter: XIcon,
  instagram: InstagramIcon,
  globe: Globe,
}

export default function SocialLinks({ size = 18, className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1 ${className}`}>
      {socials.map((s) => {
        const Icon = ICONS[s.icon] ?? Globe
        return (
          <li key={s.label}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              title={s.label}
              className="grid size-11 cursor-pointer place-items-center rounded-chip text-muted-fg transition-colors duration-200 hover:bg-muted hover:text-fg"
            >
              <Icon size={size} aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
