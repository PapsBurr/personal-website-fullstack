"use client";

import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useRef, useMemo, useContext } from "react";
import * as THREE from "three";
import { SimulationContext } from "./solarSystemScene";

function OrbitCircle({
  radius = 5,
  segments = 128,
  color = "#2b2b2b",
  parentRef,
}: {
  radius?: number;
  segments?: number;
  color?: string;
  parentRef?: React.RefObject<THREE.Mesh | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { showOrbits } = useContext(SimulationContext);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * radius,
          0,
          Math.sin(theta) * radius,
        ),
      );
    }
    return pts;
  }, [radius, segments]);

  useFrame(() => {
    if (groupRef.current && parentRef?.current) {
      // Update group position to follow parent
      groupRef.current.position.copy(parentRef.current.position);
    }
  });

  if (!showOrbits) return null;

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={2} />
    </group>
  );
}

export default OrbitCircle;
