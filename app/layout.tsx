import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: '--font-noto',
  weight: ['400', '700', '900'],
  display: 'swap',
});

import { LiffProvider } from "@/components/LiffProvider";

export const metadata: Metadata = {
  title: "五行精霊と漢方図鑑",
  description: "楽しく五行を学ぶ漢方アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || process.env.LIFF_ID || '';
  console.log("Layout LIFF ID:", liffId ? "Set" : "Missing");

  return (
    <html lang="ja">
      <body className={`${noto.variable} font-sans bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden antialiased`}>
        <LiffProvider liffId={liffId}>
          <main className="max-w-[480px] mx-auto min-h-screen relative shadow-sm bg-white border-x border-slate-100">
            {children}
          </main>
        </LiffProvider>
      </body>
    </html>
  );
}
