'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SiteConfig } from '@/config/site'
import { stage } from '@/lib/stage'
import { makeFaceTexture, makeJerseyTexture, type FaceResult } from '@/lib/textures'

/* Protsedura usulida yig'ilgan va animatsiya qilinadigan futbolchi (bo'yi ~1.83 m).
   - Soch uslubi (short / fade / curly / bald), butsa (taglik, tishlar, bog'ich),
     kapitan bog'ichi va darvozabon qo'lqopi — sozlamalardan.
   - Forma teksturasi ism/raqam/ranglardan canvas'da chiziladi.
   - Yuz rasmi boshning old qismiga yumshoq niqob bilan proyeksiya qilinadi,
     teri rangi rasmdan olinib butun tanaga qo'llanadi.
   - Yurish/yugurish, zarba, nishonlash va darvozabon sakrashi — bo'g'imlarni
     har kadrda hisoblash orqali (mocap fayllari yo'q).
   - "Skaner" effekti: kesuvchi tekislik oyoqdan boshgacha ko'tariladi. */

export interface Anim {
  /** m/s */
  speed: number
  /** Qadam fazasi (radian) */
  phase: number
  /** Zarba progressi: 0 = yo'q, (0..1] = davom etmoqda */
  kick: number
  /** Nishonlash (0..1): qo'llar tepada, sakrash */
  celebrate: number
  /** Darvozabon sakrashi: -1..1 (yo'nalish) */
  dive: number
  /** To'pni oyoq ostida ushlab turish pozasi (0..1) */
  trap: number
  /** Qo'llarni yonga ochish (darvozabon) */
  armsOut: number
  lookX: number
  lookY: number
}

export const makeAnim = (): Anim => ({
  speed: 0,
  phase: 0,
  kick: 0,
  celebrate: 0,
  dive: 0,
  trap: 0,
  armsOut: 0,
  lookX: 0,
  lookY: 0,
})

const HEIGHT = 2.05
const lerp = THREE.MathUtils.lerp

/** Zarba paytidagi son va tizza burchaklari */
function kickPose(p: number) {
  if (p < 0.3) return { th: -0.85 * (p / 0.3), kn: 1.3 * (p / 0.3) }
  if (p < 0.55) {
    const u = (p - 0.3) / 0.25
    return { th: -0.85 + 2.2 * u, kn: 1.3 * (1 - u) }
  }
  const u = (p - 0.55) / 0.45
  return { th: 1.35 * (1 - u), kn: 0.1 }
}

/** Jingalak soch: bosh tepasiga bir tekis sochilgan sharchalar (Fibonachchi spirali) */
const CURLS = Array.from({ length: 34 }, (_, i) => {
  const y = 1 - (i / 33) * 0.86 // tepadan quloq sathigacha
  const r = Math.sqrt(1 - y * y)
  const a = i * 2.399963
  return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, s: 0.9 + ((i * 37) % 10) / 40 }
})
  // Peshona va yuz ochiq qoladi
  .filter((c) => !(c.z > 0.3 && c.y < 0.75))

interface FootballerProps {
  site: SiteConfig
  anim: Anim
  reveal?: boolean
  /** Chap yengda kapitan bog'ichi */
  captain?: boolean
  /** Qo'lqop rangi (darvozabon). Berilmasa — yalang qo'l */
  gloves?: string
}

