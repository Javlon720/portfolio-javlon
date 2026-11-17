import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, JetBrains_Mono, Manrope } from 'next/font/google'
import { site } from '@/config/site'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
})
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const jet = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jet', display: 'swap' })

export const metadata: Metadata = {
  title: `${site.player.fullName} — Full Stack Developer`,
  description: `${site.player.fullName}, full stack developer from ${site.player.nation}. ${site.hero.tagline}.`,
  openGraph: {
    title: `${site.player.fullName} — Full Stack Developer`,
    description: site.hero.intro,
    type: 'website',
  },
}

export const viewport: Viewport = { themeColor: '#04070d' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${manrope.variable} ${jet.variable}`}>
      <body>{children}</body>
    </html>
  )
}
