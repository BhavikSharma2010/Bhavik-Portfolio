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
  title: "Bhavik Sharma — Frontend Developer",
  description:
    "Bhavik Sharma, Frontend Developer (React.js · Next.js · TypeScript). Bhavik Studios presents: a software developer's portfolio shot as a feature film — now showing, origin story, cast & crew, and a premiere night invitation.",
  openGraph: {
    title: "Bhavik Sharma — Frontend Developer",
    description:
      "He builds web experiences that feel alive. Now showing at Bhavik Studios.",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Palette A "Olive Editorial". If trialing html[data-palette="forest"],
  // use #07120d instead.
  themeColor: "#e8dfc8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Apply a stored non-default palette before first paint (anti-FOUC).
            Keep in sync with STORAGE_KEY in src/lib/theme.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("bhavik-studios-theme")==="forest")document.documentElement.setAttribute("data-palette","forest")}catch(e){}',
          }}
        />
      </head>
      <body>
        <AppLoader />
        <CursorSpotlight />
        <EasterEggs />
        {children}
      </body>
    </html>
  );
}
