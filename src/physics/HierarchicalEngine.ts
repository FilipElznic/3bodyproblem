import { Body } from "../types";

export class HierarchicalEngine {
  public G: number = 100;
  private softening: number = 5;
  public bodies: Body[] = [];
  private stepCount: number = 0;

  constructor(initialBodies: Body[]) {
    this.bodies = JSON.parse(JSON.stringify(initialBodies));
  }

  private handleCollisions(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        const dx = bodyB.position.x - bodyA.position.x;
        const dy = bodyB.position.y - bodyA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const minDistance = bodyA.radius + bodyB.radius + 2; // Add small buffer

        if (distance < minDistance && distance > 0) {
          // Bodies are overlapping, push them apart
          const overlap = minDistance - distance;
          const nx = dx / distance; // Normalized direction
          const ny = dy / distance;

          // Handle static bodies
          if (bodyA.isStatic && bodyB.isStatic) {
            // Do nothing
          } else if (bodyA.isStatic) {
            bodyB.position.x += nx * overlap;
            bodyB.position.y += ny * overlap;
          } else if (bodyB.isStatic) {
            bodyA.position.x -= nx * overlap;
            bodyA.position.y -= ny * overlap;
          } else {
            // Separate bodies proportional to their masses (lighter body moves more)
            const totalMass = bodyA.mass + bodyB.mass;
            const moveA = (overlap * bodyB.mass) / totalMass;
            const moveB = (overlap * bodyA.mass) / totalMass;

            bodyA.position.x -= nx * moveA;
            bodyA.position.y -= ny * moveA;
            bodyB.position.x += nx * moveB;
            bodyB.position.y += ny * moveB;
          }

          // Calculate relative velocity along collision normal
          const dvx = bodyB.velocity.x - bodyA.velocity.x;
          const dvy = bodyB.velocity.y - bodyA.velocity.y;
          const relativeVelocity = dvx * nx + dvy * ny;

          // If bodies are moving toward each other, apply damping
          if (relativeVelocity < 0) {
            const restitution = 0.6; // Coefficient of restitution (0 = inelastic, 1 = elastic)

            if (bodyA.isStatic || bodyB.isStatic) {
              // Reflect velocity for the dynamic body
              if (!bodyA.isStatic) {
                // Treat bodyB as infinite mass
                const j = -(1 + restitution) * relativeVelocity * bodyA.mass;
                bodyA.velocity.x -= (j / bodyA.mass) * nx;
                bodyA.velocity.y -= (j / bodyA.mass) * ny;
              }
              if (!bodyB.isStatic) {
                // Treat bodyA as infinite mass
                const j = -(1 + restitution) * relativeVelocity * bodyB.mass;
                bodyB.velocity.x += (j / bodyB.mass) * nx;
                bodyB.velocity.y += (j / bodyB.mass) * ny;
              }
            } else {
              const impulse =
                (-(1 + restitution) * relativeVelocity) /
                (1 / bodyA.mass + 1 / bodyB.mass);

              bodyA.velocity.x -= (impulse / bodyA.mass) * nx;
              bodyA.velocity.y -= (impulse / bodyA.mass) * ny;
              bodyB.velocity.x += (impulse / bodyB.mass) * nx;
              bodyB.velocity.y += (impulse / bodyB.mass) * ny;
            }
          }
        }
      }
    }
  }

  public update(dt: number): void {
    const halfDt = 0.5 * dt;

    // Verlet integration step 1 & 2
    for (const body of this.bodies) {
      if (body.isStatic) continue;
      body.velocity.x += body.acceleration.x * halfDt;
      body.velocity.y += body.acceleration.y * halfDt;

      body.position.x += body.velocity.x * dt;
      body.position.y += body.velocity.y * dt;
    }

    // Update trails
    this.stepCount++;
    if (this.stepCount % 3 === 0) {
      for (const body of this.bodies) {
        if (body.trail.length > 80) body.trail.shift();
        body.trail.push({ x: body.position.x, y: body.position.y });
      }
    }

    // Calculate new accelerations
    this.calculateAccelerations();

    // Handle collisions to prevent bodies from overlapping
    this.handleCollisions();

    // Verlet integration step 4
    for (const body of this.bodies) {
      if (body.isStatic) continue;
      body.velocity.x += body.acceleration.x * halfDt;
      body.velocity.y += body.acceleration.y * halfDt;
    }

    // Don't recenter - let the big body dominate the system
  }

  private calculateAccelerations(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const bodyA = this.bodies[i];
      if (bodyA.isStatic) continue;

      bodyA.acceleration = { x: 0, y: 0 };

      for (let j = 0; j < this.bodies.length; j++) {
        if (i === j) continue;
        const bodyB = this.bodies[j];

        const dx = bodyB.position.x - bodyA.position.x;
        const dy = bodyB.position.y - bodyA.position.y;
        const distSq = dx * dx + dy * dy;

        const softenedDistSq = distSq + this.softening * this.softening;
        const denominator = Math.pow(softenedDistSq, 1.5);

        if (denominator === 0) continue;

        const ax = (this.G * bodyB.mass * dx) / denominator;
        const ay = (this.G * bodyB.mass * dy) / denominator;

        bodyA.acceleration.x += ax;
        bodyA.acceleration.y += ay;
      }
    }
  }

  public getTotalEnergy(): number {
    let kineticEnergy = 0;
    let potentialEnergy = 0;

    for (const body of this.bodies) {
      const speedSq = body.velocity.x ** 2 + body.velocity.y ** 2;
      kineticEnergy += 0.5 * body.mass * speedSq;
    }

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        const dx = bodyB.position.x - bodyA.position.x;
        const dy = bodyB.position.y - bodyA.position.y;
        const distance = Math.sqrt(
          dx * dx + dy * dy + this.softening * this.softening
        );

        potentialEnergy -= (this.G * bodyA.mass * bodyB.mass) / distance;
      }
    }

    return kineticEnergy + potentialEnergy;
  }

  public setGravity(g: number): void {
    this.G = g;
  }
}
