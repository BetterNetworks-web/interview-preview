import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F5F0E8",
        paper: "#FDFAF4",
        ink: "#1A1A1A",
        "ink-secondary": "#6B6459",
        accent: "#8B6914",
        border: "#E2D9C8",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        warm: "0 2px 8px rgba(26, 26, 26, 0.06)",
        "warm-lg": "0 4px 16px rgba(26, 26, 26, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
