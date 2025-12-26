import dynamic from 'next/dynamic'

// Disable SSR for the 3D component
const Scene = dynamic(() => import('../../components/Scene'), {
  ssr: false,
})

export default function Home() {
  return (
    <Scene />
  )
}