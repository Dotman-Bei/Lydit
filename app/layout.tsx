import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProofLine } from "@/components/proof-line";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lydit: Binance liquidation price, checked", template: "%s | Lydit" },
  description:
    "A Binance USDⓈ-M liquidation calculator that must reproduce Binance's published examples before any release can merge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <ProofLine />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
