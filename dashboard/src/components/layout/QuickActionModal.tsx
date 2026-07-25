import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FilePlus, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const [actionType, setActionType] = useState<'case' | 'alert'>('case');
  const [caseTitle, setCaseTitle] = useState('');
  const [district, setDistrict] = useState('Whitefield Sub-Division');
  const [crimeCategory, setCrimeCategory] = useState('Burglary / Theft');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-[#14161C] border border-[#232631] rounded-[24px] shadow-2xl p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232631] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[#E8EAF0]">CrimeLens Quick Action</h2>
                  <p className="text-xs text-[#8A8F9C]">File a new FIR case entry or issue an intelligence alert</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E222D] text-[#8A8F9C] hover:text-[#E8EAF0] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#E8EAF0]">Intelligence Record Logged</h3>
                <p className="text-sm text-[#8A8F9C]">Case FIR-2026-0590 successfully created and indexed into AI graph.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type selector pills */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#0A0B0F] border border-[#232631] rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setActionType('case')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      actionType === 'case'
                        ? 'bg-teal-500 text-slate-950 shadow'
                        : 'text-[#8A8F9C] hover:text-[#E8EAF0]'
                    }`}
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>New FIR Case</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('alert')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      actionType === 'alert'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-[#8A8F9C] hover:text-[#E8EAF0]'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Broadcast Risk Alert</span>
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#8A8F9C] font-mono mb-1">
                      {actionType === 'case' ? 'Case Title / Incident Summary' : 'Alert Headline'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={actionType === 'case' ? 'e.g. Serial Warehouse Break-in at Hoodi' : 'e.g. Suspect Vehicle ANPR Match on Ring Rd'}
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-[#232631] rounded-xl px-3 py-2 text-[#E8EAF0] focus:outline-none focus:border-teal-500 transition-colors placeholder-[#8A8F9C]/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#8A8F9C] font-mono mb-1">Jurisdiction / Zone</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#0A0B0F] border border-[#232631] rounded-xl px-3 py-2 text-[#E8EAF0] focus:outline-none focus:border-teal-500 transition-colors"
                      >
                        <option>Whitefield Sub-Division</option>
                        <option>Indiranagar Station</option>
                        <option>Kalyan Nagar Zone</option>
                        <option>Hebbal Outer Ring Rd</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#8A8F9C] font-mono mb-1">Crime Category</label>
                      <select
                        value={crimeCategory}
                        onChange={(e) => setCrimeCategory(e.target.value)}
                        className="w-full bg-[#0A0B0F] border border-[#232631] rounded-xl px-3 py-2 text-[#E8EAF0] focus:outline-none focus:border-teal-500 transition-colors"
                      >
                        <option>Burglary / Theft</option>
                        <option>Armed Robbery</option>
                        <option>Cyber Fraud / Syndicate</option>
                        <option>Narcotics Distribution</option>
                        <option>Assault / High Priority</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A8F9C] hover:text-[#E8EAF0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-glow-teal flex items-center gap-1.5 ${
                      actionType === 'case'
                        ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                        : 'bg-rose-500 hover:bg-rose-400 text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{actionType === 'case' ? 'Create FIR Record' : 'Dispatch Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
