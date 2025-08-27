import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ToastProvider } from "../components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makeup by Nikush",
  description: "Professional makeup courses and services",
  metadataBase: new URL("https://makeup-by-nikush.com.ua"),
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: "Makeup by Nikush",
    title: "Makeup by Nikush",
    description: "Professional makeup courses and services",
    images: [
      {
        url: "/images/hero/Hero.JPG",
        width: 1200,
        height: 630,
        alt: "Makeup by Nikush",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makeup by Nikush",
    description: "Professional makeup courses and services",
    images: ["/images/hero/Hero.JPG"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcut: [
      {
        url: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>
          <ToastProvider>
            <ClientBody>{children}</ClientBody>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
