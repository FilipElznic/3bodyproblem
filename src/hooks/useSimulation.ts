import { useState, useEffect, useRef, useCallback } from "react";
import { PhysicsEngine } from "../physics/Engine";
import { PRESETS } from "../utils/presets";

export const useSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [gravity, setGravity] = useState(100);
  const engineRef = useRef<PhysicsEngine>(
    new PhysicsEngine(PRESETS["figure8"])
  );
  const requestRef = useRef<number>();
  const [preset, setPreset] = useState<string>("figure8");

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Clear with trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Fade out trails
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2); // Center origin

      const bodies = engineRef.current.bodies;

      // Draw trails
      bodies.forEach((body) => {
        if (body.trail.length < 2) return;

        // Draw fading trail by drawing segments with increasing opacity
        for (let i = 0; i < body.trail.length - 1; i++) {
          ctx.beginPath();
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 2;
          // Opacity increases from 0 to 0.5 based on index
          ctx.globalAlpha = (i / body.trail.length) * 0.5;

          ctx.moveTo(body.trail[i].x, body.trail[i].y);
          ctx.lineTo(body.trail[i + 1].x, body.trail[i + 1].y);
          ctx.stroke();
        }
      });

      // Draw bodies
      ctx.globalAlpha = 1;
      bodies.forEach((body) => {
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = body.color;

        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      ctx.restore();
    },
    []
  );

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Physics Update
    // Use a fixed time step for stability, or delta time
    // For this simulation, fixed small steps are better for Verlet
    const dt = 0.5; // Speed up simulation
    engineRef.current.update(dt);

    // Render
    draw(ctx, canvas.width, canvas.height);

    // Update Energy UI every frame (or throttle if slow)
    setTotalEnergy(engineRef.current.getTotalEnergy());

    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, draw]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  // Initial draw
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Set canvas size to window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(ctx, canvas.width, canvas.height);
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isRunning && ctx) draw(ctx, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw, isRunning]); // Re-run if draw changes, but draw is stable

  const togglePlay = () => setIsRunning((prev) => !prev);

  const reset = () => {
    setIsRunning(false);
    engineRef.current.setBodies(PRESETS[preset]);
    // Trigger a redraw
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Clear completely
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        draw(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setTotalEnergy(engineRef.current.getTotalEnergy());
  };

  const loadPreset = (name: string) => {
    setPreset(name);
    setIsRunning(false);
    engineRef.current.setBodies(PRESETS[name]);
    // Redraw handled by reset logic or next frame
    setTimeout(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          draw(ctx, canvasRef.current.width, canvasRef.current.height);
        }
      }
      setTotalEnergy(engineRef.current.getTotalEnergy());
    }, 0);
  };

  const updateGravity = (newG: number) => {
    setGravity(newG);
    engineRef.current.G = newG;
  };

  return {
    canvasRef,
    isRunning,
    totalEnergy,
    gravity,
    togglePlay,
    reset,
    loadPreset,
    updateGravity,
  };
};
