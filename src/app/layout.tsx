import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
