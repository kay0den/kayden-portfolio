"use client";
import { usePathname } from "next/navigation";
import TiltedWall from "@/components/TiltedWall";
import LightField from "@/components/LightField";
import type { WallItem } from "@/lib/types";

/**
 * Home: the tilted wall of works + a mouse light.
 * Every other page: a plain dark background, so opening a category has almost nothing else to load.
 */
export default function Background({ items }: { items: WallItem[] }) {
  const home = usePathname() === "/";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {home ? (
        <>
          <TiltedWall items={items} />
          <LightField />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(78,107,255,.16),transparent_60%)]" />
      )}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
    </div>
  );
}
