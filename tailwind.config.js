/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        body: "#f2f9fd",
        theme: "#2ca9e1",
      },
    },
    fontFamily: {
      manrope: ["Manrope", "sans-serif"],
      zenkakugothic: ["Zen Kaku Gothic New", "sans-serif"],
    },
  },
  plugins: [],
}