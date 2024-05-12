import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      'gwlightblue': '#E6F4F1',
      'gwred': '#FF0000',
    }
  },
  plugins: [],
};
export default config;
