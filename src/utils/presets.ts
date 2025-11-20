import { Body } from "../types";

const COLORS = ["#FF4136", "#2ECC40", "#0074D9", "#FFDC00", "#B10DC9"];

export const PRESETS: Record<string, Body[]> = {
  figure8: [
    {
      id: 1,
      mass: 10,
      position: { x: 97.000436, y: -24.308753 },
      velocity: { x: 0.466203685, y: 0.43236573 },
      acceleration: { x: 0, y: 0 },
      radius: 15,
      color: COLORS[0],
      trail: [],
    },
    {
      id: 2,
      mass: 10,
      position: { x: -97.000436, y: 24.308753 },
      velocity: { x: 0.466203685, y: 0.43236573 },
      acceleration: { x: 0, y: 0 },
      radius: 15,
      color: COLORS[1],
      trail: [],
    },
    {
      id: 3,
      mass: 10,
      position: { x: 0, y: 0 },
      velocity: { x: -2 * 0.466203685, y: -2 * 0.43236573 },
      acceleration: { x: 0, y: 0 },
      radius: 15,
      color: COLORS[2],
      trail: [],
    },
  ],
  random: [
    {
      id: 1,
      mass: 20,
      position: { x: 100, y: 0 },
      velocity: { x: 0, y: 1 },
      acceleration: { x: 0, y: 0 },
      radius: 20,
      color: COLORS[0],
      trail: [],
    },
    {
      id: 2,
      mass: 15,
      position: { x: -100, y: 0 },
      velocity: { x: 0, y: -1 },
      acceleration: { x: 0, y: 0 },
      radius: 18,
      color: COLORS[1],
      trail: [],
    },
    {
      id: 3,
      mass: 10,
      position: { x: 0, y: 150 },
      velocity: { x: 1, y: 0 },
      acceleration: { x: 0, y: 0 },
      radius: 15,
      color: COLORS[2],
      trail: [],
    },
  ],
};
