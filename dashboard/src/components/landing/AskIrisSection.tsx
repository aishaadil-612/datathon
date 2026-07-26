import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  Globe,
  ArrowRight,
  ShieldCheck,
  Bot,
  Database,
  Volume2,
  User,
  RotateCcw,
  ExternalLink,
  Activity,
  Layers,
  Cpu,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useIrisStore, CopilotResponse } from '../../store/useIrisStore';
import { useRouterStore } from '../../store/useRouterStore';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';

export const AskIrisSection: React.FC = () => {
  const { language, setLanguage, role, openExplainability, setSelectedCaseId, setSelectedNodeId } = useDashboardStore();
  const { setActiveView } = useRouterStore();
  const {
    currentPrompt,
    setCurrentPrompt,
    submitQuery,
    clearSession,
    isQueryLoading,
    history,
    activeResponse,
    setSelectedTrace
  } = useIrisStore();

  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    "Which cases in the last month share a vehicle plate or modus operandi?",
    "Show predicted rising-risk zones for Whitefield & Hoodi over next 30 days",
    "Trace shortest connection path for Vikram Singh across active FIRs",
    "Summarize serial burglary ring modus operandi and grinder tool evidence"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history, isQueryLoading]);

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceNotice(null);
    } else {
      setIsListening(true);
      setVoiceNotice("Listening... Say: 'Which cases share vehicle plate KA-03-MN-4921?'");
      setTimeout(() => {
        setCurrentPrompt("Which cases in the last month share a vehicle plate or modus operandi?");
        setIsListening(false);
        setVoiceNotice("Speech recognized in English / Kannada mode");
        setTimeout(() => setVoiceNotice(null), 2500);
      }, 2200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt.trim() || isQueryLoading) return;
    const promptToSubmit = currentPrompt;
    setCurrentPrompt('');
    await submitQuery(promptToSubmit, role);
  };

  const handleChipClick = async (queryText: string) => {
    setCurrentPrompt('');
    await submitQuery(queryText, role);
  };

  const handleSeeReasoning = (resp: CopilotResponse) => {
    setSelectedTrace(resp);
    openExplainability({
      conclusion: resp.response,
      confidence: resp.confidence,
      reasoningSteps: resp.reasoning_steps.map(s => `${s.title}: ${s.details}`),
      evidenceSources: resp.sources,
      agentAttribution: {
        name: "Chief Detective V. R. Rao",
        type: "IRIS Multi-Agent Copilot Suite",
        version: "v3.2",
        latencyMs: resp.executionTimeMs || 480
      }
    });
  };

  const handleSourceClick = (src: { id: string; label: string; type: string }) => {
    if (src.id.startsWith("FIR") || src.type.includes("FIR")) {
      setSelectedCaseId(src.id);
      setActiveView("search");
    } else if (src.id.startsWith("KA") || src.type.includes("ANPR") || src.type.includes("Vehicle")) {
      setSelectedNodeId(src.id);
      setActiveView("network");
    } else if (src.type.includes("Zone") || src.type.includes("Hotspot") || src.type.includes("Forecast")) {
      setActiveView("hotspots");
    } else if (src.type.includes("Evidence") || src.type.includes("FSL")) {
      setSelectedCaseId("FIR-2026-0489");
      setActiveView("timelines");
    } else {
      setActiveView("network");
    }
  };

  const isConversationActive = history.length > 0;

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0B0C0E] select-none overflow-x-hidden text-[#FFFFFF]">
      {/* Slow-Moving Particle Grid Canvas Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Floating Session Action Bar */}
      {isConversationActive && (
        <div className="relative z-20 flex items-center justify-end px-4 sm:px-6 pt-4 pb-2">
          <button
            onClick={() => {
              clearSession();
              setCurrentPrompt('');
            }}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="Start New Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 ${isConversationActive ? 'pt-6 pb-44' : 'py-12 my-auto'}`}>
        {!isConversationActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-center"
          >
            {/* Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14151B] border border-[#22242D] text-xs sm:text-sm font-mono font-semibold text-[#CBD5E1]">
                <Bot className="w-4 h-4 text-[#CCFF00]" />
                <span>Investigation Intelligence Copilot (IRIS)</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
                Ask <span className="text-[#CCFF00] font-black">IRIS</span> Anything About Your Cases
              </h1>

              <p className="text-sm sm:text-lg text-[#CBD5E1] font-medium max-w-2xl mx-auto leading-relaxed font-sans">
                IRIS reasons with the accumulated experience of a 26-year veteran detective who has solved 20,000+ cases.
              </p>
            </div>

            {/* Central Search Bar Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative flex items-center shadow-2xl">
                <Search className="w-5 h-5 absolute left-5 text-[#CBD5E1] pointer-events-none" />
                
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder={language === 'en' ? "Ask IRIS anything about your cases… (e.g. vehicle plates, FIRs, suspects)" : "ನಿಮ್ಮ ಪ್ರಕರಣಗಳ ಬಗ್ಗೆ IRIS ಅನ್ನು ಏನನ್ನಾದರೂ ಕೇಳಿ…"}
                  className="w-full pl-14 pr-36 py-4 sm:py-5 bg-[#14151B] border-2 border-[#22242D] focus:border-[#CCFF00] rounded-full text-base sm:text-lg text-[#FFFFFF] placeholder:text-[#CBD5E1]/60 focus:outline-none transition-all font-sans font-medium shadow-command"
                />

                <div className="absolute right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                      isListening
                        ? 'bg-rose-500 text-white animate-bounce shadow-glow-rose'
                        : 'bg-[#22242D] hover:bg-[#2E3228] text-[#CCFF00]'
                    }`}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    type="submit"
                    disabled={isQueryLoading}
                    className="p-2.5 rounded-full bg-[#CCFF00] text-slate-950 hover:bg-[#b8ef00] font-bold shadow-glow-teal transition-all hover:scale-105"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {voiceNotice && (
                <div className="text-xs font-mono text-[#CCFF00] bg-[#CCFF00]/10 py-1.5 px-4 rounded-full inline-flex items-center gap-2 border border-[#CCFF00]/30 font-bold animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{voiceNotice}</span>
                </div>
              )}
            </form>

            {/* Suggested Query Chips */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold text-[#CBD5E1] uppercase tracking-wider block">
                Suggested Investigator Queries
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sampleQueries.map((queryText, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleChipClick(queryText)}
                    className="px-4 py-2.5 rounded-full bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] hover:border-[#CCFF00]/50 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm transition-all font-sans text-left"
                  >
                    {queryText}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {history.map((resp, turnIdx) => (
              <motion.div
                key={resp.session_id || turnIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: turnIdx * 0.05 }}
                className="space-y-4"
              >
                {/* 1. USER QUESTION BUBBLE (Right Aligned) */}
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="bg-[#1C1E26] border border-[#2B2E3C] rounded-2xl rounded-tr-sm p-4 text-sm sm:text-base font-medium text-white shadow-md">
                      <p className="font-sans leading-relaxed">{resp.prompt}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 2. IRIS DETECTIVE RESPONSE CARD (Left Aligned) */}
                <div className="flex justify-start">
                  <div className="w-full max-w-3xl space-y-3">
                    <div className="p-6 sm:p-7 rounded-[24px] bg-[#14151B] border border-[#22242D] hover:border-[#CCFF00]/40 transition-colors shadow-2xl space-y-4">
                      {/* Response Header: Persona Badge & Confidence Score */}
                      <div className="flex items-center justify-between border-b border-[#22242D] pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00] shadow-glow-teal">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-extrabold text-sm sm:text-base text-[#FFFFFF]">
                              IRIS Intelligence Synthesis
                            </h3>
                            <p className="text-xs text-[#CCFF00] font-mono font-bold">
                              Persona: Chief Detective V. R. Rao (26-Year Veteran)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40">
                            {resp.confidence}% Confidence
                          </span>
                        </div>
                      </div>

                      {/* Formatted Answer Body */}
                      <div className="text-sm sm:text-base text-[#FFFFFF] leading-relaxed font-sans font-medium whitespace-pre-line bg-[#0B0C0E]/80 p-4 sm:p-5 rounded-2xl border border-[#22242D]">
                        {resp.response}
                      </div>

                      {/* Interactive Sources & Reasoning Trigger */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 font-mono">
                          <Database className="w-4 h-4 text-[#CCFF00]" />
                          <span className="text-[#CBD5E1] font-bold">Sources:</span>
                          {resp.sources.map((src, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSourceClick(src)}
                              className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B0C0E] hover:bg-[#1C1E26] text-[#CCFF00] hover:text-white border border-[#353A2E] hover:border-[#CCFF00]/50 transition-all flex items-center gap-1 cursor-pointer"
                              title={`Click to open module for ${src.label}`}
                            >
                              <span>{src.label}</span>
                              <ExternalLink className="w-3 h-3 text-[#CCFF00]/70" />
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleSeeReasoning(resp)}
                          className="px-4 py-2 rounded-full bg-[#CCFF00] hover:bg-[#b8ef00] text-slate-950 font-extrabold font-sans text-xs flex items-center gap-1.5 shadow-glow-teal transition-all hover:scale-105"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>See how IRIS thought through this →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* 3. MULTI-AGENT THINKING / LOADING ANIMATION */}
            {isQueryLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="w-full max-w-2xl p-5 rounded-[24px] bg-[#14151B] border border-[#22242D] space-y-3 shadow-command">
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#CCFF00]">
                    <Cpu className="w-4 h-4 animate-spin text-[#CCFF00]" />
                    <span>IRIS Multi-Agent Pipeline Reasoning...</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Query Router Agent: Intent classified & routed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-t-[#CCFF00] border-[#22242D] animate-spin" />
                      <span className="text-[#CCFF00]">Chief Detective V. R. Rao: Cross-referencing 20,000+ case vectors</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-[#22242D] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#CCFF00]/40 via-[#CCFF00] to-[#CCFF00]/40 animate-pulse w-3/4" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Sticky Floating Chat Input Bar (Visible when conversation is active) */}
      {isConversationActive && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 bg-[#0B0C0E]/95 backdrop-blur-lg border-t border-[#22242D] shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Quick Follow-up Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase shrink-0">Follow-up:</span>
              {sampleQueries.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(q)}
                  className="px-3 py-1 rounded-full bg-[#14151B] hover:bg-[#1C1E26] border border-[#22242D] text-xs text-slate-300 hover:text-white shrink-0 font-sans transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-5 text-[#CBD5E1] pointer-events-none" />

              <input
                type="text"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="Ask follow-up question to Chief Detective V. R. Rao…"
                className="w-full pl-14 pr-32 py-3.5 sm:py-4 bg-[#14151B] border-2 border-[#22242D] focus:border-[#CCFF00] rounded-full text-sm sm:text-base text-[#FFFFFF] placeholder:text-slate-500 focus:outline-none transition-all font-sans font-medium"
              />

              <div className="absolute right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`p-2 rounded-full transition-all flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-500 text-white animate-bounce shadow-glow-rose'
                      : 'bg-[#22242D] hover:bg-[#2E3228] text-[#CCFF00]'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={isQueryLoading}
                  className="p-2.5 rounded-full bg-[#CCFF00] text-slate-950 hover:bg-[#b8ef00] font-bold shadow-glow-teal transition-all hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskIrisSection;
