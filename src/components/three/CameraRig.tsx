'use client'

import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { rt, useGame, type Phase } from '@/lib/game'
import { stage } from '@/lib/stage'

/* Dinamik kamera:
   - intro    : stadion tepasidan o'yinchi ortiga uchib keladi (stage.intro)
   - o'yin    : uchinchi shaxs kamerasi, sichqoncha bilan aylantiriladi (rt.yaw)
   - gol      : o'yinchi atrofida past burchakdan aylanadi + titrash
   - portfolio: skroll bilan o'yinchi atrofida orbita (forma orqasini ko'rsatadi) */

const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = THREE.MathUtils.lerp

export function CameraRig() {
  const { camera, size } = useThree()
  const v = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      curLook: new THREE.Vector3(0, 4, 0),
      from: new THREE.Vector3(-34, 19, 40),
      fromLook: new THREE.Vector3(0, 2, 0),
      snap: true,
      prev: 'loading' as Phase,
      goalAngle: 0,
    }),
    [],
  )

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const phase = useGame.getState().phase
    const portrait = size.width / size.height < 0.9
    if (phase !== v.prev) {
      // Portfolioga o'tishda (ekran qoplangan paytda) kamera darhol joyiga sakraydi
      if (phase === 'portfolio' || v.prev === 'portfolio') v.snap = true
      if (phase === 'goal') v.goalAngle = rt.heading + Math.PI * 0.85
      v.prev = phase
    }
    const p = rt.pos
    let follow = 7

    if (phase === 'portfolio') {
      const s = ease(THREE.MathUtils.clamp(stage.scroll, 0, 1))
      const angle = lerp(portrait ? 0.12 : 0.3, Math.PI + (portrait ? 0.1 : 0.42), s)
      const radius = portrait ? lerp(8.2, 6.8, s) : lerp(5.7, 4.5, s)
      const height = lerp(0.72, 1.55, s)
      const lookY = portrait ? lerp(1.42, 0.7, s) : lerp(1.42, 1.28, s)
      // Yon siljish: desktopda o'yinchi boshida o'ngda, oxirida chapda turadi
      const side = portrait ? 0 : lerp(-1.35, 1.25, s)
      const sx = Math.sin(angle)
      const cz = Math.cos(angle)
      v.pos.set(p.x + sx * radius + cz * side, height, p.z + cz * radius - sx * side)
      v.look.set(p.x + cz * side, lookY, p.z - sx * side)
      // Sichqoncha parallaksi
      v.pos.x += stage.pointer.x * 0.28 * cz
      v.pos.z -= stage.pointer.x * 0.28 * sx
      v.pos.y += stage.pointer.y * 0.14
      follow = 6
    } else if (phase === 'goal') {
      v.goalAngle += dt * 0.45
      const r = portrait ? 7.5 : 5.2
      v.pos.set(p.x + Math.sin(v.goalAngle) * r, 1.0, p.z + Math.cos(v.goalAngle) * r)
      v.look.set(p.x, 1.55, p.z)
      follow = 3
    } else {
      // Uchinchi shaxs: o'yinchi ortida, biroz tepada, oldinga qaraydi
      const fx = Math.sin(rt.yaw)
      const fz = Math.cos(rt.yaw)
      const dist = portrait ? 10.5 : 7.2
      const height = portrait ? 4.4 : 3.1
      v.pos.set(p.x - fx * dist, height, p.z - fz * dist)
      v.look.set(p.x + fx * 5, 1.1, p.z + fz * 5)
      // Kirish animatsiyasi bilan aralashtirish
      v.pos.lerpVectors(v.from, v.pos, stage.intro)
      v.look.lerpVectors(v.fromLook, v.look, stage.intro)
    }

    const f = v.snap ? 1 : 1 - Math.exp(-dt * follow)
    v.snap = false
    camera.position.lerp(v.pos, f)
    v.curLook.lerp(v.look, f)
    camera.lookAt(v.curLook)

    if (rt.shake > 0.002) {
      camera.position.x += (Math.random() - 0.5) * rt.shake
      camera.position.y += (Math.random() - 0.5) * rt.shake
      camera.rotation.z += (Math.random() - 0.5) * rt.shake * 0.06
    }
  })

  return null
}
