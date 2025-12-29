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

const enum RotationDirection {
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

  const DISTANCE_SCALE = 0.0000001; // Scale down distances (1 AU = 149,597,870 km)
  const TIME_SCALE = 0.1; // Speed up time significantly

  // Real data: orbital radius in km, orbital period in Earth days, radius in km
  const planets = {
    mercury: { distance: 57909050, period: 87.97, radius: 2439.7 },
    venus: { distance: 108208000, period: 224.7, radius: 6051.8 },
    earth: { distance: 149598023, period: 365.26, radius: 6371 },
    moon: { distance: 384400, period: 27.3, radius: 1737.1 },
    mars: { distance: 227939366, period: 687, radius: 3389.5 },
    jupiter: { distance: 778479000, period: 4331, radius: 69911 },
    saturn: { distance: 1432000000, period: 10747, radius: 58232 },
    uranus: { distance: 2867000000, period: 30589, radius: 25362 },
    neptune: { distance: 4515000000, period: 59800, radius: 24622 },
  };

  const calculateOrbitSpeed = (periodInDays: number) => {
    return ((2 * Math.PI) / periodInDays) * TIME_SCALE;
  };

  const scaleDistance = (distanceInKm: number) => {
    return distanceInKm * DISTANCE_SCALE;
  };

  const scalePlanetRadius = (radiusInKm: number) => {
    return radiusInKm * DISTANCE_SCALE * 100;
  };

  return (
    <>
      <AnimatedPlanet
        ref={sunRef}
        id="sun"
        orbitalRadius={0}
        orbitSpeed={0}
        planetRadius={1} // Sun scaled for visibility
        texturePath="/2k_sun.jpg"
      />
      <AnimatedPlanet
        id="mercury"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.mercury.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.mercury.period)}
        planetRadius={scalePlanetRadius(planets.mercury.radius)}
        texturePath="/2k_mercury.jpg"
      />
      <AnimatedPlanet
        id="venus"
        parentRef={sunRef}
        rotationDirection={RotationDirection.CLOCKWISE}
        orbitalRadius={scaleDistance(planets.venus.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.venus.period)}
        planetRadius={scalePlanetRadius(planets.venus.radius)}
        texturePath="/2k_venus_atmosphere.jpg"
      />
      <AnimatedPlanet
        ref={earthRef}
        id="earth"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.earth.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.earth.period)}
        planetRadius={scalePlanetRadius(planets.earth.radius)}
        texturePath="/2k_earth_daymap.jpg"
      />
      <AnimatedPlanet
        id="moon"
        parentRef={earthRef}
        orbitalRadius={scaleDistance(planets.moon.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.moon.period)}
        planetRadius={scalePlanetRadius(planets.moon.radius)}
        color="gray"
      />
      <AnimatedPlanet
        id="mars"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.mars.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.mars.period)}
        planetRadius={scalePlanetRadius(planets.mars.radius)}
        texturePath="/2k_mars.jpg"
      />
      <AnimatedPlanet
        id="jupiter"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.jupiter.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.jupiter.period)}
        planetRadius={scalePlanetRadius(planets.jupiter.radius)}
        texturePath="/2k_jupiter.jpg"
      />
      <AnimatedPlanet
        id="saturn"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.saturn.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.saturn.period)}
        planetRadius={scalePlanetRadius(planets.saturn.radius)}
        texturePath="/2k_saturn.jpg"
      />
      <AnimatedPlanet
        id="uranus"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.uranus.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.uranus.period)}
        planetRadius={scalePlanetRadius(planets.uranus.radius)}
        texturePath="/2k_uranus.jpg"
      />
      <AnimatedPlanet
        id="neptune"
        parentRef={sunRef}
        orbitalRadius={scaleDistance(planets.neptune.distance)}
        orbitSpeed={calculateOrbitSpeed(planets.neptune.period)}
        planetRadius={scalePlanetRadius(planets.neptune.radius)}
        texturePath="/2k_neptune.jpg"
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
