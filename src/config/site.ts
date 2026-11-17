/* ===================================================================
   SAYTNING BARCHA SOZLAMALARI SHU FAYLDA.
   Ism, rasm, forma raqami, ko'nikmalar, loyihalar, ijtimoiy tarmoqlar —
   hammasini faqat shu yerni tahrirlab o'zgartirasiz.

   Jonli sinab ko'rish uchun: saytni `/?edit` bilan oching — o'ng pastda
   sozlash paneli chiqadi (o'zgarishlar brauzerda saqlanadi). Yoqqan
   variantni "Copy config" bilan nusxalab, shu faylga ko'chiring.
   =================================================================== */

export interface Skill {
  /** To'liq nom (statistika paneli) */
  label: string
  /** FIFA kartadagi 3 harfli qisqartma */
  short: string
  /** 0–100 */
  value: number
}

export interface Project {
  id: string
  year: string
  title: string
  description: string
  /** public/ papkadagi rasm yo'li yoki null — null bo'lsa poster avtomatik chiziladi */
  image: string | null
  tags: string[]
  live: string | null
  github: string | null
}

export interface SiteConfig {
  player: {
    firstName: string
    fullName: string
    /** Forma orqasidagi yozuv */
    jerseyName: string
    number: number
    /** FIFA kartadagi umumiy reyting */
    rating: number
    position: string
    positionShort: string
    nation: string
    location: string
    available: boolean
  }
  avatar: {
    /** Yuz rasmi: public/ papkadagi fayl ('/me.jpg') yoki null */
    photo: string | null
    /** Rasmni yuzga moslash: kattalashtirish va vertikal siljitish */
    faceZoom: number
    faceOffsetY: number
    /** Tayyor 3D avatar (.glb). Berilsa, protsedura o'yinchi o'rniga shu model yuklanadi */
    modelUrl: string | null
    /** Rasm bo'lmaganda ishlatiladigan teri va soch rangi */
    skinTone: string
    hairColor: string
    /** Soch uslubi */
    hairStyle: 'short' | 'fade' | 'curly' | 'bald'
  }
  kit: {
    shirt: string
    accent: string
    trim: string
    detail: string
    shorts: string
    socks: string
    boots: string
  }
  game: {
    /** false bo'lsa mini-o'yin o'tkazib yuboriladi va sayt to'g'ridan-to'g'ri portfolio bilan ochiladi */
    enabled: boolean
  }
  hero: {
    greeting: string
    roles: string[]
    tagline: string
    intro: string
  }
  career: {
    /** Katta yozuv — jamoa (kompaniya) qisqa nomi */
    club: string
    /** To'liq nom va ixtiyoriy havola */
    company: string
    url: string | null
    /** Lavozim(lar) */
    title: string
    text: string
    tags: string[]
    /** Hozir ham shu yerda ishlaymanmi */
    current?: boolean
  }[]
  skills: Skill[]
  stack: { group: string; items: string[] }[]
  projects: Project[]
  trophies: { id: string; kind: 'cup' | 'medal' | 'star' | 'shield'; title: string; value: string; caption: string; items: string[] }[]
  socials: {
    github: string
    linkedin: string
    email: string
    telegram: string | null
  }
}

