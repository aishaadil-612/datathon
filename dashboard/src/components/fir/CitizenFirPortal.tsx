import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowLeft, Send, Sparkles, User, FileText, CheckCircle2,
  AlertTriangle, MapPin, Fingerprint, Activity, Network, CheckSquare, ShieldCheck, FileKey, TerminalSquare, Search, Printer
} from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

type FirSystemCard = 
  | { type: 'extraction'; data: { complainant: string; location: string; time: string; evidence: string; completeness: boolean } }
  | { type: 'drafting'; data: { draftId: string; cognizable: boolean; category: string; bns: string[]; ipc: string[]; unit: string } }
  | { type: 'verification'; data: { identity: string; gps: string; duplicate: string; fraudRisk: string; fraudScore: number } }
  | { type: 'recommendation'; data: { recommendations: { action: string; desc: string }[] } }
  | { type: 'routing'; data: { intent: string; officer: string; confidence: number; match: string; guidance: string } }
  | { type: 'registration'; data: { firId: string; status: string; approvedBy: string; trackingId: string } };

type FirMessage = {
  id: string;
  sender: 'user' | 'system';
  content?: string;
  cards?: FirSystemCard[];
  isProcessing?: boolean;
};

export const CitizenFirPortal: React.FC = () => {
  const { setActiveView } = useRouterStore();
  const [messages, setMessages] = useState<FirMessage[]>([
    {
      id: 'init-1',
      sender: 'system',
      content: 'Welcome to the AI-Assisted E-FIR Intake Portal. Please describe the incident in natural language. You can also upload relevant CCTV footage or images.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const demoScenarioText = "My name is Vikram Malhotra. On yesterday night at Koramangala 5th Block, two unidentified suspects on a black Pulsar motorcycle broke into my commercial warehouse, stole laptop computers and electronics worth 4 Lakhs, and exfiltrated towards Outer Ring Road. CCTV clip uploaded.";

  const processScenarioSequence = async () => {
    setInputValue('');
    setIsInputDisabled(true);

    // 1. Add User Message
    const userMsg: FirMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: demoScenarioText
    };
    setMessages(prev => [...prev, userMsg]);

    // Add Processing Message
    const processingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: processingId, sender: 'system', isProcessing: true }]);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Phase 1: Intake & Extraction
    await delay(2000);
    setMessages(prev => {
      const newMsgs = [...prev];
      const pIdx = newMsgs.findIndex(m => m.id === processingId);
      if (pIdx > -1) {
        newMsgs[pIdx] = {
          id: processingId,
          sender: 'system',
          cards: [{
            type: 'extraction',
            data: {
              complainant: "Vikram Malhotra",
              location: "Koramangala 5th Block",
              time: "Yesterday Night",
              evidence: "CCTV Clip [Attached]",
              completeness: true
            }
          }]
        };
      }
      return newMsgs;
    });

    // Phase 2: Drafting
    await delay(1500);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'system',
      cards: [{
        type: 'drafting',
        data: {
          draftId: "DRAFT-FIR-2026-9101",
          cognizable: true,
          category: "Property Theft & Burglary",
          bns: ["BNS Section 303 (Theft)", "BNS Section 305 (Theft in Dwelling House)"],
          ipc: ["IPC Section 379", "IPC Section 380"],
          unit: "Anti-Theft Squad / Detective Department"
        }
      }]
    }]);

    // Phase 3: Verification
    await delay(1500);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'system',
      cards: [{
        type: 'verification',
        data: {
          identity: "OTP Verified & DigiLocker Govt ID Verified",
          gps: "Validated",
          duplicate: "Passed (False)",
          fraudRisk: "LOW",
          fraudScore: 0.12
        }
      }]
    }]);

    // Phase 4: Recommendation & Routing
    await delay(1500);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'system',
      cards: [
        {
          type: 'recommendation',
          data: {
            recommendations: [
              { action: "REGISTER_FIR_IMMEDIATELY", desc: "Cognizable offence confirmed." },
              { action: "ASSIGN_SPECIALIZED_UNIT", desc: "Dispatched to Anti-Theft Squad." },
              { action: "NOTIFY_COMPLAINANT", desc: "Digital acknowledgement and Tracking ID issued." }
            ]
          }
        },
        {
          type: 'routing',
          data: {
            intent: "FIR_ASSISTANT",
            officer: "Chief Detective V. R. Rao",
            confidence: 85,
            match: "Commercial District Extortion & Flash Cluster Syndicate",
            guidance: "4-phase tactical guidance issued."
          }
        }
      ]
    }]);

    // Phase 5: Registration Approval
    await delay(1500);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'system',
      cards: [{
        type: 'registration',
        data: {
          firId: "FIR-2026-9101",
          status: "REGISTERED",
          approvedBy: "Officer INSP-8831",
          trackingId: "TRK-9101-2026"
        }
      }]
    }]);

    setIsInputDisabled(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === demoScenarioText) {
      processScenarioSequence();
    } else {
      // Basic echo for non-demo text
      if (!inputValue.trim()) return;
      const userMsg: FirMessage = { id: Date.now().toString(), sender: 'user', content: inputValue };
      setMessages(prev => [...prev, userMsg]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'system',
          content: "I have recorded your statement. However, for full demonstration of the system's capabilities, please use the 'Demo Scenario' button below."
        }]);
      }, 1000);
    }
  };

  // -------------------------------------------------------------
  // Card Renderers
  // -------------------------------------------------------------
  const renderExtractionCard = (data: any) => (
    <div className="bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#22242D] pb-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <TerminalSquare className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Citizen Complaint Intake</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div><span className="text-slate-500 dark:text-[#9FA4B2]">Complainant:</span> <span className="font-bold text-slate-900 dark:text-white">{data.complainant}</span></div>
        <div><span className="text-slate-500 dark:text-[#9FA4B2]">Location:</span> <span className="font-bold text-slate-900 dark:text-white">{data.location}</span></div>
        <div><span className="text-slate-500 dark:text-[#9FA4B2]">Incident Time:</span> <span className="font-bold text-slate-900 dark:text-white">{data.time}</span></div>
        <div><span className="text-slate-500 dark:text-[#9FA4B2]">Evidence:</span> <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">{data.evidence}</span></div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-max px-2.5 py-1 rounded-md">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Completeness check passed</span>
      </div>
    </div>
  );

  const renderDraftingCard = (data: any) => (
    <div className="bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#22242D] pb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Automated FIR Drafting & Legal Classification</h4>
      </div>
      
      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0B0C0E] p-3 rounded-lg border border-slate-200 dark:border-[#22242D]">
        <span className="text-xs text-slate-500 dark:text-[#9FA4B2] font-mono">Generated Draft ID</span>
        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{data.draftId}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Cognizable Offence</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> True
          </span>
        </div>
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Crime Category</span>
          <span className="font-bold text-slate-900 dark:text-white">{data.category}</span>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <span className="block text-slate-500 dark:text-[#9FA4B2] font-mono mb-2">Suggested Penal Codes</span>
          <div className="flex flex-wrap gap-2">
            {data.bns.map((code: string) => (
              <span key={code} className="px-2 py-1 bg-slate-100 dark:bg-[#1B1C24] border border-slate-200 dark:border-[#22242D] rounded-md font-mono text-slate-800 dark:text-slate-200">{code}</span>
            ))}
            {data.ipc.map((code: string) => (
              <span key={code} className="px-2 py-1 bg-slate-100 dark:bg-[#1B1C24] border border-slate-200 dark:border-[#22242D] rounded-md font-mono text-slate-800 dark:text-slate-200">{code}</span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Recommended Unit</span>
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-500"/> {data.unit}</span>
        </div>
      </div>
    </div>
  );

  const renderVerificationCard = (data: any) => (
    <div className="bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#22242D] pb-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Fingerprint className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Authenticity & AI Fraud Risk Verification</h4>
      </div>
      
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#22242D] pb-2">
          <span className="text-slate-500 dark:text-[#9FA4B2] font-mono">Identity Status</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.identity}</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#22242D] pb-2">
          <span className="text-slate-500 dark:text-[#9FA4B2] font-mono">GPS Geo-Stamp</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> {data.gps}</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#22242D] pb-2">
          <span className="text-slate-500 dark:text-[#9FA4B2] font-mono">Duplicate Check</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.duplicate}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-500 dark:text-[#9FA4B2] font-mono">AI Fraud Risk Score</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">Level {data.fraudRisk}</span>
            <span className="font-bold text-slate-900 dark:text-white">({data.fraudScore})</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationCard = (data: any) => (
    <div className="bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#22242D] pb-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Police Officer Action Recommendations</h4>
      </div>
      <div className="space-y-3">
        {data.recommendations.map((rec: any, idx: number) => (
          <div key={idx} className="flex gap-3 text-xs">
            <div className="mt-0.5"><CheckSquare className="w-4 h-4 text-amber-500" /></div>
            <div>
              <div className="font-bold font-mono text-slate-900 dark:text-white mb-0.5">{rec.action}</div>
              <div className="text-slate-600 dark:text-[#9FA4B2]">{rec.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoutingCard = (data: any) => (
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-[#14151B] dark:to-[#0B0C0E] border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 sm:p-5 shadow-md space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Network className="w-24 h-24 text-blue-500" />
      </div>
      
      <div className="flex items-center gap-2 border-b border-blue-100 dark:border-blue-500/20 pb-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-glow-teal">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Query Router & Senior Detective Briefing</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs relative z-10">
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Classified Intent</span>
          <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 bg-slate-200 dark:bg-[#1B1C24] rounded-md">{data.intent}</span>
        </div>
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Senior Detective Routed</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{data.officer}</span>
        </div>
        <div className="sm:col-span-2 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-900 dark:text-white">Pattern Match Detected</span>
            <span className="ml-auto text-[10px] font-bold font-mono text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded">{data.confidence}% CONFIDENCE</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-1">{data.match}</p>
          <p className="text-slate-500 dark:text-[#9FA4B2] italic text-[11px]">{data.guidance}</p>
        </div>
      </div>
    </div>
  );

  const renderRegistrationCard = (data: any) => (
    <div className="bg-emerald-50 dark:bg-[#0B0C0E] border-2 border-emerald-500/50 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-base">Official FIR Registered</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-500/70 font-mono">Officer Approval & Official Registration</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs bg-white dark:bg-[#14151B] p-4 rounded-lg border border-emerald-500/20">
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Official FIR Number</span>
          <span className="font-bold text-slate-900 dark:text-white text-sm">{data.firId}</span>
        </div>
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Status</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">{data.status}</span>
        </div>
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Approved By</span>
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> {data.approvedBy}</span>
        </div>
        <div>
          <span className="block text-slate-500 dark:text-[#9FA4B2] mb-1 font-mono">Tracking ID</span>
          <span className="font-bold text-slate-900 dark:text-white">{data.trackingId}</span>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Printer className="w-4 h-4" /> Print Copy
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C0E] text-slate-900 dark:text-[#FFFFFF] font-sans flex flex-col select-none transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#14151B] border-b border-slate-200 dark:border-[#22242D] sticky top-0 z-40 px-4 sm:px-6 py-4 shadow-sm flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Karnataka State Police</span>
              <span className="text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono font-bold">Official E-FIR Portal</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#9FA4B2]">Citizen Public Grievance & AI-Assisted Cognizable FIR Registration</p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('overview')}
          className="hidden sm:flex px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B1C24] border border-slate-200 dark:border-transparent transition-colors items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command</span>
        </button>
      </header>

      {/* Chat Interface Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-56 space-y-6 flex flex-col">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[95%] sm:max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="shrink-0 mt-1">
                {msg.sender === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-glow-teal">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-4 w-full">
                {msg.content && (
                  <div className={`px-4 py-3 rounded-2xl text-[13px] sm:text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] text-slate-700 dark:text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                )}

                {msg.isProcessing && (
                  <div className="bg-white dark:bg-[#14151B] border border-slate-200 dark:border-[#22242D] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 shadow-sm w-max">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-[#9FA4B2] font-mono ml-2">Processing via AI Pipeline...</span>
                  </div>
                )}

                {msg.cards && msg.cards.length > 0 && (
                  <div className="space-y-4 w-full max-w-2xl">
                    {msg.cards.map((card, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        {card.type === 'extraction' && renderExtractionCard(card.data)}
                        {card.type === 'drafting' && renderDraftingCard(card.data)}
                        {card.type === 'verification' && renderVerificationCard(card.data)}
                        {card.type === 'recommendation' && renderRecommendationCard(card.data)}
                        {card.type === 'routing' && renderRoutingCard(card.data)}
                        {card.type === 'registration' && renderRegistrationCard(card.data)}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} className="h-48" />
      </main>

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-50/90 dark:bg-[#0B0C0E]/90 backdrop-blur-md border-t border-slate-200 dark:border-[#22242D] p-4 z-40 transition-colors">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button 
              onClick={() => { setInputValue(demoScenarioText); }}
              disabled={isInputDisabled}
              className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold font-mono border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors disabled:opacity-50"
            >
              🚀 Load Demo Scenario: "Vikram Malhotra Burglary"
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isInputDisabled}
              placeholder="Describe the incident, suspects, or attach evidence..."
              className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-[#14151B] border border-slate-300 dark:border-[#22242D] rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9FA4B2] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isInputDisabled}
              className="absolute right-2 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            E-FIR Intake is powered by CrimeLens AI. False reporting is punishable under BNS Section 217.
          </div>
        </div>
      </div>
    </div>
  );
};
