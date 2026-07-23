import type { Metadata } from "next";
import "./globals.css";
import { ScrollParallax } from "@/components/ScrollParallax";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Batsinael | Photographer & Director of Photography",
  description: "Official portfolio of Batsinael Fekadu, Ethiopian Photographer and Director of Photography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        suppressHydrationWarning
        className="min-h-full font-sans selection:bg-black selection:text-white"
      >
        <SiteHeader />
        <ScrollParallax />
        <main>{children}</main>
      </body>
    </html>
  );
}
