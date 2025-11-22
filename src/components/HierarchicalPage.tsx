import { useHierarchicalSimulation } from "../hooks/useHierarchicalSimulation";
import { SimulationCanvas } from "../components/SimulationCanvas";
import { Controls } from "../components/Controls";

interface HierarchicalPageProps {
  onNavigate: (page: "classic" | "hierarchical" | "solar") => void;
}

export const HierarchicalPage = ({ onNavigate }: HierarchicalPageProps) => {
  const {
    canvasRef,
    isRunning,
    totalEnergy,
    gravity,
    timeScale,
    togglePlay,
    reset,
    updateGravity,
    setTimeScale,
  } = useHierarchicalSimulation();

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
        showPresets={false}
        togglePlay={togglePlay}
        reset={reset}
        loadPreset={() => {}} // No presets for hierarchical
        updateGravity={updateGravity}
        setTimeScale={setTimeScale}
      />

      {/* Navigation Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => onNavigate("classic")}
          className="px-6 py-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-500/50 rounded-none font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_10px_rgba(51,255,0,0.3)]"
        >
          Classic System
        </button>
        <button
          onClick={() => onNavigate("solar")}
          className="px-6 py-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-500/50 rounded-none font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_10px_rgba(51,255,0,0.3)]"
        >
          Solar System
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-8 right-4 bg-black/90 text-green-400 p-5 border border-green-500/50 max-w-sm shadow-[0_0_15px_rgba(51,255,0,0.1)] font-mono z-40">
        <h2 className="text-lg font-bold mb-2 uppercase tracking-widest border-b border-green-500/30 pb-2">
          Hierarchical System
        </h2>
        <p className="text-sm opacity-80 leading-relaxed mb-2">
          This simulation shows a stable "hierarchical" configuration. It
          consists of a massive central body (like a star) with two smaller
          bodies orbiting it.
        </p>
        <p className="text-sm opacity-80 leading-relaxed">
          This setup mimics real-world systems like a planet with a moon
          orbiting a star, or a binary star system. Unlike the chaotic "Classic"
          simulation, this system is generally stable over long periods.
        </p>
      </div>
    </div>
  );
};
