/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f3f0ff', 100: '#e9e3ff', 200: '#d4caff', 300: '#b4a4ff',
          400: '#9176ff', 500: '#7c3aed', 600: '#6d28d9', 700: '#5b21b6',
          800: '#4c1d95', 900: '#3b0764',
        },
        accent: { 400: '#fb923c', 500: '#f97316' },
        surface: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7' },
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        'card':      '0 2px 12px 0 rgba(0,0,0,0.07)',
        'card-hover':'0 8px 30px 0 rgba(124,58,237,0.15)',
        'purple':    '0 4px 20px rgba(124,58,237,0.25)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
        'ticker':   'ticker 28s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        ticker:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
