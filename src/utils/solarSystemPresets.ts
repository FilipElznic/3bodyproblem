import { Body, Vector2 } from "../types";

type Mode = "stylized" | "realistic";

interface SolarBlueprint {
  key: string;
  label: string;
  id: number;
  parent?: string;
  distance?: number;
  localDistance?: number;
  radius: number;
  icon: string;
  color: string;
  note?: string;
  massStylized: number;
  massRealistic: number;
  isStatic?: boolean;
}

const SOLAR_BLUEPRINT: SolarBlueprint[] = [
  {
    key: "sun",
    label: "Sun",
    id: 1,
    radius: 40,
    icon: "☀️",
    color: "#FFD700",
    note: "The fixed barycentre. We lock it to keep the frame stable.",
    massStylized: 10000,
    massRealistic: 332946,
    isStatic: true,
  },
  {
    key: "mercury",
    label: "Mercury",
    id: 2,
    parent: "sun",
    distance: 60,
    radius: 4,
    icon: "⚪",
    color: "#A5A5A5",
    note: "Mercury: fast and small, hugging the Sun.",
    massStylized: 0.5,
    massRealistic: 0.055,
  },
  {
    key: "venus",
    label: "Venus",
    id: 3,
    parent: "sun",
    distance: 110,
    radius: 7,
    icon: "🟡",
    color: "#E3BB76",
    note: "Venus with thick atmosphere and a slow day.",
    massStylized: 8,
    massRealistic: 0.815,
  },
  {
    key: "earth",
    label: "Earth",
    id: 4,
    parent: "sun",
    distance: 150,
    radius: 8,
    icon: "🌍",
    color: "#4B9CD3",
    note: "Earth: baseline mass in our scaling.",
    massStylized: 10,
    massRealistic: 1,
  },
  {
    key: "moon",
    label: "Moon",
    id: 5,
    parent: "earth",
    localDistance: 8,
    radius: 2,
    icon: "🌑",
    color: "#DDDDDD",
    note: "Earth's Moon with nested orbit.",
    massStylized: 0.1,
    massRealistic: 0.0123,
  },
  {
    key: "mars",
    label: "Mars",
    id: 6,
    parent: "sun",
    distance: 230,
    radius: 5,
    icon: "🔴",
    color: "#E27B58",
    note: "Mars: thin atmosphere and home to probes.",
    massStylized: 1,
    massRealistic: 0.107,
  },
  {
    key: "phobos",
    label: "Phobos",
    id: 7,
    parent: "mars",
    localDistance: 6,
    radius: 1.5,
    icon: "🪨",
    color: "#B87333",
    note: "Phobos: skims Mars every seven hours.",
    massStylized: 0.05,
    massRealistic: 0.00002,
  },
  {
    key: "deimos",
    label: "Deimos",
    id: 8,
    parent: "mars",
    localDistance: 12,
    radius: 1,
    icon: "🔹",
    color: "#A58C6F",
    note: "Deimos: far and faint companion of Mars.",
    massStylized: 0.03,
    massRealistic: 0.00001,
  },
  {
    key: "jupiter",
    label: "Jupiter",
    id: 9,
    parent: "sun",
    distance: 400,
    radius: 20,
    icon: "🟠",
    color: "#C88B3A",
    note: "Jupiter: gas giant with heavy gravity.",
    massStylized: 500,
    massRealistic: 317.8,
  },
  {
    key: "io",
    label: "Io",
    id: 10,
    parent: "jupiter",
    localDistance: 20,
    radius: 4,
    icon: "🟡",
    color: "#F5B971",
    note: "Io: volcanic powerhouse.",
    massStylized: 1.2,
    massRealistic: 0.015,
  },
  {
    key: "europa",
    label: "Europa",
    id: 11,
    parent: "jupiter",
    localDistance: 35,
    radius: 3.5,
    icon: "⚪",
    color: "#DDE6F2",
    note: "Europa: icy shell hiding an ocean.",
    massStylized: 0.9,
    massRealistic: 0.008,
  },
  {
    key: "ganymede",
    label: "Ganymede",
    id: 12,
    parent: "jupiter",
    localDistance: 50,
    radius: 4.5,
    icon: "🟤",
    color: "#C5A27D",
    note: "Ganymede: largest moon in the solar system.",
    massStylized: 1.4,
    massRealistic: 0.025,
  },
  {
    key: "callisto",
    label: "Callisto",
    id: 13,
    parent: "jupiter",
    localDistance: 70,
    radius: 4,
    icon: "🪐",
    color: "#8F7B64",
    note: "Callisto: heavily cratered outer moon.",
    massStylized: 1.1,
    massRealistic: 0.018,
  },
];

