const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const BACKGROUND_IMAGE_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80";

export function PageBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `url("${BACKGROUND_IMAGE_URL}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) brightness(0.25) saturate(0.7)",
          transform: "scale(1.2)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{ backgroundImage: NOISE_SVG }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />
    </>
  );
}
