import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default:
      "Industrial Hardware & Machine Tools Supplier in Kolhapur | Industrial Prime System & Vijay Enterprises",
    template: "%s | Industrial Prime System & Vijay Enterprises",
  },
  description:
    "Industrial Prime System and Vijay Enterprises supply industrial hardware, machine tools, safety materials, material handling equipment, adhesives and industrial consumables from MIDC Shiroli, Kolhapur. Enquire on WhatsApp for price and availability.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  keywords: [
    "industrial hardware supplier Kolhapur",
    "machine tools supplier Kolhapur",
    "industrial products Kolhapur",
    "safety products Kolhapur",
    "adhesive supplier Kolhapur",
    "material handling products Kolhapur",
    "hardware distributor Kolhapur",
    "MIDC Shiroli industrial supplier",
  ],
  authors: [{ name: "Industrial Prime System & Vijay Enterprises" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Industrial Prime System & Vijay Enterprises",
    title: "Industrial Hardware & Machine Tool Solutions You Can Trust",
    description:
      "Industrial hardware, machine tools, safety materials, material handling equipment and adhesives supplied from MIDC Shiroli, Kolhapur.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0D1F37",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
