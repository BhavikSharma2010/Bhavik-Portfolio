import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { AppLoader } from "@/components/AppLoader";
import { CursorSpotlight } from "@/components/fx/CursorSpotlight";
import { EasterEggs } from "@/components/fx/EasterEggs";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhavik — Bhavik Studios",
  description:
    "Bhavik Studios presents: a software developer's portfolio shot as a feature film — now showing, origin story, cast & crew, and a premiere night invitation.",
  openGraph: {
    title: "Bhavik Studios",
    description: "He builds web experiences that feel alive. Now showing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <AppLoader />
        <CursorSpotlight />
        <EasterEggs />
        {children}
      </body>
    </html>
  );
}
