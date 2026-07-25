import React, { useState } from 'react';
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
  Volume2
} from 'lucide-react';
import { useIrisStore, CopilotResponse } from '../../store/useIrisStore';
import { useRouterStore } from '../../store/useRouterStore';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';

export const AskIrisSection: React.FC = () => {
  const { language, setLanguage, role } = useDashboardStore();
  const { setActiveView } = useRouterStore();
  const {
    currentPrompt,
    setCurrentPrompt,
    submitQuery,
    isQueryLoading,
    activeResponse,
    setSelectedTrace
  } = useIrisStore();

  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const sampleQueries = [
    "Which cases in the last month share a vehicle plate or modus operandi?",
    "Show predicted rising-risk zones for Whitefield & Hoodi over next 30 days",
    "Trace shortest connection path for Vikram Singh across active FIRs",
    "Summarize serial burglary ring modus operandi and grinder tool evidence"
  ];

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
    await submitQuery(currentPrompt, role);
  };

  const handleChipClick = async (queryText: string) => {
    setCurrentPrompt(queryText);
    await submitQuery(queryText, role);
  };

  const handleSeeReasoning = (resp: CopilotResponse) => {
    setSelectedTrace(resp);
    setActiveView('inside-iris');
  };

  return (
    <div className="relative flex flex-col justify-between p-6 lg:p-12 overflow-hidden bg-[#0B0C0E] select-none min-h-[calc(100vh-4rem)]">
      {/* Subtle Slow-Moving Particle/Network Grid Canvas Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#22242D_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Section Header Narrative Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-3.5 py-1.5 rounded-full border border-[#CCFF00]/30">
          <Sparkles className="w-4 h-4" />
          <span>01 — ASK IRIS HERO LANDING</span>
        </div>
        <span className="text-xs font-mono font-semibold text-[#CBD5E1] hidden sm:block">
          Bilingual Conversational AI Platform • Chief Detective V. R. Rao Persona
        </span>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6 space-y-8 text-center">
        {/* Brand Name & Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14151B] border border-[#22242D] text-xs sm:text-sm font-mono font-semibold text-[#CBD5E1]">
            <Bot className="w-4 h-4 text-[#CCFF00]" />
            <span>Investigation Intelligence Copilot (IRIS)</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
            Ask <span className="text-[#CCFF00] drop-shadow-glow-teal">IRIS</span> Anything About Your Cases
          </h1>

          <p className="text-sm sm:text-lg text-[#CBD5E1] font-medium max-w-2xl mx-auto leading-relaxed font-sans">
            IRIS reasons with the accumulated experience of a 26-year veteran detective who has solved 20,000+ cases.
          </p>
        </div>

        {/* Center-Stage Search Bar Input with Voice & Inline Language Toggle */}
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

            {/* Prominent Voice & Inline Language Controls directly inside input */}
            <div className="absolute right-3 flex items-center gap-2">
              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={handleMicToggle}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white animate-bounce shadow-glow-rose'
                    : 'bg-[#22242D] hover:bg-[#2E3228] text-[#CCFF00]'
                }`}
                title="Voice Input (English / Kannada)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Inline EN / Kannada Language Toggle */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
                className="px-3.5 py-1.5 bg-[#22242D] hover:bg-[#2E3228] border border-[#353A2E] rounded-full text-xs font-mono font-bold text-[#CCFF00] flex items-center gap-1 transition-colors"
                title="Switch Language Mode"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Submit Arrow Button */}
              <button
                type="submit"
                disabled={isQueryLoading}
                className="p-2.5 rounded-full bg-[#CCFF00] text-slate-950 hover:bg-[#b8ef00] font-bold shadow-glow-teal transition-all hover:scale-105"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Voice status notification banner */}
          {voiceNotice && (
            <div className="text-xs font-mono text-[#CCFF00] bg-[#CCFF00]/10 py-1.5 px-4 rounded-full inline-flex items-center gap-2 border border-[#CCFF00]/30 font-bold animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{voiceNotice}</span>
            </div>
          )}
        </form>

        {/* Suggested Query Chips */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono font-bold text-[#CBD5E1] uppercase tracking-wider block">
            Suggested Investigator Queries
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleQueries.map((queryText, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03, translateY: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleChipClick(queryText)}
                className="px-4 py-2.5 rounded-full bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] hover:border-[#CCFF00]/50 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm transition-all font-sans text-left"
              >
                {queryText}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State Shimmer */}
        {isQueryLoading && (
          <div className="p-6 rounded-[24px] bg-[#14151B] border border-[#22242D] space-y-4 animate-pulse max-w-2xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#CCFF00]/20" />
              <div className="h-4 bg-[#22242D] rounded w-1/3" />
            </div>
            <div className="h-4 bg-[#22242D] rounded w-full" />
            <div className="h-4 bg-[#22242D] rounded w-5/6" />
          </div>
        )}

        {/* Live Conversation Exchange Output Card */}
        {activeResponse && !isQueryLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ translateY: -3, borderColor: 'rgba(204, 255, 0, 0.4)' }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-8 rounded-[24px] bg-[#14151B] border border-[#22242D] shadow-2xl max-w-3xl mx-auto text-left space-y-5 transition-colors"
          >
            {/* Header: Persona & Confidence Score */}
            <div className="flex items-center justify-between border-b border-[#22242D] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00] shadow-glow-teal">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-[#FFFFFF]">
                    IRIS Intelligence Synthesis
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CCFF00] font-mono font-bold">
                    Persona: Chief Detective V. R. Rao (26-Year Veteran)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-extrabold bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40">
                  {activeResponse.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Answer Body Text */}
            <div className="text-base sm:text-lg text-[#FFFFFF] leading-relaxed font-sans font-medium whitespace-pre-line bg-[#0B0C0E]/80 p-5 sm:p-6 rounded-2xl border border-[#22242D]">
              {activeResponse.response}
            </div>

            {/* Sources & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#22242D] text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-mono">
                <Database className="w-4 h-4 text-[#CCFF00]" />
                <span className="text-[#CBD5E1] font-bold">Referenced Sources:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeResponse.sources.map((src, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B0C0E] text-[#CCFF00] border border-[#353A2E]">
                      {src.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prominent "See how IRIS thought through this →" Button */}
              <button
                onClick={() => handleSeeReasoning(activeResponse)}
                className="px-5 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8ef00] text-slate-950 font-extrabold font-sans text-xs sm:text-sm flex items-center gap-2 shadow-glow-teal transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>See how IRIS thought through this →</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
