import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "KERIA — Le point de rencontre le plus juste";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background: "#1e221a",
        backgroundImage: "radial-gradient(1100px 560px at 78% -8%, #2a2f23 0%, transparent 60%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: "#c9a227",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 8,
        }}
      >
        <div style={{ width: 56, height: 4, background: "#c9a227" }} />
        POINT DE RENCONTRE
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          color: "#f5f5dc",
          fontSize: 230,
          fontWeight: 700,
          letterSpacing: -10,
          lineHeight: 1,
        }}
      >
        KERIA
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          color: "#f5f5dc",
          fontSize: 46,
          fontWeight: 500,
        }}
      >
        Le point de rencontre le plus
        <span style={{ color: "#c9a227", marginLeft: 14 }}>juste</span>
      </div>
    </div>,
    { ...size }
  );
}
