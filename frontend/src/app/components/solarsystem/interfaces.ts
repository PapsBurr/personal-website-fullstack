import * as THREE from "three";

export const enum RotationDirection {
  CLOCKWISE = -1,
  COUNTERCLOCKWISE = 1,
}

export type PlanetProps = {
  id: string;
  parentRef?: React.RefObject<THREE.Mesh | null>;
  planetData: PlanetData;
  parentPlanetData?: PlanetData;
  color?: string;
  texturePath?: string;
}

export type PlanetData = {
  name: string;
  distanceKm: number;
  orbitalPeriodHrs: number;
  rotationPeriodHrs: number;
  rotationDirection: RotationDirection;
  radiusKm: number;
  isStar?: boolean;
  satellites?: Record<string, PlanetData>;
}