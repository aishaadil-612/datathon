import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  Clock,
  GitFork,
  ShieldCheck,
  Car,
  User,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockFIRs } from '../../mock/fir';

export const CaseSearchRecordsView: React.FC = () => {
  const {
    globalSearchQuery,
    setGlobalSearchQuery,
    language,
    setSelectedCaseId,
    setActiveView,
    openExplainability
  } = useDashboardStore();

  const t = translations[language];

  const [crimeTypeFilter, setCrimeTypeFilter] = useState<string>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [minRiskScore, setMinRiskScore] = useState<number>(50);

  const filteredCases = useMemo(() => {
    return mockFIRs.filter((fir) => {
      const matchesSearch =
        !globalSearchQuery ||
        fir.caseId.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        fir.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        fir.station.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        fir.summary.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        fir.vehiclesInvolved.some((v) => v.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
        fir.suspects.some((s) => s.toLowerCase().includes(globalSearchQuery.toLowerCase()));

      const matchesCrime = crimeTypeFilter === 'all' || fir.crimeType === crimeTypeFilter;
      const matchesStation = stationFilter === 'all' || fir.station.includes(stationFilter);
      const matchesRisk = fir.riskScore >= minRiskScore;

      return matchesSearch && matchesCrime && matchesStation && matchesRisk;
    });
  }, [globalSearchQuery, crimeTypeFilter, stationFilter, minRiskScore]);

  const handleExplainCaseTag = (caseId: string, title: string, riskScore: number) => {
    openExplainability({
      conclusion: `Case ${caseId} flagged with high risk score (${riskScore}%) due to serial MO match and vehicle registration KA-03-MN-4921 linkage.`,
      confidence: riskScore,
      reasoningSteps: [
        "1. Ingested crime report into Case Intelligence Agent RAG pipeline.",
        "2. ANPR snapshot confirmed presence of vehicle KA-03-MN-4921.",
        "3. FSL lock cut analysis confirmed 2.4mm DeWalt grinder blade pattern.",
        "4. Risk score calculated using XGBoost multi-vector threat model."
      ],
      evidenceSources: [
        { id: caseId, label: caseId, type: "FIR Record" },
        { id: "v1", label: "KA-03-MN-4921", type: "Vehicle Plate" },
        { id: "w1", label: "DeWalt Grinder", type: "Forensic Tool" }
      ],
      agentAttribution: {
        name: "Case Intelligence Agent",
        type: "RAG + Risk Scoring Pipeline",
        version: "v3.2",
        latencyMs: 380
      }
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Search Bar & Faceted Filter Bar */}
      <div className="bg-[#14151B] text-[#FFFFFF] p-6 rounded-[24px] border border-[#22242D] shadow-command space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight flex items-center gap-2 text-[#FFFFFF]">
            <Search className="w-5 h-5 text-teal-400" />
            <span>{t.searchTitle}</span>
          </h2>
          <p className="text-xs text-[#9FA4B2] font-mono">{t.searchSubtitle}</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#9FA4B2] pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search by FIR ID, vehicle plate, suspect name, station, or modus operandi..."
            className="w-full pl-11 pr-4 py-3 bg-[#0B0C0E] border border-[#22242D] rounded-full text-sm text-[#FFFFFF] placeholder:text-[#9FA4B2]/60 focus:outline-none focus:border-teal-500 font-sans transition-colors"
          />
        </div>

        {/* Faceted Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
          <div className="flex items-center gap-2 bg-[#0B0C0E] px-3.5 py-1.5 rounded-full border border-[#22242D]">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#9FA4B2]">{t.filterCrimeType}:</span>
            <select
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
              className="bg-[#14151B] text-[#FFFFFF] border border-[#22242D] rounded-full px-2.5 py-0.5 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Commercial Burglary">Commercial Burglary</option>
              <option value="Armed Robbery">Armed Robbery</option>
              <option value="Warehouse Heist">Warehouse Heist</option>
              <option value="Armed Heist">Armed Heist</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0B0C0E] px-3.5 py-1.5 rounded-full border border-[#22242D]">
            <span className="text-[#9FA4B2]">{t.filterDistrict}:</span>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="bg-[#14151B] text-[#FFFFFF] border border-[#22242D] rounded-full px-2.5 py-0.5 focus:outline-none"
            >
              <option value="all">All Stations</option>
              <option value="Whitefield">Whitefield</option>
              <option value="Indiranagar">Indiranagar</option>
              <option value="Koramangala">Koramangala</option>
              <option value="Marathahalli">Marathahalli</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0B0C0E] px-3.5 py-1.5 rounded-full border border-[#22242D]">
            <span className="text-[#9FA4B2]">Min Risk Score:</span>
            <input
              type="range"
              min="50"
              max="95"
              value={minRiskScore}
              onChange={(e) => setMinRiskScore(Number(e.target.value))}
              className="w-24 accent-teal-400 cursor-pointer"
            />
            <span className="font-bold text-teal-400">{minRiskScore}%</span>
          </div>

          <span className="ml-auto text-[#9FA4B2] text-xs">
            Showing <strong className="text-[#FFFFFF]">{filteredCases.length}</strong> matching records
          </span>
        </div>
      </div>

      {/* Case Result Cards Grid */}
      <div className="space-y-4">
        {filteredCases.map((fir) => (
          <div
            key={fir.caseId}
            className="bg-[#14151B] rounded-[24px] border border-[#22242D] shadow-command p-6 space-y-4 hover:border-teal-500/40 transition-all"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#22242D] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-teal-400 text-base">{fir.caseId}</span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  {fir.station}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0B0C0E] text-[#9FA4B2] border border-[#22242D]">
                  {fir.crimeType}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#9FA4B2]">{fir.dateTime}</span>
                <button
                  onClick={() => handleExplainCaseTag(fir.caseId, fir.title, fir.riskScore)}
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Risk Score {fir.riskScore}%</span>
                </button>
              </div>
            </div>

            {/* Title & Summary */}
            <div className="space-y-1">
              <h3 className="font-display font-bold text-[#FFFFFF] text-base">{fir.title}</h3>
              <p className="text-sm text-[#9FA4B2] leading-relaxed font-sans">{fir.summary}</p>
            </div>

            {/* Entities & Vehicles Involved */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#0B0C0E] p-4 rounded-xl border border-[#22242D]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[#9FA4B2] font-mono">Suspects:</span>
                <span className="font-semibold text-[#FFFFFF] truncate">{fir.suspects.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[#9FA4B2] font-mono">Vehicles:</span>
                <span className="font-mono font-bold text-teal-400 truncate">{fir.vehiclesInvolved.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[#9FA4B2] font-mono">MO Tags:</span>
                <span className="font-semibold text-[#FFFFFF] truncate">{fir.moTags.join(' • ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#22242D] text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCaseId(fir.caseId);
                    setActiveView('timelines');
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#0B0C0E] text-[#FFFFFF] hover:text-teal-400 border border-[#22242D] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Timeline View</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCaseId(fir.caseId);
                    setActiveView('network');
                  }}
                  className="px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5 text-teal-400" />
                  <span>Filter Network Graph</span>
                </button>
              </div>

              <button
                onClick={() => handleExplainCaseTag(fir.caseId, fir.title, fir.riskScore)}
                className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Explain AI Tags</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
