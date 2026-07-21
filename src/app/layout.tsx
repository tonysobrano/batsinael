import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getProjectsWithCovers } from "@/lib/images";

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
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-white">
        <Sidebar projects={projects} brands={brands} portraits={portraits} />
        <main className="flex-1 w-full px-6 pb-12 pt-24 md:ml-[180px] md:pb-16 md:pr-[52px] md:pt-[108px]">
          {children}
        </main>
      </body>
    </html>
  );
}
