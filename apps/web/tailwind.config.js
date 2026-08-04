/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0c0a1d',
          800: '#15132a',
          700: '#1d1a36',
          600: '#26234a',
        },
        purple: {
          DEFAULT: '#7c5cff',
          50: '#f1edff',
          100: '#e3daff',
          200: '#c7b6ff',
          300: '#a98bff',
          400: '#8c69ff',
          500: '#7c5cff',
          600: '#5e3df0',
          700: '#4a2fc6',
          800: '#37239a',
          900: '#241670',
        },
        accent: {
          green: '#22c55e',
          yellow: '#facc15',
          pink: '#ec4899',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 20px -8px rgba(15, 12, 41, 0.08)',
        'card-hover': '0 14px 32px -10px rgba(15, 12, 41, 0.18)',
      },
    },
  },
  plugins: [],
};
