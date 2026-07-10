import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getProjectsWithCovers } from "@/lib/images";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Batsinael | Photographer & Director of Photography",
  description: "Official portfolio of Batsinael Fekadu, Ethiopian Photographer and Director of Photography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = getProjectsWithCovers('img/projects').map(p => ({ name: p.name, path: p.path }));
  const brands = getProjectsWithCovers('img/brands').map(p => ({ name: p.name, path: p.path }));
  const portraits = getProjectsWithCovers('img/portraits').map(p => ({ name: p.name, path: p.path }));

  return (
    <html lang="en" className={`h-full antialiased ${inter.className}`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-white">
        <Sidebar projects={projects} brands={brands} portraits={portraits} />
        <main className="flex-1 w-full md:ml-[250px] p-6 pt-24 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
