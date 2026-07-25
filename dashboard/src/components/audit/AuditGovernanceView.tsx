import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  Info
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockAuditLogs } from '../../mock/auditLog';
import { AuditLogEntry } from '../../types';

export const AuditGovernanceView: React.FC = () => {
  const { role, language, openExplainability } = useDashboardStore();
  const t = translations[language];

  const [expandedLogId, setExpandedLogId] = useState<string | null>("AUD-2026-9041");
  const [searchTerm, setSearchTerm] = useState<string>('');

  const visibleLogs = useMemo(() => {
    let logs = mockAuditLogs;

    if (role === 'investigator') {
      logs = logs.filter((l) => l.role === 'investigator');
    }

    if (searchTerm) {
      logs = logs.filter(
        (l) =>
          l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.toolInvoked.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return logs;
  }, [role, searchTerm]);

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const handleInspectRow = (log: AuditLogEntry) => {
    openExplainability({
      conclusion: `Audit Ledger Verification: Query '${log.query}' executed with ${log.confidence}% confidence via ${log.toolInvoked}.`,
      confidence: log.confidence,
      reasoningSteps: log.reasoningSteps,
      evidenceSources: log.recordsTouched.map((r) => ({
        id: r,
        label: r,
        type: "Audit Touched Record"
      })),
      agentAttribution: {
        name: log.toolInvoked,
        type: "Governance Audit Engine",
        version: "v3.2 SHA-256",
        latencyMs: log.executionTimeMs
      }
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header with Immutability Lock Badge */}
      <div className="bg-[#14161C] text-[#E8EAF0] p-6 rounded-[24px] border border-[#232631] shadow-command flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-[#E8EAF0]">{t.auditTitle}</h2>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.auditLockTag}</span>
            </div>
          </div>
          <p className="text-xs text-[#8A8F9C] font-mono">{t.auditSubtitle}</p>
        </div>

        {/* Role Access Scope Info Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0A0B0F] px-4 py-1.5 rounded-full border border-[#232631] text-xs font-mono text-[#8A8F9C]">
            <span>Role Scope: </span>
            <strong className="text-amber-400 uppercase">{role}</strong>
          </div>
        </div>
      </div>

      {/* Role Notice for Investigator Mode */}
      {role === 'investigator' && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-300 flex items-center gap-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t.investigatorNotice}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A8F9C]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by officer name, query string, or tool invoked..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#14161C] border border-[#232631] rounded-full text-xs text-[#E8EAF0] placeholder:text-[#8A8F9C]/60 focus:outline-none focus:border-teal-500 transition-colors font-sans"
          />
        </div>
      </div>

      {/* Compliance Audit Table */}
      <div className="bg-[#14161C] rounded-[24px] border border-[#232631] shadow-command overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#0A0B0F] text-[#8A8F9C] font-mono text-[11px] uppercase tracking-wider border-b border-[#232631]">
              <tr>
                <th className="py-3.5 px-5">Log ID & {t.colTimestamp}</th>
                <th className="py-3.5 px-5">{t.colUser}</th>
                <th className="py-3.5 px-5">{t.colQuery}</th>
                <th className="py-3.5 px-5">{t.colTool}</th>
                <th className="py-3.5 px-5">{t.colConfidence}</th>
                <th className="py-3.5 px-5 text-right">Reasoning Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232631]">
              {visibleLogs.map((log) => {
                const isExpanded = expandedLogId === log.logId;
                return (
                  <React.Fragment key={log.logId}>
                    <tr
                      onClick={() => toggleExpand(log.logId)}
                      className={`hover:bg-[#1E222D] cursor-pointer transition-colors ${
                        isExpanded ? 'bg-[#1E222D]/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono">
                        <span className="font-bold text-teal-400 block">{log.logId}</span>
                        <span className="text-[11px] text-[#8A8F9C]">{log.timestamp}</span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#E8EAF0] block">{log.user}</span>
                        <span className="text-[10px] font-mono text-[#8A8F9C]">{log.userRank}</span>
                      </td>

                      <td className="py-3.5 px-5 max-w-md">
                        <p className="text-[#E8EAF0] font-medium line-clamp-2">{log.query}</p>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                          {log.toolInvoked}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-mono font-bold text-teal-400">
                        {log.confidence}%
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(log.logId);
                          }}
                          className="p-1 text-[#8A8F9C] hover:text-[#E8EAF0]"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Reasoning Trail Details */}
                    {isExpanded && (
                      <tr className="bg-[#0A0B0F] border-b border-[#232631]">
                        <td colSpan={6} className="p-5">
                          <div className="bg-[#14161C] p-4 rounded-2xl border border-[#232631] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#232631] pb-2">
                              <span className="font-bold text-xs text-[#E8EAF0] font-mono flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-amber-400" />
                                Execution Reasoning Trail & Evidence Touched
                              </span>
                              <button
                                onClick={() => handleInspectRow(log)}
                                className="text-xs font-mono font-bold text-teal-400 hover:underline flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Open Full Explainability Drawer →
                              </button>
                            </div>

                            <div className="space-y-2">
                              {log.reasoningSteps.map((step, idx) => (
                                <div key={idx} className="text-xs text-[#8A8F9C] bg-[#0A0B0F] p-3 rounded-xl border border-[#232631] font-sans">
                                  {step}
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 flex items-center gap-2 text-xs">
                              <Database className="w-4 h-4 text-teal-400" />
                              <span className="font-mono text-[#8A8F9C]">Records Touched:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {log.recordsTouched.map((r, i) => (
                                  <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
