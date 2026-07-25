import React from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';

export const SyntheticWatermark: React.FC = () => {
  const { language } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="fixed bottom-3 left-20 z-30 pointer-events-none opacity-80 transition-opacity hover:opacity-100 hidden sm:block select-none">
      <div className="bg-[#14151B]/90 backdrop-blur-md text-[#9FA4B2] border border-[#22242D] px-3.5 py-1 text-[11px] font-mono rounded-full shadow-2xl flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span>{t.syntheticWatermark}</span>
      </div>
    </div>
  );
};
