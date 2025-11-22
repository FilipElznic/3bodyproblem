import { useRef, useEffect, useState } from "react";
import { HierarchicalEngine } from "../physics/HierarchicalEngine";
import { hierarchicalPreset } from "../utils/hierarchicalPresets";

export const useHierarchicalSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HierarchicalEngine | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [gravity, setGravity] = useState(100);
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new HierarchicalEngine(hierarchicalPreset);
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
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw trails
      for (const body of engine.bodies) {
        if (body.trail.length < 2) continue;

        ctx.strokeStyle = body.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;
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

        // Add glow effect for the massive body
        if (body.mass > 500) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = body.color;
          ctx.fill();
          ctx.shadowBlur = 0;
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
      engineRef.current = new HierarchicalEngine(hierarchicalPreset);
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
