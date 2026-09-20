import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GridLogos from './components/GridLogos'

export default function App() {
  return (
    <AppProvider>
      {/* Sahifa chetlaridagi vertikal chiziqlar (kataklar bilan bir tekisda) */}
      <div className="page-rails" aria-hidden="true" />

      <div className="relative">
        {/* Yon kataklardagi dekorativ logolar */}
        <GridLogos />

        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}
