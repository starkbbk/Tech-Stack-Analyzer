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
        background: "#0a0a0a",
        card: "#111111",
        accent: "#00ff41",
        secondary: "#0096ff",
        warning: "#ff6b35",
        text: "#ffffff"
      },
      fontFamily: {
        header: ['var(--font-space-grotesk)', 'sans-serif'],
        code: ['var(--font-jetbrains-mono)', 'monospace'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
