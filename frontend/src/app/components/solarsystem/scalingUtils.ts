const SYSTEM_SCALE = 0.00001;
const PLANET_RADIUS_SCALE_BOOST = 200;
const ROTATION_SPEED_FACTOR = 1;

export function calculateOrbitSpeed(
  orbitalPeriodHrs: number,
  timeScale: number
): number {
  if (orbitalPeriodHrs <= 0) return 0;
  return ((2 * Math.PI) / orbitalPeriodHrs) * timeScale;
}

export function scaleDistance(
  distanceInKm: number,
  parentRadiusKm?: number,
  childRadiusKm?: number
): number {
  let scaled = distanceInKm * SYSTEM_SCALE;
  
  if (parentRadiusKm && childRadiusKm) {
    scaled +=
      scalePlanetRadius(parentRadiusKm) +
      scalePlanetRadius(childRadiusKm);
  }
  
  return scaled;
}

export function scalePlanetRadius(
  radiusInKm: number,
  isStar: boolean = false
): number {
  if (isStar) return radiusInKm * SYSTEM_SCALE;
  return radiusInKm * SYSTEM_SCALE * PLANET_RADIUS_SCALE_BOOST;
}

export function scalePlanetRotation(
  rotationPeriodHrs: number,
  timeScale: number
): number {
  if (rotationPeriodHrs <= 0) return 0;
  return ((2 * Math.PI) / rotationPeriodHrs) * timeScale;
}

export const SCALING_CONSTANTS = {
  SYSTEM_SCALE,
  PLANET_RADIUS_SCALE_BOOST,
  ROTATION_SPEED_FACTOR,
};