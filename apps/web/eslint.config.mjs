import nextConfig from "@meetpoint/config-eslint/next";

export default [
  ...nextConfig,
  {
    // Generated Convex client, Next internals and CommonJS build configs
    // are not ours to lint.
    ignores: ["convex/**", ".next/**", "next-env.d.ts", "postcss.config.js"],
  },
];
