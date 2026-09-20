/* ===================================================================
   SAYTNING BARCHA MATNI SHU FAYLDA.
   Boshqa fayllarga tegmasdan, faqat shu yerni tahrirlab
   saytni to'liq o'zingiznikiga aylantira olasiz.

   { uz, en, ru, ja } ko'rinishidagi joylar — to'rt tilli matnlar.
   Til qo'shmoqchi bo'lsangiz: quyidagi `languages` ro'yxatiga kod
   qo'shing va har bir shunday obyektga o'sha kodni yozing.
   =================================================================== */

/* -------------------------------------------------------------------
   1. SHAXSIY MA'LUMOTLAR
   ------------------------------------------------------------------- */
export const languages = [
  { code: 'uz', short: 'UZ', label: 'Oʻzbekcha' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'ja', short: 'JA', label: '日本語' },
]

export const profile = {
  name: 'Javlon Abdullayev',
  // Bosh sahifadagi katta sarlavha ostidagi kasb nomi
  role: {
    uz: 'Full-Stack Dasturchi & Grafik Dizayner',
    en: 'Full-Stack Developer & Graphic Designer',
    ru: 'Full-Stack разработчик и графический дизайнер',
    ja: 'フルスタック開発者 / グラフィックデザイナー',
  },
  email: 'abdullayevjavlon720@gmail.com',
  phone: '+998 93 379 55 77',
  location: {
    uz: 'Toshkent, Oʻzbekiston',
    en: 'Tashkent, Uzbekistan',
    ru: 'Ташкент, Узбекистан',
    ja: 'ウズベキスタン・タシケント',
  },
  // CV fayli: o'z PDF'ingizni public/ papkasiga tashlang
  resumeUrl: '/resume.pdf',
  // Ishga tayyorlik holati (hero'dagi yashil nuqta)
  available: true,
}

/* -------------------------------------------------------------------
   2. IJTIMOIY TARMOQLAR
   Kerakmasini o'chirib tashlang, yangisini qo'shing.
   icon: 'github' | 'linkedin' | 'telegram' | 'twitter' | 'instagram' | 'globe'
   ------------------------------------------------------------------- */
export const socials = [
  { label: 'GitHub', icon: 'github', url: 'https://github.com/Javlon720' },
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/javlon-abdullayev-376083413/',
  },
  { label: 'Telegram', icon: 'telegram', url: 'https://t.me/mikkaorg' },
]

/* -------------------------------------------------------------------
   3. KO'NIKMALAR
   ------------------------------------------------------------------- */
export const skills = [
  {
    group: { uz: 'Dasturlash tillari', en: 'Languages', ru: 'Языки программирования', ja: 'プログラミング言語' },
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL', 'WordPress'],
  },
  {
    group: { uz: 'Backend', en: 'Backend', ru: 'Бэкенд', ja: 'バックエンド' },
    items: [
      'Node.js',
      'Express.js',
      'Fastify',
      'NestJS',
      'REST API',
      'WebSocket / Socket.IO',
      'API validation',
      'Error handling',
    ],
  },
  {
    group: { uz: 'Frontend', en: 'Frontend', ru: 'Фронтенд', ja: 'フロントエンド' },
    items: ['React', 'Vite', 'HTML', 'CSS', 'EJS'],
  },
  {
    group: { uz: 'Ma’lumotlar bazasi', en: 'Database', ru: 'Базы данных', ja: 'データベース' },
    items: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Prisma ORM',
      'Mongoose',
      'PostGIS',
      'SQL / Relations / Joins',
      'Pagination',
      'Schema design',
    ],
  },
  {
    group: { uz: 'Xavfsizlik', en: 'Security', ru: 'Безопасность', ja: 'セキュリティ' },
    items: [
      'Authentication & Authorization',
      'JWT',
      'Argon2 password hashing',
      'HTTP-Only Cookies',
      'OAuth / Google Login',
      'Verification Tokens',
      'Rate Limiting',
      'API Security',
      'Basic Networking',
      'Cybersecurity fundamentals',
    ],
  },
  {
    group: { uz: 'DevOps / Deploy', en: 'DevOps / Deployment', ru: 'DevOps / Деплой', ja: 'DevOps / デプロイ' },
    items: [
      'Docker',
      'Docker Compose',
      'AWS EC2',
      'Ubuntu Server',
      'Nginx',
      'Linux',
      'Git',
      'GitHub',
      'GitLab',
    ],
  },
  {
    group: { uz: 'Boshqa', en: 'Other', ru: 'Прочее', ja: 'その他' },
    items: [
      'Telegram Bots',
      'Gemini API',
      'Leaflet Maps',
      'i18n / Multilingual',
      'UI/UX Design',
      'Graphic Design',
      'Figma',
    ],
  },
]

