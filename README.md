# Stadium Portfolio — o'ynaladigan 3D futbol portfolio

Sayt o'yin bilan ochiladi: kamera stadionga kiradi, chiroqlar yonadi, o'yinchi maydon markazida
paydo bo'lib to'p bilan yura boshlaydi. Tashrifchi uni boshqarib, darvozabonni aldab gol uradi —
sekinlashtirilgan kadr, mushaklar, konfetti va "GOAL!" dan keyin stadion portfolioga aylanadi.
O'ynashni istamaganlar uchun har doim **Skip** tugmasi bor.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Three.js · React Three Fiber ·
Drei · Rapier (fizika) · Zustand (o'yin holati) · GSAP ScrollTrigger · Framer Motion · Lenis

## Boshqaruv

| | Klaviatura / sichqoncha | Telefon |
| --- | --- | --- |
| Harakat | `W` `A` `S` `D` yoki strelkalar | chap joystik |
| Tezlanish | `Shift` | joystikni chetigacha surish |
| Zarba | `Space` — ushlab turing (kuch), qo'yib yuboring | **Kick** tugmasi |
| Kamera | sichqoncha bilan sudrash (`A`/`D` ham buradi) | ekranni sudrash |

Zarba o'yinchi qarab turgan tomonga ketadi. Darvozabon burchaklarga yetolmaydi, har bir
muvaffaqiyatsiz urinishdan keyin esa biroz sekinlashadi.

O'yinni butunlay o'chirish: `site.ts` da `game.enabled: false` — sayt to'g'ridan-to'g'ri
portfolio bilan ochiladi. `prefers-reduced-motion` yoqilgan qurilmalarda ham shunday bo'ladi.

## Ishga tushirish

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## Sozlash

Hamma narsa bitta faylda: [`src/config/site.ts`](src/config/site.ts)

| Nima | Qayerda |
| --- | --- |
| Ism, forma yozuvi, raqam, reyting, pozitsiya | `player` |
| Mini-o'yinni yoqish/o'chirish | `game` |
| Yuz rasmi, 3D model, teri/soch rangi, soch uslubi | `avatar` |
| Forma ranglari | `kit` |
| Hero matni | `hero` |
| Karyera — ishlagan joylar | `career` |
| Ko'nikmalar (FIFA karta) | `skills`, `stack` |
| Loyihalar | `projects` |
| Kuboklar xonasi | `trophies` |
| GitHub, LinkedIn, Email, Telegram | `socials` |

### Jonli sozlash paneli

Saytni `/?edit` bilan oching (dev rejimida doim ko'rinadi) — o'ng pastdagi tugma panelni ochadi.
Ism, raqam, rasm, ko'nikmalar, havolalar va loyihalarni o'sha yerda o'zgartirib, natijani darhol
3D sahnada ko'rasiz. O'zgarishlar faqat shu brauzerda saqlanadi; doimiy qilish uchun
**Copy config** ni bosib, qiymatlarni `site.ts` ga ko'chiring.

### Yuzingizni qo'yish

1. Old tomondan tushgan, yuz markazda bo'lgan rasmni `public/me.jpg` qilib saqlang.
2. `site.ts` da `avatar.photo: '/me.jpg'` deb yozing.
3. Kerak bo'lsa `faceZoom` va `faceOffsetY` bilan moslang (panelda slayderlar bor).

Rasm o'yinchi boshining old qismiga yotqiziladi, teri rangi rasmdan olinib qo'l-oyoqlarga ham
qo'llanadi. Bu **stilizatsiya qilingan** avatar — rasmdan haqiqiy 3D yuz geometriyasi
yasalmaydi. To'liq o'xshash 3D bosh kerak bo'lsa, avatar-generator xizmatida (rasmdan `.glb`
eksport qiladigan) model yasab, `public/avatar.glb` ga qo'ying va `avatar.modelUrl: '/avatar.glb'`
deb yozing — protsedura o'yinchi o'rniga o'sha model yuklanadi.

## Tuzilma

```
src/
  config/site.ts          ← barcha kontent va sozlamalar
  lib/
    game.ts               o'yin holati (Zustand) + har kadrlik qiymatlar
    stage.ts              kirish sahnasi (chiroqlar, kamera, skaner)
    audio.ts              sintez qilingan ovozlar (zarba, hushtak, olomon)
    textures.ts           canvas'da chiziladigan teksturalar
  components/
    three/                Stadium, Game (fizika, to'p, darvozabon, gol), Footballer, CameraRig
    game/                 Hud, GameInput, GoalOverlay
    sections/             Hero, Skills (profil), Projects, Career, Trophies, Contact
    ui/                   Loader, Cursor, Curtain, Navbar, Magnetic, TiltCard, Reveal
    admin/Customizer.tsx  jonli sozlash paneli
```

## Performance

- 3D sahnalar alohida chunk bo'lib, faqat brauzerda yuklanadi; tunnel sahnasi — bo'limga
  yaqinlashgandagina.
- Tashqi model/tekstura yo'q: stadion, forma va maydon canvas'da protsedura usulida chiziladi.
- Bitta kichik soya xaritasi (o'yinchiga ergashadi), instancing, adaptiv DPR.
- three.js va Rapier (WASM) asosiy bundle'ga kirmaydi — sahna bilan birga alohida yuklanadi.
- Ekrandan chiqqan canvas render va fizikani to'xtatadi.
- `prefers-reduced-motion` yoqilgan bo'lsa animatsiyalar o'chiriladi.