export function Footballer({ site, anim, reveal = false, captain = false, gloves }: FootballerProps) {
  const { kit, avatar } = site
  const hairStyle = avatar.hairStyle ?? 'short'
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const chest = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const scan = useRef<THREE.Mesh>(null)
  const scanMat = useRef<THREE.MeshBasicMaterial>(null)
  const j = useRef<Record<string, THREE.Group | null>>({})
  const joint = (name: string) => (el: THREE.Group | null) => void (j.current[name] = el)

  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 100), [])
  const planes = useMemo(() => (reveal ? [clip] : []), [reveal, clip])
  const [face, setFace] = useState<FaceResult | null>(null)
  const [fontTick, setFontTick] = useState(0)

  // Shrift yuklangach forma yozuvini qayta chizamiz
  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => alive && setFontTick((n) => n + 1))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    makeFaceTexture(avatar).then((res) => {
      if (alive) setFace(res)
      else res.texture.dispose()
    })
    return () => {
      alive = false
    }
  }, [avatar])
  useEffect(() => () => face?.texture.dispose(), [face])

  const jersey = useMemo(
    () => makeJerseyTexture(site),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site.player.jerseyName, site.player.number, kit, fontTick],
  )
  useEffect(() => () => jersey.dispose(), [jersey])

  const skin = face?.skin ?? avatar.skinTone

  const m = useMemo(() => {
    const std = (color: THREE.ColorRepresentation, roughness = 0.7, extra: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, clippingPlanes: planes, clipShadows: true, ...extra })
    const bootColor = new THREE.Color(kit.boots)
    // Taglik butsaga qarama-qarshi tusda: qora butsada och, och butsada to'q
    const sole = bootColor.getHSL({ h: 0, s: 0, l: 0 }).l < 0.45 ? '#e8ecf1' : '#12161c'
    return {
      // Qirqilgan soch: soch va teri rangining aralashmasi
      stubble: std(new THREE.Color(avatar.hairColor).lerp(new THREE.Color(skin), 0.5), 0.85),
      trim: std(kit.trim, 0.7),
      detail: std(kit.detail, 0.6),
      sole: std(sole, 0.55),
      hand: gloves ? std(gloves, 0.6) : std(skin, 0.62),
      lips: std(new THREE.Color(skin).multiplyScalar(0.72), 0.5),
      skin: std(skin, 0.62),
      shirt: std(kit.shirt, 0.78),
      jersey: std('#ffffff', 0.78, { map: jersey }),
      accent: std(kit.accent, 0.7),
      shorts: std(kit.shorts, 0.8),
      socks: std(kit.socks, 0.85),
      boots: std(kit.boots, 0.35, { metalness: 0.2 }),
      hair: std(avatar.hairColor, 0.9),
    }
  }, [planes, skin, kit, jersey, avatar.hairColor, gloves])
  useEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m])

  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: face?.texture ?? null,
        transparent: true,
        roughness: 0.6,
        depthWrite: false,
        clippingPlanes: planes,
        visible: !!face,
      }),
    [face, planes],
  )
  useEffect(() => () => faceMat.dispose(), [faceMat])

  // Barcha qismlar soya tashlaydi (skaner halqasidan tashqari)
  useEffect(() => {
    root.current?.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o !== scan.current) o.castShadow = true
    })
  }, [hairStyle, avatar.photo, captain])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const a = anim

    if (reveal) {
      // Skaner tugagach tekislik o'chiriladi (sakraganda bosh kesilmasin)
      const h = stage.reveal * HEIGHT
      clip.constant = stage.reveal >= 1 ? 100 : h
      if (scan.current) scan.current.position.y = h
      if (scanMat.current) scanMat.current.opacity = Math.sin(Math.PI * stage.reveal) * 0.9
    }

    const run = THREE.MathUtils.clamp(a.speed / 7.5, 0, 1)
    const amp = Math.min(1, a.speed / 1.2) * (0.32 + 0.72 * run)
    const q = j.current

    // --- Oyoqlar: R = +1 tomon (zarba beruvchi), L = -1
    const legs = [
      { key: 'R', ph: a.phase },
      { key: 'L', ph: a.phase + Math.PI },
    ]
    const swing: Record<string, number> = {}
    for (const { key, ph } of legs) {
      let th = Math.sin(ph) * amp
      let kn = 0.06 + Math.max(0, Math.cos(ph)) * amp * 1.5
      let ft = -0.02
      if (key === 'R') {
        th = lerp(th, 1.0, a.trap)
        kn = lerp(kn, 1.283, a.trap)
        ft = lerp(ft, -0.2, a.trap)
        if (a.kick > 0) {
          const k = kickPose(a.kick)
          th = k.th
          kn = k.kn
          ft = 0.35
        }
      }
      swing[key] = th
      if (q['leg' + key]) q['leg' + key]!.rotation.x = -th
      if (q['knee' + key]) q['knee' + key]!.rotation.x = kn
      if (q['foot' + key]) q['foot' + key]!.rotation.x = ft
    }

    // --- Qo'llar: qarama-qarshi oyoq bilan birga harakatlanadi
    const up = Math.max(a.celebrate, Math.abs(a.dive))
    // Zarba paytida muvozanat: qo'llar yonga ochiladi, tana biroz orqaga tashlanadi
    const strike = a.kick > 0 ? Math.sin(Math.PI * Math.min(1, a.kick)) : 0
    // Tinch turganda yengil tebranish
    const idle = (1 - Math.min(1, a.speed / 1.2)) * (1 - up) * (1 - a.trap)
    const arms = [
      { key: 'R', side: 1, th: swing.L },
      { key: 'L', side: -1, th: swing.R },
    ]
    for (const { key, side, th } of arms) {
      const arm = q['arm' + key]
      const fore = q['fore' + key]
      if (arm) {
        arm.rotation.x = lerp(0.04 - th * 0.85 * (1 - a.trap) + Math.sin(t * 1.1 + side) * 0.035 * idle + strike * side * 0.45, 0, up)
        arm.rotation.z =
          side *
          (0.15 +
            a.armsOut * 0.85 +
            up * 2.45 +
            strike * (side < 0 ? 0.75 : 0.3) +
            (up > 0 ? Math.sin(t * 9 + side) * 0.1 * a.celebrate : 0))
      }
      if (fore) fore.rotation.x = lerp(-0.38 - run * 1.0, -0.15, up)
    }

    // --- Tana: oldinga egilish, qadam tebranishi, sakrash
    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(a.phase)) * 0.05 * amp + a.celebrate * Math.abs(Math.sin(t * 8)) * 0.22
      body.current.rotation.x = run * 0.17 - strike * 0.16
      // Yugurganda yelka-tos qarama-qarshi buraladi
      body.current.rotation.y = Math.sin(a.phase) * 0.07 * amp
      body.current.rotation.z = -a.dive * 1.2 + Math.sin(t * 0.8) * 0.012 * idle
      body.current.position.x = Math.sin(t * 0.8) * 0.006 * idle
    }
    if (chest.current) {
      const b = 1 + Math.sin(t * 1.5) * 0.012
      chest.current.scale.set(1, b, 1 + Math.sin(t * 1.5) * 0.02)
    }
    if (head.current) {
      head.current.rotation.y = lerp(head.current.rotation.y, a.lookX * 0.4, 0.08)
      // Yugurganda nigoh oldinga, zarbada — to'pga (pastga)
      head.current.rotation.x = lerp(head.current.rotation.x, -a.lookY * 0.18 - run * 0.1 + strike * 0.3, 0.08)
    }
  })

  const leg = (side: 1 | -1, key: 'R' | 'L') => (
    <group ref={joint('leg' + key)} position={[side * 0.098, 0.92, 0]} rotation-z={side * 0.03}>
      {/* Shortining pochasi */}
      <mesh position-y={-0.1} material={m.shorts}>
        <cylinderGeometry args={[0.104, 0.118, 0.27, 20]} />
      </mesh>
      {/* Shortining yon chizig'i va etagi */}
      <mesh position={[side * 0.112, -0.1, 0]} rotation-z={side * 0.052} material={m.accent}>
        <boxGeometry args={[0.012, 0.262, 0.05]} />
      </mesh>
      <mesh position-y={-0.229} material={m.trim}>
        <cylinderGeometry args={[0.1185, 0.119, 0.012, 20]} />
      </mesh>
      <mesh position-y={-0.24} material={m.skin}>
        <capsuleGeometry args={[0.074, 0.28, 6, 14]} />
      </mesh>
      {/* Tizza va boldir (paypoq tizzagacha) */}
      <group ref={joint('knee' + key)} position-y={-0.42}>
        <mesh material={m.skin}>
          <sphereGeometry args={[0.068, 14, 12]} />
        </mesh>
        <mesh position-y={-0.21} material={m.socks}>
          <capsuleGeometry args={[0.057, 0.3, 6, 14]} />
        </mesh>
        {/* Boldir mushagi */}
        <mesh position={[0, -0.15, -0.016]} scale={[1, 1.9, 1]} material={m.socks}>
          <sphereGeometry args={[0.052, 16, 12]} />
        </mesh>
        {/* Paypoq hoshiyalari */}
        <mesh position-y={-0.075} material={m.accent}>
          <cylinderGeometry args={[0.064, 0.063, 0.035, 18]} />
        </mesh>
        <mesh position-y={-0.106} material={m.trim}>
          <cylinderGeometry args={[0.0635, 0.0625, 0.012, 18]} />
        </mesh>
        {/* Butsa: korpus, taglik, tishlar, bog'ich */}
        <group ref={joint('foot' + key)} position-y={-0.42}>
          <mesh position={[0, -0.022, 0.07]} rotation-x={Math.PI / 2} scale={[1, 1, 0.78]} material={m.boots}>
            <capsuleGeometry args={[0.052, 0.17, 6, 14]} />
          </mesh>
          <mesh position={[0, -0.058, 0.07]} material={m.sole}>
            <boxGeometry args={[0.082, 0.012, 0.25]} />
          </mesh>
          {[-0.02, 0.07, 0.155].map((z) =>
            [-0.024, 0.024].map((x) => (
              <mesh key={`${x}${z}`} position={[x, -0.069, z]} material={m.sole}>
                <cylinderGeometry args={[0.008, 0.006, 0.012, 8]} />
              </mesh>
            )),
          )}
          <mesh position={[0, 0.015, 0.085]} rotation-x={0.12} material={m.trim}>
            <boxGeometry args={[0.034, 0.008, 0.085]} />
          </mesh>
          {/* Yon chiziq */}
          <mesh position={[side * 0.05, -0.02, 0.075]} rotation-x={-0.35} material={m.accent}>
            <boxGeometry args={[0.006, 0.014, 0.11]} />
          </mesh>
        </group>
      </group>
    </group>
  )

  const arm = (side: 1 | -1, key: 'R' | 'L') => (
    <group ref={joint('arm' + key)} position={[side * 0.226, 1.452, 0]} rotation-z={side * 0.15}>
      <mesh material={m.shirt}>
        <sphereGeometry args={[0.072, 18, 14]} />
      </mesh>
      {/* Kalta yeng */}
      <mesh position-y={-0.1} material={m.shirt}>
        <capsuleGeometry args={[0.058, 0.13, 6, 14]} />
      </mesh>
      <mesh position-y={-0.2} material={m.accent}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 18]} />
      </mesh>
      {captain && key === 'L' && (
        <mesh position-y={-0.13} material={m.detail}>
          <cylinderGeometry args={[0.0615, 0.0615, 0.04, 20]} />
        </mesh>
      )}
      <mesh position-y={-0.23} material={m.skin}>
        <capsuleGeometry args={[0.047, 0.16, 6, 14]} />
      </mesh>
      <group ref={joint('fore' + key)} position-y={-0.33} rotation-x={-0.38}>
        <mesh position-y={-0.13} material={m.skin}>
          <capsuleGeometry args={[0.041, 0.2, 6, 14]} />
        </mesh>
        {/* Kaft, barmoqlar va bosh barmoq (qo'lqopda kattaroq) */}
        <group position-y={-0.29} scale={gloves ? 1.28 : 1}>
          <mesh scale={[0.85, 1.15, 0.58]} material={m.hand}>
            <sphereGeometry args={[0.05, 14, 12]} />
          </mesh>
          <mesh position-y={-0.05} scale={[0.78, 1, 0.46]} material={m.hand}>
            <sphereGeometry args={[0.04, 12, 10]} />
          </mesh>
          <mesh position={[0, -0.012, 0.034]} rotation-x={0.6} material={m.hand}>
            <capsuleGeometry args={[0.013, 0.03, 4, 8]} />
          </mesh>
          {gloves && (
            <mesh position-y={0.05} material={m.accent}>
              <cylinderGeometry args={[0.04, 0.036, 0.03, 14]} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  )

  return (
    <group ref={root}>
      <group ref={body}>
        {leg(-1, 'L')}
        {leg(1, 'R')}

        {/* Tos */}
        <mesh position-y={0.985} scale={[1, 1, 0.66]} material={m.shorts}>
          <cylinderGeometry args={[0.196, 0.205, 0.2, 28]} />
        </mesh>

        <group ref={chest} position-y={1.02}>
          {/* Tana — forma teksturasi faqat yon sirtda */}
          <mesh position-y={0.25} scale={[1, 1, 0.64]} material={[m.jersey, m.shirt, m.shirt]}>
            <cylinderGeometry args={[0.222, 0.188, 0.5, 44, 1]} />
          </mesh>
          {/* Forma etagi */}
          <mesh position-y={0.006} scale={[1, 1, 0.64]} material={m.trim}>
            <cylinderGeometry args={[0.1895, 0.1895, 0.012, 44, 1, true]} />
          </mesh>
          <mesh position-y={0.5} scale={[1, 0.42, 0.64]} material={m.shirt}>
            <sphereGeometry args={[0.222, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
        {arm(1, 'R')}
        {arm(-1, 'L')}

        {/* Bo'yin va yoqa */}
        <mesh position-y={1.575} material={m.skin}>
          <cylinderGeometry args={[0.052, 0.06, 0.12, 18]} />
        </mesh>
        <mesh position-y={1.535} rotation-x={Math.PI / 2} scale={[1, 0.75, 1]} material={m.accent}>
          <torusGeometry args={[0.072, 0.017, 10, 28]} />
        </mesh>

        {/* Bosh */}
        <group ref={head} position-y={1.715}>
          <group scale={[0.9, 1.1, 0.98]}>
            <mesh material={m.skin}>
              <sphereGeometry args={[0.118, 36, 28]} />
            </mesh>
            {/* Yuz: rasm boshning old yarim shariga yotqiziladi */}
            <mesh material={faceMat} renderOrder={2}>
              <sphereGeometry args={[0.1195, 36, 28, Math.PI / 2 - 0.9, 1.8, 0.5, 1.85]} />
            </mesh>
            {/* Rasm bo'lmaganda: burun va lab hajmi */}
            {!avatar.photo && (
              <>
                <mesh position={[0, -0.012, 0.11]} scale={[0.8, 1.3, 1]} material={m.skin}>
                  <sphereGeometry args={[0.017, 12, 10]} />
                </mesh>
                <mesh position={[0, -0.056, 0.104]} scale={[1.9, 0.5, 0.7]} material={m.lips}>
                  <sphereGeometry args={[0.012, 10, 8]} />
                </mesh>
              </>
            )}
            {/* Soch */}
            {(hairStyle === 'short' || hairStyle === 'curly') && (
              <mesh rotation-x={-0.42} scale={[1.03, 1.02, 1.05]} material={m.hair}>
                <sphereGeometry args={[0.122, 30, 18, 0, Math.PI * 2, 0, 1.42]} />
              </mesh>
            )}
            {hairStyle === 'short' && (
              // Old tomonga taralgan kokil
              <mesh position={[0, 0.094, 0.048]} rotation-x={0.35} scale={[1.35, 0.55, 1.1]} material={m.hair}>
                <sphereGeometry args={[0.06, 20, 14]} />
              </mesh>
            )}
            {(hairStyle === 'fade' || hairStyle === 'bald') && (
              <mesh rotation-x={-0.42} scale={[1.012, 1.008, 1.02]} material={m.stubble}>
                <sphereGeometry args={[0.121, 30, 18, 0, Math.PI * 2, 0, 1.42]} />
              </mesh>
            )}
            {hairStyle === 'fade' && (
              <>
                <mesh rotation-x={-0.5} scale={[1.0, 1.06, 1.06]} material={m.hair}>
                  <sphereGeometry args={[0.123, 30, 16, 0, Math.PI * 2, 0, 0.98]} />
                </mesh>
                <mesh position={[0, 0.1, 0.03]} rotation-x={0.2} scale={[1.15, 0.5, 1.25]} material={m.hair}>
                  <sphereGeometry args={[0.06, 20, 14]} />
                </mesh>
              </>
            )}
            {hairStyle === 'curly' &&
              CURLS.map((c, i) => (
                <mesh key={i} position={[c.x * 0.124, c.y * 0.124 + 0.004, c.z * 0.124 - 0.012]} scale={c.s} material={m.hair}>
                  <sphereGeometry args={[0.03, 10, 8]} />
                </mesh>
              ))}
          </group>
          {[1, -1].map((s) => (
            <mesh key={s} position={[s * 0.106, -0.01, 0]} scale={[0.5, 1, 0.8]} material={m.skin}>
              <sphereGeometry args={[0.03, 10, 10]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Skaner halqasi */}
      {reveal && (
        <mesh ref={scan} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.5, 0.56, 64]} />
          <meshBasicMaterial
            ref={scanMat}
            color="#3fe0ff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  )
}
