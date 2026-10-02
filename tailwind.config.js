/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#070d1e',
          850: '#0c152f',
          800: '#111d42',
          700: '#1e2e65',
        },
        cyber: {
          cyan: '#00f0ff',
          blue: '#0072ff',
          neon: '#38bdf8',
          purple: '#a855f7',
          violet: '#7c3aed',
          pink: '#ec4899',
          green: '#10b981',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        tech: ['"Space Grotesk"', 'Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(0, 114, 255, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08) 1px, transparent 1px)",
        'circuit-pattern': "radial-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 0)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.8))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
