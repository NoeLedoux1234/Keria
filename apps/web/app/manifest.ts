import type { MetadataRoute } from "next";
import { siteTagline } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `KERIA — ${siteTagline}`,
    short_name: "KERIA",
    description:
      "Trouvez le point de rencontre le plus équitable entre plusieurs personnes. Simple, intelligent et élégant.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e221a",
    theme_color: "#1e221a",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
