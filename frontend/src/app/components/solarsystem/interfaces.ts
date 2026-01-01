import * as THREE from "three";

export const enum RotationDirection {
  CLOCKWISE = -1,
  COUNTERCLOCKWISE = 1,
}

export interface PlanetProps {
  id: string;
  parentRef?: React.RefObject<THREE.Mesh | null>;
  orbitalRadius: number;
  orbitSpeed: number;
  rotationSpeed?: number;
  rotationDirection?: RotationDirection;
  planetRadius?: number;
  isStar?: boolean;
  color?: string;
  texturePath?: string;
}

export interface PlanetData {
  name: string;
  distanceKm: number; // in km
  orbitalPeriodHrs: number; // in hours
  rotationPeriodHrs: number; // in hours
  rotationDirection: RotationDirection;
  radiusKm: number; // in km
  satellites?: Record<string, PlanetData>;
}