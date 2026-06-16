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
        navy: {
          950: "#060f1e",
          900: "#0C2140",
          800: "#112c55",
          700: "#163769",
          600: "#1d4a88",
          500: "#255da5",
          400: "#4f7fbf",
          300: "#80a5d2",
          200: "#b4cae6",
          100: "#d9e6f3",
          50: "#edf4fb",
        },
        gold: {
          950: "#3d2609",
          900: "#5c3a10",
          800: "#7a4e18",
          700: "#9a6425",
          600: "#BB8956",
          500: "#c99970",
          400: "#d6ad8e",
          300: "#e3c4ae",
          200: "#efd9ca",
          100: "#f7ede3",
          50: "#fdf6f0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "'Courier New'", "monospace"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 0 0 3px rgba(187, 137, 86, 0.30)",
        "gold-focus": "0 0 0 3px rgba(187, 137, 86, 0.50)",
        navy: "0 0 0 3px rgba(12, 33, 64, 0.25)",
        sm: "0 1px 3px rgba(12, 33, 64, 0.10), 0 1px 2px rgba(12, 33, 64, 0.06)",
        md: "0 4px 6px rgba(12, 33, 64, 0.08), 0 2px 4px rgba(12, 33, 64, 0.06)",
        lg: "0 10px 15px rgba(12, 33, 64, 0.08), 0 4px 6px rgba(12, 33, 64, 0.05)",
        xl: "0 20px 25px rgba(12, 33, 64, 0.10), 0 8px 10px rgba(12, 33, 64, 0.06)",
      },
      borderRadius: {
        lg: "10px",
        xl: "16px",
        "2xl": "24px",
      },
      keyframes: {
        hwCaret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        hwBobA: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        hwBobB: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        hwBobC: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        hwBobD: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(5px)" },
        },
        hwIconCycle: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "4%": { opacity: "0.4", transform: "scale(1)" },
          "13%": { opacity: "0.4", transform: "scale(1)" },
          "17%": { opacity: "0", transform: "scale(1.05)" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "hw-caret": "hwCaret 1.05s steps(1, end) infinite",
        "hw-bob-a": "hwBobA 6s ease-in-out infinite",
        "hw-bob-b": "hwBobB 7.8s ease-in-out 0.5s infinite",
        "hw-bob-c": "hwBobC 9s ease-in-out 0.9s infinite",
        "hw-bob-d": "hwBobD 6.9s ease-in-out 0.25s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
