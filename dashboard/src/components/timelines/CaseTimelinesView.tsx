import React, { useState } from 'react';
import {
  Clock,
  FileText,
  Trash2,
  Layers
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockFIRs } from '../../mock/fir';

interface CaseEvent {
  id: string;
  caseId: string;
  timestamp: string;
  type: 'fir_filed' | 'evidence_logged' | 'witness_statement' | 'anpr_hit' | 'arrest';
  title: string;
  description: string;
  sourceTag: string;
}

const mockEvents: CaseEvent[] = [
  // FIR-0489
  {
    id: "e1",
    caseId: "FIR-2026-0489",
    timestamp: "2026-07-02 02:45 AM",
    type: "fir_filed",
    title: "FIR #0489 Lodged at Whitefield Station",
    description: "Commercial Burglary report filed by Tech World manager. Shutter cut using heavy grinder.",
    sourceTag: "Whitefield SCRB Terminal"
  },
  {
    id: "e2",
    caseId: "FIR-2026-0489",
    timestamp: "2026-07-02 02:51 AM",
    type: "anpr_hit",
    title: "ANPR Camera Hit #882 (Silver SUV)",
    description: "Camera on ITPL Main Road captured KA-03-MN-4921 speeding away from incident locus.",
    sourceTag: "Traffic ANPR Subsystem"
  },
  {
    id: "e3",
    caseId: "FIR-2026-0489",
    timestamp: "2026-07-02 10:30 AM",
    type: "evidence_logged",
    title: "Forensic Evidence #489 Seized",
    description: "Recovered 2.4mm DeWalt grinder blade metal shards from broken door frame.",
    sourceTag: "Forensic Science Lab (FSL)"
  },

  // FIR-0512
  {
    id: "e4",
    caseId: "FIR-2026-0512",
    timestamp: "2026-07-09 03:15 AM",
    type: "fir_filed",
    title: "FIR #0512 Lodged at Indiranagar Station",
    description: "Armed robbery at Vogue Jewellers. 3.2 kg gold bullion stolen.",
    sourceTag: "Indiranagar Command Terminal"
  },
  {
    id: "e5",
    caseId: "FIR-2026-0512",
    timestamp: "2026-07-09 03:32 AM",
    type: "anpr_hit",
    title: "ANPR Hit on 100 Ft Road (KA-03-MN-4921)",
    description: "Silver XUV700 identified moving towards Old Airport Road.",
    sourceTag: "Traffic ANPR Subsystem"
  },
  {
    id: "e6",
    caseId: "FIR-2026-0512",
    timestamp: "2026-07-09 04:00 PM",
    type: "witness_statement",
    title: "Patrol Officer Statement Recorded",
    description: "Suresh Babu witnessed silver vehicle with blacked-out rear windshield.",
    sourceTag: "Investigator Field App"
  },

  // FIR-0560
  {
    id: "e7",
    caseId: "FIR-2026-0560",
    timestamp: "2026-07-20 01:50 AM",
    type: "fir_filed",
    title: "FIR #0560 Lodged at Marathahalli Station",
    description: "Armored cash van rammed at Outer Ring Road junction. ₹65 Lakhs looted.",
    sourceTag: "Marathahalli Precinct Terminal"
  },
  {
    id: "e8",
    caseId: "FIR-2026-0560",
    timestamp: "2026-07-21 06:15 PM",
    type: "arrest",
    title: "Suspect Vikram Singh Detained",
    description: "Arrest executed at Hoodi industrial yard; DeWalt grinder seized.",
    sourceTag: "Special Crime Unit"
  }
];

