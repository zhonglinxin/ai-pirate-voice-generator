/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pirate: {
          gold: '#ffd700',
          copper: '#ff6b35',
          navy: '#1a1a2e',
          slate: '#16213e',
          deep: '#0f3460',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700' },
          '100%': { boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
} 