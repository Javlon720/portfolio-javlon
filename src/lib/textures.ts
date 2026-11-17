import * as THREE from 'three'
import type { SiteConfig } from '@/config/site'

/* Barcha teksturalar brauzerda canvas orqali chiziladi —
   tashqi rasm/model yuklanmaydi, shuning uchun sahna darhol ochiladi. */

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

const displayFont = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--font-barlow').trim() || 'Impact, sans-serif'

const srgb = (t: THREE.Texture) => {
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ------------------------------------------------------------------ maydon */
export function makePitchTexture() {
  const W = 2048
  const H = 1326 // 105 × 68 m
  const [c, g] = canvas(W, H)
  const m = W / 105 // 1 metr = m piksel

  // O'rilgan yo'laklar
  const bands = 18
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? '#17662b' : '#1f7d35'
    g.fillRect((i * W) / bands, 0, W / bands + 1, H)
  }
  // Mayda don — o't teksturasi
  const img = g.getImageData(0, 0, W, H)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22
    img.data[i] += n * 0.6
    img.data[i + 1] += n
    img.data[i + 2] += n * 0.5
  }
  g.putImageData(img, 0, 0)

  g.strokeStyle = 'rgba(255,255,255,0.92)'
  g.fillStyle = 'rgba(255,255,255,0.92)'
  g.lineWidth = 0.14 * m * 1.6
  const cx = W / 2
  const cy = H / 2
  const pad = 2
  g.strokeRect(pad, pad, W - pad * 2, H - pad * 2)
  g.beginPath()
  g.moveTo(cx, pad)
  g.lineTo(cx, H - pad)
  g.stroke()
  g.beginPath()
  g.arc(cx, cy, 9.15 * m, 0, Math.PI * 2)
  g.stroke()
  g.beginPath()
  g.arc(cx, cy, 0.3 * m, 0, Math.PI * 2)
  g.fill()
  for (const side of [0, 1]) {
    const x0 = side ? W - pad : pad
    const dir = side ? -1 : 1
    g.strokeRect(Math.min(x0, x0 + dir * 16.5 * m), cy - 20.16 * m, 16.5 * m, 40.32 * m)
    g.strokeRect(Math.min(x0, x0 + dir * 5.5 * m), cy - 9.16 * m, 5.5 * m, 18.32 * m)
    g.beginPath()
    g.arc(x0 + dir * 11 * m, cy, 0.25 * m, 0, Math.PI * 2)
    g.fill()
    g.beginPath()
    g.arc(x0 + dir * 11 * m, cy, 9.15 * m, side ? Math.PI - 0.925 : -0.925, side ? Math.PI + 0.925 : 0.925)
    g.stroke()
  }

  const t = srgb(new THREE.CanvasTexture(c))
  t.anisotropy = 8
  return t
}

/* ------------------------------------------------------------- tomoshabinlar */
export function makeCrowdTexture() {
  const S = 512
  const [c, g] = canvas(S, S)
  g.fillStyle = '#070b12'
  g.fillRect(0, 0, S, S)
  const palette = ['#f3f6fa', '#0099b5', '#1eb53a', '#dfe6ee', '#19c3e6', '#ce1126', '#8fa2b8', '#f3f6fa', '#0b7f97']
  const rows = 46
  for (let r = 0; r < rows; r++) {
    const v = r / rows
    // O'rtadagi qorong'i yo'lak (yaruslar orasi) va pastki reklama bandi
    if (v > 0.44 && v < 0.52) continue
    if (v < 0.035) continue
    const y = S - (r + 0.5) * (S / rows)
    for (let x = 6; x < S - 6; x += 7) {
      // Zinapoya yo'laklari
      if (x % 128 < 10) continue
      if (Math.random() < 0.12) continue
      g.globalAlpha = 0.35 + Math.random() * 0.65
      g.fillStyle = palette[(Math.random() * palette.length) | 0]
      g.fillRect(x + Math.random() * 2, y - 3, 4, 5)
    }
  }
  g.globalAlpha = 1
  g.fillStyle = '#0d1520'
  g.fillRect(0, S * 0.48, S, S * 0.08)
  const t = srgb(new THREE.CanvasTexture(c))
  t.wrapS = THREE.RepeatWrapping
  t.repeat.set(22, 1)
  t.anisotropy = 4
  return t
}

