import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ekotizimini tree-shake qilish — bundle hajmini kamaytiradi
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'lucide-react', 'framer-motion'],
  },
}

export default nextConfig
