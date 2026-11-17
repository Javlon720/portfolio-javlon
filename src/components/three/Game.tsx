'use client'

import { Suspense, lazy, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BallCollider, CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { SiteConfig } from '@/config/site'
import { playCheer, playKick, playWhistle } from '@/lib/audio'
import { GOAL_H, GOAL_HALF, GOAL_X, HANDOVER_X, resetRuntime, rt, useGame, type Phase } from '@/lib/game'
import { READY_EVENT, stage } from '@/lib/stage'
import { makeBallTexture, makeNetTexture } from '@/lib/textures'
import { Footballer, makeAnim } from './Footballer'

const ModelAvatar = lazy(() => import('./ModelAvatar'))

const BALL_R = 0.11
const KEEPER_X = GOAL_X - 1
const damp = THREE.MathUtils.damp
const clamp = THREE.MathUtils.clamp

/** Burchakni eng qisqa yo'l bilan yaqinlashtirish */
function dampAngle(current: number, target: number, lambda: number, dt: number) {
  const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current))
  return current + diff * (1 - Math.exp(-lambda * dt))
}

/* ------------------------------------------------------------------ darvoza */
function GoalFrame({ x, solid }: { x: number; solid: boolean }) {
  const dir = Math.sign(x)
  const net = useMemo(() => makeNetTexture(), [])
  const post = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f4f6f9', roughness: 0.4 }), [])
  const netMat = (rx: number, ry: number) => {
    const t = net.clone()
    t.repeat.set(rx, ry)
    t.needsUpdate = true
    return <meshBasicMaterial map={t} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
  }
  const depth = 2.2

  return (
    <group position={[x, 0, 0]}>
      {[-GOAL_HALF, GOAL_HALF].map((z) => (
        <mesh key={z} position={[0, GOAL_H / 2, z]} material={post} castShadow>
          <cylinderGeometry args={[0.06, 0.06, GOAL_H, 12]} />
        </mesh>
      ))}
      <mesh position={[0, GOAL_H, 0]} rotation-x={Math.PI / 2} material={post} castShadow>
        <cylinderGeometry args={[0.06, 0.06, GOAL_HALF * 2 + 0.12, 12]} />
      </mesh>
      {/* To'r: orqa, tepa va ikki yon */}
      <mesh position={[dir * depth, GOAL_H / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[GOAL_HALF * 2, GOAL_H]} />
        {netMat(36, 12)}
      </mesh>
      <mesh position={[(dir * depth) / 2, GOAL_H, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[depth, GOAL_HALF * 2]} />
        {netMat(11, 36)}
      </mesh>
      {[-GOAL_HALF, GOAL_HALF].map((z) => (
        <mesh key={z} position={[(dir * depth) / 2, GOAL_H / 2, z]}>
          <planeGeometry args={[depth, GOAL_H]} />
          {netMat(11, 12)}
        </mesh>
      ))}

      {solid && (
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.06, GOAL_H / 2, 0.06]} position={[0, GOAL_H / 2, -GOAL_HALF]} restitution={0.7} />
          <CuboidCollider args={[0.06, GOAL_H / 2, 0.06]} position={[0, GOAL_H / 2, GOAL_HALF]} restitution={0.7} />
          <CuboidCollider args={[0.06, 0.06, GOAL_HALF]} position={[0, GOAL_H, 0]} restitution={0.7} />
          {/* To'r to'pni yumshoq to'xtatadi */}
          <CuboidCollider args={[0.05, GOAL_H / 2 + 0.1, GOAL_HALF + 0.1]} position={[dir * (depth + 0.05), GOAL_H / 2, 0]} restitution={0} friction={2} />
          <CuboidCollider args={[depth / 2, 0.05, GOAL_HALF + 0.1]} position={[(dir * depth) / 2 + dir * 0.2, GOAL_H + 0.12, 0]} restitution={0} />
          <CuboidCollider args={[depth / 2, GOAL_H / 2, 0.05]} position={[(dir * depth) / 2 + dir * 0.2, GOAL_H / 2, -GOAL_HALF - 0.12]} restitution={0} />
          <CuboidCollider args={[depth / 2, GOAL_H / 2, 0.05]} position={[(dir * depth) / 2 + dir * 0.2, GOAL_H / 2, GOAL_HALF + 0.12]} restitution={0} />
        </RigidBody>
      )}
    </group>
  )
}

