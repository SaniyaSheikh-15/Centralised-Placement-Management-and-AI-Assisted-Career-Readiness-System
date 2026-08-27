import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050B14",
        panel: "#101C2C",
        panelAlt: "#0B1422",
        border: "#1E3045",
        primary: "#1683FF",
        secondary: "#7C5CFF",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#F8FAFC",
        muted: "#94A3B8",
        subtle: "#64748B"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(22, 131, 255, 0.18), 0 18px 40px rgba(2, 6, 23, 0.55)"
      }
    }
  },
  plugins: []
};

export default config;
