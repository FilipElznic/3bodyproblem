import { Body } from "../types";

// Scale: 1 pixel = 1 million km (approx)
// Mass scale: Earth = 10 mass units
// G is 100 in our engine

const SUN_MASS = 10000;
const EARTH_MASS = 10;

export const solarSystemPreset: Body[] = [
  {
    id: 1,
    mass: SUN_MASS,
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    radius: 40,
    color: "#FFD700", // Sun
    trail: [],
    isStatic: true,
  },
  {
    id: 2,
    mass: 0.5, // Mercury
    position: { x: 60, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 60) },
    acceleration: { x: 0, y: 0 },
    radius: 4,
    color: "#A5A5A5",
    trail: [],
  },
  {
    id: 3,
    mass: 8, // Venus
    position: { x: 110, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 110) },
    acceleration: { x: 0, y: 0 },
    radius: 7,
    color: "#E3BB76",
    trail: [],
  },
  {
    id: 4,
    mass: EARTH_MASS, // Earth
    position: { x: 150, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 150) },
    acceleration: { x: 0, y: 0 },
    radius: 8,
    color: "#4B9CD3",
    trail: [],
  },
  {
    id: 5,
    mass: 0.1, // Moon
    position: { x: 158, y: 0 },
    velocity: {
      x: 0,
      y: Math.sqrt((100 * SUN_MASS) / 150) + Math.sqrt((100 * EARTH_MASS) / 8),
    },
    acceleration: { x: 0, y: 0 },
    radius: 2,
    color: "#DDDDDD",
    trail: [],
  },
  {
    id: 6,
    mass: 1, // Mars
    position: { x: 230, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 230) },
    acceleration: { x: 0, y: 0 },
    radius: 5,
    color: "#E27B58",
    trail: [],
  },
  {
    id: 7,
    mass: 3170, // Jupiter (scaled down for stability) -> 500
    position: { x: 400, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 400) },
    acceleration: { x: 0, y: 0 },
    radius: 20,
    color: "#C88B3A",
    trail: [],
  },
];
