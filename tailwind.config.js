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
        primary: {
          50: '#fff8f0',
          100: '#ffeedd',
          200: '#ffd9b3',
          300: '#ffbf80',
          400: '#ff9d4d',
          500: '#ff8126',
          600: '#f06000',
          700: '#c74700',
          800: '#9e3800',
          900: '#7a2c00',
        },
        warm: {
          50: '#fdfbf7',
          100: '#f9f4ed',
          200: '#f2e8d9',
          300: '#e8d9c3',
          400: '#dcc7a8',
          500: '#cfb48d',
          600: '#b89968',
          700: '#9a7b4f',
          800: '#7c603f',
          900: '#5e4a32',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
