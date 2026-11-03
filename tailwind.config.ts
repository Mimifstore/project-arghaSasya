import type { Config } from "tailwindcss";

// Palet Argha Sasya: dataran tinggi Garut (kabut, daun, tanah) + kunyit sebagai aksen.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kabut: "#F1F4F2",
        line: "#DCE3DE",
        daun: {
          50: "#EAF4EE", 100: "#D3E8DB", 200: "#A9D2B9", 300: "#78B895", 400: "#489B72",
          500: "#2A8059", 600: "#1B6B4A", 700: "#155539", 800: "#104029", 900: "#0B2D1D",
        },
        tanah: {
          50: "#F2F5F3", 100: "#E3E9E5", 200: "#C9D3CD", 300: "#A3B1A9", 400: "#75877D",
          500: "#546759", 600: "#3E4F45", 700: "#2B3A32", 800: "#1C2A23", 900: "#12201A", 950: "#0B1510",
        },
        kunyit: {
          50: "#FFF8E1", 100: "#FFEDB3", 200: "#FFE082", 300: "#FFD04D", 400: "#F5B921",
          500: "#D99A00", 600: "#B07A00", 700: "#855C00",
        },
        cabai: { 50: "#FDEEEC", 100: "#FAD6D1", 500: "#C23B2B", 600: "#A62F21", 700: "#85261B" },
        langit: { 50: "#EAF2FA", 100: "#D2E3F3", 600: "#2B6CA3", 700: "#1F5282" },
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        raised: "0 1px 2px rgb(18 32 26 / 0.06), 0 14px 32px -18px rgb(18 32 26 / 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
