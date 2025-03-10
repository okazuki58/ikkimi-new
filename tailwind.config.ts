import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sf: [
          "-apple-system",
          "BlinkMacSystemFont",
          "San Francisco",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        inter: ["var(--font-inter)"],
        unbounded: ["Unbounded", "sans-serif"],
        note_sans_jp: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
