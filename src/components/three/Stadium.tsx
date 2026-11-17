'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { rt } from '@/lib/game'
import { lightKeys, stage } from '@/lib/stage'
import {
  makeBeamTexture,
  makeCrowdTexture,
  makeGlowTexture,
  makeLampTexture,
  makeLedTexture,
  makePitchTexture,
} from '@/lib/textures'

/* Stadion to'liq protsedura usulida quriladi: bitta kosa (tribunalar), tom,
   to'rtta projektor guruhi, maydon va LED bortlar. Hech qanday model yuklanmaydi.
   Gol paytida (rt.cheer) chiroqlar va tomoshabinlar jonlanadi. */

const BOWL = { x: 68, z: 47, h: 20, flare: 1.62 }
const ROOF_INNER = 1.25

// Projektorlar: ikkitasi narigi tribuna ustida (kadrda ko'rinadi), ikkitasi kamera ortida
const BANK_ANGLES = [-72, -108, 72, 108].map((d) => (d * Math.PI) / 180)
export const BANKS = BANK_ANGLES.map(
  (a) => new THREE.Vector3(Math.cos(a) * BOWL.x * ROOF_INNER, 23, Math.sin(a) * BOWL.z * ROOF_INNER),
)

const lightsAvg = () => (stage.lights.a + stage.lights.b + stage.lights.c + stage.lights.d) / 4

function Floodlight({ index }: { index: number }) {
  const pos = BANKS[index]
  const key = lightKeys[index]
  const lamp = useRef<THREE.MeshBasicMaterial>(null)
  const glow = useRef<THREE.SpriteMaterial>(null)
  const sprite = useRef<THREE.Sprite>(null)
  const beam = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.DirectionalLight>(null)

  const tex = useMemo(
    () => ({ lamp: makeLampTexture(), glow: makeGlowTexture(true), beam: makeBeamTexture() }),
    [],
  )
  useEffect(() => () => Object.values(tex).forEach((t) => t.dispose()), [tex])

  // Nur konusi: projektordan maydon markazi tomon
  const beamProps = useMemo(() => {
    const target = new THREE.Vector3(pos.x * 0.12, 0, pos.z * 0.12)
    const dir = pos.clone().sub(target)
    const len = dir.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    return { position: pos.clone().add(target).multiplyScalar(0.5), quaternion: quat, len }
  }, [pos])

  // Panel maydon markaziga qaratiladi
  const panelQuat = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.copy(pos)
    o.lookAt(0, 0, 0)
    return o.quaternion.clone()
  }, [pos])

  useFrame(({ clock }) => {
    // Gol paytida projektorlar pirpiraydi
    const v = stage.lights[key] * (1 + rt.cheer * 0.45 * Math.sin(clock.elapsedTime * 16 + index * 1.7))
    if (lamp.current) lamp.current.color.setScalar(0.04 + v * 2.2)
    if (glow.current) glow.current.opacity = v * 0.95
    if (sprite.current) sprite.current.scale.setScalar(14 + v * 30)
    if (beam.current) beam.current.opacity = v * 0.055
    if (light.current) light.current.intensity = v * (index < 2 ? 2.4 : 1.7)
  })

  return (
    <>
      <mesh position={pos} quaternion={panelQuat}>
        <planeGeometry args={[9.5, 3.6]} />
        <meshBasicMaterial ref={lamp} map={tex.lamp} toneMapped={false} fog={false} />
      </mesh>
      <sprite ref={sprite} position={[pos.x * 0.985, pos.y, pos.z * 0.985]}>
        <spriteMaterial
          ref={glow}
          map={tex.glow}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          fog={false}
          toneMapped={false}
        />
      </sprite>
      <mesh position={beamProps.position} quaternion={beamProps.quaternion}>
        <coneGeometry args={[17, beamProps.len, 28, 1, true]} />
        <meshBasicMaterial
          ref={beam}
          map={tex.beam}
          color="#bcd8ff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      <directionalLight ref={light} position={pos} color={index < 2 ? '#cfe2ff' : '#fff4e6'} intensity={0} />
    </>
  )
}

