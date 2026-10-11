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
        bgMain: "var(--bg-main, #050b16)",
        bgCard: "var(--bg-card, #0d1929)",
        bgInput: "var(--bg-input, #091525)",
        bgCardHover: "var(--bg-card-hover, #12223a)",
        borderCustom: "var(--border, #1b304b)",
        textMain: "var(--text-main, #f4f7fb)",
        textSecondary: "var(--text-secondary, #8fa2bb)",
        blueCustom: "var(--blue, #237cff)",
        blueLight: "var(--blue-light, #4b94ff)",
        purpleCustom: "var(--purple, #7657ff)",
        purpleLight: "var(--purple-light, #8b6cff)",
        errorCustom: "var(--error, #ff6b7a)",
        successCustom: "var(--success, #35d39a)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
