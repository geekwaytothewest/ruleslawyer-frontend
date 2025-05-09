import {heroui} from "@heroui/theme";
import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      'gwgreen': '#00b259',
      'gwdarkgreen': '#005D72',
      'gwblue': '#0093d2',
      'gwdarkblue': '#002C5F',
      'gwlightblue': '#70bdc7',
      'gwred': '#FF0000',
      'gwdarkred': '#7e0909',
      ...colors,
    }
  },
  darkMode: "class",
  plugins: [heroui()],
};
export default config;
