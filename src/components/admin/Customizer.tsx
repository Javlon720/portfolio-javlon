'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, RotateCcw, Settings2, Upload, X } from 'lucide-react'
import { useSite } from '@/lib/store'
import { HAIR_STYLES } from '@/lib/look'
import type { Project, SiteConfig } from '@/config/site'

/* Jonli sozlash paneli. Faqat development rejimida yoki manzilda `?edit`
   bo'lganda ko'rinadi — oddiy tashrifchilar uni ko'rmaydi.
   O'zgarishlar shu brauzerda (localStorage) saqlanadi; doimiy qilish uchun
   "Copy config" natijasini src/config/site.ts ga ko'chiring. */

const KIT_PARTS: { key: keyof SiteConfig['kit']; label: string }[] = [
  { key: 'shirt', label: 'Shirt' },
  { key: 'accent', label: 'Accent' },
  { key: 'trim', label: 'Trim' },
  { key: 'detail', label: 'Detail' },
  { key: 'shorts', label: 'Shorts' },
  { key: 'socks', label: 'Socks' },
  { key: 'boots', label: 'Boots' },
]

const field = 'w-full rounded-lg border border-line bg-white/[0.04] px-3 py-2 text-sm text-chalk outline-none focus:border-uz'

/** Rasmni kichraytirib data-URL ga aylantiradi (localStorage'ga sig'ishi uchun) */
function readPhoto(file: File, max = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.86))
    }
    img.onerror = reject
    img.src = url
  })
}

function Label({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <label className="block">
      <span className="label mb-1.5 block text-[0.58rem] text-mute">{title}</span>
      {children}
    </label>
  )
}

