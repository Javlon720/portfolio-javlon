/* Ko'nikmalar va fondagi logolar.

   - Brend logolari doira ko'rinishida: doira brendning o'z rangida,
     belgining o'zi esa ichida oq yoki qora bo'lib turadi. Orqada hech
     qanday plashka yo'q — doiraning o'zi logo.
   - Brendi yo'q tushunchalar (REST API, Pagination, Rate Limiting...):
     lucide-react ikonkalari, matn rangida chiziladi.

   Yangi ko'nikma qo'shsangiz — content.js dagi nomni shu yerdagi
   TECH xaritasiga ham qo'shing. Topilmasa, oddiy kod ikonkasi chiqadi. */

import { useId } from 'react'
import {
  BadgeCheck,
  Braces,
  CheckCheck,
  Cloud,
  Cookie,
  Database,
  Fingerprint,
  Gauge,
  Hash,
  Languages,
  ListOrdered,
  MapPinned,
  Network,
  Palette,
  PenTool,
  ShieldCheck,
  Table2,
  TriangleAlert,
  Webhook,
  Workflow,
} from 'lucide-react'
import {
  siCss,
  siDocker,
  siEjs,
  siExpress,
  siFastify,
  siFigma,
  siGit,
  siGithub,
  siGitlab,
  siGooglegemini,
  siGoogle,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLeaflet,
  siLinux,
  siMongodb,
  siMongoose,
  siMysql,
  siNestjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siSocketdotio,
  siTelegram,
  siTypescript,
  siUbuntu,
  siVite,
  siWordpress,
} from 'simple-icons'

/* ---------- rang yordamchilari ---------- */

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const mix = (hex, target, amount) => toHex(toRgb(hex).map((v, i) => v + (target[i] - v) * amount))

const WHITE = [255, 255, 255]
const BLACK = [0, 0, 0]

/** Doira va uning ichidagi belgi uchun ranglar.
 *  Brend rangi deyarli o'zgarmaydi — faqat qora fonda ko'rinmay qoladigan
 *  qop-qora brendlar (Express, Fastify, GitHub) biroz ochariladi.
 *  Belgi rangi doiraning yorqinligiga qarab oq yoki qora tanlanadi. */
const roundColors = (hex) => {
  const c = '#' + hex
  const l = luminance(c)
  const light = l > 0.85 ? mix(c, BLACK, 0.15) : c
  const dark = l < 0.06 ? mix(c, WHITE, 0.3) : c
  const ink = (bg) => (luminance(bg) > 0.45 ? '#0a0a0a' : '#ffffff')
  return {
    light,
    dark,
    inkLight: ink(light),
    inkDark: ink(dark),
    // hajmli ko'rinishdagi qirra — rangning to'qroq soyasi (oq emas!)
    edgeLight: mix(light, BLACK, 0.35),
    edgeDark: mix(dark, BLACK, 0.3),
  }
}

/* Har bir belgining haqiqiy markazi va kichraytirish koeffitsiyenti.
   Simple Icons belgilari 24x24 maydonda har xil joylashgan, shuning uchun
   har biri yuqori aniqlikda o'lchab chiqilgan: [markaz-x, markaz-y, scale].
   Belgi doira radiusining 85% ichiga sig'adi — chetigacha bo'shliq qoladi.
   O'lchov Chrome'da chizib olingan (piksel aniqligida).
   javascript/typescript — harflari o'lchangan (kvadrati emas). */
const FITS = {
  javascript: [14.15, 16.5, 1.083],
  typescript: [12.65, 15.85, 0.919],
  html5: [12.0, 12.0, 0.64],
  css: [12.0, 12.0, 0.601],
  nodedotjs: [12.0, 12.0, 0.637],
  express: [12.0, 12.0, 0.685],
  fastify: [12.05, 12.05, 0.719],
  nestjs: [12.0, 12.0, 0.604],
  socketdotio: [12.0, 12.0, 0.601],
  react: [12.0, 12.0, 0.634],
  vite: [12.0, 12.0, 0.614],
  ejs: [11.8, 11.9, 0.679],
  postgresql: [12.0, 12.0, 0.611],
  mysql: [12.0, 11.95, 0.703],
  mongodb: [12.0, 12.1, 0.781],
  prisma: [12.0, 12.0, 0.656],
  mongoose: [12.0, 12.0, 0.794],
  jsonwebtokens: [12.0, 12.0, 0.601],
  google: [12.0, 12.0, 0.609],
  docker: [12.0, 12.0, 0.691],
  ubuntu: [12.0, 12.0, 0.614],
  nginx: [12.0, 12.0, 0.642],
  linux: [12.0, 12.0, 0.656],
  git: [12.0, 12.0, 0.601],
  github: [12.0, 12.0, 0.609],
  gitlab: [12.0, 11.95, 0.612],
  telegram: [12.0, 12.0, 0.601],
  googlegemini: [11.95, 12.0, 0.66],
  leaflet: [12.0, 12.0, 0.713],
  figma: [12.0, 12.0, 0.699],
  wordpress: [12.0, 12.0, 0.601],
}

