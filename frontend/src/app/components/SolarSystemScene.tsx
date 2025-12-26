'use client'

import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls, Sphere, TorusKnot } from '@react-three/drei'

export default function SolarSystemScene() {
  return (
    <div className="canvas-container">
      <Canvas style={{ background: 'black' }} camera={{position: [2, 2, 2], fov: 90}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <Sphere args ={[1, 8, 8]}>
          <meshStandardMaterial color="blue"/>
        </Sphere>
        <Box args={[1, 1, 3]} position={[0, -2, 0]}>
          <meshStandardMaterial color="gold" />
        </Box>
        <TorusKnot args={[1.7, 0.3, 256, 15]} position={[0, 4, 0]} rotation={[Math.PI / 2, 1, 1]}>
          <meshStandardMaterial color="purple" />
        </TorusKnot>
        <OrbitControls />
      </Canvas>
    </div>
  )
}