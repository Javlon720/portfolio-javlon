'use client'

import { SiteProvider } from '@/lib/store'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { Loader } from '@/components/ui/Loader'
import { Cursor } from '@/components/ui/Cursor'
import { Curtain } from '@/components/ui/Curtain'
import { Navbar } from '@/components/ui/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Career } from '@/components/sections/Career'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Trophies } from '@/components/sections/Trophies'
import { Contact } from '@/components/sections/Contact'
import { Customizer } from '@/components/admin/Customizer'

export function Experience() {
  return (
    <SiteProvider>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Curtain />
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Career />
        <Trophies />
        <Contact />
      </main>
      <Customizer />
    </SiteProvider>
  )
}
