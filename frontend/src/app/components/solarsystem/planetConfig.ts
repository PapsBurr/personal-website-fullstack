import { planetData } from "./planetData";
import { PlanetProps } from "./interfaces";

type PlanetConfigItem = Omit<PlanetProps, "parentRef"> & {
  parentId?: string;
  hasSatellites?: boolean;
};

export const planetsConfig: PlanetConfigItem[] = [
  {
    id: "sun",
    hasSatellites: true,
    planetData: planetData.sun,
    texturePath: "/2k_sun.jpg",
  },
  {
    id: "mercury",
    parentId: "sun",
    planetData: planetData.mercury,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_mercury.jpg",
  },
  {
    id: "venus",
    parentId: "sun",
    planetData: planetData.venus,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_venus_atmosphere.jpg",
  },
  {
    id: "earth",
    hasSatellites: true,
    parentId: "sun",
    planetData: planetData.earth,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_earth_daymap.jpg",
  },
  {
    id: "moon",
    parentId: "earth",
    planetData: planetData.earth.satellites!.moon,
    parentPlanetData: planetData.earth,
    texturePath: "/2k_moon.jpg",
  },
  {
    id: "mars",
    parentId: "sun",
    planetData: planetData.mars,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_mars.jpg",
  },
  {
    id: "jupiter",
    parentId: "sun",
    planetData: planetData.jupiter,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_jupiter.jpg",
  },
  {
    id: "saturn",
    parentId: "sun",
    planetData: planetData.saturn,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_saturn.jpg",
    ringData: planetData.saturn.ring,
  },
  {
    id: "uranus",
    parentId: "sun",
    planetData: planetData.uranus,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_uranus.jpg",
  },
  {
    id: "neptune",
    parentId: "sun",
    planetData: planetData.neptune,
    parentPlanetData: planetData.sun,
    texturePath: "/2k_neptune.jpg",
  },
];