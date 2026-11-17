'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Sparkles } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { useSite } from '@/lib/store'
import { stage } from '@/lib/stage'
import { CameraRig } from './CameraRig'
import { Game } from './Game'
import { Stadium } from './Stadium'

export default function StadiumCanvas() {
  const { site } = useSite()
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [mobile, setMobile] = useState(false)
  const [dpr, setDpr] = useState(1.5)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Hero ekrandan chiqqanda render va fizika to'xtaydi — pastdagi bo'limlar 60 FPS da qoladi
  useEffect(() => {
    if (!wrap.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const words = useMemo(
    () => [site.player.jerseyName, site.player.position, ...site.stack.flatMap((s) => s.items).slice(0, 14)],
    [site.player.jerseyName, site.player.position, site.stack],
  )

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        shadows
        frameloop={visible ? 'always' : 'never'}
        dpr={Math.min(dpr, mobile ? 1.5 : 2)}
        camera={{ fov: 38, near: 0.1, far: 400, position: [-34, 19, 40] }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
        onCreated={({ gl, scene }) => {
          gl.localClippingEnabled = true
          scene.background = new THREE.Color('#04070d')
          scene.fog = new THREE.FogExp2('#060b14', 0.0072)
        }}
        fallback={<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#12324a,#04070d_70%)]" />}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
        <AdaptiveDpr pixelated />
        <CameraRig />
        <Stadium words={words} mobile={mobile} />
        {/* Rapier (WASM) yuklanguncha sahna kutadi */}
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} paused={!visible}>
            <Game site={site} />
          </Physics>
        </Suspense>
        {/* Havoda suzuvchi zarrachalar */}
        <Sparkles count={mobile ? 40 : 110} scale={[90, 10, 60]} position={[0, 6, 0]} size={6} speed={0.2} opacity={0.3} color="#cfe8ff" />
      </Canvas>
    </div>
  )
}
