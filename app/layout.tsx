import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "담음(談音) - 당신의 이야기로 만드는 노래",
  description: "소중한 추억과 감정을 담은 나만의 노래를 만들어보세요",
  keywords: ["노래 제작", "음악 생성", "AI 작곡", "가사 제작", "추억", "감성"],
  openGraph: {
    title: "담음(談音) - 당신의 이야기로 만드는 노래",
    description: "소중한 추억과 감정을 담은 나만의 노래를 만들어보세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="font-body bg-gradient-to-br from-warm-50 via-warm-100 to-primary-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
