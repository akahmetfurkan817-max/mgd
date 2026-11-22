import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--mgd-primary, #1B3B7B)",
          dark: "var(--mgd-primary-dark, #122854)",
        },
        secondary: "var(--mgd-secondary, #1D56B8)",
        gold: {
          DEFAULT: "#1D56B8",
          light: "#60A5FA",
          soft: "#EFF6FF",
        },
        ivory: "#F6F8FB",
        surface: "#F6F8FB",
        ink: "#0F1E3C",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
