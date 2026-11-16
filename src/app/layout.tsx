import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cryptoaprende.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CryptoAprende — Aprende criptomoedas e ganha recompensas",
    template: "%s | CryptoAprende",
  },
  description:
    "Plataforma gratuita para aprender Bitcoin, Ethereum, USDT e blockchain. Ganha pontos, sobe no ranking e troca por recompensas.",
  keywords: [
    "criptomoedas",
    "bitcoin",
    "ethereum",
    "blockchain",
    "aprender cripto",
    "moçambique",
    "educação financeira",
  ],
  authors: [{ name: "CryptoAprende" }],
  creator: "CryptoAprende",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: SITE_URL,
    siteName: "CryptoAprende",
    title: "CryptoAprende — Aprende criptomoedas e ganha recompensas",
    description:
      "Aprende Bitcoin, Ethereum e blockchain. Ganha pontos e troca por recompensas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoAprende",
    description:
      "Aprende criptomoedas de graça. Ganha pontos e troca por recompensas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}