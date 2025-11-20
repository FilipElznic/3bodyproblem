import React, { useRef, useEffect } from "react";

export const SimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};
