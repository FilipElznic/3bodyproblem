import { useRef, useEffect, useState, useMemo } from "react";
import { HierarchicalEngine } from "../physics/HierarchicalEngine";
import {
  stylizedSolarSystem,
  realisticSolarSystem,
  createProbeBody,
} from "../utils/solarSystemPresets";
import { Body } from "../types";

export type SolarMode = "stylized" | "realistic";

const PRESETS: Record<SolarMode, typeof stylizedSolarSystem> = {
  stylized: stylizedSolarSystem,
  realistic: realisticSolarSystem,
};

export interface OrbitalInsight {
  label: string;
  period: number;
  velocity: number;
}

export interface SolarAnalytics {
  orbitalInsights: OrbitalInsight[];
  resonance?: string;
  escapeVelocity?: number;
  averageVelocity?: number;
}

export interface Telemetry {
  earthDistance?: number;
  marsDistance?: number;
  jupiterDistance?: number;
  bodyCount: number;
}

function magnitude({ x, y }: { x: number; y: number }): number {
  return Math.sqrt(x * x + y * y);
}

function deriveAnalytics(bodies: Body[], G: number): SolarAnalytics {
  const sun = bodies.find((body) => body.isStatic);
  const planets = bodies.filter(
    (body) => !body.isStatic && (!body.parentKey || body.parentKey === "sun")
  );

  const sortedPlanets = [...planets].sort(
    (a, b) => (a.orbitRadius ?? 0) - (b.orbitRadius ?? 0)
  );

  const orbitalInsights = sortedPlanets.map((body) => {
    const radius = Math.max(body.orbitRadius ?? magnitude(body.position), 1);
    const velocity = magnitude(body.velocity);
    const period = (2 * Math.PI * radius) / Math.max(velocity, 0.0001);
    return {
      label: body.label ?? `Body ${body.id}`,
      period,
      velocity,
    };
  });

  const earthBody = sortedPlanets.find((body) => body.label === "Earth");
  const earthInsight = orbitalInsights.find((entry) => entry.label === "Earth");
  const jupiterInsight = orbitalInsights.find(
    (entry) => entry.label === "Jupiter"
  );

  const resonance =
    earthInsight && jupiterInsight
      ? (() => {
          const ratio =
            jupiterInsight.period / Math.max(earthInsight.period, 1);
          return `Jupiter completes one orbit every ${ratio.toFixed(
            2
          )} Earth cycles.`;
        })()
      : undefined;

  const escapeVelocity =
    earthBody && sun && earthBody.orbitRadius
      ? Math.sqrt((2 * G * sun.mass) / Math.max(earthBody.orbitRadius, 1))
      : undefined;

  const averageVelocity =
    orbitalInsights.reduce((sum, entry) => sum + entry.velocity, 0) /
    Math.max(orbitalInsights.length, 1);

  return {
    orbitalInsights,
    resonance,
    escapeVelocity,
    averageVelocity,
  };
}

