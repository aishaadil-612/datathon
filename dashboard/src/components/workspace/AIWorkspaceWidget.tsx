import React, { useState } from 'react';
import {
  Bot,
  Minimize2,
  Send,
  ShieldCheck,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockSampleQueries } from '../../mock/queries';
import { SampleQuery } from '../../types';

export const AIWorkspaceWidget: React.FC<{ isFullView?: boolean }> = ({ isFullView = false }) => {
  const {
    workspaceWidget,
    toggleWorkspaceWidget,
    language,
    setLanguage,
    setActiveView,
    setSelectedCaseId,
    openExplainability
  } = useDashboardStore();

  const t = translations[language];

  const [inputQuery, setInputQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<SampleQuery | null>(mockSampleQueries[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectQuery = (queryObj: SampleQuery) => {
    setIsLoading(true);
    setActiveQuery(null);

    setTimeout(() => {
      setActiveQuery(queryObj);
      setIsLoading(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setActiveQuery(null);

    const matched = mockSampleQueries.find((q) =>
      q.queryEn.toLowerCase().includes(inputQuery.toLowerCase()) ||
      inputQuery.toLowerCase().includes("vehicle") ||
      inputQuery.toLowerCase().includes("plate")
    ) || mockSampleQueries[0];

    setTimeout(() => {
      setActiveQuery({
        ...matched,
        queryEn: inputQuery,
        queryKn: inputQuery,
      });
      setIsLoading(false);
      setInputQuery('');
    }, 600);
  };

  const handleOpenReasoning = () => {
    if (!activeQuery) return;
    openExplainability({
      conclusion: language === 'en' ? activeQuery.responseEn : activeQuery.responseKn,
      confidence: activeQuery.confidence,
      reasoningSteps: activeQuery.reasoningSteps,
      evidenceSources: activeQuery.sourceIds.map((id) => ({
        id,
        label: id,
        type: "Case Intelligence Record"
      })),
      agentAttribution: {
        name: "Case Intelligence Agent",
        type: "NL2Cypher + RAG Engine",
        version: "v3.2",
        latencyMs: 520
      }
    });
  };

  if (!isFullView && workspaceWidget.isMinimized) {
    return (
      <button
        onClick={toggleWorkspaceWidget}
        className="fixed bottom-6 right-6 z-40 bg-[#14161C] hover:bg-[#1E222D] text-[#E8EAF0] p-4 rounded-full shadow-glow-teal border border-[#232631] flex items-center gap-2.5 transition-transform hover:scale-105 select-none"
      >
        <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
        <span className="text-xs font-mono font-bold">{t.navCopilot}</span>
      </button>
    );
  }

  return (
    <div
      className={
        isFullView
          ? "p-6 max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col select-none"
          : "fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-[#14161C] rounded-[24px] border border-[#232631] shadow-2xl flex flex-col overflow-hidden select-none"
      }
    >
      {/* Widget Header */}
      <div className="bg-[#0A0B0F] text-[#E8EAF0] p-4 flex items-center justify-between border-b border-[#232631] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-tight text-[#E8EAF0]">{t.copilotTitle}</h3>
            <p className="text-[10px] text-[#8A8F9C] font-mono">{t.copilotSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="px-2.5 py-1 bg-[#14161C] hover:bg-[#1E222D] rounded-full text-[10px] font-mono text-teal-400 border border-[#232631] flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>{language.toUpperCase()}</span>
          </button>

          {!isFullView && (
            <button
              onClick={toggleWorkspaceWidget}
              className="p-1 hover:bg-[#1E222D] rounded-full text-[#8A8F9C] hover:text-[#E8EAF0]"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0B0F]">
        {/* Suggested Queries Chips */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-[#8A8F9C] uppercase tracking-wider block">
            {t.suggestedQueries}
          </span>
          <div className="flex flex-col gap-1.5">
            {mockSampleQueries.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSelectQuery(q)}
                className="text-left p-3 rounded-xl bg-[#14161C] border border-[#232631] hover:border-teal-500/40 hover:bg-[#1E222D] text-xs text-[#E8EAF0] transition-all font-sans"
              >
                {language === 'en' ? q.queryEn : q.queryKn}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State Shimmer */}
        {isLoading && (
          <div className="p-4 rounded-2xl bg-[#14161C] border border-[#232631] space-y-3 animate-pulse">
            <div className="h-4 bg-[#232631] rounded w-3/4" />
            <div className="h-3 bg-[#232631] rounded w-full" />
            <div className="h-3 bg-[#232631] rounded w-5/6" />
          </div>
        )}

        {/* Active AI Response Card */}
        {activeQuery && !isLoading && (
          <div className="bg-[#14161C] p-4 rounded-2xl border border-[#232631] shadow-command space-y-3">
            <div className="flex items-center justify-between border-b border-[#232631] pb-2">
              <span className="text-[10px] font-mono text-[#8A8F9C] uppercase font-bold">
                Synthesized Copilot Output
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {activeQuery.confidence}% Confidence
              </span>
            </div>

            <p className="text-xs text-[#E8EAF0] leading-relaxed font-sans whitespace-pre-line">
              {language === 'en' ? activeQuery.responseEn : activeQuery.responseKn}
            </p>

            <div className="pt-2 border-t border-[#232631] space-y-1.5">
              <span className="text-[10px] font-mono text-[#8A8F9C] block">
                {t.sourcesTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeQuery.sourceIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (id.startsWith('FIR')) {
                        setSelectedCaseId(id);
                        setActiveView('search');
                      }
                    }}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0A0B0F] text-teal-400 border border-[#232631] hover:bg-[#1E222D]"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={handleOpenReasoning}
                className="text-teal-400 font-mono font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.viewReasoning}</span>
              </button>

              {activeQuery.targetView && (
                <button
                  onClick={() => setActiveView(activeQuery.targetView!)}
                  className="px-3 py-1 bg-teal-500 text-slate-950 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-teal-400 transition-colors"
                >
                  <span>
                    {activeQuery.targetView === 'network'
                      ? t.jumpToNetwork
                      : t.jumpToMap}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <form onSubmit={handleCustomSubmit} className="p-3 bg-[#0A0B0F] border-t border-[#232631] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.askAssistant}
          className="flex-1 px-4 py-2 bg-[#14161C] border border-[#232631] rounded-full text-xs text-[#E8EAF0] placeholder:text-[#8A8F9C]/60 focus:outline-none focus:border-teal-500 font-sans"
        />
        <button
          type="submit"
          className="w-9 h-9 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full flex items-center justify-center transition-colors shrink-0 font-bold shadow-glow-teal"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
