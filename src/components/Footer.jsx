import { ArrowUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { profile } from '../data/content'

export default function Footer() {
  const { t } = useApp()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="text-sm text-muted-fg">
          <p>
            © {new Date().getFullYear()} {profile.name}. {t.footer.rights}.
          </p>
          <p className="mt-1 text-xs">{t.footer.built}</p>
        </div>

        <a
          href="#hero"
          className="inline-flex cursor-pointer items-center gap-2 self-start text-sm font-medium text-muted-fg transition-colors duration-200 hover:text-fg sm:self-auto"
        >
          <ArrowUp size={15} aria-hidden="true" />
          {t.footer.top}
        </a>
      </div>
    </footer>
  )
}
