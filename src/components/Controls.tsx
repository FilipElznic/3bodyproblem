import React, { useState } from "react";

interface ControlsProps {
  isRunning: boolean;
  totalEnergy: number;
  gravity: number;
  timeScale?: number;
  showPresets?: boolean;
  togglePlay: () => void;
  reset: () => void;
  loadPreset: (name: string) => void;
  updateGravity: (g: number) => void;
  setTimeScale?: (s: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  totalEnergy,
  gravity,
  timeScale = 1,
  showPresets = true,
  togglePlay,
  reset,
  loadPreset,
  updateGravity,
  setTimeScale,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 font-mono">
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-start p-2 bg-black/90 text-green-400 border border-green-500/50 hover:bg-green-900/30 hover:shadow-[0_0_10px_rgba(51,255,0,0.4)] transition-all"
        title={isCollapsed ? "Show Controls" : "Hide Controls"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-6 h-6 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Main Panel */}
      <div
        className={`bg-black/90 p-6 text-green-400 border border-green-500/50 shadow-[0_0_20px_rgba(51,255,0,0.15)] w-80 transition-all duration-300 origin-top-left ${
          isCollapsed
            ? "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden p-0 border-0"
            : "opacity-100 scale-100"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest border-b border-green-500/30 pb-2">
          System Control
        </h2>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-green-600 text-sm uppercase tracking-wider">
              Status
            </span>
            <span
              className={`font-bold px-2 py-0.5 text-xs border ${
                isRunning
                  ? "bg-green-900/30 text-green-400 border-green-500"
                  : "bg-yellow-900/30 text-yellow-400 border-yellow-500"
              }`}
            >
              {isRunning ? "RUNNING" : "PAUSED"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-600 text-sm uppercase tracking-wider">
              Total Energy
            </span>
            <span className="text-sm text-green-300">
              {totalEnergy.toExponential(4)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={togglePlay}
            className={`flex-1 py-2 px-4 font-bold transition-all duration-200 border uppercase tracking-wider text-xs ${
              isRunning
                ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-500/50 hover:shadow-[0_0_10px_rgba(248,113,113,0.3)]"
                : "bg-green-900/20 hover:bg-green-900/40 text-green-400 border-green-500/50 hover:shadow-[0_0_10px_rgba(51,255,0,0.3)]"
            }`}
          >
            {isRunning ? "Halt" : "Execute"}
          </button>
          <button
            onClick={reset}
            className="flex-1 py-2 px-4 bg-transparent hover:bg-green-900/20 text-green-400 border border-green-500/50 uppercase tracking-wider text-xs font-bold transition-all duration-200 hover:shadow-[0_0_10px_rgba(51,255,0,0.2)]"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest border-b border-green-900/50 pb-1">
            Parameters
          </h3>

          {/* Gravity Control */}
          <div className="p-3 border border-green-900/50 bg-green-900/10">
            <label className="flex justify-between text-xs mb-2 text-green-500">
              <span>Gravity (G)</span>
              <span className="text-green-300">{gravity.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={gravity}
              onChange={(e) => updateGravity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-green-900/50 rounded-none appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Time Scale Control */}
          {setTimeScale && (
            <div className="p-3 border border-green-900/50 bg-green-900/10">
              <label className="flex justify-between text-xs mb-2 text-green-500">
                <span>Time Speed</span>
                <span className="text-green-300">{timeScale.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-green-900/50 rounded-none appearance-none cursor-pointer accent-green-500"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {showPresets && (
            <>
              <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest border-b border-green-900/50 pb-1">
                Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => loadPreset("figure8")}
                  className="py-2 px-3 bg-green-900/10 hover:bg-green-900/30 border border-green-500/30 hover:border-green-500/80 text-xs text-green-400 transition-all duration-200 hover:shadow-[0_0_5px_rgba(51,255,0,0.2)]"
                >
                  Figure-8
                </button>
                <button
                  onClick={() => loadPreset("lagrange")}
                  className="py-2 px-3 bg-green-900/10 hover:bg-green-900/30 border border-green-500/30 hover:border-green-500/80 text-xs text-green-400 transition-all duration-200 hover:shadow-[0_0_5px_rgba(51,255,0,0.2)]"
                >
                  Lagrange
                </button>
                <button
                  onClick={() => loadPreset("euler")}
                  className="py-2 px-3 bg-green-900/10 hover:bg-green-900/30 border border-green-500/30 hover:border-green-500/80 text-xs text-green-400 transition-all duration-200 hover:shadow-[0_0_5px_rgba(51,255,0,0.2)]"
                >
                  Euler
                </button>
                <button
                  onClick={() => loadPreset("broucke")}
                  className="py-2 px-3 bg-green-900/10 hover:bg-green-900/30 border border-green-500/30 hover:border-green-500/80 text-xs text-green-400 transition-all duration-200 hover:shadow-[0_0_5px_rgba(51,255,0,0.2)]"
                >
                  Broucke A
                </button>
                <button
                  onClick={() => loadPreset("random")}
                  className="col-span-2 py-2 px-3 bg-green-900/10 hover:bg-green-900/30 border border-green-500/30 hover:border-green-500/80 text-xs text-green-400 transition-all duration-200 hover:shadow-[0_0_5px_rgba(51,255,0,0.2)]"
                >
                  Chaotic Random
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-xs text-green-800 text-center uppercase tracking-widest">
          <p>Terminal v1.0.4</p>
        </div>
      </div>
    </div>
  );
};
