/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { 
    extend: {} 
  },
  plugins: [tailwindAnimate], // Apenas um campo plugins, com o animate dentro
}