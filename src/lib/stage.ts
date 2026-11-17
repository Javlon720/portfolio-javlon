import gsap from 'gsap'

/* Kirish sahnasi va hero skrolli uchun umumiy, o'zgaruvchan holat.
   React state emas — har kadrda o'qiladi, shuning uchun re-render yo'q. */
export const stage = {
  /** 0 → kamera stadion tashqarisida, 1 → o'yinchi ortida */
  intro: 0,
  /** 0 → o'yinchi ko'rinmaydi, 1 → to'liq "skanerlangan" */
  reveal: 0,
  /** To'rtta projektor guruhining yorqinligi (0..1) */
  lights: { a: 0, b: 0, c: 0, d: 0 },
  /** Portfolio rejimida hero bo'limidagi skroll progressi (0..1) */
  scroll: 0,
  pointer: { x: 0, y: 0 },
}

export const lightKeys = ['a', 'b', 'c', 'd'] as const
export const READY_EVENT = 'stadium:ready'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let timeline: gsap.core.Timeline | null = null

/** Kirish sahnasini darhol yakuniy holatga keltiradi (Skip tugmasi, reduced-motion) */
export function finishIntro() {
  timeline?.kill()
  timeline = null
  stage.intro = 1
  stage.reveal = 1
  lightKeys.forEach((k) => (stage.lights[k] = 1))
}

/** Kirish sahnasi: kamera stadionga kiradi → chiroqlar yonadi → o'yinchi paydo bo'ladi */
export function startIntro(onDone: () => void) {
  timeline?.kill()
  stage.intro = 0
  stage.reveal = 0
  lightKeys.forEach((k) => (stage.lights[k] = 0))

  const tl = gsap.timeline()
  timeline = tl
  // Projektorlar birin-ketin, lyuminestsent "pirpirash" bilan yonadi
  lightKeys.forEach((k, i) => {
    const at = 0.6 + i * 0.38
    tl.to(stage.lights, { [k]: 0.55, duration: 0.07, ease: 'none' }, at)
      .to(stage.lights, { [k]: 0.08, duration: 0.09, ease: 'none' }, at + 0.09)
      .to(stage.lights, { [k]: 0.8, duration: 0.06, ease: 'none' }, at + 0.22)
      .to(stage.lights, { [k]: 0.3, duration: 0.08, ease: 'none' }, at + 0.3)
      .to(stage.lights, { [k]: 1, duration: 0.9, ease: 'power2.out' }, at + 0.42)
  })
  tl.to(stage, { intro: 1, duration: 4.6, ease: 'power3.inOut' }, 0.2)
  tl.to(stage, { reveal: 1, duration: 1.7, ease: 'power2.inOut' }, 2.9)
  tl.call(onDone, [], 4.9)
}
