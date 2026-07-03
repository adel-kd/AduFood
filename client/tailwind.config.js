/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        zoomHero: {
          "0%": {
            transform: "scale(1.25)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        slideLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-80px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        zoomHero: "zoomHero 2s ease-out forwards",
        slideLeft: "slideLeft 1s ease-out forwards",
      },
    },
  },
  plugins: [],
}
