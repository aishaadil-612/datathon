import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Lock,
  FileCheck,
  Building,
  Printer,
  Sparkles,
  Shield
} from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const CitizenFirPortal: React.FC = () => {
  const { setActiveView } = useRouterStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [complainantName, setComplainantName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [aadhaarNumber, setAadhaarNumber] = useState('5489 1204 9912');
  const [category, setCategory] = useState('Burglary / Theft');
  const [location, setLocation] = useState('Whitefield Industrial Zone, Bengaluru');
  const [description, setDescription] = useState(
    'Commercial burglary at electronics warehouse. Shutter lock cut open using power grinder between 2:00 AM and 3:30 AM. Laptops and inventory stolen.'
  );

  // Verification results
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [generatedFirNumber, setGeneratedFirNumber] = useState<string | null>(null);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyAadhaar = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setAadhaarVerified(true);
      setIsSubmitting(false);
      setStep(3);
    }, 1000);
  };

  const handleGenerateDraft = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1200);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setGeneratedFirNumber(`FIR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitting(false);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col select-none">
      {/* Public Citizen Header Bar (Independent Chrome) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <span>Karnataka State Police</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">Official E-FIR Portal</span>
            </h1>
            <p className="text-xs text-slate-500">Citizen Public Grievance & Cognizable FIR Registration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('iris')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Portal</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* Step Progress Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Step {step} of 4</span>
            <span className="text-blue-600 font-bold">
              {step === 1 && 'Incident Details'}
              {step === 2 && 'Citizen Identity Verification'}
              {step === 3 && 'AI BNS/IPC Draft Review'}
              {step === 4 && 'Authenticity & Submission'}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: COMPLAINT INTAKE */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleStep1Next}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Step 1: File Citizen Police Complaint</h2>
              <p className="text-xs text-slate-500">Please describe the incident clearly in plain language. AI will assist with IPC/BNS legal classification.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Complainant Full Name *</label>
                <input
                  type="text"
                  required
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Crime Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option>Burglary / Housebreak</option>
                  <option>Armed Robbery / Snatching</option>
                  <option>Vehicle Theft</option>
                  <option>Cyber Financial Fraud</option>
                  <option>Physical Assault</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Incident Location / Jurisdiction *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-semibold mb-1">Incident Description & Stolen Items *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-sans leading-relaxed"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Citizen Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 2: AADHAAR VERIFICATION */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Step 2: Citizen Identity Verification (Aadhaar OCR)</h2>
              <p className="text-xs text-slate-500">Verify complainant identity to prevent fraudulent FIR submissions.</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto py-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">12-Digit Aadhaar ID Number</label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-center text-sm font-bold tracking-widest"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>UIDAI Aadhaar Instant OCR Sandbox</span>
                </div>
                <p className="text-[11px] text-blue-700">Verifying name matching: <strong>{complainantName}</strong></p>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleVerifyAadhaar}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <span>Verifying UIDAI Database...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Identity & Proceed</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: AI DRAFT REVIEW */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Step 3: AI Legal Draft & Section Tagging Review</h2>
              <p className="text-xs text-slate-500">CrimeLens AI Assistant translated your complaint into official BNS / IPC legal clauses.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Official Complaint Draft Summary</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                    Cognizable Offense
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{description}</p>
              </div>

              {/* Tagged IPC / BNS Sections */}
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Auto-Tagged Legal Sections (BNS 2023 / IPC)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm space-y-1">
                    <span className="font-bold text-blue-700 block font-mono">BNS Section 305 (IPC 380)</span>
                    <p className="text-slate-600 text-[11px]">Theft in dwelling house or commercial building.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm space-y-1">
                    <span className="font-bold text-blue-700 block font-mono">BNS Section 331 (IPC 457)</span>
                    <p className="text-slate-600 text-[11px]">Lurking house-trespass or house-breaking by night.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGenerateDraft}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                {isSubmitting ? <span>Scoring Authenticity...</span> : <span>Proceed to Final Authenticity Check →</span>}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUBMISSION & CONFIRMATION */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            {generatedFirNumber ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">FIR Successfully Registered!</h2>
                  <p className="text-xs text-slate-500">Official police complaint logged and dispatched to precinct investigating unit.</p>
                </div>

                {/* Printable Receipt Box */}
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">FIR REGISTRATION NO.</span>
                    <span className="font-extrabold text-blue-700 text-sm">{generatedFirNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Complainant:</span>
                    <span className="font-bold text-slate-900">{complainantName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Aadhaar Status:</span>
                    <span className="text-emerald-700 font-bold">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Authenticity Score:</span>
                    <span className="text-blue-700 font-bold">96% Authentic</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>SMS / WhatsApp Receipt Sent To:</span>
                    <span>{phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Formal Copy</span>
                  </button>
                  <button
                    onClick={() => setActiveView('iris')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">Step 4: Authenticity Check & Official Dispatch</h2>
                  <p className="text-xs text-slate-500">Confirm details before official registration in the Karnataka State Police database.</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Authenticity Risk Score Passed (96% Confidence)</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    No spam or duplicate complaint vectors detected. Location matches reported Whitefield precinct cell sector.
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <span>Registering in Police Database...</span>
                    ) : (
                      <>
                        <FileCheck className="w-5 h-5" />
                        <span>Submit & Issue Official FIR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};
