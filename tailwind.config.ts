import {heroui} from "@heroui/theme";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

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
      'bggorange': '#FF5100',
      'bbg-10':rgb(36, 149, 99),
      'bgg-9':rgb(36, 149, 99),
      'bgg-8':rgb(47, 196, 130),
      'bgg-7':rgb(29, 138, 205),
      'bgg-6':rgb(83, 105, 162),
      'bgg-5':rgb(83, 105, 162),
      'bgg-4':rgb(223, 71, 81),
      'bgg-3':rgb(223, 71, 81),
      'bgg-2':rgb(219, 48, 59),
      'bgg-1':rgb(219, 48, 59),
      ...colors,
    }
  },
  darkMode: "class",
  plugins: [heroui()],
};
export default config;
