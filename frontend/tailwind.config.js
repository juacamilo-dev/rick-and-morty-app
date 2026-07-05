/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      colors: {
        ink: '#1E293B',
        muted: '#6B7280',
        'lilac-bg': '#EEE3FF',
        'lilac-icon-bg': '#EDE9FE',
        violet: '#8054C7',
        'violet-dark': '#5A3696',
        'heart-green': '#63D838',
      },
    },
  },
  plugins: [],
};
