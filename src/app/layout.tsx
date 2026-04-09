import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud-Native Studio | بيئة تطوير سحابية",
  description: "منصة تطوير متكاملة تعمل داخل المتصفح باستخدام WebContainers",
  keywords: ["Cloud IDE", "WebContainers", "Next.js", "TypeScript", "AI"],
  authors: [{ name: "Cloud-Native Studio" }],
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#181818",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistMono.variable} antialiased bg-[#1e1e1e] text-foreground`}
        style={{ fontFamily: "'Tajawal', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
