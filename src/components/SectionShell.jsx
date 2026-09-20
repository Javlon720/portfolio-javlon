import { useReveal } from '../hooks/useReveal'

/**
 * Har bir bo'lim uchun umumiy ramka: raqamli yorliq + sarlavha + kontent.
 */
export default function SectionShell({ id, label, title, children, className = '' }) {
  const ref = useReveal()

  return (
    <section id={id} className={`scroll-mt-24 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div ref={ref} className="reveal">
          <p className="font-display text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {label}
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
          <div className="mt-6 h-px w-full bg-border" />
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
