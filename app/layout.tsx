import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

// Dealt type system: Bodoni Moda for display and the answer figure, Jost for everything else.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], weight: ["500"], style: ["normal"] });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Lydit: Binance liquidation price, held to Binance's answers", template: "%s | Lydit" },
  description:
    "A Binance USDⓈ-M liquidation gauge. No wrong number goes live: every update must reproduce Binance's own worked examples.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
