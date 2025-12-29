"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Sphere,
  Line,
  GizmoHelper,
  GizmoViewcube,
} from "@react-three/drei";
import {
  useRef,
  useMemo,
  Suspense,
  createContext,
  useContext,
  forwardRef,
} from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

enum RotationDirection {
  CLOCKWISE = -1,
  COUNTERCLOCKWISE = 1,
}

interface PlanetProps {
  id: string;
  parentRef?: React.RefObject<THREE.Mesh | null>;
  orbitalRadius: number;
  orbitSpeed: number;
  rotationSpeed?: number;
  rotationDirection?: RotationDirection;
  planetRadius?: number;
  color?: string;
  texturePath?: string;
}

const FollowContext = createContext<{
  followedPlanetId: React.RefObject<string | null>;
}>({
  followedPlanetId: { current: null } as React.RefObject<string | null>,
});

function OrbitCircle({
  radius = 5,
  segments = 64,
  color = "#4b4b4b",
  parentRef,
}: {
  radius?: number;
  segments?: number;
  color?: string;
  parentRef?: React.RefObject<THREE.Mesh | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
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

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={2} />
    </group>
  );
}

const AnimatedPlanet = forwardRef<THREE.Mesh, PlanetProps>(
  (
    {
      id,
      parentRef,
      orbitalRadius = 5,
      orbitSpeed = 0.01,
      rotationDirection = RotationDirection.COUNTERCLOCKWISE,
      rotationSpeed = 0.01 * rotationDirection,
      planetRadius = 0.5,
      color = "blue",
      texturePath,
    },
    ref
  ) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const angleRef = useRef(0);
    const previousTarget = useRef(new THREE.Vector3());
    const { camera, controls } = useThree();
    const { followedPlanetId } = useContext(FollowContext);

    // Only load texture if path is provided
    const texture = texturePath ? useTexture(texturePath) : null;

    useFrame(() => {
      const x = orbitalRadius * Math.cos(angleRef.current);
      const z = orbitalRadius * Math.sin(angleRef.current);

      angleRef.current += orbitSpeed;

      if (planetRef.current) {
        // Calculate position relative to parent (or origin if no parent)
        const parentPosition =
          parentRef?.current?.position || new THREE.Vector3(0, 0, 0);

        planetRef.current.position.x = parentPosition.x + x;
        planetRef.current.position.y = parentPosition.y;
        planetRef.current.position.z = parentPosition.z + z;
        planetRef.current.rotation.y += rotationSpeed;

        // Only follow if this planet is the followed one
        if (followedPlanetId.current === id && controls) {
          const orbitControls = controls as OrbitControlsImpl;

          // Calculate how much the planet moved
          const delta = new THREE.Vector3().subVectors(
            planetRef.current.position,
            previousTarget.current
          );

          // Move both camera and target by the same delta
          camera.position.add(delta);
          orbitControls.target.copy(planetRef.current.position);

          // Store current position for next frame
          previousTarget.current.copy(planetRef.current.position);

          orbitControls.update();
        }
      }
    });

    const handleClick = () => {
      if (planetRef.current && controls) {
        const orbitControls = controls as OrbitControlsImpl;

        if (followedPlanetId.current !== id) {
          // Start following this planet
          followedPlanetId.current = id;

          // Set initial camera position at fixed distance
          orbitControls.target.copy(planetRef.current.position);
          const direction = new THREE.Vector3();
          direction
            .subVectors(camera.position, planetRef.current.position)
            .normalize();
          const distance = 3;
          camera.position
            .copy(planetRef.current.position)
            .add(direction.multiplyScalar(distance));

          // Store initial planet position
          previousTarget.current.copy(planetRef.current.position);
          orbitControls.update();
        } else {
          // Stop following
          followedPlanetId.current = null;
        }
      }
    };

    return (
      <>
        <Sphere
          ref={(node) => {
            planetRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          args={[planetRadius, 32, 32]}
          position={[orbitalRadius, 0, 0]}
          onClick={handleClick}
        >
          <meshStandardMaterial
            color={texture ? undefined : color}
            map={texture}
          />
        </Sphere>
        <OrbitCircle
          radius={orbitalRadius}
          segments={64}
          parentRef={parentRef}
        />
      </>
    );
  }
);

AnimatedPlanet.displayName = "AnimatedPlanet";

function SolarSystemObjects() {
  const sunRef = useRef<THREE.Mesh>(null);
  const earthRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <AnimatedPlanet
        ref={sunRef}
        id="sun"
        orbitalRadius={0}
        orbitSpeed={0}
        planetRadius={1}
        texturePath="/2k_sun.jpg"
      />
      <AnimatedPlanet
        ref={earthRef}
        id="earth"
        parentRef={sunRef}
        orbitalRadius={12}
        orbitSpeed={0.005}
        planetRadius={0.5}
        texturePath="/2k_earth_daymap.jpg"
      />
      <AnimatedPlanet
        id="moon"
        parentRef={earthRef}
        orbitalRadius={2}
        orbitSpeed={0.02}
        planetRadius={0.2}
        color="gray"
      />
      <AnimatedPlanet
        id="mars"
        parentRef={sunRef}
        orbitalRadius={18}
        orbitSpeed={0.004}
        planetRadius={0.3}
        texturePath="/2k_mars.jpg"
      />
    </>
  );
}

export default function SolarSystemScene() {
  const followedPlanetId = useRef<string | null>(null);

  return (
    <div className="canvas-container">
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [0, 10, 24], fov: 90 }}
      >
        <Suspense fallback={null}>
          <FollowContext.Provider value={{ followedPlanetId }}>
            <GizmoHelper alignment="top-left" margin={[80, 80]}>
              <GizmoViewcube />
            </GizmoHelper>
            <OrbitControls enableRotate makeDefault />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            <SolarSystemObjects />
          </FollowContext.Provider>
        </Suspense>
      </Canvas>
    </div>
  );
}