/** Brend belgisidan doira yasaydi.
 *  knockout — JS va TS kabi belgilar: ular kvadrat bo'lib, harflari
 *  kvadratdan o'yib olingan. Bunday belgidan faqat harflarni ajratib
 *  olish uchun maska kerak bo'ladi. */
const round = (icon, knockout = false) => {
  const [cx, cy, s] = FITS[icon.slug]
  return {
    isBrand: true,
    knockout,
    path: icon.path,
    transform: `translate(12 12) scale(${s}) translate(${-cx} ${-cy})`,
    ...roundColors(icon.hex),
  }
}

/* ---------- nom -> ikonka xaritasi ----------
   Kalitlar content.js dagi yozuvlar bilan bir xil bo'lishi shart. */

const TECH = {
  // Dasturlash tillari
  JavaScript: round(siJavascript, true),
  TypeScript: round(siTypescript, true),
  HTML5: round(siHtml5),
  CSS3: round(siCss),
  SQL: Database,
  WordPress: round(siWordpress),

  // Backend
  'Node.js': round(siNodedotjs),
  'Express.js': round(siExpress),
  Fastify: round(siFastify),
  NestJS: round(siNestjs),
  'REST API': Webhook,
  'WebSocket / Socket.IO': round(siSocketdotio),
  'API validation': CheckCheck,
  'Error handling': TriangleAlert,

  // Frontend
  React: round(siReact),
  Vite: round(siVite),
  HTML: round(siHtml5),
  CSS: round(siCss),
  EJS: round(siEjs),

  // Ma'lumotlar bazasi
  PostgreSQL: round(siPostgresql),
  MySQL: round(siMysql),
  MongoDB: round(siMongodb),
  'Prisma ORM': round(siPrisma),
  Mongoose: round(siMongoose),
  PostGIS: MapPinned,
  'SQL / Relations / Joins': Table2,
  Pagination: ListOrdered,
  'Schema design': Workflow,

  // Xavfsizlik
  'Authentication & Authorization': Fingerprint,
  JWT: round(siJsonwebtokens),
  'Argon2 password hashing': Hash,
  'HTTP-Only Cookies': Cookie,
  'OAuth / Google Login': round(siGoogle),
  'Verification Tokens': BadgeCheck,
  'Rate Limiting': Gauge,
  'API Security': ShieldCheck,
  'Basic Networking': Network,
  'Cybersecurity fundamentals': ShieldCheck,

  // DevOps / Deploy
  Docker: round(siDocker),
  'Docker Compose': round(siDocker),
  'AWS EC2': Cloud,
  'Ubuntu Server': round(siUbuntu),
  Nginx: round(siNginx),
  Linux: round(siLinux),
  Git: round(siGit),
  GitHub: round(siGithub),
  GitLab: round(siGitlab),

  // Boshqa
  'Telegram Bots': round(siTelegram),
  'Gemini API': round(siGooglegemini),
  'Leaflet Maps': round(siLeaflet),
  'i18n / Multilingual': Languages,
  'UI/UX Design': PenTool,
  'Graphic Design': Palette,
  Figma: round(siFigma),
}

/** depth — logoni hajmli qilib chizadi: ostidan qirra chiqadi va
 *  yumshoq soya tushadi. Qirra rangi logoning o'z rangidan olinadi. */
export default function TechIcon({ name, size = 16, depth = false, className = '' }) {
  const entry = TECH[name]
  const maskId = useId()

  // Brendi yo'q yoki xaritada topilmadi — lucide ikonkasi, matn rangida
  if (!entry?.isBrand) {
    const Fallback = entry ?? Braces
    return (
      <Fallback size={size} aria-hidden="true" className={`shrink-0 opacity-70 ${className}`} />
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        '--tc-light': entry.light,
        '--tc-dark': entry.dark,
        '--tc-ink-l': entry.inkLight,
        '--tc-ink-d': entry.inkDark,
        '--tc-edge-l': entry.edgeLight,
        '--tc-edge-d': entry.edgeDark,
      }}
      className={`tech-round shrink-0 ${depth ? 'tech-depth' : ''} ${className}`}
    >
      <circle cx="12" cy="12" r="12" fill="currentColor" />

      {entry.knockout ? (
        <>
          {/* oq — ko'rinadi, qora — berkitiladi. Belgining kvadrat yuzasi
              berkitilib, faqat harflari (teshiklari) oq bo'lib qoladi.
              Oq to'rtburchak 1 birlik ichkarida: kvadratning chekkasida
              ikki chiziq ustma-ust tushib, ingichka iz qoldirmasligi uchun. */}
          <mask id={maskId}>
            <rect x="1" y="1" width="22" height="22" fill="#fff" />
            <path d={entry.path} fill="#000" />
          </mask>
          <g transform={entry.transform}>
            <rect x="1" y="1" width="22" height="22" fill="var(--tc-ink)" mask={`url(#${maskId})`} />
          </g>
        </>
      ) : (
        <g transform={entry.transform}>
          <path d={entry.path} fill="var(--tc-ink)" />
        </g>
      )}
    </svg>
  )
}
