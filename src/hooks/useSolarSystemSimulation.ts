import { useRef, useEffect, useState } from "react";
import { HierarchicalEngine } from "../physics/HierarchicalEngine";
import { solarSystemPreset } from "../utils/solarSystemPresets";

export const useSolarSystemSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HierarchicalEngine | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [gravity, setGravity] = useState(100);
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new HierarchicalEngine(solarSystemPreset);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (!isRunning) return;

      // Multiple substeps for stability
      for (let i = 0; i < 5; i++) {
        engine.update(0.008 * timeScale);
      }

      setTotalEnergy(engine.getTotalEnergy());

      // Clear canvas
      ctx.fillStyle = "rgba(5, 5, 5, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw trails
      for (const body of engine.bodies) {
        if (body.trail.length < 2) continue;

        ctx.strokeStyle = body.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();

        const firstPoint = body.trail[0];
        ctx.moveTo(centerX + firstPoint.x, centerY + firstPoint.y);

        for (let i = 1; i < body.trail.length; i++) {
          const point = body.trail[i];
          ctx.lineTo(centerX + point.x, centerY + point.y);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw bodies
      for (const body of engine.bodies) {
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

        // Add glow effect for the Sun
        if (body.mass > 1000) {
          ctx.shadowBlur = 50;
          ctx.shadowColor = body.color;
          // If it's an icon, we can't really fill() again to glow, but we can add shadow to the text
          if (body.icon) {
            ctx.shadowBlur = 50;
            ctx.shadowColor = body.color;
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

      animationRef.current = requestAnimationFrame(render);
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, timeScale]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    if (engineRef.current) {
      engineRef.current = new HierarchicalEngine(solarSystemPreset);
      engineRef.current.setGravity(gravity);
    }
  };

  const updateGravity = (newGravity: number) => {
    setGravity(newGravity);
    if (engineRef.current) {
      engineRef.current.setGravity(newGravity);
    }
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
  };
};
