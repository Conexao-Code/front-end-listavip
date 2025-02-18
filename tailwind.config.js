/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'card-float': 'float 6s ease-in-out infinite',
        'card-shine': 'shine 3s linear infinite',
        'card-tilt': 'tiltCard 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        tiltCard: {
          '0%, 100%': { transform: 'rotate3d(0)' },
          '25%': { transform: 'rotate3d(0.5, 0.5, 0, 2deg)' },
          '75%': { transform: 'rotate3d(-0.5, 0.5, 0, -2deg)' },
        },
      },
    },
  },
  plugins: [],
};