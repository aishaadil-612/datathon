import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  User,
  Globe,
  Radio,
  Check,
  ChevronDown,
  Sparkles,
  GitFork,
  Clock,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useRouterStore, AppView } from '../../store/useRouterStore';
import { translations } from '../../i18n/translations';
import { Role } from '../../types';
import { CrimeLensLogo } from '../common/CrimeLensLogo';
import { QuickActionModal } from './QuickActionModal';

export const TopBar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    globalSearchQuery,
    setGlobalSearchQuery,
    alertCount,
    clearAlerts,
    themeMode,
    toggleThemeMode
  } = useDashboardStore();

  const { activeView, setActiveView } = useRouterStore();

  const t = translations[language];
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      setActiveView('search');
    }
  };

  const primaryTabs: { id: AppView; label: string; number: string }[] = [
    { id: 'iris', label: 'Ask IRIS', number: '01' },
    { id: 'overview', label: 'Command Overview', number: '02' },
    { id: 'hotspots', label: 'Hotspot Intelligence', number: '03' },
    { id: 'inside-iris', label: 'Inside IRIS', number: '04' },
  ];

  const investigatorTools: { id: AppView; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'network', label: 'Criminal Network Graph', icon: <GitFork className="w-4 h-4 text-amber-400" />, desc: 'Multi-hop entity connection graph' },
    { id: 'timelines', label: 'Case Serial Timelines', icon: <Clock className="w-4 h-4 text-teal-400" />, desc: 'Cross-precinct temporal match' },
    { id: 'search', label: 'Global Case Search', icon: <Search className="w-4 h-4 text-[#CCFF00]" />, desc: 'Faceted FIR & suspect query' },
    { id: 'audit', label: 'Audit & Governance Log', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, desc: 'Immutable SHA-256 audit ledger' },
  ];

  return (
    <>
      <header className="bg-[#0B0C0E]/95 backdrop-blur-md border-b border-[#22242D] sticky top-0 z-40 select-none">
        {/* Upper Header Row */}
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Brand Identity with CrimeLens Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setActiveView('iris')} className="flex items-center gap-3 text-left">
              <CrimeLensLogo size="md" showWordmark={true} />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-mono border border-[#CCFF00]/20 font-bold">
                v3.2 AI
              </span>
            </button>
          </div>

          {/* Center: Global Intelligent Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#CBD5E1] pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search cases, suspects, vehicles, locations…"
                className="w-full pl-10 pr-8 py-2 bg-[#14151B] border border-[#22242D] rounded-full text-xs sm:text-sm text-[#FFFFFF] placeholder:text-[#CBD5E1]/60 focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30 transition-all font-sans"
              />
              {globalSearchQuery && (
                <button
                  type="button"
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-3.5 text-xs text-[#CBD5E1] hover:text-[#FFFFFF]"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Right Controls: Quick Action +, Notification Bell, Tools Dropdown, Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Command Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span className="font-semibold">{t.liveBadge}</span>
            </div>

            {/* Circular Quick Action (+) Button */}
            <button
              onClick={() => setShowQuickAction(true)}
              className="w-9 h-9 rounded-full bg-[#CCFF00] text-slate-950 hover:bg-[#b8ef00] flex items-center justify-center font-bold shadow-glow-teal transition-all hover:scale-105 active:scale-95"
              title="File New Case / Quick Action"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Circular Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => setShowAlertMenu(!showAlertMenu)}
                className="w-9 h-9 rounded-full bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] text-[#FFFFFF] flex items-center justify-center relative transition-colors"
                title="Alerts & Notifications"
              >
                <Bell className="w-4 h-4 text-[#CBD5E1] hover:text-[#FFFFFF]" />
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {alertCount}
                  </span>
                )}
              </button>

              {showAlertMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#14151B] border border-[#22242D] rounded-2xl shadow-2xl py-2 z-50 text-xs space-y-1">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-[#22242D]">
                    <span className="font-bold text-[#FFFFFF]">CrimeLens System Alerts</span>
                    {alertCount > 0 && (
                      <button onClick={clearAlerts} className="text-[10px] text-[#CCFF00] hover:underline font-bold">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#22242D]">
                    <div
                      className="p-3 hover:bg-[#1B1C24] cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveView('hotspots');
                        setShowAlertMenu(false);
                      }}
                    >
                      <span className="text-rose-400 font-semibold block">Emerging Hotspot Warning</span>
                      <span className="text-[#CBD5E1] text-[11px]">
                        88% risk score calculated for Hoodi ORR Corridor next 30 days.
                      </span>
                    </div>
                    <div
                      className="p-3 hover:bg-[#1B1C24] cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveView('network');
                        setShowAlertMenu(false);
                      }}
                    >
                      <span className="text-amber-400 font-semibold block">Vehicle Match Alert</span>
                      <span className="text-[#CBD5E1] text-[11px]">
                        Silver SUV KA-03-MN-4921 linked across 4 active FIRs.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Investigator Tools Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-mono transition-colors font-bold ${
                  ['network', 'timelines', 'search', 'audit'].includes(activeView)
                    ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40'
                    : 'bg-[#14151B] hover:bg-[#1B1C24] border-[#22242D] text-[#FFFFFF]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="hidden sm:inline">Investigator Tools</span>
                <ChevronDown className="w-3 h-3 text-[#CBD5E1]" />
              </button>

              {showToolsMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#14151B] border border-[#22242D] rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#CBD5E1] uppercase border-b border-[#22242D] font-bold">
                    Deep Analysis Modules
                  </div>
                  {investigatorTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveView(tool.id);
                        setShowToolsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#1B1C24] transition-colors flex items-start gap-2.5"
                    >
                      <div className="mt-0.5">{tool.icon}</div>
                      <div>
                        <span className="font-bold text-[#FFFFFF] block text-xs sm:text-sm">{tool.label}</span>
                        <span className="text-[11px] text-[#CBD5E1] block">{tool.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher Toggle Button (Dark / Light Theme) */}
            <button
              onClick={toggleThemeMode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14151B] theme-card hover:bg-[#1B1C24] border border-[#22242D] theme-border rounded-full text-xs font-mono font-bold text-[#FFFFFF] theme-text transition-all"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Theme`}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden md:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] rounded-full text-xs font-mono text-[#FFFFFF] font-bold transition-colors"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>{t.langToggle}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#14151B] hover:bg-[#1B1C24] border border-[#22242D] rounded-full text-xs font-semibold text-[#FFFFFF] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize hidden sm:inline">{role}</span>
                <ChevronDown className="w-3 h-3 text-[#CBD5E1]" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#14151B] border border-[#22242D] rounded-2xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#CBD5E1] uppercase border-b border-[#22242D] font-bold">
                    {t.roleLabel}
                  </div>
                  <button
                    onClick={() => handleRoleChange('investigator')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#FFFFFF] hover:bg-[#1B1C24] transition-colors"
                  >
                    <span>{t.roleInvestigator}</span>
                    {role === 'investigator' && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('supervisor')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#FFFFFF] hover:bg-[#1B1C24] transition-colors"
                  >
                    <span>{t.roleSupervisor}</span>
                    {role === 'supervisor' && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#FFFFFF] hover:bg-[#1B1C24] transition-colors"
                  >
                    <span>{t.roleAdmin}</span>
                    {role === 'admin' && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Navigation Row: Primary Section View Tabs */}
        <div className="px-4 lg:px-6 flex items-center justify-center gap-2 border-t border-[#22242D]/60 py-1.5 overflow-x-auto scrollbar-none">
          {primaryTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/40 font-extrabold'
                    : 'text-[#CBD5E1] hover:text-[#FFFFFF] hover:bg-[#14151B]'
                }`}
              >
                <span className="text-[11px] opacity-80">{tab.number}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTopNavDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Quick Action Modal */}
      <QuickActionModal isOpen={showQuickAction} onClose={() => setShowQuickAction(false)} />
    </>
  );
};
