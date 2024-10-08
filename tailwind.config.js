/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], 
        outfit: ["Outfit", "sans-serif"],   
      },
      colors: {
        'glpl-red': '#C6082C', 
      },
    },
  },
  plugins: [],
};
