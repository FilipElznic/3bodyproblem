import { useState } from "react";
import { useSolarSystemSimulation } from "../hooks/useSolarSystemSimulation";
import { SimulationCanvas } from "../components/SimulationCanvas";
import { Controls } from "../components/Controls";
import { MissionReportButton } from "./MissionReportButton";

interface SolarSystemPageProps {
  onNavigate: (page: "classic" | "hierarchical" | "solar") => void;
}

export const SolarSystemPage = ({ onNavigate }: SolarSystemPageProps) => {
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
    mode,
    switchMode,
    analytics,
    telemetry,
    probeLog,
    launchProbe,
  } = useSolarSystemSimulation();
  const [probeAngle, setProbeAngle] = useState(45);
  const [probeSpeed, setProbeSpeed] = useState(12);

  return (
    <div className="flex flex-col">
      <div className="w-full relative h-[100vh] bg-black overflow-hidden retro-bg">
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
          loadPreset={() => {}}
          updateGravity={updateGravity}
          setTimeScale={setTimeScale}
        />

        {/* Navigation Panel */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-50 font-mono">
          <div className="bg-black/85 border border-green-500/40 p-4 w-72 shadow-[0_0_20px_rgba(51,255,0,0.25)]">
            <h3 className="text-sm uppercase tracking-widest text-green-500 border-b border-green-800/70 pb-2 mb-3">
              Mission Navigation
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate("classic")}
                className="px-4 py-2 bg-green-900/10 hover:bg-green-900/30 text-green-300 border border-green-500/50 text-xs uppercase tracking-[0.3em] transition-all"
              >
                Classic System
              </button>
              <button
                onClick={() => onNavigate("hierarchical")}
                className="px-4 py-2 bg-green-900/10 hover:bg-green-900/30 text-green-300 border border-green-500/50 text-xs uppercase tracking-[0.3em] transition-all"
              >
                Hierarchical
              </button>
            </div>
          </div>

          <div className="bg-black/85 border border-green-500/40 p-4 w-72 shadow-[0_0_15px_rgba(51,255,0,0.2)]">
            <h3 className="text-sm uppercase tracking-widest text-green-500 border-b border-green-800/70 pb-2 mb-3">
              Mode Selector
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchMode("stylized")}
                className={`px-3 py-2 text-xs uppercase tracking-[0.3em] border transition-all ${
                  mode === "stylized"
                    ? "bg-green-900/30 text-green-300 border-green-500"
                    : "bg-transparent text-green-700 border-green-800/80 hover:bg-green-900/20"
                }`}
              >
                Stylized
              </button>
              <button
                onClick={() => switchMode("realistic")}
                className={`px-3 py-2 text-xs uppercase tracking-[0.3em] border transition-all ${
                  mode === "realistic"
                    ? "bg-green-900/30 text-green-300 border-green-500"
                    : "bg-transparent text-green-700 border-green-800/80 hover:bg-green-900/20"
                }`}
              >
                Realistic
              </button>
            </div>
            <p className="mt-3 text-[0.65rem] text-green-600 leading-relaxed">
              Stylized exaggerates masses for dramatic arcs. Realistic swaps in
              solar mass ratios with tempered gravity.
            </p>
          </div>

          <div className="bg-black/85 border border-green-500/40 p-4 w-72 shadow-[0_0_15px_rgba(51,255,0,0.2)]">
            <h3 className="text-sm uppercase tracking-widest text-green-500 border-b border-green-800/70 pb-2 mb-3">
              Probe Control
            </h3>
            <label className="text-[0.65rem] uppercase tracking-[0.3em] text-green-600 flex justify-between">
              <span>Angle</span>
              <span className="text-green-300">{probeAngle.toFixed(0)}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={probeAngle}
              onChange={(e) => setProbeAngle(parseFloat(e.target.value))}
              className="w-full h-1 bg-green-900/50 accent-green-400 my-2"
            />
            <label className="text-[0.65rem] uppercase tracking-[0.3em] text-green-600 flex justify-between">
              <span>Speed</span>
              <span className="text-green-300">{probeSpeed.toFixed(1)} u</span>
            </label>
            <input
              type="range"
              min="2"
              max="40"
              step="0.5"
              value={probeSpeed}
              onChange={(e) => setProbeSpeed(parseFloat(e.target.value))}
              className="w-full h-1 bg-green-900/50 accent-green-400 my-2"
            />
            <button
              onClick={() => launchProbe(probeAngle, probeSpeed)}
              className="mt-3 w-full px-3 py-2 border border-green-500/70 bg-green-900/20 hover:bg-green-900/40 text-xs uppercase tracking-[0.35em] text-green-300 transition-all"
            >
              Launch Probe
            </button>
            <div className="mt-3 border-t border-green-900/60 pt-2">
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-green-700 mb-1">
                Recent launches
              </p>
              <ul className="space-y-1 max-h-20 overflow-y-auto pr-1 text-[0.6rem] text-green-400/80">
                {probeLog.length === 0 && (
                  <li className="text-green-700">No deployments yet.</li>
                )}
                {probeLog.map((entry) => (
                  <li key={entry} className="whitespace-nowrap">
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Info Panel */}
      </div>

      <div className="min-h-screen bg-black w-full relative retro-bg flex items-center justify-center p-8">
        <div className="retro-grid"></div>
        <div className="scanline"></div>
        <div className="crt-flicker"></div>

        <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Left Column: Mission Brief & Insights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/85 border border-green-500/50 p-6 shadow-[0_0_20px_rgba(51,255,0,0.1)]">
              <h2 className="text-xl font-bold uppercase tracking-widest text-green-400 border-b border-green-500/30 pb-4 mb-4 flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 animate-pulse"></span>
                Solar System Mission Brief
              </h2>
              <p className="text-green-300/80 leading-relaxed mb-6">
                Observe a retro control-room view of our solar neighbourhood.
                Bodies inherit emoji call-signs while orbits are solved through
                an n-body integrator. Toggle modes to compare educational
                scaling versus true mass ratios, or deploy research probes to
                explore transfer trajectories in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/10 border border-green-500/30 p-4">
                  <h3 className="uppercase tracking-[0.25em] text-green-500 text-xs mb-3 border-b border-green-500/20 pb-2">
                    Telemetry
                  </h3>
                  <ul className="space-y-2 text-xs text-green-300">
                    <li className="flex justify-between">
                      <span>Earth radius:</span>
                      <span>
                        {telemetry.earthDistance !== undefined
                          ? `${telemetry.earthDistance.toFixed(1)} px`
                          : "--"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Mars radius:</span>
                      <span>
                        {telemetry.marsDistance !== undefined
                          ? `${telemetry.marsDistance.toFixed(1)} px`
                          : "--"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Jupiter radius:</span>
                      <span>
                        {telemetry.jupiterDistance !== undefined
                          ? `${telemetry.jupiterDistance.toFixed(1)} px`
                          : "--"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total bodies:</span>
                      <span>{telemetry.bodyCount}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-900/10 border border-green-500/30 p-4">
                  <h3 className="uppercase tracking-[0.25em] text-green-500 text-xs mb-3 border-b border-green-500/20 pb-2">
                    System Insights
                  </h3>
                  <ul className="space-y-2 text-xs text-green-300">
                    {analytics.resonance && <li>{analytics.resonance}</li>}
                    {analytics.escapeVelocity && (
                      <li className="flex justify-between">
                        <span>Earth escape v:</span>
                        <span>≈ {analytics.escapeVelocity.toFixed(1)} u/s</span>
                      </li>
                    )}
                    <li className="flex justify-between">
                      <span>Mean orbital v:</span>
                      <span>
                        ≈ {(analytics.averageVelocity ?? 0).toFixed(1)} u/s
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/85 border border-green-500/50 p-6 shadow-[0_0_20px_rgba(51,255,0,0.1)]">
              <h3 className="text-sm uppercase tracking-widest text-green-500 border-b border-green-500/30 pb-3 mb-4">
                Orbital Dynamics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {analytics.orbitalInsights.map((insight) => (
                  <div
                    key={insight.label}
                    className="bg-green-900/5 border border-green-500/20 p-3 hover:bg-green-900/20 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-[0.2em] text-green-400 text-xs font-bold">
                        {insight.label}
                      </span>
                      <span className="text-green-300 text-lg font-mono">
                        {insight.velocity.toFixed(1)}{" "}
                        <span className="text-xs opacity-70">u/s</span>
                      </span>
                      <div className="text-[0.6rem] text-green-600 mt-1 uppercase tracking-[0.1em]">
                        Period: {insight.period.toFixed(1)} t
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Footer Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-black/85 border border-green-500/50 p-1 shadow-[0_0_20px_rgba(51,255,0,0.1)]">
              <MissionReportButton
                mode={mode}
                analytics={analytics}
                telemetry={telemetry}
                probeLog={probeLog}
              />
            </div>

            <div className="bg-black/85 border border-green-500/30 p-4 text-[0.65rem] text-green-500/60 leading-relaxed">
              <p className="mb-2 uppercase tracking-widest border-b border-green-500/20 pb-1">
                Technical Data
              </p>
              Pixel scale ≈ 1 px : 10^6 km. Realistic mode dampens G to 3 to
              preserve orbital periods at this scale.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
