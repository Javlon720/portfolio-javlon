import TypeLine from './TypeLine'
import { useTypewriter } from '../hooks/useTypewriter'

/**
 * Hero matnlari: salom -> ism -> kasb -> tavsif.
 * Birin-ketin, harfma-harf yozilib chiqadi.
 *
 * Til almashganda Hero bu komponentni `key={lang}` orqali qayta yaratadi —
 * shu sababli animatsiya yangi tilda boshidan boshlanadi.
 */
export default function HeroIntro({ lines }) {
  const { typed, active } = useTypewriter(lines)

  return (
    <>
      <p className="font-display mt-8 text-base text-muted-fg sm:text-lg">
        <TypeLine text={lines[0]} typed={typed[0]} caret={active === 0} />
      </p>

      <h1 className="mt-2 text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.95] font-bold">
        <TypeLine text={lines[1]} typed={typed[1]} caret={active === 1} />
      </h1>

      <p className="font-display mt-4 text-xl font-medium text-accent sm:text-2xl">
        <TypeLine text={lines[2]} typed={typed[2]} caret={active === 2} />
      </p>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-fg sm:text-lg">
        <TypeLine text={lines[3]} typed={typed[3]} caret={active >= 3} />
      </p>
    </>
  )
}
