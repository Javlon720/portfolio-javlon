'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeGlowTexture } from '@/lib/textures'

/* Stadiondan chiqish tunneli: yorug' halqalar kamera tomon oqib keladi,
   oxirida maydonga chiqish yorug'i ko'rinadi. */

const COUNT = 26
const GAP = 4.2
const LENGTH = COUNT * GAP

function Tunnel() {
  const rings = useRef<THREE.InstancedMesh>(null)
  const strips = useRef<THREE.InstancedMesh>(null)
  const glow = useMemo(() => makeGlowTexture(), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  // 4 segmentli torus = kvadrat ramka; burilishni geometriyaga "pishirib", tunnel kesimiga cho'zamiz
  const ringGeo = useMemo(() => new THREE.TorusGeometry(4.05, 0.03, 6, 4).rotateZ(Math.PI / 4).scale(1.19, 0.8, 1), [])
  const pointer = useRef({ x: 0, y: 0 })
  const offset = useRef(0)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // Halqa ranglari: bayroq ranglari navbat bilan
  useEffect(() => {
    const palette = ['#19c3e6', '#f3f6fa', '#1eb53a', '#19c3e6', '#f3f6fa', '#19c3e6']
    const c = new THREE.Color()
    for (let i = 0; i < COUNT; i++) rings.current?.setColorAt(i, c.set(palette[i % palette.length]))
    if (rings.current?.instanceColor) rings.current.instanceColor.needsUpdate = true
  }, [])

  useFrame(({ camera }, dt) => {
    offset.current = (offset.current + dt * 5.5) % GAP
    for (let i = 0; i < COUNT; i++) {
      const z = -i * GAP + offset.current - 2.5
      dummy.position.set(0, 0, z)
      dummy.updateMatrix()
      rings.current?.setMatrixAt(i, dummy.matrix)
      // Poldagi yo'naltiruvchi chiziqlar
      dummy.position.set(0, -2.28, z - GAP / 2)
      dummy.updateMatrix()
      strips.current?.setMatrixAt(i, dummy.matrix)
    }
    if (rings.current) rings.current.instanceMatrix.needsUpdate = true
    if (strips.current) strips.current.instanceMatrix.needsUpdate = true

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.7, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -0.5 - pointer.current.y * 0.35, 0.04)
    camera.lookAt(0, -0.2, -40)
  })

  return (
    <>
      {/* Tunnel devorlari */}
      <mesh position-z={-LENGTH / 2 + 6}>
        <boxGeometry args={[6.9, 4.7, LENGTH + 12]} />
        <meshStandardMaterial color="#111a26" roughness={0.55} metalness={0.25} side={THREE.BackSide} />
      </mesh>
      {/* Kvadrat yorug' halqalar (4 segmentli torus) */}
      <instancedMesh ref={rings} args={[ringGeo, undefined, COUNT]} frustumCulled={false}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={strips} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.08, 0.02, GAP * 0.55]} />
        <meshBasicMaterial color="#19c3e6" toneMapped={false} />
      </instancedMesh>
      {/* Yo'l-yo'lakay chiroqlar devorda aks etadi */}
      {[-6, -22, -44].map((z, i) => (
        <pointLight key={z} position={[0, 1.6, z]} intensity={34} distance={42} color={i === 1 ? '#1eb53a' : '#19c3e6'} />
      ))}
      {/* Chiqish yorug'i */}
      <sprite position={[0, -0.2, -LENGTH + 14]} scale={[26, 26, 1]}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
    </>
  )
}

export default function TunnelCanvas() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!wrap.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '5% 0px' })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ fov: 62, near: 0.1, far: 160, position: [0, -0.5, 4] }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#03060a')
          scene.fog = new THREE.Fog('#03060a', 18, 92)
        }}
        fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,#0d3a4a,#03060a_60%)]" />}
      >
        <Tunnel />
      </Canvas>
    </div>
  )
}
