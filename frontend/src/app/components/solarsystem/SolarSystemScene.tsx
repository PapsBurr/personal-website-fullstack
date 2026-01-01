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
  useEffect,
  useState,
} from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { PlanetProps } from "./interfaces";
import { planetData } from "./planetData";
import ControlBar from "./controlBar";
import "./controlBar.css";

const SYSTEM_SCALE = 0.000001;
const BASE_TIME_SCALE = 0.05;
const PLANET_RADIUS_SCALE_BOOST = 100;
const ROTATION_SPEED_FACTOR = 1;

/* const FollowContext = createContext<{
  followedPlanetId: React.RefObject<string | null>;
}>({
  followedPlanetId: { current: null } as React.RefObject<string | null>,
}); */

const SimulationContext = createContext<{
  followedPlanetId: React.RefObject<string | null>;
  timeScale: number;
  isPaused: boolean;
  showOrbits: boolean;
}>({
  followedPlanetId: { current: null } as React.RefObject<string | null>,
  timeScale: BASE_TIME_SCALE,
  isPaused: false,
  showOrbits: true,
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
  const { showOrbits } = useContext(SimulationContext);

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

  if (!showOrbits) return null;

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={2} />
    </group>
  );
}

const AnimatedPlanet = forwardRef<THREE.Mesh, PlanetProps>(
  ({ id, parentRef, planetData, color = "blue", texturePath }, ref) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const angleRef = useRef(0);
    const previousTarget = useRef(new THREE.Vector3());
    const { camera, controls } = useThree();
    const { followedPlanetId, timeScale, isPaused } =
      useContext(SimulationContext);

    const segments = 32;

    // Only load texture if path is provided
    const texture = texturePath ? useTexture(texturePath) : null;

    const calculateOrbitSpeed = (orbitalPeriodHrs: number) => {
      if (orbitalPeriodHrs <= 0) return 0;
      return ((2 * Math.PI) / orbitalPeriodHrs) * timeScale;
    };

    const scaleDistance = (distanceInKm: number) => {
      return distanceInKm * SYSTEM_SCALE;
    };

    const scalePlanetRadius = (radiusInKm: number) => {
      if (planetData.isStar) return radiusInKm * SYSTEM_SCALE;
      return radiusInKm * SYSTEM_SCALE * PLANET_RADIUS_SCALE_BOOST;
    };

    const scalePlanetRotation = (rotationPeriodHrs: number) => {
      if (rotationPeriodHrs <= 0) return 0;
      return ((2 * Math.PI) / rotationPeriodHrs) * timeScale;
    };

    const scaledOrbitSpeed = calculateOrbitSpeed(planetData.orbitalPeriodHrs);
    const scaledDistance = scaleDistance(planetData.distanceKm);
    const scaledPlanetRadius = scalePlanetRadius(planetData.radiusKm);
    const scaledPlanetRotation = scalePlanetRotation(
      planetData.rotationPeriodHrs
    );

    // Optimize texture on load
    useEffect(() => {
      if (texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = 1; // Reduce anisotropic filtering
      }
    }, [texture]);

    useFrame(() => {
      if (isPaused) return; // Don't animate if paused

      const x = scaledDistance * Math.cos(angleRef.current);
      const z = scaledDistance * Math.sin(angleRef.current);

      angleRef.current -= scaledOrbitSpeed;

      if (planetRef.current) {
        // Calculate position relative to parent (or origin if no parent)
        const parentPosition =
          parentRef?.current?.position || new THREE.Vector3(0, 0, 0);

        planetRef.current.position.x = parentPosition.x + x;
        planetRef.current.position.y = parentPosition.y;
        planetRef.current.position.z = parentPosition.z + z;
        planetRef.current.rotation.y +=
          scaledPlanetRotation *
          ROTATION_SPEED_FACTOR *
          planetData.rotationDirection;

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
          const distance = 5 * scaledPlanetRadius;
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
          args={[scaledPlanetRadius, segments, segments]}
          position={[scaledPlanetRadius, 0, 0]}
          onClick={handleClick}
        >
          {planetData.isStar ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshStandardMaterial
              color={texture ? undefined : color}
              map={texture}
            />
          )}
          {planetData.isStar && (
            <pointLight intensity={200} castShadow={false} decay={0.9} />
          )}
        </Sphere>
        <OrbitCircle
          radius={scaledDistance}
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
        planetData={planetData.sun}
        texturePath="/2k_sun.jpg"
      />
      <AnimatedPlanet
        id="mercury"
        parentRef={sunRef}
        planetData={planetData.mercury}
        texturePath="/2k_mercury.jpg"
      />
      <AnimatedPlanet
        id="venus"
        parentRef={sunRef}
        planetData={planetData.venus}
        texturePath="/2k_venus_atmosphere.jpg"
      />
      <AnimatedPlanet
        ref={earthRef}
        id="earth"
        parentRef={sunRef}
        planetData={planetData.earth}
        texturePath="/2k_earth_daymap.jpg"
      />
      <AnimatedPlanet
        id="moon"
        parentRef={earthRef}
        planetData={planetData.earth.satellites!.moon}
        texturePath="/2k_moon.jpg"
      />
      <AnimatedPlanet
        id="mars"
        parentRef={sunRef}
        planetData={planetData.mars}
        texturePath="/2k_mars.jpg"
      />
      <AnimatedPlanet
        id="jupiter"
        parentRef={sunRef}
        planetData={planetData.jupiter}
        texturePath="/2k_jupiter.jpg"
      />
      <AnimatedPlanet
        id="saturn"
        parentRef={sunRef}
        planetData={planetData.saturn}
        texturePath="/2k_saturn.jpg"
      />
      <AnimatedPlanet
        id="uranus"
        parentRef={sunRef}
        planetData={planetData.uranus}
        texturePath="/2k_uranus.jpg"
      />
      <AnimatedPlanet
        id="neptune"
        parentRef={sunRef}
        planetData={planetData.neptune}
        texturePath="/2k_neptune.jpg"
      />
    </>
  );
}

export default function SolarSystemScene() {
  const followedPlanetId = useRef<string | null>(null);
  const [timeScale, setTimeScale] = useState(BASE_TIME_SCALE);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

  /* const followedPlanetId = useRef<string | null>(null); */

  const handlePlanetSelect = (planetId: string | null) => {
    setSelectedPlanetId(planetId);
    followedPlanetId.current = planetId;
  };

  return (
    <>
      <ControlBar
        timeScale={timeScale}
        onTimeScaleChange={setTimeScale}
        selectedPlanet={selectedPlanetId}
        onPlanetSelect={handlePlanetSelect}
        showOrbits={showOrbits}
        onShowOrbitsToggle={setShowOrbits}
        isPaused={isPaused}
        onPauseToggle={setIsPaused}
      />
      <div className="canvas-container">
        <Canvas
          style={{ background: "black" }}
          camera={{ position: [0, 64, 64], fov: 90, near: 0.01, far: 10000 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
          dpr={[1, 1.5]} // Limit pixel ratio
        >
          <Suspense fallback={null}>
            {/* <FollowContext.Provider value={{ followedPlanetId }}> */}
            <SimulationContext.Provider
              value={{ followedPlanetId, timeScale, isPaused, showOrbits }}
            >
              <GizmoHelper alignment="top-left" margin={[80, 80]}>
                <GizmoViewcube />
              </GizmoHelper>
              <OrbitControls enableRotate makeDefault zoomSpeed={5} />
              <ambientLight intensity={0.05} />
              <SolarSystemObjects />
              {/* </FollowContext.Provider> */}
            </SimulationContext.Provider>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
