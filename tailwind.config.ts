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
        primary: "rgba(10, 10, 10, 1)",
        secondary: "rgba(10, 10, 10, 1)",
        terciary: "rgba(20, 20, 20, 1)",
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
        "calc-full-button": "calc(100% - 44px)",
        "calc-full-chart": "calc(100% - 108px)",
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-0": "fade-in 0.2s ease-out",
        "fade-out-0": "fade-out 0.2s ease-in",
        "zoom-in-95": "zoom-in 0.2s ease-out",
        "zoom-out-95": "zoom-out 0.2s ease-in",
        "slide-in-from-top-2": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom-2": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left-2": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right-2": "slide-in-from-right 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
