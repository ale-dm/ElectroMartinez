/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#ffb800',
          dark: '#282218',
        },
      },
    },
  },
  plugins: [],
}

