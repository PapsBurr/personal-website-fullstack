"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import { useRef, Suspense, createContext, useState } from "react";
import * as THREE from "three";
import { PlanetProps } from "./interfaces";
import { planetsConfig } from "./planetConfig";
import ControlBar from "./controlBar";
import AnimatedPlanet from "./animatedPlanet";
import "./controlBar.css";

const BASE_TIME_SCALE = 0.05;

export const SimulationContext = createContext<{
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

AnimatedPlanet.displayName = "AnimatedPlanet";

function SolarSystemObjects() {
  const planetRefs = useRef<Map<string, React.RefObject<THREE.Mesh | null>>>(
    new Map()
  );

  planetsConfig.forEach((config) => {
    if (config.hasSatellites && !planetRefs.current.has(config.id)) {
      planetRefs.current.set(config.id, { current: null });
    }
  });

  return (
    <>
      {planetsConfig.map((config) => {
        const ref = config.hasSatellites
          ? planetRefs.current.get(config.id)
          : undefined;
        const parentRef = config.parentId
          ? planetRefs.current.get(config.parentId)
          : undefined;

        const planetProps: PlanetProps = {
          id: config.id,
          planetData: config.planetData,
          parentPlanetData: config.parentPlanetData,
          texturePath: config.texturePath,
          color: config.color,
          parentRef: parentRef,
          ringData: config.ringData,
        };

        return <AnimatedPlanet key={config.id} ref={ref} {...planetProps} />;
      })}
    </>
  );

  // OLD CODE USING INDIVIDUAL REFS
  // -------------------------------------------
  // const sunRef = useRef<THREE.Mesh>(null);
  // const earthRef = useRef<THREE.Mesh>(null);

  // return (
  //   <>
  //     <AnimatedPlanet
  //       ref={sunRef}
  //       id="sun"
  //       planetData={planetData.sun}
  //       texturePath="/2k_sun.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="mercury"
  //       parentRef={sunRef}
  //       planetData={planetData.mercury}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_mercury.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="venus"
  //       parentRef={sunRef}
  //       planetData={planetData.venus}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_venus_atmosphere.jpg"
  //     />
  //     <AnimatedPlanet
  //       ref={earthRef}
  //       id="earth"
  //       parentRef={sunRef}
  //       planetData={planetData.earth}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_earth_daymap.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="moon"
  //       parentRef={earthRef}
  //       planetData={planetData.earth.satellites!.moon}
  //       parentPlanetData={planetData.earth}
  //       texturePath="/2k_moon.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="mars"
  //       parentRef={sunRef}
  //       planetData={planetData.mars}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_mars.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="jupiter"
  //       parentRef={sunRef}
  //       planetData={planetData.jupiter}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_jupiter.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="saturn"
  //       parentRef={sunRef}
  //       planetData={planetData.saturn}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_saturn.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="uranus"
  //       parentRef={sunRef}
  //       planetData={planetData.uranus}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_uranus.jpg"
  //     />
  //     <AnimatedPlanet
  //       id="neptune"
  //       parentRef={sunRef}
  //       planetData={planetData.neptune}
  //       parentPlanetData={planetData.sun}
  //       texturePath="/2k_neptune.jpg"
  //     />
  //   </>
  // );
}

export default function SolarSystemScene() {
  const followedPlanetId = useRef<string | null>(null);
  const [timeScale, setTimeScale] = useState(BASE_TIME_SCALE);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

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
          camera={{ position: [-196, 64, 64], fov: 90, near: 0.01, far: 10000 }}
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
              <ambientLight intensity={0.2} />
              <SolarSystemObjects />
              {/* </FollowContext.Provider> */}
            </SimulationContext.Provider>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
