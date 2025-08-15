/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-green': 'pulse-green 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' 
          },
          '70%': { 
            boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' 
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}