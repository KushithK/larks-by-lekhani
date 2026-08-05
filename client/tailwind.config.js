/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf6f5',
        darkbrown: '#2b2524',
        terracotta: '#b57c70',
      }
    },
  },
  plugins: [],
}