/* -------------------------------------------------------------------
   4. LOYIHALAR
   featured: true — kattaroq karta bo'lib chiqadi.
   image: rasm yo'li (public/ papkadan) yoki null — null bo'lsa
          chiroyli gradient plashka chiziladi.
   ------------------------------------------------------------------- */
export const projects = [
  {
    id: 'beston',
    year: '2026',
    featured: true,
    // public/ papkadagi skrinshot. Yangilash uchun shu fayl ustiga yozing.
    image: '/beston.jpg',
    title: {
      uz: 'Beston — maishiy texnika brendi sayti',
      en: 'Beston — home appliance brand site',
      ru: 'Beston — сайт бренда бытовой техники',
      ja: 'Beston — 家電ブランド公式サイト',
    },
    description: {
      uz: 'Maishiy texnika brendining rasmiy sayti: kategoriyalar bo‘yicha katalog, flagman mahsulotlar, Algolia asosidagi tezkor qidiruv, servis va vakansiya bo‘limlari. Sayt uch tilda — o‘zbek, rus va ingliz.',
      en: 'Official site for a home appliance brand: a category-based catalogue, flagship products, Algolia-powered instant search, plus service and careers sections. Runs in three languages — Uzbek, Russian and English.',
      ru: 'Официальный сайт бренда бытовой техники: каталог по категориям, флагманские товары, мгновенный поиск на базе Algolia, разделы сервиса и вакансий. Сайт работает на трёх языках — узбекском, русском и английском.',
      ja: '家電ブランドの公式サイト。カテゴリ別カタログ、フラッグシップ製品、Algolia による即時検索、サービスと採用のセクション。ウズベク語・ロシア語・英語の3言語に対応。',
    },
    tags: ['WordPress', 'PHP', 'Elementor', 'Algolia', 'Polylang'],
    live: 'https://beston.uz/',
    // Mijoz sayti — ochiq repozitoriy yo'q
    source: null,
  },
  {
    id: 'taskly',
    year: '2024',
    featured: true,
    image: null,
    title: {
      uz: 'Taskly — jamoaviy rejalashtiruvchi',
      en: 'Taskly — team planner',
      ru: 'Taskly — командный планировщик',
      ja: 'Taskly — チーム向けプランナー',
    },
    description: {
      uz: 'Real vaqtda yangilanadigan kanban taxtasi. Drag-and-drop, offline rejim va bir nechta foydalanuvchi bir vaqtda ishlashi.',
      en: 'A realtime kanban board with drag-and-drop, offline support and multi-user collaboration.',
      ru: 'Канбан-доска с обновлением в реальном времени: drag-and-drop, офлайн-режим и совместная работа нескольких пользователей.',
      ja: 'リアルタイム更新のカンバンボード。ドラッグ&ドロップ、オフライン対応、複数人での同時編集。',
    },
    tags: ['React', 'Zustand', 'WebSocket', 'IndexedDB'],
    live: 'https://example.com',
    source: 'https://github.com/username/taskly',
  },
  {
    id: 'weather',
    year: '2024',
    featured: false,
    image: null,
    title: {
      uz: 'Ob-havo paneli',
      en: 'Weather dashboard',
      ru: 'Панель погоды',
      ja: '天気ダッシュボード',
    },
    description: {
      uz: '7 kunlik prognoz, geolokatsiya va animatsiyali grafiklar bilan yengil ob-havo ilovasi.',
      en: 'A lightweight weather app with 7-day forecasts, geolocation and animated charts.',
      ru: 'Лёгкое приложение погоды: прогноз на 7 дней, геолокация и анимированные графики.',
      ja: '7日間の予報、位置情報、アニメーション付きグラフを備えた軽量な天気アプリ。',
    },
    tags: ['React', 'Recharts', 'OpenWeather API'],
    live: 'https://example.com',
    source: 'https://github.com/username/weather',
  },
  {
    id: 'devblog',
    year: '2023',
    featured: false,
    image: null,
    title: {
      uz: 'DevBlog — MDX blog dvigateli',
      en: 'DevBlog — MDX blog engine',
      ru: 'DevBlog — движок блога на MDX',
      ja: 'DevBlog — MDXブログエンジン',
    },
    description: {
      uz: 'Statik generatsiya qilinadigan blog: MDX, kod bloklarini yoritish va RSS tasmasi.',
      en: 'A statically generated blog with MDX, syntax highlighting and an RSS feed.',
      ru: 'Статически генерируемый блог: MDX, подсветка кода и RSS-лента.',
      ja: '静的生成のブログ。MDX、コードハイライト、RSSフィード。',
    },
    tags: ['Astro', 'MDX', 'Tailwind'],
    live: 'https://example.com',
    source: 'https://github.com/username/devblog',
  },
]

