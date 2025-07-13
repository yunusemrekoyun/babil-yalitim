/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandDark: "#0b0b0d",
        brandBlue: "#125795",
        primaryColor: "#FFFFFF",
        secondaryColor: "#226473",
        tertiaryColor: "#807c7cd4",
        quaternaryColor: "#195973",
        transparanColor: "#ffffff00",

        koyumavi: "#01587a",
        açıkmavi: "#5cb3c1",
        buzbeyaz: "#98d8dd",
        // buzbeyazseffaf:"#98d8dd8b",
        buzbeyazseffaf:"#FFFFFF",
        gri: "#e1e8eb",
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

// 1. renk koyu mavi : #01587a
// 2. renk açık mavi : #5cb3c1
// 3. renk buz beyaz : #98d8dd
// 4. renk gri : #e1e8eb
