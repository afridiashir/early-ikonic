import type { Metadata } from "next";
import { Archivo, Caveat } from "next/font/google";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://early.ikonicdistro.com"),
  title: "IKONIC — More For Independent Artists | Join Early Access",
  description:
    "Ikonic is more than distribution. Distribution, publishing, funding and artist tools — all in one place. Join early access.",
  icons: { icon: "/favicon.png?v=2" },
  openGraph: {
    title: "IKONIC — More For Independent Artists",
    description:
      "Distribution, publishing, funding and artist tools — all in one place. Join early access.",
    url: "https://early.ikonicdistro.com",
    siteName: "IKONIC",
    images: ["/hero.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
