import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RingData } from "./interfaces";
import { SCALING_CONSTANTS } from "./scalingUtils";

type PlanetRingProps = {
  ringData: RingData;
};

export default function PlanetRing({ ringData }: PlanetRingProps) {
  const texture = ringData.texturePath
    ? useTexture(ringData.texturePath)
    : null;

  const innerRadius =
    ringData.innerRadiusKm *
    SCALING_CONSTANTS.SYSTEM_SCALE *
    SCALING_CONSTANTS.PLANET_RADIUS_SCALE_BOOST;
  const outerRadius =
    ringData.outerRadiusKm *
    SCALING_CONSTANTS.SYSTEM_SCALE *
    SCALING_CONSTANTS.PLANET_RADIUS_SCALE_BOOST;

  // Create ring geometry with proper UV mapping
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

    // Get vertex positions and UV attributes
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    const v3 = new THREE.Vector3();

    // Remap UVs based on distance from center
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const distance = v3.length(); // Distance from origin

      // Map U coordinate: 0 at inner radius, 1 at outer radius
      // This stretches your horizontal-line texture radially
      const u = (distance - innerRadius) / (outerRadius - innerRadius);

      // V coordinate can stay as is (goes around the circle)
      // Or set to a constant if you want uniform mapping
      const v = 1; // You can experiment with this

      uv.setXY(i, u, v);
    }

    uv.needsUpdate = true;
    return geometry;
  }, [innerRadius, outerRadius]);

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.ClampToEdgeWrapping; // Don't repeat radially
      texture.wrapT = THREE.RepeatWrapping; // Wrap around circumference

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} geometry={ringGeometry}>
      <meshStandardMaterial
        map={texture}
        color={texture ? undefined : ringData.color || "#C9A86A"}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.9}
        alphaTest={0.1}
      />
    </mesh>
  );
}
