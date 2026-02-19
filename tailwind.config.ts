import type { Config } from "tailwindcss";
import sharedConfig from "@gaqno-development/frontcore/config/tailwind";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@gaqno-development/frontcore/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
  plugins: [tailwindcssAnimate, tailwindScrollbar],
};

export default config;
