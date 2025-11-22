import { Body } from "../types";

export const hierarchicalPreset: Body[] = [
  {
    id: 1,
    mass: 1000,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0 }, // Slow drift
    acceleration: { x: 0, y: 0 },
    radius: 30,
    color: "#FFD700", // Gold for the massive central body
    trail: [],
  },
  {
    id: 2,
    mass: 20,
    position: { x: 200, y: 0 },
    velocity: { x: 0, y: 22 },
    acceleration: { x: 0, y: 0 },
    radius: 8,
    color: "#00BFFF", // Deep sky blue
    trail: [],
  },
  {
    id: 3,
    mass: 20,
    position: { x: -200, y: 0 },
    velocity: { x: 0, y: -22 },
    acceleration: { x: 0, y: 0 },
    radius: 8,
    color: "#FF6B6B", // Coral red
    trail: [],
  },
];
