'use client'

import { motion } from 'framer-motion'

const EASE = [0.2, 0.8, 0.2, 1] as const

/** So'zma-so'z pastdan chiqadigan sarlavha */
export function RevealText({
  text,
  className,
  delay = 0,
  show,
}: {
  text: string
  className?: string
  delay?: number
  /** Berilsa — ko'rinish skroll emas, shu qiymat bilan boshqariladi */
  show?: boolean
}) {
  const words = text.split(' ')
  const controlled = show !== undefined
  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block' }}
      initial="hidden"
      animate={controlled ? (show ? 'visible' : 'hidden') : undefined}
      whileInView={controlled ? undefined : 'visible'}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] pr-[0.22em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%', rotate: 4 }, visible: { y: '0%', rotate: 0 } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Oddiy "pastdan ko'tarilib chiqish" o'rami */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <header className="mb-14 md:mb-20">
      <FadeUp className="label flex items-center gap-3 text-uz">
        <span className="text-mute">{index}</span>
        <span className="h-px w-10 bg-uz/60" />
        {kicker}
      </FadeUp>
      <h2 className="display mt-5 text-[clamp(3rem,9vw,7.5rem)]">
        <RevealText text={title} />
      </h2>
    </header>
  )
}