export const site: SiteConfig = {
  /* ----------------------------------------------------------------
     1. O'YINCHI (siz)
     ---------------------------------------------------------------- */
  player: {
    firstName: 'Javlon',
    fullName: 'Javlon Abdullayev',
    jerseyName: 'JAVLON',
    number: 7,
    rating: 95,
    position: 'FULL STACK DEVELOPER',
    positionShort: 'FSD',
    nation: 'Uzbekistan',
    location: 'Tashkent, Uzbekistan',
    available: true,
  },

  /* ----------------------------------------------------------------
     2. AVATAR
     photo: yuzingiz old tomondan tushgan rasmni public/me.jpg qilib
            qo'ying va shu yerga '/me.jpg' deb yozing.
     modelUrl: o'zingizning 3D skaneringiz (.glb) bo'lsa — public/ ga
            qo'yib, '/avatar.glb' deb yozing.
     ---------------------------------------------------------------- */
  avatar: {
    photo: null,
    faceZoom: 1,
    faceOffsetY: 0,
    modelUrl: null,
    skinTone: '#c8956c',
    hairColor: '#17120f',
    hairStyle: 'short',
  },

  /* ----------------------------------------------------------------
     3. FORMA (O'zbekiston bayrog'i ranglari)
     ---------------------------------------------------------------- */
  kit: {
    shirt: '#f3f6fa',
    accent: '#0099b5',
    trim: '#1eb53a',
    detail: '#ce1126',
    shorts: '#0a86a3',
    socks: '#f3f6fa',
    boots: '#101418',
  },

  /* ----------------------------------------------------------------
     O'YIN: gol urilgach portfolio ochiladi
     ---------------------------------------------------------------- */
  game: {
    enabled: true,
  },

  /* ----------------------------------------------------------------
     4. HERO MATNI
     ---------------------------------------------------------------- */
  hero: {
    greeting: "Hi, I'm",
    roles: ['Full Stack Developer', 'Backend Engineer', 'API Architect'],
    tagline: 'Building Digital Experiences',
    intro:
      'I design and ship complete products — fast APIs, solid databases and interfaces people enjoy using. Node.js, NestJS, PostgreSQL and React are my starting eleven.',
  },

  /* ----------------------------------------------------------------
     5. KARYERA (Career Mode) — ishlagan joylar, tartib bo'yicha.
     `current: true` — hozirgi ish joyi ("Now" belgisi chiqadi).
     ---------------------------------------------------------------- */
  career: [
    {
      club: 'Beston',
      company: 'beston.uz',
      url: 'https://beston.uz/',
      title: 'Full Stack Developer',
      text: 'Built and maintained the official site of the Beston home appliance brand end to end — catalogue, instant search and multilingual content, from the database to the interface.',
      tags: ['Full Stack', 'WordPress', 'PHP', 'Algolia'],
    },
    {
      club: 'JDU',
      company: 'Japan Digital University',
      url: null,
      title: 'Full Stack Developer & Graphic Designer',
      text: 'Two shirts at one club: developed the university’s web products as a full stack developer and designed its visual materials as a graphic designer in Adobe Photoshop, Illustrator, CorelDRAW and InDesign.',
      tags: ['Full Stack', 'Graphic Design', 'Photoshop', 'Illustrator', 'CorelDRAW', 'InDesign'],
    },
    {
      club: 'Riizq',
      company: 'riizq.uz',
      url: 'https://riizq.uz/',
      title: 'Full Stack Developer',
      text: 'Worked across the whole stack of Riizq.uz (“Mening Fermam”), a livestock and farm management platform — APIs, database and front end.',
      tags: ['Full Stack', 'Backend', 'Frontend', 'Database'],
    },
    {
      club: 'Mkka',
      company: 'mkka.uz',
      url: 'https://mkka.uz/',
      title: 'Full Stack Developer',
      text: 'Full stack development for Mkka.uz: server side, data layer and the user-facing application.',
      tags: ['Full Stack', 'Backend', 'Frontend', 'Database'],
    },
    {
      club: 'Najot',
      company: "Najot Ta'lim",
      url: null,
      title: 'Programming Instructor',
      text: "Currently teaching at Najot Ta'lim — passing on what I use in production every day and coaching the next generation of developers.",
      tags: ['Teaching', 'Mentoring', 'Full Stack'],
      current: true,
    },
  ],

  /* ----------------------------------------------------------------
     6. KO'NIKMALAR (FIFA karta statistikasi)
     ---------------------------------------------------------------- */
  skills: [
    { label: 'Frontend', short: 'FRO', value: 92 },
    { label: 'Backend', short: 'BAC', value: 90 },
    { label: 'Database', short: 'DAT', value: 85 },
    { label: 'Problem Solving', short: 'PRO', value: 95 },
  ],

  /* Texnologiyalar ro'yxati ("tarkib") */
  stack: [
    { group: 'Languages', items: ['JavaScript', 'TypeScript', 'SQL', 'HTML5', 'CSS3'] },
    { group: 'Backend', items: ['Node.js', 'NestJS', 'Express.js', 'Fastify', 'REST API', 'Socket.IO'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS'] },
    { group: 'Database', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma ORM', 'PostGIS'] },
    { group: 'Security', items: ['JWT', 'OAuth', 'Argon2', 'Rate Limiting'] },
    { group: 'DevOps', items: ['Docker', 'AWS EC2', 'Nginx', 'Linux', 'GitHub / GitLab'] },
    { group: 'Design', items: ['Adobe Photoshop', 'Adobe Illustrator', 'CorelDRAW', 'Adobe InDesign', 'Figma', 'UI/UX'] },
  ],

  /* ----------------------------------------------------------------
     7. LOYIHALAR
     ---------------------------------------------------------------- */
  projects: [
    {
      id: 'beston',
      year: '2026',
      title: 'Beston — home appliance brand site',
      description:
        'Official site for a home appliance brand: category-based catalogue, flagship products, Algolia-powered instant search, plus service and careers sections. Runs in three languages.',
      image: '/beston.jpg',
      tags: ['WordPress', 'PHP', 'Elementor', 'Algolia', 'Polylang'],
      live: 'https://beston.uz/',
      github: null, // mijoz sayti — ochiq repozitoriy yo'q
    },
    {
      id: 'riizq',
      year: '2026',
      title: 'Riizq — Mening Fermam',
      description:
        'A livestock and farm management app: herd records, daily feed rations, feed stock and warehouse, a veterinary pharmacy and monthly purchase costs — the whole farm at a glance. Includes a public demo farm that works without signing in.',
      image: '/riizq.jpg',
      tags: ['React', 'Node.js', 'PostgreSQL', 'REST API'],
      live: 'https://riizq.uz/',
      github: null, // mijoz loyihasi — ochiq repozitoriy yo'q
    },
    
    // TODO: quyidagi uchtasi namuna — havolalarni o'zingiznikiga almashtiring
    // {
    //   id: 'taskly',
    //   year: '2024',
    //   title: 'Taskly — team planner',
    //   description: 'A realtime kanban board with drag-and-drop, offline support and multi-user collaboration.',
    //   image: null,
    //   tags: ['React', 'Zustand', 'WebSocket', 'IndexedDB'],
    //   live: 'https://example.com',
    //   github: 'https://github.com/Javlon720',
    // }
  ],

  /* ----------------------------------------------------------------
     8. KUBOKLAR XONASI
     value — katta raqam, items — ostidagi ro'yxat.
     ---------------------------------------------------------------- */
  trophies: [
    {
      id: 'certificates',
      kind: 'medal',
      title: 'Certificates',
      value: '03',
      caption: 'university diplomas',
      items: [
        'Japan Digital University — diploma',
        'Uzbekistan State World Languages University (Jahon tillari) — diploma',
        'Sanno University, Japan — diploma',
      ],
    },
    {
      id: 'projects',
      kind: 'cup',
      title: 'Projects',
      value: '20+',
      caption: 'projects shipped',
      items: ['Beston — brand site in 3 languages', 'Riizq.uz & Mkka.uz platforms', 'Japan Digital University web products'],
    },
    {
      id: 'github',
      kind: 'star',
      title: 'GitHub',
      value: '@Javlon720',
      caption: 'open source profile',
      items: ['Public repositories & experiments', 'Git flow, reviews, CI basics', 'GitHub + GitLab daily driver'],
    },
    {
      id: 'skills',
      kind: 'shield',
      title: 'Skills',
      value: '30+',
      caption: 'technologies in the squad',
      items: ['Backend: Node.js, NestJS, PostgreSQL', 'Frontend: React, TypeScript', 'Ops: Docker, AWS, Nginx'],
    },
  ],

  /* ----------------------------------------------------------------
     9. IJTIMOIY TARMOQLAR
     ---------------------------------------------------------------- */
  socials: {
    github: 'https://github.com/Javlon720',
    linkedin: 'https://www.linkedin.com/in/javlon-abdullayev-376083413/',
    email: 'abdullayevjavlon720@gmail.com',
    telegram: 'https://t.me/mikkaorg',
  },
}
