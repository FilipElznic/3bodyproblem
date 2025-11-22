# Three Body Problem Simulator

Interactive retro-styled physics playground built with React, TypeScript, Vite, and Tailwind CSS. Explore three different gravitational scenarios, challenge numerical stability, and learn about the mathematics of orbital mechanics.

---

## 🚀 Features

- **Classic Three-Body Chaos** – Simulates equal-mass bodies using Newtonian gravity and Verlet integration. Includes curated presets (Figure-8, Lagrange, Euler, Broucke A, Chaotic Random) to explore known periodic orbits and chaotic trajectories.
- **Hierarchical System** – Models a dominant central mass with orbiting secondaries (star–planet–moon or binary systems). Demonstrates gravitational stability and energy conservation in layered systems.
- **Solar System Showcase** – Scaled-down Sun with inner planets, Mars and its moons (Phobos, Deimos), and Jupiter with Galilean moons (Io, Europa, Ganymede, Callisto). The Sun remains static; satellites follow scaled circular orbits. Icons replace colored bodies for clarity.
- **Retro CRT Aesthetic** – Custom CSS grid, scanlines, flicker, and monochrome UI inspired by vintage command centers. Fully responsive layout.
- **Interactive Controls** – Adjust gravitational constant (G), time scale, start/pause/reset, and load presets. Energy readouts update live.
- **TypeScript-First Architecture** – Strong typing for physics bodies, vector math, and custom hooks (`useSimulation`, `useHierarchicalSimulation`, `useSolarSystemSimulation`).
- **Physics Engine** – Verlet integrator with softening, collision handling, trail history, and custom hierarchical extensions.

---

## 🧠 Mathematics & Algorithms

| Module                              | Concepts                                                                                                      | Highlights                                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/physics/Engine.ts`             | Newton's law of universal gravitation, second-order differential equations, kinetic/potential energy tracking | Uses velocity-Verlet integration for better energy stability. Softening parameter avoids singularities. Collision resolution employs impulse-based restitution.                                |
| `src/physics/HierarchicalEngine.ts` | Same core gravitation with static-body support, hierarchical systems                                          | Adds `isStatic` flag, handles collisions with infinite-mass approximation, and prevents recentering to keep dominant body fixed.                                                               |
| `src/utils/presets.ts`              | Analytical solutions of the 3-body problem                                                                    | Encodes known stable patterns (Euler, Lagrange, Broucke) and chaotic setups.                                                                                                                   |
| `src/utils/solarSystemPresets.ts`   | Scaling real solar system data                                                                                | Mass ratios (Earth=10, Sun=10,000, Jupiter=500), orbital radii (1 px ≈ 1,000,000 km), circular velocity approximation `v = sqrt(GM/r)`; moons add nested orbits using superimposed velocities. |
| `src/hooks/useSimulation*.ts`       | Numerical integration loop, canvas rendering                                                                  | Runs fixed time steps, applies multi-substep updates, and stores historical positions for trails.                                                                                              |

### Gravity & Motion

Newton's law: `F = G * m1 * m2 / r^2`

Acceleration on body _i_: `a_i = Σ (G * m_j * (r_j - r_i) / |r_j - r_i|^3)`

Verlet integration (semi-implicit form):

```
v_{t+Δt/2} = v_t + a_t * Δt/2
x_{t+Δt}   = x_t + v_{t+Δt/2} * Δt
v_{t+Δt}   = v_{t+Δt/2} + a_{t+Δt} * Δt/2
```

Energy tracking:

```
K = Σ 0.5 * m_i * |v_i|^2
U = - Σ_{i<j} G * m_i * m_j / |r_i - r_j|
E_total = K + U
```

Trail rendering stores discretized positions (capped history) to visualize orbits.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS with custom retro effects (scanlines, grid, flicker)
- **State & Hooks:** Custom hooks for each simulation type
- **Canvas Rendering:** Raw 2D canvas API for performant drawing

---

## 📂 Key Files

```
src/
├── App.tsx                     # Router between simulation pages
├── components/
│   ├── ClassicPage.tsx         # Classic chaotic system view
│   ├── HierarchicalPage.tsx    # Stable multi-level system view
│   ├── SolarSystemPage.tsx     # Solar system + moons view
│   ├── Controls.tsx            # UI for simulation parameters
│   └── SimulationCanvas.tsx    # Canvas wrapper component
├── hooks/
│   ├── useSimulation.ts        # Classic simulation hook
│   ├── useHierarchicalSimulation.ts
│   └── useSolarSystemSimulation.ts
├── physics/
│   ├── Engine.ts               # General 3-body engine
│   └── HierarchicalEngine.ts   # Static body & hierarchical support
├── utils/
│   ├── presets.ts              # Classic presets
│   └── solarSystemPresets.ts   # Solar system data
└── index.css                   # Retro CRT styles
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` (default Vite port). Use the navigation panel to switch between simulations. Adjust gravity/time scale in the controls to observe different dynamics.

---

## 🧮 Experiment Ideas

1. **Modify Mass Ratios:** Adjust `solarSystemPresets.ts` to exaggerate planet masses and watch the system destabilize.
2. **Add New Presets:** Extend `utils/presets.ts` with custom initial conditions (e.g., figure-eight variants, choreographies).
3. **Change Softening:** Tweak `softening` in `Engine.ts` to study near-collision behaviour.
4. **Introduce Perturbations:** Randomize velocities slightly to observe sensitivity in chaotic systems.

---

## 📚 References

- S. H. Strogatz, _Nonlinear Dynamics and Chaos_ – accessible overview of chaotic systems.
- C. Marchal, _The Three-Body Problem_ – rigorous exploration of periodic three-body solutions.
- NASA Fact Sheets for planetary data.

---

Enjoy exploring the dance of gravity!
