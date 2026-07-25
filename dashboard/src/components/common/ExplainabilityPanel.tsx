import React from 'react';
import { X, ShieldCheck, Cpu, Database, Link2, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';

export const ExplainabilityPanel: React.FC = () => {
  const { explainabilityDrawer, closeExplainability, language, setActiveView, setSelectedCaseId } = useDashboardStore();
  const { isOpen, data } = explainabilityDrawer;
  const t = translations[language];

  if (!isOpen || !data) return null;

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500/30', light: 'bg-teal-500/10' };
    if (score >= 50) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', light: 'bg-amber-500/10' };
    return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30', light: 'bg-rose-500/10' };
  };

  const colors = getConfidenceColor(data.confidence);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end transition-opacity animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-[#14161C] h-full shadow-2xl flex flex-col border-l border-[#232631] overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-[#0A0B0F] text-[#E8EAF0] px-6 py-4 flex items-center justify-between border-b border-[#232631]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-[#E8EAF0]">{t.expTitle}</h2>
              <p className="text-xs text-[#8A8F9C] font-mono">CrimeLens Explainable AI Engine v3.2</p>
            </div>
          </div>
          <button
            onClick={closeExplainability}
            className="w-8 h-8 rounded-full bg-[#1E222D] text-[#8A8F9C] hover:text-[#E8EAF0] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0A0B0F]">
          {/* Section 1: Conclusion */}
          <div className="bg-[#14161C] p-5 rounded-[20px] border border-[#232631] shadow-command space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>{t.expConclusion}</span>
            </div>
            <p className="text-[#E8EAF0] font-medium text-sm leading-relaxed">
              {data.conclusion}
            </p>
          </div>

          {/* Section 2: Confidence Score Gauge */}
          <div className={`p-5 rounded-[20px] border ${colors.border} ${colors.light} shadow-command space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9C]">
                {t.expConfidence}
              </span>
              <span className={`text-xl font-extrabold ${colors.text} font-mono`}>
                {data.confidence}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#0A0B0F] h-2.5 rounded-full overflow-hidden border border-[#232631]">
              <div
                className={`h-full ${colors.bg} transition-all duration-500 rounded-full`}
                style={{ width: `${data.confidence}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#8A8F9C]">
              <span>Low (&lt;50%)</span>
              <span>Moderate (50-80%)</span>
              <span className="font-semibold text-teal-400">High (&gt;80%)</span>
            </div>
          </div>

          {/* Section 3: Numbered Reasoning Trail */}
          <div className="bg-[#14161C] p-5 rounded-[20px] border border-[#232631] shadow-command space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A8F9C] uppercase tracking-wider font-mono">
              <ChevronRight className="w-4 h-4 text-teal-400" />
              <span>{t.expReasoning}</span>
            </div>
            <div className="space-y-3 pt-1">
              {data.reasoningSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs text-[#E8EAF0] bg-[#0A0B0F] p-3.5 rounded-xl border border-[#232631]">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-teal-500/30">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed text-[#E8EAF0]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Evidence Sources Chips */}
          <div className="bg-[#14161C] p-5 rounded-[20px] border border-[#232631] shadow-command space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <Link2 className="w-4 h-4 text-amber-400" />
              <span>{t.expSources}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.evidenceSources.map((source, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (source.id.startsWith('FIR')) {
                      setSelectedCaseId(source.id);
                      setActiveView('search');
                      closeExplainability();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#0A0B0F] text-teal-400 border border-[#232631] hover:bg-[#1E222D] transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>{source.label}</span>
                  <span className="text-[10px] text-[#8A8F9C] font-normal">({source.type})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Agent & Tool Attribution */}
          <div className="bg-[#0A0B0F] text-[#E8EAF0] p-5 rounded-[20px] border border-[#232631] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8A8F9C]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span>{t.expAgent}</span>
              </div>
              <span className="text-teal-400 font-mono text-[11px]">{data.agentAttribution.latencyMs}ms execution</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-[#14161C] p-3 rounded-xl border border-[#232631]">
                <span className="text-[#8A8F9C] block text-[10px] uppercase font-mono">Agent Name</span>
                <span className="font-bold text-[#E8EAF0]">{data.agentAttribution.name}</span>
              </div>
              <div className="bg-[#14161C] p-3 rounded-xl border border-[#232631]">
                <span className="text-[#8A8F9C] block text-[10px] uppercase font-mono">Sub-System</span>
                <span className="font-semibold text-teal-400 font-mono">{data.agentAttribution.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0A0B0F] border-t border-[#232631] flex justify-between items-center text-xs text-[#8A8F9C] font-mono">
          <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Audit Ledger Verified</span>
          </div>
          <button
            onClick={closeExplainability}
            className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-full font-sans transition-colors shadow-glow-teal"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
