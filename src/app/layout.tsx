import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
import "./globals.css";
import { site } from "@/site.config";
import { getWallItems } from "@/lib/content";
import Background from "@/components/Background";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const wall = getWallItems();
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <Preloader />
        <Background items={wall} />
        <ScrollProgress />
        <Cursor />
        <Header />
        {children}
      </body>
    </html>
  );
}