/* ------------------------------------------------- mushakbozlik va konfetti */
const BURSTS = 8
const PER = 90
const CONFETTI = 260

function Celebration() {
  const points = useRef<THREE.Points>(null)
  const confetti = useRef<THREE.InstancedMesh>(null)
  const fw = useMemo(() => {
    const n = BURSTS * PER
    return {
      pos: new Float32Array(n * 3),
      col: new Float32Array(n * 3),
      vel: new Float32Array(n * 3),
      base: new Float32Array(n * 3),
      life: new Float32Array(BURSTS).fill(99),
      next: 0,
      timer: 0,
    }
  }, [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(fw.pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(fw.col, 3))
    return g
  }, [fw])
  const flakes = useMemo(
    () =>
      Array.from({ length: CONFETTI }, () => ({
        p: new THREE.Vector3(),
        v: 1.2 + Math.random() * 1.6,
        r: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        w: 2 + Math.random() * 5,
        s: Math.random() * 6,
      })),
    [],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const active = useRef(false)

  useEffect(() => {
    const palette = ['#19c3e6', '#f3f6fa', '#1eb53a', '#ce1126', '#e9c46a']
    const c = new THREE.Color()
    flakes.forEach((_, i) => confetti.current?.setColorAt(i, c.set(palette[i % palette.length])))
    if (confetti.current?.instanceColor) confetti.current.instanceColor.needsUpdate = true
  }, [flakes])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const on = rt.cheer > 0.5
    if (points.current) points.current.visible = rt.cheer > 0.01
    if (confetti.current) confetti.current.visible = rt.cheer > 0.01
    if (rt.cheer <= 0.01) {
      active.current = false
      return
    }

    // Gol urilgan zahoti konfetti o'yinchi tepasiga sochiladi
    if (on && !active.current) {
      active.current = true
      for (const f of flakes) f.p.set(rt.pos.x + (Math.random() - 0.5) * 16, 3 + Math.random() * 9, rt.pos.z + (Math.random() - 0.5) * 16)
      fw.life.fill(99)
    }

    // --- Mushaklar
    fw.timer -= dt
    if (on && fw.timer <= 0) {
      fw.timer = 0.28 + Math.random() * 0.25
      const b = fw.next++ % BURSTS
      fw.life[b] = 0
      const a = Math.random() * Math.PI * 2
      // Tribunalar ustida, past burchakli kamera kadriga tushadigan balandlikda
      const cx = rt.pos.x + Math.cos(a) * (36 + Math.random() * 26)
      const cy = 9 + Math.random() * 10
      const cz = rt.pos.z + Math.sin(a) * (36 + Math.random() * 26)
      const tint = new THREE.Color().setHSL([0.52, 0.36, 0.12, 0.98, 0.6][(Math.random() * 5) | 0], 0.9, 0.6)
      for (let i = 0; i < PER; i++) {
        const k = (b * PER + i) * 3
        const u = Math.random() * 2 - 1
        const ph = Math.random() * Math.PI * 2
        const sp = 7 + Math.random() * 5
        const s = Math.sqrt(1 - u * u)
        fw.vel[k] = Math.cos(ph) * s * sp
        fw.vel[k + 1] = u * sp
        fw.vel[k + 2] = Math.sin(ph) * s * sp
        fw.pos[k] = cx
        fw.pos[k + 1] = cy
        fw.pos[k + 2] = cz
        fw.base[k] = tint.r
        fw.base[k + 1] = tint.g
        fw.base[k + 2] = tint.b
      }
    }
    for (let b = 0; b < BURSTS; b++) {
      fw.life[b] += dt
      const fade = Math.max(0, 1 - fw.life[b] / 1.9)
      for (let i = 0; i < PER; i++) {
        const k = (b * PER + i) * 3
        fw.vel[k + 1] -= 4.5 * dt
        const drag = 1 - 1.1 * dt
        fw.vel[k] *= drag
        fw.vel[k + 1] *= drag
        fw.vel[k + 2] *= drag
        fw.pos[k] += fw.vel[k] * dt
        fw.pos[k + 1] += fw.vel[k + 1] * dt
        fw.pos[k + 2] += fw.vel[k + 2] * dt
        // Additiv aralashtirishda qora = ko'rinmas
        fw.col[k] = fw.base[k] * fade * 2
        fw.col[k + 1] = fw.base[k + 1] * fade * 2
        fw.col[k + 2] = fw.base[k + 2] * fade * 2
      }
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true

    // --- Konfetti
    const sdt = dt * Math.max(0.35, rt.timeScale)
    flakes.forEach((f, i) => {
      f.p.y -= f.v * sdt
      f.s += sdt * f.w
      f.p.x += Math.sin(f.s) * 0.6 * sdt
      if (f.p.y < 0.03) f.p.y = on ? 9 + Math.random() * 3 : -5
      dummy.position.copy(f.p)
      dummy.rotation.set(f.r.x + f.s, f.r.y + f.s * 0.7, f.r.z)
      dummy.updateMatrix()
      confetti.current?.setMatrixAt(i, dummy.matrix)
    })
    if (confetti.current) confetti.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <points ref={points} geometry={geo} frustumCulled={false} visible={false}>
        <pointsMaterial size={0.9} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} />
      </points>
      <instancedMesh ref={confetti} args={[undefined, undefined, CONFETTI]} frustumCulled={false} visible={false}>
        <planeGeometry args={[0.13, 0.075]} />
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
    </>
  )
}

