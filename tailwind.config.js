/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: {
          100: '#fafbfd',
          200: '#F3F3F3',
          300: '#9ED1EF',
          400: '#68BEF1',
          500: '#447CA4',
          600: '#4680A8',
          700: '#3B82F6',
        },
        dark: {
          100: '#A6A6A6',
          200: '#757575',
          300: '#3A3A3A',
          400: '#1F1F1F',
          500: '#232323',
          600: '#151515',
          700: '#060606',
          800: '#0F1016',
        },
      },
      fontSize: {
        xxs: 8,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 32,
        '5xl': 36,
        '6xl': 40,
      },
    },
  },
  plugins: [],
};
