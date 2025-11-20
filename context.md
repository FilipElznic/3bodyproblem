cat << 'EOF' > three_body_prompt.md

# Role & Context

You are an expert Physics Simulation Engineer. Build a "Three Body Problem" simulation using **React, TypeScript, Vite, and Tailwind CSS**.

# Constraints

1. **NO External Engines:** Do not use Phaser, Three.js, etc. Write physics from scratch.
2. **Performance:** Use HTML5 Canvas API (NOT React DOM elements) for 60FPS rendering.
3. **Architecture:** Decouple the physics loop (in a class/hook) from the React render cycle.

# Math Formulas (LaTeX)

Implement these exact physics rules:

**1. Gravitational Force:**
The force $\vec{F}_{ij}$ on body $i$ from body $j$ is:
$$ \vec{F}\_{ij} = G \frac{m_i m_j}{|\vec{r}\_j - \vec{r}\_i|^3} (\vec{r}\_j - \vec{r}\_i) $$

**2. Acceleration:**
Sum the forces to find acceleration:
$$ \vec{a}\_1 = G m_2 \frac{\vec{r}\_2 - \vec{r}\_1}{|\vec{r}\_2 - \vec{r}\_1|^3} + G m_3 \frac{\vec{r}\_3 - \vec{r}\_1}{|\vec{r}\_3 - \vec{r}\_1|^3} $$

**3. CRITICAL: Handling Singularities:**
As distance $|\vec{r}_j - \vec{r}_i| \to 0$, acceleration explodes. To prevent this numerical instability:

- Implement a small "softening parameter" $\epsilon$ (epsilon) in the denominator OR clamp the minimum distance so bodies bounce or merge rather than ejecting at infinite speed.

**4. Numerical Integration (Velocity Verlet):**
Do NOT use Euler (it drifts). Use Velocity Verlet:
$$ \vec{r}_{t+\Delta t} = \vec{r}\_t + \vec{v}\_t \Delta t + 0.5 \vec{a}\_t \Delta t^2 $$
$$ \vec{v}_{t+\Delta t} = \vec{v}_t + 0.5 (\vec{a}\_t + \vec{a}_{t+\Delta t}) \Delta t $$

# Features

- **Visuals:** Glowing circles (mass proportional to radius), fading trails for orbit history.
- **Metrics:** Calculate and display Total Energy $E$ to prove stability (should remain constant):
  $$ E = 0.5 \sum m v^2 - \sum (G m*i m_j / r*{ij}) $$
- **Controls:** Play/Pause, Reset, Sliders for Mass/Gravity.
- **Presets:** "Figure-8 Orbit" (stable) and "Chaotic" (random).
  EOF
