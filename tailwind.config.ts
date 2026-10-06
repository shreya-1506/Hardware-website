import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#EEF3FA",
          100: "#D6E2F1",
          200: "#AEC4E2",
          300: "#7B9BC9",
          400: "#4C71A5",
          500: "#2B4C7E",
          600: "#1D3A63",
          700: "#132B4B",
          800: "#0D1F37",
          900: "#08172A",
          950: "#050F1C",
        },
        steel: {
          50: "#F7F9FB",
          100: "#EFF2F6",
          200: "#E1E7EE",
          300: "#C9D3DE",
          400: "#A0AEBE",
          500: "#77869A",
          600: "#56657A",
          700: "#3E4B5C",
          800: "#2A3441",
          900: "#1B222B",
        },
        safety: {
          50: "#FFF6ED",
          100: "#FFE9D2",
          200: "#FFCFA0",
          300: "#FFAE63",
          400: "#FF8C2E",
          500: "#F97008",
          600: "#E35D00",
          700: "#B84603",
          800: "#93380A",
          900: "#77300C",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,31,55,0.04), 0 8px 24px -12px rgba(13,31,55,0.14)",
        "card-hover":
          "0 2px 4px rgba(13,31,55,0.06), 0 24px 48px -20px rgba(13,31,55,0.28)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
        "blueprint-light":
          "linear-gradient(rgba(13,31,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,31,55,0.05) 1px, transparent 1px)",
        "steel-sheen":
          "linear-gradient(135deg, #0D1F37 0%, #132B4B 42%, #08172A 100%)",
      },
      backgroundSize: {
        grid: "44px 44px",
        "grid-sm": "22px 22px",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 34s linear infinite",
        "spin-slower": "spin-slow 60s linear infinite reverse",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
