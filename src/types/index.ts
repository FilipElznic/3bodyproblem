export interface Vector2 {
  x: number;
  y: number;
}

export interface Body {
  id: number;
  mass: number;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  radius: number;
  color: string;
  trail: Vector2[];
  isStatic?: boolean;
  icon?: string;
  label?: string;
  note?: string;
  parentKey?: string;
  orbitRadius?: number;
}

export interface SimulationState {
  bodies: Body[];
  totalEnergy: number;
  isRunning: boolean;
  timeStep: number;
}