export function Customizer() {
  const { site, overrides, update, reset } = useSite()
  const [owner, setOwner] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [projectsJson, setProjectsJson] = useState('')
  const [jsonError, setJsonError] = useState('')

  useEffect(() => {
    setOwner(process.env.NODE_ENV !== 'production' || new URLSearchParams(location.search).has('edit'))
  }, [])

  useEffect(() => {
    if (open) setProjectsJson(JSON.stringify(site.projects, null, 2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!owner) return null
  const { player, avatar, socials, kit } = site

  const applyProjects = () => {
    try {
      const parsed = JSON.parse(projectsJson) as Project[]
      if (!Array.isArray(parsed)) throw new Error('Must be an array')
      update({ projects: parsed })
      setJsonError('')
    } catch (e) {
      setJsonError((e as Error).message)
    }
  }

  const copyConfig = async () => {
    // Yuklangan rasm (data-URL) juda uzun — uni faylga alohida qo'yish kerak
    const out = JSON.parse(JSON.stringify(overrides))
    if (out.avatar?.photo?.startsWith('data:')) out.avatar.photo = '/me.jpg  ← save your photo as public/me.jpg'
    await navigator.clipboard.writeText(JSON.stringify(out, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      {owner && (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open customizer"
        className="glass fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full text-uz shadow-[0_0_30px_rgb(25_195_230/0.35)] transition-transform hover:rotate-90"
      >
        <Settings2 size={20} />
      </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.aside
            data-ui
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-line bg-night/95 backdrop-blur-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            aria-label="Customizer"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="display text-2xl">Customize</p>
                <p className="text-xs text-mute">Changes are saved in this browser</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
              <section className="space-y-3">
                <p className="label text-uz">Player</p>
                <div className="grid grid-cols-2 gap-3">
                  {owner && (
                    <>
                      <Label title="First name">
                        <input className={field} value={player.firstName} onChange={(e) => update({ player: { ...player, firstName: e.target.value } })} />
                      </Label>
                      <Label title="Full name">
                        <input className={field} value={player.fullName} onChange={(e) => update({ player: { ...player, fullName: e.target.value } })} />
                      </Label>
                    </>
                  )}
                  <Label title="Jersey name">
                    <input
                      className={field}
                      maxLength={14}
                      value={player.jerseyName}
                      onChange={(e) => update({ player: { ...player, jerseyName: e.target.value.toUpperCase() } })}
                    />
                  </Label>
                  <Label title="Jersey number">
                    <input
                      className={field}
                      type="number"
                      min={0}
                      max={99}
                      value={player.number}
                      onChange={(e) => update({ player: { ...player, number: Math.max(0, Math.min(99, Number(e.target.value) || 0)) } })}
                    />
                  </Label>
                </div>
                {owner && (
                <div className="grid grid-cols-[1fr_5.5rem] gap-3">
                  <Label title="Position">
                    <input className={field} value={player.position} onChange={(e) => update({ player: { ...player, position: e.target.value } })} />
                  </Label>
                  <Label title="Rating">
                    <input
                      className={field}
                      type="number"
                      min={1}
                      max={99}
                      value={player.rating}
                      onChange={(e) => update({ player: { ...player, rating: Math.max(1, Math.min(99, Number(e.target.value) || 1)) } })}
                    />
                  </Label>
                </div>
                )}
              </section>

              <section className="space-y-3">
                <p className="label text-uz">Kit colours</p>
                <div className="grid grid-cols-4 gap-3">
                  {KIT_PARTS.map(({ key, label }) => (
                    <Label key={key} title={label}>
                      <input
                        type="color"
                        className="h-9 w-full rounded-lg bg-transparent"
                        value={kit[key]}
                        onChange={(e) => update({ kit: { ...kit, [key]: e.target.value } })}
                      />
                    </Label>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <p className="label text-uz">Face / avatar</p>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-white/5">
                    {avatar.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar.photo} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <label className="label flex cursor-pointer items-center gap-2 rounded-full bg-uz px-4 py-2.5 text-[0.6rem] font-medium text-ink">
                    <Upload size={13} /> Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) update({ avatar: { ...avatar, photo: await readPhoto(file) } })
                        e.target.value = ''
                      }}
                    />
                  </label>
                  {avatar.photo && (
                    <button className="label text-[0.6rem] text-mute hover:text-flare" onClick={() => update({ avatar: { ...avatar, photo: null } })}>
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-mute">
                  Use a front-facing portrait with the face centred. The photo is wrapped onto the player&apos;s head and the skin tone is
                  sampled from it.
                </p>
                <Label title={`Face zoom — ${avatar.faceZoom.toFixed(2)}×`}>
                  <input
                    type="range"
                    min={0.6}
                    max={3}
                    step={0.05}
                    value={avatar.faceZoom}
                    className="w-full accent-[var(--color-uz)]"
                    onChange={(e) => update({ avatar: { ...avatar, faceZoom: Number(e.target.value) } })}
                  />
                </Label>
                <Label title={`Face vertical offset — ${avatar.faceOffsetY.toFixed(2)}`}>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.02}
                    value={avatar.faceOffsetY}
                    className="w-full accent-[var(--color-uz)]"
                    onChange={(e) => update({ avatar: { ...avatar, faceOffsetY: Number(e.target.value) } })}
                  />
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Label title="Skin tone (no photo)">
                    <input type="color" className="h-9 w-full rounded-lg bg-transparent" value={avatar.skinTone} onChange={(e) => update({ avatar: { ...avatar, skinTone: e.target.value } })} />
                  </Label>
                  <Label title="Hair colour">
                    <input type="color" className="h-9 w-full rounded-lg bg-transparent" value={avatar.hairColor} onChange={(e) => update({ avatar: { ...avatar, hairColor: e.target.value } })} />
                  </Label>
                </div>
                <Label title="Hair style">
                  <div className="grid grid-cols-4 gap-2">
                    {HAIR_STYLES.map((style) => (
                      <button
                        key={style}
                        type="button"
                        aria-pressed={avatar.hairStyle === style}
                        onClick={() => update({ avatar: { ...avatar, hairStyle: style } })}
                        className={`label rounded-lg border px-2 py-2.5 text-[0.58rem] transition-colors ${
                          avatar.hairStyle === style ? 'border-uz bg-uz/15 text-uz' : 'border-line text-mute hover:text-chalk'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </Label>
                {owner && (
                <Label title="3D avatar model (.glb URL, optional)">
                  <input
                    className={field}
                    placeholder="/avatar.glb"
                    value={avatar.modelUrl ?? ''}
                    onChange={(e) => update({ avatar: { ...avatar, modelUrl: e.target.value.trim() || null } })}
                  />
                </Label>
                )}
              </section>

              {owner && (
                <>
              <section className="space-y-3">
                <p className="label text-uz">Skills</p>
                {site.skills.map((s, i) => (
                  <Label key={s.short} title={`${s.label} — ${s.value}%`}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={s.value}
                      className="w-full accent-[var(--color-uz)]"
                      onChange={(e) =>
                        update({ skills: site.skills.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)) })
                      }
                    />
                  </Label>
                ))}
              </section>

              <section className="space-y-3">
                <p className="label text-uz">Social links</p>
                {(['github', 'linkedin', 'email', 'telegram'] as const).map((k) => (
                  <Label key={k} title={k}>
                    <input
                      className={field}
                      value={socials[k] ?? ''}
                      onChange={(e) => update({ socials: { ...socials, [k]: e.target.value || (k === 'telegram' ? null : '') } })}
                    />
                  </Label>
                ))}
              </section>

              <section className="space-y-3">
                <p className="label text-uz">Projects (JSON)</p>
                <textarea
                  className={`${field} h-56 font-mono text-xs leading-relaxed`}
                  spellCheck={false}
                  value={projectsJson}
                  onChange={(e) => setProjectsJson(e.target.value)}
                />
                {jsonError && <p className="text-xs text-flare">Invalid JSON: {jsonError}</p>}
                <button onClick={applyProjects} className="label rounded-full border border-line px-4 py-2.5 text-[0.6rem] hover:border-uz hover:text-uz">
                  Apply projects
                </button>
              </section>
                </>
              )}
            </div>

            <div className="flex gap-3 border-t border-line px-5 py-4">
              {owner && (
              <button onClick={copyConfig} className="label flex flex-1 items-center justify-center gap-2 rounded-full bg-chalk py-3 text-[0.62rem] font-medium text-ink hover:bg-uz">
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy config'}
              </button>
              )}
              <button onClick={reset} className={`label flex items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-[0.62rem] hover:border-flare hover:text-flare ${owner ? '' : 'flex-1'}`}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
