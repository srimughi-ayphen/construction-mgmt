import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5fb",
          100: "#d6e4f0",
          200: "#a8c8e0",
          300: "#7aadc9",
          400: "#5b92b5",
          500: "#3a7ca5",
          600: "#2d6a9f",
          700: "#245480",
          800: "#1e3a5f",
          900: "#142843",
        },
        bg: {
          primary: "#ffffff",
          secondary: "#f1f5f9",
          tertiary: "#f8f5f0",
        },
        construction: {
          steel: "#64748b",
          concrete: "#94a3b8",
          amber: "#f59e0b",
          danger: "#ef4444",
          success: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
