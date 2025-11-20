import { Body } from "../types";

export class PhysicsEngine {
  public G: number = 100; // Gravitational constant
  private softening: number = 5; // Softening parameter
  public bodies: Body[] = [];
  private stepCount: number = 0;

  constructor(initialBodies: Body[]) {
    this.bodies = JSON.parse(JSON.stringify(initialBodies));
  }

  public update(dt: number): void {
    // 1. First Verlet step: r(t+dt) = r(t) + v(t)dt + 0.5 * a(t) * dt^2
    //    and v(t+0.5dt) = v(t) + 0.5 * a(t) * dt

    const halfDt = 0.5 * dt;

    // Step 1 & 2
    for (const body of this.bodies) {
      // v(t + 0.5dt)
      body.velocity.x += body.acceleration.x * halfDt;
      body.velocity.y += body.acceleration.y * halfDt;

      // r(t + dt)
      body.position.x += body.velocity.x * dt;
      body.position.y += body.velocity.y * dt;
    }

    // Update trail every 3 ticks for performance and smoother visuals
    this.stepCount++;
    if (this.stepCount % 3 === 0) {
      for (const body of this.bodies) {
        if (body.trail.length > 50) body.trail.shift();
        body.trail.push({ x: body.position.x, y: body.position.y });
      }
    }

    // Step 3: Calculate new forces/accelerations a(t + dt)
    this.calculateAccelerations();

    // Step 4: v(t + dt)
    for (const body of this.bodies) {
      body.velocity.x += body.acceleration.x * halfDt;
      body.velocity.y += body.acceleration.y * halfDt;
    }

    // Correction: Keep Center of Mass at (0,0) to simulate "Space" reference frame
    this.recenterSystem();
  }

  private recenterSystem(): void {
    let totalMass = 0;
    let comX = 0;
    let comY = 0;
    let momX = 0;
    let momY = 0;

    for (const body of this.bodies) {
      totalMass += body.mass;
      comX += body.position.x * body.mass;
      comY += body.position.y * body.mass;
      momX += body.velocity.x * body.mass;
      momY += body.velocity.y * body.mass;
    }

    if (totalMass === 0) return;

    const centerX = comX / totalMass;
    const centerY = comY / totalMass;
    const velX = momX / totalMass;
    const velY = momY / totalMass;

    for (const body of this.bodies) {
      body.position.x -= centerX;
      body.position.y -= centerY;
      body.velocity.x -= velX;
      body.velocity.y -= velY;
    }
  }

  private calculateAccelerations(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const bodyA = this.bodies[i];
      bodyA.acceleration = { x: 0, y: 0 };

      for (let j = 0; j < this.bodies.length; j++) {
        if (i === j) continue;
        const bodyB = this.bodies[j];

        const dx = bodyB.position.x - bodyA.position.x;
        const dy = bodyB.position.y - bodyA.position.y;
        const distSq = dx * dx + dy * dy;

        // F = G * m1 * m2 / r^2
        // a = F / m1 = G * m2 / r^2
        // Vector form: a_vec = (G * m2 / r^3) * r_vec

        // Softening: (r^2 + epsilon^2)^(3/2)
        const softenedDistSq = distSq + this.softening * this.softening;
        const softenedDist = Math.sqrt(softenedDistSq);
        const factor =
          (this.G * bodyB.mass) / (softenedDist * softenedDist * softenedDist);

        bodyA.acceleration.x += dx * factor;
        bodyA.acceleration.y += dy * factor;
      }
    }
  }

  public getTotalEnergy(): number {
    let kinetic = 0;
    let potential = 0;

    for (let i = 0; i < this.bodies.length; i++) {
      const bodyA = this.bodies[i];
      const vSq =
        bodyA.velocity.x * bodyA.velocity.x +
        bodyA.velocity.y * bodyA.velocity.y;
      kinetic += 0.5 * bodyA.mass * vSq;

      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyB = this.bodies[j];
        const dx = bodyB.position.x - bodyA.position.x;
        const dy = bodyB.position.y - bodyA.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // U = -G * m1 * m2 / r
        if (dist > 0) {
          potential -= (this.G * bodyA.mass * bodyB.mass) / dist;
        }
      }
    }

    return kinetic + potential;
  }

  public setBodies(bodies: Body[]) {
    this.bodies = JSON.parse(JSON.stringify(bodies));
    this.calculateAccelerations(); // Initialize accelerations
  }
}
