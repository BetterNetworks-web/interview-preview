import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Practice Interview Online | Free AI Mock Interview Tool - InterviewPreview",
  description:
    "Practice mock interviews with AI and get instant feedback. Realistic questions for your role, scored across 4 dimensions. Try your first practice interview free.",
  metadataBase: new URL("https://interviewpreview.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
