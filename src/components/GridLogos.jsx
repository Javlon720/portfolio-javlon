/* Sahifaning chap va o'ng chekkasidagi dekorativ 3D logolar.

   - Logoning o'zi hajmli: qirrasi qalin, ostida yumshoq soya.
     Qirra rangi — logoning o'z rangining to'q soyasi, shuning uchun
     orqasidan oq yoki kulrang hech narsa ko'rinmaydi.
   - Logolar yon bo'shliqning o'rtasida, katak chizig'i ustida turadi.
   - Scroll paytida chap ustun tepaga, o'ng ustun pastga siljiydi —
     ikki tomon bir-biridan ayrilib borayotgandek ko'rinadi.
   - Tepaga — navbar tomon — chiqqani asta blur bo'ladi.
   - Faqat keng ekranlarda (xl: 1280px+) ko'rinadi. */

import { useEffect, useRef } from 'react'
import TechIcon from './TechIcons'

/* side: 'l' = chap, 'r' = o'ng
   big:  true = katta logo, false = kichik (chuqurlik hissi uchun)
   top:  sahifa balandligiga nisbatan joylashuvi */
const DECOR = [
  { name: 'JavaScript', side: 'l', big: true, top: '4%' },
  { name: 'TypeScript', side: 'r', big: false, top: '8%' },
  { name: 'React', side: 'l', big: false, top: '15%' },
  { name: 'Node.js', side: 'r', big: true, top: '18%' },
  { name: 'NestJS', side: 'l', big: true, top: '25%' },
  { name: 'PostgreSQL', side: 'r', big: false, top: '28%' },
  { name: 'Prisma ORM', side: 'l', big: false, top: '35%' },
  { name: 'Fastify', side: 'r', big: true, top: '38%' },
  { name: 'Docker', side: 'l', big: true, top: '45%' },
  { name: 'MongoDB', side: 'r', big: false, top: '48%' },
  { name: 'Express.js', side: 'l', big: false, top: '55%' },
  { name: 'Nginx', side: 'r', big: true, top: '58%' },
  { name: 'MySQL', side: 'l', big: true, top: '65%' },
  { name: 'Linux', side: 'r', big: false, top: '68%' },
  { name: 'Git', side: 'l', big: false, top: '75%' },
  { name: 'WebSocket / Socket.IO', side: 'r', big: true, top: '78%' },
  { name: 'Vite', side: 'l', big: true, top: '85%' },
  { name: 'Figma', side: 'r', big: false, top: '88%' },
  { name: 'GitHub', side: 'l', big: false, top: '94%' },
  { name: 'Telegram Bots', side: 'r', big: true, top: '96%' },
]

/* ---- sozlamalar ---- */
const LOGO = { big: 92, small: 68 } // logo o'lchami (px)
const BLUR_FROM = 260 // shu balandlikdan tepada blur boshlanadi (px)
const BLUR_TO = 40 // shu yerga yetganda blur eng kuchli
const BLUR_MAX = 8 // eng kuchli blur (px)
const PARALLAX = 0.1 // siljish kuchi: 0 — qimirlamaydi, 0.2 — juda tez

/* Logo markazi: kontent chetidan (max-w-5xl ning yarmi = 32rem)
   bir katak nariga — ya'ni yon bo'shliqning o'rtasiga. */
const offset = (side) => `calc(50% ${side === 'l' ? '-' : '+'} (32rem + var(--grid-cell)))`

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function GridLogos() {
  const refs = useRef([])

  useEffect(() => {
    // dir: chap ustun tepaga (-1), o'ng ustun pastga (+1) siljiydi
    const items = refs.current
      .map((el, i) => ({ el, dir: DECOR[i].side === 'l' ? -1 : 1 }))
      .filter((it) => it.el)
    if (!items.length) return

    // Harakatni kamaytirish rejimida siljish o'chadi, blur qolaveradi
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Har bir logo markazining sahifa boshidan hisoblangan o'rni.
    // Bir marta o'lchanadi — scroll paytida faqat ayirma hisoblanadi.
    let centers = []
    let frame = 0

    const paint = () => {
      const scrolled = window.scrollY
      const middle = window.innerHeight / 2

      items.forEach(({ el, dir }, i) => {
        const y = centers[i] - scrolled // markazning ekrandagi balandligi

        // Tepaga chiqqani blur bo'ladi
        const p = clamp((BLUR_FROM - y) / (BLUR_FROM - BLUR_TO))
        el.style.setProperty('--logo-blur', `${(p * BLUR_MAX).toFixed(2)}px`)

        // Ekran o'rtasidan qancha uzoqlashsa, shuncha ko'p siljiydi.
        // Chap va o'ng ustun qarama-qarshi tomonga ketadi.
        if (!still) {
          el.style.setProperty('--shift', `${((middle - y) * PARALLAX * dir).toFixed(1)}px`)
        }
      })
    }

    const measure = () => {
      // Siljishni nolga qaytarib o'lchaymiz — aks holda o'lchov o'z
      // natijasini qayta hisobga olib, logo asta-sekin "qochib" ketadi
      items.forEach(({ el }) => el.style.setProperty('--shift', '0px'))
      centers = items.map(({ el }) => {
        const r = el.getBoundingClientRect()
        return r.top + r.height / 2 + window.scrollY
      })
      paint()
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        paint()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Sahifa balandligi o'zgarsa (shrift yuklandi, ekran burildi) qayta o'lchaymiz
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden xl:block"
    >
      {DECOR.map(({ name, side, big, top }, i) => (
        <span
          key={`${name}-${side}-${top}`}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="logo-3d"
          style={{ top, left: offset(side) }}
        >
          <span className="logo-3d__persp">
            <span
              className="logo-3d__stage"
              style={{
                // har bir logo o'z burchagida yotadi
                '--rx': `${((i * 29) % 19) - 9}deg`,
                '--ry': `${((i * 43) % 27) - 13}deg`,
                '--delay': `${(i % 7) * 0.9}s`,
              }}
            >
              <TechIcon name={name} size={big ? LOGO.big : LOGO.small} depth />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}
