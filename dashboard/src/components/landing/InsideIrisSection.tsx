import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal as TerminalIcon,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  Tv,
  Database,
  GitFork
} from 'lucide-react';
import { useIrisStore, CopilotResponse, ReasoningStep } from '../../store/useIrisStore';

export const InsideIrisSection: React.FC = () => {
  const {
    history,
    selectedTrace,
    setSelectedTrace,
    timelineIndex,
    setTimelineIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    isCinematicMode,
    toggleCinematicMode
  } = useIrisStore();

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const steps = selectedTrace?.reasoning_steps || [];
  const currentStep: ReasoningStep | undefined = steps[timelineIndex];
  const isFinished = timelineIndex >= steps.length - 1;

  // Auto-play timer sync controller
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isFinished && steps.length > 0) {
      const delay = Math.floor(1200 / playbackSpeed);
      timer = setTimeout(() => {
        setTimelineIndex(timelineIndex + 1);
      }, delay);
    } else if (isFinished && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timelineIndex, isFinished, steps.length, playbackSpeed, setTimelineIndex, setIsPlaying]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timelineIndex]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setTimelineIndex(idx);
    setIsPlaying(false);
  };

  const handleSelectQuery = (session_id: string) => {
    const trace = history.find(h => h.session_id === session_id) || history[0];
    setSelectedTrace(trace);
  };

  // Node highlighting helper
  const isNodeActive = (nodeKey: string) => {
    if (!currentStep) return false;
    const phase = currentStep.phase;
    const agent = (currentStep.agent || '').toLowerCase();

    if (nodeKey === 'INPUT') return true;
    if (nodeKey === 'GATEWAY') return timelineIndex >= 0;
    if (nodeKey === 'ROUTER') return phase === 'INTENT_CLASSIFICATION' || phase === 'KANNADA_TRANSLATION' || timelineIndex >= 0;
    if (nodeKey === 'SUB_AGENT') return phase === 'SUB_AGENT_DELEGATION' || agent.includes('agent') || agent.includes('engine');
    if (nodeKey === 'GOVERNANCE') return phase === 'GOVERNANCE_AUDIT' || agent.includes('governance');
    if (nodeKey === 'SYNTHESIS') return phase === 'SENIOR_DETECTIVE_SYNTHESIS' || isFinished;
    return false;
  };

  return (
    <div className="relative flex flex-col justify-between p-6 lg:p-10 overflow-hidden bg-[#0B0C0E] select-none min-h-[calc(100vh-4rem)]">
      {/* Top Header & Query Selector */}
      {!isCinematicMode && (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#22242D] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-3.5 py-1 rounded-full border border-[#CCFF00]/30 w-fit">
              <Sparkles className="w-4 h-4" />
              <span>04 — INSIDE IRIS (LIVE MULTI-AGENT EXECUTION TRACE)</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFFFFF]">
              Live Multi-Agent Reasoner & Audit Trace
            </h2>
          </div>

          {/* Controls: Recent Queries Selector + Cinematic Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#14151B] p-2 rounded-full border border-[#22242D]">
              <span className="text-xs sm:text-sm font-mono text-[#CBD5E1] font-bold ml-2">Trace Query:</span>
              <select
                value={selectedTrace?.session_id || ''}
                onChange={(e) => handleSelectQuery(e.target.value)}
                className="bg-[#0B0C0E] text-[#FFFFFF] text-xs sm:text-sm font-mono font-bold border border-[#22242D] rounded-full px-3.5 py-1 focus:outline-none"
              >
                {history.map((h) => (
                  <option key={h.session_id} value={h.session_id}>
                    {h.prompt.slice(0, 45)}... ({h.session_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Cinematic Mode Toggle */}
            <button
              onClick={toggleCinematicMode}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] text-xs sm:text-sm font-mono font-bold text-[#CCFF00] transition-colors"
              title="Hide Chrome for Video Recording"
            >
              <Tv className="w-4 h-4 text-[#CCFF00]" />
              <span>Cinematic Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Split View: Left Terminal & Right Interactive Flowchart */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 overflow-hidden min-h-[460px]">
        {/* LEFT PANEL: Live Monospace Terminal Log */}
        <motion.div
          whileHover={{ translateY: -2, borderColor: 'rgba(204, 255, 0, 0.3)' }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-6 bg-[#070709] border border-[#22242D] rounded-[24px] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden transition-colors"
        >
          <div className="flex items-center justify-between border-b border-[#22242D] pb-3 text-xs sm:text-sm font-mono text-[#CBD5E1]">
            <div className="flex items-center gap-2 text-[#CCFF00]">
              <TerminalIcon className="w-4.5 h-4.5" />
              <span className="font-bold">IRIS-EXECUTION-LOG.stderr</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              ● REALTIME REASONER TRACE
            </span>
          </div>

          {/* Scrollable Terminal Stream Lines */}
          <div className="flex-1 overflow-y-auto font-mono text-xs sm:text-sm space-y-3 py-4 pr-2">
            {steps.slice(0, timelineIndex + 1).map((step, idx) => (
              <motion.div
                key={step.id || idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-1.5 bg-[#14151B]/60 p-3.5 rounded-xl border border-[#22242D]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CCFF00] font-extrabold">
                    [{step.phase}] → {step.agent}
                  </span>
                  <span className="text-xs text-[#CBD5E1] font-bold">{step.status}</span>
                </div>
                <p className="text-[#FFFFFF] font-bold text-sm sm:text-base">{step.title}</p>
                <p className="text-xs sm:text-sm text-[#CBD5E1] font-medium leading-relaxed">{step.details}</p>
              </motion.div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <div className="pt-3 border-t border-[#22242D] flex items-center justify-between text-xs font-mono font-bold text-[#CBD5E1]">
            <span>Step {timelineIndex + 1} of {steps.length} Executed</span>
            <span>Session: {selectedTrace?.session_id}</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL: Live Interactive Node/Edge Flowchart */}
        <motion.div
          whileHover={{ translateY: -2, borderColor: 'rgba(204, 255, 0, 0.3)' }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-6 bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-colors"
        >
          <div className="flex items-center justify-between border-b border-[#22242D] pb-3 text-xs sm:text-sm font-mono text-[#CBD5E1]">
            <span className="font-bold text-[#FFFFFF] flex items-center gap-2">
              <GitFork className="w-4.5 h-4.5 text-[#CCFF00]" />
              Multi-Agent Graph Flowchart
            </span>
            <span className="text-xs text-[#CCFF00] font-bold">Active Node Pulsing</span>
          </div>

          {/* Node Diagram Flow Layout */}
          <div className="flex-1 flex flex-col justify-center space-y-4 py-4 relative">
            {/* Node 1: User Query Input */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-mono ${
              isNodeActive('INPUT') ? 'bg-[#CCFF00]/15 border-[#CCFF00] shadow-glow-teal scale-[1.02]' : 'bg-[#0B0C0E] border-[#22242D] opacity-60'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#CCFF00]" />
                <span className="font-bold text-[#FFFFFF]">User Query Input</span>
              </div>
              <span className="text-xs text-[#CBD5E1] font-semibold truncate max-w-[220px]">{selectedTrace?.prompt}</span>
            </div>

            <div className="w-0.5 h-3 bg-[#CCFF00]/40 mx-auto" />

            {/* Node 2: API Gateway & Router Agent */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-mono ${
              isNodeActive('ROUTER') ? 'bg-[#CCFF00]/15 border-[#CCFF00] shadow-glow-teal scale-[1.02]' : 'bg-[#0B0C0E] border-[#22242D] opacity-60'
            }`}>
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4.5 h-4.5 text-[#CCFF00]" />
                <div>
                  <span className="font-bold text-[#FFFFFF] block">FastAPI Gateway & Query Router</span>
                  <span className="text-xs text-[#CBD5E1]">Intent: {selectedTrace?.intent}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#CCFF00]/20 text-[#CCFF00] text-xs font-bold">IRIS CO-PILOT</span>
            </div>

            <div className="w-0.5 h-3 bg-[#CCFF00]/40 mx-auto" />

            {/* Node 3: Sub-Agent Layer */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-mono ${
              isNodeActive('SUB_AGENT') ? 'bg-amber-500/20 border-amber-400 shadow-glow-amber scale-[1.02]' : 'bg-[#0B0C0E] border-[#22242D] opacity-60'
            }`}>
              <div className="flex items-center gap-2.5">
                <Database className="w-4.5 h-4.5 text-amber-400" />
                <div>
                  <span className="font-bold text-[#FFFFFF] block">Sub-Agent Execution Layer</span>
                  <span className="text-xs text-amber-400 font-bold">{currentStep?.agent || 'Sub-Agent Routing'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold">REASONING</span>
            </div>

            <div className="w-0.5 h-3 bg-[#CCFF00]/40 mx-auto" />

            {/* Node 4: Governance Middleware & Audit Ledger */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-mono ${
              isNodeActive('GOVERNANCE') ? 'bg-emerald-500/20 border-emerald-400 scale-[1.02]' : 'bg-[#0B0C0E] border-[#22242D] opacity-60'
            }`}>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4.5 h-4.5 text-emerald-400" />
                <div>
                  <span className="font-bold text-[#FFFFFF] block">Governance & SHAP Rationale</span>
                  <span className="text-xs text-emerald-400 font-bold">Audit ID: {selectedTrace?.auditLogId}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">VERIFIED</span>
            </div>

            <div className="w-0.5 h-3 bg-[#CCFF00]/40 mx-auto" />

            {/* Node 5: Senior Detective Synthesis */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-mono ${
              isNodeActive('SYNTHESIS') ? 'bg-[#CCFF00] text-slate-950 font-bold shadow-glow-teal scale-[1.02]' : 'bg-[#0B0C0E] border-[#22242D] opacity-60'
            }`}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4.5 h-4.5" />
                <span className="font-extrabold text-slate-950">Chief Detective V. R. Rao Field Assessment</span>
              </div>
              <span className="text-xs uppercase font-extrabold">{selectedTrace?.confidence}% CONF</span>
            </div>
          </div>

          {/* GOVERNANCE CERTIFICATE Summary Card */}
          <AnimatePresence>
            {isFinished && selectedTrace && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-[#0B0C0E] border-2 border-[#CCFF00] p-4 sm:p-5 rounded-2xl shadow-glow-teal text-xs sm:text-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#22242D] pb-2 font-mono">
                  <span className="font-extrabold text-[#CCFF00] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    GOVERNANCE AUDIT CERTIFICATE
                  </span>
                  <span className="text-xs text-[#CBD5E1] font-bold">{selectedTrace.auditLogId}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs pt-1">
                  <div className="bg-[#14151B] p-2.5 rounded-xl border border-[#22242D]">
                    <span className="text-[#CBD5E1] block text-[10px] font-bold">STEPS</span>
                    <span className="font-extrabold text-[#FFFFFF]">{steps.length} Executed</span>
                  </div>
                  <div className="bg-[#14151B] p-2.5 rounded-xl border border-[#22242D]">
                    <span className="text-[#CBD5E1] block text-[10px] font-bold">CONFIDENCE</span>
                    <span className="font-extrabold text-[#CCFF00]">{selectedTrace.confidence}%</span>
                  </div>
                  <div className="bg-[#14151B] p-2.5 rounded-xl border border-[#22242D]">
                    <span className="text-[#CBD5E1] block text-[10px] font-bold">LATENCY</span>
                    <span className="font-extrabold text-amber-400">{selectedTrace.executionTimeMs}ms</span>
                  </div>
                  <div className="bg-[#14151B] p-2.5 rounded-xl border border-[#22242D]">
                    <span className="text-[#CBD5E1] block text-[10px] font-bold">STATUS</span>
                    <span className="font-extrabold text-emerald-400">VERIFIED</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Shared Playback Scrubber & Timeline Controller Bar */}
      {!isCinematicMode && (
        <div className="relative z-10 bg-[#14151B] border border-[#22242D] p-4 rounded-[24px] shadow-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Play / Pause / Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTimelineIndex(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-full bg-[#0B0C0E] hover:bg-[#1B1C24] text-[#CBD5E1] hover:text-[#FFFFFF] border border-[#22242D]"
              title="Reset Trace"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTimelineIndex(Math.max(0, timelineIndex - 1))}
              className="p-2 rounded-full bg-[#0B0C0E] hover:bg-[#1B1C24] text-[#CBD5E1] hover:text-[#FFFFFF] border border-[#22242D]"
              title="Step Backward"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-[#CCFF00] text-slate-950 font-bold hover:bg-[#b8ef00] shadow-glow-teal transition-transform active:scale-95"
              title={isPlaying ? "Pause Playback" : "Play Trace"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => setTimelineIndex(Math.min(steps.length - 1, timelineIndex + 1))}
              className="p-2 rounded-full bg-[#0B0C0E] hover:bg-[#1B1C24] text-[#CBD5E1] hover:text-[#FFFFFF] border border-[#22242D]"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Progress Scrubber Bar */}
          <div className="flex-1 max-w-xl flex items-center gap-3 font-mono text-xs sm:text-sm font-bold">
            <span className="text-[#CBD5E1]">Step {timelineIndex + 1}</span>
            <input
              type="range"
              min="0"
              max={Math.max(0, steps.length - 1)}
              value={timelineIndex}
              onChange={handleScrub}
              className="flex-1 accent-[#CCFF00] cursor-pointer"
            />
            <span className="text-[#CCFF00] font-extrabold">{steps.length} Steps</span>
          </div>

          {/* Speed Controller */}
          <div className="flex items-center gap-1 bg-[#0B0C0E] p-1 rounded-full border border-[#22242D] text-xs sm:text-sm font-mono font-bold">
            <span className="text-[#CBD5E1] px-2">Speed:</span>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  playbackSpeed === spd ? 'bg-[#CCFF00] text-slate-950 font-extrabold' : 'text-[#CBD5E1]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
