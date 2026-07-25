import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, User, Globe, Radio, Check, ChevronDown } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { Role, ViewType } from '../../types';
import { CrimeLensLogo } from '../common/CrimeLensLogo';
import { QuickActionModal } from './QuickActionModal';

export const TopBar: React.FC = () => {
  const {
    activeView,
    role,
    setRole,
    language,
    setLanguage,
    globalSearchQuery,
    setGlobalSearchQuery,
    alertCount,
    clearAlerts,
    setActiveView
  } = useDashboardStore();

  const t = translations[language];
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
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

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'map', label: 'Hotspot Map' },
    { id: 'network', label: 'Network' },
    { id: 'timelines', label: 'Timelines' },
    { id: 'search', label: 'Case Search' },
    { id: 'audit', label: 'Audit & Governance' },
    { id: 'copilot', label: 'AI Workspace' },
  ];

  return (
    <>
      <header className="bg-[#0A0B0F] border-b border-[#232631] sticky top-0 z-40 select-none">
        {/* Upper Header Row */}
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Brand Identity with CrimeLens Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <CrimeLensLogo size="md" showWordmark={true} />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono border border-teal-500/20">
              v3.2 AI
            </span>
          </div>

          {/* Center: Global Intelligent Pill Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#8A8F9C] pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search cases, suspects, vehicles, locations…"
                className="w-full pl-10 pr-8 py-2 bg-[#14161C] border border-[#232631] rounded-full text-xs text-[#E8EAF0] placeholder:text-[#8A8F9C]/60 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all font-sans"
              />
              {globalSearchQuery && (
                <button
                  type="button"
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-3.5 text-xs text-[#8A8F9C] hover:text-[#E8EAF0]"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Right Controls: Quick Action +, Notification Bell, Role, Language */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Command Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span className="font-semibold">{t.liveBadge}</span>
            </div>

            {/* Circular Quick Action (+) Button */}
            <button
              onClick={() => setShowQuickAction(true)}
              className="w-9 h-9 rounded-full bg-teal-500 text-slate-950 hover:bg-teal-400 flex items-center justify-center font-bold shadow-glow-teal transition-all hover:scale-105 active:scale-95"
              title="File New Case / Quick Action"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Circular Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => setShowAlertMenu(!showAlertMenu)}
                className="w-9 h-9 rounded-full bg-[#14161C] hover:bg-[#1E222D] border border-[#232631] text-[#E8EAF0] flex items-center justify-center relative transition-colors"
                title="Alerts & Notifications"
              >
                <Bell className="w-4 h-4 text-[#8A8F9C] hover:text-[#E8EAF0]" />
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {alertCount}
                  </span>
                )}
              </button>

              {showAlertMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#14161C] border border-[#232631] rounded-2xl shadow-2xl py-2 z-50 text-xs space-y-1">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-[#232631]">
                    <span className="font-bold text-[#E8EAF0]">CrimeLens System Alerts</span>
                    {alertCount > 0 && (
                      <button onClick={clearAlerts} className="text-[10px] text-teal-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#232631]">
                    <div
                      className="p-3 hover:bg-[#1E222D] cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveView('map');
                        setShowAlertMenu(false);
                      }}
                    >
                      <span className="text-rose-400 font-semibold block">Emerging Hotspot Warning</span>
                      <span className="text-[#8A8F9C] text-[11px]">
                        88% risk score calculated for Hoodi ORR Corridor next 30 days.
                      </span>
                    </div>
                    <div
                      className="p-3 hover:bg-[#1E222D] cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveView('network');
                        setShowAlertMenu(false);
                      }}
                    >
                      <span className="text-amber-400 font-semibold block">Vehicle Match Alert</span>
                      <span className="text-[#8A8F9C] text-[11px]">
                        Silver SUV KA-03-MN-4921 linked across 4 active FIRs.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#14161C] hover:bg-[#1E222D] border border-[#232631] rounded-full text-xs font-mono text-[#E8EAF0] transition-colors"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.langToggle}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#14161C] hover:bg-[#1E222D] border border-[#232631] rounded-full text-xs font-medium text-[#E8EAF0] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-[#8A8F9C]" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#14161C] border border-[#232631] rounded-2xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#8A8F9C] uppercase border-b border-[#232631]">
                    {t.roleLabel}
                  </div>
                  <button
                    onClick={() => handleRoleChange('investigator')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#E8EAF0] hover:bg-[#1E222D] transition-colors"
                  >
                    <span>{t.roleInvestigator}</span>
                    {role === 'investigator' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('supervisor')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#E8EAF0] hover:bg-[#1E222D] transition-colors"
                  >
                    <span>{t.roleSupervisor}</span>
                    {role === 'supervisor' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-[#E8EAF0] hover:bg-[#1E222D] transition-colors"
                  >
                    <span>{t.roleAdmin}</span>
                    {role === 'admin' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Header Navigation Bar with Underline Pill Tabs */}
        <div className="px-4 lg:px-6 flex items-center gap-1 overflow-x-auto border-t border-[#232631]/60 py-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-teal-400' : 'text-[#8A8F9C] hover:text-[#E8EAF0]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTopNavUnderline"
                    className="absolute inset-0 bg-teal-500/10 border border-teal-500/30 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTopNavLine"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-teal-400 rounded-full"
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
