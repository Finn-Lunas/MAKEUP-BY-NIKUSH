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
