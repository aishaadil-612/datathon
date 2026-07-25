import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Lock,
  Layers,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useRouterStore } from '../../store/useRouterStore';
import { mockInsights } from '../../mock/insights';
import { mockFIRs } from '../../mock/fir';
import { mockAuditLogs } from '../../mock/auditLog';

// Data for Incident Activity Dual-Line Chart (Reported vs Resolved)
const incidentActivityData = [
  { day: 'Sat', reported: 12, resolved: 8 },
  { day: 'Sun', reported: 18, resolved: 11 },
  { day: 'Mon', reported: 15, resolved: 14 },
  { day: 'Tue', reported: 24, resolved: 19 },
  { day: 'Wed', reported: 28, resolved: 22 },
  { day: 'Thu', reported: 20, resolved: 17 },
  { day: 'Fri', reported: 32, resolved: 25 },
  { day: 'Sat', reported: 26, resolved: 21 },
];

// Data for Crime Category Distribution Gauge
const categoryDistribution = [
  { name: 'Theft & Burglary', value: 42, color: '#CCFF00', icon: '🔒' },
  { name: 'Armed Robbery', value: 24, color: '#F5A623', icon: '🚨' },
  { name: 'Assault / Violent', value: 16, color: '#E53935', icon: '⚠️' },
  { name: 'Cyber Fraud', value: 11, color: '#818CF8', icon: '💻' },
  { name: 'Narcotics', value: 7, color: '#10B981', icon: '💊' },
];

// Top Districts data
const districtVolumeData = [
  { name: 'Whitefield Sub-Division', count: '142 Cases', pct: 42, color: '#CCFF00' },
  { name: 'Indiranagar 100 Ft Corridor', count: '94 Cases', pct: 28, color: '#CCFF00' },
  { name: 'Hoodi ORR Transit Sector', count: '61 Cases', pct: 18, color: '#F5A623' },
  { name: 'Kalyan Nagar Commercial', count: '40 Cases', pct: 12, color: '#E53935' },
];