/* -------------------------------------------------------------------
   5. TAJRIBA
   period: davr (masalan '2024 — hozir')
   ------------------------------------------------------------------- */
export const experience = [
  {
    id: 'exp-1',
    company: 'Acme Digital',
    url: 'https://example.com',
    period: { uz: '2024 — hozir', en: '2024 — Present', ru: '2024 — наст. время', ja: '2024年 — 現在' },
    role: {
      uz: 'Frontend Dasturchi',
      en: 'Frontend Developer',
      ru: 'Frontend-разработчик',
      ja: 'フロントエンド開発者',
    },
    summary: {
      uz: 'Mahsulotning asosiy interfeysini React va TypeScript’da qayta qurdim; sahifa yuklanish vaqtini 40% ga qisqartirdim.',
      en: 'Rebuilt the core product UI in React and TypeScript, cutting page load time by 40%.',
      ru: 'Переписал основной интерфейс продукта на React и TypeScript, сократив время загрузки страницы на 40%.',
      ja: 'プロダクトの主要UIを React と TypeScript で再構築し、ページ読み込み時間を40%短縮。',
    },
    stack: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'exp-2',
    company: 'Freelance',
    url: null,
    period: { uz: '2022 — 2024', en: '2022 — 2024', ru: '2022 — 2024', ja: '2022年 — 2024年' },
    role: {
      uz: 'Web Dasturchi',
      en: 'Web Developer',
      ru: 'Веб-разработчик',
      ja: 'ウェブ開発者',
    },
    summary: {
      uz: 'Kichik biznes va startaplar uchun 15+ landing va korporativ sayt ishlab chiqdim.',
      en: 'Shipped 15+ landing pages and corporate sites for small businesses and startups.',
      ru: 'Разработал более 15 лендингов и корпоративных сайтов для малого бизнеса и стартапов.',
      ja: '中小企業やスタートアップ向けに、15本以上のランディングページと企業サイトを制作。',
    },
    stack: ['JavaScript', 'SCSS', 'WordPress'],
  },
  {
    id: 'exp-3',
    company: 'Japan Digital University',
    url: null,
    // TODO: boshlangan yilni yozing, masalan uz: '2024 — hozir'
    period: { uz: 'hozirda', en: 'Present', ru: 'наст. время', ja: '現在' },
    role: {
      uz: 'Computer Engineering talabasi',
      en: 'Computer Engineering Student',
      ru: 'Студент направления Computer Engineering',
      ja: 'コンピュータ工学専攻の学生',
    },
    summary: {
      uz: 'Computer Engineering yo‘nalishi: dasturlash asoslari, algoritmlar, ma’lumotlar bazasi va tarmoq fanlari.',
      en: 'Computer Engineering: programming fundamentals, algorithms, databases and networking.',
      ru: 'Computer Engineering: основы программирования, алгоритмы, базы данных и сети.',
      ja: 'コンピュータ工学：プログラミングの基礎、アルゴリズム、データベース、ネットワーク。',
    },
    stack: ['JavaScript', 'TypeScript', 'SQL'],
  },
]

