import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-surface": "#dfe2eb",
        "surface-dim": "#10141a",
        "on-primary-container": "#003111",
        "outline": "#879485",
        "background": "#10141a",
        "surface-container-lowest": "#0a0e14",
        "surface-container-high": "#262a31",
        "on-secondary": "#093817",
        "surface-bright": "#353940",
        "on-primary": "#003914",
        "outline-variant": "#3e4a3d",
        "primary": "#62df7d",
        "surface-container": "#1c2026",
        "secondary-container": "#23502c",
        "on-background": "#dfe2eb",
        "inverse-on-surface": "#2d3137",
        "primary-container": "#1ca64d",
        "on-surface": "#dfe2eb",
        "on-surface-variant": "#bdcaba",
        "surface-container-low": "#181c22",
        "on-secondary-container": "#90c193",
        "surface-container-highest": "#31353c",
      },
    },
  },
  plugins: [],
};
export default config;
