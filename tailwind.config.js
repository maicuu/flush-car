/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: "class", // ESSA LINHA É O QUE ATIVA O DARK MODE POR CLASSE
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { 
    extend: {} 
  },
  plugins: [tailwindAnimate],
}