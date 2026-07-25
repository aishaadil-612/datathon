import React from 'react';

interface CrimeLensLogoProps {
  size?: 'sm' | 'md' | 'lg' | number;
  showWordmark?: boolean;
  className?: string;
}

export const CrimeLensLogo: React.FC<CrimeLensLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
}) => {
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'sm') {
    dimension = 24;
  } else if (size === 'lg') {
    dimension = 64;
  }

  const gradientId = `crimelens-gradient-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>

        {/* Outer Circular Rim */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.5"
          className="opacity-90"
        />

        {/* Aperture Iris Blades (6 geometric overlapping angled lines forming focus shutter) */}
        <g stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round">
          {/* Blade 1 */}
          <path d="M 50 12 L 72 38 L 54 44" />
          {/* Blade 2 */}
          <path d="M 83 31 L 78 59 L 58 52" />
          {/* Blade 3 */}
          <path d="M 83 69 L 56 79 L 48 60" />
          {/* Blade 4 */}
          <path d="M 50 88 L 28 62 L 46 56" />
          {/* Blade 5 */}
          <path d="M 17 69 L 22 41 L 42 48" />
          {/* Blade 6 */}
          <path d="M 17 31 L 44 21 L 52 40" />
        </g>

        {/* Inner Target Crosshair Lines */}
        <line x1="50" y1="28" x2="50" y2="34" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="66" x2="50" y2="72" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="50" x2="34" y2="50" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="66" y1="50" x2="72" y2="50" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Center Focus Dot */}
        <circle cx="50" cy="50" r="4.5" fill="#2DD4BF" />
      </svg>

      {showWordmark && (
        <span className="font-display font-bold tracking-tight text-lg sm:text-xl select-none">
          <span className="text-[#E8EAF0]">Crime</span>
          <span className="text-[#2DD4BF] ml-0.5">Lens</span>
        </span>
      )}
    </div>
  );
};
