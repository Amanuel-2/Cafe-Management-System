/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#aa3bff',
          50: '#f5e6ff',
          100: '#e6c2ff',
          200: '#d29dff',
          300: '#bd78ff',
          400: '#a953ff',
          600: '#8b25e6',
          700: '#6e00bf',
          800: '#540094',
          900: '#390066',
        },
        accent: '#aa3bff',
        background: '#ffffff',
        foreground: '#6b6375',
      },
    },
  },
  plugins: [],
};
