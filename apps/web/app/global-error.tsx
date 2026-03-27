"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e221a",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              border: "1px solid rgba(166, 90, 74, 0.3)",
              backgroundColor: "rgba(166, 90, 74, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c47a6a"
              strokeWidth="1.5"
            >
              <path d="M12 9v4m0 4h.01" strokeLinecap="round" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h1
            style={{
              color: "#f5f5dc",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              letterSpacing: "-0.025em",
            }}
          >
            Erreur critique
          </h1>

          <p
            style={{
              color: "#8a8a78",
              fontSize: "0.875rem",
              margin: "0 0 2rem",
            }}
          >
            {error.message || "L'application a rencontré une erreur inattendue"}
          </p>

          <button
            onClick={reset}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              color: "#c9a227",
              padding: "0.75rem 2rem",
              borderRadius: "0.375rem",
              fontSize: "0.625rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.5)";
              e.currentTarget.style.backgroundColor = "rgba(201, 162, 39, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.3)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Réessayer
          </button>

          {error.digest && (
            <p
              style={{
                color: "#3d4435",
                fontSize: "0.625rem",
                fontFamily: "monospace",
                marginTop: "2rem",
              }}
            >
              REF: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
