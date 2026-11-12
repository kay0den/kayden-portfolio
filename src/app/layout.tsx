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
import Noise from "@/components/react-bits/Noise";
import ClickSpark from "@/components/react-bits/ClickSpark";

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
        <Noise opacity={0.07} fixed />
        <ScrollProgress />
        <ClickSpark sparkColor="#8fa2ff" sparkCount={10} sparkRadius={26} duration={650}>
          <Header />
          {children}
        </ClickSpark>
      </body>
    </html>
  );
}
