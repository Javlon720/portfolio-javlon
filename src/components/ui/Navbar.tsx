'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navigateTo } from '@/lib/scroll'
import { useGame } from '@/lib/game'
import { useSite } from '@/lib/store'
import { Magnetic } from './Magnetic'

const LINKS = [
  { id: 'skills', label: 'Profile' },
  { id: 'projects', label: 'Projects' },
  { id: 'career', label: 'Career' },
  { id: 'trophies', label: 'Trophies' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const { site } = useSite()
  const shown = useGame((s) => s.phase === 'portfolio')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  const go = (id: string) => {
    setOpen(false)
    navigateTo(id)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -90, opacity: 0 }}
        animate={shown ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div className="h-[2px] origin-left bg-uz" style={{ scaleX: bar }} />
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10" aria-label="Main">
          <button onClick={() => go('top')} className="flex items-center gap-3" aria-label="Back to top">
            <span className="display flex h-10 w-10 items-center justify-center rounded-lg border border-uz/50 bg-uz/10 text-xl text-uz">
              {site.player.number}
            </span>
            <span className="display hidden text-xl tracking-wide sm:block">{site.player.jerseyName}</span>
          </button>

          <ul className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="label rounded-full px-4 py-2 text-mute transition-colors hover:bg-white/10 hover:text-chalk"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden md:inline-block">
              <button
                onClick={() => go('contact')}
                className="label rounded-full bg-chalk px-5 py-3 font-medium text-ink transition-colors hover:bg-uz"
              >
                Sign me
              </button>
            </Magnetic>
            <button
              className="glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                onClick={() => go(l.id)}
                className="display border-b border-line py-4 text-left text-6xl"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
              >
                <span className="label mr-4 align-middle text-uz">0{i + 1}</span>
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