const G_STYLIZED = 100;
const G_REALISTIC = 3;

const blueprintByKey = new Map<string, SolarBlueprint>(
  SOLAR_BLUEPRINT.map((b) => [b.key, b])
);

interface BuildResult {
  bodies: Body[];
  recommendedGravity: number;
}

function computeOrbitVelocity(
  G: number,
  centralMass: number,
  radius: number
): number {
  if (!radius || radius <= 0) return 0;
  return Math.sqrt((G * centralMass) / radius);
}

function buildPreset(mode: Mode): BuildResult {
  const G = mode === "stylized" ? G_STYLIZED : G_REALISTIC;
  const sunBlueprint = blueprintByKey.get("sun");
  if (!sunBlueprint) throw new Error("Missing sun blueprint");

  const sunMass =
    mode === "stylized"
      ? sunBlueprint.massStylized
      : sunBlueprint.massRealistic;

  const bodies: Body[] = [];
  const computed = new Map<string, Body>();

  for (const blueprint of SOLAR_BLUEPRINT) {
    const mass =
      mode === "stylized" ? blueprint.massStylized : blueprint.massRealistic;

    const parentKey = blueprint.parent ?? "sun";
    const parentBody = computed.get(parentKey);
    const parentBlueprint = blueprintByKey.get(parentKey ?? "sun");

    let distanceFromSun = 0;
    if (!blueprint.parent || blueprint.parent === "sun") {
      distanceFromSun = blueprint.distance ?? 0;
    } else {
      const parentDistance =
        parentBody?.position.x ?? parentBlueprint?.distance ?? 0;
      distanceFromSun = parentDistance + (blueprint.localDistance ?? 0);
    }

    const position = { x: distanceFromSun, y: 0 };

    let velocityY = 0;
    if (!blueprint.isStatic) {
      if (!blueprint.parent || blueprint.parent === "sun") {
        velocityY = computeOrbitVelocity(
          G,
          sunMass,
          Math.max(distanceFromSun, 1)
        );
      } else if (parentBody && parentBlueprint) {
        const parentMass =
          mode === "stylized"
            ? parentBlueprint.massStylized
            : parentBlueprint.massRealistic;
        const parentDistance = Math.max(parentBody.position.x, 1);
        const planetVelocity = computeOrbitVelocity(G, sunMass, parentDistance);
        const moonVelocity = computeOrbitVelocity(
          G,
          parentMass,
          Math.max(blueprint.localDistance ?? 1, 1)
        );
        velocityY = planetVelocity + moonVelocity;
      }
    }

    const body: Body = {
      id: blueprint.id,
      mass,
      position,
      velocity: { x: 0, y: velocityY },
      acceleration: { x: 0, y: 0 },
      radius: blueprint.radius,
      color: blueprint.color,
      trail: [],
      isStatic: blueprint.isStatic,
      icon: blueprint.icon,
      label: blueprint.label,
      note: blueprint.note,
      parentKey: blueprint.parent,
      orbitRadius:
        !blueprint.parent || blueprint.parent === "sun"
          ? distanceFromSun
          : blueprint.localDistance ?? 0,
    };

    bodies.push(body);
    computed.set(blueprint.key, body);
  }

  return {
    bodies,
    recommendedGravity: G,
  };
}

export const stylizedSolarSystem = buildPreset("stylized");
export const realisticSolarSystem = buildPreset("realistic");

let probeSequence = 1000;

export function createProbeBody(
  origin: Vector2,
  angleDegrees: number,
  speed: number
): Body {
  const angle = (angleDegrees * Math.PI) / 180;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  probeSequence += 1;

  return {
    id: probeSequence,
    mass: 0.2,
    position: { x: origin.x, y: origin.y },
    velocity: { x: vx, y: vy },
    acceleration: { x: 0, y: 0 },
    radius: 2.5,
    color: "#64d2ff",
    icon: "▲",
    label: "probe",
    note: "User-deployed research probe.",
    trail: [],
  };
}

export const SOLAR_SYSTEM_DOCUMENTATION = {
  scaleExplanation:
    "Stylized mode uses friendly masses (Earth=10) for dramatic orbits. Realistic mode switches to solar system mass ratios with a tuned gravitational constant (G=3) to preserve orbital periods in our pixel scale (1px ≈ 1×10^6 km).",
  moons:
    "Mars and Jupiter receive their principal moons, each computed with nested circular velocities (v = sqrt(GM/r)) relative to their parent and the Sun.",
  probe:
    "Deploying a probe injects a lightweight body with vector-set velocity, ideal for experimenting with transfer orbits or resonances.",
};
