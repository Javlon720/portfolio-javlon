import { useGame } from './game'

/* Kichik ovoz effektlari — fayl yuklanmaydi, hammasi WebAudio'da sintez qilinadi.
   AudioContext faqat birinchi foydalanuvchi harakatidan keyin yaratiladi. */

let ctx: AudioContext | null = null

const audio = () => {
  if (useGame.getState().muted) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** To'pga zarba: qisqa past "tup" */
export function playKick(power = 1) {
  const c = audio()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.frequency.setValueAtTime(170, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(45, c.currentTime + 0.14)
  gain.gain.setValueAtTime(0.25 + 0.35 * power, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18)
  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.2)
}

/** Tomoshabinlar shovqini: filtrlangan oq shovqin to'lqini */
export function playCheer(seconds = 5) {
  const c = audio()
  if (!c) return
  const buffer = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 900
  band.Q.value = 0.5
  const gain = c.createGain()
  const t = c.currentTime
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.5, t + 0.35)
  gain.gain.setValueAtTime(0.5, t + seconds * 0.45)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
  // Olomon "to'lqini" — sekin tebranuvchi filtr
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 0.9
  lfoGain.gain.value = 350
  lfo.connect(lfoGain).connect(band.frequency)
  src.connect(band).connect(gain).connect(c.destination)
  src.start()
  lfo.start()
  lfo.stop(t + seconds)
}

/** Hakam hushtagi */
export function playWhistle() {
  const c = audio()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.value = 2350
  const t = c.currentTime
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.06, t + 0.03)
  gain.gain.setValueAtTime(0.06, t + 0.32)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(t + 0.42)
}