// Avatar stack mock
const assignedInvestigators = [
  { id: '1', name: 'Insp. S. Patil', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: '2', name: 'ACP K. Ramachandra', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
  { id: '3', name: 'Sub-Insp. M. Rao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
  { id: '4', name: 'Analyst P. Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
];

export const OverviewView: React.FC = () => {
  const { openExplainability, setSelectedCaseId } = useDashboardStore();
  const { setActiveView } = useRouterStore();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'cases' | 'suspects' | 'evidence' | 'timeline'>('cases');

  const handleInsightClick = (insight: typeof mockInsights[0]) => {
    openExplainability({
      conclusion: insight.text,
      confidence: insight.confidence,
      reasoningSteps: insight.reasoningSteps,
      evidenceSources: insight.sourceIds.map((id) => ({
        id,
        label: id,
        type: id.startsWith('FIR') ? 'FIR Record' : id.startsWith('v') ? 'Vehicle Record' : 'Zone Polygon'
      })),
      agentAttribution: {
        name: insight.agent,
        type: 'CrimeLens Deep Pipeline',
        version: 'v3.2',
        latencyMs: 420
      }
    });
  };

  return (
    <section id="section-overview" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto select-none min-h-screen border-b border-[#22242D]">
      {/* Section Header Narrative Tag */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-[#CCFF00] bg-[#CCFF00]/10 px-3.5 py-1.5 rounded-full border border-[#CCFF00]/30">
          <Layers className="w-4 h-4" />
          <span>02 — COMMAND OVERVIEW</span>
        </div>
        <span className="text-xs sm:text-sm font-mono font-bold text-[#E2E8F0] hidden sm:block">
          Precinct Operational Metrics & Multi-Vector Intelligence Feed
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ROW 1: PRIMARY KPI TRIO (Active Cases, Open Alerts, Avg Response) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* KPI 1: Active Cases (Lime Green Card) */}
        <motion.div
          whileHover={{ translateY: -3, scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className="bg-[#8CBF26] text-[#0B0C0E] rounded-[24px] p-5 sm:p-6 shadow-command transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#0B0C0E]/20 text-[#0B0C0E] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#0B0C0E] uppercase tracking-wider block">Active Investigations</span>
                <p className="text-xs text-[#0B0C0E] font-mono font-bold">4 High Priority FIRs</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('search')}
              className="w-9 h-9 rounded-full bg-[#0B0C0E] text-[#8CBF26] hover:bg-[#0B0C0E]/80 flex items-center justify-center transition-colors font-bold shadow-md"
              title="Expand Cases"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B0C0E] tracking-tight tabular-nums">
              24
            </div>
            <div className="px-3 py-1 rounded-full bg-[#0B0C0E] text-[#8CBF26] text-xs font-extrabold flex items-center gap-1 font-mono shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+12%</span>
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Open Alerts (Warm Amber/Orange Card) */}
        <motion.div
          whileHover={{ translateY: -3, scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className="bg-[#C66900] text-[#0B0C0E] rounded-[24px] p-5 sm:p-6 shadow-command transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#0B0C0E]/20 text-[#0B0C0E] flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#0B0C0E] uppercase tracking-wider block">Open System Alerts</span>
                <p className="text-xs text-[#0B0C0E] font-mono font-bold">2 Predicted Hotspots</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('hotspots')}
              className="w-9 h-9 rounded-full bg-[#0B0C0E] text-[#C66900] hover:bg-[#0B0C0E]/80 flex items-center justify-center transition-colors font-bold shadow-md"
              title="Expand Alerts Map"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B0C0E] tracking-tight tabular-nums">
              03
            </div>
            <div className="px-3 py-1 rounded-full bg-[#0B0C0E] text-[#FFB020] text-xs font-extrabold flex items-center gap-1 font-mono shadow-sm">
              <span>ACTIVE MONITORING</span>
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Avg Response Time (Deep Crimson Card) */}
        <motion.div
          whileHover={{ translateY: -3, scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className="bg-[#7F1D1D] text-white rounded-[24px] p-5 sm:p-6 shadow-command transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-white uppercase tracking-wider block">Avg Resolution Time</span>
                <p className="text-xs text-white/90 font-mono font-bold">Copilot Pipeline Accelerated</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('timelines')}
              className="w-9 h-9 rounded-full bg-white text-[#7F1D1D] hover:bg-white/90 flex items-center justify-center transition-colors font-bold shadow-md"
              title="Expand Timelines"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              4.2 <span className="text-lg text-white/90 font-bold">Days</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white text-[#7F1D1D] text-xs font-extrabold flex items-center gap-1 font-mono shadow-sm">
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>-1.8 Days</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ROW 2: COMPACT SECONDARY KPI TRIO */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-[#14151B] border border-[#22242D] hover:border-rose-500/40 rounded-[20px] px-5 py-4 flex items-center justify-between transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#E2E8F0] block">High-Risk Spatial Zones</span>
              <div className="font-display font-extrabold text-xl sm:text-2xl text-[#FFFFFF]">06 Sectors</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-extrabold font-mono border border-rose-500/30">
            +2 PREDICTED
          </span>
        </div>

        <div className="bg-[#14151B] border border-[#22242D] hover:border-teal-500/40 rounded-[20px] px-5 py-4 flex items-center justify-between transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#E2E8F0] block">Case Resolution Rate</span>
              <div className="font-display font-extrabold text-xl sm:text-2xl text-[#FFFFFF]">82.4%</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-extrabold font-mono border border-teal-500/30">
            ▲ +4.5% MoM
          </span>
        </div>

        <div className="bg-[#14151B] border border-[#22242D] hover:border-amber-500/40 rounded-[20px] px-5 py-4 flex items-center justify-between transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#E2E8F0] block">Cases Filed Today</span>
              <div className="font-display font-extrabold text-xl sm:text-2xl text-[#FFFFFF]">35 Incidents</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold font-mono border border-amber-500/30">
            ▲ +8.2%
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN BODY GRID: LEFT HERO VISUALIZATIONS & RIGHT PROFILE COLUMN */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: GAUGE HERO + SUB-TABS FEATURED CASE (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CRIME CATEGORY DISTRIBUTION GAUGE (HERO VISUALIZATION) */}
          <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-6 shadow-command">
            <div className="flex items-center justify-between border-b border-[#22242D] pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-[#FFFFFF]">Crime Category Distribution</h2>
                <p className="text-xs text-[#9FA4B2]">Real-time risk index segmentation by crime vector</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                <Filter className="w-3.5 h-3.5" />
                <span>{selectedCategoryFilter || 'All Crime Vectors'}</span>
              </div>
            </div>

            {/* Gauge Hero Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Semi-circular Donut Gauge */}
              <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[230px]">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="80%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={78}
                      outerRadius={108}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#14151B"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Big Number Centered inside Gauge (positioned cleanly below arc) */}
                <div className="absolute top-[78%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none bg-[#0B0C0E]/95 border border-[#22242D] px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
                  <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#FFFFFF] tracking-tight tabular-nums">
                    1,248
                  </div>
                  <div className="text-xs font-mono font-extrabold text-[#CCFF00] uppercase tracking-wider">
                    Active Risk Score
                  </div>
                </div>
              </div>

              {/* Top Districts by Volume Progress Bars */}
              <div className="md:col-span-6 space-y-3.5 border-t md:border-t-0 md:border-l border-[#22242D] pt-4 md:pt-0 md:pl-6">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#E2E8F0] mb-3">
                  Top Districts by Incident Volume
                </h3>
                {districtVolumeData.map((district) => (
                  <div key={district.name} className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FFFFFF] truncate">{district.name}</span>
                      <span className="font-mono text-[#E2E8F0] font-bold text-xs">{district.count} ({district.pct}%)</span>
                    </div>
                    <div className="w-full bg-[#0B0C0E] h-2.5 rounded-full overflow-hidden border border-[#22242D]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${district.pct}%`, backgroundColor: district.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crime-type Circular Icon Row under Gauge */}
            <div className="pt-4 border-t border-[#22242D] flex flex-wrap items-center justify-center gap-3">
              {categoryDistribution.map((cat) => {
                const isSelected = selectedCategoryFilter === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                      isSelected
                        ? 'bg-[#CCFF00] text-slate-950 shadow-glow-teal border border-[#CCFF00]'
                        : 'bg-[#1B1C24] text-[#E2E8F0] hover:text-[#FFFFFF] border border-[#22242D]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${cat.color}35` }}>
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                    <span className="font-mono text-xs opacity-90">({cat.value}%)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUB-TABS: CASES / SUSPECTS / EVIDENCE / TIMELINE & FEATURED CASE CARD */}
          <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-5 shadow-command">
            {/* Segmented Pill Underline Sub-Tabs */}
            <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('cases')}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeSubTab === 'cases' ? 'text-teal-400 bg-teal-500/10' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>Featured Cases</span>
                  {activeSubTab === 'cases' && (
                    <motion.div layoutId="subtabLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSubTab('suspects')}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeSubTab === 'suspects' ? 'text-teal-400 bg-teal-500/10' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>Suspects Network</span>
                  {activeSubTab === 'suspects' && (
                    <motion.div layoutId="subtabLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSubTab('evidence')}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeSubTab === 'evidence' ? 'text-teal-400 bg-teal-500/10' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>Evidence Vault</span>
                  {activeSubTab === 'evidence' && (
                    <motion.div layoutId="subtabLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setActiveView('search')}
                className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Featured Active Case Card (Reference's Red Sox Fill-% Card equivalent) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Primary Case Progress Card */}
              <div className="md:col-span-8 bg-[#0B0C0E] border border-[#22242D] rounded-[20px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold font-mono text-xs">
                      FIR
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-[#FFFFFF]">
                        FIR-2026-0489: Serial Warehouse Burglary
                      </h4>
                      <p className="text-xs text-[#9FA4B2]">Whitefield Industrial Area • Assigned to Team Alpha</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-mono font-bold border border-teal-500/30">
                    75% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9FA4B2]">
                    <span>Investigation Phase: Charge-sheet Preparation</span>
                    <span className="text-teal-400 font-bold">75% Full</span>
                  </div>
                  <div className="w-full bg-[#14151B] h-2.5 rounded-full overflow-hidden border border-[#22242D]">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-full rounded-full w-[75%]" />
                  </div>
                </div>

                {/* Case Stats Row & Investigators Avatar Stack */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#22242D]">
                  {/* Avatar Stack */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#9FA4B2] font-mono">Assigned:</span>
                    <div className="flex items-center -space-x-2">
                      {assignedInvestigators.map((inv) => (
                        <img
                          key={inv.id}
                          src={inv.avatar}
                          alt={inv.name}
                          className="w-7 h-7 rounded-full border-2 border-[#14151B] object-cover"
                          title={inv.name}
                        />
                      ))}
                      <div className="w-7 h-7 rounded-full bg-[#1B1C24] border-2 border-[#14151B] text-teal-400 text-[10px] font-bold font-mono flex items-center justify-center">
                        +3
                      </div>
                    </div>
                  </div>

                  {/* Stat Metrics */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[#9FA4B2] block text-[10px]">Linked Assets</span>
                      <span className="text-[#FFFFFF] font-bold">$44,500</span>
                    </div>
                    <div>
                      <span className="text-[#9FA4B2] block text-[10px]">Evidence Items</span>
                      <span className="text-teal-400 font-bold">12 Items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Card: "This Week's Case Load" */}
              <div className="md:col-span-4 bg-[#0B0C0E] border border-[#22242D] rounded-[20px] p-5 space-y-3 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs text-[#9FA4B2] font-mono uppercase tracking-wider block">This Week's Case Load</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display font-bold text-2xl text-[#FFFFFF]">14 FIRs</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 text-[11px] font-bold">
                      ▲ +4.5%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#22242D] flex items-center justify-between text-xs font-mono text-[#9FA4B2]">
                  <span>Average Clearance</span>
                  <span className="text-[#FFFFFF] font-bold">$2,200/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICER PROFILE & DUAL-LINE ACTIVITY CHART (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SIGNED-IN OFFICER PROFILE CARD (Reference's John Williams Card equivalent) */}
          <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-5 shadow-command">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Commander Vance"
                  className="w-14 h-14 rounded-full border-2 border-teal-400 object-cover shadow-glow-teal"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#14151B]" />
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-[#FFFFFF]">Commander J. Vance</h3>
                <p className="text-xs text-teal-400 font-medium">Chief Intelligence Analyst</p>
                <p className="text-[10px] text-[#9FA4B2] font-mono mt-0.5">Last login: Today at 08:42 AM</p>
              </div>
            </div>

            {/* Cases Closed (Lime Green) / Cases Escalated (Maroon Red) Colored Stat Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#8CBF26] text-[#0B0C0E] rounded-2xl p-3.5 space-y-1 shadow-md">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#0B0C0E]/80">
                  <span>Closed</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#0B0C0E]/15 text-[#0B0C0E]">▲ +4.5%</span>
                </div>
                <div className="font-display font-extrabold text-xl text-[#0B0C0E]">$3,433.0</div>
                <span className="text-[10px] text-[#0B0C0E]/70 font-mono block">24 Charge-sheets</span>
              </div>

              <div className="bg-[#7F1D1D] text-white rounded-2xl p-3.5 space-y-1 shadow-md">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white/80">
                  <span>Escalated</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">▼ -5.2%</span>
                </div>
                <div className="font-display font-extrabold text-xl text-white">$11,443</div>
                <span className="text-[10px] text-white/70 font-mono block">11 High Priority</span>
              </div>
            </div>
          </div>

          {/* DUAL-LINE INCIDENT ACTIVITY CHART (Reference's Funds Activity equivalent) */}
          <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-4 shadow-command">
            <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#FFFFFF]">Incident Activity</h3>
                <p className="text-xs text-[#9FA4B2]">Reported vs. Resolved dual trend</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" /> Reported
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Resolved
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[180px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#9FA4B2" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9FA4B2" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#14151B', borderColor: '#22242D', borderRadius: '12px', fontSize: '11px', color: '#FFFFFF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reported"
                    stroke="#CCFF00"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#CCFF00', strokeWidth: 2, stroke: '#14151B' }}
                    activeDot={{ r: 6, fill: '#CCFF00', stroke: '#FFFFFF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#F5A623"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#F5A623', strokeWidth: 2, stroke: '#14151B' }}
                    activeDot={{ r: 6, fill: '#F5A623', stroke: '#FFFFFF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Active/Under Review Chips under Chart */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#22242D]">
              <div className="bg-[#0B0C0E] p-3 rounded-xl border border-[#22242D] text-center">
                <span className="text-[10px] text-[#9FA4B2] font-mono block">Active Monitoring</span>
                <span className="font-display font-bold text-sm text-teal-400">$1,443.0</span>
              </div>
              <div className="bg-[#0B0C0E] p-3 rounded-xl border border-[#22242D] text-center">
                <span className="text-[10px] text-[#9FA4B2] font-mono block">Under Review</span>
                <span className="font-display font-bold text-sm text-amber-400">$440.0</span>
              </div>
            </div>
          </div>

          {/* RECENT AUDIT EVENTS LIST (Reference's Transactions list equivalent) */}
          <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-4 shadow-command">
            <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
              <h3 className="font-display font-bold text-base text-[#FFFFFF]">Recent Audit Events</h3>
              <button
                onClick={() => setActiveView('audit')}
                className="text-xs font-mono text-teal-400 hover:underline"
              >
                View Audit Log
              </button>
            </div>

            <div className="space-y-3">
              {mockAuditLogs.slice(0, 3).map((log) => (
                <div
                  key={log.logId}
                  className="p-3 rounded-2xl bg-[#0B0C0E] border border-[#22242D] hover:border-teal-500/40 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-[#FFFFFF] block truncate">{log.user}</span>
                      <span className="text-[10px] text-[#9FA4B2] font-mono">{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 text-[10px] font-mono font-bold border border-teal-500/30 shrink-0">
                    {log.confidence}% CONF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME AI INTELLIGENCE FEED & SERIAL CASE SUMMARY */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Real-Time AI Insights Feed */}
        <div className="lg:col-span-2 bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-4 shadow-command">
          <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="font-display font-bold text-[#FFFFFF] text-base">Real-time Intelligence Feed</h3>
            </div>
            <span className="text-xs font-mono text-[#9FA4B2]">Governance & Explainability Pipeline</span>
          </div>

          <div className="space-y-4">
            {mockInsights.map((insight) => (
              <div
                key={insight.insightId}
                className="p-4 rounded-2xl border border-[#22242D] bg-[#0B0C0E] hover:bg-[#1B1C24]/60 hover:border-teal-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <h4 className="font-bold text-[#FFFFFF] text-sm">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#9FA4B2]">{insight.timestamp}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#9FA4B2] leading-relaxed">{insight.text}</p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#9FA4B2] font-mono text-[11px]">
                    Agent: <strong className="text-[#FFFFFF]">{insight.agent}</strong>
                  </span>

                  <button
                    onClick={() => handleInsightClick(insight)}
                    className="inline-flex items-center gap-1.5 font-mono font-semibold text-teal-400 hover:text-teal-300 hover:underline"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>View Reasoning & Provenance →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Robbery Ring FIR Summary List */}
        <div className="bg-[#14151B] border border-[#22242D] rounded-[24px] p-6 space-y-4 shadow-command flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
              <h3 className="font-display font-bold text-[#FFFFFF] text-base">Linked Burglary Ring FIRs</h3>
              <button
                onClick={() => setActiveView('search')}
                className="text-xs font-mono text-teal-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {mockFIRs.map((fir) => (
                <div
                  key={fir.caseId}
                  onClick={() => {
                    setSelectedCaseId(fir.caseId);
                    setActiveView('search');
                  }}
                  className="p-3.5 rounded-xl border border-[#22242D] bg-[#0B0C0E] hover:border-teal-500/50 hover:bg-[#1B1C24] cursor-pointer transition-all space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-teal-400">
                    <span>{fir.caseId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Risk {fir.riskScore}%
                    </span>
                  </div>
                  <p className="font-semibold text-[#FFFFFF] truncate">{fir.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#9FA4B2] font-mono pt-0.5">
                    <span>{fir.station}</span>
                    <span>{fir.dateTime.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-[#FFFFFF] space-y-1 mt-4">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cross-Case Pattern Note</span>
            </div>
            <p className="text-[11px] text-[#9FA4B2] leading-snug font-sans">
              All 4 FIRs linked by vehicle plate KA-03-MN-4921 and DeWalt grinder lock cutting MO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
