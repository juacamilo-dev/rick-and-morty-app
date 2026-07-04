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
        'lilac-bg': '#EDE7FB',
        'lilac-icon-bg': '#EDE9FE',
        violet: '#8B5CF6',
        'heart-green': '#4ADE80',
      },
    },
  },
  plugins: [],
};
