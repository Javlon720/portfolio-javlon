# Portfolio

Shaxsiy portfolio sayti — **React 19 + Vite + Tailwind CSS v4**.
Ikki tilli (UZ / EN), tungi va kunduzgi rejim, to‘liq moslashuvchan (responsive).

---

## Ishga tushirish

```bash
npm install      # bir marta
npm run dev      # http://localhost:5173
npm run build    # dist/ papkasiga yig'ish
npm run preview  # yig'ilgan versiyani ko'rish
```

---

## Saytni o‘zingiznikiga aylantirish

Deyarli hamma narsa **bitta faylda**: `src/data/content.js`

| Nima o‘zgartiriladi | Qayerda |
|---|---|
| Ism, kasb, email, telefon, manzil | `profile` |
| GitHub / LinkedIn / Telegram havolalari | `socials` |
| Ko‘nikmalar ro‘yxati | `skills` |
| Loyihalar | `projects` |
| Ish tajribasi | `experience` |
| Hero ostidagi raqamlar | `stats` |
| Barcha tugma va sarlavha matnlari | `ui.uz` va `ui.en` |

`{ uz: '...', en: '...' }` ko‘rinishidagi har bir joy — ikki tilli matn.
**Ikkalasini ham to‘ldiring**, aks holda til almashtirilganda bo‘sh joy chiqadi.

### CV (rezyume)

`profile.resumeUrl` `/resume.pdf` ga ishora qiladi.
O‘z PDF faylingizni **`public/resume.pdf`** nomi bilan tashlang — havola o‘zi ishlaydi.
CV kerak bo‘lmasa, `src/components/Hero.jsx` dagi "CV yuklab olish" havolasini o‘chiring.

### Loyiha rasmlari

`projects` ichidagi `image: null` bo‘lsa — avtomatik gradient plashka chiziladi.
Skrinshot qo‘ymoqchi bo‘lsangiz: rasmni `public/` ga tashlang va `image: '/shopflow.png'` deb yozing.

### Ranglar va shriftlar

`src/index.css` ning yuqorisidagi `:root` (kunduzgi) va `.dark` (tungi) bloklari.
Bitta rangni o‘zgartirsangiz — butun sayt bo‘ylab yangilanadi.
Hozirgi palitra: monoxrom (zinc) + ko‘k akcent. Shriftlar: **Archivo** (matn) / **Space Grotesk** (sarlavha).

### Favicon va SEO

- `public/favicon.svg` — ichidagi `JA` harflarini o‘zingiznikiga almashtiring.
- `index.html` — `<title>`, `description`, `og:` teglari va `canonical` havolasi.
  Saytni joylashtirgandan keyin `https://example.com/` o‘rniga haqiqiy domeningizni yozing.

---

## Tuzilishi

```
src/
├─ data/content.js       ← BARCHA MATN SHU YERDA
├─ context/AppContext.jsx  til + tema holati (localStorage'da saqlanadi)
├─ hooks/useReveal.js      scroll animatsiyasi + faol bo'limni aniqlash
├─ components/
│  ├─ Navbar.jsx        yopishqoq menyu, mobil menyu, UZ/EN va tema tugmalari
│  ├─ Hero.jsx          bosh ekran
│  ├─ About.jsx         men haqimda
│  ├─ Skills.jsx        ko'nikmalar
│  ├─ Projects.jsx      loyihalar
│  ├─ Experience.jsx    tajriba (vaqt chizig'i)
│  ├─ Contact.jsx       bog'lanish
│  ├─ Footer.jsx
│  ├─ SectionShell.jsx  bo'limlar uchun umumiy ramka
│  ├─ SocialLinks.jsx
│  └─ BrandIcons.jsx    GitHub/LinkedIn/Telegram SVG ikonkalari
├─ index.css            dizayn tokenlari (ranglar, shriftlar)
└─ App.jsx              bo'limlar tartibi
```

Bo‘lim qo‘shish yoki tartibini o‘zgartirish: `App.jsx` dagi ketma-ketlik va
`content.js` oxiridagi `sections` massivi (menyu shundan yasaladi).

---

## Internetga joylashtirish

**Vercel** (eng oson):
```bash
npx vercel
```

**Netlify**: `npm run build` → `dist/` papkasini netlify.com ga sudrab tashlang.

**GitHub Pages**: `vite.config.js` ga `base: '/repo-nomi/'` qo‘shing, so‘ng `dist/` ni `gh-pages` shoxiga chiqaring.

---

## Nimalar hisobga olingan

- Klaviatura bilan to‘liq boshqariladi, fokus doimo ko‘rinadi
- Matn kontrasti ikkala rejimda ham WCAG AA (4.5:1) dan yuqori
- `prefers-reduced-motion` — animatsiya sezgirligi hurmat qilinadi
- Bosiladigan elementlar kamida 44×44px
- Rasmlar `loading="lazy"`, tema sahifa chizilishidan oldin qo‘llanadi (miltillash yo‘q)
