import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  GitFork,
  Clock,
  Search,
  ShieldCheck,
  Sparkles,
  Settings,
  Shield
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { ViewType } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, role } = useDashboardStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const navItems: Array<{ id: ViewType | 'settings'; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'map', label: 'Hotspot Spatial Map', icon: <MapPin className="w-5 h-5" /> },
    { id: 'network', label: 'Criminal Network Graph', icon: <GitFork className="w-5 h-5" /> },
    { id: 'timelines', label: 'Case Serial Timelines', icon: <Clock className="w-5 h-5" /> },
    { id: 'search', label: 'Global Case Search', icon: <Search className="w-5 h-5" /> },
    { id: 'audit', label: 'Audit & Governance Log', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'copilot', label: 'CrimeLens AI Workspace', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop/Tablet Icon-only Rail Sidebar */}
      <aside className="hidden md:flex flex-col items-center justify-between w-16 bg-[#0A0B0F] border-r border-[#232631] py-4 z-30 shrink-0 select-none">
        {/* Top Logo Icon Badge */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Shield className="w-5 h-5" />
          </div>

          {/* Navigation Items Rail */}
          <nav className="flex flex-col items-center gap-3">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    onClick={() => {
                      if (item.id !== 'settings') {
                        setActiveView(item.id as ViewType);
                      }
                    }}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-400 border border-teal-500/40 shadow-glow-teal'
                        : 'text-[#8A8F9C] hover:text-[#E8EAF0] hover:bg-[#14161C] border border-transparent'
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-teal-400 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}

                    {item.icon}
                  </button>

                  {/* Hover Slide-out Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 12 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-full top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-[#14161C] text-[#E8EAF0] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#232631] shadow-xl whitespace-nowrap flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.id === 'copilot' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300">
                              AI
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Role Mode Indicator */}
        <div className="flex flex-col items-center gap-1" title={`Role: ${role.toUpperCase()}`}>
          <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-400 animate-pulse" />
          <span className="text-[9px] font-mono text-[#8A8F9C] uppercase">{role.slice(0, 3)}</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Rail (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0A0B0F]/95 backdrop-blur-md border-t border-[#232631] flex items-center justify-around z-40 px-2 select-none">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-[#8A8F9C]'
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </>
  );
};
