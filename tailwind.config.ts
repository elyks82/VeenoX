import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
        jetBrains: "JetBrains Mono",
        poppins: ["var(--font-poppins)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "rgba(19, 22, 39, 1)",
        secondary: "rgba(21, 25, 41, 1)",
        terciary: "rgba(28, 32, 48, 1)",
        green: "rgb(14 203 129)",
        "green-opacity-10": "rgba(14, 203, 129,0.1)",
        red: "rgb(234 57 67)",
        "red-opacity-10": "rgba(234, 57, 67, 0.1)",
        font: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          80: "rgba(255, 255, 255, 0.8)",
          60: "rgba(255, 255, 255, 0.6)",
          40: "rgba(255, 255, 255, 0.4)",
          20: "rgba(255, 255, 255, 0.2)",
        },
        borderColor: {
          DEFAULT: "rgba(200, 200, 200, 0.2)",
          DARK: "rgba(140, 140, 140, 0.1)",
        },
      },
      height: {
        "calc-leverage-height": "calc(100% - 143px)",
      },
      inset: {
        "calc-slide-long": "calc(50% - 4px)",
        "calc-mobile-position": "calc(100% - 468px);",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