export const CaseTimelinesView: React.FC = () => {
  const { language } = useDashboardStore();
  const t = translations[language];

  const [comparedCaseIds, setComparedCaseIds] = useState<string[]>(["FIR-2026-0489", "FIR-2026-0512"]);

  const handleAddCase = (caseId: string) => {
    if (caseId && !comparedCaseIds.includes(caseId) && comparedCaseIds.length < 3) {
      setComparedCaseIds([...comparedCaseIds, caseId]);
    }
  };

  const handleRemoveCase = (caseId: string) => {
    if (comparedCaseIds.length > 1) {
      setComparedCaseIds(comparedCaseIds.filter((id) => id !== caseId));
    }
  };

  const getEventTypeBadge = (type: CaseEvent['type']) => {
    switch (type) {
      case 'fir_filed':
        return { label: 'FIR Filed', color: 'bg-[#0A0B0F] text-[#E8EAF0] border border-[#232631]' };
      case 'anpr_hit':
        return { label: 'ANPR Match', color: 'bg-teal-500/20 text-teal-300 border border-teal-500/30' };
      case 'evidence_logged':
        return { label: 'Evidence', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
      case 'witness_statement':
        return { label: 'Witness', color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' };
      case 'arrest':
        return { label: 'Arrest', color: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' };
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header & Multi-case comparison picker */}
      <div className="bg-[#14161C] text-[#E8EAF0] p-6 rounded-[24px] border border-[#232631] shadow-command flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight flex items-center gap-2 text-[#E8EAF0]">
            <Clock className="w-5 h-5 text-teal-400" />
            <span>{t.timelineTitle}</span>
          </h2>
          <p className="text-xs text-[#8A8F9C] font-mono">{t.timelineSubtitle}</p>
        </div>

        {/* Multi-Case Overlay Picker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0A0B0F] p-2 rounded-full border border-[#232631]">
            <Layers className="w-4 h-4 text-amber-400 ml-1" />
            <span className="text-xs font-mono text-[#8A8F9C]">{t.compareCases}:</span>
            <select
              onChange={(e) => handleAddCase(e.target.value)}
              value=""
              className="bg-[#14161C] text-[#E8EAF0] text-xs border border-[#232631] rounded-full px-3 py-1 font-mono focus:outline-none focus:border-teal-500 transition-colors"
            >
              <option value="">+ {t.selectOverlayCase}</option>
              {mockFIRs.map((f) => (
                <option key={f.caseId} value={f.caseId} disabled={comparedCaseIds.includes(f.caseId)}>
                  {f.caseId} ({f.station.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Case Side-by-Side Timelines Grid */}
      <div
        className={`grid gap-6 ${
          comparedCaseIds.length === 1
            ? 'grid-cols-1'
            : comparedCaseIds.length === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 lg:grid-cols-3'
        }`}
      >
        {comparedCaseIds.map((caseId) => {
          const fir = mockFIRs.find((f) => f.caseId === caseId);
          const caseEvents = mockEvents.filter((e) => e.caseId === caseId);

          return (
            <div
              key={caseId}
              className="bg-[#14161C] rounded-[24px] border border-[#232631] shadow-command p-6 flex flex-col space-y-4"
            >
              {/* Timeline Header */}
              <div className="flex items-center justify-between border-b border-[#232631] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-400 text-sm">{caseId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      Risk {fir?.riskScore}%
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-[#E8EAF0] text-sm truncate">{fir?.title}</h4>
                </div>

                {comparedCaseIds.length > 1 && (
                  <button
                    onClick={() => handleRemoveCase(caseId)}
                    className="p-1.5 text-[#8A8F9C] hover:text-rose-400 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Vertical Event Sequence */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#232631] pt-1">
                {caseEvents.map((evt) => {
                  const badge = getEventTypeBadge(evt.type);
                  return (
                    <div key={evt.id} className="relative pl-8 space-y-1">
                      {/* Timeline Dot */}
                      <span className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#14161C] shadow-glow-teal" />

                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-mono text-[#8A8F9C]">{evt.timestamp}</span>
                      </div>

                      <h5 className="font-display font-bold text-[#E8EAF0] text-xs pt-1">{evt.title}</h5>
                      <p className="text-xs text-[#8A8F9C] leading-relaxed">{evt.description}</p>

                      <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#8A8F9C]">
                        <FileText className="w-3 h-3 text-[#8A8F9C]" />
                        <span>{t.eventSource} {evt.sourceTag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cross-case temporal match callout */}
              <div className="mt-auto pt-3 border-t border-[#232631] bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/30 text-xs">
                <span className="font-bold text-teal-400 block font-mono">Cross-Case Temporal Correlation</span>
                <p className="text-[11px] text-[#8A8F9C]">
                  Occurrence window (02:00-03:30 AM) aligns precisely across adjacent Eastern precinct burglaries.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
