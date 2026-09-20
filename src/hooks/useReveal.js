import { useEffect, useRef, useState } from 'react'

/**
 * Element ekranga kirganda `.is-visible` klassini qo'shadi.
 * Faqat bir marta ishlaydi — orqaga scroll qilganda qayta animatsiya bo'lmaydi.
 */
export function useReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          entry.target.classList.remove('is-visible')
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return ref
}

/**
 * Scroll paytida qaysi bo'lim ko'rinib turganini aniqlaydi (navbar uchun).
 */
export function useActiveSection(ids) {
  const activeRef = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible && visible.target.id !== activeRef.current) {
          activeRef.current = visible.target.id
          setActive(visible.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return active
}
