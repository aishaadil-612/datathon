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

  const primaryTabs: { id: AppView; label: string }[] = [
    { id: 'iris', label: 'Ask IRIS' },
    { id: 'fir', label: 'Citizen E-FIR' },
    { id: 'overview', label: 'Overview' },
    { id: 'hotspots', label: 'Hotspots' },
    { id: 'inside-iris', label: 'Inside IRIS' },
  ];

  const investigatorTools: { id: AppView; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'network', label: 'Criminal Network Graph', icon: <GitFork className="w-4 h-4 text-amber-400" />, desc: 'Multi-hop entity connection graph' },
    { id: 'timelines', label: 'Case Serial Timelines', icon: <Clock className="w-4 h-4 text-teal-400" />, desc: 'Cross-precinct temporal match' },
    { id: 'search', label: 'Global Case Search', icon: <Search className="w-4 h-4 text-[#CCFF00]" />, desc: 'Faceted FIR & suspect query' },
    { id: 'audit', label: 'Audit & Governance Log', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, desc: 'Immutable SHA-256 audit ledger' },
  ];

  return (
    <>
      <header className="bg-[#0B0C0E]/95 theme-card backdrop-blur-md border-b border-[#22242D] theme-border sticky top-0 z-40 select-none">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setActiveView('iris')} className="flex items-center gap-3 text-left">
              <CrimeLensLogo size="md" showWordmark={true} />
            </button>
          </div>

          {/* Center: Minimal Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#14151B]/80 theme-card p-1 rounded-full border border-[#22242D] theme-border">
            {primaryTabs.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all ${
                    isActive
                      ? 'bg-[#CCFF00] text-slate-950 font-extrabold shadow-sm'
                      : 'text-[#CBD5E1] theme-text hover:text-[#FFFFFF] hover:bg-[#1C1E26]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Quick Action, Tools, Notifications, Theme, Role */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Action (+) */}
            <button
              onClick={() => setShowQuickAction(true)}
              className="w-8 h-8 rounded-full bg-[#CCFF00] text-slate-950 hover:bg-[#b8ef00] flex items-center justify-center font-bold transition-all hover:scale-105"
              title="File New Case / Quick Action"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAlertMenu(!showAlertMenu)}
                className="w-8 h-8 rounded-full bg-[#14151B] theme-card hover:bg-[#1B1C24] border border-[#22242D] theme-border text-[#FFFFFF] flex items-center justify-center relative transition-colors"
                title="Alerts & Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-[#CBD5E1]" />
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {alertCount}
                  </span>
                )}
              </button>

              {showAlertMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#14151B] theme-card border border-[#22242D] theme-border rounded-2xl shadow-2xl py-2 z-50 text-xs space-y-1">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-[#22242D] theme-border">
                    <span className="font-bold text-[#FFFFFF] theme-text">System Alerts</span>
                    {alertCount > 0 && (
                      <button onClick={clearAlerts} className="text-[10px] text-[#CCFF00] hover:underline font-bold">
                        Clear
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
                      <span className="text-rose-400 font-semibold block">Hotspot Alert</span>
                      <span className="text-[#CBD5E1] text-[11px]">88% risk score calculated for Hoodi ORR.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-full text-xs font-sans font-semibold transition-colors ${
                  ['network', 'timelines', 'search', 'audit'].includes(activeView)
                    ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 font-bold'
                    : 'bg-[#14151B] theme-card hover:bg-[#1B1C24] border-[#22242D] theme-border text-[#FFFFFF] theme-text'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="hidden sm:inline">Tools</span>
                <ChevronDown className="w-3 h-3 text-[#CBD5E1]" />
              </button>

              {showToolsMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-[#14151B] theme-card border border-[#22242D] theme-border rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-mono text-[#CBD5E1] uppercase border-b border-[#22242D] theme-border font-bold">
                    Analysis Modules
                  </div>
                  {investigatorTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveView(tool.id);
                        setShowToolsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#1B1C24] transition-colors flex items-center gap-2.5"
                    >
                      <div>{tool.icon}</div>
                      <div>
                        <span className="font-bold text-[#FFFFFF] theme-text block text-xs">{tool.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 bg-[#14151B] theme-card hover:bg-[#1B1C24] border border-[#22242D] theme-border rounded-full text-[#FFFFFF] theme-text transition-all"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14151B] theme-card hover:bg-[#1B1C24] border border-[#22242D] theme-border rounded-full text-xs font-semibold text-[#FFFFFF] theme-text transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize hidden sm:inline">{role}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-[#14151B] theme-card border border-[#22242D] theme-border rounded-2xl shadow-2xl py-1 z-50">
                  <button
                    onClick={() => handleRoleChange('investigator')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#FFFFFF] theme-text hover:bg-[#1B1C24] transition-colors"
                  >
                    <span>Investigator</span>
                    {role === 'investigator' && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('supervisor')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#FFFFFF] theme-text hover:bg-[#1B1C24] transition-colors"
                  >
                    <span>Supervisor</span>
                    {role === 'supervisor' && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Action Modal */}
      <QuickActionModal isOpen={showQuickAction} onClose={() => setShowQuickAction(false)} />
    </>
  );
};