/* ---------------------------------------------------------- yumshoq nur dog'i */
export function makeGlowTexture(streak = false) {
  const S = 256
  const [c, g] = canvas(S, S)
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.12, 'rgba(225,240,255,0.75)')
  grad.addColorStop(0.4, 'rgba(160,205,255,0.16)')
  grad.addColorStop(1, 'rgba(120,180,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, S, S)
  if (streak) {
    // Gorizontal linza chizig'i
    const line = g.createLinearGradient(0, 0, S, 0)
    line.addColorStop(0, 'rgba(180,220,255,0)')
    line.addColorStop(0.5, 'rgba(230,245,255,0.9)')
    line.addColorStop(1, 'rgba(180,220,255,0)')
    g.fillStyle = line
    g.fillRect(0, S / 2 - 2, S, 4)
  }
  return srgb(new THREE.CanvasTexture(c))
}

/** Nur konusi uchun: tepada yorqin, pastda so'nadi */
export function makeBeamTexture() {
  const [c, g] = canvas(8, 256)
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.28)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 8, 256)
  return srgb(new THREE.CanvasTexture(c))
}

/** Projektor paneli: chiroqlar panjarasi */
export function makeLampTexture() {
  const [c, g] = canvas(256, 96)
  g.fillStyle = '#05080c'
  g.fillRect(0, 0, 256, 96)
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 11; x++) {
      const px = 14 + x * 23
      const py = 13 + y * 23
      const grad = g.createRadialGradient(px, py, 0, px, py, 10)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.5, '#dcebff')
      grad.addColorStop(1, 'rgba(180,210,255,0)')
      g.fillStyle = grad
      g.fillRect(px - 10, py - 10, 20, 20)
    }
  return srgb(new THREE.CanvasTexture(c))
}

