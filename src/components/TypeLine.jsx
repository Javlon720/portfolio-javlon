/**
 * Yozilib borayotgan bitta qator.
 *
 * Ostida to'liq matnning ko'rinmas nusxasi turadi — u joyni oldindan band
 * qiladi, shuning uchun matn yozilganda sahifa sakramaydi.
 * Ekran o'qigichlar esa to'liq matnni birdaniga oladi.
 */
export default function TypeLine({ text, typed, caret = false, className = '' }) {
  return (
    <span className={`type-line ${className}`}>
      <span className="sr-only">{text}</span>

      <span className="type-ghost" aria-hidden="true">
        {text}
      </span>

      <span className="type-shown" aria-hidden="true">
        {typed}
        {caret && <i className="type-caret" />}
      </span>
    </span>
  )
}
