import { useSimulation } from "./hooks/useSimulation";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { Controls } from "./components/Controls";

function App() {
  const {
    canvasRef,
    isRunning,
    totalEnergy,
    gravity,
    togglePlay,
    reset,
    loadPreset,
    updateGravity,
  } = useSimulation();

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <SimulationCanvas canvasRef={canvasRef} />
      <Controls
        isRunning={isRunning}
        totalEnergy={totalEnergy}
        gravity={gravity}
        togglePlay={togglePlay}
        reset={reset}
        loadPreset={loadPreset}
        updateGravity={updateGravity}
      />
    </div>
  );
}

export default App;
