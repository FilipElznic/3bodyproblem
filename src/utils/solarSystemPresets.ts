import { Body } from "../types";

// Scale: 1 pixel = 1 million km (approx)
// Mass scale: Earth = 10 mass units
// G is 100 in our engine

const SUN_MASS = 10000;
const EARTH_MASS = 10;
const MARS_MASS = 1;
const JUPITER_MASS = 500;

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
    icon: "☀️",
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
    icon: "⚪",
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
    icon: "🟡",
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
    icon: "🌍",
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
    icon: "🌑",
  },
  {
    id: 6,
    mass: MARS_MASS, // Mars
    position: { x: 230, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 230) },
    acceleration: { x: 0, y: 0 },
    radius: 5,
    color: "#E27B58",
    trail: [],
    icon: "🔴",
  },
  {
    id: 7,
    mass: 0.05, // Phobos
    position: { x: 236, y: 0 },
    velocity: {
      x: 0,
      y: Math.sqrt((100 * SUN_MASS) / 230) + Math.sqrt((100 * MARS_MASS) / 6),
    },
    acceleration: { x: 0, y: 0 },
    radius: 1.5,
    color: "#B87333",
    trail: [],
    icon: "🪨",
  },
  {
    id: 8,
    mass: 0.03, // Deimos
    position: { x: 242, y: 0 },
    velocity: {
      x: 0,
      y: Math.sqrt((100 * SUN_MASS) / 230) + Math.sqrt((100 * MARS_MASS) / 12),
    },
    acceleration: { x: 0, y: 0 },
    radius: 1,
    color: "#A58C6F",
    trail: [],
    icon: "🔹",
  },
  {
    id: 9,
    mass: JUPITER_MASS, // Jupiter
    position: { x: 400, y: 0 },
    velocity: { x: 0, y: Math.sqrt((100 * SUN_MASS) / 400) },
    acceleration: { x: 0, y: 0 },
    radius: 20,
    color: "#C88B3A",
    trail: [],
    icon: "🟠",
  },
  {
    id: 10,
    mass: 1.2, // Io
    position: { x: 420, y: 0 },
    velocity: {
      x: 0,
      y:
        Math.sqrt((100 * SUN_MASS) / 400) +
        Math.sqrt((100 * JUPITER_MASS) / 20),
    },
    acceleration: { x: 0, y: 0 },
    radius: 4,
    color: "#F5B971",
    trail: [],
    icon: "🟡",
  },
  {
    id: 11,
    mass: 0.9, // Europa
    position: { x: 435, y: 0 },
    velocity: {
      x: 0,
      y:
        Math.sqrt((100 * SUN_MASS) / 400) +
        Math.sqrt((100 * JUPITER_MASS) / 35),
    },
    acceleration: { x: 0, y: 0 },
    radius: 3.5,
    color: "#DDE6F2",
    trail: [],
    icon: "⚪",
  },
  {
    id: 12,
    mass: 1.4, // Ganymede
    position: { x: 450, y: 0 },
    velocity: {
      x: 0,
      y:
        Math.sqrt((100 * SUN_MASS) / 400) +
        Math.sqrt((100 * JUPITER_MASS) / 50),
    },
    acceleration: { x: 0, y: 0 },
    radius: 4.5,
    color: "#C5A27D",
    trail: [],
    icon: "🟤",
  },
  {
    id: 13,
    mass: 1.1, // Callisto
    position: { x: 470, y: 0 },
    velocity: {
      x: 0,
      y:
        Math.sqrt((100 * SUN_MASS) / 400) +
        Math.sqrt((100 * JUPITER_MASS) / 70),
    },
    acceleration: { x: 0, y: 0 },
    radius: 4,
    color: "#8F7B64",
    trail: [],
    icon: "🪐",
  },
];
