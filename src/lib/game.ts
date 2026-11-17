import { create } from 'zustand'
import type { RapierRigidBody } from '@react-three/rapier'

/* O'yin holati.
   - useGame (Zustand): kam o'zgaradigan, UI'ga ta'sir qiladigan holat (bosqich, hisob, ovoz).
   - rt: har kadrda o'zgaradigan qiymatlar (pozitsiya, kiritish, kamera) — React'ni bezovta qilmaydi. */

export type Phase =
  | 'loading' // yuklanish ekrani
  | 'intro' // kamera stadionga kiradi, chiroqlar yonadi, o'yinchi paydo bo'ladi
  | 'walk' // o'yinchi to'p bilan o'zi yura boshlaydi
  | 'play' // boshqaruv foydalanuvchida
  | 'goal' // gol nishonlanishi
  | 'portfolio' // stadion portfolioga aylanadi, skroll ochiladi

interface GameState {
  phase: Phase
  goals: number
  muted: boolean
  toast: string
  setPhase: (phase: Phase) => void
  scored: () => void
  toggleMute: () => void
  say: (toast: string) => void
}

export const useGame = create<GameState>((set) => ({
  phase: 'loading',
  goals: 0,
  muted: false,
  toast: '',
  setPhase: (phase) => set({ phase }),
  scored: () => set((s) => ({ phase: 'goal', goals: s.goals + 1, toast: '' })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  say: (toast) => set({ toast }),
}))

/** O'yinchi boshlang'ich nuqtasi (markaz) va boshqaruv topshiriladigan nuqta */
export const SPAWN_X = 0
export const HANDOVER_X = 14
export const GOAL_X = 52.5
export const GOAL_HALF = 3.66
export const GOAL_H = 2.44

/** Yengil vektor — bu fayl three.js'ni asosiy bundle'ga tortmasligi uchun */
const vec = (x: number, y: number, z: number) => ({
  x,
  y,
  z,
  set(a: number, b: number, c: number) {
    this.x = a
    this.y = b
    this.z = c
  },
})

export const rt = {
  pos: vec(SPAWN_X, 0, 0),
  /** O'yinchi qaragan yo'nalish (Y o'qi atrofida, 0 = +Z) */
  heading: Math.PI / 2,
  speed: 0,
  /** Kamera yo'nalishi; π/2 = darvoza (+X) tomonga */
  yaw: Math.PI / 2,
  input: { x: 0, y: 0, sprint: false, kick: false },
  /** Zarba kuchi to'planishi (0..1) */
  charge: 0,
  shake: 0,
  /** Gol nishonlanishi kuchi (0..1): tomoshabinlar, chiroqlar, mushaklar */
  cheer: 0,
  /** Sekinlashtirilgan vaqt ko'paytuvchisi */
  timeScale: 1,
  ball: null as RapierRigidBody | null,
  ballPos: vec(1, 0.11, 0),
}

export const resetRuntime = () => {
  rt.speed = 0
  rt.charge = 0
  rt.shake = 0
  rt.cheer = 0
  rt.timeScale = 1
  rt.input.x = rt.input.y = 0
  rt.input.kick = rt.input.sprint = false
}