/** Oyoq ostidagi cho'zinchoq soya */
export function makeShadowTexture() {
  const [c, g] = canvas(64, 256)
  const grad = g.createLinearGradient(0, 256, 0, 0)
  grad.addColorStop(0, 'rgba(0,0,0,0.9)')
  grad.addColorStop(0.35, 'rgba(0,0,0,0.45)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 256)
  // Chetlarini yumshatish
  g.globalCompositeOperation = 'destination-in'
  const side = g.createLinearGradient(0, 0, 64, 0)
  side.addColorStop(0, 'rgba(0,0,0,0)')
  side.addColorStop(0.5, 'rgba(0,0,0,1)')
  side.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = side
  g.fillRect(0, 0, 64, 256)
  return new THREE.CanvasTexture(c)
}

/* ------------------------------------------------------------ LED reklama */
export function makeLedTexture(words: string[]) {
  const W = 2048
  const H = 64
  const [c, g] = canvas(W, H)
  g.fillStyle = '#03060a'
  g.fillRect(0, 0, W, H)
  g.font = `700 44px ${displayFont()}`
  g.textBaseline = 'middle'
  const colors = ['#19c3e6', '#f3f6fa', '#1eb53a', '#f3f6fa']
  let x = 20
  let i = 0
  while (x < W - 40) {
    const w = words[i % words.length].toUpperCase()
    g.fillStyle = colors[i % colors.length]
    const tw = g.measureText(w).width
    if (x + tw > W - 20) break
    g.fillText(w, x, H / 2 + 2)
    x += tw + 34
    g.fillStyle = '#ce1126'
    g.fillRect(x - 20, H / 2 - 4, 8, 8)
    i++
  }
  // LED piksellar effekti
  g.fillStyle = 'rgba(0,0,0,0.28)'
  for (let px = 0; px < W; px += 4) g.fillRect(px, 0, 1, H)
  for (let py = 0; py < H; py += 4) g.fillRect(0, py, W, 1)
  const t = srgb(new THREE.CanvasTexture(c))
  t.wrapS = THREE.RepeatWrapping
  return t
}

/* ------------------------------------------------------------------- forma */
function drawEmblem(g: CanvasRenderingContext2D, x: number, y: number, s: number, kit: SiteConfig['kit']) {
  // O'zbekiston uslubidagi qalqon: yarim oy + yulduzlar (rasmiy logotip emas)
  g.save()
  g.translate(x, y)
  g.beginPath()
  g.moveTo(-s, -s * 1.1)
  g.lineTo(s, -s * 1.1)
  g.lineTo(s, s * 0.25)
  g.quadraticCurveTo(s, s * 1.05, 0, s * 1.35)
  g.quadraticCurveTo(-s, s * 1.05, -s, s * 0.25)
  g.closePath()
  g.fillStyle = kit.accent
  g.fill()
  g.lineWidth = s * 0.13
  g.strokeStyle = '#ffffff'
  g.stroke()
  g.save()
  g.clip()
  g.fillStyle = kit.trim
  g.fillRect(-s, s * 0.45, s * 2, s)
  g.fillStyle = kit.detail
  g.fillRect(-s, s * 0.34, s * 2, s * 0.09)
  g.fillStyle = '#ffffff'
  g.fillRect(-s, s * 0.22, s * 2, s * 0.12)
  g.restore()
  // Yarim oy
  g.fillStyle = '#ffffff'
  g.beginPath()
  g.arc(-s * 0.32, -s * 0.45, s * 0.36, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = kit.accent
  g.beginPath()
  g.arc(-s * 0.19, -s * 0.5, s * 0.31, 0, Math.PI * 2)
  g.fill()
  // Yulduzlar
  g.fillStyle = '#ffffff'
  const stars = [
    [0.25, -0.72],
    [0.55, -0.72],
    [0.1, -0.44],
    [0.4, -0.44],
    [0.68, -0.44],
    [0.25, -0.16],
    [0.55, -0.16],
  ]
  for (const [sx, sy] of stars) {
    g.beginPath()
    g.arc(sx * s, sy * s, s * 0.07, 0, Math.PI * 2)
    g.fill()
  }
  g.restore()
}

/** Forma teksturasi. Canvas markazi — ko'krak, chetlari — orqa (silindr atrofida o'raladi). */
export function makeJerseyTexture(site: SiteConfig) {
  const W = 2048
  const H = 1024
  const [c, g] = canvas(W, H)
  const { kit, player } = site
  const font = displayFont()

  g.fillStyle = kit.shirt
  g.fillRect(0, 0, W, H)

  // Mato to'qimasi — nozik diagonal chiziqlar
  g.strokeStyle = 'rgba(10,40,70,0.045)'
  g.lineWidth = 2
  for (let i = -H; i < W; i += 14) {
    g.beginPath()
    g.moveTo(i, 0)
    g.lineTo(i + H, H)
    g.stroke()
  }

  // Yon panellar (adras naqshidan ilhomlangan romblar)
  for (const cx of [W * 0.25, W * 0.75]) {
    const half = 105
    const grad = g.createLinearGradient(cx - half, 0, cx + half, 0)
    grad.addColorStop(0, kit.accent)
    grad.addColorStop(0.5, '#05708a')
    grad.addColorStop(1, kit.accent)
    g.fillStyle = grad
    g.fillRect(cx - half, 0, half * 2, H)
    g.fillStyle = 'rgba(255,255,255,0.14)'
    for (let y = -40; y < H; y += 120) {
      g.beginPath()
      g.moveTo(cx, y)
      g.lineTo(cx + 62, y + 60)
      g.lineTo(cx, y + 120)
      g.lineTo(cx - 62, y + 60)
      g.closePath()
      g.fill()
    }
    g.fillStyle = kit.trim
    g.fillRect(cx - half - 16, 0, 16, H)
    g.fillRect(cx + half, 0, 16, H)
    g.fillStyle = kit.detail
    g.fillRect(cx - half - 22, 0, 6, H)
    g.fillRect(cx + half + 16, 0, 6, H)
  }

  // Etak: bayroq ranglari
  g.fillStyle = kit.accent
  g.fillRect(0, H - 54, W, 54)
  g.fillStyle = kit.detail
  g.fillRect(0, H - 62, W, 8)
  g.fillStyle = kit.trim
  g.fillRect(0, H - 18, W, 18)
  // Yelka
  g.fillStyle = kit.accent
  g.fillRect(0, 0, W, 46)
  g.fillStyle = kit.detail
  g.fillRect(0, 46, W, 7)

  g.textAlign = 'center'
  g.textBaseline = 'middle'
  const number = String(player.number)
  const ink = '#0a3a55'

  // --- Old tomon (markaz)
  drawEmblem(g, W / 2 + 205, 330, 58, kit)
  // Bayroq yamog'i
  const fx = W / 2 - 265
  const fy = 290
  g.fillStyle = kit.accent
  g.fillRect(fx, fy, 120, 27)
  g.fillStyle = '#ffffff'
  g.fillRect(fx, fy + 27, 120, 26)
  g.fillStyle = kit.trim
  g.fillRect(fx, fy + 53, 120, 27)
  g.fillStyle = kit.detail
  g.fillRect(fx, fy + 25, 120, 3)
  g.fillRect(fx, fy + 52, 120, 3)
  g.fillStyle = ink
  g.font = `800 250px ${font}`
  g.fillText(number, W / 2, 610)
  g.font = `700 54px ${font}`
  g.fillStyle = kit.accent
  g.fillText('UZBEKISTAN', W / 2, 800)

  // --- Orqa tomon (ikkala chetda — tikuv joyida birlashadi)
  for (const x of [0, W]) {
    g.fillStyle = ink
    let size = 132
    g.font = `800 ${size}px ${font}`
    const name = player.jerseyName.toUpperCase()
    // Uzun ism sig'ishi uchun kichraytiramiz
    while (g.measureText(name).width > 430 && size > 50) {
      size -= 6
      g.font = `800 ${size}px ${font}`
    }
    g.fillText(name, x, 240)
    g.font = `800 390px ${font}`
    g.fillText(number, x, 560)
  }

  const t = srgb(new THREE.CanvasTexture(c))
  t.wrapS = THREE.RepeatWrapping
  t.offset.x = 0.5
  t.anisotropy = 8
  return t
}

/* --------------------------------------------------------------------- to'p */
export function makeBallTexture() {
  const [c, g] = canvas(512, 256)
  g.fillStyle = '#f4f6f9'
  g.fillRect(0, 0, 512, 256)
  g.fillStyle = '#12161c'
  const spots = [
    [64, 128], [192, 128], [320, 128], [448, 128],
    [128, 50], [384, 50], [128, 206], [384, 206], [256, 20], [256, 236], [0, 40], [512, 40], [0, 216], [512, 216],
  ]
  for (const [x, y] of spots) {
    g.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2
      g.lineTo(x + Math.cos(a) * 34, y + Math.sin(a) * 26)
    }
    g.closePath()
    g.fill()
  }
  return srgb(new THREE.CanvasTexture(c))
}

/* --------------------------------------------------------------------- yuz */
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/** Chetlari silliq so'nadigan oval niqob */
function featherMask(g: CanvasRenderingContext2D, S: number) {
  g.globalCompositeOperation = 'destination-in'
  g.save()
  g.translate(S / 2, S / 2)
  g.scale(0.86, 1)
  const grad = g.createRadialGradient(0, 0, S * 0.3, 0, 0, S * 0.5)
  grad.addColorStop(0, 'rgba(0,0,0,1)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(-S, -S, S * 2, S * 2)
  g.restore()
  g.globalCompositeOperation = 'source-over'
}

/** Rasm bo'lmaganda — sodda, stilizatsiya qilingan yuz */
function drawDefaultFace(g: CanvasRenderingContext2D, S: number, skin: string, hair: string) {
  g.fillStyle = skin
  g.fillRect(0, 0, S, S)
  const shade = 'rgba(60,25,10,0.28)'
  // Qoshlar
  g.strokeStyle = hair
  g.lineCap = 'round'
  g.lineWidth = 15
  for (const d of [-1, 1]) {
    g.beginPath()
    g.moveTo(S / 2 + d * 52, 208)
    g.quadraticCurveTo(S / 2 + d * 100, 190, S / 2 + d * 148, 210)
    g.stroke()
  }
  // Ko'zlar
  for (const d of [-1, 1]) {
    g.fillStyle = '#f2ede8'
    g.beginPath()
    g.ellipse(S / 2 + d * 98, 250, 30, 15, 0, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#2a1a12'
    g.beginPath()
    g.arc(S / 2 + d * 98, 250, 13, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = 'rgba(30,15,8,0.7)'
    g.lineWidth = 5
    g.beginPath()
    g.ellipse(S / 2 + d * 98, 248, 31, 15, 0, Math.PI, Math.PI * 2)
    g.stroke()
  }
  // Burun
  g.strokeStyle = shade
  g.lineWidth = 9
  g.beginPath()
  g.moveTo(S / 2 - 6, 262)
  g.quadraticCurveTo(S / 2 - 26, 330, S / 2 + 4, 340)
  g.stroke()
  // Og'iz
  g.strokeStyle = 'rgba(110,45,40,0.75)'
  g.lineWidth = 10
  g.beginPath()
  g.moveTo(S / 2 - 52, 392)
  g.quadraticCurveTo(S / 2, 412, S / 2 + 52, 390)
  g.stroke()
}

export interface FaceResult {
  texture: THREE.Texture
  /** Rasmdan olingan o'rtacha teri rangi — bo'yin, qo'l va oyoqlarga ham qo'llanadi */
  skin: string
}

export async function makeFaceTexture(avatar: SiteConfig['avatar']): Promise<FaceResult> {
  const S = 512
  const [c, g] = canvas(S, S)
  let skin = avatar.skinTone

  if (avatar.photo) {
    try {
      const img = await loadImage(avatar.photo)
      // Markazdan kvadrat kesib olamiz, zoom va vertikal siljitishni qo'llaymiz
      const side = Math.min(img.width, img.height) / Math.max(0.4, avatar.faceZoom)
      const sx = (img.width - side) / 2
      const sy = (img.height - side) / 2 - avatar.faceOffsetY * side * 0.5
      g.drawImage(img, sx, sy, side, side, 0, 0, S, S)

      // Yonoq va peshona sohasidan o'rtacha teri rangini olamiz
      const d = g.getImageData(S * 0.36, S * 0.3, S * 0.28, S * 0.34).data
      let r = 0
      let gr = 0
      let b = 0
      let n = 0
      for (let i = 0; i < d.length; i += 16) {
        r += d[i]
        gr += d[i + 1]
        b += d[i + 2]
        n++
      }
      skin = toHex(r / n, gr / n, b / n)
    } catch {
      drawDefaultFace(g, S, skin, avatar.hairColor)
    }
  } else {
    drawDefaultFace(g, S, skin, avatar.hairColor)
  }

  featherMask(g, S)
  return { texture: srgb(new THREE.CanvasTexture(c)), skin }
}

/* ------------------------------------------------------------ darvoza to'ri */
export function makeNetTexture() {
  const S = 128
  const [c, g] = canvas(S, S)
  g.clearRect(0, 0, S, S)
  g.strokeStyle = 'rgba(255,255,255,0.85)'
  g.lineWidth = 3
  g.strokeRect(0, 0, S, S)
  const t = srgb(new THREE.CanvasTexture(c))
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}
