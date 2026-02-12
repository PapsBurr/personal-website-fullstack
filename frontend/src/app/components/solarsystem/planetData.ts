import { PlanetData, RotationDirection } from "./interfaces";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Real data: distance is km from the sun
export const planetData: Record<string, PlanetData> = {
  sun: {
    name: "Sun",
    distanceKm: 0,
    orbitalPeriodHrs: 0,
    rotationPeriodHrs: 609.12,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 696340,
    axialTiltDeg: 7.25,
    isStar: true,
  },
  mercury: {
    name: "Mercury",
    distanceKm: 57909050,
    orbitalPeriodHrs: 2111.28,
    rotationPeriodHrs: 1407.6,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 2439.7,
    axialTiltDeg: 0.03,
  },
  venus: {
    name: "Venus",
    distanceKm: 108208000,
    orbitalPeriodHrs: 5392.8,
    rotationPeriodHrs: 5832.5,
    rotationDirection: RotationDirection.CLOCKWISE,
    radiusKm: 6051.8,
    axialTiltDeg: 2.64,
  },
  earth: {
    name: "Earth",
    distanceKm: 149598023,
    orbitalPeriodHrs: 8766.24,
    rotationPeriodHrs: 23.93,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 6371,
    axialTiltDeg: 23.44,
    satellites: {
      moon: {
        name: "Moon",
        distanceKm: 384400,
        orbitalPeriodHrs: 655.2,
        rotationPeriodHrs: 655.2,
        rotationDirection: RotationDirection.COUNTERCLOCKWISE,
        radiusKm: 1737.1,
        axialTiltDeg: 6.68,
        tidalLockRotationOffset: degToRad(-85), // Apply a rotation offset so the correct face of the moon is shown towards Earth
      },
    },
  },
  mars: {
    name: "Mars",
    distanceKm: 227939366,
    orbitalPeriodHrs: 16488,
    rotationPeriodHrs: 24.62,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 3389.5,
    axialTiltDeg: 25.19,
  },
  ceres: {
    name: "Ceres",
    distanceKm: 413690250,
    orbitalPeriodHrs: 40320,
    rotationPeriodHrs: 9.07,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 473,
    axialTiltDeg: 4,
  },
  jupiter: {
    name: "Jupiter",
    distanceKm: 778479000,
    orbitalPeriodHrs: 103944,
    rotationPeriodHrs: 9.93,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 69911,
    axialTiltDeg: 3.13,
  },
  saturn: {
    name: "Saturn",
    distanceKm: 1432000000,
    orbitalPeriodHrs: 257928,
    rotationPeriodHrs: 10.56,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 58232,
    axialTiltDeg: 26.73,
    ring: {
      innerRadiusKm: 74600,
      outerRadiusKm: 136780,
      texturePath: "/2k_saturn_ring_alpha.png",
    }
  },
  uranus: {
    name: "Uranus",
    distanceKm: 2867000000,
    orbitalPeriodHrs: 734136,
    rotationPeriodHrs: 17.24,
    rotationDirection: RotationDirection.CLOCKWISE,
    radiusKm: 25362,
    axialTiltDeg: 82.23,
  },
  neptune: {
    name: "Neptune",
    distanceKm: 4515000000,
    orbitalPeriodHrs: 1435200,
    rotationPeriodHrs: 16.11,
    rotationDirection: RotationDirection.COUNTERCLOCKWISE,
    radiusKm: 24622,
    axialTiltDeg: 28.32,
  },
  pluto: {
    name: "Pluto",
    distanceKm: 5906376272,
    orbitalPeriodHrs: 2170000,
    rotationPeriodHrs: 153.3,
    rotationDirection: RotationDirection.CLOCKWISE,
    radiusKm: 1188.3,
    axialTiltDeg: 57.47,
  }
};
