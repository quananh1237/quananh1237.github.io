/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        deepNavy: "#0a0a1a",
        darkPurple: "#1a0a2e",
        gradientFrom: "#7c3aed",
        gradientTo: "#ff2d95"
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '70%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1.8)', opacity: '0' }
        },
        bounceIndicator: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
        bounceIndicator: 'bounceIndicator 1s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite'
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4,0,0.2,1)'
      }
    }
  },
  plugins: []
}
