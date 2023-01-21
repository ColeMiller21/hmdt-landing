/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["Pixel", "sans-serif"],
        vcr: ["VCR", "sans-serif"],
      },
    },
  },
  plugins: [],
};
