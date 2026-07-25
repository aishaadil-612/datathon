import React from 'react';
import { AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';

export const AlertTicker: React.FC = () => {
  const { language, openExplainability } = useDashboardStore();
  const t = translations[language];

  const handleAlertClick = () => {
    openExplainability({
      conclusion: "Hoodi-ORR Transit Corridor flagged for 88% predicted risk increase over next 30 days based on spatio-temporal clustering of commercial break-ins.",
      confidence: 88,
      reasoningSteps: [
        "1. Aggregated 90-day incident vectors across Whitefield, Marathahalli, and KR Puram.",
        "2. ST-DBSCAN detected spatial shift moving along Hoodi Industrial Corridor.",
        "3. Evaluated feature matrix in XGBoost temporal decay model.",
        "4. Flagged 12 un-monitored warehouse targets in predicted zone."
      ],
      evidenceSources: [
        { id: "hz-pred-1", label: "Hoodi Predicted Zone", type: "Forecast Polygon" },
        { id: "FIR-2026-0489", label: "FIR-2026-0489", type: "Burglary FIR" }
      ],
      agentAttribution: {
        name: "Analytics Agent",
        type: "ST-DBSCAN + XGBoost",
        version: "v4.1",
        latencyMs: 650
      }
    });
  };

  return (
    <div className="bg-[#14161C] border-b border-[#232631] px-4 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-mono text-[10px] font-bold tracking-wider shrink-0 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t.alertTickerTitle}</span>
        </div>
        
        <div className="truncate text-[#8A8F9C] font-sans flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-[#E8EAF0]">HOODI-ORR CORRIDOR:</span>
          <span className="truncate">Spatio-temporal model flags 88% rising risk probability for night-time warehouse break-ins over next 30 days.</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleAlertClick}
          className="text-amber-400 hover:text-amber-300 font-mono text-[11px] font-semibold flex items-center gap-1 hover:underline"
        >
          <span>{t.viewReasoning}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
