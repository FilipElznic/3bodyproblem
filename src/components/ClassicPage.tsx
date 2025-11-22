import { useSimulation } from "../hooks/useSimulation";
import { SimulationCanvas } from "../components/SimulationCanvas";
import { Controls } from "../components/Controls";

interface ClassicPageProps {
  onNavigate: (page: "classic" | "hierarchical" | "solar") => void;
}

export const ClassicPage = ({ onNavigate }: ClassicPageProps) => {
  const {
    canvasRef,
    isRunning,
    totalEnergy,
    gravity,
    timeScale,
    togglePlay,
    reset,
    loadPreset,
    updateGravity,
    setTimeScale,
  } = useSimulation();

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden retro-bg">
      <div className="retro-grid"></div>
      <div className="scanline"></div>
      <div className="crt-flicker"></div>

      <SimulationCanvas canvasRef={canvasRef} />
      <Controls
        isRunning={isRunning}
        totalEnergy={totalEnergy}
        gravity={gravity}
        timeScale={timeScale}
        togglePlay={togglePlay}
        reset={reset}
        loadPreset={loadPreset}
        updateGravity={updateGravity}
        setTimeScale={setTimeScale}
      />

      {/* Navigation Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => onNavigate("hierarchical")}
          className="px-6 py-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-500/50 rounded-none font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_10px_rgba(51,255,0,0.3)]"
        >
          Hierarchical
        </button>
        <button
          onClick={() => onNavigate("solar")}
          className="px-6 py-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-500/50 rounded-none font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_10px_rgba(51,255,0,0.3)]"
        >
          Solar System
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-8 left-4 bg-black/80 text-green-400 p-5 border border-green-500/50 max-w-xs shadow-[0_0_15px_rgba(51,255,0,0.1)] font-mono">
        <h2 className="text-lg font-bold mb-2 uppercase tracking-widest border-b border-green-500/30 pb-2">
          Classic 3-Body
        </h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Three bodies of similar mass interacting gravitationally in chaotic
          motion. Small changes in initial conditions lead to vastly different
          outcomes.
        </p>
      </div>
    </div>
  );
};
