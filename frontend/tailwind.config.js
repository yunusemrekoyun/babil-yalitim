/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandDark: "#0b0b0d",
        brandBlue: "#125795",
        // primaryColor:"#D9C6BA",
        primaryColor: "#FFFFFF",
        secondaryColor: "#226473",
        tertiaryColor: "#807c7cd4",
        quaternaryColor: "#195973",
        transparanColor: "#000000",
      },
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
