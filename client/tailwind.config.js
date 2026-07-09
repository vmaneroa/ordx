/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0A0A0F',
        violet: '#7C3AED',
        cyan: '#06B6D4',
      },
    },
  },
  plugins: [],
};
