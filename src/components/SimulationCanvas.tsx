import React, { RefObject } from "react";

interface SimulationCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  canvasRef,
}) => {
  return <canvas ref={canvasRef} className="w-full h-full block bg-black" />;
};
