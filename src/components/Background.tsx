import TiltedWall from "@/components/TiltedWall";
import type { WallItem } from "@/lib/types";

export default function Background({ items }: { items: WallItem[] }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <TiltedWall items={items} />
      {/* darkening + vignette so the artwork stays a mood, not a distraction */}
      <div className="absolute inset-0 bg-ink/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--ink)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink to-transparent" />
    </div>
  );
}
