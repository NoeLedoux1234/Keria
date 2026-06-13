import nextPlugin from "@next/eslint-plugin-next";
import reactConfig from "./react.js";

// Flat config for Next.js apps: TS + React + React Hooks (from react.js)
// plus the official @next/eslint-plugin-next rules (recommended + core-web-vitals).
export default [
  ...reactConfig,
  nextPlugin.flatConfig.coreWebVitals,
  {
    ignores: [".next/**"],
  },
];
