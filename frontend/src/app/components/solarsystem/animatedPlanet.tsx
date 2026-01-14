import { forwardRef, useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlanetProps } from "./interfaces";
import { SimulationContext } from "./SolarSystemScene";
import { SCALING_CONSTANTS } from "./scalingUtils";
import OrbitCircle from "./orbitCircle";

const AnimatedPlanet = forwardRef<THREE.Mesh, PlanetProps>(
  (
    {
      id,
      parentRef,
      planetData,
      parentPlanetData = null,
      color = "blue",
      texturePath,
    },
    ref
  ) => {
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
      if (parentPlanetData) {
        return (
          distanceInKm * SCALING_CONSTANTS.SYSTEM_SCALE +
          scalePlanetRadius(parentPlanetData.radiusKm) +
          scalePlanetRadius(planetData.radiusKm)
        );
      }
      return distanceInKm * SCALING_CONSTANTS.SYSTEM_SCALE;
    };

    const scalePlanetRadius = (radiusInKm: number) => {
      if (planetData.isStar) return radiusInKm * SCALING_CONSTANTS.SYSTEM_SCALE;
      return (
        radiusInKm *
        SCALING_CONSTANTS.SYSTEM_SCALE *
        SCALING_CONSTANTS.PLANET_RADIUS_SCALE_BOOST
      );
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
          SCALING_CONSTANTS.ROTATION_SPEED_FACTOR *
          planetData.rotationDirection;
      }
    });

    useFrame(() => {
      // Only follow if this planet is the followed one
      if (followedPlanetId.current === id && controls && planetRef.current) {
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
            <pointLight intensity={600} castShadow={false} decay={0.9} />
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

export default AnimatedPlanet;