export const useSolarSystemSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HierarchicalEngine | null>(null);
  const animationRef = useRef<number | null>(null);
  const frameCounterRef = useRef(0);

  const [mode, setMode] = useState<SolarMode>("stylized");
  const [isRunning, setIsRunning] = useState(true);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [gravity, setGravity] = useState<number>(
    PRESETS.stylized.recommendedGravity
  );
  const [timeScale, setTimeScale] = useState(1);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    bodyCount: PRESETS.stylized.bodies.length,
  });
  const [probeLog, setProbeLog] = useState<string[]>([]);

  const analytics = useMemo(() => {
    const preset = PRESETS[mode];
    return deriveAnalytics(preset.bodies, preset.recommendedGravity);
  }, [mode]);

  useEffect(() => {
    const preset = PRESETS[mode];
    if (!engineRef.current) {
      engineRef.current = new HierarchicalEngine(preset.bodies);
      engineRef.current.setGravity(preset.recommendedGravity);
    } else {
      engineRef.current.loadBodies(preset.bodies);
      engineRef.current.setGravity(preset.recommendedGravity);
    }

    setGravity(preset.recommendedGravity);
    const freshEngine = new HierarchicalEngine(preset.bodies);
    freshEngine.setGravity(preset.recommendedGravity);
    setTotalEnergy(freshEngine.getTotalEnergy());
    setTelemetry({ bodyCount: preset.bodies.length });
    setProbeLog([]);
    frameCounterRef.current = 0;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;

    const render = () => {
      if (!isRunning || disposed) return;

      for (let i = 0; i < 5; i++) {
        engine.update(0.008 * timeScale);
      }

      setTotalEnergy(engine.getTotalEnergy());

      ctx.fillStyle = "rgba(5, 5, 5, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (const body of engine.bodies) {
        if (body.trail.length >= 2) {
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          const start = body.trail[0];
          ctx.moveTo(centerX + start.x, centerY + start.y);
          for (let i = 1; i < body.trail.length; i++) {
            const point = body.trail[i];
            ctx.lineTo(centerX + point.x, centerY + point.y);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        if (body.icon) {
          ctx.font = `${body.radius * 2.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            body.icon,
            centerX + body.position.x,
            centerY + body.position.y
          );
        } else {
          ctx.fillStyle = body.color;
          ctx.beginPath();
          ctx.arc(
            centerX + body.position.x,
            centerY + body.position.y,
            body.radius,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        if (body.mass > 1000) {
          ctx.shadowBlur = 50;
          ctx.shadowColor = body.color;
          if (body.icon) {
            ctx.fillText(
              body.icon,
              centerX + body.position.x,
              centerY + body.position.y
            );
            ctx.shadowBlur = 0;
          } else {
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      frameCounterRef.current += 1;
      if (frameCounterRef.current % 20 === 0) {
        const earth = engine.bodies.find((body) => body.label === "Earth");
        const mars = engine.bodies.find((body) => body.label === "Mars");
        const jupiter = engine.bodies.find((body) => body.label === "Jupiter");

        setTelemetry({
          earthDistance: earth ? magnitude(earth.position) : undefined,
          marsDistance: mars ? magnitude(mars.position) : undefined,
          jupiterDistance: jupiter ? magnitude(jupiter.position) : undefined,
          bodyCount: engine.bodies.length,
        });
      }

      animationRef.current = requestAnimationFrame(render);
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, timeScale]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const preset = PRESETS[mode];
    engine.loadBodies(preset.bodies);
    engine.setGravity(gravity);
    setTotalEnergy(engine.getTotalEnergy());
    setTelemetry({ bodyCount: preset.bodies.length });
    setProbeLog([]);
    frameCounterRef.current = 0;
  };

  const updateGravity = (newGravity: number) => {
    setGravity(newGravity);
    if (engineRef.current) {
      engineRef.current.setGravity(newGravity);
    }
  };

  const switchMode = (nextMode: SolarMode) => {
    setMode(nextMode);
  };

  const launchProbe = (angle: number, speed: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    const origin = engine.bodies.find((body) => body.label === "Earth");
    if (!origin) return;

    const probe = createProbeBody(
      { x: origin.position.x, y: origin.position.y },
      angle,
      speed
    );
    probe.velocity.x += origin.velocity.x;
    probe.velocity.y += origin.velocity.y;
    engine.addBody(probe);

    setProbeLog((prev) => [
      ...prev.slice(-4),
      `Probe ${probe.id} launched @ ${angle.toFixed(0)}° / ${speed.toFixed(
        1
      )}u`,
    ]);
  };

  return {
    canvasRef,
    isRunning,
    totalEnergy,
    gravity,
    timeScale,
    togglePlay,
    reset,
    updateGravity,
    setTimeScale,
    mode,
    switchMode,
    analytics,
    telemetry,
    probeLog,
    launchProbe,
  };
};
