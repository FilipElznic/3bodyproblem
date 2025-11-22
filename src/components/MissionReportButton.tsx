import { useState } from "react";
import { jsPDF } from "jspdf";
import {
  SolarMode,
  SolarAnalytics,
  Telemetry,
} from "../hooks/useSolarSystemSimulation";
import { SOLAR_SYSTEM_DOCUMENTATION } from "../utils/solarSystemPresets";

interface MissionReportButtonProps {
  mode: SolarMode;
  analytics: SolarAnalytics;
  telemetry: Telemetry;
  probeLog: string[];
}

const formatDistance = (distance?: number) =>
  distance !== undefined ? `${distance.toFixed(1)} px` : "Unavailable";

const formatVelocity = (velocity?: number) =>
  velocity !== undefined ? `${velocity.toFixed(1)} u/s` : "Unavailable";

export const MissionReportButton = ({
  mode,
  analytics,
  telemetry,
  probeLog,
}: MissionReportButtonProps) => {
  const [lastExport, setLastExport] = useState<string | null>(null);

  const handleGenerateReport = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    let cursorY = margin;

    const addSectionTitle = (title: string) => {
      doc.setFont("courier", "bold");
      doc.setFontSize(16);
      doc.text(title, margin, cursorY);
      cursorY += 20;
    };

    const addBodyText = (text: string) => {
      doc.setFont("courier", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, 540);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 14;
    };

    const addSpacer = (amount = 12) => {
      cursorY += amount;
    };

    doc.setFont("courier", "bold");
    doc.setFontSize(20);
    doc.text("Retro Mission Control", margin, cursorY);
    cursorY += 24;

    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    const timestamp = new Date().toLocaleString();
    doc.text(`Mission Report • ${timestamp}`, margin, cursorY);
    cursorY += 28;

    addSectionTitle("Simulation Overview");
    addBodyText(
      `Mode: ${
        mode === "stylized"
          ? "Stylized (dramatic scaling)"
          : "Realistic (solar masses)"
      }`
    );
    addBodyText(
      `Bodies simulated: ${telemetry.bodyCount}. Pixel scale ≈ 1 px : 10^6 km.`
    );
    addBodyText(
      SOLAR_SYSTEM_DOCUMENTATION.scaleExplanation.replace(/\s+/g, " ")
    );
    addSpacer();

    addSectionTitle("Orbital Analytics");
    analytics.orbitalInsights.forEach((insight) => {
      addBodyText(
        `${insight.label}: orbital velocity ${formatVelocity(
          insight.velocity
        )}, period ${insight.period.toFixed(1)} t`
      );
    });
    if (analytics.resonance) {
      addBodyText(analytics.resonance);
    }
    if (analytics.escapeVelocity) {
      addBodyText(
        `Earth escape velocity ≈ ${formatVelocity(analytics.escapeVelocity)}`
      );
    }
    addBodyText(
      `Mean orbital velocity ≈ ${formatVelocity(analytics.averageVelocity)}`
    );
    addSpacer();

    addSectionTitle("Telemetry Snapshots");
    addBodyText(
      `Earth orbital radius: ${formatDistance(telemetry.earthDistance)}`
    );
    addBodyText(
      `Mars orbital radius: ${formatDistance(telemetry.marsDistance)}`
    );
    addBodyText(
      `Jupiter orbital radius: ${formatDistance(telemetry.jupiterDistance)}`
    );
    addBodyText(SOLAR_SYSTEM_DOCUMENTATION.moons.replace(/\s+/g, " "));
    addSpacer();

    addSectionTitle("Probe Activity");
    if (probeLog.length === 0) {
      addBodyText("No probe deployments recorded this session.");
    } else {
      probeLog.forEach((entry) => addBodyText(entry));
    }
    addSpacer();

    addSectionTitle("Method Notes");
    addBodyText(SOLAR_SYSTEM_DOCUMENTATION.probe.replace(/\s+/g, " "));
    addBodyText(
      "Integrator: Symplectic Verlet with five micro-steps per frame, static barycentre for frame stability."
    );

    doc.save("mission-report.pdf");
    setLastExport(timestamp);
  };

  return (
    <div className="bg-green-900/20 border border-green-500/40 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-[0.25em] text-green-500">
          Mission Report
        </h3>
        {lastExport && (
          <span className="text-[0.55rem] text-green-300 uppercase tracking-[0.2em]">
            Exported {lastExport}
          </span>
        )}
      </div>
      <p className="text-[0.65rem] text-green-300 leading-relaxed">
        Generate a PDF paper summarising current analytics, telemetry, and probe
        events. Attach it to your submission for the Paper bonus.
      </p>
      <button
        onClick={handleGenerateReport}
        className="w-full px-3 py-2 border border-green-500/70 bg-green-900/30 hover:bg-green-900/50 text-xs uppercase tracking-[0.35em] text-green-200 transition-all"
      >
        Generate Mission Report PDF
      </button>
    </div>
  );
};
