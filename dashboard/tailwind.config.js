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
          DEFAULT: '#0B0C0E',
          dark: '#070709',
        },
        card: {
          DEFAULT: '#14151B',
          hover: '#1B1C24',
          border: '#22242D',
          subtle: '#101116',
        },
        teal: {
          50: '#F7FFD6',
          100: '#EEFFAD',
          400: '#CCFF00',
          500: '#B8EF00',
          600: '#9ED400',
          700: '#7FA800',
          800: '#607D00',
          900: '#435700',
          accent: '#CCFF00',
        },
        amber: {
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
        },
        rose: {
          400: '#EF5350',
          500: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
        },
        command: {
          bg: '#0B0C0E',
          card: '#14151B',
          border: '#22242D',
          sidebar: '#0B0C0E',
          muted: '#9FA4B2',
          text: '#FFFFFF',
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
        'command': '0 8px 32px -4px rgba(0, 0, 0, 0.7)',
        'glow-teal': '0 0 25px rgba(204, 255, 0, 0.25)',
        'glow-amber': '0 0 25px rgba(255, 152, 0, 0.25)',
        'glow-rose': '0 0 25px rgba(229, 57, 53, 0.25)',
      }
    },
  },
  plugins: [],
}
