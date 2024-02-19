/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["Fredoka", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}