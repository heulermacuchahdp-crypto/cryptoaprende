import { ImageResponse } from "next/og";

export const alt = "CryptoAprende — Aprende criptomoedas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #07111f 0%, #0b1828 100%)",
          padding: 80,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: "#2dd4bf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 700,
              color: "#07111f",
            }}
          >
            B
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            <span>Crypto</span>
            <span style={{ color: "#2dd4bf" }}>Aprende</span>
          </div>
        </div>

        {/* TÍTULO */}
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Aprende criptomoedas.
        </div>

        {/* SUBTÍTULO */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#9ca3af",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Ganha pontos. Sobe no ranking. Troca por recompensas.
        </div>

        {/* TAGS */}
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "#2dd4bf",
          }}
        >
          <span>Bitcoin</span>
          <span>·</span>
          <span>Ethereum</span>
          <span>·</span>
          <span>USDT</span>
          <span>·</span>
          <span>Blockchain</span>
        </div>
      </div>
    ),
    { ...size }
  );
}