/* ---------------------------------------------------------------- o'yin */
export function Game({ site }: { site: SiteConfig }) {
  const player = useRef<THREE.Group>(null)
  const ball = useRef<RapierRigidBody>(null)
  const keeper = useRef<RapierRigidBody>(null)
  const light = useRef<THREE.DirectionalLight>(null)
  const lightTarget = useMemo(() => new THREE.Object3D(), [])

  const anim = useMemo(makeAnim, [])
  const keeperAnim = useMemo(() => ({ ...makeAnim(), armsOut: 0.55 }), [])
  const ballTex = useMemo(() => makeBallTexture(), [])

  // Darvozabon: boshqa forma, rasm yo'q
  const keeperSite = useMemo<SiteConfig>(
    () => ({
      ...site,
      player: { ...site.player, jerseyName: 'KEEPER', number: 1 },
      avatar: { ...site.avatar, photo: null, skinTone: '#b98a63', hairColor: '#2a1c12', hairStyle: 'fade' },
      kit: { shirt: '#f2c230', accent: '#141a22', trim: '#141a22', detail: '#f2c230', shorts: '#141a22', socks: '#f2c230', boots: '#f4f6f9' },
    }),
    [site],
  )

  const s = useRef({
    prev: 'loading' as Phase,
    touchCd: 0,
    kickCd: 0,
    wasKick: false,
    goalT: 0,
    shotT: -1,
    heldT: 0,
    kz: 0,
    dive: 0,
    misses: 0,
  })

  useEffect(() => {
    if (light.current) light.current.target = lightTarget
    // Fizika yuklangach va birinchi kadr chizilgach yuklovchi ekran yopiladi
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event(READY_EVENT)))
    return () => {
      cancelAnimationFrame(id)
      rt.ball = null
    }
  }, [lightTarget])

  const placeBall = (x: number, z: number) => {
    const b = ball.current
    if (!b) return
    b.setTranslation({ x, y: BALL_R, z }, true)
    b.setLinvel({ x: 0, y: 0, z: 0 }, true)
    b.setAngvel({ x: 0, y: 0, z: 0 }, true)
    b.setGravityScale(1, true)
  }

  const enter = (phase: Phase, prev: Phase) => {
    const st = s.current
    if (phase === 'intro') {
      resetRuntime()
      rt.pos.set(0, 0, 0)
      rt.heading = rt.yaw = Math.PI / 2
      placeBall(1, 0)
      Object.assign(anim, makeAnim())
      st.kz = 0
    }
    if (phase === 'play') {
      if (prev !== 'walk') {
        // Qayta o'ynash: jarima maydoni oldidan boshlanadi
        resetRuntime()
        rt.pos.set(HANDOVER_X, 0, 0)
        rt.heading = rt.yaw = Math.PI / 2
        placeBall(HANDOVER_X + 1, 0)
        Object.assign(anim, makeAnim())
        st.kz = 0
      }
      playWhistle()
    }
    if (phase === 'goal') {
      st.goalT = 0
      st.misses = 0
      rt.cheer = 1
      rt.shake = 0.7
      rt.timeScale = 0.25
      const b = ball.current
      if (b) {
        const v = b.linvel()
        b.setLinvel({ x: v.x * 0.3, y: v.y * 0.3, z: v.z * 0.3 }, true)
        b.setGravityScale(0.1, true)
      }
      playCheer()
    }
    if (phase === 'portfolio') {
      // Stadion portfolio foniga aylanadi: o'yinchi markazda, to'p oyoq ostida
      resetRuntime()
      rt.pos.set(0, 0, 0)
      rt.heading = 0
      anim.celebrate = 0
      anim.kick = 0
      anim.speed = 0
      ball.current?.setGravityScale(1, true)
    }
  }

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const st = s.current
    const game = useGame.getState()
    const phase = game.phase
    if (phase !== st.prev) {
      enter(phase, st.prev)
      st.prev = phase
    }
    const sdt = dt * rt.timeScale
    const b = ball.current
    rt.ball = b
    if (b) {
      const p = b.translation()
      rt.ballPos.set(p.x, p.y, p.z)
    }
    const bp = rt.ballPos
    st.touchCd -= dt
    st.kickCd -= dt

    /* ------------------------------------------------ o'yinchi harakati */
    let ix = 0
    let iy = 0
    let sprint = false
    if (phase === 'play') {
      ix = rt.input.x
      iy = rt.input.y
      sprint = rt.input.sprint
      // A/D kamerani ham asta buradi — sichqonchasiz ham boshqarish mumkin
      rt.yaw -= ix * dt * 1.1
    } else if (phase === 'walk') {
      iy = 0.62
      rt.yaw = dampAngle(rt.yaw, Math.PI / 2, 4, dt)
      if (rt.pos.x >= HANDOVER_X) game.setPhase('play')
    }

    const fx = Math.sin(rt.yaw)
    const fz = Math.cos(rt.yaw)
    const dx = fx * iy - fz * ix
    const dz = fz * iy + fx * ix
    const len = Math.min(1, Math.hypot(dx, dz))
    const moving = len > 0.08 && (phase === 'play' || phase === 'walk')
    rt.speed = damp(rt.speed, moving ? (sprint ? 8.8 : 6.4) * len : 0, moving ? 6 : 10, sdt)
    if (moving) rt.heading = dampAngle(rt.heading, Math.atan2(dx, dz), 11, sdt)

    const hx = Math.sin(rt.heading)
    const hz = Math.cos(rt.heading)
    rt.pos.x = clamp(rt.pos.x + hx * rt.speed * sdt, -51, GOAL_X - 0.6)
    rt.pos.z = clamp(rt.pos.z + hz * rt.speed * sdt, -33, 33)

    anim.speed = rt.speed
    if (rt.speed > 0.2) anim.phase += sdt * (2.4 + rt.speed * 1.2)
    if (anim.kick > 0) {
      anim.kick += sdt * 2.6
      if (anim.kick >= 1) anim.kick = 0
    }

    /* ------------------------------------------------------- to'p */
    if (b && (phase === 'play' || phase === 'walk')) {
      const footX = rt.pos.x + hx * 0.45
      const footZ = rt.pos.z + hz * 0.45
      const near = Math.hypot(bp.x - footX, bp.z - footZ)

      // Dribling: oyoq to'pga yetganda uni oldinga yengil turtadi
      if (rt.speed > 1 && near < 0.5 && bp.y < 0.45 && st.touchCd <= 0 && st.kickCd <= 0) {
        const v = rt.speed + 1.7
        b.setLinvel({ x: hx * v, y: 0, z: hz * v }, true)
        b.setAngvel({ x: hz * v * 6, y: 0, z: -hx * v * 6 }, true)
        st.touchCd = 0.2
      }

      // Zarba: Space ushlab turilsa kuch to'planadi, qo'yib yuborilganda uriladi
      if (phase === 'play') {
        if (rt.input.kick) rt.charge = Math.min(1, rt.charge + dt / 0.85)
        if (st.wasKick && !rt.input.kick) {
          const reach = Math.hypot(bp.x - rt.pos.x, bp.z - rt.pos.z)
          anim.kick = 0.3
          if (reach < 1.35 && bp.y < 0.8 && st.kickCd <= 0) {
            const power = 0.3 + 0.7 * rt.charge
            const v = 12 + 16 * power
            b.setLinvel({ x: hx * v, y: 1.8 + 3.6 * power * power, z: hz * v }, true)
            b.setAngvel({ x: hz * 20, y: (Math.random() - 0.5) * 8, z: -hx * 20 }, true)
            st.kickCd = 0.6
            st.shotT = clock.elapsedTime
            rt.shake = Math.max(rt.shake, 0.12 * power)
            playKick(power)
          }
          rt.charge = 0
        }
        st.wasKick = rt.input.kick
      }
    }

    /* ------------------------------------------------ darvozabon */
    if (keeper.current && b) {
      const v = b.linvel()
      const shot = v.x > 7 && bp.x > 22 && bp.x < KEEPER_X
      let target = clamp(bp.z * 0.4, -1.5, 1.5)
      let max = 2
      if (shot) {
        // Reaksiya vaqtidan keyin to'p yetib keladigan nuqtaga sakraydi
        if (clock.elapsedTime - st.shotT > 0.2) {
          const tHit = (KEEPER_X - bp.x) / v.x
          // Burchaklarga yetolmaydi — aniq zarba gol bo'ladi
          target = clamp(bp.z + v.z * tHit, -2.4, 2.4)
          // Har bir muvaffaqiyatsiz urinishdan keyin darvozabon biroz sekinlashadi
          max = Math.max(1, 2.4 - st.misses * 0.6)
        } else max = 0
      }
      const step = clamp(target - st.kz, -max * sdt, max * sdt)
      st.kz += phase === 'goal' || phase === 'portfolio' ? 0 : step
      st.dive = damp(st.dive, shot && Math.abs(target - st.kz) > 0.45 ? Math.sign(target - st.kz) : 0, 9, sdt)
      keeperAnim.dive = st.dive
      keeperAnim.lookX = clamp((bp.z - st.kz) * -0.2, -1, 1)
      keeper.current.setNextKinematicTranslation({ x: KEEPER_X, y: 0, z: st.kz })
    }

    /* ------------------------------------------- gol / to'p o'yindan chiqdi */
    if (phase === 'play' && b) {
      const inFrame = Math.abs(bp.z) < GOAL_HALF - BALL_R && bp.y < GOAL_H - BALL_R
      if (bp.x > GOAL_X + BALL_R && inFrame) {
        game.scored()
      } else {
        const v = b.linvel()
        const slow = Math.hypot(v.x, v.z) < 0.5
        const farFromPlayer = Math.hypot(bp.x - rt.pos.x, bp.z - rt.pos.z) > 2.5
        const out = bp.x > GOAL_X + 0.4 || bp.x < -52 || Math.abs(bp.z) > 34.5 || bp.y < -1
        // Darvozabon ushlab qoldi yoki to'p uzoqda to'xtab qoldi
        st.heldT = slow && farFromPlayer && bp.x > 44 ? st.heldT + dt : 0
        if (out || st.heldT > 1.1) {
          game.say(out ? 'Wide! Try again' : 'Saved! Try again')
          setTimeout(() => useGame.getState().say(''), 1800)
          st.heldT = 0
          st.misses++
          const x = Math.min(rt.pos.x, 38)
          rt.pos.x = x
          placeBall(x + 1.1, rt.pos.z)
          rt.heading = Math.PI / 2
        }
      }
    }

    /* --------------------------------------------------- gol nishonlanishi */
    if (phase === 'goal') {
      st.goalT += dt
      if (st.goalT > 1.3 && rt.timeScale < 1) {
        rt.timeScale = 1
        b?.setGravityScale(1, true)
      }
      anim.celebrate = damp(anim.celebrate, st.goalT > 0.35 ? 1 : 0, 6, dt)
    }
    rt.shake *= Math.exp(-dt * 2.4)

    /* ----------------------------------------------- portfolio pozasi */
    const idle = phase === 'portfolio'
    anim.trap = damp(anim.trap, idle ? 1 : 0, 8, dt)
    if (idle && b) {
      b.setTranslation({ x: rt.pos.x + 0.1, y: BALL_R, z: rt.pos.z + 0.3 }, false)
      b.setLinvel({ x: 0, y: 0, z: 0 }, false)
      b.setAngvel({ x: 0, y: 0, z: 0 }, false)
    }
    anim.lookX = idle ? stage.pointer.x : 0
    anim.lookY = idle ? stage.pointer.y : 0

    if (player.current) {
      player.current.position.copy(rt.pos)
      player.current.rotation.y = rt.heading + (idle ? Math.sin(clock.elapsedTime * 0.35) * 0.07 + stage.pointer.x * 0.12 : 0)
    }

    // Soya beruvchi chiroq o'yinchiga ergashadi (kichik, aniq soya xaritasi)
    if (light.current) {
      const power = (stage.lights.a + stage.lights.b + stage.lights.c + stage.lights.d) / 4
      light.current.intensity = power * 1.5
      light.current.position.set(rt.pos.x - 9, 18, rt.pos.z + 7)
      lightTarget.position.copy(rt.pos)
      lightTarget.updateMatrixWorld()
    }
  })

  return (
    <>
      <directionalLight
        ref={light}
        castShadow
        color="#eaf2ff"
        intensity={0}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <primitive object={lightTarget} />

      {/* Yer va maydon chegaralari */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[70, 0.5, 45]} position={[0, -0.5, 0]} friction={1.2} restitution={0.5} />
        <CuboidCollider args={[60, 6, 0.5]} position={[0, 6, -36.5]} />
        <CuboidCollider args={[60, 6, 0.5]} position={[0, 6, 36.5]} />
        <CuboidCollider args={[0.5, 6, 40]} position={[-55, 6, 0]} />
        <CuboidCollider args={[0.5, 6, 40]} position={[56.5, 6, 0]} />
      </RigidBody>

      <GoalFrame x={GOAL_X} solid />
      <GoalFrame x={-GOAL_X} solid={false} />

      {/* To'p */}
      <RigidBody ref={ball} colliders={false} position={[1, BALL_R, 0]} ccd linearDamping={0.38} angularDamping={0.7} canSleep={false}>
        <BallCollider args={[BALL_R]} restitution={0.6} friction={0.9} />
        <mesh castShadow>
          <sphereGeometry args={[BALL_R, 28, 20]} />
          <meshStandardMaterial map={ballTex} roughness={0.45} />
        </mesh>
      </RigidBody>

      {/* Darvozabon */}
      <RigidBody ref={keeper} type="kinematicPosition" colliders={false} position={[KEEPER_X, 0, 0]}>
        <CuboidCollider args={[0.3, 0.92, 0.42]} position={[0, 0.92, 0]} restitution={0.25} />
        <group rotation-y={-Math.PI / 2}>
          <Footballer site={keeperSite} anim={keeperAnim} gloves="#f4f6f9" />
        </group>
      </RigidBody>

      {/* O'yinchi */}
      <group ref={player}>
        {site.avatar.modelUrl ? (
          <Suspense fallback={null}>
            <ModelAvatar url={site.avatar.modelUrl} />
          </Suspense>
        ) : (
          <Footballer site={site} anim={anim} reveal captain />
        )}
      </group>

      <Celebration />
    </>
  )
}
