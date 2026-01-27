/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FDB913',
        secondary: '#2d2d2d',
        dark: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
