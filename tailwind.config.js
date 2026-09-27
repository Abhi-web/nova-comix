/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#090A0F',
          secondary: '#0F1117',
          surface: '#12151D',
          card: '#151821',
          cardHover: '#1A1D26',
          elevated: '#1A1D26',
          header: 'rgba(9, 10, 15, 0.88)',
        },
        content: {
          primary: '#F5F5F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
          tertiary: '#52525B',
        },
        border: {
          subtle: '#272B35',
          strong: '#373D4B',
          card: '#1F232D',
        },
        accent: {
          DEFAULT: '#E5A93C',
          hover: '#F3B952',
          muted: 'rgba(229, 169, 60, 0.12)',
          border: 'rgba(229, 169, 60, 0.28)',
          dark: '#B87F21',
          glow: 'rgba(229, 169, 60, 0.4)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.55)',
        'card-hover': '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(229, 169, 60, 0.22)',
        'glow-accent': '0 0 25px -4px rgba(229, 169, 60, 0.35)',
        'glow-sm': '0 0 12px -2px rgba(229, 169, 60, 0.22)',
        'header': '0 8px 32px 0 rgba(0, 0, 0, 0.75)',
        'modal': '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      aspectRatio: {
        'cover': '3 / 4.2',
        'banner': '16 / 6',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 1.8s infinite',
        pulseSubtle: 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