/* -------------------------------------------------------------------
   6. STATISTIKA (hero ostidagi raqamlar)
   ------------------------------------------------------------------- */
export const stats = [
  {
    value: '3+',
    label: {
      uz: 'yillik tajriba',
      en: 'years of experience',
      ru: 'года опыта',
      ja: '年の経験',
    },
  },
  {
    value: '20+',
    label: {
      uz: 'yakunlangan loyiha',
      en: 'projects shipped',
      ru: 'завершённых проектов',
      ja: '完了したプロジェクト',
    },
  },
  {
    value: '12',
    label: { uz: 'mamnun mijoz', en: 'happy clients', ru: 'довольных клиентов', ja: '満足した顧客' },
  },
]

/* -------------------------------------------------------------------
   7. INTERFEYS MATNLARI (tugmalar, sarlavhalar)
   ------------------------------------------------------------------- */
export const ui = {
  uz: {
    nav: {
      about: 'Men haqimda',
      skills: 'Koʻnikmalar',
      projects: 'Loyihalar',
      experience: 'Tajriba',
      contact: 'Bogʻlanish',
    },
    hero: {
      greeting: 'Assalomu alaykum, men',
      tagline:
        'Backend, ma’lumotlar bazasi va API ishlab chiqaman. Node.js, NestJS, PostgreSQL va Prisma — kundalik vositalarim.',
      available: 'Yangi loyihalarga ochiqman',
      unavailable: 'Hozircha band',
      cta: 'Loyihalarni koʻrish',
      secondary: 'Bogʻlanish',
      resume: 'CV yuklab olish',
      scroll: 'Pastga',
    },
    about: {
      label: '01 — Men haqimda',
      title: 'Qisqacha oʻzim haqimda',
      body: [
        'Men Full-Stack dasturchi va grafik dizaynerman. Hozirda Japan Digital University’da Computer Engineering yoʻnalishida tahsil olaman. Asosan JavaScript/TypeScript ekotizimi, backend, maʼlumotlar bazasi va API development bilan ishlayman.',
        'Backend tarafida Node.js, Fastify, Express.js va NestJS, maʼlumotlar bazasi bilan ishlashda esa PostgreSQL, MySQL, Prisma va PostGIS texnologiyalaridan foydalanaman. Shuningdek, Docker, Git/GitHub/GitLab va AWS EC2 bilan ishlash hamda applicationlarni deploy qilish tajribam bor.',
        'Frontend tarafida HTML, CSS, JavaScript, TypeScript va React bilan ishlayman. Bundan tashqari, UI/UX va grafik dizayn bilan ham shugʻullanaman.',
      ],
    },
    skills: {
      label: '02 — Koʻnikmalar',
      title: 'Nimalar bilan ishlayman',
    },
    projects: {
      label: '03 — Loyihalar',
      title: 'Tanlangan ishlar',
      live: 'Saytni ochish',
      source: 'Kodi',
      all: 'Barchasi GitHub’da',
    },
    experience: {
      label: '04 — Tajriba',
      title: 'Ish tajribam',
    },
    contact: {
      label: '05 — Bogʻlanish',
      title: 'Keling, gaplashamiz',
      body: 'Yangi loyiha, hamkorlik yoki shunchaki savolingiz bormi? Xat yozing — odatda bir kun ichida javob beraman.',
      emailMe: 'Xat yuborish',
      copy: 'Nusxalash',
      copied: 'Nusxalandi',
    },
    footer: {
      built: 'React, Vite va Tailwind bilan qurilgan',
      rights: 'Barcha huquqlar himoyalangan',
      top: 'Yuqoriga',
    },
    a11y: {
      toggleTheme: 'Tungi/kunduzgi rejimni almashtirish',
      toggleLang: 'Tilni almashtirish',
      openMenu: 'Menyuni ochish',
      closeMenu: 'Menyuni yopish',
    },
  },

  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      greeting: 'Hi, I’m',
      tagline:
        'I build backends, databases and APIs. Node.js, NestJS, PostgreSQL and Prisma are my daily tools.',
      available: 'Open to new projects',
      unavailable: 'Currently booked',
      cta: 'View projects',
      secondary: 'Get in touch',
      resume: 'Download CV',
      scroll: 'Scroll',
    },
    about: {
      label: '01 — About',
      title: 'A little about me',
      body: [
        'I’m a full-stack developer and graphic designer, currently studying Computer Engineering at Japan Digital University. I work mainly in the JavaScript/TypeScript ecosystem — backend, databases and API development.',
        'On the backend I use Node.js, Fastify, Express.js and NestJS; for data, PostgreSQL, MySQL, Prisma and PostGIS. I also work with Docker, Git/GitHub/GitLab and AWS EC2, and deploy applications myself.',
        'On the frontend I work with HTML, CSS, JavaScript, TypeScript and React. Alongside that, I do UI/UX and graphic design.',
      ],
    },
    skills: {
      label: '02 — Skills',
      title: 'What I work with',
    },
    projects: {
      label: '03 — Projects',
      title: 'Selected work',
      live: 'Live site',
      source: 'Source',
      all: 'More on GitHub',
    },
    experience: {
      label: '04 — Experience',
      title: 'Where I’ve worked',
    },
    contact: {
      label: '05 — Contact',
      title: 'Let’s talk',
      body: 'Have a project, a role, or just a question? Drop me a line — I usually reply within a day.',
      emailMe: 'Send an email',
      copy: 'Copy',
      copied: 'Copied',
    },
    footer: {
      built: 'Built with React, Vite and Tailwind',
      rights: 'All rights reserved',
      top: 'Back to top',
    },
    a11y: {
      toggleTheme: 'Toggle dark mode',
      toggleLang: 'Switch language',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
  },

  ru: {
    nav: {
      about: 'Обо мне',
      skills: 'Навыки',
      projects: 'Проекты',
      experience: 'Опыт',
      contact: 'Контакты',
    },
    hero: {
      greeting: 'Привет, я',
      tagline:
        'Разрабатываю бэкенд, базы данных и API. Node.js, NestJS, PostgreSQL и Prisma — мои повседневные инструменты.',
      available: 'Открыт к новым проектам',
      unavailable: 'Сейчас занят',
      cta: 'Посмотреть проекты',
      secondary: 'Связаться',
      resume: 'Скачать резюме',
      scroll: 'Вниз',
    },
    about: {
      label: '01 — Обо мне',
      title: 'Немного о себе',
      body: [
        'Я full-stack разработчик и графический дизайнер. Сейчас учусь по направлению Computer Engineering в Japan Digital University. Работаю в основном в экосистеме JavaScript/TypeScript: бэкенд, базы данных и разработка API.',
        'На бэкенде использую Node.js, Fastify, Express.js и NestJS, для работы с данными — PostgreSQL, MySQL, Prisma и PostGIS. Также работаю с Docker, Git/GitHub/GitLab и AWS EC2 и сам разворачиваю приложения.',
        'На фронтенде работаю с HTML, CSS, JavaScript, TypeScript и React. Кроме того, занимаюсь UI/UX и графическим дизайном.',
      ],
    },
    skills: {
      label: '02 — Навыки',
      title: 'С чем я работаю',
    },
    projects: {
      label: '03 — Проекты',
      title: 'Избранные работы',
      live: 'Открыть сайт',
      source: 'Исходный код',
      all: 'Больше на GitHub',
    },
    experience: {
      label: '04 — Опыт',
      title: 'Где я работал',
    },
    contact: {
      label: '05 — Контакты',
      title: 'Давайте поговорим',
      body: 'Есть проект, вакансия или просто вопрос? Напишите мне — обычно отвечаю в течение дня.',
      emailMe: 'Написать письмо',
      copy: 'Копировать',
      copied: 'Скопировано',
    },
    footer: {
      built: 'Сделано на React, Vite и Tailwind',
      rights: 'Все права защищены',
      top: 'Наверх',
    },
    a11y: {
      toggleTheme: 'Переключить тёмную тему',
      toggleLang: 'Сменить язык',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
    },
  },

  ja: {
    nav: {
      about: '自己紹介',
      skills: 'スキル',
      projects: 'プロジェクト',
      experience: '経歴',
      contact: 'お問い合わせ',
    },
    hero: {
      greeting: 'こんにちは、',
      tagline:
        'バックエンド、データベース、API を開発しています。Node.js、NestJS、PostgreSQL、Prisma が日々の道具です。',
      available: '新しい案件を受付中',
      unavailable: '現在は対応不可',
      cta: 'プロジェクトを見る',
      secondary: '連絡する',
      resume: '履歴書をダウンロード',
      scroll: '下へ',
    },
    about: {
      label: '01 — 自己紹介',
      title: '私について',
      body: [
        'フルスタック開発者兼グラフィックデザイナーです。現在は Japan Digital University でコンピュータ工学を学んでいます。主に JavaScript / TypeScript のエコシステムで、バックエンド、データベース、API 開発に取り組んでいます。',
        'バックエンドでは Node.js、Fastify、Express.js、NestJS を、データ周りでは PostgreSQL、MySQL、Prisma、PostGIS を使います。Docker、Git / GitHub / GitLab、AWS EC2 も扱い、アプリケーションのデプロイも自分で行います。',
        'フロントエンドでは HTML、CSS、JavaScript、TypeScript、React を使います。あわせて UI/UX とグラフィックデザインも手がけています。',
      ],
    },
    skills: {
      label: '02 — スキル',
      title: '使用している技術',
    },
    projects: {
      label: '03 — プロジェクト',
      title: '主な制作物',
      live: 'サイトを開く',
      source: 'ソースコード',
      all: 'GitHub で見る',
    },
    experience: {
      label: '04 — 経歴',
      title: 'これまでの仕事',
    },
    contact: {
      label: '05 — お問い合わせ',
      title: 'お気軽にご連絡ください',
      body: 'プロジェクト、お仕事のご相談、ちょっとした質問でも構いません。メールをいただければ、通常1日以内に返信します。',
      emailMe: 'メールを送る',
      copy: 'コピー',
      copied: 'コピーしました',
    },
    footer: {
      built: 'React、Vite、Tailwind で構築',
      rights: '無断転載を禁じます',
      top: 'トップへ戻る',
    },
    a11y: {
      toggleTheme: 'ダークモードを切り替え',
      toggleLang: '言語を切り替え',
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
    },
  },
}

/* Navigatsiya bo'limlari tartibi */
export const sections = ['about', 'skills', 'projects', 'experience', 'contact']
