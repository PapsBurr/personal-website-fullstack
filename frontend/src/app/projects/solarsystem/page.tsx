'use client'
import dynamic from 'next/dynamic'

// Disable SSR for the 3D component
const SolarSystemScene = dynamic(() => import('@/app/components/SolarSystemScene'), {
  ssr: false,
})

export default function Home() {
  return (
    <SolarSystemScene />
  )
}