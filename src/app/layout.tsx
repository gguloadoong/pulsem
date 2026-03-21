import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseM — 투자의 맥박을 잡아라",
  description: "주식·코인·부동산 투자정보를 실시간으로 캐치하는 게이미피케이션 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
