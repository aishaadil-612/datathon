/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0A0B0F',
          dark: '#07080B',
        },
        card: {
          DEFAULT: '#14161C',
          hover: '#1E222D',
          border: '#232631',
          subtle: '#181A22',
        },
        teal: {
          50: '#F0FDF9',
          100: '#CCFBF1',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F5C56',
          800: '#114B47',
          900: '#133E3C',
          accent: '#2DD4BF',
        },
        amber: {
          400: '#FBBF24',
          500: '#F5A623',
          600: '#D97706',
          700: '#B45309',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
        },
        command: {
          bg: '#0A0B0F',
          card: '#14161C',
          border: '#232631',
          sidebar: '#0A0B0F',
          muted: '#8A8F9C',
          text: '#E8EAF0',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        'command': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-teal': '0 0 20px rgba(45, 212, 191, 0.15)',
        'glow-amber': '0 0 20px rgba(245, 166, 35, 0.15)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.15)',
      }
    },
  },
  plugins: [],
}
