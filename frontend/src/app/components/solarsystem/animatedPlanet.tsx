import { forwardRef, useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlanetProps } from "./interfaces";
import { SimulationContext } from "./solarSystemScene";
import { SCALING_CONSTANTS } from "./scalingUtils";
import PlanetRing from "./planetRing";
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
      ringData,
    },
    ref,
  ) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const angleRef = useRef(0);
    const previousTarget = useRef(new THREE.Vector3());
    const { camera, controls } = useThree();
    const {
      followedPlanetId,
      selectedPlanetId,
      setSelectedPlanetId,
      timeScale,
      isPaused,
    } = useContext(SimulationContext);

    const segments = 128;

    // Only load texture if path is provided
    const texture = texturePath ? useTexture(texturePath) : null;

    // Calculate scaled values based on real data and scaling constants
    const calculateOrbitSpeed = (orbitalPeriodHrs: number) => {
      if (orbitalPeriodHrs <= 0) return 0;
      return ((2 * Math.PI) / orbitalPeriodHrs) * timeScale;
    };

    // Calculate scaled distance from parent, adding the radii of the planet and its parent to prevent overlap
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

    // Calculate scaled planet radius, applying a boost for better visibility of smaller planets
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
      planetData.rotationPeriodHrs,
    );

    const axialTiltRad = ((planetData.axialTiltDeg ?? 0) * Math.PI) / 180;

    useEffect(() => {
      if (texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = 1;
      }
    }, [texture]);

    // Animate orbit and rotation
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

        // Check if orbital body is tidally locked to its parent
        // and apply rotation so the correct face is shown towards its parent body
        if (planetData.tidalLockRotationOffset && planetRef?.current) {
          planetRef.current.lookAt(parentPosition);
          planetRef.current.rotateY(planetData.tidalLockRotationOffset);
        } else {
          planetRef.current.rotation.y +=
            scaledPlanetRotation *
            SCALING_CONSTANTS.ROTATION_SPEED_FACTOR *
            planetData.rotationDirection;
        }
      }
    });

    // Handle camera following logic
    useFrame(() => {
      // Only follow if this planet is the followed one
      if (followedPlanetId.current === id && controls && planetRef.current) {
        const orbitControls = controls as OrbitControlsImpl;

        // Calculate how much the planet moved
        const delta = new THREE.Vector3().subVectors(
          planetRef.current.position,
          previousTarget.current,
        );

        // Move both camera and target by the same delta
        camera.position.add(delta);
        orbitControls.target.copy(planetRef.current.position);

        // Store current position for next frame
        previousTarget.current.copy(planetRef.current.position);

        orbitControls.update();
      }
    });

    // Function to focus camera on this planet
    const focusPlanet = () => {
      if (!planetRef.current || !controls) return;

      const orbitControls = controls as OrbitControlsImpl;
      followedPlanetId.current = id;

      orbitControls.target.copy(planetRef.current.position);
      const direction = new THREE.Vector3()
        .subVectors(camera.position, planetRef.current.position)
        .normalize();

      const distance = 5 * scaledPlanetRadius;
      camera.position
        .copy(planetRef.current.position)
        .add(direction.multiplyScalar(distance));

      previousTarget.current.copy(planetRef.current.position);
      orbitControls.update();
    };

    // If this planet is selected (e.g. from UI), focus on it
    useEffect(() => {
      if (selectedPlanetId === id) {
        focusPlanet();
      }
    }, [selectedPlanetId, id]);

    // Handle direct click on planet to toggle follow
    const handleClick = () => {
      if (followedPlanetId.current !== id) {
        focusPlanet();
        setSelectedPlanetId(id);
      } else {
        followedPlanetId.current = null;
        setSelectedPlanetId(null);
      }
    };

    return (
      <>
        <group
          ref={(node) => {
            planetRef.current = node as any;
            if (typeof ref === "function") {
              ref(node as any);
            } else if (ref) {
              ref.current = node as any;
            }
          }}
          position={[scaledDistance, 0, 0]}
        >
          <group>
            {planetData.isStar ? (
              <Sphere
                args={[scaledPlanetRadius, segments, segments]}
                onClick={handleClick}
              >
                <meshBasicMaterial map={texture} />
              </Sphere>
            ) : (
              <Sphere
                args={[scaledPlanetRadius, segments, segments]}
                castShadow // Cast shadows for planets, not for stars
                receiveShadow // Stars don't receive shadows
                onClick={handleClick}
              >
                <meshStandardMaterial
                  color={texture ? undefined : color}
                  map={texture}
                />
              </Sphere>
            )}

            {ringData && <PlanetRing ringData={ringData} />}

            {/* Emit light from stars */}
            {planetData.isStar && (
              <group>
                <pointLight
                  intensity={6}
                  distance={0}
                  position={[0, 0, 0]}
                  decay={0}
                  castShadow
                  shadow-mapSize-width={4096}
                  shadow-mapSize-height={4096}
                  shadow-camera-near={scaledPlanetRadius * 2}
                  shadow-camera-far={1000000}
                  shadow-bias={-0.0001}
                  shadow-normal-bias={0.1}
                  shadow-radius={1}
                />
                {/* Add a small sphere to visualize the light source */}
                <Sphere args={[0.1, 32, 32]} position={[0, 1, 0]}>
                  <meshBasicMaterial color="white" />
                </Sphere>
              </group>
            )}
          </group>
        </group>
        <OrbitCircle
          radius={scaledDistance}
          segments={64}
          parentRef={parentRef}
        />
      </>
    );
  },
);

export default AnimatedPlanet;
