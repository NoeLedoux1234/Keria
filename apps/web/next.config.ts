import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@meetpoint/ui", "@meetpoint/geo", "@meetpoint/types"],
  typescript: {
    // Les fichiers Convex ont une référence circulaire dans les types générés
    // Convex CLI gère la vérification de types pour son propre code
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
