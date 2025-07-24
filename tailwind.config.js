/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1a936f',
        secondary: '#8FD19E',
        accent: '#2d4a3e',
        'text-dark': '#1a202c',
        'text-light': '#718096',
      },
      fontFamily: {
        'amiri': ['Amiri', 'serif'],
        'scheherazade': ['Scheherazade New', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'arabic': ['Amiri', 'Scheherazade New', 'Arial Unicode MS', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
