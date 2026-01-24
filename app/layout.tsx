import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "五行精霊と漢方図鑑",
  description: "楽しく五行を学ぶ",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden font-sans`}>
        <main className="max-w-[480px] mx-auto min-h-screen relative shadow-sm bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
