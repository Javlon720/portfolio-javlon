'use client'

import { useEffect } from 'react'
import { rt, useGame } from '@/lib/game'

/* Klaviatura va sichqoncha kiritishi.
   WASD / strelkalar — harakat, Shift — tezlanish, Space — zarba (ushlab turish = kuch),
   sichqoncha yoki barmoq bilan sudrash — kamera. */

const typing = (e: Event) => {
  const el = e.target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

export function GameInput() {
  useEffect(() => {
    const keys = new Set<string>()
    const playing = () => {
      const p = useGame.getState().phase
      return p === 'play' || p === 'walk'
    }
    const sync = () => {
      const has = (...k: string[]) => k.some((c) => keys.has(c))
      rt.input.x = (has('KeyD', 'ArrowRight') ? 1 : 0) - (has('KeyA', 'ArrowLeft') ? 1 : 0)
      rt.input.y = (has('KeyW', 'ArrowUp') ? 1 : 0) - (has('KeyS', 'ArrowDown') ? 1 : 0)
      rt.input.sprint = has('ShiftLeft', 'ShiftRight')
      rt.input.kick = has('Space')
    }
    const down = (e: KeyboardEvent) => {
      if (typing(e) || !playing()) return
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
      keys.add(e.code)
      sync()
    }
    const up = (e: KeyboardEvent) => {
      if (!keys.delete(e.code)) return
      sync()
    }
    const blur = () => {
      keys.clear()
      sync()
    }

    // Kamera: UI elementlaridan tashqarida sudrash
    let drag: number | null = null
    let lastX = 0
    const pDown = (e: PointerEvent) => {
      if (!playing() || (e.target as HTMLElement).closest('[data-ui]')) return
      drag = e.pointerId
      lastX = e.clientX
    }
    const pMove = (e: PointerEvent) => {
      if (drag !== e.pointerId) return
      rt.yaw -= (e.clientX - lastX) * 0.005
      lastX = e.clientX
    }
    const pUp = (e: PointerEvent) => {
      if (drag === e.pointerId) drag = null
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    window.addEventListener('pointerdown', pDown)
    window.addEventListener('pointermove', pMove)
    window.addEventListener('pointerup', pUp)
    window.addEventListener('pointercancel', pUp)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      window.removeEventListener('pointerdown', pDown)
      window.removeEventListener('pointermove', pMove)
      window.removeEventListener('pointerup', pUp)
      window.removeEventListener('pointercancel', pUp)
    }
  }, [])

  return null
}
