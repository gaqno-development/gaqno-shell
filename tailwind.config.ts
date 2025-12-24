import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@gaqno-dev/frontcore/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@gaqno-dev/frontcore/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
};

export default config;