/** Tribunalardagi telefon chaqnashlari */
function CrowdFlashes({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geo = useMemo(() => {
    const p = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const t = 0.06 + Math.random() * 0.9
      const r = 1 + (BOWL.flare - 1) * t - 0.012
      p[i * 3] = Math.cos(a) * BOWL.x * r
      p[i * 3 + 1] = BOWL.h * t + 0.4
      p[i * 3 + 2] = Math.sin(a) * BOWL.z * r
      ph[i] = Math.random() * 100
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('phase', new THREE.BufferAttribute(ph, 1))
    return g
  }, [count])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPower: { value: 0 } }), [])

  useFrame((_, dt) => {
    uniforms.uTime.value += dt * (1 + rt.cheer * 3)
    uniforms.uPower.value = lightsAvg() * (1 + rt.cheer * 2.5)
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float phase;
          uniform float uTime;
          varying float vA;
          void main() {
            float s = sin(uTime * (0.7 + fract(phase) * 1.3) + phase * 6.2831);
            vA = pow(max(s, 0.0), 60.0);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (60.0 + 240.0 * vA) / -mv.z;
          }`}
        fragmentShader={`
          uniform float uPower;
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vA * uPower;
            gl_FragColor = vec4(0.9, 0.96, 1.0, a);
          }`}
      />
    </points>
  )
}

function LedBoards({ words }: { words: string[] }) {
  const tex = useMemo(() => makeLedTexture(words), [words])
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useEffect(() => () => tex.dispose(), [tex])

  // Shrift yuklangach qayta chizamiz (aks holda zaxira shrift bilan qolib ketadi)
  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => {
      if (!alive || !mat.current) return
      const fresh = makeLedTexture(words)
      tex.image = fresh.image
      tex.needsUpdate = true
    })
    return () => {
      alive = false
    }
  }, [tex, words])

  useFrame((_, dt) => {
    tex.offset.x += dt * 0.012
    if (mat.current) mat.current.color.setScalar(0.12 + lightsAvg() * 1.15)
  })

  const boards: { p: [number, number, number]; r: number; len: number }[] = [
    { p: [0, 0.55, -37.5], r: 0, len: 104 },
    { p: [0, 0.55, 37.5], r: Math.PI, len: 104 },
    { p: [-56, 0.55, 0], r: Math.PI / 2, len: 66 },
    { p: [56, 0.55, 0], r: -Math.PI / 2, len: 66 },
  ]
  return (
    <>
      {boards.map((b, i) => (
        <mesh key={i} position={b.p} rotation-y={b.r}>
          <planeGeometry args={[b.len, 1.1]} />
          <meshBasicMaterial ref={i === 0 ? mat : undefined} map={tex} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

export function Stadium({ words, mobile }: { words: string[]; mobile: boolean }) {
  const pitch = useMemo(() => makePitchTexture(), [])
  const crowd = useMemo(() => makeCrowdTexture(), [])
  const crowdMat = useRef<THREE.MeshBasicMaterial>(null)
  const ring = useRef<THREE.MeshBasicMaterial>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)

  useEffect(
    () => () => {
      pitch.dispose()
      crowd.dispose()
    },
    [pitch, crowd],
  )

  useFrame(() => {
    const v = lightsAvg()
    crowdMat.current?.color.setScalar(0.05 + v * 0.5 + rt.cheer * 0.25)
    ring.current?.color.setRGB(0.02 + v * 0.1, 0.1 + v * 0.75, 0.14 + v * 0.95)
    if (hemi.current) hemi.current.intensity = 0.1 + v * 0.42
  })

  return (
    <group>
      <hemisphereLight ref={hemi} args={['#9fc4ff', '#0d2a16', 0.12]} />

      {/* Maydon */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[105, 68]} />
        <meshStandardMaterial map={pitch} roughness={0.95} metalness={0} />
      </mesh>
      {/* Maydon atrofi */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02}>
        <circleGeometry args={[130, 48]} />
        <meshStandardMaterial color="#123a20" roughness={1} />
      </mesh>

      {/* Tribunalar kosasi */}
      <mesh position-y={BOWL.h / 2} scale={[BOWL.x, BOWL.h, BOWL.z]}>
        <cylinderGeometry args={[BOWL.flare, 1, 1, 96, 1, true]} />
        <meshBasicMaterial ref={crowdMat} map={crowd} side={THREE.BackSide} />
      </mesh>
      {/* Tom */}
      <mesh position-y={BOWL.h + 2} scale={[BOWL.x, 4, BOWL.z]}>
        <cylinderGeometry args={[ROOF_INNER, BOWL.flare, 1, 96, 1, true]} />
        <meshBasicMaterial color="#070b11" side={THREE.DoubleSide} />
      </mesh>
      {/* Tom chetidagi LED halqa */}
      <mesh position-y={BOWL.h + 3.8} scale={[BOWL.x, 0.3, BOWL.z]}>
        <cylinderGeometry args={[ROOF_INNER - 0.004, ROOF_INNER - 0.004, 1, 96, 1, true]} />
        <meshBasicMaterial ref={ring} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {BANKS.map((_, i) => (
        <Floodlight key={i} index={i} />
      ))}
      <CrowdFlashes count={mobile ? 220 : 520} />
      <LedBoards words={words} />
    </group>
  )
}
