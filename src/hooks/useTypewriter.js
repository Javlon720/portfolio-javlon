import { useEffect, useState } from 'react'

// Qatorlarni bitta satrga yig'ish/ajratish — effekt uchun kalit bo'lib
// xizmat qiladi, shu bois qatorlarni alohida saqlash shart emas
const SEP = '\u0000'

const prefersStill = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Matnlarni birin-ketin, harfma-harf yozib chiqadi.
 *
 * Har bir qator taxminan bir xil vaqtda yoziladi: uzun qator tezroq,
 * qisqasi sekinroq — shunda ritm tekis chiqadi.
 *
 * Animatsiyani qaytadan boshlash uchun komponentni `key` bilan qayta
 * yarating (masalan `key={lang}`) — holat o'zidan-o'zi tozalanadi.
 *
 * Qaytaradi: { typed, active, done }
 *   typed  — hozirgacha yozilgan matnlar (lines bilan bir uzunlikda)
 *   active — hozir yozilayotgan qator raqami
 *   done   — hammasi tugadimi
 */
export function useTypewriter(lines, { budget = 1100, min = 10, max = 40, pause = 280 } = {}) {
  const key = lines.join(SEP)

  const [state, setState] = useState(() =>
    // Harakatni kamaytirish rejimida matn darhol to'liq ko'rinadi
    prefersStill()
      ? { typed: lines, active: lines.length - 1, done: true }
      : { typed: lines.map(() => ''), active: 0, done: false },
  )

  useEffect(() => {
    if (prefersStill()) return

    const all = key.split(SEP)
    let line = 0
    let ch = 0
    let timer = 0

    const step = () => {
      if (line >= all.length) {
        setState((s) => ({ ...s, done: true }))
        return
      }

      const text = all[line]
      const speed = Math.min(max, Math.max(min, budget / Math.max(text.length, 1)))

      if (ch < text.length) {
        ch += 1
        const at = line
        const upto = ch
        setState((s) => {
          const typed = [...s.typed]
          typed[at] = text.slice(0, upto)
          return { ...s, typed }
        })
        timer = setTimeout(step, speed)
      } else {
        line += 1
        ch = 0
        const next = line
        setState((s) => ({ ...s, active: next }))
        timer = setTimeout(step, pause)
      }
    }

    timer = setTimeout(step, 260)
    return () => clearTimeout(timer)
  }, [key, budget, min, max, pause])

  return state
}
