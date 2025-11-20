import React from "react";

interface ControlsProps {
  isRunning: boolean;
  totalEnergy: number;
  gravity: number;
  togglePlay: () => void;
  reset: () => void;
  loadPreset: (name: string) => void;
  updateGravity: (g: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  totalEnergy,
  gravity,
  togglePlay,
  reset,
  loadPreset,
  updateGravity,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-gray-900 p-6 rounded-lg bg-opacity-90 text-white border border-gray-700 shadow-xl w-80">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">
        Three Body Problem
      </h2>

      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Status:</span>
          <span
            className={`font-mono font-bold ${
              isRunning ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {isRunning ? "RUNNING" : "PAUSED"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Energy:</span>
          <span className="font-mono text-sm">
            {totalEnergy.toExponential(4)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={togglePlay}
          className={`flex-1 py-2 px-4 rounded font-bold transition-colors ${
            isRunning
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isRunning ? "Pause" : "Play"}
        </button>
        <button
          onClick={reset}
          className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-bold transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Parameters
        </h3>
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span>Gravity (G)</span>
            <span>{gravity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={gravity}
            onChange={(e) => updateGravity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Presets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => loadPreset("figure8")}
            className="py-2 px-3 bg-blue-900/50 hover:bg-blue-800 border border-blue-800 rounded text-sm transition-colors"
          >
            Figure-8
          </button>
          <button
            onClick={() => loadPreset("random")}
            className="py-2 px-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-800 rounded text-sm transition-colors"
          >
            Chaotic
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Use mouse to pan/zoom (coming soon)</p>
      </div>
    </div>
  );
};
