import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutDashboard,
  MapPin,
  Cpu,
  Shield,
  FileText
} from 'lucide-react';
import { useRouterStore, AppView } from '../../store/useRouterStore';
import { useDashboardStore } from '../../store/useDashboardStore';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useRouterStore();
  const { role } = useDashboardStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Left Sidebar Rail contains Platform Navigation
  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    { id: 'iris', label: 'Ask IRIS Copilot', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'fir', label: 'Citizen E-FIR Portal', icon: <FileText className="w-5 h-5" /> },
    { id: 'overview', label: 'Command Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'hotspots', label: 'Hotspot Intelligence', icon: <MapPin className="w-5 h-5" /> },
    { id: 'inside-iris', label: 'Inside IRIS Trace', icon: <Cpu className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Left Rail Navigation Sidebar */}
      <aside className="hidden md:flex flex-col items-center justify-between w-16 bg-[#0B0C0E] border-r border-[#22242D] py-4 z-30 shrink-0 select-none">
        {/* Top Logo Icon Badge */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setActiveView('iris')}
            className="w-10 h-10 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00] shadow-glow-teal hover:scale-105 transition-transform"
            title="Ask IRIS Landing"
          >
            <Shield className="w-5 h-5" />
          </button>

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
                    onClick={() => setActiveView(item.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/40 shadow-glow-teal'
                        : 'text-[#CBD5E1] hover:text-[#FFFFFF] hover:bg-[#14151B] border border-transparent'
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-[#CCFF00] rounded-r-full"
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
                        <div className="bg-[#14151B] text-[#FFFFFF] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#22242D] shadow-xl whitespace-nowrap flex items-center gap-2 font-sans">
                          <span>{item.label}</span>
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
          <span className="text-[10px] font-mono text-[#CBD5E1] uppercase font-bold">{role.slice(0, 3)}</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Rail (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0B0C0E]/95 backdrop-blur-md border-t border-[#22242D] flex items-center justify-around z-40 px-2 select-none">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/30'
                  : 'text-[#CBD5E1]'
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
